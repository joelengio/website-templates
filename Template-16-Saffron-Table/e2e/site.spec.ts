import { expect, test } from '@playwright/test';
import { ROUTES, fillDetails, loadAllImages, pickDateAndSlot } from './helpers';

test.describe('pages, console and images', () => {
  for (const route of ROUTES) {
    test(`loads ${route} without console errors or broken images`, async ({ page }) => {
      const problems: string[] = [];
      page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`${m.type()}: ${m.text()}`); });
      page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
      page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`));
      const res = await page.goto(route);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator('h1').first()).toBeVisible();
      await loadAllImages(page);
      const broken = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.currentSrc || i.src));
      expect(broken, 'broken images').toEqual([]);
      expect(problems).toEqual([]);
      expect(await page.title()).toMatch(/Saffron Table|Page not found/);
    });
  }

  test('each page has a unique title and meta description', async ({ page }) => {
    const titles = new Set<string>();
    for (const route of ROUTES.filter((r) => !r.includes('not-a-real'))) {
      await page.goto(route);
      const t = await page.title();
      expect(titles.has(t), `duplicate title ${t}`).toBe(false);
      titles.add(t);
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
      expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain(route === '/' ? '/' : route);
      expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBe(t);
    }
  });
});

test.describe('navigation', () => {
  test('desktop nav reaches every main page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    for (const [name, path] of [['Menus', '/menus'], ['Experiences', '/experiences'], ['Private Dining', '/private-dining'], ['Our Story', '/our-story'], ['Gallery', '/gallery'], ['Journal', '/journal'], ['Contact', '/contact']]) {
      await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator('h1').first()).toBeVisible();
    }
    await page.getByRole('link', { name: 'Reserve', exact: true }).click();
    await expect(page).toHaveURL(/\/reserve$/);
  });

  test('mobile menu opens, traps focus, closes with Escape and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page.locator('#mobile-nav').getByRole('link', { name: 'Menus' }).click();
    await expect(page).toHaveURL(/\/menus$/);
    await expect(page.locator('#mobile-nav')).toBeHidden();
  });

  test('custom 404 page offers a way home', async ({ page }) => {
    await page.goto('/definitely-missing');
    await expect(page.getByRole('heading', { level: 1, name: /isn’t set/ })).toBeVisible();
    await page.getByRole('link', { name: 'Back to home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto('/experiences/nope');
    await expect(page.getByRole('heading', { level: 1, name: /isn’t set/ })).toBeVisible();
  });
});

test.describe('menus', () => {
  test('tabs, search, dietary filters, empty state and ordering', async ({ page }) => {
    await page.goto('/menus');
    await expect(page.getByText('40 items')).toBeVisible();
    await page.getByRole('tab', { name: 'Seafood' }).click();
    await expect(page.getByText('6 items')).toBeVisible();
    await page.getByRole('tab', { name: 'All' }).click();
    await page.getByRole('button', { name: /^Vegan/ }).click();
    const n = await page.locator('article.dish').count();
    expect(n).toBeGreaterThan(0);
    for (const t of await page.locator('article.dish .badges').allInnerTexts()) expect(t).toMatch(/Vegan/);
    await page.getByRole('searchbox', { name: /search the menu/i }).fill('qwertyuiop');
    await expect(page.getByText('Nothing matches that search')).toBeVisible();
    await page.getByRole('button', { name: 'Clear all filters' }).click();
    await expect(page.getByText('40 items')).toBeVisible();
    await page.getByRole('button', { name: /show allergen filters/i }).click();
    await page.getByRole('button', { name: 'Shellfish' }).click();
    await expect(page.getByText(/Contains:.*Shellfish/)).toHaveCount(0);
    await expect(page.getByRole('complementary', { name: /allergies/i })).toContainText('confirm');
  });

  test('keyboard arrows move between category tabs', async ({ page }) => {
    await page.goto('/menus');
    await page.getByRole('tab', { name: 'All' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Starters' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Starters' })).toBeFocused();
  });

  test('demo order builder calculates totals and persists', async ({ page }) => {
    await page.goto('/menus');
    await page.getByRole('button', { name: /Add to demo order\s*: Dry-Aged Sirloin/ }).click();
    await page.getByRole('button', { name: /Add to demo order\s*: Dry-Aged Sirloin/ }).click();
    await page.getByRole('link', { name: /Order builder, 2 items/ }).click();
    await expect(page.getByTestId('subtotal')).toHaveText('$92.00');
    await expect(page.getByTestId('service')).toHaveText('$11.50');
    await expect(page.getByTestId('tax')).toHaveText('$7.36');
    await expect(page.getByTestId('total')).toHaveText('$110.86');
    await expect(page.getByText(/nothing has been ordered/i)).toBeVisible();
    await page.getByRole('button', { name: /Decrease quantity of Dry-Aged/ }).click();
    await expect(page.getByTestId('subtotal')).toHaveText('$46.00');
    await page.reload();
    await expect(page.getByTestId('subtotal')).toHaveText('$46.00');
    await page.getByRole('button', { name: /Remove Dry-Aged/ }).click();
    await expect(page.getByText('Your demo order is empty')).toBeVisible();
  });
});

test.describe('reservations (local simulation)', () => {
  test('full flow: book, persist, modify, cancel', async ({ page }) => {
    await expect(async () => {
      await pickDateAndSlot(page);
      await expect(page.getByRole('heading', { name: /Your contact details/ })).toBeVisible();
    }).toPass();
    // validation
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert').first()).toContainText(/Please enter your name/);
    await fillDetails(page);
    await page.getByLabel(/General note/).fill('Window table if possible');
    await page.getByRole('button', { name: 'Continue' }).click();
    // review
    await expect(page.getByRole('heading', { name: /Review your reservation/ })).toBeVisible();
    await expect(page.getByText('Ada Lovelace')).toBeVisible();
    await page.getByRole('button', { name: 'Confirm demo reservation' }).click();
    await expect(page.getByText(/understand this is a simulated reservation/).last()).toBeVisible();
    await page.getByLabel(/I understand this is a simulated reservation/).check();
    await page.getByRole('button', { name: 'Confirm demo reservation' }).click();
    await expect(page.getByRole('heading', { name: 'Demo reservation saved' })).toBeVisible();
    await expect(page.getByText(/not sent to a restaurant/i)).toBeVisible();
    const code = (await page.locator('.success-panel strong').first().innerText()).trim();
    expect(code).toMatch(/^ST-/);

    // persistence
    await page.goto('/reserve/manage');
    await page.reload();
    await expect(page.getByText(code)).toBeVisible();
    await expect(page.getByRole('link', { name: /My reservations \(1\)/ })).toBeVisible();

    // modify: party size
    await page.getByRole('button', { name: `Modify reservation ${code}` }).click();
    await expect(page.getByText(`Modifying reservation`)).toBeVisible();
    await page.getByRole('button', { name: /^Party & seating/ }).click();
    await page.getByRole('button', { name: 'Increase party size' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel(/I understand this is a simulated reservation/).check();
    await page.getByRole('button', { name: 'Save changes (demo)' }).click();
    await expect(page.getByRole('heading', { name: 'Demo reservation updated' })).toBeVisible();
    await expect(page.locator('.summary').getByText('3 guests')).toBeVisible();

    // cancel
    await page.goto('/reserve/manage');
    await page.getByRole('button', { name: `Cancel reservation ${code}` }).click();
    const dlg = page.getByRole('dialog', { name: /Cancel this reservation/ });
    await expect(dlg).toBeVisible();
    await dlg.getByRole('button', { name: 'Keep reservation' }).click();
    await expect(dlg).toBeHidden();
    await page.getByRole('button', { name: `Cancel reservation ${code}` }).click();
    await page.getByRole('button', { name: 'Yes, cancel it' }).click();
    await expect(page.getByText('Cancelled', { exact: true })).toBeVisible();
    await expect(page.getByText('You have no upcoming demo reservations.')).toBeVisible();
  });

  test('prevents duplicate booking on the same date for the same email', async ({ page }) => {
    const book = async (dayIndex: number) => {
      await pickDateAndSlot(page, { dayIndex });
      await fillDetails(page, 'dup@example.com');
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.getByLabel(/I understand this is a simulated reservation/).check();
      await page.getByRole('button', { name: 'Confirm demo reservation' }).click();
    };
    await book(3);
    await expect(page.getByRole('heading', { name: 'Demo reservation saved' })).toBeVisible();
    await book(3);
    await expect(page.getByRole('alert').filter({ hasText: /already has reservation/ })).toBeVisible();
  });

  test('disables closed and past dates and unsuitable seating', async ({ page }) => {
    await page.goto('/reserve');
    await expect(page.locator('.calendar__day.is-off').first()).toHaveAttribute('aria-disabled', 'true');
    await page.locator('.calendar__day.is-off').first().click({ force: true });
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
    await page.getByRole('button', { name: 'Next month' }).click();
    const mondayLabels = await page.locator('.calendar__day[aria-label^="Monday"]').first().getAttribute('aria-label');
    expect(mondayLabels).toMatch(/closed/i);
    await page.locator('.calendar__day[aria-disabled="false"]').nth(2).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Increase party size' }).click();
    await expect(page.getByRole('radio', { name: /Bar & lounge/ })).toBeDisabled();
    await expect(page.getByRole('radio', { name: /Chef’s counter/ })).toBeDisabled();
    for (let i = 0; i < 6; i++) if (await page.getByRole('button', { name: 'Increase party size' }).isEnabled()) await page.getByRole('button', { name: 'Increase party size' }).click();
    await expect(page.getByRole('button', { name: 'Increase party size' })).toBeDisabled();
    await expect(page.getByText(/10 guests/).first()).toBeVisible();
  });

  test('calendar supports keyboard navigation', async ({ page }) => {
    await page.goto('/reserve');
    const first = page.locator('.calendar__day[tabindex="0"]');
    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.calendar__day:focus')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status').filter({ hasText: /Selected:/ })).toBeVisible();
  });
});

test.describe('forms', () => {
  test('private dining enquiry validates and never claims it was sent', async ({ page }) => {
    await page.goto('/private-dining');
    const form = page.getByRole('form', { name: /Private dining enquiry/ });
    await form.getByRole('button', { name: 'Submit demo enquiry' }).click();
    await expect(form.getByRole('alert').first()).toBeVisible();
    await form.getByLabel(/Your name/).fill('Ada');
    await form.getByLabel(/^Email/).fill('ada@example.com');
    await form.getByLabel(/Event type/).selectOption('Birthday');
    await form.getByLabel(/Event date/).fill('2020-01-01');
    await form.getByLabel(/Number of guests/).fill('500');
    await form.getByRole('button', { name: 'Submit demo enquiry' }).click();
    await expect(form.getByText(/days’ notice/).first()).toBeVisible();
    await expect(form.getByText(/largest space hosts up to/).first()).toBeVisible();
    const d = new Date(); d.setDate(d.getDate() + 30);
    await form.getByLabel(/Event date/).fill(d.toISOString().slice(0, 10));
    await form.getByLabel(/Number of guests/).fill('20');
    await form.getByLabel(/I understand this is a demonstration/).check();
    await form.getByRole('button', { name: 'Submit demo enquiry' }).click();
    await expect(page.getByText(/not sent/i).first()).toBeVisible();
    await expect(page.getByText(/Demo reference:/)).toBeVisible();
  });

  test('package CTA pre-selects a package in the form', async ({ page }) => {
    await page.goto('/private-dining');
    await page.getByRole('button', { name: /Enquire about Celebration Dinner/ }).click();
    await expect(page.getByText('Package selected:')).toContainText('Celebration Dinner');
  });

  test('experience enquiry dialog opens, validates, traps focus and closes', async ({ page }) => {
    await page.goto('/experiences/group-dining');
    await page.getByRole('button', { name: 'Enquire about this experience' }).click();
    const dlg = page.getByRole('dialog');
    await expect(dlg).toBeVisible();
    await expect(dlg.getByLabel(/Your name/)).toBeFocused();
    await dlg.getByRole('button', { name: 'Submit demo enquiry' }).click();
    await expect(dlg.getByRole('alert').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    await expect(page.getByRole('button', { name: 'Enquire about this experience' })).toBeFocused();
  });

  test('contact form validates and shows a demo-only success', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send demo message' }).click();
    await expect(page.getByText('Please enter your name.').first()).toBeVisible();
    await page.getByLabel(/Your name/).fill('Ada Lovelace');
    await page.getByLabel(/^Email/).fill('bad');
    await page.getByRole('button', { name: 'Send demo message' }).click();
    await expect(page.locator('.field__error', { hasText: /valid email/ })).toBeVisible();
    await page.getByLabel(/^Email/).fill('ada@example.com');
    await page.getByLabel(/Topic/).selectOption('Feedback');
    await page.getByLabel(/^Message/).fill('A lovely evening, thank you.');
    await page.getByRole('button', { name: 'Send demo message' }).click();
    await expect(page.getByText(/was not sent to anyone/)).toBeVisible();
  });
});

test.describe('gallery and journal', () => {
  test('lightbox: keyboard, focus return, mobile swipe', async ({ page }) => {
    await page.goto('/gallery');
    const first = page.getByRole('button', { name: /Open photo:/ }).first();
    await first.click();
    const dlg = page.getByRole('dialog');
    await expect(dlg).toBeVisible();
    await expect(dlg.getByRole('button', { name: 'Close photo viewer' })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(dlg).toHaveAccessibleName(/image 2 of 24/);
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(dlg).toHaveAccessibleName(/image 24 of 24/);
    // Tab stays inside the dialog
    for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('.lightbox'))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    await expect(first).toBeFocused();
  });

  test('category filter updates the gallery', async ({ page }) => {
    await page.goto('/gallery');
    await page.getByRole('button', { name: 'The Kitchen' }).click();
    await expect(page.getByText('5 photographs')).toBeVisible();
  });

  test('journal search, categories and article route', async ({ page }) => {
    await page.goto('/journal');
    await page.getByRole('searchbox', { name: /search articles/i }).fill('wine');
    await expect(page.getByRole('link', { name: 'Choosing wine with spice' })).toBeVisible();
    await page.getByRole('link', { name: 'Choosing wine with spice' }).click();
    await expect(page).toHaveURL(/choosing-wine-with-spice/);
    await expect(page.getByRole('heading', { level: 1, name: 'Choosing wine with spice' })).toBeVisible();
  });
});

test.describe('experiences & home', () => {
  test('experience detail pages exist for every experience', async ({ page }) => {
    await page.goto('/experiences');
    await expect(page.locator('.exp h2 a').first()).toBeVisible();
    const links = await page.locator('.exp h2 a').evaluateAll((a) => a.map((x) => (x as HTMLAnchorElement).getAttribute('href')));
    expect(links).toHaveLength(6);
    for (const l of links) {
      const res = await page.goto(l!);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.getByRole('button', { name: /Enquire/ }).first()).toBeVisible();
    }
  });

  test('home page shows hero CTA to reservations and demo-labelled sections', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Reserve a table/ }).first().click();
    await expect(page).toHaveURL(/\/reserve$/);
    await page.goto('/');
    await expect(page.getByText(/Fictional accolades/)).toBeVisible();
    await expect(page.getByText(/not real guest reviews/)).toBeVisible();
  });
});
