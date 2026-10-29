import { describe, expect, it } from 'vitest';
import { addOns, articles, destinations, homeSections, imageKeys, packageFeatures, packages, services, site, team, testimonials, weddings, weddingFilterOrder, destinationCategories, journalCategories, destinationOptions, serviceOptions } from '../config';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const pub = (p: string) => path.resolve(__dirname, '../../public', p.replace(/^\//, ''));

describe('configuration integrity', () => {
  it('has the required amount of content', () => {
    expect(weddings.length).toBeGreaterThanOrEqual(12);
    expect(services).toHaveLength(8);
    expect(packages.length).toBeGreaterThanOrEqual(3);
    expect(destinations.length).toBeGreaterThanOrEqual(8);
    expect(articles.length).toBeGreaterThanOrEqual(6);
  });
  it('has unique slugs everywhere', () => {
    for (const list of [weddings, services, destinations, articles]) expect(new Set(list.map((x) => x.slug)).size).toBe(list.length);
    expect(new Set(packages.map((p) => p.id)).size).toBe(packages.length);
  });
  it('gives every wedding all required fields and a gallery', () => {
    for (const w of weddings) {
      expect(w.title && w.location && w.style && w.theme && w.eventType && w.summary).toBeTruthy();
      expect(w.guests).toBeGreaterThan(0);
      expect(w.story.length).toBeGreaterThan(0);
      expect(w.gallery.length).toBeGreaterThanOrEqual(4);
      expect(w.services.length).toBeGreaterThan(0);
      expect(destinations.some((d) => d.slug === w.destinationSlug)).toBe(true);
      w.services.forEach((s) => expect(services.some((x) => x.title === s)).toBe(true));
    }
  });
  it('filter option lists cover every value used by the portfolio', () => {
    for (const w of weddings) {
      expect(weddingFilterOrder.region).toContain(w.region);
      expect(weddingFilterOrder.style).toContain(w.style);
      expect(weddingFilterOrder.eventType).toContain(w.eventType);
    }
    for (const d of destinations) expect(destinationCategories).toContain(d.category);
    for (const a of articles) expect(journalCategories).toContain(a.category);
  });
  it('services have stages, inclusions, FAQs and a price label', () => {
    for (const s of services) {
      expect(s.stages.length).toBeGreaterThanOrEqual(3);
      expect(s.inclusions.length).toBeGreaterThanOrEqual(5);
      expect(s.faqs.length).toBeGreaterThanOrEqual(2);
      expect(s.priceLabel).toBeTruthy();
      expect(serviceOptions.some((o) => o.id === s.questionnaireId)).toBe(true);
    }
  });
  it('packages reference real features and have ascending starting prices', () => {
    const ids = new Set(packageFeatures.map((f) => f.id));
    packages.forEach((p) => p.includes.forEach((i) => expect(ids.has(i)).toBe(true)));
    const prices = packages.map((p) => p.startingPrice);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
    expect(addOns.length).toBeGreaterThan(2);
  });
  it('questionnaire destination options include every destination plus open choices', () => {
    destinations.forEach((d) => expect(destinationOptions.some((o) => o.id === d.slug)).toBe(true));
    expect(destinationOptions.map((o) => o.id)).toEqual(expect.arrayContaining(['other', 'open']));
  });
  it('home sections are unique known ids', () => {
    expect(new Set(homeSections.map((s) => s.id)).size).toBe(homeSections.length);
  });
  it('team and testimonials exist and are fictional', () => {
    expect(team.length).toBeGreaterThanOrEqual(4);
    expect(testimonials.every((t) => /fictional/i.test(t.detail))).toBe(true);
  });
  it('every registered image file exists in /public/images (full and small)', () => {
    expect(imageKeys.length).toBeGreaterThan(40);
    for (const k of imageKeys) {
      expect(existsSync(pub(`images/${k}.webp`)), k).toBe(true);
      expect(existsSync(pub(`images/${k}-sm.webp`)), `${k}-sm`).toBe(true);
    }
  });
  it('every image used by content has non-empty alt text', () => {
    const all = [...weddings.flatMap((w) => [w.cover, ...w.gallery]), ...destinations.flatMap((d) => [d.cover, ...d.gallery]), ...services.map((s) => s.image), ...articles.map((a) => a.image)];
    all.forEach((i) => expect(i.alt.length).toBeGreaterThan(10));
  });
  it('brand/publisher separation: publisher identity is not the business brand', () => {
    expect(site.publisher.name).not.toBe(site.brand.name);
    expect(site.footer.copyright).not.toContain(site.publisher.name);
  });
  it('favicon, logo and og image referenced by config exist', () => {
    for (const f of [site.brand.favicon, site.brand.logo, site.seo.ogImage]) expect(existsSync(pub(f)), f).toBe(true);
  });
  it('firebase.json rewrites all routes to index.html', () => {
    const fb = JSON.parse(readFileSync(path.resolve(__dirname, '../../firebase.json'), 'utf8'));
    expect(fb.hosting.rewrites).toContainEqual({ source: '**', destination: '/index.html' });
  });
});
