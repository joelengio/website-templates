import { describe, expect, it } from 'vitest';
import { emptyAnswers, guestAdvice, makeDemoReference, sanitizeServices, servicesFor, steps, summarise, validateAll, validateStep, type InquiryAnswers } from '../lib/inquiry';
import { isValidISODate, todayISO, validateEmail, validateMessage, validateName, validatePhone } from '../lib/validation';
import { formatPrice, slugify } from '../lib/format';
import { readJSON, writeJSON } from '../lib/storage';
import { relatedArticles, articles } from '../config';

const base = (over: Partial<InquiryAnswers> = {}): InquiryAnswers => ({ ...emptyAnswers, ...over });
const future = () => `${new Date().getFullYear() + 2}-06-15`;

describe('validation helpers', () => {
  it('validates emails', () => {
    expect(validateEmail('')).toMatch(/enter/i);
    expect(validateEmail('nope')).toMatch(/valid/i);
    expect(validateEmail('a@b')).toMatch(/valid/i);
    expect(validateEmail('name@example.com')).toBe('');
  });
  it('validates phone numbers, optional unless required', () => {
    expect(validatePhone('')).toBe('');
    expect(validatePhone('', true)).toMatch(/phone/i);
    expect(validatePhone('abc')).toMatch(/valid/i);
    expect(validatePhone('123')).toMatch(/valid/i);
    expect(validatePhone('+1 (555) 014-0140')).toBe('');
  });
  it('validates names and messages', () => {
    expect(validateName(' ')).toMatch(/name/i);
    expect(validateName('A')).toMatch(/2/);
    expect(validateName('Ana')).toBe('');
    expect(validateMessage('short')).toMatch(/detail/i);
    expect(validateMessage('x'.repeat(2001))).toMatch(/under/i);
    expect(validateMessage('A perfectly fine message.')).toBe('');
  });
  it('checks real calendar dates', () => {
    expect(isValidISODate('2030-02-30')).toBe(false);
    expect(isValidISODate('2030-02-28')).toBe(true);
    expect(isValidISODate('not-a-date')).toBe(false);
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('formatting and storage', () => {
  it('formats prices and slugs', () => {
    expect(formatPrice(14500)).toBe('$14,500');
    expect(slugify('Floral & Event Design')).toBe('floral-event-design');
  });
  it('storage wrappers never throw on bad data', () => {
    window.localStorage.setItem('bad', '{oops');
    expect(readJSON('bad', { ok: true })).toEqual({ ok: true });
    expect(writeJSON('good', { a: 1 })).toBe(true);
    expect(readJSON('good', null)).toEqual({ a: 1 });
  });
});

describe('questionnaire logic', () => {
  it('has the nine data steps followed by completion', () => {
    expect(steps.map((s) => s.id)).toEqual(['type', 'date', 'destination', 'guests', 'style', 'services', 'budget', 'contact', 'review']);
    expect(steps.find((s) => s.id === 'budget')?.optional).toBe(true);
  });
  it('requires an event type', () => {
    expect(validateStep('type', base()).eventType).toBeTruthy();
    expect(validateStep('type', base({ eventType: 'wedding' }))).toEqual({});
  });
  it('validates each date mode', () => {
    expect(validateStep('date', base()).dateMode).toBeTruthy();
    expect(validateStep('date', base({ dateMode: 'exact' })).date).toMatch(/choose/i);
    expect(validateStep('date', base({ dateMode: 'exact', date: '2001-01-01' })).date).toMatch(/future/i);
    expect(validateStep('date', base({ dateMode: 'exact', date: future() }))).toEqual({});
    expect(Object.keys(validateStep('date', base({ dateMode: 'flexible' })))).toEqual(['season', 'year']);
    expect(validateStep('date', base({ dateMode: 'undecided' }))).toEqual({});
  });
  it('requires a custom destination only for "other"', () => {
    expect(validateStep('destination', base({ destination: 'tuscany' }))).toEqual({});
    expect(validateStep('destination', base({ destination: 'other' })).customDestination).toBeTruthy();
    expect(validateStep('destination', base({ destination: 'other', customDestination: 'Lisbon' }))).toEqual({});
  });
  it('validates guest counts', () => {
    for (const bad of ['', 'abc', '1.5', '0', '1', '1001']) expect(validateStep('guests', base({ guests: bad })).guests).toBeTruthy();
    for (const good of ['2', '80', '1000']) expect(validateStep('guests', base({ guests: good }))).toEqual({});
  });
  it('gives non-blocking guest advice', () => {
    expect(guestAdvice(base({ eventType: 'elopement', guests: '40' }))).toMatch(/Elopements/);
    expect(guestAdvice(base({ eventType: 'wedding', guests: '300' }))).toMatch(/production/);
    expect(guestAdvice(base({ eventType: 'wedding', guests: '80' }))).toBe('');
  });
  it('offers services by event type and drops stale selections', () => {
    expect(servicesFor('corporate').map((s) => s.id)).toContain('corporate');
    expect(servicesFor('wedding').map((s) => s.id)).not.toContain('corporate');
    expect(sanitizeServices(base({ eventType: 'corporate', services: ['full', 'corporate'] }))).toEqual(['corporate']);
    expect(validateStep('services', base({ eventType: 'corporate', services: ['full'] })).services).toBeTruthy();
  });
  it('treats budget as optional', () => {
    expect(validateStep('budget', base())).toEqual({});
  });
  it('validates contact details with conditional fields', () => {
    expect(Object.keys(validateStep('contact', base()))).toEqual(expect.arrayContaining(['name', 'email']));
    expect(validateStep('contact', base({ name: 'Ana', email: 'ana@example.com' }))).toEqual({});
    expect(validateStep('contact', base({ name: 'Ana', email: 'ana@example.com', eventType: 'corporate' })).company).toBeTruthy();
    expect(validateStep('contact', base({ name: 'Ana', email: 'ana@example.com', contactMethod: 'phone' })).phone).toBeTruthy();
  });
  it('validateAll reports the first invalid step', () => {
    expect(validateAll(base()).firstInvalid).toBe('type');
    const ok = base({ eventType: 'wedding', dateMode: 'undecided', destination: 'open', guests: '80', styles: ['coastal'], services: ['full'], name: 'Ana', email: 'ana@example.com' });
    expect(validateAll(ok).firstInvalid).toBeNull();
    expect(validateAll({ ...ok, guests: '' }).firstInvalid).toBe('guests');
  });
  it('summarises answers and labels the demo reference clearly', () => {
    const s = summarise(base({ eventType: 'wedding', dateMode: 'flexible', season: 'autumn', year: '2030', destination: 'other', customDestination: 'Lisbon', guests: '50', services: ['full'], packageId: 'signature', addOns: ['stationery'] }));
    expect(s.when).toBe('Autumn (Sep – Nov) 2030');
    expect(s.destination).toBe('Lisbon');
    expect(s.packageName).toBe('Signature');
    expect(s.addOnNames).toEqual(['Bespoke stationery suite']);
    expect(makeDemoReference(123456789)).toMatch(/^DEMO-[A-Z0-9]{1,6}$/);
  });
});

describe('journal related content', () => {
  it('relates by category and tags without returning the article itself', () => {
    const a = articles[0];
    const rel = relatedArticles(a, 3);
    expect(rel).toHaveLength(3);
    expect(rel.find((r) => r.slug === a.slug)).toBeUndefined();
  });
});
