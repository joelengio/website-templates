import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { addOns, articles, articleCategories, booking, industries, images, plans, planFeatures, services, serviceCategories, team, testimonials } from '../config';

const pub = (p: string) => resolve(process.cwd(), 'public', p.replace(/^\//, ''));
const unique = (xs: string[]) => new Set(xs).size === xs.length;

describe('configuration integrity', () => {
  it('has the required content volume', () => {
    expect(services.length).toBeGreaterThanOrEqual(8);
    expect(industries.length).toBeGreaterThanOrEqual(7);
    expect(team.length).toBeGreaterThanOrEqual(6);
    expect(plans.length).toBeGreaterThanOrEqual(3);
    expect(articles.length).toBeGreaterThanOrEqual(8);
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
  });
  it('uses unique slugs', () => {
    for (const list of [services, industries, team, articles]) expect(unique(list.map((x) => x.slug))).toBe(true);
    expect(unique(plans.map((p) => p.id))).toBe(true);
  });
  it('cross-references resolve', () => {
    const slugs = services.map((s) => s.slug);
    for (const i of industries) for (const s of i.services) expect(slugs).toContain(s);
    for (const m of team) for (const s of m.services) expect(slugs).toContain(s);
    const cats = serviceCategories.map((c) => c.id);
    for (const s of services) for (const c of s.categories) expect(cats).toContain(c);
    for (const a of articles) expect(articleCategories).toContain(a.category);
  });
  it('plan comparison rows have one value per plan', () => {
    for (const f of planFeatures) expect(f.values).toHaveLength(plans.length);
    expect(addOns.length).toBeGreaterThan(0);
  });
  it('every referenced image key and file exists', () => {
    for (const s of services) expect(images[s.image]).toBeDefined();
    for (const i of industries) expect(images[i.image]).toBeDefined();
    for (const a of articles) expect(images[a.image]).toBeDefined();
    for (const asset of [...Object.values(images), ...team.map((m) => m.image)]) {
      expect(existsSync(pub(asset.src)), asset.src).toBe(true);
      if (asset.small) expect(existsSync(pub(asset.small)), asset.small).toBe(true);
      expect(asset.alt.length).toBeGreaterThan(10);
    }
  });
  it('team credentials are explicitly labelled as demonstration', () => {
    for (const m of team) for (const c of m.credentials) expect(c.startsWith('Demo:')).toBe(true);
  });
  it('booking configuration is coherent', () => {
    expect(booking.consultationTypes.length).toBeGreaterThan(0);
    expect(booking.maxDaysAhead).toBeGreaterThan(booking.minDaysAhead);
    expect(booking.openWeekdays.every((d) => d >= 0 && d <= 6)).toBe(true);
  });
  it('contains no invented real-world credential claims', () => {
    const text = JSON.stringify({ services, industries, team, articles, testimonials });
    for (const banned of [/\bCFA\b/, /\bCFP\b/, /\bCPA\b/, /FDIC/i, /\bSEC[- ]registered\b/i, /FCA[- ]authorised/i, /award[- ]winning/i, /guaranteed return/i]) {
      expect(text).not.toMatch(banned);
    }
  });
});
