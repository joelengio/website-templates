import { site } from '../config/site';

const key = (name: string) => `${site.storagePrefix}:${name}`;

/** localStorage can throw (private mode, blocked storage); fail soft and keep the app usable in memory. */
export function readJSON<T>(name: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key(name));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(name: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const storageKey = key;
