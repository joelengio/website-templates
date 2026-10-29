import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { completedState, seed } from './helpers';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const routes = ['/', '/courses', '/courses/react-essentials', '/instructors', '/instructors/priya-raman', '/paths', '/plans', '/about', '/journal', '/journal/portfolio-projects-that-get-noticed', '/contact', '/nope', '/learn', '/learn/web-foundations', '/learn/web-foundations/lesson/m1-l1', '/learn/web-foundations/quiz/m1-quiz', '/learn/bookmarks', '/learn/completed', '/learn/visual-hierarchy/certificate'];

async function scan(page: Page, label: string) {
  const r = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(r.violations.map((v) => `${label}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`), label).toEqual([]);
}

for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 800 }]) {
  test.describe(`axe @ ${vp.w}px`, () => {
    test.use({ viewport: { width: vp.w, height: vp.h } });
    for (const route of routes) {
      test(`${route}`, async ({ page }) => {
        await seed(page, completedState);
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await scan(page, route);
      });
    }
  });
}

test.describe('axe on interactive states', () => {
  test('dialogs, quiz taking and results, filter drawer, mobile menu', async ({ page }) => {
    await seed(page, completedState);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/courses/python-first-programs');
    await page.getByRole('button', { name: /enroll free/i }).click();
    await scan(page, 'enroll dialog');
    await page.keyboard.press('Escape');
    await page.goto('/learn/web-foundations/quiz/m1-quiz');
    await page.getByRole('button', { name: /start quiz|retake quiz/i }).click();
    await page.getByRole('button', { name: 'Submit answers' }).click();
    await scan(page, 'quiz with error');
    for (const g of await page.getByRole('group').all()) await g.getByRole('radio').nth(1).check();
    await page.getByRole('button', { name: 'Submit answers' }).click();
    await page.getByRole('heading', { level: 2 }).first().waitFor();
    await scan(page, 'quiz result');
    await page.goto('/courses');
    await page.getByRole('button', { name: /filters/i }).click();
    await scan(page, 'filter drawer');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await scan(page, 'mobile menu');
    await page.keyboard.press('Escape');
    await page.goto('/learn/web-foundations/lesson/m1-l1');
    await page.getByRole('button', { name: 'Outline' }).click();
    await scan(page, 'outline drawer');
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/plans');
    await page.getByRole('button', { name: /Annual/ }).click();
    await scan(page, 'plans annual');
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send inquiry' }).click();
    await scan(page, 'contact errors');
  });
});
