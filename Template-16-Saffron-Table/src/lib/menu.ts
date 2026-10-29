import type { MenuCategory, MenuItem } from '../config/types';
import { allergenLabels, dietaryLabels } from '../config/menu';

export interface MenuFilters {
  category: string; // 'all' or category id
  query: string;
  dietary: string[];
  avoidAllergens: string[];
  hideUnavailable: boolean;
}

export const defaultFilters: MenuFilters = { category: 'all', query: '', dietary: [], avoidAllergens: [], hideUnavailable: false };

const norm = (s: string): string => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const itemHasDietary = (item: MenuItem, id: string): boolean =>
  id === 'vegetarian' ? item.dietary.includes('vegetarian') || item.dietary.includes('vegan') : item.dietary.includes(id);

export const searchText = (item: MenuItem): string => {
  const dietary = item.dietary.map((d) => dietaryLabels.find((l) => l.id === d)?.label ?? d);
  const allergens = item.allergens.map((a) => allergenLabels.find((l) => l.id === a)?.label ?? a);
  return norm([item.name, item.description, ...dietary, ...allergens, ...(item.courses ?? [])].join(' '));
};

export function filterMenu(items: MenuItem[], f: MenuFilters): MenuItem[] {
  const tokens = norm(f.query).split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (f.category !== 'all' && item.category !== f.category) return false;
    if (f.hideUnavailable && !item.available) return false;
    if (!f.dietary.every((d) => itemHasDietary(item, d))) return false;
    if (f.avoidAllergens.some((a) => item.allergens.includes(a))) return false;
    if (tokens.length) {
      const hay = searchText(item);
      if (!tokens.every((t) => hay.includes(t))) return false;
    }
    return true;
  });
}

export function groupByCategory(items: MenuItem[], categories: MenuCategory[]): { category: MenuCategory; items: MenuItem[] }[] {
  return categories
    .map((category) => ({ category, items: items.filter((i) => i.category === category.id) }))
    .filter((g) => g.items.length > 0);
}

export const countActiveFilters = (f: MenuFilters): number =>
  (f.category !== 'all' ? 1 : 0) + (f.query.trim() ? 1 : 0) + f.dietary.length + f.avoidAllergens.length + (f.hideUnavailable ? 1 : 0);

export const dietaryLabelFor = (id: string) => dietaryLabels.find((l) => l.id === id);
export const allergenLabelFor = (id: string) => allergenLabels.find((l) => l.id === id)?.label ?? id;
