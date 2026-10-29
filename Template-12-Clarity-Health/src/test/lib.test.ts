import { beforeEach, describe, expect, it } from 'vitest';
import { booking as cfg } from '../config/booking';
import { doctors } from '../config/doctors';
import { services } from '../config/services';
import { bookingWindow, getSlots, hasAvailability, hash01, hoursFor, isOpenDate, minutesToHM, resolveDoctor, toMinutes } from '../lib/availability';
import { buildBooking, buildReschedule, emptyDraft, sanitizeDraft, stepComplete, firstIncomplete, poolFor } from '../lib/booking-flow';
import { addBooking, cancelBooking, clearAllBookings, findConflict, getBookings, resetBookingsCache, storageUnavailable, updateBooking, type NewBooking } from '../lib/bookings';
import { bookableServices, canDeliver, doctorById, eligibleDoctors, relatedArticles, serviceById, servicesForDoctor } from '../lib/catalog';
import { formatDate, formatDuration, formatPrice, formatTime, parseISODate, toISODate } from '../lib/format';
import { matchesQuery, norm } from '../lib/search';
import { readJSON, writeJSON } from '../lib/storage';
import { isEmail, validateContactDetails, validateInquiry } from '../lib/validation';
import { articles } from '../config/articles';

// A fixed "today" (Monday 2026-11-02) so availability tests are deterministic.
const NOW = new Date(2026, 10, 2, 9, 0);
const iso = (n: number) => toISODate(new Date(2026, 10, 2 + n));

beforeEach(() => {
  window.localStorage.clear();
  resetBookingsCache();
});

describe('format helpers', () => {
  it('round-trips local ISO dates without UTC drift', () => {
    expect(toISODate(parseISODate('2026-03-08'))).toBe('2026-03-08');
    expect(parseISODate('2026-12-31').getDate()).toBe(31);
  });
  it('formats time, duration, price and dates', () => {
    expect(formatTime('08:00')).toBe('8:00 AM');
    expect(formatTime('13:30')).toBe('1:30 PM');
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(60)).toBe('1 h');
    expect(formatDuration(90)).toBe('1 h 30 min');
    expect(formatPrice(120)).toBe('$120');
    expect(formatDate('2026-11-03')).toContain('Tuesday');
  });
});

describe('search', () => {
  it('ignores case and accents and requires every term', () => {
    expect(norm('Women’s Health')).toBe('womens health');
    expect(matchesQuery('womens heart', 'Women’s Health', 'heart care')).toBe(true);
    expect(matchesQuery('skin heart', 'Dermatology skin')).toBe(false);
    expect(matchesQuery('', 'anything')).toBe(true);
    expect(matchesQuery('cafe', 'Café')).toBe(true);
  });
});

describe('validation', () => {
  it('accepts good contact details', () => {
    expect(validateContactDetails({ name: 'Alex Morgan', email: 'alex@example.com', phone: '' })).toEqual({});
    expect(validateContactDetails({ name: "Zoë O'Neil-Smith", email: 'z@example.org', phone: '+1 (555) 010-0100' })).toEqual({});
  });
  it('rejects bad names, e-mails and phones', () => {
    const e = validateContactDetails({ name: 'A', email: 'nope', phone: 'abc' });
    expect(e.name).toBeTruthy();
    expect(e.email).toBeTruthy();
    expect(e.phone).toBeTruthy();
    expect(validateContactDetails({ name: 'Alex 123', email: 'a@b.co', phone: '' }).name).toBeTruthy();
    expect(validateContactDetails({ name: 'Alex', email: 'a@b.co', phone: '' }, true).phone).toBeTruthy();
    expect(validateContactDetails({ name: 'Alex', email: 'a@b.co', phone: '123' }).phone).toBeTruthy();
  });
  it('validates e-mail shape', () => {
    expect(isEmail('a@b.co')).toBe(true);
    expect(isEmail('a@b')).toBe(false);
    expect(isEmail('a b@c.com')).toBe(false);
  });
  it('validates the inquiry form', () => {
    expect(Object.keys(validateInquiry({ name: '', email: '', topic: '', message: '' })).sort()).toEqual(['email', 'message', 'name', 'topic']);
    expect(validateInquiry({ name: 'Al', email: 'a@b.co', topic: 'General question', message: 'Hello there, how are you?' })).toEqual({});
    expect(validateInquiry({ name: 'Al', email: 'a@b.co', topic: 'x', message: 'x'.repeat(1001) }).message).toBeTruthy();
  });
});

describe('storage', () => {
  it('returns the fallback for missing, corrupt or blocked storage', () => {
    expect(readJSON('missing', 5)).toBe(5);
    window.localStorage.setItem('bad', '{oops');
    expect(readJSON('bad', 'fallback')).toBe('fallback');
    const orig = Storage.prototype.getItem;
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    expect(readJSON('x', 1)).toBe(1);
    Storage.prototype.getItem = orig;
  });
  it('reports a failed write instead of throwing', () => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('quota'); };
    expect(writeJSON('k', 1)).toBe(false);
    Storage.prototype.setItem = orig;
    expect(writeJSON('k', 1)).toBe(true);
  });
});

describe('catalog compatibility', () => {
  it('only lets a doctor deliver services of their specialty', () => {
    const derm = doctorById('priya-raman')!;
    expect(canDeliver(derm, serviceById('dermatology-consultation')!)).toBe(true);
    expect(canDeliver(derm, serviceById('cardiology-consultation')!)).toBe(false);
    expect(servicesForDoctor(derm).every((s) => s.specialtyIds.includes('dermatology'))).toBe(true);
  });
  it('respects consultation formats', () => {
    const cardio = doctorById('mateo-lindqvist')!; // in-person only
    expect(canDeliver(cardio, serviceById('cardiac-rehab-education')!)).toBe(true);
    expect(servicesForDoctor(cardio).every((s) => s.modes.includes('in-person'))).toBe(true);
  });
  it('every specialty and every doctor has at least one bookable service', () => {
    for (const d of doctors) expect(servicesForDoctor(d).length, d.name).toBeGreaterThan(0);
  });
  it('excludes doctors who are not accepting new patients from the booking pool', () => {
    const pool = eligibleDoctors('dermatology', serviceById('dermatology-consultation')!);
    expect(pool.map((d) => d.id)).not.toContain('yuki-tanaka');
    expect(bookableServices('dermatology').length).toBeGreaterThan(0);
  });
  it('suggests related articles from the same category first', () => {
    const rel = relatedArticles(articles[0]);
    expect(rel).toHaveLength(3);
    expect(rel.map((a) => a.id)).not.toContain(articles[0].id);
  });
});

describe('availability', () => {
  const pool = eligibleDoctors('general-medicine', serviceById('initial-consultation')!);
  it('opens the window after the lead time', () => {
    const w = bookingWindow(NOW);
    expect(w.startISO).toBe(iso(cfg.leadDays));
  });
  it('is closed on Sundays and generates slots on open days', () => {
    expect(isOpenDate('2026-11-08')).toBe(false); // Sunday
    expect(hoursFor('2026-11-03')?.open).toBe('08:00');
    expect(getSlots({ iso: '2026-11-08', durationMinutes: 30, pool, bookings: [], now: NOW })).toEqual([]);
    const slots = getSlots({ iso: '2026-11-03', durationMinutes: 45, pool, bookings: [], now: NOW });
    expect(slots[0].time).toBe('08:00');
    expect(toMinutes(slots[slots.length - 1].time) + 45).toBeLessThanOrEqual(18 * 60);
  });
  it('does not offer dates outside the window', () => {
    expect(getSlots({ iso: iso(0), durationMinutes: 30, pool, bookings: [], now: NOW })).toEqual([]);
    expect(getSlots({ iso: iso(cfg.windowDays + 5), durationMinutes: 30, pool, bookings: [], now: NOW })).toEqual([]);
  });
  it('is deterministic', () => {
    expect(hash01('a')).toBe(hash01('a'));
    expect(minutesToHM(545)).toBe('09:05');
    const a = getSlots({ iso: '2026-11-03', durationMinutes: 30, pool, bookings: [], now: NOW });
    const b = getSlots({ iso: '2026-11-03', durationMinutes: 30, pool, bookings: [], now: NOW });
    expect(a).toEqual(b);
  });
  it('respects doctor working days', () => {
    const okafor = doctorById('amara-okafor')!; // Mon–Thu
    expect(hasAvailability({ iso: '2026-11-06', durationMinutes: 30, pool: [okafor], bookings: [], now: NOW })).toBe(false); // Friday
    expect(hasAvailability({ iso: '2026-11-03', durationMinutes: 30, pool: [okafor], bookings: [], now: NOW })).toBe(true);
  });
  it('removes a slot once it is booked and overlapping slots are blocked', () => {
    const okafor = doctorById('amara-okafor')!;
    const first = getSlots({ iso: '2026-11-03', durationMinutes: 30, pool: [okafor], bookings: [], now: NOW }).find((s) => s.available)!;
    const rec = addBooking(base({ doctorId: okafor.id, date: '2026-11-03', time: first.time }));
    const after = getSlots({ iso: '2026-11-03', durationMinutes: 30, pool: [okafor], bookings: [rec], now: NOW });
    expect(after.find((s) => s.time === first.time)?.available).toBe(false);
    expect(resolveDoctor([okafor], '2026-11-03', first.time, 30, [rec])).toBeUndefined();
    cancelBooking(rec.id);
    expect(resolveDoctor([okafor], '2026-11-03', first.time, 30, getBookings())).toBeDefined();
  });
});

function base(over: Partial<NewBooking> = {}): NewBooking {
  return {
    specialtyId: 'general-medicine', doctorId: 'amara-okafor', doctorPreference: 'chosen', serviceId: 'initial-consultation', mode: 'in-person',
    date: '2026-11-03', time: '08:00', durationMinutes: 45, price: 120, contact: { name: 'Alex Morgan', email: 'alex@example.com', phone: '' }, ...over
  };
}

describe('booking store', () => {
  it('adds, persists, cancels, updates and clears', () => {
    const rec = addBooking(base());
    expect(rec.reference.startsWith(cfg.referencePrefix)).toBe(true);
    expect(rec.status).toBe('confirmed');
    resetBookingsCache();
    expect(getBookings()).toHaveLength(1); // read back from localStorage
    updateBooking(rec.id, { time: '09:00' });
    expect(getBookings()[0].time).toBe('09:00');
    cancelBooking(rec.id);
    expect(getBookings()[0].status).toBe('cancelled');
    clearAllBookings();
    expect(getBookings()).toHaveLength(0);
  });
  it('ignores corrupt stored entries', () => {
    window.localStorage.setItem(cfg.storageKey, JSON.stringify([{ id: 1 }, null, 'x']));
    resetBookingsCache();
    expect(getBookings()).toEqual([]);
  });
  it('keeps working in memory when localStorage is blocked', () => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
    addBooking(base());
    expect(getBookings()).toHaveLength(1);
    expect(storageUnavailable()).toBe(true);
    Storage.prototype.setItem = orig;
  });
  it('stores only basic contact fields', () => {
    const rec = addBooking(base());
    expect(Object.keys(rec.contact).sort()).toEqual(['email', 'name', 'phone']);
  });
});

describe('duplicate prevention', () => {
  it('blocks overlapping appointments and same-service-same-day for one e-mail', () => {
    const rec = addBooking(base());
    const overlap = findConflict({ date: '2026-11-03', time: '08:30', durationMinutes: 30, serviceId: 'follow-up-consultation', email: 'ALEX@example.com ' }, [rec], { now: NOW });
    expect(overlap).toMatch(/overlaps/);
    const sameService = findConflict({ date: '2026-11-03', time: '15:00', durationMinutes: 45, serviceId: 'initial-consultation', email: 'alex@example.com' }, [rec], { now: NOW });
    expect(sameService).toMatch(/already have this service/);
    expect(findConflict({ date: '2026-11-03', time: '15:00', durationMinutes: 30, serviceId: 'follow-up-consultation', email: 'alex@example.com' }, [rec], { now: NOW })).toBeNull();
    expect(findConflict({ date: '2026-11-03', time: '08:30', durationMinutes: 30, serviceId: 'follow-up-consultation', email: 'other@example.com' }, [rec], { now: NOW })).toBeNull();
  });
  it('ignores cancelled appointments', () => {
    const rec = addBooking(base());
    cancelBooking(rec.id);
    expect(findConflict({ date: '2026-11-03', time: '08:00', durationMinutes: 45, serviceId: 'initial-consultation', email: 'alex@example.com' }, getBookings(), { now: NOW })).toBeNull();
  });
  it('limits upcoming appointments per e-mail', () => {
    const recs = Array.from({ length: cfg.maxActivePerEmail }, (_, i) => addBooking(base({ date: `2026-11-1${i}`, serviceId: `s${i}` })));
    expect(findConflict({ date: '2026-11-20', time: '10:00', durationMinutes: 30, serviceId: 'zzz', email: 'alex@example.com' }, recs, { now: NOW, isNew: true })).toMatch(/up to/);
  });
});

describe('booking flow logic', () => {
  const valid = {
    ...emptyDraft, specialtyId: 'general-medicine', doctorId: 'any', serviceId: 'initial-consultation', mode: 'in-person' as const,
    contact: { name: 'Alex Morgan', email: 'alex@example.com', phone: '' }, consent: true
  };
  const slot = () => {
    const pool = poolFor(valid);
    for (let n = cfg.leadDays; n < 30; n++) {
      const d = iso(n);
      const s = getSlots({ iso: d, durationMinutes: 45, pool, bookings: [], now: NOW }).find((x) => x.available);
      if (s) return { date: d, time: s.time };
    }
    throw new Error('no slot');
  };
  it('sanitizes incompatible choices', () => {
    expect(sanitizeDraft({ ...valid, specialtyId: 'cardiology' }).serviceId).toBe('');
    expect(sanitizeDraft({ ...valid, doctorId: 'priya-raman' }).doctorId).toBe('');
    expect(sanitizeDraft({ ...valid, doctorId: 'yuki-tanaka', specialtyId: 'dermatology' }).doctorId).toBe(''); // not accepting
    expect(sanitizeDraft({ ...emptyDraft, specialtyId: 'nope' }).specialtyId).toBe('');
    expect(sanitizeDraft(valid).serviceId).toBe('initial-consultation');
  });
  it('tracks step completion', () => {
    expect(firstIncomplete(emptyDraft)).toBe(0);
    expect(stepComplete(2, valid)).toBe(true);
    expect(stepComplete(3, valid)).toBe(false);
    expect(firstIncomplete({ ...valid, ...slot() })).toBe(5);
    expect(stepComplete(4, { ...valid, consent: false })).toBe(false);
  });
  it('assigns a doctor for "no preference" and builds a record', () => {
    const r = buildBooking({ ...valid, ...slot() }, NOW, []);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.doctorPreference).toBe('any');
      expect(doctorById(r.data.doctorId)?.specialtyId).toBe('general-medicine');
      expect(r.data.durationMinutes).toBe(serviceById('initial-consultation')!.durationMinutes);
    }
  });
  it('refuses incomplete drafts and taken slots', () => {
    expect(buildBooking(valid, NOW, []).ok).toBe(false);
    const s = slot();
    const first = buildBooking({ ...valid, ...s }, NOW, []);
    if (!first.ok) throw new Error('unexpected');
    const all = [addBooking(first.data)];
    const poolSize = poolFor(valid).length;
    // fill every doctor at that time, then the next attempt (different e-mail) must fail
    for (const d of poolFor(valid).slice(1, poolSize)) all.push(addBooking({ ...first.data, doctorId: d.id, contact: { ...first.data.contact, email: `x${d.id}@example.com` } }));
    const again = buildBooking({ ...valid, ...s, contact: { name: 'Sam', email: 'sam@example.com', phone: '' } }, NOW, all);
    expect(again.ok).toBe(false);
  });
  it('reschedules to a free slot and rejects the current time', () => {
    const s = slot();
    const built = buildBooking({ ...valid, ...s }, NOW, []);
    if (!built.ok) throw new Error('unexpected');
    const rec = addBooking(built.data);
    expect(buildReschedule(rec, rec.date, rec.time, NOW, getBookings()).ok).toBe(false);
    const doc = doctorById(rec.doctorId)!;
    let moved = false;
    for (let n = cfg.leadDays; n < 40 && !moved; n++) {
      const sl = getSlots({ iso: iso(n), durationMinutes: rec.durationMinutes, pool: [doc], bookings: getBookings(), ignoreBookingId: rec.id, now: NOW }).find((x) => x.available && !(iso(n) === rec.date && x.time === rec.time));
      if (sl) {
        const res = buildReschedule(rec, iso(n), sl.time, NOW, getBookings());
        expect(res.ok).toBe(true);
        moved = true;
      }
    }
    expect(moved).toBe(true);
    expect(buildReschedule(rec, '2026-11-08', '10:00', NOW, getBookings()).ok).toBe(false); // Sunday
  });
});

describe('config integrity', () => {
  it('has unique ids and slugs', () => {
    for (const list of [services, doctors]) {
      expect(new Set(list.map((x) => x.id)).size).toBe(list.length);
      expect(new Set(list.map((x) => x.slug)).size).toBe(list.length);
    }
  });
  it('formats durations for every service', () => {
    for (const s of services) expect(formatDuration(s.durationMinutes)).toBeTruthy();
  });
});
