import { describe, expect, it, beforeEach } from 'vitest';
import { bookableDates, getSlots, hash01, hoursFor, isOpenDate, resolveStaff } from './availability';
import { staff } from '../config/staff';
import { addBooking, cancelBooking, getBookings, resetBookingsCache, updateBooking, type BookingRecord } from './bookings';
import { eligibleStaff, resolveService, servicePrice } from './booking-logic';
import { validateContact, validateCustomer, isEmail } from './validation';
import { formatDuration, formatPrice, parseISODate, toISODate } from './format';

const base = (over: Partial<BookingRecord> = {}): Omit<BookingRecord, 'id' | 'reference' | 'status' | 'createdAt'> => ({
  service: { kind: 'treatment', slug: 'signature-serene-massage', name: 'Signature Serene Massage', optionLabel: '1 hr' },
  staffId: staff[0].id, staffName: staff[0].name, staffPreference: 'any', date: '2030-01-07', time: '10:00', durationMinutes: 60, guests: 1, total: 145,
  customer: { name: 'Test User', email: 't@example.com', phone: '', notes: '' }, ...over
});

describe('formatting', () => {
  it('formats durations and prices', () => {
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(90)).toBe('1 hr 30 min');
    expect(formatDuration(120)).toBe('2 hr');
    expect(formatPrice(145)).toBe('$145');
  });
  it('round-trips local ISO dates without timezone shifts', () => {
    expect(toISODate(parseISODate('2030-03-01'))).toBe('2030-03-01');
  });
});

describe('availability', () => {
  it('is deterministic', () => {
    expect(hash01('a|b|1')).toBe(hash01('a|b|1'));
    expect(hash01('a|b|1')).not.toBe(hash01('a|b|2'));
  });
  it('treats Sunday as closed and weekdays as open (default config)', () => {
    expect(hoursFor('2030-01-06')?.open).toBeNull(); // Sunday
    expect(isOpenDate('2030-01-06')).toBe(false);
    expect(isOpenDate('2030-01-07')).toBe(true);
  });
  it('returns the configured booking window with closed days flagged', () => {
    const days = bookableDates(new Date(2030, 0, 1));
    expect(days).toHaveLength(42);
    expect(days[0].iso).toBe('2030-01-02');
    expect(days.find((d) => d.iso === '2030-01-06')?.open).toBe(false);
  });
  it('generates no slots for closed days and respects closing time', () => {
    expect(getSlots({ iso: '2030-01-06', durationMinutes: 60, pool: staff, bookings: [] })).toEqual([]);
    const slots = getSlots({ iso: '2030-01-07', durationMinutes: 180, pool: staff, bookings: [] });
    expect(slots[0].time).toBe('09:00');
    expect(slots.at(-1)!.time <= '16:00').toBe(true); // 19:00 close - 3h
  });
  it('blocks a therapist who already has a local booking at that time', () => {
    const iso = '2030-01-07';
    const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    const pairs = staff.flatMap((m) => times.map((t) => ({ m, t }))).filter(({ m, t }) => m.workingDays.includes(1) && resolveStaff([m], iso, t, 60, []));
    expect(pairs.length).toBeGreaterThan(0);
    const { m: member, t: time } = pairs[0];
    const bookings = [{ ...base({ date: iso, time, staffId: member.id }), id: 'x', reference: 'R', status: 'confirmed', createdAt: '' } as BookingRecord];
    expect(resolveStaff([member], iso, time, 60, bookings)).toBeUndefined();
    expect(resolveStaff([member], iso, time, 60, bookings, 'x')).toBe(member); // ignoring itself (reschedule)
    const cancelled = [{ ...bookings[0], status: 'cancelled' } as BookingRecord];
    expect(resolveStaff([member], iso, time, 60, cancelled)).toBe(member);
  });
});

describe('booking store', () => {
  beforeEach(() => { window.localStorage.clear(); resetBookingsCache(); });
  it('adds, persists, reschedules and cancels bookings', () => {
    const b = addBooking(base());
    expect(b.reference).toMatch(/^SH-[A-Z2-9]{6}$/);
    expect(JSON.parse(window.localStorage.getItem('serene-house-demo-bookings-v1')!)).toHaveLength(1);
    updateBooking(b.id, { date: '2030-01-08' });
    expect(getBookings()[0].date).toBe('2030-01-08');
    cancelBooking(b.id);
    expect(getBookings()[0].status).toBe('cancelled');
  });
  it('survives corrupt storage', () => {
    window.localStorage.setItem('serene-house-demo-bookings-v1', '{not json');
    resetBookingsCache();
    expect(getBookings()).toEqual([]);
  });
});

describe('services & pricing', () => {
  it('resolves treatment options and prices per guest', () => {
    const s = resolveService('treatment', 'signature-serene-massage', 90)!;
    expect(s.durationMinutes).toBe(90);
    expect(servicePrice(s, 2)).toBe(410);
  });
  it('treats couples packages as a fixed two-guest price', () => {
    const s = resolveService('package', 'couples-harmony')!;
    expect(s.fixedGuests).toBe(true);
    expect(servicePrice(s, 2)).toBe(499);
  });
  it('returns undefined for unknown slugs', () => {
    expect(resolveService('treatment', 'nope')).toBeUndefined();
  });
  it('limits therapists to matching specialties', () => {
    const facial = resolveService('treatment', 'luminous-botanical-facial')!;
    expect(eligibleStaff(facial).every((m) => m.specialties.includes('facial'))).toBe(true);
    expect(eligibleStaff(resolveService('package', 'garden-spa-day'))).toHaveLength(staff.length);
  });
});

describe('validation', () => {
  it('validates emails', () => {
    expect(isEmail('a@b.co')).toBe(true);
    expect(isEmail('a@b')).toBe(false);
    expect(isEmail('a b@c.com')).toBe(false);
  });
  it('validates customer details', () => {
    expect(Object.keys(validateCustomer({ name: '', email: '', phone: '', notes: '' }))).toEqual(['name', 'email']);
    expect(validateCustomer({ name: 'Ann', email: 'ann@example.com', phone: '+1 (555) 010-0142', notes: '' })).toEqual({});
    expect(validateCustomer({ name: 'Ann', email: 'ann@example.com', phone: 'abc', notes: '' }).phone).toBeTruthy();
    expect(validateCustomer({ name: 'Ann', email: 'ann@example.com', phone: '', notes: 'x'.repeat(501) }).notes).toBeTruthy();
  });
  it('validates contact messages', () => {
    expect(Object.keys(validateContact({ name: '', email: 'bad', subject: '', message: 'short' })).sort()).toEqual(['email', 'message', 'name', 'subject']);
    expect(validateContact({ name: 'Ann', email: 'ann@example.com', subject: 'Hello', message: 'A long enough message.' })).toEqual({});
  });
});
