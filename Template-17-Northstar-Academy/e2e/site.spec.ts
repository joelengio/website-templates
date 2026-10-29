import { expect, test } from '@playwright/test';
import { assertNoOverflowOrBrokenImages, completedState, seed, seedState, STORAGE_KEY, viewports, watch } from './helpers';

const publicRoutes = ['/', '/courses', '/courses/web-foundations', '/courses/spanish-conversations', '/instructors', '/instructors/amara-lindqvist', '/paths', '/plans', '/about', '/journal', '/journal/how-to-build-a-study-habit', '/contact', '/nope-404'];
const learnRoutes = ['/learn', '/learn/web-foundations', '/learn/web-foundations/lesson/m1-l3', '/learn/web-foundations/quiz/m1-quiz', '/learn/bookmarks', '/learn/completed', '/learn/visual-hierarchy/certificate'];

for (const w of viewports) {
  test.describe(`layout @ ${w}px`, () => {
    test.use({ viewport: { width: w, height: 900 } });
    for (const route of [...publicRoutes, ...learnRoutes]) {
      test(`${route}: no overflow, broken images or console errors`, async ({ page }) => {
        const errors = watch(page);
        if (route.startsWith('/learn')) await seed(page, completedState);
        await page.goto(route);
        await expect(page.locator('h1').first()).toBeVisible();
        await page.waitForLoadState('networkidle');
        await assertNoOverflowOrBrokenImages(page);
        expect(errors).toEqual([]);
      });
    }
  });
}

test.describe('course catalogue', () => {
  test('search, filters, sorting, URL state, empty state and reset', async ({ page }) => {
    await page.goto('/courses');
    const count = page.getByTestId('result-count');
    await expect(count).toContainText('17 of 17');
    await page.getByRole('searchbox', { name: 'Search courses' }).fill('python');
    await expect(count).toContainText('1 of 17');
    await expect(page).toHaveURL(/q=python/);
    await page.getByRole('searchbox', { name: 'Search courses' }).fill('');
    await page.getByRole('button', { name: 'Design', exact: true }).click();
    await expect(count).toContainText('2 of 17');
    await page.locator('#d-level').selectOption('Beginner');
    await expect(count).toContainText('1 of 17');
    await page.locator('#d-price').selectOption('paid');
    await expect(page.getByText('No courses match those filters')).toBeVisible();
    await page.getByRole('button', { name: 'Reset search and filters' }).click();
    await expect(count).toContainText('17 of 17');
    await page.locator('#d-sort').selectOption('price-desc');
    await expect(page.locator('.course-card__title').first()).toContainText('Financial Modeling');
    await page.reload();
    await expect(page.locator('#d-sort')).toHaveValue('price-desc');
  });
  test('free-only filter via home hero search and CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('searchbox', { name: 'Search courses' }).fill('sql');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page).toHaveURL(/\/courses\?q=sql/);
    await expect(page.getByTestId('result-count')).toContainText('1 of');
    await page.goto('/courses?price=free');
    await expect(page.getByTestId('result-count')).toContainText('3 of 17');
  });
  test('mobile filter drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/courses');
    await page.getByRole('button', { name: /filters/i }).click();
    const dlg = page.getByRole('dialog', { name: 'Filter courses' });
    await expect(dlg).toBeVisible();
    await dlg.getByRole('button', { name: 'Marketing' }).click();
    await dlg.getByRole('button', { name: /show 2 courses/i }).click();
    await expect(page.getByTestId('result-count')).toContainText('2 of 17');
  });
});

test.describe('learning workflow', () => {
  test('enroll → lessons → progress % → quiz fail/retry/pass → completion → certificate → persistence → reset', async ({ page }) => {
    const errors = watch(page);
    await page.goto('/courses/spreadsheet-analytics');
    await page.getByRole('button', { name: /enroll free/i }).click();
    const dlg = page.getByRole('dialog');
    await expect(dlg).toContainText('no payment');
    await expect(dlg.getByRole('button', { name: 'Confirm demo enrollment' })).toBeFocused();
    await dlg.getByRole('button', { name: 'Confirm demo enrollment' }).click();
    await expect(page.getByRole('heading', { name: 'Course outline' })).toBeVisible();
    await expect(page.getByRole('progressbar', { name: /progress/ }).first()).toHaveAttribute('aria-valuenow', '0');

    await page.getByRole('link', { name: 'Start learning' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Structure of tidy data' })).toBeVisible();
    // 9 lessons + 3 quizzes = 12 steps → each lesson ≈ 8%
    await page.getByRole('button', { name: 'Mark lesson complete' }).click();
    await expect(page.getByRole('progressbar', { name: /Analytical Spreadsheets progress/ }).first()).toHaveAttribute('aria-valuenow', '8');

    // next / previous
    await page.getByRole('link', { name: /Skip to next|Next/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Cleaning text and dates' })).toBeVisible();
    await page.getByRole('link', { name: /Previous/ }).click();
    await expect(page.getByRole('button', { name: /Completed — mark as not complete/ })).toHaveAttribute('aria-pressed', 'true');

    // persistence across reload
    await page.reload();
    await expect(page.getByRole('button', { name: /Completed — mark as not complete/ })).toBeVisible();
    // toggle off and on
    await page.getByRole('button', { name: /Completed — mark as not complete/ }).click();
    await expect(page.getByRole('progressbar', { name: /progress/ }).first()).toHaveAttribute('aria-valuenow', '0');
    await page.getByRole('button', { name: 'Mark lesson complete' }).click();

    // finish every lesson via UI
    for (const id of ['m1-l2', 'm1-l3', 'm2-l1', 'm2-l2', 'm2-l3', 'm3-l1', 'm3-l2', 'm3-l3']) {
      await page.goto(`/learn/spreadsheet-analytics/lesson/${id}`);
      await page.getByRole('button', { name: 'Mark lesson complete' }).click();
    }
    // all lessons done but quizzes outstanding → NOT complete
    await page.goto('/learn/spreadsheet-analytics');
    await expect(page.getByText('9/9 lessons · 0/3 quizzes passed')).toBeVisible();
    await expect(page.getByRole('progressbar', { name: /progress/ }).first()).toHaveAttribute('aria-valuenow', '75');
    await expect(page.getByText(/Course complete/)).toHaveCount(0);

    // Quiz 1: fail (all first options wrong: answers are 0,1,1 → choose option 3 everywhere)
    await page.goto('/learn/spreadsheet-analytics/quiz/m1-quiz');
    await page.getByRole('button', { name: 'Start quiz' }).click();
    await page.getByRole('button', { name: 'Submit answers' }).click();
    await expect(page.getByRole('alert')).toContainText('answer every question');
    for (const g of await page.getByRole('group').all()) await g.getByRole('radio').nth(3).check();
    await page.getByRole('button', { name: 'Submit answers' }).click();
    await expect(page.getByRole('heading', { name: /Keep going: 0 of 3 correct/ })).toBeFocused();
    await expect(page.getByText('Correct answer:').first()).toBeVisible();
    // retry → pass at exactly 67%? 2 of 3 = 67% < 70 → fail edge case
    await page.getByRole('button', { name: 'Try again' }).click();
    const correct1 = [1, 1, 1];
    const groups = await page.getByRole('group').all();
    // m1-quiz correct answers are options 1, 1, 1; deliberately get the last one wrong
    await groups[0].getByRole('radio').nth(correct1[0]).check();
    await groups[1].getByRole('radio').nth(correct1[1]).check();
    await groups[2].getByRole('radio').nth(0).check();
    await page.getByRole('button', { name: 'Submit answers' }).click();
    await expect(page.getByRole('heading', { name: /2 of 3 correct/ })).toBeVisible();
    await expect(page.getByText('You scored 67%')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible(); // 67% < 70% pass mark
    await page.getByRole('button', { name: 'Try again' }).click();
    const g2 = await page.getByRole('group').all();
    for (let i = 0; i < 3; i++) await g2[i].getByRole('radio').nth(correct1[i]).check();
    await page.getByRole('button', { name: 'Submit answers' }).click();
    await expect(page.getByRole('heading', { name: /Perfect score: 3 of 3 correct/ })).toBeVisible();
    const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), STORAGE_KEY);
    expect(stored.quizzes['spreadsheet-analytics:m1-quiz']).toMatchObject({ passed: true, best: 100, last: 100, attempts: 3 });

    // Quizzes 2 and 3 via fast seeding of answers = read correct from page? Use config knowledge: indices.
    const answerSets: Record<string, number[]> = { 'm2-quiz': [0, 1, 1], 'm3-quiz': [1, 1, 1] };
    for (const [qid, ans] of Object.entries(answerSets)) {
      await page.goto(`/learn/spreadsheet-analytics/quiz/${qid}`);
      await page.getByRole('button', { name: 'Start quiz' }).click();
      const gs = await page.getByRole('group').all();
      for (let i = 0; i < 3; i++) await gs[i].getByRole('radio').nth(ans[i]).check();
      await page.getByRole('button', { name: 'Submit answers' }).click();
    }
    await expect(page.getByText(/Course complete!/)).toBeVisible();
    await page.goto('/learn/spreadsheet-analytics');
    await expect(page.getByText(/Course complete — every lesson finished and every quiz passed/)).toBeVisible();
    await expect(page.getByRole('progressbar', { name: /progress/ }).first()).toHaveAttribute('aria-valuenow', '100');

    // Completed page + certificate
    await page.goto('/learn/completed');
    await expect(page.getByRole('heading', { name: 'Analytical Spreadsheets' })).toBeVisible();
    await page.getByRole('link', { name: /Certificate preview/ }).click();
    await expect(page.getByText('DEMONSTRATION — NOT ACCREDITED')).toBeVisible();

    // Dashboard reflects it, and reset clears everything
    await page.goto('/learn');
    await expect(page.getByRole('list', { name: 'Learning summary' })).toContainText('Completed');
    await page.getByRole('button', { name: 'Reset demo progress' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Reset demo progress' })).toBeFocused();
    await page.getByRole('button', { name: 'Reset demo progress' }).click();
    await page.getByRole('button', { name: 'Reset everything' }).click();
    await expect(page.getByText('You have not enrolled in anything yet')).toBeVisible();
    await page.reload();
    await expect(page.getByText('You have not enrolled in anything yet')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('dashboard sample data, continue learning, bookmarks and completed review', async ({ page }) => {
    await seed(page, seedState);
    await page.goto('/learn');
    await expect(page.getByRole('heading', { name: 'Welcome back, Sam' })).toBeVisible();
    await expect(page.getByText(/no real account/i).first()).toBeVisible();
    const cont = page.getByRole('region', { name: 'Continue learning' });
    await expect(cont).toContainText('Modern Web Foundations');
    await cont.getByRole('link', { name: 'Continue' }).click();
    // last visited incomplete step was lesson m1-l3
    await expect(page.getByRole('heading', { level: 1, name: 'Developer tools in ten minutes' })).toBeVisible();
    await page.goto('/learn/bookmarks');
    await expect(page.getByRole('heading', { name: 'Bookmarked courses (1)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bookmarked lessons (1)' })).toBeVisible();
    await page.getByRole('button', { name: /Remove bookmark from Practical Prompt Craft/ }).click();
    await expect(page.getByRole('heading', { name: 'Bookmarked courses (0)' })).toBeVisible();
  });

  test('"Load sample progress" fills the dashboard and quiz scores chart', async ({ page }) => {
    await page.goto('/learn');
    await page.getByRole('button', { name: 'Load sample progress' }).first().click();
    await expect(page.getByRole('heading', { name: 'Your courses' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Best quiz scores' })).toBeVisible();
    await expect(page.getByRole('img', { name: /Learning minutes over the last 7 days/ })).toBeVisible();
  });

  test('lesson viewer: video clip, outline drawer on mobile and keyboard navigation', async ({ page }) => {
    await seed(page, seedState);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/learn/web-foundations/lesson/m1-l1');
    await expect(page.locator('video')).toBeVisible();
    await expect(page.locator('video track')).toHaveCount(1);
    await expect(page.locator('.lesson-side')).toBeHidden();
    await page.getByRole('button', { name: 'Outline' }).click();
    const drawer = page.getByRole('dialog', { name: 'Course outline' });
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(drawer.locator(':focus')).toHaveCount(1);
    await drawer.getByRole('link', { name: /Your first semantic page/ }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1, name: 'Your first semantic page' })).toBeVisible();
  });

  test('desktop lesson viewer shows the persistent sidebar with module accordion', async ({ page }) => {
    await seed(page, seedState);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/learn/web-foundations/lesson/m2-l1');
    const side = page.getByRole('complementary', { name: 'Course outline' });
    await expect(side.getByRole('link', { name: /The box model and spacing/ })).toHaveAttribute('aria-current', 'page');
    const head = side.getByRole('button', { name: /Adding behaviour with JavaScript/ });
    await expect(head).toHaveAttribute('aria-expanded', 'false');
    await head.focus();
    await page.keyboard.press('Enter');
    await expect(head).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('learning paths', () => {
  test('start learning enrolls in the first course and opens its first lesson', async ({ page }) => {
    await page.goto('/paths');
    const web = page.locator('#web-builder');
    await expect(web).toContainText('0 of 3 courses complete');
    await web.getByRole('button', { name: 'Start learning' }).click();
    await expect(page).toHaveURL(/\/learn\/web-foundations\/lesson\/m1-l1/);
    await page.goto('/paths');
    await expect(page.locator('#web-builder').getByRole('button', { name: 'Continue learning' })).toBeVisible();
    await expect(page.locator('#web-builder').getByRole('progressbar').first()).toBeVisible();
  });
  test('completed courses advance the path', async ({ page }) => {
    await seed(page, completedState);
    await page.goto('/paths');
    const p = page.locator('#product-designer');
    await expect(p).toContainText('1 of 3 courses complete');
    await p.getByRole('button', { name: 'Continue learning' }).click();
    await expect(page).toHaveURL(/\/learn\/ui-design-systems\/lesson\/m1-l1/);
  });
});

test.describe('plans', () => {
  test('monthly/annual toggle, comparison and inquiry', async ({ page }) => {
    await page.goto('/plans');
    await expect(page.getByTestId('price-learner')).toContainText('$24');
    await page.getByRole('button', { name: /Annual/ }).click();
    await expect(page.getByTestId('price-learner')).toContainText('$19');
    await expect(page.getByTestId('price-pro')).toContainText('$39');
    await expect(page.getByText('Billed $228 per year · save 21%')).toBeVisible();
    await page.getByRole('button', { name: 'Monthly' }).click();
    await expect(page.getByTestId('price-pro')).toContainText('$49');
    await expect(page.getByRole('table')).toBeVisible();
    await page.getByRole('link', { name: 'Ask about Pro' }).click();
    await expect(page.locator('#pi-topic')).toHaveValue('Pro');
    await page.getByRole('button', { name: 'Send inquiry' }).click();
    await expect(page.getByText('Enter your name')).toBeVisible();
  });
});

test.describe('navigation and meta', () => {
  test('mobile navigation by keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await expect(page.locator('.site-nav')).toBeHidden();
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    const dlg = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dlg).toBeVisible();
    await expect(dlg.getByRole('button', { name: 'Close menu' })).toBeFocused();
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    expect(await dlg.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
    await expect(toggle).toBeFocused();
    await toggle.click();
    await dlg.getByRole('link', { name: 'Courses' }).click();
    await expect(page).toHaveURL(/\/courses$/);
    await expect(dlg).toHaveCount(0);
  });
  test('skip link and focus indicator', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
    expect(outline).not.toBe('none');
  });
  test('per-route SEO, canonical, OG and noindex on the demo dashboard', async ({ page }) => {
    await page.goto('/courses/sql-for-analysts');
    await expect(page).toHaveTitle('SQL for Analysts · Northstar Academy');
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://northstar-academy.example.com/courses/sql-for-analysts');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /SQL for Analysts/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-cover\.png/);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'index, follow');
    await page.goto('/learn');
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, nofollow');
    await page.goto('/learn/web-foundations/certificate');
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, nofollow');
    await page.goto('/this-is-missing');
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, nofollow');
  });
  test('robots.txt, sitemap.xml, favicon, OG image and nested deep links', async ({ page, request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Disallow: /learn');
    expect(robots).toContain('Sitemap:');
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/courses/web-foundations');
    expect(sitemap).not.toMatch(/\/learn[/<]/);
    expect((await request.get('/favicon.svg')).ok()).toBe(true);
    expect((await request.get('/images/og-cover.png')).ok()).toBe(true);
    const res = await page.goto('/journal/using-ai-tools-for-study');
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Using AI tools for study');
  });
  test('journal search and category filter', async ({ page }) => {
    await page.goto('/journal');
    await expect(page.getByRole('status')).toContainText('8 of 8');
    await page.getByRole('button', { name: 'Careers' }).click();
    await expect(page.getByRole('status')).toContainText('2 of 8');
    await page.getByRole('button', { name: 'Careers' }).click();
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('zzzz');
    await expect(page.getByText('No articles found')).toBeVisible();
  });
  test('respects prefers-reduced-motion', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    const dur = await page.evaluate(() => getComputedStyle(document.querySelector('.page-transition')!).animationDuration);
    expect(parseFloat(dur)).toBeLessThan(0.01);
    await ctx.close();
  });
  test('certificate print view hides site chrome', async ({ page }) => {
    await seed(page, completedState);
    await page.goto('/learn/visual-hierarchy/certificate');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('.certificate')).toBeVisible();
    await expect(page.locator('.certificate__legal')).toContainText('Not accredited');
  });
});
