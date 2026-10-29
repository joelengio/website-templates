import { useSyncExternalStore } from 'react';
import { booking as cfg } from '../config/booking';
import { readJSON, writeJSON } from './storage';
import { normalizeEmail } from './validation';
import { toMinutes } from './availability';
import { toISODate, formatDate, formatTime } from './format';
import type { ConsultMode } from '../config/types';

export interface BookingRecord {
  id: string;
  reference: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  specialtyId: string;
  doctorId: string;
  doctorPreference: 'chosen' | 'any';
  serviceId: string;
  mode: ConsultMode;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  /** Basic contact details only — never medical, insurance or identity information. */
  contact: { name: string; email: string; phone: string };
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const HM = /^\d{2}:\d{2}$/;
const isRecord = (b: unknown): b is BookingRecord => {
  const r = b as Partial<BookingRecord> | null;
  return (
    !!r &&
    typeof r.id === 'string' &&
    typeof r.reference === 'string' &&
    (r.status === 'confirmed' || r.status === 'cancelled') &&
    typeof r.date === 'string' && ISO.test(r.date) &&
    typeof r.time === 'string' && HM.test(r.time) &&
    typeof r.durationMinutes === 'number' &&
    typeof r.doctorId === 'string' &&
    typeof r.serviceId === 'string' &&
    typeof r.specialtyId === 'string' &&
    !!r.contact && typeof r.contact.name === 'string' && typeof r.contact.email === 'string'
  );
};

let cache: BookingRecord[] | null = null;
let persistFailed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const load = (): BookingRecord[] => {
  const raw = readJSON<unknown>(cfg.storageKey, []);
  return Array.isArray(raw) ? raw.filter(isRecord) : [];
};

export const getBookings = (): BookingRecord[] => (cache ??= load());
/** True when the browser refused to save (private mode, blocked storage, quota) — bookings then live in memory only. */
export const storageUnavailable = () => persistFailed;

function save(next: BookingRecord[]) {
  cache = next;
  persistFailed = !writeJSON(cfg.storageKey, next);
  emit();
}

export const makeReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = cfg.referencePrefix;
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

export type NewBooking = Omit<BookingRecord, 'id' | 'reference' | 'status' | 'createdAt' | 'updatedAt'>;

export function addBooking(data: NewBooking): BookingRecord {
  const rec: BookingRecord = {
    ...data,
    contact: { ...data.contact, name: data.contact.name.trim(), email: data.contact.email.trim(), phone: data.contact.phone.trim() },
    id: `bk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    reference: makeReference(),
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  save([rec, ...getBookings()]);
  return rec;
}

export function updateBooking(id: string, patch: Partial<BookingRecord>) {
  save(getBookings().map((b) => (b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b)));
}

export const cancelBooking = (id: string) => updateBooking(id, { status: 'cancelled' });
export const deleteBooking = (id: string) => save(getBookings().filter((b) => b.id !== id));
export const clearAllBookings = () => save([]);
export const findBooking = (id: string) => getBookings().find((b) => b.id === id);

/** Test helper: forget the in-memory cache so the next read hits localStorage again. */
export const resetBookingsCache = () => {
  cache = null;
  persistFailed = false;
  emit();
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === cfg.storageKey || e.key === null) {
      cache = null;
      cb();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
};

export const useBookings = () => useSyncExternalStore(subscribe, getBookings, () => [] as BookingRecord[]);

/** Upcoming (today or later) confirmed demo appointments. */
export const isActive = (b: BookingRecord, now: Date = new Date()) => b.status === 'confirmed' && b.date >= toISODate(now);

export interface DraftSlot {
  date: string;
  time: string;
  durationMinutes: number;
  serviceId: string;
  email: string;
}

/**
 * Duplicate-booking prevention. Returns a user-facing message when the draft would clash with an existing confirmed
 * appointment for the same e-mail address, or null when it is fine.
 */
export function findConflict(draft: DraftSlot, bookings: BookingRecord[], opts: { ignoreId?: string; now?: Date; isNew?: boolean } = {}): string | null {
  const email = normalizeEmail(draft.email);
  const mine = bookings.filter((b) => b.id !== opts.ignoreId && isActive(b, opts.now) && normalizeEmail(b.contact.email) === email);
  const start = toMinutes(draft.time);
  for (const b of mine) {
    if (b.date !== draft.date) continue;
    const bs = toMinutes(b.time);
    if (start < bs + b.durationMinutes && bs < start + draft.durationMinutes)
      return `You already have a demo appointment on ${formatDate(b.date, { weekday: 'long', day: 'numeric', month: 'long' })} at ${formatTime(b.time)} that overlaps this time (reference ${b.reference}). Choose a different time or manage that appointment first.`;
    if (b.serviceId === draft.serviceId)
      return `You already have this service booked on that day (reference ${b.reference}). Choose another day, or reschedule the existing appointment.`;
  }
  if (opts.isNew && mine.length >= cfg.maxActivePerEmail)
    return `This demonstration allows up to ${cfg.maxActivePerEmail} upcoming appointments per e-mail address. Cancel one to book another.`;
  return null;
}
