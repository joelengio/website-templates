import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { openStay, routes, stop } from './helpers';

const scan = async (page: Page) => {
  await stop(page);
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  return res.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`);
};

test.describe('axe: WCAG A/AA', () => {
  for (const r of [...routes, '/booking?in=2026-11-10&out=2026-11-13&adults=2&children=0']) {
    test(`no violations on ${r}`, async ({ page }) => {
      await page.goto(r);
      await page.locator('h1, h2').first().waitFor();
      expect(await scan(page)).toEqual([]);
    });
  }

  test('no violations on the 404 page', async ({ page }) => {
    await page.goto('/missing');
    await page.locator('h1').waitFor();
    expect(await scan(page)).toEqual([]);
  });

  test('no violations with the calendar and guest picker open', async ({ page }) => {
    await page.goto('/booking');
    await page.getByRole('button', { name: /Check-in/ }).first().click();
    expect(await scan(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: /Guests/ }).first().click();
    expect(await scan(page)).toEqual([]);
  });

  test('no violations in booking steps, confirmation and manage pages', async ({ page }) => {
    const { checkIn, checkOut } = openStay('garden-king');
    await page.goto(`/booking?in=${checkIn}&out=${checkOut}&adults=2&children=0&room=garden-king`);
    await page.getByRole('heading', { name: 'Choose your room & rate' }).waitFor();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: /^Select Garden King Room, Flexible Rate/ }).click();
    await page.getByLabel('First name').waitFor();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: 'Review reservation' }).click(); // shows errors
    expect(await scan(page)).toEqual([]);
    await page.getByLabel('First name').fill('Ada');
    await page.getByLabel('Last name').fill('Lovelace');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Phone').fill('+44 20 7946 0000');
    await page.getByRole('button', { name: 'Review reservation' }).click();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Confirm demonstration booking' }).click();
    await page.getByText('Not a real booking.').waitFor();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('link', { name: 'View, change or cancel' }).click();
    await page.getByRole('button', { name: 'Change reservation' }).click();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: 'Discard changes' }).click();
    await page.getByRole('button', { name: 'Cancel reservation' }).click();
    await page.getByRole('dialog').waitFor();
    expect(await scan(page)).toEqual([]);
  });

  test('no violations with the lightbox and mobile menu open', async ({ page }) => {
    await page.goto('/rooms/sea-view-deluxe');
    await page.getByRole('button', { name: /fullscreen/ }).click();
    await page.getByRole('dialog').waitFor();
    expect(await scan(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 390, height: 800 });
    await page.locator('.menu-toggle').click();
    expect(await scan(page)).toEqual([]);
  });

  test('empty states and filters have no violations', async ({ page }) => {
    await page.goto('/rooms?q=zzzz');
    await page.getByText('No rooms match those filters').waitFor();
    expect(await scan(page)).toEqual([]);
  });
});

test.describe('motion and focus', () => {
  test('reduced motion disables reveal animation', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.classList.contains('js'))).toBe(false);
    const opacity = await page.locator('.section-head').first().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
    await ctx.close();
  });
  test('focus is visible on interactive controls', async ({ page }) => {
    await page.goto('/rooms');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
    expect(outline).not.toBe('none');
  });
});
