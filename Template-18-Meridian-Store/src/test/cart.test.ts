import { describe, expect, it, vi } from 'vitest';
import { addToCart, clearCart, emptyCart, removeLine, sanitizeCart, setLineQuantity, setPromoCode } from '../lib/cart';
import { getProductBySlug } from '../lib/catalog';
import { lineKey } from '../lib/pricing';
import { cartStore, ordersStore, recordViewed, recentStore, resetDemoData, toggleWishlist, wishlistStore } from '../state/stores';
import { addItem, applyPromo, changeQty } from '../state/actions';

const v = (slug: string, label: string) => { const p = getProductBySlug(slug)!; return { productId: p.id, variantId: p.variants.find((x) => x.label === label)!.id }; };

describe('cart logic', () => {
  it('adds valid variants and merges duplicates without creating extra lines', () => {
    let s = emptyCart();
    const t = v('atelier-tote', 'Cognac');
    s = addToCart(s, { ...t, qty: 1 }).state;
    const r = addToCart(s, { ...t, qty: 2 });
    expect(r.result).toMatchObject({ ok: true, qty: 3, added: 2 });
    expect(r.state.lines).toHaveLength(1);
  });
  it('rejects unknown products and variants', () => {
    expect(addToCart(emptyCart(), { productId: 'zzz', variantId: 'zzz', qty: 1 }).result).toMatchObject({ ok: false, reason: 'unavailable' });
    const t = v('atelier-tote', 'Cognac');
    expect(addToCart(emptyCart(), { productId: t.productId, variantId: 'atelier-tote-purple', qty: 1 }).result).toMatchObject({ ok: false, reason: 'unavailable' });
  });
  it('rejects sold-out variants and coming-soon products', () => {
    expect(addToCart(emptyCart(), { ...v('slim-cardholder', 'Sand'), qty: 1 }).result).toMatchObject({ ok: false, reason: 'sold-out' });
    const w = getProductBySlug('weekender-duffel')!;
    expect(addToCart(emptyCart(), { productId: w.id, variantId: w.variants[0].id, qty: 1 }).result).toMatchObject({ ok: false, reason: 'coming-soon' });
  });
  it('rejects invalid quantities', () => {
    const t = v('atelier-tote', 'Cognac');
    for (const qty of [0, -1, 1.5, Number.NaN]) expect(addToCart(emptyCart(), { ...t, qty }).result).toMatchObject({ ok: false, reason: 'invalid-quantity' });
  });
  it('caps excessive quantities at stock and at the configured maximum', () => {
    const low = v('atelier-tote', 'Ink'); // stock 3
    const r = addToCart(emptyCart(), { ...low, qty: 9 });
    expect(r.result).toMatchObject({ ok: true, qty: 3, capped: true });
    expect(addToCart(r.state, { ...low, qty: 1 }).result).toMatchObject({ ok: false, reason: 'max-reached' });
    const plenty = v('soy-candle', 'Fig');
    expect(addToCart(emptyCart(), { ...plenty, qty: 99 }).result).toMatchObject({ ok: true, qty: 10, capped: true });
  });
  it('updates, removes and clears', () => {
    const t = v('atelier-tote', 'Cognac');
    let s = addToCart(emptyCart(), { ...t, qty: 2 }).state;
    const key = lineKey(t.productId, t.variantId);
    expect(setLineQuantity(s, key, 5).state.lines[0].qty).toBe(5);
    expect(setLineQuantity(s, key, 500)).toMatchObject({ capped: true });
    expect(setLineQuantity(s, key, 0).state.lines).toHaveLength(0);
    expect(setLineQuantity(s, key, Number.NaN).state.lines).toHaveLength(0);
    expect(removeLine(s, key).lines).toHaveLength(0);
    s = setPromoCode(s, ' welcome10 ');
    expect(s.promoCode).toBe('WELCOME10');
    expect(clearCart()).toEqual({ lines: [] });
  });
  it('sanitises corrupt persisted state', () => {
    const t = v('atelier-tote', 'Cognac');
    expect(sanitizeCart(null).lines).toEqual([]);
    expect(sanitizeCart('garbage').lines).toEqual([]);
    expect(sanitizeCart({ lines: 'x' }).lines).toEqual([]);
    const s = sanitizeCart({
      lines: [
        { ...t, qty: 2 }, { ...t, qty: 5 }, // duplicate
        { productId: 'nope', variantId: 'x', qty: 1 }, { ...t, qty: -1 }, { ...t, qty: 'many' }, null, 7,
        { ...v('soy-candle', 'Cedar'), qty: 1e9 }
      ],
      promoCode: 42
    });
    expect(s.lines).toHaveLength(2);
    expect(s.lines[0].qty).toBe(2);
    expect(s.lines[1].qty).toBe(10);
    expect(s.promoCode).toBeUndefined();
  });
});

describe('persistent stores', () => {
  it('persists the cart to localStorage and restores it', () => {
    const t = v('atelier-tote', 'Cognac');
    addItem(t.productId, t.variantId, 2);
    expect(JSON.parse(window.localStorage.getItem('meridian-store:cart:v1')!).lines[0].qty).toBe(2);
    cartStore.reload();
    expect(cartStore.get().lines[0].qty).toBe(2);
  });
  it('recovers from corrupt JSON in storage', () => {
    window.localStorage.setItem('meridian-store:cart:v1', '{not json');
    window.localStorage.setItem('meridian-store:orders:v1', '[[[');
    window.localStorage.setItem('meridian-store:wishlist:v1', '"x"');
    cartStore.reload(); ordersStore.reload(); wishlistStore.reload();
    expect(cartStore.get().lines).toEqual([]);
    expect(ordersStore.get().orders).toEqual([]);
    expect(wishlistStore.get().ids).toEqual([]);
  });
  it('keeps working when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const t = v('atelier-tote', 'Cognac');
    expect(() => addItem(t.productId, t.variantId, 1)).not.toThrow();
    expect(cartStore.get().lines).toHaveLength(1);
    expect(() => cartStore.reload()).not.toThrow();
    spy.mockRestore(); get.mockRestore();
  });
  it('applies promo codes only when valid', () => {
    const t = v('atelier-tote', 'Cognac');
    addItem(t.productId, t.variantId, 1);
    expect(applyPromo('BOGUS').ok).toBe(false);
    expect(cartStore.get().promoCode).toBeUndefined();
    expect(applyPromo('welcome10').ok).toBe(true);
    expect(cartStore.get().promoCode).toBe('WELCOME10');
  });
  it('changeQty clamps and reports capping', () => {
    const t = v('atelier-tote', 'Ink');
    addItem(t.productId, t.variantId, 1);
    expect(changeQty(lineKey(t.productId, t.variantId), 99)).toEqual({ capped: true });
    expect(cartStore.get().lines[0].qty).toBe(3);
  });
  it('wishlist toggles without duplicates, ignores unknown ids, and recent keeps order', () => {
    const p = getProductBySlug('merino-crew')!;
    expect(toggleWishlist(p.id)).toBe(true);
    expect(toggleWishlist(p.id)).toBe(false);
    toggleWishlist(p.id);
    expect(wishlistStore.get().ids).toEqual([p.id]);
    window.localStorage.setItem('meridian-store:wishlist:v1', JSON.stringify({ ids: [p.id, p.id, 'ghost', 5] }));
    wishlistStore.reload();
    expect(wishlistStore.get().ids).toEqual([p.id]);
    recordViewed(p.id); recordViewed(getProductBySlug('linen-shirt')!.id); recordViewed(p.id);
    expect(recentStore.get().ids[0]).toBe(p.id);
    expect(recentStore.get().ids).toHaveLength(2);
  });
  it('resetDemoData clears everything', () => {
    const t = v('atelier-tote', 'Cognac');
    addItem(t.productId, t.variantId, 1); toggleWishlist(t.productId);
    resetDemoData();
    expect(cartStore.get().lines).toEqual([]);
    expect(wishlistStore.get().ids).toEqual([]);
    expect(window.localStorage.getItem('meridian-store:cart:v1')).toBeNull();
  });
});
