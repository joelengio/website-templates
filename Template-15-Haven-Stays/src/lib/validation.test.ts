import { describe, expect, it } from 'vitest';
import { rooms } from '../config/rooms';
import { defaultLimits, validateContact, validateDates, validateGuest, validateGuests, validateStay } from './validation';

const limits = defaultLimits('2026-05-01');
const codes = (e: { code: string }[]) => e.map((x) => x.code);

describe('date validation', () => {
  it('requires both dates', () => {
    expect(codes(validateDates({ checkIn: null, checkOut: null }, limits))).toEqual(['CHECKIN_MISSING', 'CHECKOUT_MISSING']);
  });
  it('rejects malformed dates', () => {
    expect(codes(validateDates({ checkIn: '2026-02-30', checkOut: '2026-03-02' }, limits))).toContain('DATE_INVALID');
  });
  it('rejects past check-in', () => {
    expect(codes(validateDates({ checkIn: '2026-04-30', checkOut: '2026-05-03' }, limits))).toContain('CHECKIN_PAST');
  });
  it('rejects check-out before check-in and zero-night stays', () => {
    expect(codes(validateDates({ checkIn: '2026-05-10', checkOut: '2026-05-08' }, limits))).toContain('CHECKOUT_BEFORE_CHECKIN');
    expect(codes(validateDates({ checkIn: '2026-05-10', checkOut: '2026-05-10' }, limits))).toContain('ZERO_NIGHTS');
  });
  it('accepts today as check-in and enforces max length and advance window', () => {
    expect(validateDates({ checkIn: '2026-05-01', checkOut: '2026-05-03' }, limits)).toEqual([]);
    expect(codes(validateDates({ checkIn: '2026-05-10', checkOut: '2026-06-15' }, limits))).toContain('TOO_LONG');
    expect(codes(validateDates({ checkIn: '2028-05-10', checkOut: '2028-05-12' }, limits))).toContain('TOO_FAR');
  });
  it('enforces the seasonal minimum stay', () => {
    expect(codes(validateDates({ checkIn: '2026-07-10', checkOut: '2026-07-11' }, limits))).toEqual(['MIN_NIGHTS']);
    expect(validateDates({ checkIn: '2026-07-10', checkOut: '2026-07-13' }, limits)).toEqual([]);
  });
});

describe('occupancy validation', () => {
  const king = rooms.find((r) => r.id === 'garden-king')!; // 2 adults + 1 child, max 3
  const loft = rooms.find((r) => r.id === 'hillside-loft')!; // adults only
  const family = rooms.find((r) => r.id === 'family-residence')!; // 4 + 4, max 6
  it('needs at least one adult', () => {
    expect(codes(validateGuests(0, 2))).toEqual(['ADULTS_MIN']);
  });
  it('rejects too many adults, children and total guests', () => {
    expect(codes(validateGuests(3, 0, king))).toEqual(['ADULTS_MAX']);
    expect(codes(validateGuests(2, 2, king))).toEqual(['CHILDREN', 'OCCUPANCY']);
    expect(codes(validateGuests(4, 3, family))).toEqual(['OCCUPANCY']);
  });
  it('treats adults-only rooms correctly', () => {
    expect(validateGuests(2, 1, loft)[0].message).toMatch(/adults only/);
    expect(validateGuests(2, 0, loft)).toEqual([]);
  });
  it('accepts valid parties at the limit', () => {
    expect(validateGuests(2, 1, king)).toEqual([]);
    expect(validateGuests(4, 2, family)).toEqual([]);
  });
  it('validateStay combines both', () => {
    expect(codes(validateStay({ checkIn: '2026-05-10', checkOut: '2026-05-10', adults: 5, children: 0 }, limits, king))).toEqual(['ZERO_NIGHTS', 'ADULTS_MAX', 'OCCUPANCY']);
  });
});

describe('form validation', () => {
  it('validates guest details', () => {
    expect(validateGuest({ firstName: 'A', lastName: '', email: 'x', phone: 'abc', requests: '' })).toEqual({
      firstName: expect.any(String), lastName: expect.any(String), email: expect.any(String), phone: expect.any(String),
    });
    expect(validateGuest({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', phone: '+44 20 7946 0000', requests: '' })).toEqual({});
  });
  it('validates the contact form', () => {
    expect(Object.keys(validateContact({ name: '', email: 'bad', topic: '', message: 'short' })).sort()).toEqual(['email', 'message', 'name', 'topic']);
    expect(validateContact({ name: 'Ada', email: 'ada@example.com', topic: 'General', message: 'Hello there, a question.' })).toEqual({});
  });
});
