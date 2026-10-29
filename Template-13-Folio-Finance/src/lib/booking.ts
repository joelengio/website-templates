import { booking as cfg } from '../config/booking';
import { parseISODate, toISODate } from './format';
import { readJSON, writeJSON } from './storage';
import { validateEmail, validateMessage, validateName, validatePhone, hasErrors, type Errors } from './validation';

export interface Appointment {
  id: string;
  reference: string;
  serviceSlug: string;
  typeId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number;
  name: string;
  email: string;
  phone: string;
  note: string;
  createdAt: string;
}

export interface Slot {
  time: string;
  available: boolean;
  reason?: 'busy' | 'booked' | 'past';
}

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const fromMinutes = (mins: number): string => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export interface DateRange {
  min: Date;
  max: Date;
}
export function bookableRange(now: Date = new Date()): DateRange {
  const today = startOfDay(now);
  return { min: addDays(today, cfg.minDaysAhead), max: addDays(today, cfg.maxDaysAhead) };
}

export function isBookableDate(date: Date, now: Date = new Date()): boolean {
  const { min, max } = bookableRange(now);
  const d = startOfDay(date);
  return d >= min && d <= max && cfg.openWeekdays.includes(d.getDay());
}

/** Small deterministic string hash → [0, 1). Used for stable "demo busy" slots. */
export function hash01(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/** All start times in the day grid that fit the given duration (before demo-busy / booking filters). */
export function dayGrid(duration: number): string[] {
  const start = toMinutes(cfg.dayStart);
  const end = toMinutes(cfg.dayEnd);
  const bs = cfg.breakStart ? toMinutes(cfg.breakStart) : -1;
  const be = cfg.breakEnd ? toMinutes(cfg.breakEnd) : -1;
  const out: string[] = [];
  for (let t = start; t + duration <= end; t += cfg.slotStepMinutes) {
    const overlapsBreak = bs >= 0 && t < be && t + duration > bs;
    if (!overlapsBreak) out.push(fromMinutes(t));
  }
  return out;
}

export function slotsForDate(dateISO: string, duration: number, existing: Appointment[], now: Date = new Date()): Slot[] {
  const date = parseISODate(dateISO);
  if (!isBookableDate(date, now)) return [];
  return dayGrid(duration).map((time) => {
    const s = toMinutes(time);
    const clash = existing.some((a) => a.date === dateISO && s < toMinutes(a.time) + a.duration && s + duration > toMinutes(a.time));
    if (clash) return { time, available: false, reason: 'booked' as const };
    if (hash01(`${dateISO}T${time}`) < cfg.demoBusyRatio) return { time, available: false, reason: 'busy' as const };
    return { time, available: true };
  });
}

export function availableCount(dateISO: string, duration: number, existing: Appointment[], now: Date = new Date()): number {
  return slotsForDate(dateISO, duration, existing, now).filter((s) => s.available).length;
}

/* ---- persistence ------------------------------------------------- */

const STORE = 'appointments';

function isAppointment(x: unknown): x is Appointment {
  if (!x || typeof x !== 'object') return false;
  const a = x as Record<string, unknown>;
  return ['id', 'reference', 'serviceSlug', 'typeId', 'date', 'time', 'name', 'email', 'createdAt'].every((k) => typeof a[k] === 'string') && typeof a.duration === 'number';
}

export function loadAppointments(): Appointment[] {
  const raw = readJSON<unknown>(STORE, []);
  return Array.isArray(raw) ? raw.filter(isAppointment).map((a) => ({ ...a, phone: a.phone ?? '', note: a.note ?? '' })) : [];
}

export function saveAppointment(a: Appointment): Appointment[] {
  const next = [...loadAppointments().filter((x) => x.id !== a.id), a].sort((x, y) => `${x.date}${x.time}`.localeCompare(`${y.date}${y.time}`));
  writeJSON(STORE, next);
  return next;
}

export function cancelAppointment(id: string): Appointment[] {
  const next = loadAppointments().filter((a) => a.id !== id);
  writeJSON(STORE, next);
  return next;
}

export function newReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `FF-${s}`;
}

/* ---- validation -------------------------------------------------- */

export type DetailFields = 'name' | 'email' | 'phone' | 'note' | 'consent';

export function validateDetails(d: { name: string; email: string; phone: string; note: string; consent: boolean }): Errors<DetailFields> {
  const errors: Errors<DetailFields> = {
    name: validateName(d.name),
    email: validateEmail(d.email),
    phone: validatePhone(d.phone),
    note: validateMessage(d.note, { max: cfg.maxNoteLength, required: false, label: 'note' }),
    consent: d.consent ? undefined : 'Please confirm you understand this is a demonstration booking.',
  };
  return hasErrors(errors) ? errors : {};
}

export { toISODate };
