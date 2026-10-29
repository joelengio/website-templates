import { useSyncExternalStore } from 'react';
import { booking as cfg } from '../config/booking';
import { readJSON, writeJSON } from './storage';

export interface BookingRecord {
  id: string;
  reference: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  service: { kind: 'treatment' | 'package'; slug: string; name: string; optionLabel: string };
  staffId: string;
  staffName: string;
  staffPreference: string;
  date: string;
  time: string;
  durationMinutes: number;
  guests: number;
  total: number;
  customer: { name: string; email: string; phone: string; notes: string };
}

let cache: BookingRecord[] | null = null;
const listeners = new Set<() => void>();

const load = (): BookingRecord[] => {
  const raw = readJSON<unknown>(cfg.storageKey, []);
  return Array.isArray(raw) ? (raw as BookingRecord[]).filter((b) => b && typeof b.id === 'string') : [];
};

const emit = () => listeners.forEach((l) => l());

export const getBookings = (): BookingRecord[] => (cache ??= load());

const save = (next: BookingRecord[]) => {
  cache = next;
  writeJSON(cfg.storageKey, next);
  emit();
};

export const makeReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = 'SH-';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

export function addBooking(data: Omit<BookingRecord, 'id' | 'reference' | 'status' | 'createdAt'>): BookingRecord {
  const rec: BookingRecord = {
    ...data,
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
export const findBooking = (id: string) => getBookings().find((b) => b.id === id);
/** Test helper. */
export const resetBookingsCache = () => {
  cache = null;
  emit();
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === cfg.storageKey) {
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

export const useBookings = () => useSyncExternalStore(subscribe, getBookings, () => []);
