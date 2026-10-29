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
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => undefined))));
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
  await page.getByText('General Medicine', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('No preference', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('Initial consultation', { exact: true }).click();
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
