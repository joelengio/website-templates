import { cartStore, wishlistStore } from './stores';
import { addToCart, clearCart, removeLine, setLineQuantity, setPromoCode, type AddResult } from '../lib/cart';
import { evaluatePromo, priceLines } from '../lib/pricing';

/** Add to bag. Returns the validated result; the cart is only changed when `result.ok`. */
export function addItem(productId: string, variantId: string, qty = 1): AddResult {
  const { state, result } = addToCart(cartStore.get(), { productId, variantId, qty });
  if (result.ok) cartStore.set(state);
  return result;
}
export const changeQty = (key: string, qty: number): { capped: boolean } => {
  const { state, capped } = setLineQuantity(cartStore.get(), key, qty);
  cartStore.set(state);
  return { capped };
};
export const removeItem = (key: string): void => cartStore.set(removeLine(cartStore.get(), key));
export const clearBag = (): void => cartStore.set(clearCart());
export const removePromo = (): void => cartStore.set(setPromoCode(cartStore.get(), undefined));

/** Validate a promo code against the current bag and store it only when it is valid. */
export function applyPromo(code: string): { ok: boolean; message: string } {
  const subtotal = priceLines(cartStore.get().lines).filter((l) => !l.issue).reduce((n, l) => n + l.lineMinor, 0);
  const res = evaluatePromo(code, subtotal);
  if (!res.ok) return { ok: false, message: res.reason };
  cartStore.set(setPromoCode(cartStore.get(), res.promo.code));
  return { ok: true, message: `Applied ${res.promo.code}: ${res.promo.description}.` };
}

export const isWishlisted = (productId: string): boolean => wishlistStore.get().ids.includes(productId);
