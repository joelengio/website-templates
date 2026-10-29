import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => cleanup());
