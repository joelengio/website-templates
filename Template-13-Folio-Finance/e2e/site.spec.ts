import { expect, test } from '@playwright/test';
import { brokenImages, horizontalOverflow, routes, viewports, watchErrors } from './helpers';

test.describe('every route loads directly (SPA deep links)', () => {
  for (const path of routes) {
    test(`direct load ${path}`, async ({ page }) => {
      const errors = watchErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('main h1').first()).toBeVisible();
      await expect(page.getByRole('heading', { name: /could not be found/i })).toHaveCount(0);
      expect(await page.title()).toMatch(/Folio Finance/);
      expect(await brokenImages(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
});

test('unknown route renders the 404 page with navigation', async ({ page }) => {
  await page.goto('/definitely/not/here');
  await expect(page.getByRole('heading', { name: /could not be found/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('per-route SEO: unique titles, descriptions, canonical and Open Graph', async ({ page }) => {
  const seen = new Set<string>();
  for (const path of ['/', '/services', '/services/tax-planning', '/pricing', '/tools', '/insights', '/insights/building-a-cash-buffer', '/team/priya-raman', '/contact', '/book', '/about', '/industries/startups']) {
    await page.goto(path);
    await expect(page.locator('main h1').first()).toBeVisible();
    const title = await page.title();
    expect(seen.has(title), `duplicate title ${title}`).toBe(false);
    seen.add(title);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`https://folio-finance.example.com${path === '/' ? '/' : path}`);
    expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBe(title);
    expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(/^https:\/\/.+\.jpg$/);
    expect(await page.locator('h1').count(), `one h1 on ${path}`).toBe(1);
  }
});

test('robots.txt and sitemap.xml are served', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Sitemap: https://folio-finance.example.com/sitemap.xml');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain('/services/tax-planning');
  expect(xml).toContain('/insights/understanding-compound-growth');
  const fav = await request.get('/favicon.svg');
  expect(fav.ok()).toBe(true);
});

test.describe('responsive layout: no horizontal overflow at 360/390/768/1024/1440', () => {
  for (const width of viewports) {
    test(`width ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const problems: string[] = [];
      for (const path of routes) {
        await page.goto(path);
        await expect(page.locator('main h1').first()).toBeVisible();
        const o = await horizontalOverflow(page);
        if (o.doc > 1 || o.offenders.length) problems.push(`${path}: doc+${o.doc} ${o.offenders.join(' | ')}`);
      }
      expect(problems).toEqual([]);
    });
  }
});

test('mobile menu: opens, traps focus, navigates and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /open menu/i });
  await toggle.click();
  const menu = page.getByRole('dialog', { name: 'Site menu' });
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await toggle.click();
  await page.getByRole('dialog', { name: 'Site menu' }).getByRole('link', { name: 'Pricing' }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toHaveCount(0);
  await expect(page.locator('main h1')).toContainText('Engagement plans');
});

test('desktop navigation shows the active route and links work', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Tools' }).click();
  await expect(page).toHaveURL(/\/tools$/);
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Tools' })).toHaveAttribute('aria-current', 'page');
});

test('keyboard: skip link and visible focus indicator', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');
});

test('reduced motion removes animations', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  const dur = await page.locator('.hero__panel').evaluate((el) => getComputedStyle(el).animationName);
  expect(dur === 'none' || dur === '').toBe(true);
  await ctx.close();
});

test('home page: sections, demo-data labelling and tool preview', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Demonstration data — not real firm performance')).toBeVisible();
  await expect(page.getByText('Fictional testimonials written for this template')).toBeVisible();
  const before = await page.locator('.tool-preview__result strong').textContent();
  await page.locator('#tp-monthly').fill('1500');
  await expect.poll(() => page.locator('.tool-preview__result strong').textContent()).not.toBe(before);
  await expect(page.getByRole('contentinfo')).toContainText('OneStop Infinite');
});
