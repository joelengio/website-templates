import { bookingSettings } from '../config/booking';
import { classes } from '../config/classes';
import type { ClassSession } from '../config/types';
import { addMinutes, isoDate, parseIso, toMinutes } from './format';

/** Monday = 0 … Sunday = 6 */
export const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7;

export const addDays = (d: Date, n: number) => {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  return r;
};

export const startOfWeek = (d: Date) => addDays(d, -weekdayIndex(d));

/** The seven dates (Mon–Sun) of the week `offset` weeks from the week containing `today`. */
export const weekDates = (today: Date, offset: number): string[] => {
  const mon = addDays(startOfWeek(today), offset * 7);
  return Array.from({ length: 7 }, (_, i) => isoDate(addDays(mon, i)));
};

export const sessionsOn = (dateIso: string, list: ClassSession[] = classes) =>
  list.filter((c) => c.day === weekdayIndex(parseIso(dateIso))).sort((a, b) => a.start.localeCompare(b.start));

/** Deterministic pseudo-random 0–1 from a string, so demo occupancy is stable between visits. */
export const hash01 = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
};

/** Simulated number of places already taken by other (fictional) members. */
export const demoTaken = (session: ClassSession, dateIso: string) => {
  const { min, max } = bookingSettings.demoOccupancy;
  const pct = min + (max - min) * hash01(`${session.id}|${dateIso}`);
  return Math.min(session.capacity, Math.round(session.capacity * pct));
};

export interface Availability {
  taken: number;
  left: number;
  full: boolean;
  closed: boolean;
}

/** Whether booking is still open: not already past the cut-off time. */
export const isClosed = (session: ClassSession, dateIso: string, now: Date) => {
  const [y, m, d] = dateIso.split('-').map(Number);
  const [hh, mm] = session.start.split(':').map(Number);
  const start = new Date(y, m - 1, d, hh, mm);
  return now.getTime() > start.getTime() - bookingSettings.cutoffMinutes * 60_000;
};

export const availability = (session: ClassSession, dateIso: string, now: Date, userHasBooking: boolean): Availability => {
  const taken = Math.min(session.capacity, demoTaken(session, dateIso) + (userHasBooking ? 1 : 0));
  return { taken, left: session.capacity - taken, full: taken >= session.capacity, closed: isClosed(session, dateIso, now) };
};

export const overlaps = (aStart: string, aDur: number, bStart: string, bDur: number) =>
  toMinutes(aStart) < toMinutes(addMinutes(bStart, bDur)) && toMinutes(bStart) < toMinutes(addMinutes(aStart, aDur));

/** Furthest bookable date, inclusive. */
export const lastBookableDate = (today: Date) => isoDate(addDays(startOfWeek(today), bookingSettings.weeksAhead * 7 - 1));
