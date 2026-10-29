import { commerce as defaultCommerce } from '../config/commerce';
import type { CommerceConfig } from '../config/types';
import { getProductById } from './catalog';
import { lineKey, maxQtyFor, type LineInput } from './pricing';

export interface CartState {
  lines: LineInput[];
  promoCode?: string;
}
export const emptyCart = (): CartState => ({ lines: [] });

export type AddFailure = 'unavailable' | 'coming-soon' | 'sold-out' | 'invalid-quantity' | 'max-reached';
export type AddResult =
  | { ok: true; qty: number; added: number; capped: boolean; message: string }
  | { ok: false; reason: AddFailure; message: string };

const failure = (reason: AddFailure, message: string): AddResult => ({ ok: false, reason, message });

/**
 * Pure cart mutation: validates product, variant, stock and quantity limits before adding.
 * Never trusts the caller — an invalid, unavailable or out-of-stock variant can never enter the cart.
 */
export function addToCart(state: CartState, input: { productId: string; variantId: string; qty: number }, cfg: CommerceConfig = defaultCommerce): { state: CartState; result: AddResult } {
  const product = getProductById(input.productId);
  const variant = product?.variants.find((v) => v.id === input.variantId);
  const reject = (r: AddResult) => ({ state, result: r });
  if (!product || !variant || product.status === 'archived') return reject(failure('unavailable', 'This item is no longer available.'));
  if (product.status === 'coming-soon') return reject(failure('coming-soon', `${product.name} is not available to order yet.`));
  if (!Number.isFinite(input.qty) || input.qty < 1 || !Number.isInteger(input.qty)) return reject(failure('invalid-quantity', 'Choose a quantity of 1 or more.'));
  if (variant.stock <= 0) return reject(failure('sold-out', `${product.name}${variant.label ? ` (${variant.label})` : ''} is sold out.`));

  const max = maxQtyFor(variant, cfg);
  const key = lineKey(product.id, variant.id);
  const existing = state.lines.find((l) => lineKey(l.productId, l.variantId) === key);
  const current = existing?.qty ?? 0;
  if (current >= max) return reject(failure('max-reached', max < cfg.maxQtyPerLine ? `Only ${max} available — you already have ${current} in your bag.` : `You can order up to ${max} of this item.`));
  const next = Math.min(max, current + input.qty);
  const capped = current + input.qty > max;
  const lines = existing
    ? state.lines.map((l) => (lineKey(l.productId, l.variantId) === key ? { ...l, qty: next } : l))
    : [...state.lines, { productId: product.id, variantId: variant.id, qty: next }];
  const label = `${product.name}${variant.label ? ` (${variant.label})` : ''}`;
  return {
    state: { ...state, lines },
    result: { ok: true, qty: next, added: next - current, capped, message: capped ? `Added ${next - current} × ${label}. Only ${max} can be ordered, so your bag is at the limit.` : `Added ${next - current} × ${label} to your bag.` }
  };
}

export function setLineQuantity(state: CartState, key: string, qty: number, cfg: CommerceConfig = defaultCommerce): { state: CartState; capped: boolean } {
  const line = state.lines.find((l) => lineKey(l.productId, l.variantId) === key);
  if (!line) return { state, capped: false };
  if (!Number.isFinite(qty) || qty < 1) return { state: removeLine(state, key), capped: false };
  const variant = getProductById(line.productId)?.variants.find((v) => v.id === line.variantId);
  const max = Math.max(1, maxQtyFor(variant, cfg));
  const next = Math.min(max, Math.floor(qty));
  return { state: { ...state, lines: state.lines.map((l) => (l === line ? { ...l, qty: next } : l)) }, capped: qty > max };
}

export const removeLine = (state: CartState, key: string): CartState => ({ ...state, lines: state.lines.filter((l) => lineKey(l.productId, l.variantId) !== key) });
export const clearCart = (): CartState => emptyCart();
export const setPromoCode = (state: CartState, code: string | undefined): CartState => ({ ...state, promoCode: code?.trim() ? code.trim().toUpperCase().slice(0, 40) : undefined });

/** Defensive parse of persisted data: drops malformed lines, unknown products/variants, duplicates, and clamps quantities. */
export function sanitizeCart(raw: unknown, cfg: CommerceConfig = defaultCommerce): CartState {
  if (!raw || typeof raw !== 'object') return emptyCart();
  const r = raw as { lines?: unknown; promoCode?: unknown };
  const out: LineInput[] = [];
  if (Array.isArray(r.lines)) {
    for (const l of r.lines) {
      if (!l || typeof l !== 'object') continue;
      const { productId, variantId, qty } = l as Record<string, unknown>;
      if (typeof productId !== 'string' || typeof variantId !== 'string' || typeof qty !== 'number' || !Number.isFinite(qty)) continue;
      const product = getProductById(productId);
      const variant = product?.variants.find((v) => v.id === variantId);
      if (!product || !variant || product.status !== 'active') continue;
      const key = lineKey(productId, variantId);
      if (out.some((o) => lineKey(o.productId, o.variantId) === key)) continue;
      const q = Math.floor(qty);
      if (q < 1) continue;
      out.push({ productId, variantId, qty: Math.min(q, Math.max(1, maxQtyFor(variant, cfg))) });
    }
  }
  return { lines: out, promoCode: typeof r.promoCode === 'string' && r.promoCode.trim() ? r.promoCode.trim().toUpperCase().slice(0, 40) : undefined };
}
