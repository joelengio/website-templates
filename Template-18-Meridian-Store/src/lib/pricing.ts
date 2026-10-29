import { commerce as defaultCommerce } from '../config/commerce';
import type { CommerceConfig, Product, PromoCode, ShippingMethod, ShippingZone, TaxRate, Variant } from '../config/types';
import { getProductById } from './catalog';
import { clampInt, currencyDigits, percentOf, taxIncludedIn, toMinor } from './money';

export interface LineInput {
  productId: string;
  variantId: string;
  qty: number;
}
export type LineIssue = 'unavailable' | 'sold-out' | 'insufficient-stock';
export interface PricedLine {
  key: string;
  productId: string;
  variantId: string;
  product?: Product;
  variant?: Variant;
  qty: number;
  unitMinor: number;
  compareAtMinor?: number;
  lineMinor: number;
  /** Maximum quantity currently allowed for this line (stock- and config-limited). */
  maxQty: number;
  issue?: LineIssue;
}
export interface Destination {
  country: string;
  region?: string;
}
export interface ShippingOption {
  method: ShippingMethod;
  baseMinor: number;
  priceMinor: number;
  free: boolean;
}
export type PromoResult =
  | { ok: true; promo: PromoCode; discountMinor: number; freeShipping: boolean }
  | { ok: false; reason: string };
export interface Totals {
  itemCount: number;
  subtotalMinor: number;
  discountMinor: number;
  discountedSubtotalMinor: number;
  shippingMinor: number;
  shippingOptions: ShippingOption[];
  shippingMethodId?: string;
  taxMinor: number;
  taxLabel: string;
  taxRatePct: number;
  taxInclusive: boolean;
  totalMinor: number;
  promo?: PromoCode;
  promoError?: string;
  freeShipping: { thresholdMinor?: number; remainingMinor: number; qualified: boolean };
  hasIssues: boolean;
}

export const lineKey = (productId: string, variantId: string): string => `${productId}::${variantId}`;

export const maxQtyFor = (variant: Variant | undefined, cfg: CommerceConfig = defaultCommerce): number =>
  variant ? Math.max(0, Math.min(Math.floor(cfg.maxQtyPerLine) || 0, variant.stock)) : 0;

/** Look up product/variant data for cart lines. Prices ALWAYS come from the catalogue, never from stored cart data. */
export function priceLines(lines: LineInput[], lookup: (id: string) => Product | undefined = getProductById): PricedLine[] {
  return lines.map((l) => {
    const product = lookup(l.productId);
    const variant = product?.variants.find((v) => v.id === l.variantId);
    const base = { key: lineKey(l.productId, l.variantId), productId: l.productId, variantId: l.variantId, product, variant };
    if (!product || !variant || product.status !== 'active') return { ...base, qty: l.qty, unitMinor: 0, lineMinor: 0, maxQty: 0, issue: 'unavailable' as const };
    const maxQty = maxQtyFor(variant);
    const issue: LineIssue | undefined = variant.stock <= 0 ? 'sold-out' : l.qty > variant.stock ? 'insufficient-stock' : undefined;
    const qty = issue ? l.qty : clampInt(l.qty, 1, maxQty || 1);
    return { ...base, qty, unitMinor: variant.priceMinor, compareAtMinor: variant.compareAtMinor, lineMinor: variant.priceMinor * qty, maxQty, issue };
  });
}

export const zoneFor = (country: string, cfg: CommerceConfig = defaultCommerce): ShippingZone | undefined =>
  cfg.shipping.zones.find((z) => z.countries.includes(country));

const nonNeg = (n: number): number => (Number.isFinite(n) && n > 0 ? n : 0);

export function shippingOptions(discountedSubtotalMinor: number, itemCount: number, country: string, freeShippingPromo: boolean, cfg: CommerceConfig = defaultCommerce): ShippingOption[] {
  const zone = zoneFor(country, cfg);
  if (!zone || itemCount <= 0) return [];
  const digits = currencyDigits(cfg.currency.code, cfg.currency.locale);
  return zone.methods.map((method, i) => {
    const baseMinor = toMinor(nonNeg(method.price), digits) + toMinor(nonNeg(method.perExtraItem ?? 0), digits) * Math.max(0, itemCount - 1);
    const threshold = method.freeOver !== undefined && method.freeOver > 0 ? toMinor(method.freeOver, digits) : undefined;
    const free = (threshold !== undefined && discountedSubtotalMinor >= threshold) || (freeShippingPromo && i === 0);
    return { method, baseMinor, priceMinor: free ? 0 : baseMinor, free };
  });
}

/** The amount (minor units) at which the first ("standard") method becomes free for a country, if it is configured. */
export function freeShippingThresholdMinor(country: string = defaultCommerce.defaultCountry, cfg: CommerceConfig = defaultCommerce): number | undefined {
  const m = zoneFor(country, cfg)?.methods[0];
  return m?.freeOver && m.freeOver > 0 ? toMinor(m.freeOver, currencyDigits(cfg.currency.code, cfg.currency.locale)) : undefined;
}

export function evaluatePromo(code: string | undefined, subtotalMinor: number, cfg: CommerceConfig = defaultCommerce, now: Date = new Date()): PromoResult {
  const wanted = (code ?? '').trim().toUpperCase();
  if (!wanted) return { ok: false, reason: 'Enter a promo code.' };
  const promo = cfg.promos.find((p) => p.code.toUpperCase() === wanted);
  if (!promo || promo.active === false) return { ok: false, reason: `“${wanted}” is not a valid promo code.` };
  if (promo.expiresAt) {
    const end = new Date(`${promo.expiresAt}T00:00:00Z`);
    if (!Number.isNaN(end.getTime()) && now.getTime() >= end.getTime()) return { ok: false, reason: `“${promo.code}” has expired.` };
  }
  const digits = currencyDigits(cfg.currency.code, cfg.currency.locale);
  const min = promo.minSubtotal ? toMinor(nonNeg(promo.minSubtotal), digits) : 0;
  if (subtotalMinor < min) return { ok: false, reason: `“${promo.code}” needs a minimum order of ${(min / 10 ** digits).toFixed(digits === 0 ? 0 : 2)}.` };
  if (subtotalMinor <= 0) return { ok: false, reason: 'Add items to your bag to use a promo code.' };
  let discountMinor = 0;
  if (promo.type === 'percent') {
    discountMinor = percentOf(subtotalMinor, Math.min(100, nonNeg(promo.value)));
    if (promo.maxDiscount !== undefined) discountMinor = Math.min(discountMinor, toMinor(nonNeg(promo.maxDiscount), digits));
  } else if (promo.type === 'fixed') {
    discountMinor = toMinor(nonNeg(promo.value), digits);
  }
  return { ok: true, promo, discountMinor: Math.min(discountMinor, subtotalMinor), freeShipping: promo.type === 'free-shipping' };
}

export function taxRateFor(dest: Destination, cfg: CommerceConfig = defaultCommerce): { ratePct: number; label: string; inclusive: boolean } {
  const rates: TaxRate[] = cfg.tax.rates;
  const region = dest.region?.trim().toUpperCase();
  const hit = (region ? rates.find((r) => r.country === dest.country && r.region?.toUpperCase() === region) : undefined) ?? rates.find((r) => r.country === dest.country && !r.region);
  const ratePct = nonNeg(hit ? hit.ratePct : cfg.tax.defaultRatePct);
  return { ratePct, label: hit?.label ?? 'Tax', inclusive: hit?.inclusive ?? cfg.tax.mode === 'inclusive' };
}

export interface TotalsInput {
  lines: PricedLine[];
  promoCode?: string;
  destination?: Destination;
  shippingMethodId?: string;
  config?: CommerceConfig;
  now?: Date;
}

/**
 * The single source of truth for every amount shown in the bag, checkout, confirmation and order history.
 * Order of operations: subtotal → promo discount → shipping (free thresholds use the discounted subtotal) → tax → total.
 * Tax is calculated once on the order total (not per line) to keep rounding predictable.
 */
export function computeTotals(input: TotalsInput): Totals {
  const cfg = input.config ?? defaultCommerce;
  const valid = input.lines.filter((l) => !l.issue && l.qty > 0);
  const hasIssues = input.lines.some((l) => l.issue);
  const itemCount = valid.reduce((n, l) => n + l.qty, 0);
  const subtotalMinor = valid.reduce((n, l) => n + l.lineMinor, 0);
  const dest: Destination = input.destination ?? { country: cfg.defaultCountry };

  let discountMinor = 0, promo: PromoCode | undefined, promoError: string | undefined, freeShippingPromo = false;
  if (input.promoCode) {
    const r = evaluatePromo(input.promoCode, subtotalMinor, cfg, input.now);
    if (r.ok) { discountMinor = r.discountMinor; promo = r.promo; freeShippingPromo = r.freeShipping; } else promoError = r.reason;
  }
  const discountedSubtotalMinor = Math.max(0, subtotalMinor - discountMinor);
  const options = shippingOptions(discountedSubtotalMinor, itemCount, dest.country, freeShippingPromo, cfg);
  const chosen = options.find((o) => o.method.id === input.shippingMethodId) ?? options[0];
  const shippingMinor = chosen ? chosen.priceMinor : 0;

  const rate = taxRateFor(dest, cfg);
  let taxMinor = 0;
  if (cfg.tax.enabled && itemCount > 0) {
    taxMinor = rate.inclusive ? taxIncludedIn(discountedSubtotalMinor + shippingMinor, rate.ratePct) : percentOf(discountedSubtotalMinor + (cfg.tax.taxShipping ? shippingMinor : 0), rate.ratePct);
  }
  const totalMinor = discountedSubtotalMinor + shippingMinor + (rate.inclusive ? 0 : taxMinor);

  const threshold = freeShippingThresholdMinor(dest.country, cfg);
  return {
    itemCount, subtotalMinor, discountMinor, discountedSubtotalMinor, shippingMinor, shippingOptions: options, shippingMethodId: chosen?.method.id,
    taxMinor, taxLabel: rate.label, taxRatePct: rate.ratePct, taxInclusive: rate.inclusive, totalMinor, promo, promoError,
    freeShipping: { thresholdMinor: threshold, remainingMinor: threshold === undefined ? 0 : Math.max(0, threshold - discountedSubtotalMinor), qualified: threshold !== undefined && discountedSubtotalMinor >= threshold && itemCount > 0 },
    hasIssues
  };
}
