import type { Course, Difficulty } from '../config/types';
import { getCategory, getInstructor } from '../config';

export type SortKey = 'recommended' | 'rating' | 'newest' | 'duration' | 'price-asc' | 'price-desc' | 'title';
export type PriceFilter = 'all' | 'free' | 'paid';

export interface CourseFilters {
  q: string;
  category: string; // '' = all
  difficulty: '' | Difficulty;
  price: PriceFilter;
  sort: SortKey;
}

export const defaultFilters: CourseFilters = { q: '', category: '', difficulty: '', price: 'all', sort: 'recommended' };
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest rated (demo)' },
  { value: 'duration', label: 'Shortest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'title', label: 'Title A–Z' },
];

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function courseHaystack(c: Course): string {
  return norm([c.title, c.tagline, c.description, c.difficulty, c.tags.join(' '), getCategory(c.categoryId)?.name ?? '', getInstructor(c.instructorId)?.name ?? ''].join(' '));
}

/** Every whitespace-separated term must appear somewhere in the course's searchable text. */
export function matchesQuery(c: Course, q: string): boolean {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = courseHaystack(c);
  return terms.every((t) => hay.includes(t));
}

export function filterCourses(list: Course[], f: CourseFilters): Course[] {
  const out = list.filter(
    (c) =>
      matchesQuery(c, f.q) &&
      (!f.category || c.categoryId === f.category) &&
      (!f.difficulty || c.difficulty === f.difficulty) &&
      (f.price === 'all' || (f.price === 'free' ? c.price === 0 : c.price > 0)),
  );
  const idx = new Map(list.map((c, i) => [c.slug, i]));
  const by: Record<SortKey, (a: Course, b: Course) => number> = {
    recommended: (a, b) => idx.get(a.slug)! - idx.get(b.slug)!,
    rating: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
    newest: (a, b) => idx.get(b.slug)! - idx.get(a.slug)!,
    duration: (a, b) => a.hours - b.hours,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    title: (a, b) => a.title.localeCompare(b.title),
  };
  return [...out].sort(by[f.sort]);
}

export function filtersFromParams(p: URLSearchParams): CourseFilters {
  const diff = p.get('level');
  const price = p.get('price');
  const sort = p.get('sort') as SortKey | null;
  return {
    q: p.get('q') ?? '',
    category: p.get('category') ?? '',
    difficulty: diff === 'Beginner' || diff === 'Intermediate' || diff === 'Advanced' ? diff : '',
    price: price === 'free' || price === 'paid' ? price : 'all',
    sort: sort && sortOptions.some((o) => o.value === sort) ? sort : 'recommended',
  };
}

export function filtersToParams(f: CourseFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.category) p.set('category', f.category);
  if (f.difficulty) p.set('level', f.difficulty);
  if (f.price !== 'all') p.set('price', f.price);
  if (f.sort !== 'recommended') p.set('sort', f.sort);
  return p;
}

export const hasActiveFilters = (f: CourseFilters) => !!(f.q || f.category || f.difficulty || f.price !== 'all');

export function searchArticles<T extends { title: string; excerpt: string; category: string; tags: string[] }>(list: T[], q: string, category: string): T[] {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  return list.filter((a) => {
    if (category && a.category !== category) return false;
    if (!terms.length) return true;
    const hay = norm(`${a.title} ${a.excerpt} ${a.category} ${a.tags.join(' ')}`);
    return terms.every((t) => hay.includes(t));
  });
}
