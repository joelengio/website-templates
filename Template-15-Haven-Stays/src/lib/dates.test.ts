import { describe, expect, it } from 'vitest';
import { addDays, addMonths, diffDays, inMonthDayRange, isValidISO, monthGrid, nightsBetween, weekday } from './dates';

describe('dates', () => {
  it('validates ISO dates including leap days', () => {
    expect(isValidISO('2028-02-29')).toBe(true);
    expect(isValidISO('2027-02-29')).toBe(false);
    expect(isValidISO('2026-13-01')).toBe(false);
    expect(isValidISO('26-1-1')).toBe(false);
    expect(isValidISO('')).toBe(false);
  });
  it('counts nights across month, year and DST boundaries', () => {
    expect(diffDays('2026-03-28', '2026-04-02')).toBe(5);
    expect(diffDays('2026-12-30', '2027-01-02')).toBe(3);
    expect(diffDays('2026-10-24', '2026-10-27')).toBe(3);
    expect(diffDays('2026-05-05', '2026-05-05')).toBe(0);
    expect(diffDays('2026-05-06', '2026-05-05')).toBe(-1);
  });
  it('lists night dates (check-out excluded)', () => {
    expect(nightsBetween('2026-06-29', '2026-07-02')).toEqual(['2026-06-29', '2026-06-30', '2026-07-01']);
    expect(nightsBetween('2026-06-29', '2026-06-29')).toEqual([]);
  });
  it('adds days and months', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addMonths('2026-12-01', 1)).toBe('2027-01-01');
    expect(addMonths('2026-01-01', -1)).toBe('2025-12-01');
  });
  it('computes weekday and wrapped ranges', () => {
    expect(weekday('2026-06-19')).toBe(5);
    expect(inMonthDayRange('12-25', '12-20', '01-06')).toBe(true);
    expect(inMonthDayRange('01-06', '12-20', '01-06')).toBe(true);
    expect(inMonthDayRange('01-07', '12-20', '01-06')).toBe(false);
    expect(inMonthDayRange('06-20', '06-15', '09-15')).toBe(true);
  });
  it('builds a Monday-first month grid', () => {
    const g = monthGrid('2026-02-01');
    expect(g.every((w) => w.length === 7)).toBe(true);
    expect(g.flat().filter(Boolean)).toHaveLength(28);
    expect(g[0][6]).toBe('2026-02-01'); // Sunday is last
  });
});
