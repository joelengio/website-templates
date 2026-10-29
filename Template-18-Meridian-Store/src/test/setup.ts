import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { cartStore, ordersStore, recentStore, wishlistStore } from '../state/stores';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  [cartStore, wishlistStore, recentStore, ordersStore].forEach((s) => s.reload());
});

// jsdom does not implement these browser APIs.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as unknown as typeof window.matchMedia;
