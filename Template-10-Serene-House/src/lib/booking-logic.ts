import { getPackage } from '../config/packages';
import { getTreatment } from '../config/treatments';
import { staff } from '../config/staff';
import type { SpaPackage, StaffMember, Treatment } from '../config/types';
import { formatDuration } from './format';
import { overlaps, toMinutes } from './availability';
import type { BookingRecord } from './bookings';

export type ServiceKind = 'treatment' | 'package';

export interface ResolvedService {
  kind: ServiceKind;
  slug: string;
  name: string;
  durationMinutes: number;
  optionLabel: string;
  /** Per guest unless `fixedGuests` is set, then total for the whole party. */
  unitPrice: number;
  minGuests: number;
  maxGuests: number;
  fixedGuests: boolean;
  specialties: ('massage' | 'facial' | 'body' | 'wellness')[] | null;
  source: Treatment | SpaPackage;
}

export function resolveService(kind: ServiceKind, slug: string, optionMinutes?: number): ResolvedService | undefined {
  if (kind === 'treatment') {
    const t = getTreatment(slug);
    if (!t) return undefined;
    const opt = t.options.find((o) => o.minutes === optionMinutes) ?? t.options[0];
    return {
      kind, slug, name: t.name, durationMinutes: opt.minutes, optionLabel: formatDuration(opt.minutes),
      unitPrice: opt.price, minGuests: 1, maxGuests: t.maxGuests, fixedGuests: false, specialties: [t.category], source: t
    };
  }
  const p = getPackage(slug);
  if (!p) return undefined;
  const fixed = p.guests > 1;
  return {
    kind, slug, name: p.name, durationMinutes: p.minutes, optionLabel: p.duration,
    unitPrice: p.price, minGuests: p.guests, maxGuests: fixed ? p.guests : p.maxGuests, fixedGuests: fixed, specialties: null, source: p
  };
}

export const servicePrice = (s: ResolvedService, guests: number) => (s.fixedGuests ? s.unitPrice : s.unitPrice * guests);

export function eligibleStaff(s: ResolvedService | undefined): StaffMember[] {
  if (!s || !s.specialties) return staff;
  return staff.filter((m) => m.specialties.some((sp) => s.specialties!.includes(sp)));
}

/**
 * Duplicate-booking guard: the same guest (matched by email) cannot hold two confirmed
 * appointments that overlap in time, which also catches an accidental double submission.
 */
export function findCustomerConflict(
  bookings: BookingRecord[],
  email: string,
  date: string,
  time: string,
  durationMinutes: number,
  ignoreId?: string
): BookingRecord | undefined {
  const who = email.trim().toLowerCase();
  if (!who) return undefined;
  return bookings.find(
    (b) =>
      b.status === 'confirmed' &&
      b.id !== ignoreId &&
      b.date === date &&
      b.customer.email.trim().toLowerCase() === who &&
      overlaps(toMinutes(time), durationMinutes, toMinutes(b.time), b.durationMinutes)
  );
}
