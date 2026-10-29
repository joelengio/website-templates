import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ROUTES, fillDetails } from './helpers';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const scan = async (page: import('@playwright/test').Page) => {
  const r = await new AxeBuilder({ page }).withTags(tags).analyze();
  return r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
};

for (const width of [1440, 390]) {
  test.describe(`axe @${width}`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const route of ROUTES) {
      test(`no WCAG A/AA violations on ${route}`, async ({ page }) => {
        await page.goto(route);
        await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important;transition:none!important}.hero__img{animation:none!important}' });
        await page.waitForTimeout(200);
        expect(await scan(page)).toEqual([]);
      });
    }
  });
}

test.describe('axe on interactive states', () => {
  test('reservation steps', async ({ page }) => {
    await page.goto('/reserve');
    expect(await scan(page)).toEqual([]);
    await page.locator('.calendar__day[aria-disabled="false"]').last().click();
    await page.getByRole('button', { name: 'Continue' }).click();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: 'Continue' }).click();
    expect(await scan(page)).toEqual([]);
    await page.locator('.slot:not([disabled])').first().click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click(); // triggers errors
    expect(await scan(page)).toEqual([]);
    await fillDetails(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: 'Confirm demo reservation' }).click(); // ack error
    expect(await scan(page)).toEqual([]);
    await page.getByLabel(/I understand this is a simulated reservation/).check();
    await page.getByRole('button', { name: 'Confirm demo reservation' }).click();
    expect(await scan(page)).toEqual([]);
    await page.goto('/reserve/manage');
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: /^Cancel reservation/ }).click();
    await page.waitForTimeout(500); // let the dialog fade-in finish
    expect(await scan(page)).toEqual([]);
  });
  test('menu filters, lightbox and enquiry dialog', async ({ page }) => {
    await page.goto('/menus');
    await page.getByRole('button', { name: /show allergen filters/i }).click();
    await page.getByRole('button', { name: /^Vegetarian/ }).click();
    expect(await scan(page)).toEqual([]);
    await page.getByRole('searchbox').fill('zzzz');
    expect(await scan(page)).toEqual([]);
    await page.goto('/gallery');
    await page.getByRole('button', { name: /Open photo:/ }).first().click();
    await page.waitForTimeout(500);
    expect(await scan(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await page.goto('/experiences/group-dining');
    await page.getByRole('button', { name: 'Enquire about this experience' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('dialog').getByRole('button', { name: 'Submit demo enquiry' }).click();
    expect(await scan(page)).toEqual([]);
    await page.goto('/private-dining');
    await page.getByRole('form', { name: /Private dining/ }).getByRole('button', { name: 'Submit demo enquiry' }).click();
    expect(await scan(page)).toEqual([]);
  });
});
