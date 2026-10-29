import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { bookGeneralMedicine, loadAll, ROUTES } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function scan(page: import('@playwright/test').Page) {
  await loadAll(page);
  const res = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return res.violations.map((v) => `${v.id} [${v.impact}]: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`);
}

for (const [label, width] of [['desktop', 1440], ['mobile', 390]] as const) {
  test.describe(`axe (${label})`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const route of ROUTES) {
      test(`no violations on ${route}`, async ({ page }) => {
        await page.goto(route);
        await page.locator('h1').first().waitFor();
        expect(await scan(page)).toEqual([]);
      });
    }
  });
}

test.describe('axe on interactive states', () => {
  test('booking steps, calendar, review and confirmation', async ({ page }) => {
    await page.goto('/book');
    expect(await scan(page)).toEqual([]);
    await page.getByText('General Medicine', { exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    expect(await scan(page)).toEqual([]);
    await page.getByText('No preference', { exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByText('Initial consultation', { exact: true }).click();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: 'Continue' }).click();
    expect(await scan(page)).toEqual([]);
    await page.locator('button.day.is-available').first().click();
    await page.locator('.slot:not(.is-disabled)').first().click();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click(); // shows validation errors
    expect(await scan(page)).toEqual([]);
    await page.getByLabel(/Full name/).fill('Alex Morgan');
    await page.getByLabel(/E-mail address/).fill('alex@example.com');
    await page.getByLabel(/I understand this is a demonstration/).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: 'Confirm demo appointment' }).click();
    expect(await scan(page)).toEqual([]);
  });
  test('appointments with dialog open, and the mobile menu', async ({ page }) => {
    await bookGeneralMedicine(page);
    await page.goto('/appointments');
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: /^Cancel/ }).click();
    const res = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(res.violations.map((v) => v.id)).toEqual([]);
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 390, height: 800 });
    await page.getByRole('button', { name: 'Open menu' }).click();
    expect((await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations.map((v) => v.id)).toEqual([]);
  });
  test('filtered and empty states', async ({ page }) => {
    await page.goto('/doctors?specialty=dermatology&new=1');
    expect(await scan(page)).toEqual([]);
    await page.goto('/services?q=zzzzqqq');
    await expect(page.getByText('No services match your search')).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });
});
