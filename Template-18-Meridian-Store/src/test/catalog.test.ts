import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { categories, collections } from '../config/collections';
import { productInputs } from '../config/products';
import { articles } from '../config/journal';
import { checkConfig } from '../lib/config-check';
import { activeFilterCount, availability, buildCatalog, collectionProducts, defaultSelection, emptyFilters, filterProducts, filtersFromParams, filtersToParams, findVariant, galleryFor, getProductBySlug, getProducts, optionValueInStock, relatedProducts, searchScore, stockMessage } from '../lib/catalog';

const publicFile = (src: string) => existsSync(path.join(process.cwd(), 'public', src));

describe('catalogue data integrity', () => {
  it('ships at least 30 products and 6 collections with unique identifiers', () => {
    expect(productInputs.length).toBeGreaterThanOrEqual(30);
    expect(collections.length).toBeGreaterThanOrEqual(6);
    for (const key of ['id', 'slug', 'sku'] as const) expect(new Set(productInputs.map((p) => p[key])).size).toBe(productInputs.length);
  });
  it('has no configuration errors', () => {
    expect(checkConfig().filter((i) => i.severity === 'error')).toEqual([]);
  });
  it('every product has the required fields', () => {
    for (const p of getProducts()) {
      expect(p.name && p.description && p.sku && p.category && p.currency).toBeTruthy();
      expect(p.features.length).toBeGreaterThan(0);
      expect(p.details.length).toBeGreaterThan(0);
      expect(p.images.length).toBeGreaterThan(1);
      expect(p.variants.length).toBeGreaterThan(0);
      expect(Number.isInteger(p.priceMinor) && p.priceMinor > 0).toBe(true);
      for (const v of p.variants) expect(Number.isInteger(v.stock) && v.stock >= 0).toBe(true);
      expect(categories.some((c) => c.id === p.category)).toBe(true);
    }
  });
  it('every referenced image file exists on disk and has alt text', () => {
    const missing: string[] = [];
    for (const p of productInputs) for (const i of p.images) { expect(i.alt.length).toBeGreaterThan(5); if (!publicFile(i.src)) missing.push(i.src); }
    for (const c of collections) { if (!publicFile(c.heroImage)) missing.push(c.heroImage); expect(c.heroAlt).toBeTruthy(); }
    for (const c of categories) if (!publicFile(c.image)) missing.push(c.image);
    for (const a of articles) if (!publicFile(a.image)) missing.push(a.image);
    expect(missing).toEqual([]);
  });
  it('demonstrates every stock state', () => {
    const states = new Set(getProducts().map((p) => availability(p)));
    expect(states).toEqual(new Set(['in-stock', 'low-stock', 'sold-out', 'coming-soon']));
  });
  it('collections reference real products', () => {
    for (const c of collections) { expect(collectionProducts(c.slug)).toHaveLength(c.products.length); }
  });
  it('sale products have a compare-at price above the price', () => {
    const sale = getProducts().filter((p) => p.compareAtMinor);
    expect(sale.length).toBeGreaterThan(2);
    for (const p of sale) expect(p.compareAtMinor!).toBeGreaterThan(p.priceMinor);
  });
});

describe('config validation catches bad data', () => {
  const base = productInputs[0];
  it('flags negative prices, bad stock, duplicate ids and unknown categories', () => {
    const bad = [{ ...base, price: -5, category: 'nowhere', variants: [{ ...base.variants[0], stock: -2 }] }, { ...base }];
    const msgs = checkConfig(bad).map((i) => i.message).join('|');
    expect(msgs).toContain('Invalid price');
    expect(msgs).toContain('Unknown category');
    expect(msgs).toContain('Invalid stock');
    expect(msgs).toContain('Duplicate');
  });
  it('flags a variant that uses an unknown option value', () => {
    const bad = [{ ...base, variants: [{ ...base.variants[0], options: { Color: 'Neon' } }] }];
    expect(checkConfig(bad).some((i) => i.message.includes('unknown Color'))).toBe(true);
  });
  it('buildCatalog clamps invalid numbers instead of propagating them', () => {
    const [p] = buildCatalog([{ ...base, price: Number.NaN, variants: [{ ...base.variants[0], stock: -4 }, { ...base.variants[1], stock: 2.9 }] }]);
    expect(p.priceMinor).toBe(0);
    expect(p.variants[0].stock).toBe(0);
    expect(p.variants[1].stock).toBe(2);
  });
});

describe('variants and gallery', () => {
  const crew = getProductBySlug('merino-crew')!;
  it('default selection is an in-stock variant', () => {
    const sel = defaultSelection(crew);
    expect(findVariant(crew, sel)!.stock).toBeGreaterThan(0);
  });
  it('finds exact variants and returns undefined for incomplete selections', () => {
    expect(findVariant(crew, { Color: 'Oat', Size: 'M' })?.label).toBe('Oat / M');
    expect(findVariant(crew, { Color: 'Oat' })).toBeUndefined();
  });
  it('marks unavailable option values given the other selections', () => {
    expect(optionValueInStock(crew, { Color: 'Clay', Size: 'M' }, 'Size', 'XS')).toBe(false);
    expect(optionValueInStock(crew, { Color: 'Oat', Size: 'M' }, 'Size', 'XS')).toBe(true);
  });
  it('puts the selected colour image first', () => {
    expect(galleryFor(crew, { Color: 'Clay', Size: 'M' })[0].alt).toContain('Clay');
    expect(galleryFor(crew, { Color: 'Charcoal', Size: 'M' })[0].alt).toContain('Charcoal');
  });
  it('describes inventory honestly as demonstration data', () => {
    const tote = getProductBySlug('atelier-tote')!;
    expect(stockMessage(tote, findVariant(tote, { Color: 'Ink' }))).toMatch(/Only 3 left \(demonstration inventory\)/);
    expect(stockMessage(tote, undefined)).toMatch(/Select/);
    expect(stockMessage(getProductBySlug('weekender-duffel')!, undefined)).toMatch(/Coming soon/);
  });
  it('variant prices differ by size where configured', () => {
    const vase = getProductBySlug('stoneware-vase')!;
    expect(findVariant(vase, { Color: 'Chalk', Size: 'Small' })!.priceMinor).toBe(9800);
    expect(findVariant(vase, { Color: 'Chalk', Size: 'Large' })!.priceMinor).toBe(13800);
    expect(vase.minPriceMinor).toBe(9800);
    expect(vase.maxPriceMinor).toBe(13800);
  });
});

describe('search, filter and sort', () => {
  const all = getProducts();
  it('searches names, categories, options and descriptions with scoring', () => {
    const names = (q: string) => filterProducts(all, { ...emptyFilters(), q }).map((p) => p.slug);
    expect(names('linen')).toContain('linen-shirt');
    expect(names('linen')[0]).toMatch(/linen/);
    expect(names('LEATHER')).toContain('atelier-tote');
    expect(names('cognac')).toContain('atelier-tote');
    expect(names('MER-MUGS')).toEqual(['stoneware-mugs']);
    expect(names('zzzzzz')).toEqual([]);
    expect(names('linen shirt')).toEqual(['linen-shirt']);
    expect(searchScore(all[0], '')).toBe(1);
  });
  it('combines multiple filters', () => {
    const f = { ...emptyFilters(), categories: ['homeware'], minMinor: 5000, maxMinor: 10000, inStock: true };
    const res = filterProducts(all, f);
    expect(res.length).toBeGreaterThan(0);
    for (const p of res) { expect(p.category).toBe('homeware'); expect(p.maxPriceMinor).toBeGreaterThanOrEqual(5000); expect(p.minPriceMinor).toBeLessThanOrEqual(10000); expect(availability(p)).not.toBe('sold-out'); }
  });
  it('filters sale, new and colour', () => {
    expect(filterProducts(all, { ...emptyFilters(), onSale: true }).every((p) => p.compareAtMinor)).toBe(true);
    expect(filterProducts(all, { ...emptyFilters(), isNew: true }).every((p) => p.isNew)).toBe(true);
    expect(filterProducts(all, { ...emptyFilters(), colors: ['Sage'] }).length).toBeGreaterThan(0);
  });
  it('in-stock filter removes sold-out and coming-soon products', () => {
    const slugs = filterProducts(all, { ...emptyFilters(), inStock: true }).map((p) => p.slug);
    expect(slugs).not.toContain('bud-vase');
    expect(slugs).not.toContain('weekender-duffel');
  });
  it('sorts by price, name and newness', () => {
    const prices = filterProducts(all, { ...emptyFilters(), sort: 'price-asc' }).map((p) => p.minPriceMinor);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    const desc = filterProducts(all, { ...emptyFilters(), sort: 'price-desc' }).map((p) => p.minPriceMinor);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
    const names = filterProducts(all, { ...emptyFilters(), sort: 'name-asc' }).map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    const dates = filterProducts(all, { ...emptyFilters(), sort: 'newest' }).map((p) => p.addedOn);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(filterProducts(all, { ...emptyFilters(), sort: 'bestsellers' })[0].slug).toBe('atelier-tote');
  });
  it('round-trips filters through URL parameters and ignores junk', () => {
    const f = { ...emptyFilters(), q: 'wool', categories: ['apparel', 'homeware'], colors: ['Oat'], minMinor: 5000, maxMinor: 20050, inStock: true, onSale: true, isNew: true, sort: 'price-desc' as const };
    expect(filtersFromParams(filtersToParams(f))).toEqual(f);
    const junk = filtersFromParams(new URLSearchParams('category=ghost&min=abc&max=-4&sort=weird&q=' + 'x'.repeat(200)));
    expect(junk.categories).toEqual([]);
    expect(junk.minMinor).toBeUndefined();
    expect(junk.maxMinor).toBeUndefined();
    expect(junk.sort).toBe('featured');
    expect(junk.q).toHaveLength(80);
    expect(activeFilterCount(f)).toBe(9);
  });
  it('related products exclude the product itself', () => {
    const p = getProductBySlug('atelier-tote')!;
    const rel = relatedProducts(p);
    expect(rel).toHaveLength(4);
    expect(rel.some((r) => r.id === p.id)).toBe(false);
  });
});
