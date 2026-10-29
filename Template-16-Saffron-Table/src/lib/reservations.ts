/**
 * Pure reservation-simulation engine. No I/O: pass settings, existing reservations and `now`.
 * Everything here is demonstration logic: "availability" is a deterministic fictional load plus
 * reservations saved in this browser. It never represents a real restaurant.
 */
import type { ReservationSettings, SeatingArea, ServicePeriod } from '../config/types';
import { addDays, daysBetween, isDateKey, isTimeString, minutesOfDay, minutesToTime, timeToMinutes, toDateKey, weekdayOf } from './dates';
import { validateEmail, validateMessage, validateName, validatePhone, type Errors } from './validation';

export type ReservationStatus = 'confirmed' | 'cancelled';
export interface Guest { name: string; email: string; phone: string }
export interface Reservation {
  id: string;
  code: string;
  status: ReservationStatus;
  dateKey: string;
  time: string;
  party: number;
  /** Concrete seating area assigned at booking time. */
  areaId: string;
  /** What the guest asked for: an area id or 'any'. */
  requestedArea: string;
  guest: Guest;
  note: string;
  occasion: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
}
export interface BookingInput {
  dateKey: string;
  time: string;
  party: number;
  requestedArea: string;
  guest: Guest;
  note: string;
  occasion: string;
}

export const ANY_AREA = 'any';

/* ---------- Deterministic fictional load ---------- */
export function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

export function demoSeats(dateKey: string, time: string, area: SeatingArea, s: ReservationSettings): number {
  const load = s.demoLoad;
  const mins = timeToMinutes(time);
  let base = load.weekdayLoad[weekdayOf(dateKey)] ?? 0;
  if (mins >= timeToMinutes(load.peakFrom) && mins <= timeToMinutes(load.peakTo)) base += load.peakBoost;
  const noise = 0.55 + hash01(`${load.seed}|${dateKey}|${time}|${area.id}`) * 0.9;
  const fraction = Math.max(0, Math.min(1, base * noise));
  return Math.round(area.capacity * fraction);
}

/* ---------- Day rules ---------- */
export type DayStatus = 'open' | 'closed' | 'past' | 'too_far';
export interface DayInfo { dateKey: string; status: DayStatus; reason?: string; services: ServicePeriod[] }

export function closedReason(dateKey: string, s: ReservationSettings): string | undefined {
  const mmdd = dateKey.slice(5);
  return s.closedDates.find((c) => c.date === dateKey || c.date === mmdd)?.reason;
}

export function getDayInfo(dateKey: string, s: ReservationSettings, now: Date): DayInfo {
  if (!isDateKey(dateKey)) return { dateKey, status: 'closed', reason: 'Invalid date', services: [] };
  const today = toDateKey(now);
  const diff = daysBetween(today, dateKey);
  if (diff < 0) return { dateKey, status: 'past', reason: 'This date has passed', services: [] };
  if (diff > s.bookingWindowDays) return { dateKey, status: 'too_far', reason: `Bookings open ${s.bookingWindowDays} days ahead`, services: [] };
  const reason = closedReason(dateKey, s);
  if (reason) return { dateKey, status: 'closed', reason, services: [] };
  const services = s.hours[weekdayOf(dateKey)] ?? [];
  if (services.length === 0) return { dateKey, status: 'closed', reason: 'Closed on this day', services: [] };
  return { dateKey, status: 'open', services };
}

export interface SlotTime { time: string; service: string }

export function generateSlots(dateKey: string, s: ReservationSettings): SlotTime[] {
  const services = s.hours[weekdayOf(dateKey)] ?? [];
  if (closedReason(dateKey, s)) return [];
  const slots: SlotTime[] = [];
  for (const svc of services) {
    for (let m = timeToMinutes(svc.open); m <= timeToMinutes(svc.lastSeating); m += s.slotIntervalMinutes) {
      slots.push({ time: minutesToTime(m), service: svc.label });
    }
  }
  return slots;
}

export const isValidSlotTime = (dateKey: string, time: string, s: ReservationSettings): boolean =>
  isTimeString(time) && generateSlots(dateKey, s).some((x) => x.time === time);

/** True if the slot is in the past or inside the same-day lead-time cutoff. */
export function isSlotTooSoon(dateKey: string, time: string, s: ReservationSettings, now: Date): boolean {
  const today = toDateKey(now);
  if (dateKey < today) return true;
  if (dateKey > today) return false;
  return timeToMinutes(time) < minutesOfDay(now) + s.sameDayLeadMinutes;
}

/** Does the date have at least one slot that is not already past the cutoff? */
export function hasBookableSlot(dateKey: string, s: ReservationSettings, now: Date): boolean {
  if (getDayInfo(dateKey, s, now).status !== 'open') return false;
  return generateSlots(dateKey, s).some((sl) => !isSlotTooSoon(dateKey, sl.time, s, now));
}

/* ---------- Capacity ---------- */
export const areaAcceptsParty = (a: SeatingArea, party: number): boolean => party >= a.minParty && party <= a.maxParty;

const activeReservations = (list: Reservation[], excludeId?: string) =>
  list.filter((r) => r.status === 'confirmed' && r.id !== excludeId);

/** Minutes covered by the reservation window, in slot-interval steps. */
function windowSteps(time: string, s: ReservationSettings): number[] {
  const start = timeToMinutes(time);
  const steps: number[] = [];
  for (let m = start; m < start + s.diningDurationMinutes; m += s.slotIntervalMinutes) steps.push(m);
  return steps;
}

export function seatsInUse(dateKey: string, minute: number, area: SeatingArea, list: Reservation[], s: ReservationSettings, excludeId?: string): number {
  const local = activeReservations(list, excludeId)
    .filter((r) => r.dateKey === dateKey && r.areaId === area.id)
    .filter((r) => {
      const start = timeToMinutes(r.time);
      return minute >= start && minute < start + s.diningDurationMinutes;
    })
    .reduce((n, r) => n + r.party, 0);
  const slotAtMinute = generateSlots(dateKey, s).find((sl) => timeToMinutes(sl.time) === minute);
  const demo = slotAtMinute ? demoSeats(dateKey, slotAtMinute.time, area, s) : 0;
  return local + demo;
}

/** Peak seats in use over the booking window for one area, so that a booking never overflows later in its stay. */
export function peakSeatsInWindow(dateKey: string, time: string, area: SeatingArea, list: Reservation[], s: ReservationSettings, excludeId?: string): number {
  const lastSeating = Math.max(...generateSlots(dateKey, s).map((x) => timeToMinutes(x.time)), 0);
  return Math.max(
    0,
    ...windowSteps(time, s)
      .filter((m) => m <= lastSeating + s.slotIntervalMinutes)
      .map((m) => seatsInUse(dateKey, m, area, list, s, excludeId)),
  );
}

export function remainingSeats(dateKey: string, time: string, area: SeatingArea, list: Reservation[], s: ReservationSettings, excludeId?: string): number {
  return Math.max(0, area.capacity - peakSeatsInWindow(dateKey, time, area, list, s, excludeId));
}

export type SlotState = 'available' | 'limited' | 'full' | 'too_soon' | 'unsuitable';
export interface SlotAvailability {
  time: string;
  service: string;
  state: SlotState;
  /** Area that would be assigned if booked (undefined when unavailable). */
  areaId?: string;
  remaining?: number;
}

export interface AvailabilityQuery {
  dateKey: string;
  party: number;
  requestedArea: string;
  settings: ReservationSettings;
  reservations: Reservation[];
  now: Date;
  excludeId?: string;
}

export function eligibleAreas(settings: ReservationSettings, requestedArea: string, party: number): SeatingArea[] {
  const areas = requestedArea === ANY_AREA ? settings.seatingAreas : settings.seatingAreas.filter((a) => a.id === requestedArea);
  return areas.filter((a) => areaAcceptsParty(a, party));
}

export function getAvailability(q: AvailabilityQuery): SlotAvailability[] {
  const { dateKey, party, requestedArea, settings: s, reservations, now, excludeId } = q;
  if (getDayInfo(dateKey, s, now).status !== 'open') return [];
  const candidates = eligibleAreas(s, requestedArea, party);
  return generateSlots(dateKey, s).map(({ time, service }) => {
    if (isSlotTooSoon(dateKey, time, s, now)) return { time, service, state: 'too_soon' as const };
    if (candidates.length === 0) return { time, service, state: 'unsuitable' as const };
    for (const area of candidates) {
      const remaining = remainingSeats(dateKey, time, area, reservations, s, excludeId);
      if (remaining >= party) {
        const tight = remaining - party < Math.max(4, Math.ceil(area.capacity * 0.15));
        return { time, service, state: tight ? ('limited' as const) : ('available' as const), areaId: area.id, remaining };
      }
    }
    return { time, service, state: 'full' as const };
  });
}

/* ---------- Validation ---------- */
export interface BookingContext {
  settings: ReservationSettings;
  reservations: Reservation[];
  now: Date;
  excludeId?: string;
}

export const normaliseEmail = (e: string): string => e.trim().toLowerCase();

export function findDuplicate(input: Pick<BookingInput, 'dateKey' | 'guest'>, list: Reservation[], excludeId?: string): Reservation | undefined {
  const email = normaliseEmail(input.guest.email);
  return activeReservations(list, excludeId).find((r) => r.dateKey === input.dateKey && normaliseEmail(r.guest.email) === email);
}

export interface BookingValidation { errors: Errors; areaId?: string }

/** Validates a full booking request and resolves the seating area that would be assigned. */
export function validateBooking(input: BookingInput, ctx: BookingContext): BookingValidation {
  const { settings: s, reservations, now, excludeId } = ctx;
  const errors: Errors = {};

  const day = getDayInfo(input.dateKey, s, now);
  if (!input.dateKey) errors.date = 'Please choose a dining date.';
  else if (day.status !== 'open') errors.date = day.status === 'past' ? 'That date has already passed.' : day.status === 'too_far' ? `We can only take bookings up to ${s.bookingWindowDays} days ahead.` : `We’re closed on that date${day.reason ? ` (${day.reason})` : ''}.`;

  if (!Number.isInteger(input.party) || input.party < s.minPartySize) errors.party = `Party size must be at least ${s.minPartySize}.`;
  else if (input.party > s.maxPartySize) errors.party = `Online bookings are limited to ${s.maxPartySize} guests. Please send a private dining enquiry for larger parties.`;

  if (input.requestedArea !== ANY_AREA && !s.seatingAreas.some((a) => a.id === input.requestedArea)) errors.area = 'Please choose a seating area.';
  else if (!errors.party) {
    const eligible = eligibleAreas(s, input.requestedArea, input.party);
    if (eligible.length === 0) {
      const a = s.seatingAreas.find((x) => x.id === input.requestedArea);
      errors.area = a ? `${a.name} seats parties of ${a.minParty}–${a.maxParty}. Choose another area or party size.` : 'No seating area suits that party size.';
    }
  }

  let areaId: string | undefined;
  if (!errors.date) {
    if (!input.time) errors.time = 'Please choose a time.';
    else if (!isValidSlotTime(input.dateKey, input.time, s)) errors.time = 'That time is outside our service hours.';
    else if (isSlotTooSoon(input.dateKey, input.time, s, now)) errors.time = 'That time has passed or is too soon to book. Choose a later slot.';
    else if (!errors.party && !errors.area) {
      const slot = getAvailability({ dateKey: input.dateKey, party: input.party, requestedArea: input.requestedArea, settings: s, reservations, now, excludeId }).find((x) => x.time === input.time);
      if (!slot || slot.state === 'full' || !slot.areaId) errors.time = 'Sorry, that time is no longer available in the demo. Please choose another slot.';
      else areaId = slot.areaId;
    }
  }

  const nameErr = validateName(input.guest.name);
  const emailErr = validateEmail(input.guest.email);
  const phoneErr = validatePhone(input.guest.phone, true);
  const noteErr = validateMessage(input.note, { required: false, min: 1, max: 300 });
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (phoneErr) errors.phone = phoneErr;
  if (noteErr) errors.note = noteErr;

  if (!errors.date && !errors.email) {
    const dup = findDuplicate(input, reservations, excludeId);
    if (dup) errors.duplicate = `This email already has reservation ${dup.code} on that date (${dup.time}). Modify or cancel it instead of booking twice.`;
  }
  return { errors, areaId };
}

export const maxBookableDate = (s: ReservationSettings, now: Date): string => addDays(toDateKey(now), s.bookingWindowDays);

/** First date after `fromKey` (within the booking window) that has at least one bookable slot for this party/area. */
export function findNextAvailableDate(fromKey: string, q: Omit<AvailabilityQuery, 'dateKey'>): string | undefined {
  for (let i = 1; i <= 45; i++) {
    const key = addDays(fromKey, i);
    const slots = getAvailability({ ...q, dateKey: key });
    if (slots.some((s) => s.state === 'available' || s.state === 'limited')) return key;
  }
  return undefined;
}
