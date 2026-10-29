import { site } from '../config/site';

const key = (name: string) => `${site.storagePrefix}:${name}`;

/** localStorage can throw (private mode, blocked storage); fail soft. */
export function readList(name: string): string[] {
  try {
    const raw = window.localStorage.getItem(key(name));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function writeList(name: string, value: string[]): void {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    /* storage unavailable — state still works in memory for this session */
  }
}

export const storageKey = key;
