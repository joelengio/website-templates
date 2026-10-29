import type { Page } from '@playwright/test';
import { rooms } from '../src/config/rooms';
import { availability } from '../src/lib/availability';
import { addDays } from '../src/lib/dates';
import { today } from '../src/lib/stay';

export const routes = ['/', '/rooms', '/rooms/sea-view-deluxe', '/booking', '/reservations', '/offers', '/offers/couples-retreat', '/dining', '/dining/olive-room', '/experiences', '/experiences/hammam-ritual', '/gallery', '/about', '/explore', '/journal', '/journal/a-guide-to-the-hammam', '/contact'];
export const widths = [360, 390, 768, 1024, 1440];

/** A future stay on which `roomId` is available in the (deterministic) simulation. */
export function openStay(roomId: string, nights = 3, from = 12, minLeft = 1) {
  const room = rooms.find((r) => r.id === roomId)!;
  for (let d = from; d < 300; d++) {
    const checkIn = addDays(today(), d);
    const checkOut = addDays(checkIn, nights);
    if (availability(room, checkIn, checkOut).left >= minLeft) return { checkIn, checkOut };
  }
  throw new Error('no stay');
}

/** Click a date in the open calendar, paging forward as needed. */
export async function pickDate(page: Page, iso: string) {
  const day = page.locator(`.calendar [data-date="${iso}"]`);
  for (let i = 0; i < 14 && !(await day.count()); i++) await page.getByRole('button', { name: 'Next month' }).first().click();
  await day.click();
}

export const stop = (page: Page) => page.addStyleTag({ content: '*{transition:none!important;animation:none!important}.js .reveal{opacity:1!important;transform:none!important}' });

/** Collect console errors and failed requests. */
export function watch(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => errors.push(`requestfailed ${r.url()}`));
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

/** Scroll through the page so lazy images load. */
export async function scrollAll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 700));
    window.scrollTo(0, 0);
  });
}
