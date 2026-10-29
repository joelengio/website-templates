import { createPersistentStore } from './store';
import { STORAGE_KEYS } from '../lib/storage';
import { emptyCart, sanitizeCart, type CartState } from '../lib/cart';
import { sanitizeOrders, type Order } from '../lib/orders';
import { getProductById } from '../lib/catalog';

export const cartStore = createPersistentStore<CartState>(STORAGE_KEYS.cart, emptyCart, (raw) => sanitizeCart(raw));

const sanitizeIds = (raw: unknown, max: number): { ids: string[] } => {
  const ids = raw && typeof raw === 'object' && Array.isArray((raw as { ids?: unknown }).ids) ? (raw as { ids: unknown[] }).ids : [];
  return { ids: [...new Set(ids.filter((x): x is string => typeof x === 'string' && Boolean(getProductById(x))))].slice(0, max) };
};
export const wishlistStore = createPersistentStore<{ ids: string[] }>(STORAGE_KEYS.wishlist, () => ({ ids: [] }), (raw) => sanitizeIds(raw, 100));
export const recentStore = createPersistentStore<{ ids: string[] }>(STORAGE_KEYS.recent, () => ({ ids: [] }), (raw) => sanitizeIds(raw, 12));
export const ordersStore = createPersistentStore<{ orders: Order[] }>(STORAGE_KEYS.orders, () => ({ orders: [] }), sanitizeOrders);

export const toggleWishlist = (productId: string): boolean => {
  const has = wishlistStore.get().ids.includes(productId);
  wishlistStore.set((s) => ({ ids: has ? s.ids.filter((i) => i !== productId) : [productId, ...s.ids] }));
  return !has;
};
export const recordViewed = (productId: string): void => {
  if (recentStore.get().ids[0] === productId) return;
  recentStore.set((s) => ({ ids: [productId, ...s.ids.filter((i) => i !== productId)].slice(0, 12) }));
};
export const saveOrder = (order: Order): void => ordersStore.set((s) => ({ orders: [order, ...s.orders.filter((o) => o.reference !== order.reference)].slice(0, 25) }));

/** Removes every piece of demonstration data this template stores in the browser. */
export const resetDemoData = (): void => {
  cartStore.reset(); wishlistStore.reset(); recentStore.reset(); ordersStore.reset();
};
