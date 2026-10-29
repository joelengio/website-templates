import { describe, expect, it } from 'vitest';
import { rooms } from '../config/rooms';
import { defaultFilters, filterRooms, readFilters, writeFilters } from './filters';

const max = 1500;
const f = (p = {}) => ({ ...defaultFilters(max), ...p });

describe('room filters', () => {
  it('lists all rooms by default with featured first', () => {
    const r = filterRooms(rooms, f());
    expect(r).toHaveLength(10);
    expect(r[0].featured).toBe(true);
  });
  it('filters by category', () => {
    expect(filterRooms(rooms, f({ category: 'Suites' })).map((r) => r.id).sort()).toEqual(['owners-suite', 'terrace-suite', 'wellness-suite']);
    expect(filterRooms(rooms, f({ category: 'Family' }))).toHaveLength(1);
  });
  it('filters by guest capacity', () => {
    expect(filterRooms(rooms, f({ guests: 5 })).map((r) => r.id)).toEqual(['family-residence']);
    expect(filterRooms(rooms, f({ guests: 4 })).every((r) => r.maxOccupancy >= 4)).toBe(true);
  });
  it('filters by price and amenities (AND semantics)', () => {
    expect(filterRooms(rooms, f({ maxPrice: 300 })).every((r) => r.baseRate <= 300)).toBe(true);
    const plunge = filterRooms(rooms, f({ amenities: ['plunge'] })).map((r) => r.id).sort();
    expect(plunge).toEqual(['owners-suite', 'pool-villa']);
    expect(filterRooms(rooms, f({ amenities: ['plunge', 'fireplace'] }))).toEqual([]);
  });
  it('searches text case-insensitively', () => {
    expect(filterRooms(rooms, f({ q: 'POOL' })).map((r) => r.id)).toContain('pool-villa');
    expect(filterRooms(rooms, f({ q: 'zzzz' }))).toEqual([]);
  });
  it('sorts', () => {
    const asc = filterRooms(rooms, f({ sort: 'price-asc' })).map((r) => r.baseRate);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = filterRooms(rooms, f({ sort: 'price-desc' })).map((r) => r.baseRate);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
    expect(filterRooms(rooms, f({ sort: 'size-desc' }))[0].id).toBe('owners-suite');
  });
  it('hides rooms configured with zero units', () => {
    expect(filterRooms(rooms.map((r) => (r.id === 'loft' ? r : { ...r, units: r.id === 'garden-king' ? 0 : r.units })), f())).toHaveLength(9);
  });
  it('round-trips through URL params and ignores garbage', () => {
    const state = f({ q: 'sea', category: 'Rooms', guests: 3, maxPrice: 400, amenities: ['seaview'], sort: 'price-desc' as const });
    expect(readFilters(writeFilters(state, max, new URLSearchParams()), max)).toEqual(state);
    expect(readFilters(new URLSearchParams('guests=abc&maxPrice=-5&sort=evil&am=,'), max)).toEqual(f());
  });
});
