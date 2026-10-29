import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { classes } from '../config/classes';
import { programs } from '../config/programs';
import { trainers } from '../config/trainers';
import { articles } from '../config/journal';
import { plans } from '../config/membership';
import { site } from '../config/site';
import { bookingSettings } from '../config/booking';
import { addMinutes, formatTime, isoDate, money, parseIso, toMinutes } from '../lib/format';
import { availability, demoTaken, hash01, isClosed, lastBookableDate, overlaps, sessionsOn, weekDates, weekdayIndex } from '../lib/schedule';
import { book, cancel, loadReservations, loadProfile, type Reservation } from '../lib/reservations';
import { validateContact, validateProfile, validateSignup } from '../lib/validation';
import { filterArticles, filterPrograms, relatedArticles } from '../lib/filters';
import { annualSaving, annualTotal, priceFor } from '../lib/pricing';
import { submitForm } from '../lib/forms';
import { readJSON, writeJSON } from '../lib/storage';
import { applySeo, buildTitle } from '../lib/seo';

describe('format', () => {
  it('formats times, durations and money', () => {
    expect(formatTime('06:30')).toBe('6:30 AM');
    expect(formatTime('18:05')).toBe('6:05 PM');
    expect(addMinutes('23:30', 60)).toBe('00:30');
    expect(toMinutes('01:15')).toBe(75);
    expect(money(89)).toBe('$89');
  });
  it('round-trips ISO dates without timezone drift', () => {
    expect(isoDate(parseIso('2026-03-08'))).toBe('2026-03-08');
    expect(isoDate(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('schedule logic', () => {
  const monday = new Date(2026, 9, 26, 8, 0); // Monday 26 Oct 2026, 08:00
  it('computes Monday-first weekday indexes and week dates', () => {
    expect(weekdayIndex(monday)).toBe(0);
    expect(weekdayIndex(new Date(2026, 9, 25))).toBe(6);
    const w = weekDates(new Date(2026, 9, 29), 0);
    expect(w[0]).toBe('2026-10-26');
    expect(w[6]).toBe('2026-11-01');
    expect(weekDates(new Date(2026, 9, 29), 1)[0]).toBe('2026-11-02');
  });
  it('lists sessions per day sorted by start time', () => {
    const list = sessionsOn('2026-10-26');
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((c) => c.day === 0)).toBe(true);
    expect([...list].sort((a, b) => a.start.localeCompare(b.start))).toEqual(list);
  });
  it('produces stable demo occupancy within capacity', () => {
    const c = classes[0];
    expect(hash01('x')).toBe(hash01('x'));
    expect(demoTaken(c, '2026-10-26')).toBe(demoTaken(c, '2026-10-26'));
    classes.forEach((s) => { const t = demoTaken(s, '2026-11-02'); expect(t).toBeGreaterThanOrEqual(0); expect(t).toBeLessThanOrEqual(s.capacity); });
  });
  it('closes booking before the start time cut-off', () => {
    const c = classes.find((x) => x.id === 'mon-1215-hiit')!;
    expect(isClosed(c, '2026-10-26', new Date(2026, 9, 26, 12, 0))).toBe(false);
    expect(isClosed(c, '2026-10-26', new Date(2026, 9, 26, 12, 5))).toBe(true);
    expect(isClosed(c, '2026-10-26', new Date(2026, 9, 26, 13, 0))).toBe(true);
    expect(isClosed(c, '2026-11-02', monday)).toBe(false);
  });
  it('reports availability including the user’s own place', () => {
    const c = classes[0];
    const base = availability(c, '2026-11-02', monday, false);
    const mine = availability(c, '2026-11-02', monday, true);
    expect(mine.taken).toBe(Math.min(c.capacity, base.taken + 1));
    expect(base.left + base.taken).toBe(c.capacity);
  });
  it('detects overlapping times', () => {
    expect(overlaps('10:00', 60, '10:30', 45)).toBe(true);
    expect(overlaps('10:00', 60, '11:00', 45)).toBe(false);
    expect(overlaps('10:00', 60, '09:00', 60)).toBe(false);
  });
  it('limits booking to the configured window', () => {
    expect(lastBookableDate(monday)).toBe('2026-11-15');
  });
});

describe('reservations', () => {
  beforeEach(() => window.localStorage.clear());
  const profile = { name: 'Riley Morgan', email: 'riley@example.com' };
  const a = classes.find((c) => c.id === 'tue-1800-bar')!;
  it('books, persists and reloads a reservation', () => {
    const r = book(a, '2026-11-03', profile, []);
    expect(r.ok).toBe(true);
    const loaded = loadReservations();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].classId).toBe(a.id);
    expect(loadProfile().email).toBe('riley@example.com');
  });
  it('prevents duplicate bookings', () => {
    const first = book(a, '2026-11-03', profile, []);
    if (!first.ok) throw new Error('setup');
    const dup = book(a, '2026-11-03', profile, [first.reservation]);
    expect(dup).toMatchObject({ ok: false, reason: 'duplicate' });
    expect(loadReservations()).toHaveLength(1);
  });
  it('allows the same class on a different date', () => {
    const first = book(a, '2026-11-03', profile, []);
    if (!first.ok) throw new Error('setup');
    expect(book(a, '2026-11-10', profile, [first.reservation]).ok).toBe(true);
  });
  it('blocks overlapping classes on the same day', () => {
    const wedBox = classes.find((c) => c.id === 'wed-1730-box')!;
    const wedIron = classes.find((c) => c.id === 'wed-1845-iron')!; // 17:30–18:25 vs 18:45
    const first = book(wedBox, '2026-11-04', profile, []);
    if (!first.ok) throw new Error('setup');
    expect(book(wedIron, '2026-11-04', profile, [first.reservation]).ok).toBe(true); // no overlap
    const clash: Reservation[] = [{ ref: 'X', classId: 'wed-1730-box', date: '2026-11-04', name: 'a', email: 'a@b.co', createdAt: '' }];
    const fake = { ...wedIron, start: '18:00' }; // starts inside the 17:30–18:25 boxing class
    expect(book(fake, '2026-11-04', profile, clash)).toMatchObject({ ok: false, reason: 'conflict' });
  });
  it('cancels a reservation', () => {
    const r = book(a, '2026-11-03', profile, []);
    if (!r.ok) throw new Error('setup');
    expect(cancel(r.reservation.ref, [r.reservation])).toEqual([]);
    expect(loadReservations()).toEqual([]);
  });
  it('survives corrupt storage and removed classes', () => {
    window.localStorage.setItem(bookingSettings.storageKey, '{not json');
    expect(loadReservations()).toEqual([]);
    window.localStorage.setItem(bookingSettings.storageKey, JSON.stringify([{ ref: 'A', classId: 'gone', date: '2026-11-03' }, { ref: 'B', classId: a.id, date: '2026-11-03' }, 7]));
    expect(loadReservations().map((r) => r.ref)).toEqual(['B']);
  });
  it('reports when storage cannot be written', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    const r = book(a, '2026-11-03', profile, []);
    expect(r).toMatchObject({ ok: true, stored: false });
    spy.mockRestore();
  });
});

describe('validation', () => {
  it('validates reservation profile', () => {
    expect(validateProfile({ name: '', email: '' })).toMatchObject({ name: expect.any(String), email: expect.any(String) });
    expect(validateProfile({ name: 'Al', email: 'bad' }).email).toMatch(/valid/);
    expect(validateProfile({ name: 'Alex Lee', email: 'alex@example.com' })).toEqual({});
  });
  it('validates contact enquiries', () => {
    const ok = { name: 'Sam', email: 'sam@example.com', phone: '', topic: 'general', message: 'A long enough message.' };
    expect(validateContact(ok)).toEqual({});
    expect(validateContact({ ...ok, topic: '' }).topic).toBeDefined();
    expect(validateContact({ ...ok, message: 'short' }).message).toBeDefined();
    expect(validateContact({ ...ok, phone: 'abc' }).phone).toBeDefined();
    expect(validateContact({ ...ok, phone: '+1 (555) 010-0199' })).toEqual({});
    expect(validateContact({ ...ok, message: 'x'.repeat(1501) }).message).toBeDefined();
  });
  it('validates membership signup', () => {
    const ids = plans.map((p) => p.id);
    const ok = { name: 'Sam Lee', email: 'sam@example.com', phone: '', startDate: '2026-11-01', planId: 'club', agree: true };
    expect(validateSignup(ok, ids, '2026-10-29')).toEqual({});
    expect(validateSignup({ ...ok, startDate: '2026-10-01' }, ids, '2026-10-29').startDate).toMatch(/past/);
    expect(validateSignup({ ...ok, startDate: '' }, ids, '2026-10-29').startDate).toBeDefined();
    expect(validateSignup({ ...ok, planId: 'nope' }, ids, '2026-10-29').planId).toBeDefined();
    expect(validateSignup({ ...ok, agree: false }, ids, '2026-10-29').agree).toBeDefined();
  });
});

describe('filters', () => {
  const names = (s: string) => trainers.find((t) => t.slug === s)?.name ?? s;
  const f = (o: Partial<{ q: string; category: string; level: string; trainer: string }>) => filterPrograms(programs, { q: '', category: 'All', level: 'All', trainer: 'All', ...o }, names);
  it('filters programs by search, category, level and trainer', () => {
    expect(f({})).toHaveLength(programs.length);
    expect(f({ q: 'boxing' }).map((p) => p.slug)).toContain('boxing-fitness');
    expect(f({ q: 'dario' }).map((p) => p.slug)).toEqual(expect.arrayContaining(['boxing-fitness']));
    expect(f({ category: 'Combat' })).toHaveLength(1);
    expect(f({ level: 'Advanced' }).map((p) => p.slug)).toEqual(['performance-training']);
    expect(f({ trainer: 'priya-raman' }).map((p) => p.slug).sort()).toEqual(['mobility', 'personal-training']);
    expect(f({ q: 'zzzzqq' })).toHaveLength(0);
    expect(f({ q: 'STRENGTH   ' }).length).toBeGreaterThan(0);
  });
  it('filters articles and finds related ones', () => {
    expect(filterArticles(articles, '', 'All')).toHaveLength(articles.length);
    expect(filterArticles(articles, 'kettlebell', 'All').length).toBeGreaterThan(0);
    expect(filterArticles(articles, '', 'Recovery').every((a) => a.category === 'Recovery')).toBe(true);
    expect(filterArticles(articles, 'nothing-matches-this', 'All')).toHaveLength(0);
    const rel = relatedArticles(articles, articles[0]);
    expect(rel).toHaveLength(3);
    expect(rel.find((a) => a.slug === articles[0].slug)).toBeUndefined();
  });
});

describe('membership pricing', () => {
  it('returns monthly or annual per-month price', () => {
    const club = plans.find((p) => p.id === 'club')!;
    expect(priceFor(club, 'monthly')).toBe(club.monthly);
    expect(priceFor(club, 'annual')).toBe(club.annualMonthly);
    expect(annualTotal(club)).toBe(club.annualMonthly * 12);
    expect(annualSaving(club)).toBe((club.monthly - club.annualMonthly) * 12);
    plans.forEach((p) => expect(annualSaving(p)).toBeGreaterThanOrEqual(0));
  });
});

describe('forms', () => {
  const original = site.forms.endpoint;
  afterEach(() => { site.forms.endpoint = original; });
  it('never claims delivery without an endpoint', async () => {
    const fetchSpy = vi.fn();
    expect(await submitForm({ a: 1 }, fetchSpy as unknown as typeof fetch)).toEqual({ status: 'demo' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('posts JSON to a configured endpoint', async () => {
    site.forms.endpoint = 'https://forms.example/submit';
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    expect(await submitForm({ a: 1 }, fetchSpy as unknown as typeof fetch)).toEqual({ status: 'sent' });
    expect(fetchSpy).toHaveBeenCalledWith('https://forms.example/submit', expect.objectContaining({ method: 'POST', body: '{"a":1}' }));
  });
  it('reports server errors and network failures', async () => {
    site.forms.endpoint = 'https://forms.example/submit';
    const bad = await submitForm({}, vi.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch);
    expect(bad.status).toBe('error');
    const down = await submitForm({}, vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch);
    expect(down).toMatchObject({ status: 'error', message: expect.stringContaining('could not reach') });
  });
});

describe('storage & seo', () => {
  it('never throws on unavailable or corrupt storage', () => {
    window.localStorage.setItem('k', '{bad');
    expect(readJSON('k', 5)).toBe(5);
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('x'); });
    expect(writeJSON('k', 1)).toBe(false);
    spy.mockRestore();
    expect(writeJSON('k', { a: 1 })).toBe(true);
    expect(readJSON('k', null)).toEqual({ a: 1 });
  });
  it('applies page metadata, canonical and Open Graph tags', () => {
    applySeo({ title: 'Programs', description: 'Desc here', path: '/programs/' });
    expect(document.title).toBe(buildTitle('Programs'));
    expect(document.querySelector('meta[name=description]')?.getAttribute('content')).toBe('Desc here');
    expect(document.querySelector('link[rel=canonical]')?.getAttribute('href')).toMatch(/\/programs$/);
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toContain('Programs');
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toMatch(/^https?:\/\//);
    applySeo({ title: 'x', noindex: true });
    expect(document.querySelector('meta[name=robots]')?.getAttribute('content')).toContain('noindex');
  });
});
