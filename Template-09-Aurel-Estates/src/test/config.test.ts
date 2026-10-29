import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { content, mainNav, pages, properties, sections, site, theme } from '../config';
import { applyTheme } from '../lib/theme';

const pub = (src: string) => resolve(__dirname, '../../public', src.replace(/^\//, ''));

describe('template data integrity', () => {
  it('has at least 12 unique, complete fictional properties', () => {
    expect(properties.length).toBeGreaterThanOrEqual(12);
    expect(new Set(properties.map((p) => p.id)).size).toBe(properties.length);
    expect(new Set(properties.map((p) => p.slug)).size).toBe(properties.length);
    for (const p of properties) {
      expect(p.price).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
      expect(p.images.length).toBeGreaterThanOrEqual(4);
    }
  });
  it('every image file exists and has alt text', () => {
    const all = [...properties.flatMap((p) => p.images), ...content.articles.map((a) => a.image), content.home.hero.image];
    for (const im of all) {
      expect(im.alt.length).toBeGreaterThan(10);
      expect(existsSync(pub(im.src)), im.src).toBe(true);
      if (im.thumb) expect(existsSync(pub(im.thumb)), im.thumb).toBe(true);
    }
  });
  it('navigation targets are valid page keys and section ids are unique', () => {
    for (const n of mainNav) expect(n.page in pages).toBe(true);
    for (const list of Object.values(sections)) expect(new Set(list.map((s) => s.id)).size).toBe(list.length);
  });
  it('keeps the owner credit separate from the demo brand', () => {
    expect(site.owner.name).toBe('OneStop Infinite');
    expect(site.brand.name).not.toContain('OneStop');
  });
  it('applies theme config to CSS variables', () => {
    const el = document.createElement('div');
    applyTheme(el);
    expect(el.style.getPropertyValue('--c-forest')).toBe(theme.colors.forest);
    expect(el.style.getPropertyValue('--font-display')).toBe(theme.fonts.display);
  });
});
