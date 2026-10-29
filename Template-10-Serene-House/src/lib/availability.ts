import { booking as cfg } from '../config/booking';
import { site } from '../config/site';
import { staff as allStaff } from '../config/staff';
import type { BusinessDay, StaffMember } from '../config/types';
import { toISODate, parseISODate } from './format';
import type { BookingRecord } from './bookings';

export const toMinutes = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
};
export const minutesToHM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Deterministic 0–1 hash so demo availability is stable between renders. */
export function hash01(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export const hoursFor = (iso: string): BusinessDay | undefined => {
  const day = parseISODate(iso).getDay();
  return site.hours.find((h) => h.day === day);
};

export const isOpenDate = (iso: string) => {
  const h = hoursFor(iso);
  return !!h && !!h.open && !!h.close && !cfg.closedDates.includes(iso);
};

export interface BookableDate {
  iso: string;
  open: boolean;
}

export function bookableDates(now: Date = new Date()): BookableDate[] {
  const out: BookableDate[] = [];
  for (let i = cfg.leadDays; i < cfg.leadDays + cfg.windowDays; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const iso = toISODate(d);
    out.push({ iso, open: isOpenDate(iso) });
  }
  return out;
}

export interface Slot {
  time: string;
  available: boolean;
}

export const overlaps = (aStart: number, aLen: number, bStart: number, bLen: number) => aStart < bStart + bLen && bStart < aStart + aLen;

export function staffIsFree(
  member: StaffMember,
  iso: string,
  start: number,
  length: number,
  bookings: BookingRecord[],
  ignoreId?: string
) {
  if (!member.workingDays.includes(parseISODate(iso).getDay())) return false;
  if (hash01(`${iso}|${member.id}|${start}`) < cfg.demoBusyRatio) return false;
  return !bookings.some(
    (b) =>
      b.status === 'confirmed' &&
      b.id !== ignoreId &&
      b.date === iso &&
      b.staffId === member.id &&
      overlaps(start, length, toMinutes(b.time), b.durationMinutes)
  );
}

export interface SlotQuery {
  iso: string;
  durationMinutes: number;
  /** Eligible therapists. */
  pool: StaffMember[];
  bookings: BookingRecord[];
  ignoreBookingId?: string;
  now?: Date;
}

export function getSlots({ iso, durationMinutes, pool, bookings, ignoreBookingId, now = new Date() }: SlotQuery): Slot[] {
  const hours = hoursFor(iso);
  if (!hours || !hours.open || !hours.close || !isOpenDate(iso)) return [];
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const slots: Slot[] = [];
  const isToday = iso === toISODate(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (let t = open; t + durationMinutes <= close; t += cfg.slotIntervalMinutes) {
    const inPast = isToday && t <= nowMin;
    const available = !inPast && pool.some((m) => staffIsFree(m, iso, t, durationMinutes, bookings, ignoreBookingId));
    slots.push({ time: minutesToHM(t), available });
  }
  return slots;
}

/** First therapist from the pool who is free for the chosen slot. */
export function resolveStaff(pool: StaffMember[], iso: string, time: string, durationMinutes: number, bookings: BookingRecord[], ignoreId?: string) {
  return pool.find((m) => staffIsFree(m, iso, toMinutes(time), durationMinutes, bookings, ignoreId));
}

export const staffById = (id: string) => allStaff.find((s) => s.id === id);
