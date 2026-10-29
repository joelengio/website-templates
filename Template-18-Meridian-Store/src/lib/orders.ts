import { site } from '../config/site';
import { countryNames } from '../config/commerce';
import { galleryFor } from './catalog';
import { computeTotals, type PricedLine, type Totals } from './pricing';
import type { AddressFields, ContactFields } from './validation';

export interface OrderLine {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantLabel: string;
  sku: string;
  image: string;
  qty: number;
  unitMinor: number;
  lineMinor: number;
}
export interface Order {
  reference: string;
  /** Always true: every order created by this template is a local demonstration. */
  demo: true;
  createdAt: string;
  currency: string;
  contact: ContactFields;
  address: AddressFields;
  method: { id: string; label: string; eta: string };
  promo?: { code: string; description: string };
  lines: OrderLine[];
  totals: { subtotalMinor: number; discountMinor: number; shippingMinor: number; taxMinor: number; taxLabel: string; taxInclusive: boolean; totalMinor: number };
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function generateReference(now: Date = new Date(), random: (n: number) => number[] = randomValues): string {
  const date = `${String(now.getUTCFullYear()).slice(2)}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}`;
  const suffix = random(4).map((n) => ALPHABET[n % ALPHABET.length]).join('');
  return `${site.demo.orderPrefix}-${date}-${suffix}`;
}
function randomValues(n: number): number[] {
  const arr = new Uint8Array(n);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(arr);
  else for (let i = 0; i < n; i++) arr[i] = Math.floor(Math.random() * 256);
  return [...arr];
}

export interface CreateOrderInput {
  lines: PricedLine[];
  contact: ContactFields;
  address: AddressFields;
  promoCode?: string;
  methodId: string;
  now?: Date;
}

/** Builds a demonstration order from validated, freshly priced lines. Throws when the bag has issues or is empty — callers must re-check first. */
export function createOrder(input: CreateOrderInput): Order {
  if (!input.lines.length || input.lines.some((l) => l.issue || !l.product || !l.variant)) throw new Error('Cannot create an order from an empty bag or one with unavailable items.');
  const totals: Totals = computeTotals({ lines: input.lines, promoCode: input.promoCode, destination: { country: input.address.country, region: input.address.region }, shippingMethodId: input.methodId });
  const option = totals.shippingOptions.find((o) => o.method.id === (totals.shippingMethodId ?? input.methodId));
  if (!option) throw new Error('No delivery method is available for this destination.');
  const now = input.now ?? new Date();
  return {
    reference: generateReference(now), demo: true, createdAt: now.toISOString(), currency: input.lines[0].product!.currency,
    contact: input.contact, address: input.address,
    method: { id: option.method.id, label: option.method.label, eta: option.method.eta },
    promo: totals.promo ? { code: totals.promo.code, description: totals.promo.description } : undefined,
    lines: input.lines.map((l) => ({
      productId: l.productId, variantId: l.variantId, slug: l.product!.slug, name: l.product!.name, variantLabel: l.variant!.label, sku: l.variant!.sku,
      image: galleryFor(l.product!, l.variant!.options)[0]?.src ?? '', qty: l.qty, unitMinor: l.unitMinor, lineMinor: l.lineMinor
    })),
    totals: { subtotalMinor: totals.subtotalMinor, discountMinor: totals.discountMinor, shippingMinor: totals.shippingMinor, taxMinor: totals.taxMinor, taxLabel: totals.taxLabel, taxInclusive: totals.taxInclusive, totalMinor: totals.totalMinor }
  };
}

export const countryName = (code: string): string => countryNames[code] ?? code;

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;
const str = (x: unknown): string => (typeof x === 'string' ? x : '');
const int = (x: unknown): number => (typeof x === 'number' && Number.isFinite(x) ? Math.trunc(x) : 0);

/** Defensive parse of stored orders: anything malformed is dropped. At most 25 orders are kept. */
export function sanitizeOrders(raw: unknown): { orders: Order[] } {
  const list = isObj(raw) && Array.isArray(raw.orders) ? raw.orders : [];
  const orders: Order[] = [];
  for (const o of list) {
    if (!isObj(o) || !str(o.reference) || !str(o.createdAt) || !Array.isArray(o.lines) || !isObj(o.totals) || !isObj(o.contact) || !isObj(o.address) || !isObj(o.method)) continue;
    const t = o.totals;
    orders.push({
      reference: str(o.reference), demo: true, createdAt: str(o.createdAt), currency: str(o.currency) || 'USD',
      contact: { email: str(o.contact.email), firstName: str(o.contact.firstName), lastName: str(o.contact.lastName), phone: str(o.contact.phone) },
      address: { country: str(o.address.country), line1: str(o.address.line1), line2: str(o.address.line2), city: str(o.address.city), region: str(o.address.region), postcode: str(o.address.postcode) },
      method: { id: str(o.method.id), label: str(o.method.label), eta: str(o.method.eta) },
      promo: isObj(o.promo) && str(o.promo.code) ? { code: str(o.promo.code), description: str(o.promo.description) } : undefined,
      lines: o.lines.filter(isObj).map((l) => ({ productId: str(l.productId), variantId: str(l.variantId), slug: str(l.slug), name: str(l.name), variantLabel: str(l.variantLabel), sku: str(l.sku), image: str(l.image), qty: int(l.qty), unitMinor: int(l.unitMinor), lineMinor: int(l.lineMinor) })),
      totals: { subtotalMinor: int(t.subtotalMinor), discountMinor: int(t.discountMinor), shippingMinor: int(t.shippingMinor), taxMinor: int(t.taxMinor), taxLabel: str(t.taxLabel), taxInclusive: t.taxInclusive === true, totalMinor: int(t.totalMinor) }
    });
  }
  return { orders: orders.slice(0, 25) };
}
