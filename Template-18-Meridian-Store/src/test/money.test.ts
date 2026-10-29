import { describe, expect, it } from 'vitest';
import { clampInt, currencyDigits, formatMoney, percentOf, taxIncludedIn, toMajor, toMinor } from '../lib/money';

describe('money', () => {
  it('converts major to minor units without floating-point drift', () => {
    expect(toMinor(1.005)).toBe(101);
    expect(toMinor(0.1 + 0.2)).toBe(30);
    expect(toMinor(62.5)).toBe(6250);
    expect(toMinor(19.99)).toBe(1999);
    expect(toMinor(Number.NaN)).toBe(0);
    expect(toMinor(Infinity)).toBe(0);
    expect(toMinor(5000, 0)).toBe(5000);
    expect(toMajor(1999)).toBeCloseTo(19.99);
  });
  it('knows currency digits', () => {
    expect(currencyDigits('USD')).toBe(2);
    expect(currencyDigits('JPY', 'en-US')).toBe(0);
    expect(currencyDigits('XXXX')).toBe(2);
  });
  it('formats currencies for several locales', () => {
    expect(formatMoney(12345)).toBe('$123.45');
    expect(formatMoney(12300, { compact: true })).toBe('$123');
    expect(formatMoney(12345, { compact: true })).toBe('$123.45');
    expect(formatMoney(12345, { currency: 'EUR', locale: 'de-DE' })).toMatch(/123,45\s*€/);
    expect(formatMoney(5000, { currency: 'JPY', locale: 'en-US' })).toBe('¥5,000');
    expect(formatMoney(-250)).toBe('-$2.50');
  });
  it('falls back gracefully for an invalid currency code or value', () => {
    expect(formatMoney(100, { currency: 'XXXX' })).toBe('XXXX 1.00');
    expect(formatMoney(Number.NaN)).toBe('$0.00');
  });
  it('rounds percentages half-up using integers', () => {
    expect(percentOf(1005, 10)).toBe(101);
    expect(percentOf(1004, 10)).toBe(100);
    expect(percentOf(31770, 6)).toBe(1906);
    expect(percentOf(10000, 8.875)).toBe(888);
    expect(percentOf(-5, 10)).toBe(0);
    expect(percentOf(1000, -5)).toBe(0);
  });
  it('extracts tax from inclusive amounts', () => {
    expect(taxIncludedIn(12000, 20)).toBe(2000);
    expect(taxIncludedIn(13200, 20)).toBe(2200);
    expect(taxIncludedIn(1000, 0)).toBe(0);
  });
  it('clamps integers safely', () => {
    expect(clampInt(15, 1, 10)).toBe(10);
    expect(clampInt(-3, 1, 10)).toBe(1);
    expect(clampInt(Number.NaN, 1, 10)).toBe(1);
    expect(clampInt(4.9, 1, 10)).toBe(4);
  });
});
