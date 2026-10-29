import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { treatments, treatmentCategories, packages, packageCategories, packageComparisonRows, staff, galleryItems, galleryCategories, articles, journalCategories, homeSections, images, site, packageSavings } from '../config';
import { teamImages, journalImages } from '../config/images';

const pub = (src: string) => path.resolve(__dirname, '../../public', src.replace(/^\//, ''));
const unique = (a: string[]) => new Set(a).size === a.length;

describe('central configuration integrity', () => {
  it('has unique, URL-safe slugs', () => {
    for (const list of [treatments.map((t) => t.slug), packages.map((p) => p.slug), articles.map((a) => a.slug)]) {
      expect(unique(list)).toBe(true);
      list.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
    }
  });
  it('references valid categories', () => {
    treatments.forEach((t) => expect(treatmentCategories.map((c) => c.id)).toContain(t.category));
    packages.forEach((p) => expect(packageCategories.map((c) => c.id)).toContain(p.category));
    galleryItems.forEach((g) => expect(galleryCategories.map((c) => c.id)).toContain(g.category));
    articles.forEach((a) => expect(journalCategories).toContain(a.category));
    packages.forEach((p) => p.features.forEach((f) => expect(packageComparisonRows.map((r) => r.id)).toContain(f)));
  });
  it('has valid prices and options', () => {
    treatments.forEach((t) => { expect(t.options.length).toBeGreaterThan(0); t.options.forEach((o) => { expect(o.price).toBeGreaterThan(0); expect(o.minutes).toBeGreaterThan(0); }); });
    packages.forEach((p) => expect(packageSavings(p)).toBeGreaterThanOrEqual(0));
  });
  it('every treatment category has treatments and every category is staffed', () => {
    treatmentCategories.forEach((c) => {
      expect(treatments.some((t) => t.category === c.id)).toBe(true);
      expect(staff.some((s) => s.specialties.includes(c.id))).toBe(true);
    });
  });
  it('every referenced image exists on disk with alt text', () => {
    const all = [...Object.values(images), ...teamImages, ...journalImages, ...galleryItems.map((g) => g.image)];
    all.forEach((i) => { expect(existsSync(pub(i.src)), i.src).toBe(true); expect(i.alt.length).toBeGreaterThan(5); });
    expect(existsSync(pub(site.brand.logo))).toBe(true);
    expect(existsSync(pub(site.brand.favicon))).toBe(true);
  });
  it('treatments, packages, gallery and journal never repeat the same picture', () => {
    const uniq = (list: { image: { src: string } }[]) => new Set(list.map((i) => i.image.src)).size === list.length;
    expect(uniq(treatments)).toBe(true);
    expect(uniq(packages)).toBe(true);
    expect(uniq(galleryItems)).toBe(true);
    expect(new Set(journalImages.map((i) => i.src)).size).toBe(journalImages.length);
  });
  it('has no orphaned files in public/images', () => {
    const used = new Set([...Object.values(images), ...teamImages, ...journalImages, ...galleryItems.map((g) => g.image)].map((i) => i.src.replace('/images/', '')));
    const orphans = readdirSync(pub('/images')).filter((f) => !used.has(f));
    expect(orphans).toEqual([]);
  });
  it('home sections are unique and known', () => {
    expect(unique(homeSections.map((s) => s.id))).toBe(true);
  });
  it('distinguishes the fictional brand from the publisher', () => {
    expect(site.publisher.name).toBe('OneStop Infinite');
    expect(site.publisher.notice).toMatch(/fictional/i);
  });
});
