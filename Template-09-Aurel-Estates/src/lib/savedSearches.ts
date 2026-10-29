import { storageKey } from './storage';
import { defaultFilters, parseFilters, serializeFilters, type Filters } from './filters';
import { featureLabels } from '../config/features';
import { formatPriceShort } from './format';

export const MAX_SAVED_SEARCHES = 8;

export interface SavedSearch {
  id: string;
  name: string;
  /** URL query string produced by `serializeFilters`, so a saved search is also a shareable link. */
  query: string;
  savedAt: string;
}

const KEY = 'savedSearches';

export function readSavedSearches(): SavedSearch[] {
  try {
    const raw = window.localStorage.getItem(storageKey(KEY));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is SavedSearch => !!s && typeof s.id === 'string' && typeof s.name === 'string' && typeof s.query === 'string')
      .slice(0, MAX_SAVED_SEARCHES);
  } catch {
    return [];
  }
}

export function writeSavedSearches(list: SavedSearch[]): void {
  try {
    window.localStorage.setItem(storageKey(KEY), JSON.stringify(list));
  } catch {
    /* storage unavailable: the list still works in memory for this session */
  }
}

/** Canonical query used to detect that the same search is already saved. */
export const searchQuery = (f: Filters): string => serializeFilters(f).toString();

export const filtersFromSaved = (s: SavedSearch): Filters => ({ ...defaultFilters, ...parseFilters(new URLSearchParams(s.query)) });

/** A short human description such as "Villa · Saltmarsh Bay · 4+ beds · up to $3M". */
export function describeFilters(f: Filters): string {
  const parts = [
    f.q.trim() && `“${f.q.trim()}”`,
    ...f.types,
    ...f.areas,
    f.beds ? `${f.beds}+ beds` : '',
    f.baths ? `${f.baths}+ baths` : '',
    f.minPrice !== null && f.maxPrice !== null ? `${formatPriceShort(f.minPrice)}–${formatPriceShort(f.maxPrice)}` : f.minPrice !== null ? `from ${formatPriceShort(f.minPrice)}` : f.maxPrice !== null ? `up to ${formatPriceShort(f.maxPrice)}` : '',
    ...f.features.map((k) => featureLabels[k] ?? k),
    f.availableOnly ? 'Available only' : '',
  ].filter(Boolean) as string[];
  return parts.slice(0, 4).join(' · ') + (parts.length > 4 ? ` +${parts.length - 4}` : '');
}
