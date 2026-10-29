import type { ConsultMode, Doctor, Service } from '../config/types';
import { availableModes, bookableServices, doctorById, eligibleDoctors, serviceById, specialtyById } from './catalog';
import { resolveDoctor } from './availability';
import { findConflict, getBookings, type BookingRecord, type NewBooking } from './bookings';
import { validateContactDetails } from './validation';
import { booking as cfg } from '../config/booking';

export interface Draft {
  specialtyId: string;
  /** '' = not chosen yet, 'any' = no preference, otherwise a doctor id */
  doctorId: string;
  serviceId: string;
  mode: ConsultMode | '';
  date: string;
  time: string;
  contact: { name: string; email: string; phone: string };
  consent: boolean;
}

export const emptyDraft: Draft = { specialtyId: '', doctorId: '', serviceId: '', mode: '', date: '', time: '', contact: { name: '', email: '', phone: '' }, consent: false };

export const STEPS = ['Specialty', 'Doctor', 'Service', 'Date & time', 'Your details', 'Review'] as const;
export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

export const selectedService = (d: Draft): Service | undefined => (d.serviceId ? serviceById(d.serviceId) : undefined);

/** Doctors who could take this appointment (empty until a specialty and service are chosen). */
export function poolFor(d: Draft): Doctor[] {
  const svc = selectedService(d);
  if (!d.specialtyId || !svc) return [];
  return eligibleDoctors(d.specialtyId, svc, d.doctorId && d.doctorId !== 'any' ? d.doctorId : undefined);
}

/** Removes any choice that is no longer valid after an earlier step changed. Pure and idempotent. */
export function sanitizeDraft(input: Draft): Draft {
  const d = { ...input };
  if (d.specialtyId && !specialtyById(d.specialtyId)) d.specialtyId = '';
  if (!d.specialtyId) return { ...d, doctorId: '', serviceId: '', mode: '', date: '', time: '' };
  if (d.doctorId && d.doctorId !== 'any') {
    const doc = doctorById(d.doctorId);
    if (!doc || doc.specialtyId !== d.specialtyId || !doc.acceptingNewPatients) d.doctorId = '';
  }
  if (!d.doctorId) return { ...d, serviceId: '', mode: '', date: '', time: '' };
  const allowed = bookableServices(d.specialtyId, d.doctorId === 'any' ? undefined : d.doctorId);
  const svc = allowed.find((s) => s.id === d.serviceId);
  if (!svc) return { ...d, serviceId: '', mode: '', date: '', time: '' };
  const pool = poolFor(d);
  const modes = availableModes(pool, svc);
  if (!d.mode || !modes.includes(d.mode)) d.mode = modes[0] ?? '';
  return d;
}

export function stepComplete(step: StepIndex, d: Draft): boolean {
  switch (step) {
    case 0: return !!d.specialtyId;
    case 1: return !!d.doctorId;
    case 2: return !!d.serviceId && !!d.mode;
    case 3: return !!d.date && !!d.time;
    case 4: return Object.keys(validateContactDetails(d.contact, cfg.requirePhone)).length === 0 && d.consent;
    case 5: return false;
  }
}

/** First step that still needs input. */
export function firstIncomplete(d: Draft): StepIndex {
  for (const s of [0, 1, 2, 3, 4] as StepIndex[]) if (!stepComplete(s, d)) return s;
  return 5;
}

export type BuildResult = { ok: true; data: NewBooking } | { ok: false; error: string; step?: StepIndex };

/** Final validation + doctor assignment right before confirming a new demo appointment. */
export function buildBooking(d: Draft, now: Date = new Date(), existing: BookingRecord[] = getBookings()): BuildResult {
  const svc = selectedService(d);
  if (!svc || !d.specialtyId || !d.doctorId || !d.mode || !d.date || !d.time) return { ok: false, error: 'Some choices are missing. Please complete every step.', step: firstIncomplete(d) };
  const pool = poolFor(d);
  const doc = resolveDoctor(pool, d.date, d.time, svc.durationMinutes, existing);
  if (!doc) return { ok: false, error: 'Sorry, that time has just been taken. Please choose another time.', step: 3 };
  const conflict = findConflict({ date: d.date, time: d.time, durationMinutes: svc.durationMinutes, serviceId: svc.id, email: d.contact.email }, existing, { now, isNew: true });
  if (conflict) return { ok: false, error: conflict, step: 3 };
  return {
    ok: true,
    data: {
      specialtyId: d.specialtyId, doctorId: doc.id, doctorPreference: d.doctorId === 'any' ? 'any' : 'chosen', serviceId: svc.id, mode: d.mode,
      date: d.date, time: d.time, durationMinutes: svc.durationMinutes, price: svc.price, contact: { ...d.contact }
    }
  };
}

/** Doctors who can take a rescheduled appointment: the same pool as at booking, or the originally assigned doctor. */
export function reschedulePool(rec: BookingRecord): Doctor[] {
  const base: Draft = { ...emptyDraft, specialtyId: rec.specialtyId, doctorId: rec.doctorPreference === 'any' ? 'any' : rec.doctorId, serviceId: rec.serviceId, mode: rec.mode };
  const pool = poolFor(base);
  if (pool.length) return pool;
  const kept = doctorById(rec.doctorId);
  return kept ? [kept] : [];
}

/** Rescheduling: same specialty/service/contact, new date and time. */
export function buildReschedule(rec: BookingRecord, date: string, time: string, now: Date = new Date(), existing: BookingRecord[] = getBookings()): { ok: true; patch: Partial<BookingRecord> } | { ok: false; error: string } {
  const svc = serviceById(rec.serviceId);
  if (!svc) return { ok: false, error: 'This service is no longer offered in the demo configuration.' };
  if (date === rec.date && time === rec.time) return { ok: false, error: 'That is your current time. Please choose a different date or time.' };
  const pool = reschedulePool(rec);
  const doc = resolveDoctor(pool, date, time, svc.durationMinutes, existing, rec.id);
  if (!doc) return { ok: false, error: 'Sorry, that time is no longer available. Please choose another time.' };
  const conflict = findConflict({ date, time, durationMinutes: svc.durationMinutes, serviceId: svc.id, email: rec.contact.email }, existing, { ignoreId: rec.id, now });
  if (conflict) return { ok: false, error: conflict };
  return { ok: true, patch: { date, time, doctorId: doc.id } };
}
