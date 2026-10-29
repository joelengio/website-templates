import { describe, expect, it } from 'vitest';
import { rooms } from '../config/rooms';
import { availability, hash, simulatedBooked, unitsLeft } from './availability';

const owners = rooms.find((r) => r.id === 'owners-suite')!;
const king = rooms.find((r) => r.id === 'garden-king')!;

describe('simulated availability', () => {
  it('is deterministic', () => {
    expect(hash('a')).toBe(hash('a'));
    expect(simulatedBooked(king, '2026-07-14')).toBe(simulatedBooked(king, '2026-07-14'));
  });
  it('never exceeds unit counts and can be switched off', () => {
    for (let i = 1; i < 60; i++) {
      const d = `2026-08-${String((i % 28) + 1).padStart(2, '0')}`;
      const b = simulatedBooked(king, d);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(king.units);
    }
    expect(simulatedBooked(king, '2026-08-01', undefined, false)).toBe(0);
  });
  it('local reservations consume units, cancelled ones do not', () => {
    const nights = { checkIn: '2026-03-10', checkOut: '2026-03-12' };
    const base = unitsLeft(owners, '2026-03-10', [], undefined, undefined, false);
    expect(base).toBe(1);
    const res = [{ id: 'A', roomId: owners.id, ...nights, status: 'confirmed' as const }];
    expect(unitsLeft(owners, '2026-03-10', res, undefined, undefined, false)).toBe(0);
    expect(unitsLeft(owners, '2026-03-11', res, undefined, undefined, false)).toBe(0);
    expect(unitsLeft(owners, '2026-03-12', res, undefined, undefined, false)).toBe(1); // check-out day is free
    expect(unitsLeft(owners, '2026-03-10', [{ ...res[0], status: 'cancelled' }], undefined, undefined, false)).toBe(1);
    expect(unitsLeft(owners, '2026-03-10', res, 'A', undefined, false)).toBe(1); // excluding itself when editing
  });
  it('reports sold out when any night has zero left', () => {
    const res = [{ id: 'A', roomId: owners.id, checkIn: '2026-03-11', checkOut: '2026-03-12', status: 'confirmed' as const }];
    const a = availability(owners, '2026-03-10', '2026-03-13', res, undefined, undefined, false);
    expect(a.available).toBe(false);
    expect(a.firstSoldOut).toBe('2026-03-11');
  });
  it('zero or negative ranges are never available', () => {
    expect(availability(king, '2026-03-10', '2026-03-10', [], undefined, undefined, false).available).toBe(false);
    expect(availability(king, '2026-03-11', '2026-03-10', [], undefined, undefined, false).available).toBe(false);
  });
});
