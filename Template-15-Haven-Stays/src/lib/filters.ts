import type { Room } from '../config/types';

export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'size-desc' | 'capacity-desc';

export interface RoomFilters {
  q: string;
  category: string;
  guests: number;
  maxPrice: number;
  amenities: string[];
  sort: SortKey;
}

export const defaultFilters = (maxPrice: number): RoomFilters => ({ q: '', category: 'all', guests: 0, maxPrice, amenities: [], sort: 'recommended' });

export function filterRooms(list: Room[], f: RoomFilters): Room[] {
  const q = f.q.trim().toLowerCase();
  const out = list.filter((r) => {
    if (r.units < 1) return false;
    if (f.category !== 'all' && r.category !== f.category) return false;
    if (f.guests && r.maxOccupancy < f.guests) return false;
    if (r.baseRate > f.maxPrice) return false;
    if (f.amenities.some((a) => !r.amenities.includes(a))) return false;
    if (q && !`${r.name} ${r.category} ${r.tagline} ${r.view} ${r.beds} ${r.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const by: Record<SortKey, (a: Room, b: Room) => number> = {
    recommended: (a, b) => Number(!!b.featured) - Number(!!a.featured) || list.indexOf(a) - list.indexOf(b),
    'price-asc': (a, b) => a.baseRate - b.baseRate,
    'price-desc': (a, b) => b.baseRate - a.baseRate,
    'size-desc': (a, b) => b.areaSqm - a.areaSqm,
    'capacity-desc': (a, b) => b.maxOccupancy - a.maxOccupancy || a.baseRate - b.baseRate,
  };
  return out.sort(by[f.sort]);
}

const sorts: SortKey[] = ['recommended', 'price-asc', 'price-desc', 'size-desc', 'capacity-desc'];

export function readFilters(sp: URLSearchParams, maxPrice: number): RoomFilters {
  const guests = Number(sp.get('guests'));
  const price = Number(sp.get('maxPrice'));
  const sort = sp.get('sort') as SortKey;
  return {
    q: (sp.get('q') ?? '').slice(0, 60),
    category: sp.get('cat') ?? 'all',
    guests: Number.isInteger(guests) && guests > 0 && guests <= 12 ? guests : 0,
    maxPrice: Number.isFinite(price) && price > 0 ? Math.min(price, maxPrice) : maxPrice,
    amenities: (sp.get('am') ?? '').split(',').filter(Boolean),
    sort: sorts.includes(sort) ? sort : 'recommended',
  };
}

export function writeFilters(f: RoomFilters, maxPrice: number, keep: URLSearchParams): URLSearchParams {
  const sp = new URLSearchParams();
  for (const k of ['in', 'out', 'adults', 'children']) if (keep.get(k)) sp.set(k, keep.get(k)!);
  if (f.q) sp.set('q', f.q);
  if (f.category !== 'all') sp.set('cat', f.category);
  if (f.guests) sp.set('guests', String(f.guests));
  if (f.maxPrice < maxPrice) sp.set('maxPrice', String(f.maxPrice));
  if (f.amenities.length) sp.set('am', f.amenities.join(','));
  if (f.sort !== 'recommended') sp.set('sort', f.sort);
  return sp;
}
