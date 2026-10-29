import { describe, expect, it } from 'vitest';
import { properties } from '../config/properties';
import { defaultFilters, filterProperties, parseFilters, serializeFilters, sortProperties } from './filters';
import { validateInquiry, type InquiryValues } from './validation';
import { resolveSections } from './sections';
import { formatPrice } from './format';
import { describeFilters, filtersFromSaved, readSavedSearches, searchQuery, writeSavedSearches, MAX_SAVED_SEARCHES } from './savedSearches';

describe('filters', () => {
  it('returns everything with default filters', () => {
    expect(filterProperties(properties, defaultFilters)).toHaveLength(properties.length);
  });
  it('searches by keyword across fields', () => {
    const r = filterProperties(properties, { ...defaultFilters, q: 'fernhill timber' });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.neighborhood === 'Fernhill' || /timber/i.test(JSON.stringify(p)))).toBe(true);
  });
  it('combines multiple filters with AND semantics', () => {
    const r = filterProperties(properties, { ...defaultFilters, types: ['Villa'], features: ['pool'], minPrice: 4000000, beds: 5 });
    expect(r.length).toBeGreaterThan(0);
    for (const p of r) {
      expect(p.type).toBe('Villa');
      expect(p.features).toContain('pool');
      expect(p.price).toBeGreaterThanOrEqual(4000000);
      expect(p.bedrooms).toBeGreaterThanOrEqual(5);
    }
  });
  it('can produce an empty result', () => {
    expect(filterProperties(properties, { ...defaultFilters, types: ['Apartment'], minPrice: 5000000 })).toHaveLength(0);
  });
  it('hides under-offer homes on request', () => {
    const r = filterProperties(properties, { ...defaultFilters, availableOnly: true });
    expect(r.every((p) => p.status === 'available')).toBe(true);
    expect(r.length).toBeLessThan(properties.length);
  });
  it('sorts by price both ways', () => {
    const asc = sortProperties(properties, 'price-asc').map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = sortProperties(properties, 'price-desc').map((p) => p.price);
    expect(desc).toEqual([...asc].reverse());
  });
  it('round-trips through URL params and ignores junk', () => {
    const f = { ...defaultFilters, q: 'pool', types: ['Villa', 'Cottage'], maxPrice: 3000000, beds: 3, sort: 'newest' as const };
    expect(parseFilters(serializeFilters(f))).toMatchObject(f);
    expect(parseFilters(new URLSearchParams('sort=bogus&min=abc&beds=-2')).sort).toBe('featured');
    expect(parseFilters(new URLSearchParams('min=abc')).minPrice).toBeNull();
  });
});

describe('inquiry validation', () => {
  const ok: InquiryValues = { name: 'Ada Lovelace', email: 'ada@example.com', phone: '', topic: 'viewing', propertyId: '', message: 'I would like to visit.', consent: true, website: '' };
  it('accepts valid input', () => expect(validateInquiry(ok)).toEqual({}));
  it('flags every bad field', () => {
    const e = validateInquiry({ ...ok, name: '', email: 'nope', phone: 'abc', topic: '', message: 'hi', consent: false });
    expect(Object.keys(e).sort()).toEqual(['consent', 'email', 'message', 'name', 'phone', 'topic']);
  });
});

describe('sections + format', () => {
  it('drops disabled, unknown and duplicate sections and keeps order', () => {
    const r = resolveSections(
      [{ id: 'b', enabled: true }, { id: 'a', enabled: false }, { id: 'zzz', enabled: true }, { id: 'b', enabled: true }, { id: 'c', enabled: true }],
      ['a', 'b', 'c'],
    );
    expect(r).toEqual(['b', 'c']);
  });
  it('formats prices in the configured currency', () => expect(formatPrice(2450000)).toBe('$2,450,000'));
});

describe('saved searches', () => {
  const combo = { ...defaultFilters, types: ['Villa'], areas: ['Saltmarsh Bay'], beds: 4, maxPrice: 5000000, sort: 'price-desc' as const };
  it('round-trips a combined filter set through its stored query', () => {
    const restored = filtersFromSaved({ id: 'x', name: 'n', query: searchQuery(combo), savedAt: '' });
    expect(restored).toEqual(combo);
    expect(filterProperties(properties, restored).map((p) => p.id)).toEqual(filterProperties(properties, combo).map((p) => p.id));
  });
  it('describes filters briefly', () => {
    expect(describeFilters(combo)).toBe('Villa · Saltmarsh Bay · 4+ beds · up to $5M');
    expect(describeFilters({ ...combo, features: ['pool', 'gym'] })).toMatch(/\+\d$/);
  });
  it('persists to localStorage, ignores junk and caps the list', () => {
    localStorage.clear();
    expect(readSavedSearches()).toEqual([]);
    const many = Array.from({ length: MAX_SAVED_SEARCHES + 3 }, (_, i) => ({ id: `i${i}`, name: `n${i}`, query: `q=${i}`, savedAt: '' }));
    writeSavedSearches(many);
    expect(readSavedSearches()).toHaveLength(MAX_SAVED_SEARCHES);
    localStorage.setItem(Object.keys(localStorage)[0], '{not json');
    expect(readSavedSearches()).toEqual([]);
    localStorage.setItem(Object.keys(localStorage)[0], JSON.stringify([{ id: 1 }, null, 'x']));
    expect(readSavedSearches()).toEqual([]);
  });
});
