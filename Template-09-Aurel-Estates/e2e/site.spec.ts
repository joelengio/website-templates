import { expect, test } from '@playwright/test';

const widths = [360, 390, 768, 1024, 1440];
const routes = ['/', '/properties', '/properties/larkspur-pavilion', '/properties/slate-court-4b', '/about', '/services', '/journal', '/journal/coastal-vs-hills', '/contact', '/favorites', '/compare', '/nope'];

test.describe('responsive layout', () => {
  for (const w of widths) {
    test(`no horizontal overflow or console errors at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(String(e)));
      for (const r of routes) {
        await page.goto(r);
        await page.locator('h1').first().waitFor();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${r} @${w}`).toBeLessThanOrEqual(0);
        const broken = await page.evaluate(() => Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
        expect(broken, `broken images on ${r}`).toEqual([]);
      }
      expect(errors).toEqual([]);
    });
  }
});

test('mobile menu works with keyboard and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Site menu' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await dialog.getByRole('link', { name: 'Services' }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(dialog).toBeHidden();
  await expect(page.locator('h1')).toBeFocused();
});

test('skip link moves focus to main', async ({ page }) => {
  await page.goto('/about');
  await page.locator('h1').waitFor();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('desktop listing filters, URL state, reset and empty state', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/properties');
  const cards = page.locator('article.property-card');
  await cards.first().waitFor();
  const total = await cards.count();
  expect(total).toBeGreaterThanOrEqual(12);
  const side = page.getByRole('complementary', { name: 'Filters' });
  await side.getByLabel('Villa').check();
  await side.getByLabel('Swimming pool').check();
  await expect(page).toHaveURL(/type=Villa/);
  expect(await cards.count()).toBeLessThan(total);
  await side.getByLabel('Max price').selectOption('1000000');
  await expect(page.getByText('No properties match these filters')).toBeVisible();
  await page.getByRole('button', { name: 'Reset all filters' }).first().click();
  await expect(cards).toHaveCount(total);
  await page.goto('/properties?area=Oakhaven&beds=4');
  await expect(cards.first()).toBeVisible();
  for (const t of await cards.locator('h3').allTextContents()) expect(t).toBeTruthy();
});

test('mobile filter drawer', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/properties');
  await expect(page.locator('.listing-sidebar')).toBeHidden();
  await page.getByRole('button', { name: /^Filters/ }).click();
  const drawer = page.getByRole('dialog', { name: 'Filter properties' });
  await drawer.getByLabel('Lodge').check();
  await drawer.getByRole('button', { name: /Show 1 property/ }).click();
  await expect(page.locator('article.property-card')).toHaveCount(1);
});

test('favorites persist across reloads; compare limited to three', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/properties');
  await page.getByRole('button', { name: /Save Villa Solenne/ }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: /Remove Villa Solenne/ })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/favorites');
  await expect(page.getByRole('heading', { name: 'Villa Solenne' })).toBeVisible();
  await page.goto('/properties');
  const boxes = page.getByRole('checkbox', { name: /^Compare / });
  for (let i = 0; i < 4; i++) await boxes.nth(i).check({ force: i === 3 }).catch(() => undefined);
  await expect(page.locator('input[type=checkbox][aria-label^="Compare "]:checked')).toHaveCount(3);
  await page.getByRole('link', { name: 'Compare now' }).click();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.locator('.compare-table thead th')).toHaveCount(3);
});

test('gallery lightbox via keyboard', async ({ page }) => {
  await page.goto('/properties/cedar-ridge');
  await page.getByRole('button', { name: /full screen/ }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(dlg.locator('figcaption')).toContainText('2 / 5');
  await page.keyboard.press('Escape');
  await expect(dlg).toBeHidden();
});

test('inquiry form: property preselected, validation, honest demo result', async ({ page }) => {
  await page.goto('/properties/orchard-gate');
  const form = page.getByRole('form', { name: 'Inquiry form' });
  await expect(form.getByLabel('Property')).toHaveValue('orchard-gate');
  await expect(form.getByText('Demo form.')).toBeVisible();
  await form.getByRole('button', { name: /Validate inquiry/ }).click();
  await expect(form.getByText('Please enter your full name.')).toBeVisible();
  await form.getByLabel('Full name *').fill('Ada Lovelace');
  await form.getByLabel('Email *').fill('bad-email');
  await form.getByLabel('Message *').fill('Hello there, I would like a viewing.');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: /Validate inquiry/ }).click();
  await expect(form.getByText(/valid email address/)).toBeVisible();
  await form.getByLabel('Email *').fill('ada@example.com');
  await form.getByRole('button', { name: /Validate inquiry/ }).click();
  await expect(page.getByText('Demo only — nothing was sent')).toBeVisible();
  await expect(page.getByText('Inquiry sent')).toHaveCount(0);
});

test('hero search routes to filtered listings', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' }); // let the app hydrate before using the form (WebKit is quicker to click than to boot)
  await page.getByLabel('Type', { exact: true }).selectOption('Cottage');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page).toHaveURL(/properties\?type=Cottage/);
  await expect(page.locator('article.property-card')).toHaveCount(3);
});

test('reduced motion disables reveal animation', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/about');
  const opacity = await page.locator('.reveal').first().evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
  await ctx.close();
});

test('seo assets are served', async ({ request, page }) => {
  expect((await request.get('/robots.txt')).ok()).toBe(true);
  const sm = await (await request.get('/sitemap.xml')).text();
  expect(sm).toContain('/properties/cedar-ridge');
  expect((await request.get('/favicon.svg')).ok()).toBe(true);
  await page.goto('/properties/cedar-ridge');
  await expect(page).toHaveTitle(/Cedar Ridge Residence/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /properties\/cedar-ridge$/);
});

test('direct deep links resolve (SPA fallback) and footer credits the template owner', async ({ page }) => {
  await page.goto('/journal/preparing-your-home-for-sale');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Preparing your home');
  await expect(page.locator('footer')).toContainText('Website template by OneStop Infinite');
});

test('combined filters + sorting survive reload; a saved search can be re-applied and deleted', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/properties');
  const cards = page.locator('article.property-card');
  await cards.first().waitFor();
  const side = page.getByRole('complementary', { name: 'Filters' });
  await side.getByLabel('Villa').check();
  await side.getByLabel('Swimming pool').check();
  await page.getByLabel('Sort by').selectOption('price-desc');
  await expect(page).toHaveURL(/type=Villa.*features=pool.*sort=price-desc|sort=price-desc/);
  const prices = async () => (await cards.locator('.property-card__price, .price').allTextContents()).map((t) => Number(t.replace(/[^\d]/g, ''))).filter(Boolean);
  const sorted = await prices();
  expect(sorted.length).toBeGreaterThan(0);
  expect(sorted).toEqual([...sorted].sort((a, b) => b - a));
  const filteredCount = await cards.count();

  await page.reload();
  await expect(cards).toHaveCount(filteredCount);
  await expect(page.getByLabel('Sort by')).toHaveValue('price-desc');

  await page.getByRole('button', { name: /Save this search/ }).click();
  await page.getByLabel('Name for this search').fill('Pool villas');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pool villas', exact: true })).toBeVisible();
  await expect(page.getByText(/No email alerts are sent/)).toBeVisible();

  await page.goto('/properties');
  await expect(cards).not.toHaveCount(filteredCount);
  await page.getByRole('button', { name: 'Pool villas', exact: true }).click();
  await expect(cards).toHaveCount(filteredCount);
  await expect(page).toHaveURL(/type=Villa/);

  await page.getByRole('button', { name: 'Delete saved search: Pool villas' }).click();
  await expect(page.getByRole('button', { name: 'Pool villas', exact: true })).toHaveCount(0);
});

test('static HTML head carries absolute canonical/OG URLs; private and 404 pages are noindex', async ({ request, page }) => {
  const html = await (await request.get('/')).text();
  expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+\/"/);
  expect(html).toMatch(/<meta property="og:image" content="https?:\/\//);
  expect(html).toMatch(/<meta property="og:url" content="https?:\/\//);
  await page.goto('/properties/cedar-ridge');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'index, follow');
  for (const path of ['/favorites', '/compare', '/does-not-exist']) {
    await page.goto(path);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);
  }
});
