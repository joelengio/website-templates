import { productInputs } from '../config/products';
import { categories, collections } from '../config/collections';
import { commerce } from '../config/commerce';
import { site } from '../config/site';
import type { Product, ProductInput, Variant } from '../config/types';
import { currencyDigits, toMinor } from './money';

// ── building the runtime catalogue ───────────────────────────────────────────
const slug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cleanStock = (n: unknown): number => (typeof n === 'number' && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);

/** Convert config input (major units) to runtime products (minor units). Invalid numbers are clamped rather than propagated. */
export function buildCatalog(inputs: ProductInput[], currency = commerce.currency.code): Product[] {
  const digits = currencyDigits(currency);
  return inputs.map((input) => {
    const { price, compareAtPrice, variants: variantInputs, currency: productCurrency, ...p } = input;
    const baseMinor = Math.max(0, toMinor(price, digits));
    const compareMinor = compareAtPrice !== undefined ? toMinor(compareAtPrice, digits) : undefined;
    const variants: Variant[] = (variantInputs.length ? variantInputs : [{ options: {}, stock: 0 }]).map((v) => {
      const options = v.options ?? {};
      const label = p.options.map((o) => options[o.name]).filter(Boolean).join(' / ');
      const priceMinor = v.price !== undefined ? Math.max(0, toMinor(v.price, digits)) : baseMinor;
      const cmp = v.compareAtPrice !== undefined ? toMinor(v.compareAtPrice, digits) : compareMinor;
      return {
        id: `${p.slug}${label ? `-${slug(label)}` : '-default'}`,
        options, label, sku: v.sku ?? p.sku, priceMinor,
        compareAtMinor: cmp !== undefined && cmp > priceMinor ? cmp : undefined,
        stock: cleanStock(v.stock)
      };
    });
    const prices = variants.map((v) => v.priceMinor);
    return {
      ...p, currency: productCurrency ?? currency,
      priceMinor: baseMinor, compareAtMinor: compareMinor !== undefined && compareMinor > baseMinor ? compareMinor : undefined,
      minPriceMinor: Math.min(...prices), maxPriceMinor: Math.max(...prices), variants
    };
  });
}

let all: Product[] = buildCatalog(productInputs);
/** Rebuild after mutating `productInputs` at runtime (used by tests). */
export const rebuildCatalog = (): void => { all = buildCatalog(productInputs); };

/** Products shown in the store (everything except `archived`). */
export const getProducts = (): Product[] => all.filter((p) => p.status !== 'archived');
export const getAllProducts = (): Product[] => all;
export const getProductBySlug = (s: string | undefined): Product | undefined => all.find((p) => p.slug === s && p.status !== 'archived');
export const getProductById = (id: string): Product | undefined => all.find((p) => p.id === id);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getCollection = (s: string | undefined) => collections.find((c) => c.slug === s);
export const collectionProducts = (s: string): Product[] => {
  const c = getCollection(s);
  return c ? c.products.map((ps) => getProductBySlug(ps)).filter((p): p is Product => Boolean(p)) : [];
};

// ── availability ──────────────────────────────────────────────────────────────
export type Availability = 'in-stock' | 'low-stock' | 'sold-out' | 'coming-soon';
export const variantStock = (v: Variant): number => v.stock;
export const totalStock = (p: Product): number => p.variants.reduce((n, v) => n + v.stock, 0);
export const isPurchasable = (p: Product): boolean => p.status === 'active';
export function availability(p: Product): Availability {
  if (p.status === 'coming-soon') return 'coming-soon';
  const total = totalStock(p);
  if (total <= 0) return 'sold-out';
  return p.variants.some((v) => v.stock > commerce.lowStockThreshold) ? 'in-stock' : 'low-stock';
}
export const variantAvailability = (p: Product, v: Variant): Availability => {
  if (p.status === 'coming-soon') return 'coming-soon';
  if (v.stock <= 0) return 'sold-out';
  return v.stock <= commerce.lowStockThreshold ? 'low-stock' : 'in-stock';
};
export const salePercent = (p: { priceMinor: number; compareAtMinor?: number }): number =>
  p.compareAtMinor && p.compareAtMinor > p.priceMinor ? Math.round((1 - p.priceMinor / p.compareAtMinor) * 100) : 0;
export const isOnSale = (p: Product): boolean => p.variants.some((v) => v.compareAtMinor !== undefined);

/** Human readable inventory message for a variant (demonstration inventory — never a live-stock claim). */
export function stockMessage(p: Product, v: Variant | undefined): string {
  if (p.status === 'coming-soon') return `${site.labels.comingSoon} — not yet available to order`;
  if (!v) return 'Select your options to see availability';
  if (v.stock <= 0) return `${site.labels.soldOut} (demonstration inventory)`;
  if (v.stock <= commerce.lowStockThreshold) return `Only ${v.stock} left (demonstration inventory)`;
  return 'In stock (demonstration inventory)';
}

// ── option selection ─────────────────────────────────────────────────────────
export type Selection = Record<string, string>;
export const findVariant = (p: Product, sel: Selection): Variant | undefined =>
  p.variants.find((v) => p.options.every((o) => v.options[o.name] === sel[o.name]));

/** Initial selection: first in-stock variant, otherwise the first variant (so the page still shows something sensible when sold out). */
export function defaultSelection(p: Product): Selection {
  const v = p.variants.find((x) => x.stock > 0) ?? p.variants[0];
  return v ? { ...v.options } : {};
}

/** Is there at least one in-stock variant with `name = value` given the other currently-selected options? */
export function optionValueInStock(p: Product, sel: Selection, name: string, value: string): boolean {
  return p.variants.some((v) => v.options[name] === value && v.stock > 0 && p.options.every((o) => o.name === name || !sel[o.name] || v.options[o.name] === sel[o.name]));
}

/** Gallery for the current selection: images matching the selected image option first, then shared images. */
export function galleryFor(p: Product, sel: Selection) {
  const chosen = p.imageOption ? sel[p.imageOption] : undefined;
  const first = p.images.filter((i) => i.option && i.option === chosen);
  const shared = p.images.filter((i) => !i.option);
  const out = [...first, ...shared];
  return out.length ? out : p.images;
}

// ── search / filter / sort ───────────────────────────────────────────────────
export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'bestsellers';
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'bestsellers', label: 'Best selling' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' }
];

export interface Filters {
  q: string;
  categories: string[];
  colors: string[];
  /** Minor units. */
  minMinor?: number;
  maxMinor?: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
  sort: SortKey;
}
export const emptyFilters = (): Filters => ({ q: '', categories: [], colors: [], inStock: false, onSale: false, isNew: false, sort: 'featured' });

const num = (s: string | null): number | undefined => {
  if (s === null || s.trim() === '') return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};
/** Filters live in the URL so every filtered view is a shareable deep link. Price params are in MAJOR units. */
export function filtersFromParams(sp: URLSearchParams): Filters {
  const sort = sp.get('sort') as SortKey | null;
  const min = num(sp.get('min')), max = num(sp.get('max'));
  return {
    q: (sp.get('q') ?? '').slice(0, 80),
    categories: sp.getAll('category').filter((c) => categories.some((x) => x.id === c)),
    colors: sp.getAll('color'),
    minMinor: min !== undefined ? toMinor(min) : undefined,
    maxMinor: max !== undefined ? toMinor(max) : undefined,
    inStock: sp.get('stock') === '1', onSale: sp.get('sale') === '1', isNew: sp.get('new') === '1',
    sort: sort && sortOptions.some((o) => o.value === sort) ? sort : 'featured'
  };
}
export function filtersToParams(f: Filters): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.q.trim()) sp.set('q', f.q.trim());
  f.categories.forEach((c) => sp.append('category', c));
  f.colors.forEach((c) => sp.append('color', c));
  if (f.minMinor !== undefined) sp.set('min', String(f.minMinor / 10 ** currencyDigits()));
  if (f.maxMinor !== undefined) sp.set('max', String(f.maxMinor / 10 ** currencyDigits()));
  if (f.inStock) sp.set('stock', '1');
  if (f.onSale) sp.set('sale', '1');
  if (f.isNew) sp.set('new', '1');
  if (f.sort !== 'featured') sp.set('sort', f.sort);
  return sp;
}
export const activeFilterCount = (f: Filters): number =>
  f.categories.length + f.colors.length + (f.q.trim() ? 1 : 0) + (f.minMinor !== undefined ? 1 : 0) + (f.maxMinor !== undefined ? 1 : 0) + Number(f.inStock) + Number(f.onSale) + Number(f.isNew);

const norm = (s: string): string => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

/** Relevance score for a search query (0 = no match). Every token must match somewhere. */
export function searchScore(p: Product, query: string): number {
  const tokens = norm(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return 1;
  const name = norm(p.name), tag = norm(p.tagline), cat = norm(getCategory(p.category)?.name ?? '');
  const desc = norm(p.description), sku = norm(p.sku);
  const opts = norm(p.options.flatMap((o) => o.values.map((v) => v.value)).join(' '));
  let score = 0;
  for (const t of tokens) {
    let s = 0;
    if (name.startsWith(t)) s = 10; else if (name.includes(t)) s = 8;
    else if (cat.includes(t)) s = 5; else if (tag.includes(t) || opts.includes(t)) s = 4;
    else if (sku.includes(t)) s = 4; else if (desc.includes(t)) s = 2;
    if (!s) return 0;
    score += s;
  }
  return score;
}

const inPriceRange = (p: Product, f: Filters): boolean =>
  (f.minMinor === undefined || p.maxPriceMinor >= f.minMinor) && (f.maxMinor === undefined || p.minPriceMinor <= f.maxMinor);

export function filterProducts(list: Product[], f: Filters): Product[] {
  const scored = list.map((p) => ({ p, score: searchScore(p, f.q) })).filter(({ p, score }) => {
    if (!score) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.colors.length && !(p.options.some((o) => o.type === 'color' && o.values.some((v) => f.colors.includes(v.value))))) return false;
    if (!inPriceRange(p, f)) return false;
    if (f.inStock && availability(p) !== 'in-stock' && availability(p) !== 'low-stock') return false;
    if (f.onSale && !isOnSale(p)) return false;
    if (f.isNew && !p.isNew) return false;
    return true;
  });
  const bySort: Record<SortKey, (a: Product, b: Product) => number> = {
    featured: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.addedOn.localeCompare(a.addedOn),
    newest: (a, b) => b.addedOn.localeCompare(a.addedOn),
    bestsellers: (a, b) => (a.bestseller ?? 999) - (b.bestseller ?? 999) || b.addedOn.localeCompare(a.addedOn),
    'price-asc': (a, b) => a.minPriceMinor - b.minPriceMinor || a.name.localeCompare(b.name),
    'price-desc': (a, b) => b.minPriceMinor - a.minPriceMinor || a.name.localeCompare(b.name),
    'name-asc': (a, b) => a.name.localeCompare(b.name),
    'name-desc': (a, b) => b.name.localeCompare(a.name)
  };
  return scored
    .sort((x, y) => (f.q.trim() && f.sort === 'featured' ? y.score - x.score : 0) || bySort[f.sort](x.p, y.p))
    .map((x) => x.p);
}

/** Unique colour values across a product list (for the colour filter). */
export function colorFilterValues(list: Product[]): { value: string; swatch?: string }[] {
  const seen = new Map<string, string | undefined>();
  for (const p of list) for (const o of p.options) if (o.type === 'color') for (const v of o.values) if (!seen.has(v.value)) seen.set(v.value, v.swatch);
  return [...seen].map(([value, swatch]) => ({ value, swatch })).sort((a, b) => a.value.localeCompare(b.value));
}

export function relatedProducts(p: Product, limit = 4): Product[] {
  const inCollections = collections.filter((c) => c.products.includes(p.slug)).flatMap((c) => c.products);
  const pool = getProducts().filter((x) => x.id !== p.id);
  const score = (x: Product) => (x.category === p.category ? 3 : 0) + (inCollections.includes(x.slug) ? 2 : 0) + (x.featured ? 1 : 0);
  return pool.sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name)).slice(0, limit);
}
