import { expect, test } from '@playwright/test';
import { watchErrors } from './helpers';

test.describe('pricing', () => {
  test('monthly / annual toggle recalculates prices; add-ons update totals; plan CTA prefills contact', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/pricing');
    const adv = page.getByTestId('price-advisory');
    await expect(adv).toHaveText('$640');
    await page.getByRole('button', { name: /^Annual/ }).click();
    await expect(adv).toHaveText('$6,297.60');
    await expect(page.getByTestId('price-partnership')).toHaveText('$14,208'); // 1480 × 12 × 0.80
    await expect(page.getByText('≈ $524.80 per month').first()).toBeVisible();
    await page.getByRole('checkbox', { name: /Monthly bookkeeping/ }).check();
    await expect(adv).toHaveText('$10,430.40'); // (640 + 420) × 12 × (1 − 18%)
    await page.getByRole('button', { name: 'Monthly' }).click();
    await expect(adv).toHaveText('$1,060');
    await page.getByRole('link', { name: 'Ask about Advisory' }).click();
    await expect(page).toHaveURL(/\/contact\?.*plan=advisory/);
    await expect(page.getByLabel('Enquiry category')).toHaveValue('Plan / pricing question');
    await expect(page.getByText(/Advisory plan, monthly billing with Monthly bookkeeping/)).toBeVisible();
    expect(errors).toEqual([]);
  });
  test('comparison table is scrollable on mobile without page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/pricing');
    const region = page.getByRole('region', { name: /plan comparison table/i });
    await region.scrollIntoViewIfNeeded();
    const m = await region.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth, doc: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
    expect(m.sw).toBeGreaterThan(m.cw);
    expect(m.doc).toBeLessThanOrEqual(m.vw);
  });
});

test.describe('calculators with real charts', () => {
  test('compound growth chart reflects inputs', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.getByTestId('compound-fv')).toHaveText('$150,436.50');
    const pathBefore = await page.locator('.chart svg path').first().getAttribute('d');
    await page.getByLabel('Monthly contribution').fill('1000');
    await expect(page.getByTestId('compound-contrib')).toHaveText('$250,000.00');
    const pathAfter = await page.locator('.chart svg path').first().getAttribute('d');
    expect(pathAfter).not.toBe(pathBefore);
    // chart data table matches the headline result
    await page.getByText('View chart data as a table').click();
    const lastRow = page.locator('.chart__table tbody tr').last();
    await expect(lastRow).toContainText('Year 20');
    await expect(lastRow).toContainText('$250,000');
    // keyboard inspection of the chart
    await page.locator('.chart__frame').focus();
    await page.keyboard.press('End');
    await expect(page.locator('.chart__readout')).toContainText('Year 20');
    await expect(page.locator('.chart__readout')).toContainText('Estimated balance');
    // validation + reset
    await page.getByLabel('Time horizon').fill('0');
    await expect(page.getByText(/The number of years cannot be below 1/)).toBeVisible();
    await page.getByRole('button', { name: /reset to defaults/i }).click();
    await expect(page.getByLabel('Time horizon')).toHaveValue('20');
    await expect(page.getByTestId('compound-fv')).toHaveText('$150,436.50');
  });
  test('loan calculator: amortization and zero interest', async ({ page }) => {
    await page.goto('/tools#loan');
    await expect(page.getByTestId('loan-payment')).toHaveText('$1,688.02');
    await page.getByLabel('Annual interest rate').fill('0');
    await page.getByLabel('Loan amount').fill('12000');
    await page.getByLabel('Loan term', { exact: true }).fill('12');
    await page.getByLabel('Term unit').selectOption('months');
    await expect(page.getByTestId('loan-payment')).toHaveText('$1,000.00');
    await expect(page.getByTestId('loan-interest')).toHaveText('$0.00');
    await page.getByRole('button', { name: /every monthly payment/i }).click();
    await expect(page.locator('.schedule tbody tr')).toHaveCount(12);
  });
  test('break-even calculator: results, impossible scenario and chart marker', async ({ page }) => {
    await page.goto('/tools#break-even');
    await expect(page.getByTestId('be-units')).toHaveText('750');
    await expect(page.locator('.chart__marker text')).toContainText('Break-even ≈ 750 units');
    await page.getByLabel('Selling price per unit').fill('20');
    await page.getByLabel('Variable cost per unit').fill('25');
    await expect(page.getByRole('alert').filter({ hasText: 'cannot break even' })).toBeVisible();
    await expect(page.locator('.chart')).toHaveCount(0);
    await page.getByRole('button', { name: /reset to defaults/i }).click();
    await expect(page.getByTestId('be-units')).toHaveText('750');
  });
  test('calculator inputs are usable on a 360px phone', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/tools');
    const input = page.getByLabel('Starting amount');
    const box = await input.boundingBox();
    expect(box!.width).toBeGreaterThan(200);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    const chartBox = await page.locator('.chart__frame').boundingBox();
    expect(chartBox!.width).toBeLessThanOrEqual(360);
    expect(await page.locator('.chart__frame svg').getAttribute('width')).toBe(String(Math.round(chartBox!.width)));
  });
});

test.describe('services and industries', () => {
  test('filter, search, empty state, and detail navigation', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByText('Showing 8 of 8 services')).toBeVisible();
    await page.getByRole('button', { name: 'Accounting & tax' }).click();
    await expect(page).toHaveURL(/category=compliance/);
    const links = page.locator('.service-card .card__title a');
    await expect(links).toHaveText(['Accounting & Bookkeeping', 'Tax Planning']);
    await page.getByRole('searchbox', { name: /search services/i }).fill('payroll');
    await expect(page.getByRole('heading', { name: 'No services found' })).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await page.getByRole('link', { name: 'Wealth Planning' }).click();
    await expect(page).toHaveURL(/\/services\/wealth-planning$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Wealth Planning' })).toBeVisible();
    await page.locator('.detail-hero__actions').getByRole('link', { name: 'Book a consultation' }).click();
    await expect(page).toHaveURL(/\/book\?service=wealth-planning/);
    await expect(page.getByRole('radio', { name: /Wealth Planning/ })).toBeChecked();
  });
  test('industry and team profile navigation', async ({ page }) => {
    await page.goto('/industries');
    await page.getByRole('link', { name: 'Startups', exact: true }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'Startups' })).toBeVisible();
    await page.getByRole('link', { name: /Startup Advisory/ }).first().click();
    await expect(page).toHaveURL(/\/services\/startup-advisory/);
    await page.goto('/team');
    await expect(page.locator('.team-card')).toHaveCount(6);
    await page.getByRole('link', { name: 'Harold Bright' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Harold Bright' })).toBeVisible();
    await expect(page.getByText('Fictional person — demonstration profile')).toBeVisible();
  });
});

test.describe('consultation booking', () => {
  test('full flow, persistence across reload, and cancellation', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/book');
    await expect(page.getByText(/not delivered to any firm/i)).toBeVisible();
    await page.getByRole('radio', { name: /Cash Flow Advisory/ }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('radio', { name: /Planning review/ }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('.calendar__day[aria-disabled="false"]').first().click();
    const summary = page.getByRole('complementary', { name: 'Your booking summary' });
    await expect(summary).toContainText('Planning review (60 min)');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('.slot:not(.is-unavailable)').first().click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Enter your name.')).toBeVisible();
    await page.getByLabel('Full name').fill('Ada Lovelace');
    await page.getByLabel('Email address').fill('ada@example.com');
    await page.getByLabel('Phone (optional)').fill('+44 20 7946 0000');
    await page.getByLabel(/What would you like to discuss/).fill('My account number is 1234567890123');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText(/remove long account/i)).toBeVisible();
    await page.getByLabel(/What would you like to discuss/).fill('Plan our next hiring round.');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { name: '6. Review and confirm' })).toBeVisible();
    await expect(page.getByText('Plan our next hiring round.')).toBeVisible();
    await page.getByRole('button', { name: 'Confirm demo reservation' }).click();
    await expect(page.getByRole('heading', { name: 'Demo reservation confirmed' })).toBeFocused();
    const ref = (await page.getByTestId('reference').textContent())!;
    expect(ref).toMatch(/^FF-[A-Z0-9]{6}$/);
    await page.reload();
    await expect(page.getByTestId('appointment')).toHaveCount(1);
    await expect(page.getByTestId('appointment')).toContainText(ref);
    await expect(page.getByTestId('appointment')).toContainText('Cash Flow Advisory');
    // the same slot is no longer available for a second booking
    await page.getByRole('radio', { name: /Cash Flow Advisory/ }).check();
    // cancel with Escape first (keeps), then confirm
    await page.getByRole('button', { name: `Cancel appointment ${ref}` }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('appointment')).toHaveCount(1);
    await page.getByRole('button', { name: `Cancel appointment ${ref}` }).click();
    await page.getByRole('button', { name: 'Yes, cancel it' }).click();
    await expect(page.getByTestId('appointment')).toHaveCount(0);
    await expect(page.getByText(/No saved demo appointments/)).toBeVisible();
    await page.reload();
    await expect(page.getByTestId('appointment')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  test('calendar is keyboard operable and usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/book?service=tax-planning');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('radio', { name: /Introductory call/ }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    const cal = page.locator('.calendar__grid');
    const box = await cal.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(360);
    const day = page.locator('.calendar__day[tabindex="0"]');
    await day.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('PageDown');
    await expect(page.locator('.calendar__head h3')).not.toHaveText('');
    const target = page.locator('.calendar__day[aria-disabled="false"]').first();
    await target.focus();
    await page.keyboard.press('Enter');
    await expect(target).toHaveAttribute('aria-pressed', 'true');
    const size = await target.boundingBox();
    expect(size!.height).toBeGreaterThanOrEqual(40);
  });
});

test.describe('contact form', () => {
  test('validation, honest demo result, and no false "sent" claim', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Submit enquiry' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Please fix 3 fields' })).toBeFocused();
    await page.getByLabel('Full name').fill('A');
    await page.getByLabel('Email address').fill('bad');
    await page.getByLabel('Your message').fill('short');
    await page.getByRole('button', { name: 'Submit enquiry' }).click();
    await expect(page.getByText('Name must be at least 2 characters.').first()).toBeVisible();
    await expect(page.getByText('Enter a valid email address, like name@example.com.').first()).toBeVisible();
    await page.getByLabel('Full name').fill('Ada Lovelace');
    await page.getByLabel('Email address').fill('ada@example.com');
    await page.getByLabel('Your message').fill('I would like to talk about cash-flow planning for next year.');
    await page.getByRole('button', { name: 'Submit enquiry' }).click();
    await expect(page.getByRole('heading', { name: /Not sent — this is a demonstration/ })).toBeVisible();
    await expect(page.getByText('Message sent')).toHaveCount(0);
    expect(await page.getByRole('link', { name: 'Open in my email app' }).getAttribute('href')).toContain('mailto:hello@folio-finance.example.com');
    await page.getByRole('button', { name: 'Edit message' }).click();
    await expect(page.getByLabel('Your message')).toHaveValue(/cash-flow planning/);
  });
});

test.describe('insights', () => {
  test('search, category filter, article page, related articles', async ({ page }) => {
    await page.goto('/insights');
    await expect(page.getByText('Showing 9 of 9 articles')).toBeVisible();
    await page.getByRole('button', { name: 'Cash flow' }).click();
    await expect(page.getByText('Showing 1 of 9 articles')).toBeVisible();
    await page.getByRole('button', { name: 'All topics' }).click();
    await page.getByRole('searchbox', { name: /search articles/i }).fill('loan');
    await page.getByRole('link', { name: /Reading a loan payment schedule/ }).click();
    await expect(page).toHaveURL(/\/insights\/reading-a-loan-payment-schedule$/);
    await expect(page.getByRole('heading', { name: 'Related articles' })).toBeVisible();
    await expect(page.locator('.article-card')).toHaveCount(3);
    await page.locator('.article-card .card__link').first().click();
    await expect(page.locator('article h1')).toBeVisible();
  });
});

test('footer and disclaimers mention demonstration status and template ownership', async ({ page }) => {
  await page.goto('/disclaimer');
  await expect(page.getByRole('heading', { name: 'Not financial advice' })).toBeVisible();
  await expect(page.getByText(/Folio Finance is a separate, fictional business/)).toBeVisible();
});
