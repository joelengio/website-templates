import { expect, type Page } from '@playwright/test';

export const STORAGE_KEY = 'northstar-academy:learner:v1';
export const viewports = [360, 390, 768, 1024, 1440] as const;

export const seedState = {
  version: 1,
  enrollments: {
    'web-foundations': { enrolledAt: '2026-10-01T10:00:00.000Z', lessonsDone: ['m1-l1', 'm1-l2'], last: 'lesson:m1-l3', lastAt: '2026-10-05T10:00:00.000Z' },
    'visual-hierarchy': {
      enrolledAt: '2026-10-02T10:00:00.000Z',
      completedAt: '2026-10-03T10:00:00.000Z',
      lessonsDone: ['m1-l1', 'm1-l2', 'm1-l3', 'm2-l1', 'm2-l2', 'm2-l3'],
    },
  },
  quizzes: {
    'visual-hierarchy:m1-quiz': { attempts: 2, best: 100, last: 100, passed: true, answers: {}, updatedAt: '2026-10-03T09:00:00.000Z' },
    'visual-hierarchy:m2-quiz': { attempts: 1, best: 67, last: 67, passed: false, answers: {}, updatedAt: '2026-10-03T09:30:00.000Z' },
  },
  bookmarkedCourses: ['practical-prompt-craft'],
  bookmarkedLessons: ['web-foundations:m1-l1'],
  activity: [{ date: new Date().toISOString().slice(0, 10), minutes: 35 }],
};
// The seeded visual-hierarchy course has a failed second quiz; make it complete for certificate tests.
export const completedState = {
  ...seedState,
  quizzes: { ...seedState.quizzes, 'visual-hierarchy:m2-quiz': { attempts: 2, best: 100, last: 100, passed: true, answers: {}, updatedAt: '2026-10-03T09:30:00.000Z' } },
};

export async function seed(page: Page, state: unknown) {
  await page.addInitScript(([key, value]) => {
    if (!window.sessionStorage.getItem('__seeded')) {
      window.localStorage.setItem(key as string, JSON.stringify(value));
      window.sessionStorage.setItem('__seeded', '1');
    }
  }, [STORAGE_KEY, state]);
}

/** Collects console errors and failed requests for a page. */
export function watch(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
  });
  return errors;
}

export async function assertNoOverflowOrBrokenImages(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'horizontal overflow').toBeLessThanOrEqual(0);
  const broken = await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    imgs.forEach((i) => (i.loading = 'eager'));
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = () => r(null); }))));
    return imgs.filter((i) => !i.naturalWidth).map((i) => i.src);
  });
  expect(broken, 'broken images').toEqual([]);
}
