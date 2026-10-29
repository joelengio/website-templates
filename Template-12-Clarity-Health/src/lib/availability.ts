import { booking as cfg } from '../config/booking';
import { site } from '../config/site';
import type { BusinessDay, Doctor } from '../config/types';
import { parseISODate, pad, toISODate } from './format';
import type { BookingRecord } from './bookings';

export const toMinutes = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
};
export const minutesToHM = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

/** Deterministic 0–1 hash so demonstration availability is stable between renders and reloads. */
export function hash01(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export const hoursFor = (iso: string): BusinessDay | undefined => site.hours.find((h) => h.day === parseISODate(iso).getDay());

export const isOpenDate = (iso: string) => {
  const h = hoursFor(iso);
  return !!h && !!h.open && !!h.close && !cfg.closedDates.includes(iso);
};

/** First and last bookable ISO dates for the given "now". */
export function bookingWindow(now: Date = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + cfg.leadDays);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + cfg.windowDays - 1);
  return { start, end, startISO: toISODate(start), endISO: toISODate(end) };
}

export const inWindow = (iso: string, now: Date = new Date()) => {
  const w = bookingWindow(now);
  return iso >= w.startISO && iso <= w.endISO;
};

export interface Slot {
  time: string;
  available: boolean;
}

const overlaps = (aStart: number, aLen: number, bStart: number, bLen: number) => aStart < bStart + bLen && bStart < aStart + aLen;

export function doctorIsFree(doc: Doctor, iso: string, start: number, length: number, bookings: BookingRecord[], ignoreId?: string): boolean {
  if (!doc.workingDays.includes(parseISODate(iso).getDay())) return false;
  if (hash01(`${iso}|${doc.id}|${start}`) < cfg.demoBusyRatio) return false;
  return !bookings.some(
    (b) => b.status === 'confirmed' && b.id !== ignoreId && b.date === iso && b.doctorId === doc.id && overlaps(start, length, toMinutes(b.time), b.durationMinutes)
  );
}

export interface SlotQuery {
  iso: string;
  durationMinutes: number;
  pool: Doctor[];
  bookings: BookingRecord[];
  ignoreBookingId?: string;
  now?: Date;
}

export function getSlots({ iso, durationMinutes, pool, bookings, ignoreBookingId, now = new Date() }: SlotQuery): Slot[] {
  const hours = hoursFor(iso);
  if (!hours?.open || !hours.close || !isOpenDate(iso) || !inWindow(iso, now)) return [];
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const slots: Slot[] = [];
  for (let t = open; t + durationMinutes <= close; t += cfg.slotIntervalMinutes) {
    slots.push({ time: minutesToHM(t), available: pool.some((d) => doctorIsFree(d, iso, t, durationMinutes, bookings, ignoreBookingId)) });
  }
  return slots;
}

export const hasAvailability = (q: SlotQuery) => getSlots(q).some((s) => s.available);

/** First doctor in the pool (stable order) who is free at the chosen time. */
export function resolveDoctor(pool: Doctor[], iso: string, time: string, durationMinutes: number, bookings: BookingRecord[], ignoreId?: string): Doctor | undefined {
  return pool.find((d) => doctorIsFree(d, iso, toMinutes(time), durationMinutes, bookings, ignoreId));
}
