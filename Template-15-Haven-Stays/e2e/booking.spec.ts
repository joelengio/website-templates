import { expect, test } from '@playwright/test';
import { diffDays } from '../src/lib/dates';
import { openStay, pickDate, watch } from './helpers';

test.describe('booking engine', () => {
  test('home widget → room → details → review → confirmation → manage → cancel', async ({ page }) => {
    const errors = watch(page);
    const { checkIn, checkOut } = openStay('garden-king');
    await page.goto('/');
    await page.getByRole('button', { name: /Check-in/ }).first().click();
    await pickDate(page, checkIn);
    await pickDate(page, checkOut);
    await expect(page.getByRole('button', { name: /Check-out/ }).first()).toContainText(/\d/);
    await page.getByRole('button', { name: /Guests/ }).first().click();
    await page.getByRole('button', { name: 'More children' }).click();
    await expect(page.getByRole('button', { name: /2 adults, 1 child/ })).toBeVisible();
    await page.getByRole('button', { name: 'Fewer children' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
    await page.getByRole('button', { name: 'Check availability' }).click();

    await expect(page).toHaveURL(/\/booking\?/);
    await expect(page.getByRole('heading', { name: 'Choose your room & rate' })).toBeFocused();
    const nights = diffDays(checkIn, checkOut);
    await expect(page.getByRole('status').filter({ hasText: `available for ${nights} nights` })).toBeVisible();
    await expect(page.getByText(/Demonstration only/).first()).toBeVisible();

    await page.getByRole('button', { name: /^Select Garden King Room, Flexible Rate/ }).click();
    await page.getByLabel('First name').fill('Ada');
    await page.getByLabel('Last name').fill('Lovelace');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Phone').fill('+44 20 7946 0000');
    await page.getByRole('button', { name: 'Review reservation' }).click();
    await expect(page.getByRole('heading', { name: 'Review your reservation' })).toBeVisible();

    // price breakdown reconciles: room + fees + taxes = total
    const rows = await page.locator('.summary .totals dd').allTextContents();
    const nums = rows.map((r) => Number(r.replace(/[^0-9.-]/g, '').replace('−', '-')) * (r.includes('−') ? -1 : 1));
    const total = nums.at(-1)!;
    const parts = nums.slice(0, -1).reduce((a, b) => a + b, 0);
    expect(Math.abs(parts - total)).toBeLessThan(0.011);

    const confirm = page.getByRole('button', { name: 'Confirm demonstration booking' });
    await expect(confirm).toBeDisabled();
    await page.getByRole('checkbox').check();
    await confirm.click();
    await expect(page).toHaveURL(/\/booking\/confirmation\/HS-/);
    await expect(page.getByText('Not a real booking.')).toBeVisible();
    await expect(page.getByText(/No payment has been taken/)).toBeVisible();
    const code = (await page.locator('.code').first().textContent())!.trim();
    expect(code).toMatch(/^HS-[A-Z0-9]{6}$/);

    // persisted in localStorage and survives a reload
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('haven-stays:reservations:v1') ?? '[]'));
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ id: code, checkIn, checkOut, status: 'confirmed', roomId: 'garden-king' });
    await page.reload();
    await expect(page.locator('.code').first()).toHaveText(code);

    await page.goto('/reservations');
    await expect(page.getByRole('link', { name: 'Garden King Room' })).toBeVisible();
    await page.getByRole('link', { name: 'Manage', exact: true }).click();
    await page.getByRole('button', { name: 'Cancel reservation' }).click();
    const dialog = page.getByRole('dialog', { name: 'Cancel this reservation?' });
    await expect(dialog).toContainText('free of charge');
    await dialog.getByRole('button', { name: 'Yes, cancel it' }).click();
    await expect(page.getByText('Reservation cancelled.')).toBeVisible();
    await expect(page.getByText('Cancelled', { exact: true }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('invalid date ranges are rejected with clear messages', async ({ page }) => {
    const { checkIn } = openStay('garden-king');
    await page.goto(`/booking?in=${checkIn}&out=${checkIn}&adults=2&children=0`);
    await expect(page.getByRole('heading', { name: 'When would you like to stay?' })).toBeVisible();
    await expect(page.getByText(/at least one night/).first()).toBeVisible();
    await page.goto(`/booking?in=${checkIn}&out=2020-01-01&adults=2&children=0`);
    await expect(page.getByText('Check-out must be after check-in.').first()).toBeVisible();
    await page.goto('/booking?in=2020-01-01&out=2020-01-04&adults=2&children=0');
    await expect(page.getByText('Check-in cannot be in the past.').first()).toBeVisible();
    await page.goto('/booking?in=garbage&out=nonsense&adults=99&children=-4');
    await expect(page.getByRole('heading', { name: 'When would you like to stay?' })).toBeVisible();
  });

  test('home widget validates before navigating', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Check availability' }).click();
    await expect(page.getByText('Choose a check-in date.')).toBeVisible();
    await expect(page).toHaveURL(/localhost|127\.0\.0\.1:4173\/$/);
  });

  test('over-capacity rooms are excluded and explained', async ({ page }) => {
    const { checkIn, checkOut } = openStay('family-residence');
    await page.goto(`/booking?in=${checkIn}&out=${checkOut}&adults=2&children=3`);
    await expect(page.getByRole('button', { name: /^Select Garden King Room/ })).toHaveCount(0);
    await page.getByText(/not suitable for your party/).click();
    await expect(page.getByText(/Garden King Room — .*maximum occupancy|Garden King Room — .*sleeps up to/)).toBeVisible();
    await expect(page.getByRole('button', { name: /^Select Family Residence/ }).first()).toBeVisible();
  });

  test('promo codes apply only when eligible', async ({ page }) => {
    const { checkIn, checkOut } = openStay('terrace-suite', 3, 30);
    await page.goto(`/booking?in=${checkIn}&out=${checkOut}&adults=2&children=0`);
    await page.getByLabel('Promo code').fill('couples');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Couples Retreat: −').first()).toBeVisible();
    await page.getByLabel('Promo code').fill('FAMILY');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText(/Requires at least one child/).first()).toBeVisible();
    await page.getByLabel('Promo code').fill('BOGUS');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText(/not a valid code/)).toBeVisible();
  });

  test('duplicate reservations are blocked', async ({ page }) => {
    const { checkIn, checkOut } = openStay('garden-king', 3, 12, 3);
    const url = `/booking?in=${checkIn}&out=${checkOut}&adults=2&children=0&room=garden-king`;
    const book = async (email: string) => {
      await page.goto(url);
      await page.getByRole('button', { name: /^Select Garden King Room, Flexible Rate/ }).click();
      await page.getByLabel('First name').fill('Ada');
      await page.getByLabel('Last name').fill('Lovelace');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Phone').fill('+44 20 7946 0000');
      await page.getByRole('button', { name: 'Review reservation' }).click();
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: 'Confirm demonstration booking' }).click();
    };
    await book('ada@example.com');
    await expect(page).toHaveURL(/confirmation/);
    await book('ada@example.com');
    await expect(page.getByRole('alert').filter({ hasText: 'Possible duplicate reservation' })).toContainText('already exists');
    await expect(page).toHaveURL(/\/booking\?/);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('haven-stays:reservations:v1') ?? '[]').length)).toBe(1);
    await book('someone.else@example.com');
    await expect(page).toHaveURL(/confirmation/);
  });

  test('a single-unit room is removed from the offer once booked locally', async ({ page }) => {
    const { checkIn, checkOut } = openStay('owners-suite');
    const url = `/booking?in=${checkIn}&out=${checkOut}&adults=2&children=0&room=owners-suite`;
    await page.goto(url);
    await page.getByRole('button', { name: /^Select The Owner’s Suite, Flexible Rate/ }).click();
    await page.getByLabel('First name').fill('Ada');
    await page.getByLabel('Last name').fill('Lovelace');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Phone').fill('+44 20 7946 0000');
    await page.getByRole('button', { name: 'Review reservation' }).click();
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Confirm demonstration booking' }).click();
    await expect(page).toHaveURL(/confirmation/);
    await page.goto(url);
    await expect(page.getByRole('button', { name: /^Select The Owner’s Suite/ })).toHaveCount(0);
    await expect(page.getByText(/sold out for your dates/)).toBeVisible();
  });

  test('change a reservation: dates and total are recalculated', async ({ page }) => {
    const { checkIn, checkOut } = openStay('garden-twin', 3, 20);
    await page.goto(`/booking?in=${checkIn}&out=${checkOut}&adults=2&children=0&room=garden-twin`);
    await page.getByRole('button', { name: /^Select Garden Twin Room, Flexible Rate/ }).click();
    await page.getByLabel('First name').fill('Grace');
    await page.getByLabel('Last name').fill('Hopper');
    await page.getByLabel('Email').fill('grace@example.com');
    await page.getByLabel('Phone').fill('+1 555 010 0199');
    await page.getByRole('button', { name: 'Review reservation' }).click();
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Confirm demonstration booking' }).click();
    await page.getByRole('link', { name: 'View, change or cancel' }).click();
    const before = await page.locator('.totals__total dd').first().textContent();
    await page.getByRole('button', { name: 'Change reservation' }).click();
    const form = page.getByRole('form', { name: 'Change reservation' });
    await form.getByRole('button', { name: /Check-out/ }).click();
    const newOut = (await import('../src/lib/dates')).addDays(checkOut, 1);
    await pickDate(page, newOut);
    await expect(form.getByText(/Increase of/)).toBeVisible();
    await form.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Reservation updated.')).toBeVisible();
    const after = await page.locator('.totals__total dd').first().textContent();
    expect(after).not.toEqual(before);
    await expect(page.locator('.review-list')).toContainText('4');
  });

  test('calendar is operable with the keyboard', async ({ page }) => {
    await page.goto('/booking');
    await page.getByRole('button', { name: /Check-in/ }).first().click();
    const focused = page.locator('.calendar .day:focus');
    await expect(focused).toHaveCount(1);
    const first = await focused.getAttribute('data-date');
    await page.keyboard.press('ArrowRight');
    const second = await page.locator('.calendar .day:focus').getAttribute('data-date');
    expect(second).not.toEqual(first);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.locator('.calendar__hint')).toContainText('check-out'); // now choosing check-out
    await expect(page.locator('.calendar .day:focus')).toHaveCount(1);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.locator('.calendar')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Check-out/ }).first()).toBeFocused();
  });
});
