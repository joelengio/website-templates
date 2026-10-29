import { expect, type Page } from '@playwright/test';

export const ROUTES = [
  '/', '/menus', '/reserve', '/reserve/manage', '/experiences', '/experiences/chef-tasting-menu', '/private-dining',
  '/our-story', '/gallery', '/journal', '/journal/why-we-cook-with-saffron', '/contact', '/order', '/not-a-real-page',
];

/** Scroll the whole page so lazy images load, then wait for them. */
export async function loadAllImages(page: Page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
    await Promise.race([
      Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))),
      new Promise((r) => setTimeout(r, 4000)),
    ]);
  });
}

/** Picks the first bookable date on or after `skip` days from the visible ones and a free slot. */
export async function pickDateAndSlot(page: Page, opts: { party?: number; email?: string; area?: string; dayIndex?: number } = {}) {
  await page.goto('/reserve');
  const days = page.locator('.calendar__day[aria-disabled="false"]');
  await expect(days.first()).toBeVisible();
  const count = await days.count();
  await days.nth(Math.min(opts.dayIndex ?? 3, count - 1)).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  if (opts.party) {
    const cur = 2;
    for (let i = cur; i < opts.party; i++) await page.getByRole('button', { name: 'Increase party size' }).click();
  }
  if (opts.area) await page.getByRole('radio', { name: new RegExp(opts.area) }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  const slot = page.locator('.slot:not([disabled])').first();
  await expect(slot).toBeVisible();
  await slot.click();
  await page.getByRole('button', { name: 'Continue' }).click();
}

export async function fillDetails(page: Page, email = 'ada@example.com') {
  await page.getByLabel(/Full name/).fill('Ada Lovelace');
  await page.getByLabel(/^Email/).fill(email);
  await page.getByLabel(/^Phone/).fill('+1 555 010 2000');
}
