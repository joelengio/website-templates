import { useSyncExternalStore } from 'react';
import { readJSON, writeJSON, removeKey } from '../lib/storage';

export interface PersistentStore<T> {
  get(): T;
  set(next: T | ((prev: T) => T)): void;
  subscribe(cb: () => void): () => void;
  /** Re-read from localStorage (used after "Reset demo data" and in tests). */
  reload(): void;
  reset(): void;
}

/**
 * A tiny external store persisted to localStorage. Mutations are synchronous, so results returned from actions always reflect the latest state
 * (no duplicate lines from double-clicks or React batching), and other tabs stay in sync through the `storage` event.
 */
export function createPersistentStore<T>(key: string, initial: () => T, sanitize: (raw: unknown) => T): PersistentStore<T> {
  let state: T = sanitize(readJSON<unknown>(key, null));
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === key || e.key === null) {
        state = sanitize(readJSON<unknown>(key, null));
        emit();
      }
    });
  }

  return {
    get: () => state,
    set(next) {
      state = typeof next === 'function' ? (next as (p: T) => T)(state) : next;
      writeJSON(key, state);
      emit();
    },
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    reload() {
      state = sanitize(readJSON<unknown>(key, null));
      emit();
    },
    reset() {
      state = initial();
      removeKey(key);
      emit();
    }
  };
}

export function useStore<T>(store: PersistentStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
