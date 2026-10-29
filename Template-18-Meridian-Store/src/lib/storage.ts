/** localStorage wrappers that never throw (private mode, blocked storage, quota, corrupt JSON). */
export const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key: string, value: unknown): boolean => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeKey = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
};

/** Every localStorage key this template writes. Documented in README and the Privacy page. */
export const STORAGE_KEYS = {
  cart: 'meridian-store:cart:v1',
  wishlist: 'meridian-store:wishlist:v1',
  orders: 'meridian-store:orders:v1',
  recent: 'meridian-store:recent:v1'
} as const;
