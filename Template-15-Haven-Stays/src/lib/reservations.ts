import { booking as bookingConfig, ratePlans } from '../config/booking';
import { rooms as roomList } from '../config/rooms';
import type { Room } from '../config/types';
import { availability } from './availability';
import { addDays, diffDays, todayISO } from './dates';
import { defaultPricingConfig, quote, type PriceRequest, type PricingConfig, type Quote } from './pricing';
import { validateGuest, validateStay, defaultLimits, type GuestDetails, type StayError } from './validation';

export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guest: GuestDetails;
  promoCode?: string;
  /** Price breakdown frozen at booking time. */
  quote: Quote;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  modifiedAt?: string;
  cancelledAt?: string;
  /** Illustrative late-cancellation amount in cents (nothing is actually charged). */
  cancellationFee?: number;
  history: { at: string; event: string }[];
}

export type ReservationResult<T = Reservation> = { ok: true; value: T } | { ok: false; code: string; message: string; errors?: StayError[] };

export interface Storage {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

/** In-memory fallback so the demo still works when localStorage is blocked. */
const memory = new Map<string, string>();
export const memoryStorage: Storage = { getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => void memory.set(k, v) };

function defaultStorage(): Storage {
  try {
    const s = window.localStorage;
    s.setItem('__haven_probe', '1');
    s.removeItem('__haven_probe');
    return s;
  } catch {
    return memoryStorage;
  }
}

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: { raw: string | null; list: Reservation[] } | null = null;

export class ReservationStore {
  constructor(private storage: () => Storage = defaultStorage, private key = bookingConfig.storageKey, private cfg: PricingConfig = defaultPricingConfig, private rooms: Room[] = roomList) {}

  list(): Reservation[] {
    const raw = this.storage().getItem(this.key);
    if (cache && cache.raw === raw) return cache.list;
    let list: Reservation[] = [];
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      list = Array.isArray(parsed) ? parsed.filter((r) => r && typeof r.id === 'string' && r.quote && r.guest) : [];
    } catch {
      list = [];
    }
    cache = { raw, list };
    return list;
  }

  private save(list: Reservation[]) {
    this.storage().setItem(this.key, JSON.stringify(list));
    cache = null;
    listeners.forEach((l) => l());
  }

  get(id: string) {
    return this.list().find((r) => r.id.toLowerCase() === id.trim().toLowerCase());
  }

  /** Create a reservation after re-validating everything (never trust the UI). */
  create(input: { roomId: string; ratePlanId: string; checkIn: string; checkOut: string; adults: number; children: number; guest: GuestDetails; promoCode?: string }, now = new Date()): ReservationResult {
    const today = todayISO(bookingConfig.demoToday);
    const room = this.rooms.find((r) => r.id === input.roomId);
    if (!room) return { ok: false, code: 'ROOM', message: 'That room type does not exist.' };
    if (!this.cfg.ratePlans.some((p) => p.id === input.ratePlanId)) return { ok: false, code: 'PLAN', message: 'That rate plan is not available.' };
    const errors = validateStay(input, defaultLimits(today), room);
    if (errors.length) return { ok: false, code: errors[0].code, message: errors[0].message, errors };
    const guestErrors = validateGuest(input.guest);
    if (Object.keys(guestErrors).length) return { ok: false, code: 'GUEST', message: 'Please complete the guest details.' };
    const list = this.list();
    const email = input.guest.email.trim().toLowerCase();
    const dup = list.find((r) => r.status === 'confirmed' && r.guest.email.trim().toLowerCase() === email && r.roomId === input.roomId && r.checkIn < input.checkOut && input.checkIn < r.checkOut);
    if (dup) return { ok: false, code: 'DUPLICATE', message: `A reservation (${dup.id}) already exists for ${dup.roomName} on overlapping dates under this email.` };
    const avail = availability(room, input.checkIn, input.checkOut, list);
    if (!avail.available) return { ok: false, code: 'UNAVAILABLE', message: 'Sorry — that room is no longer available (simulated) for those dates.' };
    const q = quote({ room, ratePlanId: input.ratePlanId, checkIn: input.checkIn, checkOut: input.checkOut, adults: input.adults, children: input.children, promoCode: input.promoCode, today }, this.cfg);
    const stamp = now.toISOString();
    const reservation: Reservation = {
      id: newId(list),
      roomId: room.id,
      roomName: room.name,
      ratePlanId: input.ratePlanId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      adults: input.adults,
      children: input.children,
      guest: { ...input.guest, firstName: input.guest.firstName.trim(), lastName: input.guest.lastName.trim(), email: input.guest.email.trim(), phone: input.guest.phone.trim() },
      promoCode: q.discount?.code,
      quote: q,
      status: 'confirmed',
      createdAt: stamp,
      history: [{ at: stamp, event: 'Demonstration reservation created' }],
    };
    this.save([reservation, ...list]);
    return { ok: true, value: reservation };
  }

  /** Change dates / party / plan / room. Re-prices and re-checks availability, ignoring the reservation itself. */
  change(id: string, patch: Partial<Pick<Reservation, 'checkIn' | 'checkOut' | 'adults' | 'children' | 'ratePlanId' | 'roomId'>>, now = new Date()): ReservationResult {
    const list = this.list();
    const current = list.find((r) => r.id === id);
    if (!current) return { ok: false, code: 'NOT_FOUND', message: 'Reservation not found.' };
    if (current.status !== 'confirmed') return { ok: false, code: 'CANCELLED', message: 'Cancelled reservations cannot be changed.' };
    const today = todayISO(bookingConfig.demoToday);
    if (current.checkIn <= today) return { ok: false, code: 'STARTED', message: 'Reservations cannot be changed on or after the arrival date.' };
    const plan = this.cfg.ratePlans.find((p) => p.id === (patch.ratePlanId ?? current.ratePlanId));
    if (!plan) return { ok: false, code: 'PLAN', message: 'That rate plan is not available.' };
    if (plan.freeCancelDays === null && (patch.checkIn || patch.checkOut || patch.roomId) && plan.id === current.ratePlanId) return { ok: false, code: 'NON_REFUNDABLE', message: 'Non-refundable rates cannot be changed (illustrative policy). Cancel and rebook instead.' };
    const next = { ...current, ...patch };
    const room = this.rooms.find((r) => r.id === next.roomId);
    if (!room) return { ok: false, code: 'ROOM', message: 'That room type does not exist.' };
    const errors = validateStay(next, defaultLimits(today), room);
    if (errors.length) return { ok: false, code: errors[0].code, message: errors[0].message, errors };
    const avail = availability(room, next.checkIn, next.checkOut, list, id);
    if (!avail.available) return { ok: false, code: 'UNAVAILABLE', message: 'Those dates are not available (simulated) for this room.' };
    const q = quote({ room, ratePlanId: next.ratePlanId, checkIn: next.checkIn, checkOut: next.checkOut, adults: next.adults, children: next.children, promoCode: current.promoCode, today }, this.cfg);
    const stamp = now.toISOString();
    const diff = q.total - current.quote.total;
    const updated: Reservation = {
      ...next,
      roomName: room.name,
      quote: q,
      modifiedAt: stamp,
      history: [...current.history, { at: stamp, event: `Changed — new total differs by ${diff >= 0 ? '+' : '−'}${(Math.abs(diff) / 100).toFixed(2)}` }],
    };
    this.save(list.map((r) => (r.id === id ? updated : r)));
    return { ok: true, value: updated };
  }

  /** Cancel and compute the illustrative cancellation charge from the rate plan. */
  cancel(id: string, now = new Date()): ReservationResult {
    const list = this.list();
    const current = list.find((r) => r.id === id);
    if (!current) return { ok: false, code: 'NOT_FOUND', message: 'Reservation not found.' };
    if (current.status === 'cancelled') return { ok: false, code: 'CANCELLED', message: 'This reservation is already cancelled.' };
    const today = todayISO(bookingConfig.demoToday);
    const fee = cancellationFee(current, today);
    const stamp = now.toISOString();
    const updated: Reservation = {
      ...current,
      status: 'cancelled',
      cancelledAt: stamp,
      cancellationFee: fee,
      history: [...current.history, { at: stamp, event: fee ? `Cancelled — illustrative late-cancellation charge ${(fee / 100).toFixed(2)}` : 'Cancelled — no charge' }],
    };
    this.save(list.map((r) => (r.id === id ? updated : r)));
    return { ok: true, value: updated };
  }

  remove(id: string) {
    this.save(this.list().filter((r) => r.id !== id));
  }

  clear() {
    this.save([]);
  }
}

export function cancellationFee(r: Pick<Reservation, 'ratePlanId' | 'checkIn' | 'quote'>, today: string, plans = ratePlans): number {
  const plan = plans.find((p) => p.id === r.ratePlanId);
  if (!plan) return 0;
  if (plan.freeCancelDays !== null && diffDays(today, r.checkIn) >= plan.freeCancelDays) return 0;
  if (plan.lateCancelNights === 'all') return r.quote.total;
  const nights = r.quote.nightly.slice(0, plan.lateCancelNights);
  return nights.reduce((s, n) => s + n.rate, 0);
}

/** Free-cancellation deadline (ISO date) or null for non-refundable. */
export function freeCancelBy(r: Pick<Reservation, 'ratePlanId' | 'checkIn'>, plans = ratePlans): string | null {
  const plan = plans.find((p) => p.id === r.ratePlanId);
  return plan && plan.freeCancelDays !== null ? addDays(r.checkIn, -plan.freeCancelDays) : null;
}

function newId(existing: Reservation[]): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (;;) {
    let s = 'HS-';
    for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!existing.some((r) => r.id === s)) return s;
  }
}

export const reservationStore = new ReservationStore();
export function subscribeReservations(l: Listener) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === bookingConfig.storageKey) {
      cache = null;
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}
export type { PriceRequest };
