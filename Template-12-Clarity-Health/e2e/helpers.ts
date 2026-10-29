import type { Page } from '@playwright/test';

export const ROUTES = [
  '/', '/specialties', '/specialties/cardiology', '/doctors', '/doctors/dr-amara-okafor', '/services', '/services/resting-ecg', '/book', '/appointments',
  '/about', '/patient-information', '/journal', '/journal/sun-safety-basics', '/contact', '/demo-notice', '/this-page-does-not-exist'
];
export const WIDTHS = [360, 390, 768, 1024, 1440];

/** Scrolls slowly so lazy-loaded images load, then returns to the top. */
export async function loadAll(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 60));
    }
    // Force any lazy image that Chromium has not started yet, then wait (bounded) for every image to settle.
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const deadline = Date.now() + 8000;
    while (Date.now() < deadline && [...document.images].some((i) => !i.complete)) await new Promise((r) => setTimeout(r, 100));
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 250));
  });
}

/** Picks the first bookable day on the calendar (moving to later months if needed). */
export async function pickDay(page: Page) {
  for (let i = 0; i < 4; i++) {
    const day = page.locator('button.day.is-available').first();
    if (await day.count()) {
      await day.click();
      return;
    }
    await page.getByRole('button', { name: 'Next month' }).click();
  }
  throw new Error('No available day found');
}

export async function pickSlot(page: Page, index = 0) {
  const slot = page.locator('.slot:not(.is-disabled)').nth(index);
  await slot.click();
}

export async function bookGeneralMedicine(page: Page, email = 'alex@example.com') {
  await page.goto('/book');
  await page.getByRole('radio', { name: /General Medicine/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: /No preference/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: /Initial consultation/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await pickDay(page);
  await pickSlot(page);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel(/Full name/).fill('Alex Morgan');
  await page.getByLabel(/E-mail address/).fill(email);
  await page.getByLabel(/I understand this is a demonstration/).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Confirm demo appointment' }).click();
}
