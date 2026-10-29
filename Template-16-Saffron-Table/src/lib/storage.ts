/** localStorage wrapper that never throws and falls back to memory (private windows, blocked storage). */
const memory = new Map<string, string>();

export const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key) ?? memory.get(key) ?? null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    try {
      const raw = memory.get(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
};

export const writeJson = (key: string, value: unknown): void => {
  const raw = JSON.stringify(value);
  memory.set(key, raw);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    /* storage unavailable: memory copy keeps the session working */
  }
};

export const removeKey = (key: string): void => {
  memory.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};
