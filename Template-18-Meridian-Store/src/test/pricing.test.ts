import { describe, expect, it } from 'vitest';
import { commerce } from '../config/commerce';
import type { CommerceConfig, Product } from '../config/types';
import { getProductBySlug } from '../lib/catalog';
import { computeTotals, evaluatePromo, freeShippingThresholdMinor, priceLines, shippingOptions, taxRateFor, type PricedLine } from '../lib/pricing';

const line = (unitMinor: number, qty = 1, id = 'x'): PricedLine => ({ key: id, productId: id, variantId: id, qty, unitMinor, lineMinor: unitMinor * qty, maxQty: 10 });
const cfg = (patch: Partial<CommerceConfig>): CommerceConfig => ({ ...commerce, ...patch });
const variantOf = (slug: string, label: string) => { const p = getProductBySlug(slug) as Product; return { p, v: p.variants.find((x) => x.label === label)! }; };

describe('priceLines', () => {
  it('prices lines from the catalogue, never from stored data', () => {
    const { p, v } = variantOf('atelier-tote', 'Cognac');
    const [l] = priceLines([{ productId: p.id, variantId: v.id, qty: 2 }]);
    expect(l.unitMinor).toBe(28500);
    expect(l.lineMinor).toBe(57000);
    expect(l.issue).toBeUndefined();
  });
  it('flags unknown, sold-out and over-stock lines', () => {
    const tote = variantOf('atelier-tote', 'Ink');
    const sold = variantOf('bud-vase', 'Chalk');
    const [a, b, c] = priceLines([
      { productId: 'nope', variantId: 'nope', qty: 1 },
      { productId: sold.p.id, variantId: sold.v.id, qty: 1 },
      { productId: tote.p.id, variantId: tote.v.id, qty: 5 }
    ]);
    expect(a.issue).toBe('unavailable');
    expect(b.issue).toBe('sold-out');
    expect(c.issue).toBe('insufficient-stock');
  });
  it('flags coming-soon products as unavailable', () => {
    const { p, v } = variantOf('weekender-duffel', 'Ink');
    expect(priceLines([{ productId: p.id, variantId: p.variants[0].id, qty: 1 }])[0].issue).toBe('unavailable');
    expect(v.stock).toBe(0);
  });
  it('uses variant-specific prices', () => {
    const { p, v } = variantOf('stoneware-vase', 'Chalk / Large');
    expect(priceLines([{ productId: p.id, variantId: v.id, qty: 1 }])[0].unitMinor).toBe(13800);
  });
});

describe('computeTotals', () => {
  it('empty bag is all zeros', () => {
    const t = computeTotals({ lines: [] });
    expect([t.subtotalMinor, t.shippingMinor, t.taxMinor, t.totalMinor, t.itemCount]).toEqual([0, 0, 0, 0, 0]);
  });
  it('adds standard shipping and exclusive tax below the free-shipping threshold', () => {
    const t = computeTotals({ lines: [line(6800)] });
    expect(t.subtotalMinor).toBe(6800);
    expect(t.shippingMinor).toBe(800);
    expect(t.taxMinor).toBe(408); // 6% of 68.00, shipping not taxed
    expect(t.totalMinor).toBe(6800 + 800 + 408);
    expect(t.freeShipping.qualified).toBe(false);
    expect(t.freeShipping.remainingMinor).toBe(15000 - 6800);
  });
  it('gives free standard shipping at the threshold', () => {
    const t = computeTotals({ lines: [line(15000)] });
    expect(t.shippingMinor).toBe(0);
    expect(t.freeShipping.qualified).toBe(true);
    expect(computeTotals({ lines: [line(14999)] }).shippingMinor).toBe(800);
  });
  it('express is never free and costs its flat rate', () => {
    const t = computeTotals({ lines: [line(50000)], shippingMethodId: 'express' });
    expect(t.shippingMinor).toBe(2200);
  });
  it('applies a percentage promo before the free-shipping check and tax', () => {
    const t = computeTotals({ lines: [line(35300)], promoCode: 'WELCOME10' });
    expect(t.discountMinor).toBe(3530);
    expect(t.discountedSubtotalMinor).toBe(31770);
    expect(t.shippingMinor).toBe(0);
    expect(t.taxMinor).toBe(1906);
    expect(t.totalMinor).toBe(31770 + 1906);
  });
  it('a discount can drop an order below the free-shipping threshold', () => {
    const t = computeTotals({ lines: [line(15500)], promoCode: 'SAVE20' });
    expect(t.discountedSubtotalMinor).toBe(13500);
    expect(t.shippingMinor).toBe(800);
  });
  it('FREESHIP makes standard shipping free but not express', () => {
    expect(computeTotals({ lines: [line(5000)], promoCode: 'FREESHIP' }).shippingMinor).toBe(0);
    expect(computeTotals({ lines: [line(5000)], promoCode: 'FREESHIP', shippingMethodId: 'express' }).shippingMinor).toBe(2200);
  });
  it('uses state-specific and zero tax rates', () => {
    expect(computeTotals({ lines: [line(10000)], destination: { country: 'US', region: 'ny' } }).taxMinor).toBe(888);
    expect(computeTotals({ lines: [line(10000)], destination: { country: 'US', region: 'OR' } }).taxMinor).toBe(0);
  });
  it('handles tax-inclusive destinations without adding tax to the total', () => {
    const t = computeTotals({ lines: [line(12000)], destination: { country: 'GB' } });
    expect(t.shippingMinor).toBe(1200);
    expect(t.taxInclusive).toBe(true);
    expect(t.taxMinor).toBe(2200);
    expect(t.totalMinor).toBe(13200);
  });
  it('taxes shipping when configured', () => {
    const c = cfg({ tax: { ...commerce.tax, taxShipping: true } });
    expect(computeTotals({ lines: [line(5000)], config: c }).taxMinor).toBe(348); // 6% of 58.00
  });
  it('rounds tax once on the order total (no per-line rounding drift)', () => {
    const lines = [line(333, 3, 'a'), line(333, 3, 'b')];
    const t = computeTotals({ lines });
    expect(t.subtotalMinor).toBe(1998);
    expect(t.taxMinor).toBe(120); // 6% of 19.98 = 1.1988 → 1.20
  });
  it('excludes issue lines from totals and reports them', () => {
    const bad: PricedLine = { ...line(1000), issue: 'sold-out' };
    const t = computeTotals({ lines: [line(2000), bad] });
    expect(t.subtotalMinor).toBe(2000);
    expect(t.hasIssues).toBe(true);
  });
  it('never produces negative or NaN amounts with invalid configuration', () => {
    const c = cfg({
      shipping: { zones: [{ id: 'us', label: 'US', countries: ['US'], methods: [{ id: 'standard', label: 'S', description: '', eta: '', price: -5, freeOver: Number.NaN, perExtraItem: -1 }] }] },
      tax: { enabled: true, mode: 'exclusive', taxShipping: false, defaultRatePct: -10, rates: [{ country: 'US', ratePct: Number.NaN, label: 'bad' }] },
      promos: [{ code: 'NEG', type: 'fixed', value: -50, description: '' }, { code: 'BIG', type: 'percent', value: 500, description: '' }]
    });
    for (const code of [undefined, 'NEG', 'BIG']) {
      const t = computeTotals({ lines: [line(10000)], config: c, promoCode: code });
      for (const n of [t.subtotalMinor, t.discountMinor, t.shippingMinor, t.taxMinor, t.totalMinor]) { expect(Number.isFinite(n)).toBe(true); expect(n).toBeGreaterThanOrEqual(0); }
      expect(t.discountMinor).toBeLessThanOrEqual(10000);
    }
  });
  it('multi-item shipping surcharge applies per extra item', () => {
    const opts = shippingOptions(10000, 3, 'DE', false);
    expect(opts[0].baseMinor).toBe(1400 + 200 * 2);
  });
  it('returns no shipping options for an unsupported country', () => {
    expect(shippingOptions(10000, 1, 'BR', false)).toEqual([]);
    expect(computeTotals({ lines: [line(5000)], destination: { country: 'BR' } }).shippingMinor).toBe(0);
  });
  it('reads the free-shipping threshold from configuration', () => {
    expect(freeShippingThresholdMinor('US')).toBe(15000);
    expect(freeShippingThresholdMinor('AU')).toBeUndefined();
  });
  it('finds tax rates by region, country, then default', () => {
    expect(taxRateFor({ country: 'US', region: 'CA' }).ratePct).toBe(7.25);
    expect(taxRateFor({ country: 'US', region: 'TX' }).ratePct).toBe(6);
    expect(taxRateFor({ country: 'JP' }).ratePct).toBe(0);
  });
});

describe('evaluatePromo', () => {
  it('rejects unknown, expired and below-minimum codes with helpful messages', () => {
    expect(evaluatePromo('NOPE', 10000)).toMatchObject({ ok: false });
    expect(evaluatePromo('OLDSEASON', 10000)).toMatchObject({ ok: false, reason: expect.stringContaining('expired') });
    expect(evaluatePromo('MERIDIAN25', 15000)).toMatchObject({ ok: false, reason: expect.stringContaining('minimum') });
    expect(evaluatePromo('', 10000)).toMatchObject({ ok: false });
    expect(evaluatePromo('WELCOME10', 0)).toMatchObject({ ok: false });
  });
  it('is case-insensitive and trims', () => {
    expect(evaluatePromo('  welcome10 ', 10000)).toMatchObject({ ok: true, discountMinor: 1000 });
  });
  it('caps percentage discounts', () => {
    expect(evaluatePromo('MERIDIAN25', 40000)).toMatchObject({ ok: true, discountMinor: 10000 });
    expect(evaluatePromo('MERIDIAN25', 60000)).toMatchObject({ ok: true, discountMinor: 12000 });
  });
  it('a fixed discount never exceeds the subtotal', () => {
    const c = cfg({ promos: [{ code: 'BIG', type: 'fixed', value: 500, description: '' }] });
    expect(evaluatePromo('BIG', 3000, c)).toMatchObject({ ok: true, discountMinor: 3000 });
  });
  it('respects the expiry date boundary', () => {
    const c = cfg({ promos: [{ code: 'D', type: 'percent', value: 10, expiresAt: '2030-01-01', description: '' }] });
    expect(evaluatePromo('D', 1000, c, new Date('2029-12-31T23:59:59Z')).ok).toBe(true);
    expect(evaluatePromo('D', 1000, c, new Date('2030-01-01T00:00:00Z')).ok).toBe(false);
  });
  it('treats inactive codes as invalid', () => {
    const c = cfg({ promos: [{ code: 'OFF', type: 'percent', value: 10, active: false, description: '' }] });
    expect(evaluatePromo('OFF', 1000, c).ok).toBe(false);
  });
});
