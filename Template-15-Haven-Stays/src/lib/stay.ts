import { booking } from '../config/booking';
import { rooms } from '../config/rooms';
import type { Room } from '../config/types';
import { availability, type StoredReservationLike } from './availability';
import { addDays, diffDays, isValidISO, todayISO } from './dates';
import { validateGuests } from './validation';

export const today = () => todayISO(booking.demoToday);

export interface StayParams {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  room: string;
  plan: string;
  promo: string;
}

const int = (v: string | null, d: number, min: number, max: number) => {
  const n = Number(v);
  return v !== null && v !== '' && Number.isInteger(n) ? Math.min(max, Math.max(min, n)) : d;
};

/** Parse booking parameters from the URL, ignoring anything malformed rather than throwing. */
export function readStay(sp: URLSearchParams): StayParams {
  const inn = sp.get('in');
  const out = sp.get('out');
  return {
    checkIn: isValidISO(inn) ? inn : '',
    checkOut: isValidISO(out) ? out : '',
    adults: int(sp.get('adults'), booking.defaultAdults, 1, 8),
    children: int(sp.get('children'), booking.defaultChildren, 0, 6),
    room: sp.get('room') ?? '',
    plan: sp.get('plan') ?? '',
    promo: (sp.get('promo') ?? '').slice(0, 24),
  };
}

export function writeStay(p: Partial<StayParams>): URLSearchParams {
  const sp = new URLSearchParams();
  if (p.checkIn) sp.set('in', p.checkIn);
  if (p.checkOut) sp.set('out', p.checkOut);
  if (p.adults !== undefined) sp.set('adults', String(p.adults));
  if (p.children !== undefined) sp.set('children', String(p.children));
  if (p.room) sp.set('room', p.room);
  if (p.plan) sp.set('plan', p.plan);
  if (p.promo) sp.set('promo', p.promo);
  return sp;
}

export function roomFits(room: Room, adults: number, children: number) {
  const errs = validateGuests(adults, children, room);
  return { fits: errs.length === 0, reason: errs[0]?.message };
}

/** Closest check-in date (within ±21 days of the requested one) on which at least one fitting room is free for the same number of nights. */
export function nearestAvailableStart(checkIn: string, checkOut: string, adults: number, children: number, reservations: StoredReservationLike[], list: Room[] = rooms): string | null {
  const nights = diffDays(checkIn, checkOut);
  if (nights < 1) return null;
  const t = today();
  for (let d = 1; d <= 21; d++) {
    for (const sign of [1, -1]) {
      const start = addDays(checkIn, d * sign);
      if (start < t) continue;
      const end = addDays(start, nights);
      if (list.some((r) => r.units > 0 && roomFits(r, adults, children).fits && availability(r, start, end, reservations).available)) return start;
    }
  }
  return null;
}
