import { beforeEach, describe, expect, it } from 'vitest';
import { rooms } from '../config/rooms';
import { addDays, diffDays } from './dates';
import { cancellationFee, freeCancelBy, memoryStorage, ReservationStore } from './reservations';
import { availability } from './availability';
import { today } from './stay';

const guest = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', phone: '+44 20 7946 0000', requests: '' };
let store: ReservationStore;
const t = today();

/** First stay of `nights` nights starting at least `from` days away where the room is free in the simulation. */
function openStay(roomId: string, nights = 3, from = 20) {
  const room = rooms.find((r) => r.id === roomId)!;
  for (let d = from; d < 400; d++) {
    const start = addDays(t, d);
    const end = addDays(start, nights);
    if (availability(room, start, end).available) return { checkIn: start, checkOut: end };
  }
  throw new Error('no open stay');
}
const base = (roomId = 'garden-king', ratePlanId = 'flexible') => ({ roomId, ratePlanId, adults: 2, children: 0, guest, ...openStay(roomId) });

beforeEach(() => {
  memoryStorage.setItem('test', '[]');
  store = new ReservationStore(() => memoryStorage, `test-${Math.random()}`);
});

describe('ReservationStore', () => {
  it('creates, persists and re-reads a reservation with a frozen quote', () => {
    const r = store.create(base());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.id).toMatch(/^HS-[A-Z0-9]{6}$/);
    expect(r.value.status).toBe('confirmed');
    expect(r.value.quote.nights).toBe(3);
    expect(store.list()).toHaveLength(1);
    expect(store.get(r.value.id.toLowerCase())?.id).toBe(r.value.id);
    // a second store instance on the same storage key sees the data (persistence)
    const again = new ReservationStore(() => memoryStorage, (store as unknown as { key: string }).key);
    expect(again.list()).toHaveLength(1);
  });
  it('rejects invalid input instead of trusting the UI', () => {
    const b = base();
    expect(store.create({ ...b, checkOut: b.checkIn })).toMatchObject({ ok: false, code: 'ZERO_NIGHTS' });
    expect(store.create({ ...b, checkIn: b.checkOut, checkOut: b.checkIn })).toMatchObject({ ok: false, code: 'CHECKOUT_BEFORE_CHECKIN' });
    expect(store.create({ ...b, adults: 3 })).toMatchObject({ ok: false, code: 'ADULTS_MAX' });
    expect(store.create({ ...b, adults: 2, children: 2 })).toMatchObject({ ok: false });
    expect(store.create({ ...b, checkIn: addDays(t, -2), checkOut: addDays(t, 1) })).toMatchObject({ ok: false, code: 'CHECKIN_PAST' });
    expect(store.create({ ...b, roomId: 'nope' })).toMatchObject({ ok: false, code: 'ROOM' });
    expect(store.create({ ...b, ratePlanId: 'nope' })).toMatchObject({ ok: false, code: 'PLAN' });
    expect(store.create({ ...b, guest: { ...guest, email: 'bad' } })).toMatchObject({ ok: false, code: 'GUEST' });
    expect(store.list()).toHaveLength(0);
  });
  it('blocks duplicates for the same guest, room and overlapping dates', () => {
    const b = base();
    expect(store.create(b).ok).toBe(true);
    expect(store.create(b)).toMatchObject({ ok: false, code: 'DUPLICATE' });
    expect(store.create({ ...b, guest: { ...guest, email: 'ADA@example.com ' } })).toMatchObject({ ok: false, code: 'DUPLICATE' });
    expect(store.create({ ...b, guest: { ...guest, email: 'grace@example.com' } }).ok).toBe(true);
  });
  it('local reservations consume inventory: the single Owner’s Suite cannot be booked twice', () => {
    const b = base('owners-suite');
    expect(store.create(b).ok).toBe(true);
    expect(store.create({ ...b, guest: { ...guest, email: 'other@example.com' } })).toMatchObject({ ok: false, code: 'UNAVAILABLE' });
  });
  it('changes dates, re-prices and ignores its own booking when checking availability', () => {
    const b = base('owners-suite');
    const r = store.create(b);
    if (!r.ok) throw new Error('create failed');
    const shorter = store.change(r.value.id, { checkOut: addDays(b.checkIn, 2) });
    expect(shorter.ok).toBe(true);
    if (shorter.ok) {
      expect(shorter.value.quote.nights).toBe(2);
      expect(shorter.value.quote.total).toBeLessThan(r.value.quote.total);
      expect(shorter.value.history).toHaveLength(2);
    }
    expect(store.change(r.value.id, { checkOut: b.checkIn })).toMatchObject({ ok: false, code: 'ZERO_NIGHTS' });
  });
  it('refuses changes that would exceed capacity and non-refundable changes', () => {
    const r = store.create(base());
    if (!r.ok) throw new Error('create failed');
    expect(store.change(r.value.id, { adults: 4 })).toMatchObject({ ok: false });
    const nr = store.create({ ...base('garden-twin', 'non-refundable'), guest: { ...guest, email: 'x@example.com' } });
    if (!nr.ok) throw new Error('create failed');
    expect(store.change(nr.value.id, { checkOut: addDays(nr.value.checkOut, 1) })).toMatchObject({ ok: false, code: 'NON_REFUNDABLE' });
  });
  it('cancels, frees inventory and cannot cancel twice', () => {
    const b = base('owners-suite');
    const r = store.create(b);
    if (!r.ok) throw new Error('create failed');
    const c = store.cancel(r.value.id);
    expect(c.ok).toBe(true);
    if (c.ok) {
      expect(c.value.status).toBe('cancelled');
      expect(c.value.cancellationFee).toBe(0); // far in the future → free on flexible
    }
    expect(store.cancel(r.value.id)).toMatchObject({ ok: false, code: 'CANCELLED' });
    expect(store.create({ ...b, guest: { ...guest, email: 'other@example.com' } }).ok).toBe(true);
    expect(store.change(r.value.id, { adults: 1 })).toMatchObject({ ok: false, code: 'CANCELLED' });
  });
  it('survives corrupt storage', () => {
    memoryStorage.setItem('corrupt', '{not json');
    expect(new ReservationStore(() => memoryStorage, 'corrupt').list()).toEqual([]);
    memoryStorage.setItem('wrong', '{"a":1}');
    expect(new ReservationStore(() => memoryStorage, 'wrong').list()).toEqual([]);
  });
});

describe('cancellation policy', () => {
  const q = { nightly: [{ rate: 20000 }, { rate: 25000 }, { rate: 30000 }], total: 99999 } as never;
  it('is free before the deadline and charges nights afterwards', () => {
    const r = { ratePlanId: 'flexible', checkIn: '2026-09-10', quote: q };
    expect(freeCancelBy(r)).toBe('2026-09-07');
    expect(cancellationFee(r, '2026-09-07')).toBe(0);
    expect(cancellationFee(r, '2026-09-08')).toBe(20000);
    expect(cancellationFee({ ...r, ratePlanId: 'advance-saver' }, '2026-08-27')).toBe(0);
    expect(cancellationFee({ ...r, ratePlanId: 'advance-saver' }, '2026-08-28')).toBe(45000);
    expect(cancellationFee({ ...r, ratePlanId: 'non-refundable' }, '2026-01-01')).toBe(99999);
    expect(freeCancelBy({ ...r, ratePlanId: 'non-refundable' })).toBeNull();
    expect(diffDays('2026-09-07', '2026-09-10')).toBe(3);
  });
});
