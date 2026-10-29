import { describe, expect, it } from 'vitest';
import { categories, courses, instructors, paths, plans, articles, testimonials, site, images } from '../config';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const pub = (p: string) => resolve(__dirname, '../../public', p.replace(/^\//, ''));

describe('catalogue integrity (customization safety net)', () => {
  it('has at least 15 courses, 8 instructors, 8 categories and 3 plans', () => {
    expect(courses.length).toBeGreaterThanOrEqual(15);
    expect(instructors.length).toBeGreaterThanOrEqual(8);
    expect(categories.length).toBe(8);
    expect(plans.length).toBeGreaterThanOrEqual(3);
    expect(paths.length).toBeGreaterThanOrEqual(3);
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
    expect(articles.length).toBeGreaterThanOrEqual(6);
  });
  it('has unique slugs and ids', () => {
    for (const list of [courses.map((c) => c.slug), instructors.map((i) => i.slug), paths.map((p) => p.slug), articles.map((a) => a.slug), categories.map((c) => c.id), plans.map((p) => p.id)]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });
  it('links every course to a real category and instructor, and every instructor teaches', () => {
    courses.forEach((c) => {
      expect(categories.some((x) => x.id === c.categoryId), c.slug).toBe(true);
      expect(instructors.some((x) => x.slug === c.instructorId), c.slug).toBe(true);
    });
    instructors.forEach((i) => expect(courses.some((c) => c.instructorId === i.slug), i.slug).toBe(true));
    categories.forEach((cat) => expect(courses.some((c) => c.categoryId === cat.id), cat.id).toBe(true));
  });
  it('gives every course 2+ modules, lessons, one valid quiz per module and objectives', () => {
    courses.forEach((c) => {
      expect(c.modules.length, c.slug).toBeGreaterThanOrEqual(2);
      expect(c.objectives.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(c.rating).toBeGreaterThan(0);
      expect(c.rating).toBeLessThanOrEqual(5);
      const ids = new Set<string>();
      c.modules.forEach((m) => {
        expect(m.lessons.length, `${c.slug}/${m.id}`).toBeGreaterThanOrEqual(3);
        m.lessons.forEach((l) => {
          expect(ids.has(l.id)).toBe(false);
          ids.add(l.id);
          expect(l.body.length).toBeGreaterThan(0);
          expect(l.keyPoints.length).toBeGreaterThan(0);
        });
        expect(m.quiz.questions.length).toBeGreaterThanOrEqual(3);
        m.quiz.questions.forEach((q) => {
          expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
          expect(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length, `${c.slug}/${q.id}`).toBe(true);
          expect(new Set(q.options).size, `${c.slug}/${q.id} duplicate options`).toBe(q.options.length);
        });
      });
    });
  });
  it('covers every difficulty and has free and paid courses', () => {
    expect(new Set(courses.map((c) => c.difficulty)).size).toBe(3);
    expect(courses.some((c) => c.price === 0)).toBe(true);
    expect(courses.some((c) => c.price > 0)).toBe(true);
  });
  it('labels demonstration data and keeps the owner credit separate from the brand', () => {
    instructors.forEach((i) => expect(i.credentials.every((c) => /demo|fictional/i.test(c)), i.slug).toBe(true));
    expect(site.owner.name).toBe('OneStop Infinite');
    expect(site.name).not.toContain('OneStop');
    expect(site.disclosure).toMatch(/fictional/i);
  });
  it('points every configured image and public asset at a real file', () => {
    Object.values(images).forEach((img) => {
      expect(existsSync(pub(img.src)), img.src).toBe(true);
      expect(existsSync(pub(img.thumb)), img.thumb).toBe(true);
      expect(img.alt.length).toBeGreaterThan(10);
    });
    [site.favicon, site.seo.ogImage, '/robots.txt', '/apple-touch-icon.png'].forEach((p) => expect(existsSync(pub(p)), p).toBe(true));
    courses.forEach((c) => c.modules[0].lessons[0].media && expect(existsSync(pub(c.modules[0].lessons[0].media!.src))).toBe(true));
  });
});
