import { expect, test } from '@playwright/test';
import { ROUTES, loadAllImages, pickDateAndSlot } from './helpers';

const WIDTHS = [360, 390, 768, 1024, 1440];

for (const width of WIDTHS) {
  test.describe(`responsive ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('no horizontal overflow on any route', async ({ page }) => {
      test.setTimeout(180_000);
      for (const route of ROUTES) {
        await page.goto(route);
        await loadAllImages(page);
        const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
        expect(scroll, `${route} overflows at ${width}`).toBeLessThanOrEqual(client);
      }
    });

    test('touch targets in primary controls are at least 44px', async ({ page }) => {
      await page.goto('/menus');
      const small = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('main button, main .chip, main .tab, main .btn')]
          .filter((el) => el.offsetParent !== null)
          .map((el) => ({ t: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), h: el.getBoundingClientRect().height }))
          .filter((x) => x.h < 43.5));
      expect(small).toEqual([]);
    });

    test('reservation steps stay within the viewport', async ({ page }) => {
      await pickDateAndSlot(page);
      await expect(page.getByRole('heading', { name: /contact details/ })).toBeVisible();
      for (const sel of ['.wizard__panel', '.steps', '.wizard__nav']) {
        const box = await page.locator(sel).first().boundingBox();
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
      const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(scroll).toBeLessThanOrEqual(client);
    });
  });
}
