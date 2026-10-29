import { expect, test } from '@playwright/test';
import { routes, scrollAll, stop, watch } from './helpers';

test.describe('routes, images, console and SEO', () => {
  for (const r of routes) {
    test(`loads ${r} without console errors, broken images or missing metadata`, async ({ page }) => {
      const errors = watch(page);
      await page.goto(r);
      await expect(page.locator('h1').first()).toBeVisible();
      await stop(page);
      await scrollAll(page);
      await page.waitForLoadState('networkidle');
      await expect.poll(() => page.evaluate(() => Array.from(document.images).filter((i) => !i.complete).map((i) => i.src)), { timeout: 15000 }).toEqual([]);
      const broken = await page.evaluate(() => Array.from(document.images).filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
      expect(broken).toEqual([]);
      const noAlt = await page.evaluate(() => Array.from(document.images).filter((i) => !i.hasAttribute('alt')).length);
      expect(noAlt).toBe(0);
      const meta = await page.evaluate(() => ({
        title: document.title,
        desc: document.querySelector('meta[name=description]')?.getAttribute('content') ?? '',
        canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href') ?? '',
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
        h1: document.querySelectorAll('h1').length,
        lang: document.documentElement.lang,
      }));
      expect(meta.title.length).toBeGreaterThan(8);
      expect(meta.desc.length).toBeGreaterThan(30);
      expect(meta.canonical).toMatch(/^https:\/\/havenstays\.example\.com\//);
      expect(meta.ogTitle).toBe(meta.title);
      expect(meta.ogImage).toMatch(/^https:\/\//);
      expect(meta.h1).toBe(1);
      expect(meta.lang).toBe('en');
      expect(errors).toEqual([]);
    });
  }

  test('route titles are unique', async ({ page }) => {
    const titles = new Set<string>();
    for (const r of routes) {
      await page.goto(r);
      await page.locator('h1').first().waitFor();
      titles.add(await page.title());
    }
    expect(titles.size).toBe(routes.length);
  });

  test('unknown routes show the 404 page and unknown slugs are handled', async ({ page }) => {
    for (const r of ['/nope', '/rooms/not-a-room', '/offers/nothing', '/journal/none', '/dining/x', '/experiences/x', '/reservations/HS-NOPE00']) {
      await page.goto(r);
      await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(/wandered off|not found/i);
      await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
    }
  });

  test('robots.txt, sitemap.xml and favicon are served', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain('Sitemap: https://havenstays.example.com/sitemap.xml');
    const sm = await request.get('/sitemap.xml');
    const xml = await sm.text();
    expect(xml).toContain('<loc>https://havenstays.example.com/rooms/sea-view-deluxe</loc>');
    expect((xml.match(/<loc>/g) ?? []).length).toBeGreaterThan(40);
    expect((await request.get('/favicon.svg')).ok()).toBe(true);
    expect((await request.get('/apple-touch-icon.png')).ok()).toBe(true);
  });

  test('SPA deep links work after reload', async ({ page }) => {
    await page.goto('/rooms/terrace-suite');
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Terrace Suite' })).toBeVisible();
  });
});

test.describe('navigation', () => {
  test('desktop navigation links route correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    for (const [name, h1] of [['Rooms & Suites', 'Rooms & Suites'], ['Dining', 'Restaurants & bars'], ['Experiences', 'Days shaped by the place'], ['Offers', 'Reasons to stay a little longer'], ['Gallery', 'A look around'], ['About', 'A small place with a long view'], ['Contact', 'We’d love to hear from you']] as const) {
      await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name, exact: true }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
    }
  });

  test('mobile menu opens, traps focus, closes with Escape and returns focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');
    const toggle = page.locator('.menu-toggle');
    await toggle.click();
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('#mobile-nav, .menu-toggle'))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await menu.getByRole('link', { name: 'Offers' }).click();
    await expect(page).toHaveURL(/\/offers$/);
    await expect(menu).toBeHidden();
  });

  test('skip link focuses main content', async ({ page }) => {
    await page.goto('/about');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe('content pages', () => {
  test('contact form validates and then confirms (demonstration only)', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /Send enquiry/ }).click();
    await expect(page.getByText('Please enter your name.')).toBeVisible();
    await expect(page.getByLabel('Your name')).toBeFocused();
    await page.getByLabel('Your name').fill('Ada Lovelace');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Topic').selectOption('Dining');
    await page.getByLabel('Message').fill('too short');
    await page.getByRole('button', { name: /Send enquiry/ }).click();
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
    await expect(page.getByText('Please write at least 10 characters.')).toBeVisible();
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Message').fill('We would like a table for two on Friday.');
    await page.getByRole('button', { name: /Send enquiry/ }).click();
    await expect(page.getByText(/not sent or stored anywhere/)).toBeVisible();
    await expect(page.getByText(/Payment received|booking confirmed/i)).toHaveCount(0);
  });

  test('FAQ accordion toggles', async ({ page }) => {
    await page.goto('/contact');
    const q = page.getByRole('button', { name: 'What time is check-in?' });
    await expect(q).toHaveAttribute('aria-expanded', 'false');
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText(/Check-in is from 15:00/)).toBeVisible();
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'false');
  });

  test('experiences filter by category and show details', async ({ page }) => {
    await page.goto('/experiences');
    await page.getByRole('button', { name: 'Wellness', exact: true }).click();
    await expect(page).toHaveURL(/category=Wellness/);
    await expect(page.locator('.card')).toHaveCount(2);
    await page.getByRole('link', { name: 'The Hammam Ritual' }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'The Hammam Ritual' })).toBeVisible();
    await page.getByRole('link', { name: 'Enquire about this experience' }).click();
    await expect(page.getByLabel('Message')).toHaveValue(/The Hammam Ritual/);
    await expect(page.getByLabel('Topic')).toHaveValue('Experiences');
  });

  test('dining pages show menus with prices and opening hours', async ({ page }) => {
    await page.goto('/dining');
    await page.getByRole('link', { name: 'Menu & details' }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'The Olive Room' })).toBeVisible();
    await expect(page.getByText('Opening hours')).toBeVisible();
    await expect(page.locator('.menu__price').first()).toContainText('$');
    await page.getByRole('button', { name: /Open photo 1/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('offer eligibility checker reports eligibility and reasons', async ({ page }) => {
    await page.goto('/offers/couples-retreat');
    await expect(page.getByRole('status').filter({ hasText: 'Eligible' })).toBeVisible();
    await page.getByLabel('Children').fill('1');
    await expect(page.getByRole('status').filter({ hasText: 'Not eligible' })).toContainText(/adults-only|children|Room/i);
    await page.goto('/offers/family-vacation');
    await expect(page.getByRole('status').filter({ hasText: 'Eligible' })).toContainText('saving');
    await page.getByLabel('Nights').fill('2');
    await expect(page.getByRole('status').filter({ hasText: 'Not eligible' })).toContainText('at least 3 nights');
    await page.getByRole('link', { name: 'Book with this offer' }).click();
    await expect(page).toHaveURL(/promo=FAMILY/);
  });

  test('journal filter and article', async ({ page }) => {
    await page.goto('/journal');
    await page.getByRole('button', { name: 'Wellness', exact: true }).click();
    await expect(page.locator('.card')).toHaveCount(1);
    await page.getByRole('link', { name: 'A guide to the hammam ritual' }).first().click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('hammam');
  });

  test('gallery filters and opens a keyboard-accessible lightbox', async ({ page }) => {
    await page.goto('/gallery');
    await page.getByRole('button', { name: 'Dining', exact: true }).click();
    await expect(page.locator('.masonry li')).toHaveCount(5);
    const opener = page.getByRole('button', { name: /Open Cove Terrace fullscreen/ });
    await opener.focus();
    await page.keyboard.press('Enter');
    const lb = page.getByRole('dialog', { name: 'Gallery viewer' });
    await expect(lb).toBeVisible();
    await expect(lb.locator('figcaption')).toContainText('1 / 5');
    await page.keyboard.press('ArrowRight');
    await expect(lb.locator('figcaption')).toContainText('2 / 5');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(lb.locator('figcaption')).toContainText('5 / 5');
    await page.keyboard.press('Escape');
    await expect(lb).toBeHidden();
    await expect(opener).toBeFocused();
  });
});
