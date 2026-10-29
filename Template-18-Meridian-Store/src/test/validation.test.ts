import { describe, expect, it } from 'vitest';
import { createOrder, generateReference, sanitizeOrders } from '../lib/orders';
import { getProductBySlug } from '../lib/catalog';
import { priceLines } from '../lib/pricing';
import { isEmail, looksLikeCardNumber, validateAddress, validateContact, validateContactForm, validateNewsletterEmail } from '../lib/validation';

const contact = { email: 'alex@example.com', firstName: 'Alex', lastName: 'Sample', phone: '' };
const address = { country: 'US', line1: '12 Sample Street', line2: '', city: 'Portland', region: 'OR', postcode: '97205' };
const countries = ['US', 'CA', 'GB', 'DE'];

describe('validation', () => {
  it('accepts valid details', () => {
    expect(validateContact(contact)).toEqual({});
    expect(validateAddress(address, countries)).toEqual({});
  });
  it('validates email formats', () => {
    for (const bad of ['', 'a', 'a@b', 'a@b.c', 'a b@c.com', '@c.com']) expect(isEmail(bad)).toBe(false);
    expect(isEmail('a@b.co')).toBe(true);
    expect(validateContact({ ...contact, email: 'nope' }).email).toMatch(/valid email/);
    expect(validateContact({ ...contact, email: '' }).email).toMatch(/Enter an email/);
  });
  it('requires names and validates optional phone', () => {
    expect(Object.keys(validateContact({ ...contact, firstName: 'A', lastName: '' }))).toEqual(['firstName', 'lastName']);
    expect(validateContact({ ...contact, phone: '12' }).phone).toBeTruthy();
    expect(validateContact({ ...contact, phone: 'abc-defg' }).phone).toBeTruthy();
    expect(validateContact({ ...contact, phone: '+1 (555) 010-4180' }).phone).toBeUndefined();
  });
  it('validates postcodes per country and required regions', () => {
    expect(validateAddress({ ...address, postcode: 'ABCDE' }, countries).postcode).toMatch(/ZIP/);
    expect(validateAddress({ ...address, postcode: '' }, countries).postcode).toBeTruthy();
    expect(validateAddress({ ...address, country: 'GB', region: '', postcode: 'SW1A 1AA' }, countries)).toEqual({});
    expect(validateAddress({ ...address, country: 'GB', region: '', postcode: '12345' }, countries).postcode).toBeTruthy();
    expect(validateAddress({ ...address, country: 'CA', postcode: 'K1A 0B1', region: '' }, countries).region).toBeTruthy();
    expect(validateAddress({ ...address, country: 'DE', region: '', postcode: '10115' }, countries)).toEqual({});
  });
  it('rejects unsupported countries and short addresses', () => {
    const e = validateAddress({ ...address, country: 'BR', line1: 'x', city: '' }, countries);
    expect(Object.keys(e).sort()).toEqual(['city', 'country', 'line1']);
  });
  it('refuses anything that looks like a card number', () => {
    expect(looksLikeCardNumber('4242 4242 4242 4242')).toBe(true);
    expect(looksLikeCardNumber('4242-4242-4242-4242')).toBe(true);
    expect(looksLikeCardNumber('4242 4242 4242 4241')).toBe(false);
    expect(looksLikeCardNumber('12345')).toBe(false);
    expect(validateAddress({ ...address, line2: '4242424242424242' }, countries).line2).toMatch(/card number/);
    expect(validateContact({ ...contact, firstName: '4242424242424242' }).firstName).toMatch(/card number/);
    expect(validateContactForm({ name: 'Alex', email: 'a@b.co', topic: 'x', message: 'my card 4242 4242 4242 4242 thanks' }).message).toMatch(/card number/);
  });
  it('validates the contact and newsletter forms', () => {
    expect(Object.keys(validateContactForm({ name: '', email: '', topic: '', message: 'short' })).sort()).toEqual(['email', 'message', 'name', 'topic']);
    expect(validateContactForm({ name: 'Alex', email: 'a@b.co', topic: 'Product question', message: 'A perfectly fine message.' })).toEqual({});
    expect(validateContactForm({ name: 'Alex', email: 'a@b.co', topic: 't', message: 'x'.repeat(2001) }).message).toMatch(/2,000/);
    expect(validateNewsletterEmail('')).toBeTruthy();
    expect(validateNewsletterEmail('bad')).toBeTruthy();
    expect(validateNewsletterEmail('ok@example.com')).toBeUndefined();
  });
});

describe('orders', () => {
  const p = getProductBySlug('atelier-tote')!;
  const lines = () => priceLines([{ productId: p.id, variantId: p.variants[0].id, qty: 2 }]);
  it('creates a demo order whose totals match the pricing engine', () => {
    const o = createOrder({ lines: lines(), contact, address: { ...address, region: 'TX' }, methodId: 'standard', promoCode: 'WELCOME10', now: new Date('2026-10-29T10:00:00Z') });
    expect(o.demo).toBe(true);
    expect(o.reference).toMatch(/^MER-DEMO-261029-[A-Z2-9]{4}$/);
    expect(o.totals.subtotalMinor).toBe(57000);
    expect(o.totals.discountMinor).toBe(5700);
    expect(o.totals.shippingMinor).toBe(0);
    expect(o.totals.taxMinor).toBe(3078);
    expect(o.totals.totalMinor).toBe(57000 - 5700 + 3078);
    expect(o.lines[0]).toMatchObject({ qty: 2, unitMinor: 28500, lineMinor: 57000 });
    expect(o.promo?.code).toBe('WELCOME10');
  });
  it('refuses empty or invalid bags', () => {
    expect(() => createOrder({ lines: [], contact, address, methodId: 'standard' })).toThrow();
    expect(() => createOrder({ lines: priceLines([{ productId: 'x', variantId: 'y', qty: 1 }]), contact, address, methodId: 'standard' })).toThrow();
  });
  it('refuses a destination with no delivery methods', () => {
    expect(() => createOrder({ lines: lines(), contact, address: { ...address, country: 'BR' }, methodId: 'standard' })).toThrow(/delivery/);
  });
  it('generates references with a deterministic random source', () => {
    expect(generateReference(new Date('2027-01-05T00:00:00Z'), () => [0, 1, 2, 3])).toBe('MER-DEMO-270105-ABCD');
  });
  it('sanitises stored orders', () => {
    const o = createOrder({ lines: lines(), contact, address, methodId: 'standard' });
    expect(sanitizeOrders({ orders: [o, null, { reference: 'x' }, 5] }).orders).toHaveLength(1);
    expect(sanitizeOrders('nope').orders).toEqual([]);
    expect(sanitizeOrders({ orders: Array.from({ length: 40 }, () => o) }).orders).toHaveLength(25);
  });
});
