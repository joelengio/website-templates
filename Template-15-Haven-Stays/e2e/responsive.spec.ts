import { expect, test, type Page } from '@playwright/test';
import { openStay, pickDate, routes, scrollAll, stop, widths } from './helpers';

/** Elements poking outside the viewport (ignoring deliberately scrollable wrappers and off-screen helpers). */
async function offenders(page: Page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad: string[] = [];
    const scrollable = (el: Element | null) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (/(auto|scroll|hidden|clip)/.test(s.overflowX) && n !== document.documentElement) return true;
        if (s.position === 'fixed') return false;
      }
      return false;
    };
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.position === 'fixed' && r.left >= vw) return;
      if (el.closest('.sr-only, .skip-link, dialog:not([open])')) return;
      if ((r.right > vw + 1 || r.left < -1) && !scrollable(el.parentElement)) bad.push(`${el.tagName.toLowerCase()}.${(el.className as string).toString().slice(0, 40)} ${Math.round(r.left)}→${Math.round(r.right)} (vw ${vw})`);
    });
    return bad.slice(0, 6);
  });
}

const noHScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

for (const width of widths) {
  test.describe(`viewport ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const r of routes) {
      test(`${r}: no horizontal overflow or clipped content`, async ({ page }) => {
        await page.goto(r);
        await page.locator('h1').first().waitFor();
        await stop(page);
        await scrollAll(page);
        expect(await noHScroll(page)).toBe(true);
        expect(await offenders(page)).toEqual([]);
      });
    }

    test('booking flow screens fit the viewport', async ({ page }) => {
      const { checkIn, checkOut } = openStay('family-residence');
      await page.goto(`/booking?in=${checkIn}&out=${checkOut}&adults=2&children=1&room=family-residence`);
      await page.getByRole('heading', { name: 'Choose your room & rate' }).waitFor();
      await stop(page);
      expect(await noHScroll(page)).toBe(true);
      expect(await offenders(page)).toEqual([]);
      await page.getByRole('button', { name: /^Select Family Residence, Flexible Rate/ }).click();
      await page.getByLabel('First name').waitFor();
      expect(await noHScroll(page)).toBe(true);
      expect(await offenders(page)).toEqual([]);
      await page.getByLabel('First name').fill('Ada');
      await page.getByLabel('Last name').fill('Lovelace');
      await page.getByLabel('Email').fill('ada@example.com');
      await page.getByLabel('Phone').fill('+44 20 7946 0000');
      await page.getByRole('button', { name: 'Review reservation' }).click();
      await page.getByRole('heading', { name: 'Review your reservation' }).waitFor();
      expect(await noHScroll(page)).toBe(true);
      expect(await offenders(page)).toEqual([]);
    });

    test('date picker and guest selector stay inside the viewport', async ({ page }) => {
      await page.goto('/booking');
      await stop(page);
      await page.getByRole('button', { name: /Check-in/ }).first().click();
      const cal = page.locator('.calendar');
      await expect(cal).toBeVisible();
      const box = (await cal.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 0.5);
      const day = (await page.locator('.calendar .day:not([disabled])').first().boundingBox())!;
      expect(day.width).toBeGreaterThanOrEqual(32);
      expect(await noHScroll(page)).toBe(true);
      const { checkIn, checkOut } = openStay('garden-king');
      await pickDate(page, checkIn);
      await pickDate(page, checkOut);
      await page.getByRole('button', { name: /Guests/ }).first().click();
      const pop = (await page.locator('.guests__pop').boundingBox())!;
      expect(pop.x).toBeGreaterThanOrEqual(0);
      expect(pop.x + pop.width).toBeLessThanOrEqual(width + 0.5);
    });

    test('hero booking widget and mobile navigation are usable', async ({ page }) => {
      await page.goto('/');
      await stop(page);
      await page.getByRole('button', { name: /Check-in/ }).first().click();
      const box = (await page.locator('.calendar').boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 0.5);
      await page.keyboard.press('Escape');
      if (width <= 1120) {
        await expect(page.locator('.menu-toggle')).toBeVisible();
        await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
      } else {
        await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
      }
    });
  });
}
