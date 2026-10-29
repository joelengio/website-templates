import { useMemo } from 'react';
import { useStore } from './store';
import { cartStore, ordersStore, recentStore, wishlistStore } from './stores';
import { computeTotals, priceLines, type Destination } from '../lib/pricing';
import { commerce } from '../config/commerce';
import { getProductById } from '../lib/catalog';
import type { Product } from '../config/types';

export const useCartState = () => useStore(cartStore);
export const useWishlistIds = (): string[] => useStore(wishlistStore).ids;
export const useOrders = () => useStore(ordersStore).orders;
export const useRecentProducts = (excludeId?: string, limit = 4): Product[] => {
  const ids = useStore(recentStore).ids;
  return useMemo(() => ids.filter((i) => i !== excludeId).map((i) => getProductById(i)).filter((p): p is Product => Boolean(p)).slice(0, limit), [ids, excludeId, limit]);
};

/** Priced cart lines and totals for the current cart. Pass a destination / method from checkout; otherwise the default country is used. */
export function useCartPricing(destination?: Destination, shippingMethodId?: string) {
  const cart = useCartState();
  return useMemo(() => {
    const lines = priceLines(cart.lines);
    const totals = computeTotals({ lines, promoCode: cart.promoCode, destination: destination ?? { country: commerce.defaultCountry }, shippingMethodId });
    return { cart, lines, totals };
  }, [cart, destination, shippingMethodId]);
}
