import { bookingSettings } from '../config/booking';
import { classes } from '../config/classes';
import { programs } from '../config/programs';
import { trainers } from '../config/trainers';
import type { ClassSession } from '../config/types';
import { readJSON, writeJSON } from './storage';
import { availability, overlaps } from './schedule';

export interface Reservation {
  ref: string;
  classId: string;
  date: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Profile {
  name: string;
  email: string;
}

export const loadReservations = (): Reservation[] => {
  const raw = readJSON<unknown>(bookingSettings.storageKey, []);
  if (!Array.isArray(raw)) return [];
  const ok = raw.filter(
    (r): r is Reservation =>
      !!r && typeof r.ref === 'string' && typeof r.classId === 'string' && typeof r.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date)
  );
  // Drop reservations whose class has since been removed from the configuration.
  return ok.filter((r) => classes.some((c) => c.id === r.classId));
};

const save = (list: Reservation[]) => writeJSON(bookingSettings.storageKey, list);

export const loadProfile = (): Profile => {
  const p = readJSON<Partial<Profile>>(bookingSettings.profileKey, {});
  return { name: typeof p.name === 'string' ? p.name : '', email: typeof p.email === 'string' ? p.email : '' };
};
export const saveProfile = (p: Profile) => writeJSON(bookingSettings.profileKey, p);

export const makeRef = (classId: string, date: string) => {
  let h = 0;
  for (const ch of `${classId}${date}${Date.now()}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `${bookingSettings.referencePrefix}-${h.toString(36).toUpperCase().padStart(6, '0').slice(-6)}`;
};

export type BookResult =
  | { ok: true; reservation: Reservation; stored: boolean }
  | { ok: false; reason: 'duplicate' | 'conflict' | 'unknown-class' | 'closed' | 'full'; message: string; conflictWith?: string };

export function findClass(id: string): ClassSession | undefined {
  return classes.find((c) => c.id === id);
}

/**
 * Validates the class (still open, places left), duplicates and time clashes, then persists a new reservation.
 * The stored list is merged with `existing` first so a stale tab or a double submit cannot book the same place twice.
 */
export function book(session: ClassSession, date: string, profile: Profile, existing: Reservation[], now: Date = new Date()): BookResult {
  if (!findClass(session.id)) return { ok: false, reason: 'unknown-class', message: 'That class is no longer available.' };
  const stored = loadReservations();
  const all = [...existing, ...stored.filter((s) => !existing.some((e) => e.ref === s.ref))];
  if (all.some((r) => r.classId === session.id && r.date === date)) {
    return { ok: false, reason: 'duplicate', message: 'You have already reserved a place in this class.' };
  }
  const clash = all.find((r) => {
    if (r.date !== date) return false;
    const other = findClass(r.classId);
    return !!other && overlaps(session.start, session.duration, other.start, other.duration);
  });
  if (clash) {
    const other = findClass(clash.classId)!;
    return { ok: false, reason: 'conflict', conflictWith: other.title, message: `This overlaps with your reservation for ${other.title} (${other.start}).` };
  }

  const av = availability(session, date, now, false);
  if (av.closed) return { ok: false, reason: 'closed', message: `Booking for this class has closed (${bookingSettings.cutoffMinutes} minutes before the start).` };
  if (av.full) return { ok: false, reason: 'full', message: 'This class is full in the demonstration. Please choose another time.' };
  const reservation: Reservation = { ref: makeRef(session.id, date), classId: session.id, date, name: profile.name.trim(), email: profile.email.trim(), createdAt: new Date().toISOString() };
  const ok = save([...all, reservation]);
  saveProfile({ name: profile.name.trim(), email: profile.email.trim() });
  return { ok: true, reservation, stored: ok };
}

export function cancel(ref: string, existing: Reservation[]): Reservation[] {
  // Drop it from both the caller's list and whatever another tab may have stored since.
  const next = [...existing, ...loadReservations().filter((s) => !existing.some((e) => e.ref === s.ref))].filter((r) => r.ref !== ref);
  save(next);
  return next;
}

export const programName = (slug: string) => programs.find((p) => p.slug === slug)?.name ?? slug;
export const trainerName = (slug: string) => trainers.find((t) => t.slug === slug)?.name ?? slug;
