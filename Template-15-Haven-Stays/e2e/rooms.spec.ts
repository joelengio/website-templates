import { expect, test } from '@playwright/test';
import { rooms } from '../src/config/rooms';
import { openStay } from './helpers';

test.describe('rooms listing', () => {
  test('shows all rooms and filters by type, capacity, amenities and price', async ({ page }) => {
    await page.goto('/rooms');
    await expect(page.locator('.room-card')).toHaveCount(rooms.length);
    await page.getByRole('button', { name: 'Suites', exact: true }).click();
    await expect(page.locator('.room-card')).toHaveCount(3);
    await expect(page).toHaveURL(/cat=Suites/);
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await page.getByLabel('Guest capacity').selectOption('5');
    await expect(page.locator('.room-card')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 3, name: 'Family Residence' })).toBeVisible();
    await page.getByLabel('Guest capacity').selectOption('0');
    await page.getByLabel('Private plunge pool').check();
    await expect(page.locator('.room-card')).toHaveCount(2);
    await page.getByLabel('Freestanding bath').check();
    await expect(page.locator('.room-card')).toHaveCount(2);
    await page.getByLabel('Wood-burning stove').check();
    await expect(page.getByText('No rooms match those filters')).toBeVisible();
    await page.getByRole('button', { name: 'Clear all filters' }).click();
    await expect(page.locator('.room-card')).toHaveCount(rooms.length);
    await page.getByLabel(/Max nightly rate/).fill('300');
    await expect(page.locator('.room-card')).toHaveCount(rooms.filter((r) => r.baseRate <= 300).length);
  });

  test('searches and sorts', async ({ page }) => {
    await page.goto('/rooms');
    await page.getByLabel('Sort by').selectOption('price-asc');
    const prices = await page.locator('.room-card .price strong').allTextContents();
    const nums = prices.map((p) => Number(p.replace(/\D/g, '')));
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
    await page.getByLabel('Sort by').selectOption('price-desc');
    await expect(page.locator('.room-card').first()).toContainText('Owner’s Suite');
    const d = (await page.locator('.room-card .price strong').allTextContents()).map((p) => Number(p.replace(/\D/g, '')));
    expect(d).toEqual([...d].sort((a, b) => b - a));
    await page.getByLabel('Search', { exact: true }).fill('mountain');
    await expect(page.locator('.room-card')).toHaveCount(0);
    await page.getByLabel('Search', { exact: true }).fill('villa');
    await expect(page.locator('.room-card').first()).toBeVisible();
    await page.reload();
    await expect(page.getByLabel('Search', { exact: true })).toHaveValue('villa');
  });

  test('availability badges follow the dates chosen', async ({ page }) => {
    const { checkIn, checkOut } = openStay('garden-king');
    await page.goto(`/rooms?in=${checkIn}&out=${checkOut}&adults=2&children=0`);
    await expect(page.locator('.room-card .badge').first()).toBeVisible();
    await expect(page.locator('.room-card', { hasText: 'Family Residence' }).locator('.badge')).toContainText(/simulated|Does not fit/);
    await expect(page.locator('.room-card', { hasText: 'Hillside Loft' }).locator('.badge')).toBeVisible();
  });
});

test.describe('room detail', () => {
  test('shows facts, rates, simulated availability and prepopulated booking CTA', async ({ page }) => {
    const room = rooms.find((r) => r.id === 'sea-deluxe')!;
    await page.goto('/rooms');
    await page.getByRole('link', { name: room.name }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: room.name })).toBeVisible();
    await expect(page.getByText(`Up to ${room.maxOccupancy} guests`)).toBeVisible();
    await expect(page.getByRole('table', { name: /Nightly rates by season/ })).toContainText('Summer peak');
    await expect(page.getByRole('table', { name: /Simulated availability/ })).toBeVisible();
    await expect(page.getByText('Related accommodation')).toBeVisible();
    await expect(page.locator('.related .room-card')).toHaveCount(3);
    await page.getByRole('link', { name: 'Book this room' }).click();
    await expect(page).toHaveURL(/room=sea-deluxe/);
    await expect(page.getByText(/Booking .*Sea View Deluxe/)).toBeVisible();
  });

  test('widget on the room page carries the room and dates to the booking engine', async ({ page }) => {
    const { checkIn, checkOut } = openStay('sea-deluxe');
    await page.goto(`/rooms/sea-view-deluxe?in=${checkIn}&out=${checkOut}&adults=2&children=0`);
    await page.locator('.book-card').getByRole('button', { name: 'Check availability' }).click();
    await expect(page).toHaveURL(new RegExp(`in=${checkIn}.*room=sea-deluxe`));
    await expect(page.locator('.offer-room.is-selected')).toContainText('Sea View Deluxe');
  });

  test('gallery thumbnails and the keyboard accessible lightbox', async ({ page }) => {
    await page.goto('/rooms/private-pool-villa');
    const thumbs = page.getByRole('list', { name: /photos/ }).getByRole('button');
    await expect(thumbs).toHaveCount(3);
    await thumbs.nth(1).click();
    await expect(thumbs.nth(1)).toHaveAttribute('aria-current', 'true');
    const opener = page.getByRole('button', { name: /fullscreen/ });
    await opener.focus();
    await page.keyboard.press('Enter');
    const lb = page.getByRole('dialog', { name: /image viewer/ });
    await expect(lb).toBeVisible();
    await expect(lb.locator('figcaption')).toContainText('2 / 3');
    await page.keyboard.press('ArrowRight');
    await expect(lb.locator('figcaption')).toContainText('3 / 3');
    await page.keyboard.press('ArrowRight');
    await expect(lb.locator('figcaption')).toContainText('1 / 3');
    // focus stays inside the dialog
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(lb).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(thumbs.nth(0)).toHaveAttribute('aria-current', 'true');
  });

  test('availability calendar pages through months', async ({ page }) => {
    await page.goto('/rooms/garden-king-room');
    const grid = page.getByRole('table', { name: /Simulated availability/ });
    const heading = page.locator('.avail__nav h3');
    const first = await heading.textContent();
    await page.locator('.avail__nav').getByRole('button', { name: 'Next month' }).click();
    expect(await heading.textContent()).not.toEqual(first);
    await expect(grid.locator('td.avail__cell--open, td.avail__cell--low, td.avail__cell--sold').first()).toBeVisible();
    await expect(page.locator('.avail__nav').getByRole('button', { name: 'Previous month' })).toBeEnabled();
  });
});
