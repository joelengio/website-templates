import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { readList, storageKey, writeList } from '../lib/storage';

export const MAX_COMPARE = 3;

interface Shortlist {
  favorites: string[];
  compare: string[];
  isFavorite: (id: string) => boolean;
  isCompared: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
  /** Polite status text for screen readers, e.g. "Added to favorites". */
  announcement: string;
}

const Ctx = createContext<Shortlist | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readList('favorites'));
  const [compare, setCompare] = useState<string[]>(() => readList('compare').slice(0, MAX_COMPARE));
  const [announcement, setAnnouncement] = useState('');

  // Keep several tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey('favorites')) setFavorites(readList('favorites'));
      if (e.key === storageKey('compare')) setCompare(readList('compare').slice(0, MAX_COMPARE));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Persist synchronously from the event handler (not inside a state updater): a reload right after a click must
  // still find the saved value, and updaters must stay free of side effects.
  const favoritesRef = useRef(favorites);
  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    const prev = favoritesRef.current;
    const has = prev.includes(id);
    const next = has ? prev.filter((x) => x !== id) : [...prev, id];
    favoritesRef.current = next;
    setFavorites(next);
    writeList('favorites', next);
    setAnnouncement(has ? 'Removed from saved homes' : 'Saved to your favorites');
  }, []);

  const toggleCompare = useCallback(
    (id: string) => {
      if (compare.includes(id)) {
        const next = compare.filter((x) => x !== id);
        setCompare(next);
        writeList('compare', next);
        setAnnouncement('Removed from comparison');
        return true;
      }
      if (compare.length >= MAX_COMPARE) {
        setAnnouncement(`You can compare up to ${MAX_COMPARE} properties. Remove one to add another.`);
        return false;
      }
      const next = [...compare, id];
      setCompare(next);
      writeList('compare', next);
      setAnnouncement('Added to comparison');
      return true;
    },
    [compare],
  );

  const clearCompare = useCallback(() => {
    setCompare([]);
    writeList('compare', []);
    setAnnouncement('Comparison cleared');
  }, []);

  const value = useMemo<Shortlist>(
    () => ({
      favorites,
      compare,
      isFavorite: (id) => favorites.includes(id),
      isCompared: (id) => compare.includes(id),
      toggleFavorite,
      toggleCompare,
      clearCompare,
      announcement,
    }),
    [favorites, compare, toggleFavorite, toggleCompare, clearCompare, announcement],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </Ctx.Provider>
  );
}

export function useShortlist(): Shortlist {
  const v = useContext(Ctx);
  if (!v) throw new Error('useShortlist must be used within ShortlistProvider');
  return v;
}
