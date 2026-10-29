import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { about, articles, classes, comparison, facilities, gallery, homeSections, journalCategories, plans, programCategories, programs, site, trainers, testimonials, journalImages, trainerImages, images, facilityImages, navigation } from '../config';

const publicDir = path.resolve(__dirname, '../../public');
const unique = (a: string[]) => new Set(a).size === a.length;

describe('configuration integrity', () => {
  it('has the required amount of content', () => {
    expect(programs.length).toBeGreaterThanOrEqual(8);
    expect(trainers.length).toBeGreaterThanOrEqual(6);
    expect(plans.length).toBeGreaterThanOrEqual(3);
    expect(facilities.length).toBeGreaterThanOrEqual(6);
    expect(articles.length).toBeGreaterThanOrEqual(6);
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
  });

  it('includes the eight required programs', () => {
    const names = programs.map((p) => p.name);
    ['Strength Training', 'Functional Training', 'HIIT', 'Boxing Fitness', 'Mobility', 'Personal Training', 'Group Conditioning', 'Performance Training'].forEach((n) => expect(names).toContain(n));
  });

  it('uses unique slugs and ids', () => {
    expect(unique(programs.map((p) => p.slug))).toBe(true);
    expect(unique(trainers.map((p) => p.slug))).toBe(true);
    expect(unique(articles.map((p) => p.slug))).toBe(true);
    expect(unique(classes.map((p) => p.id))).toBe(true);
    expect(unique(plans.map((p) => p.id))).toBe(true);
    expect(unique(gallery.map((g) => g.id))).toBe(true);
  });

  it('keeps program ↔ trainer references consistent in both directions', () => {
    for (const p of programs) {
      expect(p.trainerSlugs.length).toBeGreaterThan(0);
      for (const t of p.trainerSlugs) {
        const tr = trainers.find((x) => x.slug === t);
        expect(tr, `${p.slug} → ${t}`).toBeDefined();
        expect(tr!.programSlugs, `${t} lists ${p.slug}`).toContain(p.slug);
      }
    }
    for (const t of trainers) for (const s of t.programSlugs) expect(programs.find((p) => p.slug === s), `${t.slug} → ${s}`).toBeDefined();
  });

  it('keeps every class pointing at a real program and trainer', () => {
    for (const c of classes) {
      const p = programs.find((x) => x.slug === c.programSlug);
      expect(p, c.id).toBeDefined();
      expect(p!.trainerSlugs, `${c.id}: trainer teaches program`).toContain(c.trainerSlug);
      expect(c.day).toBeGreaterThanOrEqual(0);
      expect(c.day).toBeLessThanOrEqual(6);
      expect(c.start).toMatch(/^\d{2}:\d{2}$/);
      expect(c.capacity).toBeGreaterThan(0);
    }
  });

  it('has valid categories', () => {
    programs.forEach((p) => expect(programCategories).toContain(p.category));
    articles.forEach((a) => expect(journalCategories).toContain(a.category));
  });

  it('marks trainer qualifications as fictional', () => {
    trainers.forEach((t) => t.qualifications.forEach((q) => expect(q.toLowerCase()).toContain('fictional')));
  });

  it('has a comparison value for every plan', () => {
    comparison.forEach((r) => plans.forEach((p) => expect(r.values, `${r.label}/${p.id}`).toHaveProperty(p.id)));
    plans.forEach((p) => expect(p.annualMonthly).toBeLessThanOrEqual(p.monthly));
  });

  it('references only images that exist on disk', () => {
    const all = [...Object.values(images), ...Object.values(facilityImages), ...journalImages, ...trainerImages, ...programs.map((p) => p.image), ...articles.map((a) => a.image)];
    all.forEach((i) => {
      expect(existsSync(path.join(publicDir, i.src)), i.src).toBe(true);
      expect(i.alt.length).toBeGreaterThan(8);
      expect(i.width).toBeGreaterThan(0);
    });
    [site.brand.logo, site.brand.favicon, site.seo.ogImage].forEach((f) => expect(existsSync(path.join(publicDir, f)), f).toBe(true));
  });

  it('has valid homepage sections, navigation and about stats', () => {
    expect(unique(homeSections.map((s) => s.id))).toBe(true);
    expect(homeSections.find((s) => s.id === 'hero')?.visible).toBe(true);
    navigation.forEach((n) => expect(n.to.startsWith('/')).toBe(true));
    expect(about.stats.map((s) => s.value)).toContain(String(classes.length));
  });

  it('credits the template owner separately from the fictional business', () => {
    expect(site.template.ownerName).toBe('OneStop Infinite');
    expect(site.brand.name).not.toContain('OneStop');
  });

  it('ships in demonstration mode (no form endpoint, no secrets)', () => {
    expect(site.forms.endpoint).toBe('');
  });
});
