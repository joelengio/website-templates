import { useSyncExternalStore } from 'react';
import { reservationSettings } from '../config/reservations';
import type { ReservationSettings } from '../config/types';
import { readJson, writeJson } from './storage';
import { validateBooking, type BookingInput, type Reservation } from './reservations';
import { isDateKey, toDateKey } from './dates';
import type { Errors } from './validation';

export const RESERVATIONS_KEY = 'saffron-table:reservations:v1';

export type StoreResult = { ok: true; reservation: Reservation } | { ok: false; errors: Errors };

interface Backing {
  read: () => Reservation[];
  write: (list: Reservation[]) => void;
}

const localBacking: Backing = {
  read: () => {
    const raw = readJson<unknown>(RESERVATIONS_KEY, []);
    return Array.isArray(raw) ? raw.filter(isReservation) : [];
  },
  write: (list) => writeJson(RESERVATIONS_KEY, list),
};

export function isReservation(v: unknown): v is Reservation {
  if (!v || typeof v !== 'object') return false;
  const r = v as Reservation;
  return (
    typeof r.id === 'string' && typeof r.code === 'string' && (r.status === 'confirmed' || r.status === 'cancelled') &&
    typeof r.dateKey === 'string' && isDateKey(r.dateKey) && typeof r.time === 'string' && typeof r.party === 'number' &&
    typeof r.areaId === 'string' && !!r.guest && typeof r.guest.email === 'string'
  );
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function makeCode(rng: () => number = Math.random): string {
  let s = 'ST-';
  for (let i = 0; i < 6; i++) s += CODE_CHARS[Math.floor(rng() * CODE_CHARS.length)];
  return s;
}

export function createReservationStore(backing: Backing, settings: ReservationSettings = reservationSettings, rng: () => number = Math.random) {
  let list = backing.read();
  const listeners = new Set<() => void>();
  const commit = (next: Reservation[]) => {
    list = next;
    backing.write(list);
    listeners.forEach((l) => l());
  };

  const uniqueCode = () => {
    let code = makeCode(rng);
    while (list.some((r) => r.code === code)) code = makeCode(rng);
    return code;
  };

  return {
    getSnapshot: () => list,
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    /** Re-read persistent storage (used after another tab changes it). */
    refresh: () => {
      list = backing.read();
      listeners.forEach((l) => l());
    },
    create(input: BookingInput, now: Date = new Date()): StoreResult {
      const { errors, areaId } = validateBooking(input, { settings, reservations: list, now });
      if (Object.keys(errors).length || !areaId) return { ok: false, errors };
      const stamp = now.toISOString();
      const reservation: Reservation = {
        id: `${now.getTime().toString(36)}-${Math.floor(rng() * 1e6).toString(36)}`,
        code: uniqueCode(),
        status: 'confirmed',
        ...input,
        guest: { name: input.guest.name.trim(), email: input.guest.email.trim(), phone: input.guest.phone.trim() },
        note: input.note.trim(),
        areaId,
        createdAt: stamp,
        updatedAt: stamp,
      };
      commit([...list, reservation]);
      return { ok: true, reservation };
    },
    update(id: string, input: BookingInput, now: Date = new Date()): StoreResult {
      const current = list.find((r) => r.id === id);
      if (!current) return { ok: false, errors: { form: 'That reservation could not be found.' } };
      if (current.status === 'cancelled') return { ok: false, errors: { form: 'Cancelled reservations cannot be modified. Please book again.' } };
      if (current.dateKey < toDateKey(now)) return { ok: false, errors: { form: 'Past reservations cannot be modified.' } };
      const { errors, areaId } = validateBooking(input, { settings, reservations: list, now, excludeId: id });
      if (Object.keys(errors).length || !areaId) return { ok: false, errors };
      const reservation: Reservation = {
        ...current,
        ...input,
        guest: { name: input.guest.name.trim(), email: input.guest.email.trim(), phone: input.guest.phone.trim() },
        note: input.note.trim(),
        areaId,
        updatedAt: now.toISOString(),
      };
      commit(list.map((r) => (r.id === id ? reservation : r)));
      return { ok: true, reservation };
    },
    cancel(id: string, now: Date = new Date()): StoreResult {
      const current = list.find((r) => r.id === id);
      if (!current) return { ok: false, errors: { form: 'That reservation could not be found.' } };
      if (current.status === 'cancelled') return { ok: false, errors: { form: 'That reservation is already cancelled.' } };
      if (current.dateKey < toDateKey(now)) return { ok: false, errors: { form: 'Past reservations cannot be cancelled.' } };
      const reservation: Reservation = { ...current, status: 'cancelled', cancelledAt: now.toISOString(), updatedAt: now.toISOString() };
      commit(list.map((r) => (r.id === id ? reservation : r)));
      return { ok: true, reservation };
    },
    remove(id: string) {
      commit(list.filter((r) => r.id !== id));
    },
    clear() {
      commit([]);
    },
  };
}

export const reservationStore = createReservationStore(localBacking);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === RESERVATIONS_KEY) reservationStore.refresh();
  });
}

export const useReservations = (): Reservation[] =>
  useSyncExternalStore(reservationStore.subscribe, reservationStore.getSnapshot, reservationStore.getSnapshot);
