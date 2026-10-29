import { booking as bookingDefaults, seasons as seasonDefaults } from '../config/booking';
import type { Room, Season } from '../config/types';
import { nightsBetween, diffDays } from './dates';
import { seasonFor } from './pricing';

export interface StoredReservationLike {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'cancelled';
}

/** Deterministic 32-bit string hash (FNV-1a). */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Units of `room` that the *simulation* treats as already booked on the night of `date`. Never real data. */
export function simulatedBooked(room: Room, date: string, seasons: Season[] = seasonDefaults, enabled = bookingDefaults.simulateAvailability): number {
  if (!enabled) return 0;
  const occ = seasonFor(date, seasons).occupancy;
  let booked = 0;
  for (let u = 0; u < room.units; u++) if (hash(`${room.id}|${date}|${u}`) % 100 < occ) booked++;
  return booked;
}

export interface NightAvailability {
  date: string;
  left: number;
}

export function unitsLeft(room: Room, date: string, reservations: StoredReservationLike[] = [], excludeId?: string, seasons: Season[] = seasonDefaults, enabled = bookingDefaults.simulateAvailability): number {
  const local = reservations.filter((r) => r.status === 'confirmed' && r.id !== excludeId && r.roomId === room.id && r.checkIn <= date && date < r.checkOut).length;
  return Math.max(0, room.units - simulatedBooked(room, date, seasons, enabled) - local);
}

export interface Availability {
  available: boolean;
  /** Smallest number of rooms free on any night of the stay. */
  left: number;
  nights: NightAvailability[];
  firstSoldOut?: string;
}

export function availability(room: Room, checkIn: string, checkOut: string, reservations: StoredReservationLike[] = [], excludeId?: string, seasons: Season[] = seasonDefaults, enabled = bookingDefaults.simulateAvailability): Availability {
  const dates = diffDays(checkIn, checkOut) > 0 ? nightsBetween(checkIn, checkOut) : [];
  const nights = dates.map((date) => ({ date, left: unitsLeft(room, date, reservations, excludeId, seasons, enabled) }));
  const left = nights.length ? Math.min(...nights.map((n) => n.left)) : 0;
  return { available: nights.length > 0 && left > 0, left, nights, firstSoldOut: nights.find((n) => n.left === 0)?.date };
}
