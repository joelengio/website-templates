import { describe, expect, it } from 'vitest';
import { homeSections } from '../config/home';
import { menuItems } from '../config/menu';
import { orderSettings } from '../config/features';
import { theme } from '../config/theme';
import { experiences } from '../config/experiences';
import { articles } from '../config/journal';
import { galleryItems } from '../config/gallery';
import { images } from '../config/images';
import { calculateOrder, addLine, setLineQty, removeLine, clampQty } from './order';
import { resolveHomeSections } from './sections';
import { applyTheme } from './theme';
import { absoluteUrl, canonicalFor, fullTitle } from './seo';
import { readJson, writeJson } from './storage';
import { formatMoney } from './format';
import { formatTime, isDateKey } from './dates';
import {
  validateContactForm, validateEmail, validateExperienceInquiry, validateName, validatePhone, validatePrivateInquiry,
} from './validation';

describe('validation', () => {
  it('validates names, emails and phones', () => {
    expect(validateName('A')).toBeTruthy();
    expect(validateName('Al')).toBeUndefined();
    expect(validateEmail('a@b')).toBeTruthy();
    expect(validateEmail('a@b.co')).toBeUndefined();
    expect(validatePhone('')).toBeTruthy();
    expect(validatePhone('', false)).toBeUndefined();
    expect(validatePhone('12-34')).toBeTruthy();
    expect(validatePhone('+1 (555) 010-2024')).toBeUndefined();
    expect(validatePhone('555<script>')).toBeTruthy();
  });
  it('validates the contact form', () => {
    expect(Object.keys(validateContactForm({ name: '', email: '', topic: '', message: '' })).sort()).toEqual(['email', 'message', 'name', 'topic']);
    expect(validateContactForm({ name: 'Ada', email: 'a@b.co', topic: 'Feedback', message: 'A lovely evening, thanks.' })).toEqual({});
  });
  const today = new Date(2026, 2, 4);
  const pi = { name: 'Ada', email: 'a@b.co', phone: '', eventType: 'Birthday', date: '2026-03-20', guests: '20', budget: '', message: '', consent: true };
  it('validates private dining enquiries (date lead time, guest limits, consent)', () => {
    const o = { today, leadDays: 7, maxGuests: 60 };
    expect(validatePrivateInquiry(pi, o)).toEqual({});
    expect(validatePrivateInquiry({ ...pi, date: '2026-03-05' }, o).date).toMatch(/notice/);
    expect(validatePrivateInquiry({ ...pi, date: '2026-02-30' }, o).date).toBeTruthy();
    expect(validatePrivateInquiry({ ...pi, date: '' }, o).date).toBeTruthy();
    expect(validatePrivateInquiry({ ...pi, guests: '61' }, o).guests).toMatch(/60/);
    expect(validatePrivateInquiry({ ...pi, guests: '0' }, o).guests).toBeTruthy();
    expect(validatePrivateInquiry({ ...pi, guests: '2.5' }, o).guests).toBeTruthy();
    expect(validatePrivateInquiry({ ...pi, consent: false }, o).consent).toBeTruthy();
    expect(validatePrivateInquiry({ ...pi, budget: '-5' }, o).budget).toBeTruthy();
    expect(validatePrivateInquiry({ ...pi, phone: 'x' }, o).phone).toBeTruthy();
  });
  it('validates experience enquiries', () => {
    const e = { name: 'Ada', email: 'a@b.co', date: '', guests: '4', message: '', consent: true };
    expect(validateExperienceInquiry(e, { today, maxGuests: 10 })).toEqual({});
    expect(validateExperienceInquiry({ ...e, guests: '11' }, { today, maxGuests: 10 }).guests).toBeTruthy();
    expect(validateExperienceInquiry({ ...e, date: '2026-03-01' }, { today, maxGuests: 10 }).date).toBeTruthy();
  });
});

describe('order calculations', () => {
  const s = orderSettings;
  const a = menuItems.find((i) => i.id === 'aged-sirloin')!;
  const b = menuItems.find((i) => i.id === 'espresso')!;
  it('computes subtotal, service charge, tax and total in integer cents', () => {
    const t = calculateOrder([{ itemId: a.id, qty: 2 }, { itemId: b.id, qty: 1 }], menuItems, s);
    expect(t.subtotalCents).toBe(4600 * 2 + 450);
    expect(t.serviceCents).toBe(Math.round(t.subtotalCents * s.serviceChargeRate));
    expect(t.taxCents).toBe(Math.round(t.subtotalCents * s.taxRate));
    expect(t.totalCents).toBe(t.subtotalCents + t.serviceCents + t.taxCents);
    expect(t.itemCount).toBe(3);
  });
  it('can apply tax to the service charge', () => {
    const t = calculateOrder([{ itemId: a.id, qty: 1 }], menuItems, { ...s, taxAppliesToServiceCharge: true });
    expect(t.taxCents).toBe(Math.round((t.subtotalCents + t.serviceCents) * s.taxRate));
  });
  it('ignores unknown and unavailable items and clamps quantities', () => {
    const sold = menuItems.find((i) => !i.available)!;
    expect(calculateOrder([{ itemId: 'nope', qty: 1 }, { itemId: sold.id, qty: 1 }], menuItems, s).itemCount).toBe(0);
    expect(clampQty(999, 20)).toBe(20);
    expect(clampQty(-3, 20)).toBe(0);
    expect(clampQty(NaN, 20)).toBe(0);
  });
  it('adds, updates and removes lines', () => {
    let l = addLine([], 'x', 20);
    l = addLine(l, 'x', 20);
    expect(l).toEqual([{ itemId: 'x', qty: 2 }]);
    l = setLineQty(l, 'x', 5, 20);
    expect(l[0].qty).toBe(5);
    expect(setLineQty(l, 'x', 0, 20)).toEqual([]);
    expect(removeLine(l, 'x')).toEqual([]);
  });
});

describe('customisation', () => {
  it('resolves homepage sections: order, hiding, duplicates and unknown ids', () => {
    expect(resolveHomeSections(homeSections)[0]).toBe('hero');
    expect(resolveHomeSections([{ id: 'journal', enabled: true }, { id: 'hero', enabled: true }, { id: 'awards', enabled: false }])).toEqual(['journal', 'hero']);
    expect(resolveHomeSections([{ id: 'hero', enabled: true }, { id: 'hero', enabled: true }, { id: 'bogus' as never, enabled: true }])).toEqual(['hero']);
    expect(resolveHomeSections([])).toEqual([]);
  });
  it('applies theme colours and fonts as CSS variables', () => {
    const el = document.createElement('div');
    applyTheme({ ...theme, colors: { ...theme.colors, saffron: '#ff0000' } }, el);
    expect(el.style.getPropertyValue('--c-saffron')).toBe('#ff0000');
    expect(el.style.getPropertyValue('--c-muted-on-dark')).toBe(theme.colors.mutedOnDark);
    expect(el.style.getPropertyValue('--font-display')).toContain('Cormorant');
  });
  it('references only registered images and unique slugs in content', () => {
    const keys = Object.keys(images);
    experiences.forEach((e) => [e.image, ...e.gallery].forEach((k) => expect(keys, e.slug).toContain(k)));
    articles.forEach((a) => expect(keys, a.slug).toContain(a.image));
    galleryItems.forEach((g) => expect(keys).toContain(g.image));
    expect(new Set(experiences.map((e) => e.slug)).size).toBe(experiences.length);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    expect(experiences.length).toBeGreaterThanOrEqual(6);
    expect(articles.length).toBeGreaterThanOrEqual(8);
  });
});

describe('utilities', () => {
  it('formats money and times', () => {
    expect(formatMoney(34)).toBe('$34');
    expect(formatMoney(4.5)).toBe('$4.50');
    expect(formatTime('17:30')).toBe('5:30 pm');
    expect(formatTime('00:00')).toBe('12:00 am');
    expect(formatTime('12:00')).toBe('12:00 pm');
    expect(isDateKey('2026-02-30')).toBe(false);
    expect(isDateKey('2026-02-28')).toBe(true);
  });
  it('builds SEO titles and canonical URLs', () => {
    expect(fullTitle('Menus')).toBe('Menus | Saffron Table');
    expect(fullTitle('Saffron Table — Home', true)).toBe('Saffron Table — Home');
    expect(canonicalFor('/menus/')).toBe(absoluteUrl('/menus'));
    expect(canonicalFor('/')).toBe(absoluteUrl('/'));
  });
  it('stores JSON safely', () => {
    writeJson('t', { a: 1 });
    expect(readJson('t', null)).toEqual({ a: 1 });
    expect(readJson('missing', 5)).toBe(5);
    window.localStorage.setItem('bad', '{oops');
    expect(readJson('bad', 'fallback')).toBe('fallback');
  });
});
