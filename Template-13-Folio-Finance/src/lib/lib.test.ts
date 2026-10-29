import { describe, expect, it, beforeEach } from 'vitest';
import { addOns, plans } from '../config/plans';
import { articles } from '../config/articles';
import { services } from '../config/services';
import { booking } from '../config/booking';
import { discountFor, quotePlan } from './pricing';
import { filterArticles, filterServices, relatedArticles } from './search';
import { containsSensitiveNumber, validateEmail, validateMessage, validateName, validatePhone } from './validation';
import { cancelAppointment, dayGrid, hash01, isBookableDate, loadAppointments, saveAppointment, slotsForDate, validateDetails, type Appointment } from './booking';
import { formatCurrency, formatNumber, formatPercent, formatTime, parseISODate, toISODate } from './format';
import { applySeo } from './seo';

describe('pricing calculations', () => {
  const advisory = plans.find((p) => p.id === 'advisory')!;
  it('monthly price is the plan price plus add-ons', () => {
    const q = quotePlan(advisory, 'monthly', ['bookkeeping'], addOns);
    expect(q.periodTotal).toBe(advisory.monthly + 420);
    expect(q.effectiveMonthly).toBe(q.periodTotal);
    expect(q.annualSaving).toBe(0);
    expect(q.periodLabel).toBe('month');
  });
  it('annual price = monthly × 12 × (1 − discount) and shows the saving', () => {
    const q = quotePlan(advisory, 'annual', [], addOns);
    expect(q.discountPercent).toBe(18);
    expect(q.periodTotal).toBe(Math.round(640 * 12 * 0.82 * 100) / 100); // 6297.60
    expect(q.periodTotal).toBe(6297.6);
    expect(q.effectiveMonthly).toBe(524.8);
    expect(q.annualSaving).toBe(1382.4);
  });
  it('add-ons are discounted with the plan on annual billing', () => {
    const q = quotePlan(advisory, 'annual', ['bookkeeping', 'forecast'], addOns);
    expect(q.addOnsPeriod).toBe(Math.round((420 + 180) * 12 * 0.82 * 100) / 100);
    expect(q.periodTotal).toBeCloseTo(q.planPeriod + q.addOnsPeriod, 2);
  });
  it('unknown add-on ids are ignored and plans fall back to the default discount', () => {
    const q = quotePlan(plans[0], 'annual', ['nope'], addOns);
    expect(q.addOnsPeriod).toBe(0);
    expect(discountFor(plans[0])).toBe(15);
    expect(discountFor({ ...plans[0], annualDiscountPercent: 150 })).toBe(100);
    expect(discountFor({ ...plans[0], annualDiscountPercent: -5 })).toBe(0);
  });
  it('annual is always cheaper per month than monthly billing', () => {
    for (const p of plans) expect(quotePlan(p, 'annual', [], addOns).effectiveMonthly).toBeLessThan(quotePlan(p, 'monthly', [], addOns).effectiveMonthly);
  });
});

describe('search & filters', () => {
  it('filters services by category and text', () => {
    expect(filterServices(services, { category: 'individuals' }).map((s) => s.slug)).toEqual(expect.arrayContaining(['financial-planning', 'wealth-planning']));
    expect(filterServices(services, { category: 'individuals' }).every((s) => s.categories.includes('individuals'))).toBe(true);
    expect(filterServices(services, { q: 'runway' }).map((s) => s.slug)).toContain('startup-advisory');
    expect(filterServices(services, { q: 'zzzz-nothing' })).toEqual([]);
    expect(filterServices(services, { category: 'all' })).toHaveLength(services.length);
  });
  it('searches articles across title, tags and body, newest first', () => {
    const res = filterArticles(articles, { q: 'compound' });
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].date >= res[res.length - 1].date).toBe(true);
    expect(filterArticles(articles, { q: 'bookkeeping routine' }).map((a) => a.slug)).toContain('a-simple-month-end-checklist');
    expect(filterArticles(articles, { category: 'Cash flow' }).every((a) => a.category === 'Cash flow')).toBe(true);
    expect(filterArticles(articles, { q: 'qqqqq' })).toEqual([]);
  });
  it('finds related articles by category and tags without including itself', () => {
    const a = articles[0];
    const rel = relatedArticles(articles, a, 3);
    expect(rel).toHaveLength(3);
    expect(rel.find((r) => r.slug === a.slug)).toBeUndefined();
  });
});

describe('validation', () => {
  it('validates names, emails and phones', () => {
    expect(validateName('')).toBeTruthy();
    expect(validateName('A')).toBeTruthy();
    expect(validateName('Ada Lovelace')).toBeUndefined();
    expect(validateEmail('nope')).toBeTruthy();
    expect(validateEmail('a@b')).toBeTruthy();
    expect(validateEmail('ada@example.com')).toBeUndefined();
    expect(validatePhone('')).toBeUndefined();
    expect(validatePhone('abc')).toBeTruthy();
    expect(validatePhone('123')).toBeTruthy();
    expect(validatePhone('+1 (555) 010-0144')).toBeUndefined();
  });
  it('rejects long digit runs that look like account, card or tax numbers', () => {
    expect(containsSensitiveNumber('my account 1234 5678 9012')).toBe(true);
    expect(containsSensitiveNumber('ID 123-45-6789')).toBe(true);
    expect(containsSensitiveNumber('I have 3 kids and 25 years left')).toBe(false);
    expect(containsSensitiveNumber('budget $250,000')).toBe(false);
    expect(validateMessage('please use 123456789012', { max: 100 })).toMatch(/sensitive/i);
    expect(validateMessage('short', { min: 10, max: 100 })).toMatch(/at least 10/);
    expect(validateMessage('x'.repeat(101), { max: 100 })).toMatch(/under 100/);
    expect(validateMessage('', { max: 100, required: false })).toBeUndefined();
  });
});

describe('booking logic', () => {
  const now = new Date(2026, 9, 29, 10, 0); // Thu 29 Oct 2026
  const appt = (over: Partial<Appointment> = {}): Appointment => ({
    id: 'a1', reference: 'FF-TEST12', serviceSlug: 'tax-planning', typeId: 'intro', date: '2026-11-03', time: '10:00', duration: 30,
    name: 'Ada', email: 'ada@example.com', phone: '', note: '', createdAt: now.toISOString(), ...over,
  });
  beforeEach(() => window.localStorage.clear());

  it('only offers weekdays inside the booking window', () => {
    expect(isBookableDate(parseISODate('2026-10-29'), now)).toBe(false); // today
    expect(isBookableDate(parseISODate('2026-10-30'), now)).toBe(true); // Fri
    expect(isBookableDate(parseISODate('2026-10-31'), now)).toBe(false); // Sat
    expect(isBookableDate(parseISODate('2026-11-01'), now)).toBe(false); // Sun
    expect(isBookableDate(parseISODate('2026-11-02'), now)).toBe(true); // Mon
    expect(isBookableDate(parseISODate('2027-03-01'), now)).toBe(false); // beyond window
  });
  it('builds a day grid that avoids lunch and respects duration', () => {
    const g30 = dayGrid(30);
    expect(g30[0]).toBe('09:00');
    expect(g30).not.toContain('12:30');
    expect(g30).not.toContain('13:00');
    expect(g30).toContain('13:30');
    expect(g30[g30.length - 1]).toBe('16:30');
    const g60 = dayGrid(60);
    expect(g60).not.toContain('12:00');
    expect(g60[g60.length - 1]).toBe('16:00');
  });
  it('generates stable demo availability and marks booked overlaps', () => {
    const a = slotsForDate('2026-11-03', 30, [], now);
    const b = slotsForDate('2026-11-03', 30, [], now);
    expect(a).toEqual(b);
    expect(a.some((s) => s.available)).toBe(true);
    expect(a.some((s) => !s.available)).toBe(true);
    const free = a.find((s) => s.available)!.time;
    const after = slotsForDate('2026-11-03', 30, [appt({ time: free })], now);
    expect(after.find((s) => s.time === free)).toMatchObject({ available: false, reason: 'booked' });
    expect(slotsForDate('2026-11-07', 30, [], now)).toEqual([]);
  });
  it('a 60-minute booking blocks overlapping neighbours', () => {
    const existing = [appt({ time: '15:00', duration: 60, date: '2026-11-04' })];
    const slots = slotsForDate('2026-11-04', 30, existing, now);
    for (const t of ['15:00', '15:30']) expect(slots.find((s) => s.time === t)?.available).toBe(false);
    expect(slots.find((s) => s.time === '14:30')?.reason).not.toBe('booked');
  });
  it('hash is deterministic and within [0,1)', () => {
    expect(hash01('x')).toBe(hash01('x'));
    for (const k of ['a', 'b', '2026-11-03T09:00']) {
      expect(hash01(k)).toBeGreaterThanOrEqual(0);
      expect(hash01(k)).toBeLessThan(1);
    }
    const busy = Array.from({ length: 400 }, (_, i) => hash01(`d${i}`) < booking.demoBusyRatio).filter(Boolean).length;
    expect(busy / 400).toBeGreaterThan(0.18);
    expect(busy / 400).toBeLessThan(0.38);
  });
  it('persists, reloads and cancels appointments in localStorage', () => {
    expect(loadAppointments()).toEqual([]);
    saveAppointment(appt());
    saveAppointment(appt({ id: 'a2', date: '2026-11-02' }));
    const list = loadAppointments();
    expect(list.map((a) => a.id)).toEqual(['a2', 'a1']); // sorted by date
    expect(cancelAppointment('a1').map((a) => a.id)).toEqual(['a2']);
    expect(loadAppointments()).toHaveLength(1);
  });
  it('ignores corrupt storage', () => {
    window.localStorage.setItem('folio-finance:appointments', '{not json');
    expect(loadAppointments()).toEqual([]);
    window.localStorage.setItem('folio-finance:appointments', JSON.stringify([{ foo: 1 }, 5]));
    expect(loadAppointments()).toEqual([]);
  });
  it('validates contact details and consent', () => {
    const good = { name: 'Ada Lovelace', email: 'ada@example.com', phone: '', note: '', consent: true };
    expect(validateDetails(good)).toEqual({});
    const bad = validateDetails({ name: '', email: 'x', phone: 'abc', note: 'acct 1234567890123', consent: false });
    expect(Object.keys(bad).sort()).toEqual(['consent', 'email', 'name', 'note', 'phone']);
  });
});

describe('formatting & SEO helpers', () => {
  it('formats currency using the configured display currency', () => {
    expect(formatCurrency(1234.5)).toBe('$1,235');
    expect(formatCurrency(1234.5, { cents: true })).toBe('$1,234.50');
    expect(formatCurrency(Number.NaN)).toBe('—');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatPercent(0.1234)).toBe('12.3%');
    expect(formatTime('13:30')).toMatch(/1:30\s?PM/);
    expect(toISODate(parseISODate('2026-02-09'))).toBe('2026-02-09');
  });
  it('applies title, description, canonical and Open Graph tags', () => {
    applySeo({ title: 'Services', description: 'Desc here', path: '/services' });
    expect(document.title).toBe('Services — Folio Finance');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Desc here');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://folio-finance.example.com/services');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Services — Folio Finance');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index, follow');
    applySeo({ title: 'x', noindex: true });
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow');
  });
});
