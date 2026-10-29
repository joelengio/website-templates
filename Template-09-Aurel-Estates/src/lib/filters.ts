import type { FeatureKey, Property } from '../config/types';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'size-desc';

export interface Filters {
  q: string;
  types: string[];
  areas: string[];
  minPrice: number | null;
  maxPrice: number | null;
  beds: number;
  baths: number;
  features: FeatureKey[];
  availableOnly: boolean;
  sort: SortKey;
}

export const defaultFilters: Filters = {
  q: '',
  types: [],
  areas: [],
  minPrice: null,
  maxPrice: null,
  beds: 0,
  baths: 0,
  features: [],
  availableOnly: false,
  sort: 'featured',
};

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured first' },
  { value: 'newest', label: 'Newest listings' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'size-desc', label: 'Size: largest first' },
];

const sortKeys = sortOptions.map((o) => o.value);

const num = (v: string | null): number | null => {
  if (v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const list = (v: string | null): string[] => (v ? v.split(',').filter(Boolean) : []);

export function parseFilters(params: URLSearchParams): Filters {
  const sort = params.get('sort') as SortKey | null;
  return {
    q: params.get('q') ?? '',
    types: list(params.get('type')),
    areas: list(params.get('area')),
    minPrice: num(params.get('min')),
    maxPrice: num(params.get('max')),
    beds: num(params.get('beds')) ?? 0,
    baths: num(params.get('baths')) ?? 0,
    features: list(params.get('features')) as FeatureKey[],
    availableOnly: params.get('available') === '1',
    sort: sort && sortKeys.includes(sort) ? sort : 'featured',
  };
}

export function serializeFilters(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.types.length) p.set('type', f.types.join(','));
  if (f.areas.length) p.set('area', f.areas.join(','));
  if (f.minPrice !== null) p.set('min', String(f.minPrice));
  if (f.maxPrice !== null) p.set('max', String(f.maxPrice));
  if (f.beds) p.set('beds', String(f.beds));
  if (f.baths) p.set('baths', String(f.baths));
  if (f.features.length) p.set('features', f.features.join(','));
  if (f.availableOnly) p.set('available', '1');
  if (f.sort !== 'featured') p.set('sort', f.sort);
  return p;
}

export function activeFilterCount(f: Filters): number {
  return (
    f.types.length +
    f.areas.length +
    f.features.length +
    (f.minPrice !== null ? 1 : 0) +
    (f.maxPrice !== null ? 1 : 0) +
    (f.beds ? 1 : 0) +
    (f.baths ? 1 : 0) +
    (f.availableOnly ? 1 : 0) +
    (f.q.trim() ? 1 : 0)
  );
}

const haystack = (p: Property) =>
  [p.title, p.tagline, p.type, p.neighborhood, p.region, ...p.highlights, ...p.description].join(' ').toLowerCase();

export function filterProperties(all: Property[], f: Filters): Property[] {
  const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const out = all.filter((p) => {
    if (terms.length && !terms.every((t) => haystack(p).includes(t))) return false;
    if (f.types.length && !f.types.includes(p.type)) return false;
    if (f.areas.length && !f.areas.includes(p.neighborhood)) return false;
    if (f.minPrice !== null && p.price < f.minPrice) return false;
    if (f.maxPrice !== null && p.price > f.maxPrice) return false;
    if (f.beds && p.bedrooms < f.beds) return false;
    if (f.baths && p.bathrooms < f.baths) return false;
    if (f.features.length && !f.features.every((k) => p.features.includes(k))) return false;
    if (f.availableOnly && p.status !== 'available') return false;
    return true;
  });
  return sortProperties(out, f.sort);
}

export function sortProperties(list: Property[], sort: SortKey): Property[] {
  const copy = [...list];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'newest':
      return copy.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
    case 'size-desc':
      return copy.sort((a, b) => b.areaSqm - a.areaSqm);
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price);
  }
}
