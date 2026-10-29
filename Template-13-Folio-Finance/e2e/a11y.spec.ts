import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { routes } from './helpers';

async function scan(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
  const summary = results.violations.map((v) => `${v.id} [${v.impact}] ${v.help}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' ; ')}`);
  expect(summary, `axe violations on ${label}`).toEqual([]);
}

test.describe('axe-core scans', () => {
  for (const [name, width] of [['desktop', 1440], ['mobile', 390]] as const) {
    for (const path of routes) {
      test(`${name} ${path}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        await expect(page.locator('main h1').first()).toBeVisible();
        await scan(page, `${name} ${path}`);
      });
    }
  }

  test('interactive states: annual pricing, open FAQ, filtered services, calculator error', async ({ page }) => {
    await page.goto('/pricing');
    await page.getByRole('button', { name: /^Annual/ }).click();
    await page.getByRole('checkbox', { name: /Family governance/ }).check();
    await page.locator('.faq summary').first().click();
    await scan(page, 'pricing annual + addon + faq');
    await page.goto('/services?category=growth&q=zzz');
    await expect(page.getByRole('heading', { name: 'No services found' })).toBeVisible();
    await scan(page, 'services empty state');
    await page.goto('/tools');
    await page.getByLabel('Annual return assumption').fill('99');
    await scan(page, 'calculator validation error');
    await page.getByLabel('Annual return assumption').fill('6');
    await page.getByText('View chart data as a table').click();
    await page.locator('.chart__frame').focus();
    await page.keyboard.press('ArrowRight');
    await scan(page, 'chart with table + readout');
    await page.goto('/tools#loan');
    await page.getByRole('button', { name: /every monthly payment/i }).click();
    await scan(page, 'loan monthly schedule');
    await page.goto('/tools#break-even');
    await page.getByLabel('Selling price per unit').fill('10');
    await scan(page, 'break-even impossible');
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Submit enquiry' }).click();
    await scan(page, 'contact validation errors');
    await page.goto('/insights?q=zzzz');
    await scan(page, 'insights empty state');
  });

  test('booking flow states and cancel dialog', async ({ page }) => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/book');
      await scan(page, `booking step 1 @${width}`);
      await page.getByRole('radio', { name: /Business Advisory/ }).check();
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.getByRole('radio', { name: /Introductory call/ }).check();
      await scan(page, `booking step 2 @${width}`);
      await page.getByRole('button', { name: 'Continue' }).click();
      await scan(page, `booking calendar @${width}`);
      await page.locator('.calendar__day[aria-disabled="false"]').first().click();
      await page.getByRole('button', { name: 'Continue' }).click();
      await scan(page, `booking slots @${width}`);
      await page.locator('.slot:not(.is-unavailable)').first().click();
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.getByRole('button', { name: 'Continue' }).click();
      await scan(page, `booking details errors @${width}`);
      await page.getByLabel('Full name').fill('Ada Lovelace');
      await page.getByLabel('Email address').fill('ada@example.com');
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: 'Continue' }).click();
      await scan(page, `booking review @${width}`);
      await page.getByRole('button', { name: 'Confirm demo reservation' }).click();
      await scan(page, `booking confirmation @${width}`);
      await page.getByRole('button', { name: /Cancel appointment/ }).click();
      await scan(page, `cancel dialog @${width}`);
      await page.getByRole('button', { name: 'Yes, cancel it' }).click();
      await page.evaluate(() => localStorage.clear());
    }
  });

  test('mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: /open menu/i }).click();
    await scan(page, 'mobile menu');
  });
});
