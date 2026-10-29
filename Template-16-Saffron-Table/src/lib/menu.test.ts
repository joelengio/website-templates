import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { allergenLabels, dietaryLabels, menuCategories, menuItems } from '../config/menu';
import { images } from '../config/images';
import { defaultFilters, filterMenu, groupByCategory, itemHasDietary } from './menu';

describe('menu data integrity', () => {
  it('has at least 30 items across all eight required categories', () => {
    expect(menuItems.length).toBeGreaterThanOrEqual(30);
    expect(menuCategories.map((c) => c.id)).toEqual(['starters', 'mains', 'seafood', 'vegetarian', 'desserts', 'beverages', 'specials', 'tasting']);
    for (const c of menuCategories) expect(menuItems.some((i) => i.category === c.id), c.id).toBe(true);
  });
  it('has unique ids, valid categories, positive prices and known labels', () => {
    const ids = new Set<string>();
    for (const i of menuItems) {
      expect(ids.has(i.id)).toBe(false);
      ids.add(i.id);
      expect(menuCategories.some((c) => c.id === i.category)).toBe(true);
      expect(i.price).toBeGreaterThan(0);
      expect(i.name && i.description).toBeTruthy();
      i.dietary.forEach((d) => expect(dietaryLabels.some((l) => l.id === d), `${i.id}:${d}`).toBe(true));
      i.allergens.forEach((a) => expect(allergenLabels.some((l) => l.id === a), `${i.id}:${a}`).toBe(true));
      if (i.image) {
        expect(Object.keys(images)).toContain(i.image);
      }
    }
  });
  it('has a registered image file on disk for every registry entry', () => {
    for (const img of Object.values(images)) {
      expect(existsSync(`public${img.src}`), img.src).toBe(true);
      expect(existsSync(`public${img.thumb}`), img.thumb).toBe(true);
      expect(img.alt.length).toBeGreaterThan(10);
    }
  });
  it('keeps dietary labels consistent with allergen data', () => {
    for (const i of menuItems) {
      if (i.dietary.includes('vegan')) {
        expect(i.allergens, i.id).not.toEqual(expect.arrayContaining(['dairy']));
        expect(i.allergens, i.id).not.toEqual(expect.arrayContaining(['egg']));
        expect(i.allergens.includes('fish') || i.allergens.includes('shellfish'), i.id).toBe(false);
      }
      if (i.dietary.includes('vegetarian')) expect(i.allergens.includes('fish') || i.allergens.includes('shellfish'), i.id).toBe(false);
      if (i.dietary.includes('gluten-free')) expect(i.allergens, i.id).not.toContain('gluten');
      if (i.dietary.includes('dairy-free')) expect(i.allergens, i.id).not.toContain('dairy');
      if (i.dietary.includes('nut-free')) {
        expect(i.allergens, i.id).not.toContain('nuts');
        expect(i.allergens, i.id).not.toContain('peanuts');
      }
    }
  });
});

describe('filterMenu', () => {
  it('returns everything with default filters', () => {
    expect(filterMenu(menuItems, defaultFilters)).toHaveLength(menuItems.length);
  });
  it('filters by category', () => {
    const r = filterMenu(menuItems, { ...defaultFilters, category: 'desserts' });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((i) => i.category === 'desserts')).toBe(true);
  });
  it('searches name, description and allergen text, ignoring case and accents', () => {
    expect(filterMenu(menuItems, { ...defaultFilters, query: 'PAELLA' }).map((i) => i.id)).toContain('saffron-seafood-paella');
    expect(filterMenu(menuItems, { ...defaultFilters, query: 'creme fraiche' }).map((i) => i.id)).toContain('warm-brownie');
    expect(filterMenu(menuItems, { ...defaultFilters, query: 'saffron salmon' }).length).toBeGreaterThan(0);
    expect(filterMenu(menuItems, { ...defaultFilters, query: 'zzzzzz' })).toEqual([]);
  });
  it('applies dietary filters with AND semantics', () => {
    const r = filterMenu(menuItems, { ...defaultFilters, dietary: ['vegan', 'gluten-free'] });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((i) => i.dietary.includes('vegan') && i.dietary.includes('gluten-free'))).toBe(true);
  });
  it('treats vegan dishes as vegetarian', () => {
    const vegan = menuItems.find((i) => i.dietary.includes('vegan'))!;
    expect(itemHasDietary({ ...vegan, dietary: ['vegan'] }, 'vegetarian')).toBe(true);
    expect(filterMenu(menuItems, { ...defaultFilters, dietary: ['vegetarian'] }).some((i) => i.id === vegan.id)).toBe(true);
  });
  it('hides dishes listing selected allergens', () => {
    const r = filterMenu(menuItems, { ...defaultFilters, avoidAllergens: ['shellfish', 'dairy'] });
    expect(r.every((i) => !i.allergens.includes('shellfish') && !i.allergens.includes('dairy'))).toBe(true);
  });
  it('can hide unavailable items and groups results by category', () => {
    expect(menuItems.some((i) => !i.available)).toBe(true);
    const r = filterMenu(menuItems, { ...defaultFilters, hideUnavailable: true });
    expect(r.every((i) => i.available)).toBe(true);
    const g = groupByCategory(r, menuCategories);
    expect(g.reduce((n, x) => n + x.items.length, 0)).toBe(r.length);
  });
});
