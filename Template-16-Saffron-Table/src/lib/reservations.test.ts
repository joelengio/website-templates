import { beforeEach, describe, expect, it } from 'vitest';
import { reservationSettings as base } from '../config/reservations';
import type { ReservationSettings } from '../config/types';
import { toDateKey, weekdayOf } from './dates';
import { ANY_AREA, generateSlots, getAvailability, getDayInfo, hasBookableSlot, isSlotTooSoon, validateBooking, type BookingInput, type Reservation } from './reservations';
import { createReservationStore, makeCode } from './reservationStore';

// Fixed "now": Wednesday 2026-03-04 12:00 local
const NOW = new Date(2026, 2, 4, 12, 0, 0);
const settings: ReservationSettings = {
  ...base,
  demoLoad: { ...base.demoLoad, weekdayLoad: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }, peakBoost: 0 },
};
const FRI = '2026-03-06';
const MON = '2026-03-09';

const input = (over: Partial<BookingInput> = {}): BookingInput => ({
  dateKey: FRI, time: '19:00', party: 2, requestedArea: ANY_AREA,
  guest: { name: 'Ada Lovelace', email: 'ada@example.com', phone: '+1 555 010 2000' }, note: '', occasion: '', ...over,
});
const memoryStore = (s = settings) => {
  let saved: Reservation[] = [];
  return createReservationStore({ read: () => saved, write: (l) => { saved = l; } }, s, (() => { let n = 0.123; return () => (n = (n * 9301 + 0.49297) % 1); })());
};

describe('day rules & slots', () => {
  it('knows opening hours and closed days', () => {
    expect(getDayInfo(MON, settings, NOW).status).toBe('closed');
    expect(getDayInfo(FRI, settings, NOW).status).toBe('open');
    expect(weekdayOf(MON)).toBe(1);
  });
  it('closes on configured holidays (recurring MM-DD)', () => {
    const info = getDayInfo('2026-12-25', { ...settings, bookingWindowDays: 400 }, NOW);
    expect(info.status).toBe('closed');
    expect(info.reason).toMatch(/holiday/i);
  });
  it('rejects past dates and dates beyond the booking window', () => {
    expect(getDayInfo('2026-03-03', settings, NOW).status).toBe('past');
    expect(getDayInfo('2026-12-01', settings, NOW).status).toBe('too_far');
  });
  it('generates slots at the configured interval up to last seating', () => {
    const slots = generateSlots(FRI, settings).map((s) => s.time);
    expect(slots[0]).toBe('17:00');
    expect(slots.at(-1)).toBe('21:30');
    expect(slots).toHaveLength(10);
    const sun = generateSlots('2026-03-08', settings);
    expect(sun.filter((s) => s.service === 'Lunch')).toHaveLength(6);
    expect(generateSlots(FRI, { ...settings, slotIntervalMinutes: 60 }).map((s) => s.time)).toEqual(['17:00', '18:00', '19:00', '20:00', '21:00']);
  });
  it('applies same-day lead time', () => {
    expect(isSlotTooSoon('2026-03-04', '13:00', settings, NOW)).toBe(true);
    expect(isSlotTooSoon('2026-03-04', '13:30', settings, NOW)).toBe(false);
    expect(hasBookableSlot('2026-03-04', settings, NOW)).toBe(true);
    expect(hasBookableSlot('2026-03-04', settings, new Date(2026, 2, 4, 21, 0))).toBe(false);
  });
});

describe('availability, party size & seating capacity', () => {
  const q = (over = {}) => ({ dateKey: FRI, party: 2, requestedArea: ANY_AREA, settings, reservations: [] as Reservation[], now: NOW, ...over });
  it('is fully available with an empty demo load', () => {
    const slots = getAvailability(q());
    expect(slots.every((s) => s.state === 'available')).toBe(true);
  });
  it('returns no slots on closed days', () => {
    expect(getAvailability(q({ dateKey: MON }))).toEqual([]);
  });
  it('marks every slot unsuitable when the area cannot seat the party', () => {
    const slots = getAvailability(q({ party: 6, requestedArea: 'bar' }));
    expect(slots.every((s) => s.state === 'unsuitable')).toBe(true);
    expect(getAvailability(q({ party: 1, requestedArea: 'chefs-counter' })).every((s) => s.state === 'unsuitable')).toBe(true);
  });
  it('assigns the first area that fits and honours explicit areas', () => {
    expect(getAvailability(q({ party: 3 }))[0].areaId).toBe('dining-room');
    expect(getAvailability(q({ party: 2, requestedArea: 'terrace' }))[0].areaId).toBe('terrace');
  });
  it('uses fictional demo load to produce full slots', () => {
    const busy: ReservationSettings = { ...settings, demoLoad: { ...settings.demoLoad, weekdayLoad: { ...settings.demoLoad.weekdayLoad, 5: 5 } } };
    const slots = getAvailability(q({ settings: busy }));
    expect(slots.every((s) => s.state === 'full')).toBe(true);
  });
  it('enforces seating capacity and frees it again after cancellation', () => {
    const store = memoryStore();
    // Chef's counter: 8 seats; two parties of 4 fill it for the evening window
    const a = store.create(input({ requestedArea: 'chefs-counter', party: 4, guest: { name: 'Ann One', email: 'a@x.io', phone: '5550001111' } }), NOW);
    const b = store.create(input({ requestedArea: 'chefs-counter', party: 4, guest: { name: 'Bob Two', email: 'b@x.io', phone: '5550002222' } }), NOW);
    expect(a.ok && b.ok).toBe(true);
    const c = store.create(input({ requestedArea: 'chefs-counter', party: 2, guest: { name: 'Cy Three', email: 'c@x.io', phone: '5550003333' } }), NOW);
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.errors.time).toMatch(/no longer available/i);
    const slots = getAvailability(q({ party: 2, requestedArea: 'chefs-counter', reservations: store.getSnapshot() }));
    expect(slots.find((s) => s.time === '19:00')!.state).toBe('full');
    expect(slots.find((s) => s.time === '17:30')!.state).toBe('full'); // stay would overlap the 19:00 booking
    expect(slots.find((s) => s.time === '17:00')!.state).toBe('available'); // ends exactly when the 19:00 party sits
    expect(slots.find((s) => s.time === '21:30')!.state).toBe('available'); // after the window ends
    if (a.ok) store.cancel(a.reservation.id, NOW);
    expect(store.create(input({ requestedArea: 'chefs-counter', party: 2, guest: { name: 'Cy Three', email: 'c@x.io', phone: '5550003333' } }), NOW).ok).toBe(true);
  });
  it('flags limited availability when few seats remain', () => {
    const store = memoryStore();
    store.create(input({ requestedArea: 'bar', party: 4, guest: { name: 'Ann One', email: 'a@x.io', phone: '5550001111' } }), NOW);
    store.create(input({ requestedArea: 'bar', party: 4, guest: { name: 'Bob Two', email: 'b@x.io', phone: '5550002222' } }), NOW);
    store.create(input({ requestedArea: 'bar', party: 3, guest: { name: 'Dee Four', email: 'd@x.io', phone: '5550004444' } }), NOW);
    const s = getAvailability(q({ party: 2, requestedArea: 'bar', reservations: store.getSnapshot() })).find((x) => x.time === '19:00')!;
    expect(s.state).toBe('limited');
    expect(s.remaining).toBe(3);
  });
});

describe('validateBooking', () => {
  const ctx = { settings, reservations: [] as Reservation[], now: NOW };
  it('accepts a valid booking', () => {
    const r = validateBooking(input(), ctx);
    expect(r.errors).toEqual({});
    expect(r.areaId).toBe('dining-room');
  });
  it('rejects past, closed and out-of-window dates', () => {
    expect(validateBooking(input({ dateKey: '2026-03-01' }), ctx).errors.date).toMatch(/passed/);
    expect(validateBooking(input({ dateKey: MON }), ctx).errors.date).toMatch(/closed/i);
    expect(validateBooking(input({ dateKey: '2027-01-01' }), ctx).errors.date).toMatch(/ahead/);
    expect(validateBooking(input({ dateKey: '' }), ctx).errors.date).toBeTruthy();
  });
  it('rejects invalid or out-of-hours times and too-soon same-day times', () => {
    expect(validateBooking(input({ time: '' }), ctx).errors.time).toBeTruthy();
    expect(validateBooking(input({ time: '25:99' }), ctx).errors.time).toMatch(/outside/);
    expect(validateBooking(input({ time: '19:10' }), ctx).errors.time).toMatch(/outside/);
    expect(validateBooking(input({ time: '23:00' }), ctx).errors.time).toMatch(/outside/);
    expect(validateBooking(input({ dateKey: '2026-03-04', time: '17:30' }), ctx).errors.time).toBeUndefined();
    expect(validateBooking(input({ dateKey: '2026-03-04', time: '12:30' }), { ...ctx, now: new Date(2026, 2, 4, 12, 0) }).errors.time).toMatch(/outside|passed/);
  });
  it('enforces party-size limits', () => {
    expect(validateBooking(input({ party: 0 }), ctx).errors.party).toBeTruthy();
    expect(validateBooking(input({ party: 11 }), ctx).errors.party).toMatch(/private dining/i);
    expect(validateBooking(input({ party: 1.5 }), ctx).errors.party).toBeTruthy();
    expect(validateBooking(input({ party: 5, requestedArea: 'bar' }), ctx).errors.area).toMatch(/Bar/);
  });
  it('validates contact details and note length', () => {
    const e = validateBooking(input({ guest: { name: '', email: 'nope', phone: 'abc' }, note: 'x'.repeat(301) }), ctx).errors;
    expect(e.name && e.email && e.phone && e.note).toBeTruthy();
  });
});

describe('reservation store: save, modify, cancel, duplicates', () => {
  let store: ReturnType<typeof memoryStore>;
  beforeEach(() => { store = memoryStore(); });
  it('saves a reservation with a code and persists through the backing store', () => {
    const r = store.create(input(), NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.reservation.code).toMatch(/^ST-[A-Z2-9]{6}$/);
    expect(r.reservation.status).toBe('confirmed');
    expect(store.getSnapshot()).toHaveLength(1);
    expect(makeCode(() => 0)).toBe('ST-AAAAAA');
  });
  it('prevents duplicate bookings by email on the same date (case-insensitive)', () => {
    expect(store.create(input(), NOW).ok).toBe(true);
    const dup = store.create(input({ time: '20:00', guest: { name: 'Ada L', email: 'ADA@example.com', phone: '5550001111' } }), NOW);
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.errors.duplicate).toMatch(/already has reservation/);
    expect(store.create(input({ dateKey: '2026-03-07' }), NOW).ok).toBe(true); // different date is fine
  });
  it('allows booking again after cancelling', () => {
    const r = store.create(input(), NOW);
    if (!r.ok) throw new Error('setup');
    expect(store.cancel(r.reservation.id, NOW).ok).toBe(true);
    expect(store.create(input(), NOW).ok).toBe(true);
  });
  it('modifies a reservation without tripping duplicate or capacity checks against itself', () => {
    const r = store.create(input(), NOW);
    if (!r.ok) throw new Error('setup');
    const m = store.update(r.reservation.id, input({ time: '20:30', party: 4 }), NOW);
    expect(m.ok).toBe(true);
    if (m.ok) {
      expect(m.reservation.time).toBe('20:30');
      expect(m.reservation.party).toBe(4);
      expect(m.reservation.code).toBe(r.reservation.code);
    }
    expect(store.getSnapshot()).toHaveLength(1);
  });
  it('rejects invalid modifications and keeps the original', () => {
    const r = store.create(input(), NOW);
    if (!r.ok) throw new Error('setup');
    expect(store.update(r.reservation.id, input({ dateKey: MON }), NOW).ok).toBe(false);
    expect(store.getSnapshot()[0].dateKey).toBe(FRI);
  });
  it('cancels once, then refuses further changes', () => {
    const r = store.create(input(), NOW);
    if (!r.ok) throw new Error('setup');
    const c = store.cancel(r.reservation.id, NOW);
    expect(c.ok && c.reservation.status).toBe('cancelled');
    expect(store.cancel(r.reservation.id, NOW).ok).toBe(false);
    expect(store.update(r.reservation.id, input(), NOW).ok).toBe(false);
  });
  it('refuses to cancel or modify past reservations', () => {
    const r = store.create(input(), NOW);
    if (!r.ok) throw new Error('setup');
    const later = new Date(2026, 2, 10, 12);
    expect(store.cancel(r.reservation.id, later).ok).toBe(false);
    expect(store.update(r.reservation.id, input(), later).ok).toBe(false);
  });
  it('notifies subscribers and can remove/clear', () => {
    let calls = 0;
    store.subscribe(() => calls++);
    const r = store.create(input(), NOW);
    expect(calls).toBe(1);
    if (r.ok) store.remove(r.reservation.id);
    expect(store.getSnapshot()).toHaveLength(0);
    store.clear();
    expect(calls).toBe(3);
  });
  it('toDateKey formats local dates', () => {
    expect(toDateKey(NOW)).toBe('2026-03-04');
  });
});
