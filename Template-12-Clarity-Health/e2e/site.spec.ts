import { expect, test } from '@playwright/test';
import { bookGeneralMedicine, loadAll, pickDay, pickSlot, ROUTES, WIDTHS } from './helpers';

// 1. Every route at every required viewport: no overflow, no broken images, one h1, no console errors.
for (const width of WIDTHS) {
  test.describe(`viewport ${width}px`, () => {
    test.use({ viewport: { width, height: 844 } });
    for (const route of ROUTES) {
      test(`${route} renders cleanly`, async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
        page.on('pageerror', (e) => errors.push(String(e)));
        page.on('response', (r) => r.status() >= 400 && !r.url().endsWith('/this-page-does-not-exist') && errors.push(`${r.status()} ${r.url()}`));
        await page.goto(route);
        await page.locator('h1').first().waitFor();
        await loadAll(page);
        const info = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
          h1: document.querySelectorAll('h1').length,
          noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
          small: [...document.querySelectorAll<HTMLElement>('a[href],button,input:not([type=radio]):not([type=checkbox]),select,textarea')]
            .filter((e) => {
              const b = e.getBoundingClientRect();
              const cs = getComputedStyle(e);
              if (b.width === 0 || b.height === 0 || cs.visibility === 'hidden' || e.closest('.sr-only,[hidden]')) return false;
              // inline text links inside paragraphs are exempt from the 44px guideline (WCAG 2.5.8 inline exception); everything else must be ≥ 24px, buttons ≥ 44px
              const inline = e.tagName === 'A' && !!e.closest('p,li,address,dd') && cs.display === 'inline';
              if (inline) return false;
              return b.height < 24 || b.width < 24 || (e.tagName === 'BUTTON' && b.height < 43.5);
            })
            .map((e) => `${e.tagName}.${e.className} "${(e.textContent || '').trim().slice(0, 30)}" ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`)
        }));
        expect(info.overflow, 'horizontal overflow').toBeLessThanOrEqual(0);
        expect(info.broken, 'broken images').toEqual([]);
        expect(info.h1).toBe(1);
        expect(info.noAlt).toBe(0);
        expect(info.small, 'small touch targets').toEqual([]);
        expect(errors).toEqual([]);
        const name = route === '/' ? 'home' : route.slice(1).replace(/\//g, '_');
        await page.screenshot({ path: `review/shots/${name}-${width}.png`, fullPage: true });
      });
    }
  });
}

// 2. Deep links load correctly (Firebase-style SPA rewrite) and 404s are handled.
test.describe('deep links and 404', () => {
  for (const route of ROUTES.filter((r) => r !== '/' && !r.includes('does-not-exist'))) {
    test(`direct load ${route}`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('.site-header')).toBeVisible();
    });
  }
  test('unknown route shows the 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { level: 1, name: /couldn’t find that page/ })).toBeVisible();
    await expect(page).toHaveTitle(/not found/i);
    await page.getByRole('link', { name: 'Back to home' }).click();
    await expect(page).toHaveURL('/');
  });
  test('unknown doctor slug shows a not-found state', async ({ page }) => {
    await page.goto('/doctors/not-a-doctor');
    await expect(page.getByRole('heading', { level: 1, name: /couldn’t find that doctor/ })).toBeVisible();
  });
  test('robots.txt, sitemap.xml and favicon are served', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap:');
    const sm = await request.get('/sitemap.xml');
    const xml = await sm.text();
    expect(xml).toContain('/doctors/dr-amara-okafor');
    expect(xml).toContain('/journal/sun-safety-basics');
    expect(xml).not.toContain('/appointments');
    expect((await request.get('/favicon.svg')).status()).toBe(200);
  });
  test('security headers (CSP) are applied by the hosting config', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers()['x-content-type-options']).toBe('nosniff');
  });
});

// 3. SEO metadata
test.describe('SEO', () => {
  test('each page has a unique title, description, canonical and Open Graph tags', async ({ page }) => {
    const titles = new Set<string>();
    for (const route of ROUTES.filter((r) => !r.includes('does-not-exist'))) {
      await page.goto(route);
      await page.locator('h1').first().waitFor();
      const title = await page.title();
      expect(title.length, route).toBeGreaterThan(5);
      if (route !== '/book' && route !== '/appointments') titles.add(title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\.webp$/);
    }
    expect(titles.size).toBe(ROUTES.length - 1 - 2);
    await page.goto('/appointments');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});

// 4. Navigation
test.describe('navigation', () => {
  test('desktop nav links route and show the active state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Doctors' }).click();
    await expect(page).toHaveURL('/doctors');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Doctors' })).toHaveClass(/is-active/);
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Doctors' })).toHaveAttribute('aria-current', 'page');
  });
  test('mobile menu opens, traps focus, closes on Escape and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('/services');
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden();
  });
  test('skip link is the first tab stop and jumps to main content', async ({ page }) => {
    await page.goto('/about');
    await page.locator('h1').waitFor();
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });
  test('footer links work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Demo & privacy notice' }).click();
    await expect(page).toHaveURL('/demo-notice');
  });
});

// 5. Filters
test.describe('filters', () => {
  test('specialties search and category filter', async ({ page }) => {
    await page.goto('/specialties');
    await expect(page.getByText('8 specialties shown')).toBeVisible();
    await page.getByRole('searchbox', { name: 'Search specialties' }).fill('skin');
    await expect(page.getByText('1 specialty shown')).toBeVisible();
    await expect(page).toHaveURL(/q=skin/);
    await page.getByRole('searchbox', { name: 'Search specialties' }).fill('zzzz');
    await expect(page.getByText('No specialties match your search')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).first().click();
    await page.getByLabel('Category').selectOption('Family health');
    await expect(page.getByText('3 specialties shown')).toBeVisible();
  });
  test('doctor filters: specialty, language, availability, new patients', async ({ page }) => {
    await page.goto('/doctors');
    await expect(page.getByText('10 doctors shown')).toBeVisible();
    await page.getByLabel('Specialty').selectOption('dermatology');
    await expect(page.getByText('2 doctors shown')).toBeVisible();
    await page.getByLabel('Accepting new patients').click();
    await expect(page.getByLabel('Accepting new patients')).toBeChecked();
    await expect(page.getByText('1 doctor shown')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await page.getByLabel('Language').selectOption('Arabic');
    await expect(page.getByText('1 doctor shown')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await page.getByLabel('Available on').selectOption('6');
    await expect(page.locator('.doctor-card').first()).toBeVisible();
    await page.getByLabel('Offers video consultations').click();
    await expect(page.getByLabel('Offers video consultations')).toBeChecked();
    expect(await page.locator('.doctor-card').count()).toBeGreaterThan(0);
  });
  test('services category chips and search', async ({ page }) => {
    await page.goto('/services');
    await page.getByRole('button', { name: 'Wellness screenings' }).click();
    await expect(page.getByRole('button', { name: 'Wellness screenings' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('6 services shown')).toBeVisible();
    await page.getByRole('searchbox', { name: 'Search services' }).fill('diabetes');
    await expect(page.getByText('1 service shown')).toBeVisible();
  });
  test('journal search and category', async ({ page }) => {
    await page.goto('/journal');
    await page.getByRole('button', { name: 'Skin & sun' }).click();
    await expect(page.getByText('1 article shown')).toBeVisible();
    await page.getByRole('link', { name: 'Sun safety basics' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Sun safety basics' })).toBeVisible();
    await expect(page.getByText('Medical information disclaimer')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Related articles' })).toBeVisible();
  });
  test('detail pages link to a prefilled booking', async ({ page }) => {
    await page.goto('/doctors/dr-mateo-lindqvist');
    await page.getByRole('link', { name: /Book with Dr. Mateo Lindqvist/ }).click();
    await expect(page).toHaveURL(/\/book\?specialty=cardiology&doctor=mateo-lindqvist/);
    await expect(page.getByRole('heading', { name: /Step 3 of 6/ })).toBeVisible();
    await page.goto('/doctors/dr-yuki-tanaka');
    await expect(page.getByRole('link', { name: /Book another Dermatology doctor/ })).toBeVisible();
  });
});

// 6. Booking flow, persistence, reschedule and cancellation
test.describe('booking', () => {
  test('full flow with validation, confirmation and persistence', async ({ page }) => {
    await page.goto('/book');
    await expect(page.getByText(/not a real appointment/i).first()).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText('choose a specialty');
    await page.getByRole('radio', { name: /General Medicine/ }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('radio', { name: /No preference/ }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('radio', { name: /Initial consultation/ }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    // date + time
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText('select a date');
    await pickDay(page);
    await expect(page.locator('.slot').first()).toBeVisible();
    await pickSlot(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    // details validation
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Please enter your name (at least 2 characters).')).toBeVisible();
    await page.getByLabel(/Full name/).fill('Alex Morgan');
    await page.getByLabel(/E-mail address/).fill('not-an-email');
    await page.getByLabel(/Phone number/).fill('abc');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText(/valid e-mail address/)).toBeVisible();
    await expect(page.getByText(/valid phone number/)).toBeVisible();
    await page.getByLabel(/E-mail address/).fill('alex@example.com');
    await page.getByLabel(/Phone number/).fill('');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText(/confirm that you understand/)).toBeVisible();
    await page.getByLabel(/I understand this is a demonstration/).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    // review
    await expect(page.getByRole('heading', { name: /Review and confirm/ })).toBeVisible();
    await expect(page.locator('.review')).toContainText('alex@example.com');
    await page.getByRole('button', { name: 'Confirm demo appointment' }).click();
    await expect(page.getByRole('heading', { level: 1, name: /Demo appointment saved/ })).toBeVisible();
    await expect(page.getByText('No real clinic has been contacted')).toBeVisible();
    const stored = await page.evaluate(() => window.localStorage.getItem('clarity-health:demo-appointments:v1'));
    expect(stored).toContain('alex@example.com');
    // persistence after reload
    await page.goto('/appointments');
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Upcoming' })).toBeVisible();
    await expect(page.locator('.appt')).toHaveCount(1);
    await expect(page.locator('.appt')).toContainText('Initial consultation');
  });

  test('time slots that were booked disappear, and duplicates are blocked', async ({ page }) => {
    await bookGeneralMedicine(page);
    await expect(page.getByRole('heading', { level: 1, name: /Demo appointment saved/ })).toBeVisible();
    // Same e-mail, same service, same day → blocked at confirmation
    await page.goto('/book?specialty=general-medicine&service=initial-consultation');
    await expect(page.getByRole('heading', { name: /date and time/i })).toBeVisible();
    const saved = JSON.parse((await page.evaluate(() => window.localStorage.getItem('clarity-health:demo-appointments:v1')))!)[0];
    await page.locator(`button.day[data-date="${saved.date}"]`).click();
    await page.locator('.slot:not(.is-disabled)').last().click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel(/Full name/).fill('Alex Morgan');
    await page.getByLabel(/E-mail address/).fill('alex@example.com');
    await page.getByLabel(/I understand this is a demonstration/).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Confirm demo appointment' }).click();
    await expect(page.getByRole('alert')).toContainText(/already have/);
    expect(JSON.parse((await page.evaluate(() => window.localStorage.getItem('clarity-health:demo-appointments:v1')))!)).toHaveLength(1);
  });

  test('reschedule and cancel a saved appointment', async ({ page }) => {
    await bookGeneralMedicine(page);
    await page.goto('/appointments');
    const before = JSON.parse((await page.evaluate(() => window.localStorage.getItem('clarity-health:demo-appointments:v1')))!)[0];
    await page.getByRole('link', { name: /Reschedule/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: /Reschedule your demo appointment/ })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText('select a date');
    // choose a different day than the current one
    const day = page.locator(`button.day.is-available:not([data-date="${before.date}"])`).first();
    await day.click();
    await pickSlot(page, 0);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Confirm new time' }).click();
    await expect(page.getByRole('heading', { level: 1, name: /rescheduled/ })).toBeVisible();
    const after = JSON.parse((await page.evaluate(() => window.localStorage.getItem('clarity-health:demo-appointments:v1')))!)[0];
    expect(`${after.date} ${after.time}`).not.toBe(`${before.date} ${before.time}`);
    expect(after.id).toBe(before.id);
    // cancel via dialog
    await page.getByRole('link', { name: 'My demo appointments' }).first().click();
    const cancel = page.getByRole('button', { name: /^Cancel/ });
    await cancel.click();
    const dialog = page.getByRole('dialog', { name: 'Cancel this demo appointment?' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Keep appointment' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(cancel).toBeFocused();
    await cancel.click();
    await page.getByRole('button', { name: 'Cancel appointment' }).click();
    await expect(page.getByText(/was cancelled/)).toBeVisible();
    await expect(page.locator('.status-cancelled')).toBeVisible();
    // cancelled slot becomes bookable again, and data can be wiped
    await page.getByRole('button', { name: 'Delete all demo data' }).click();
    await page.getByRole('button', { name: 'Delete everything' }).click();
    await expect(page.getByText('No demo appointments yet')).toBeVisible();
    expect(JSON.parse((await page.evaluate(() => window.localStorage.getItem('clarity-health:demo-appointments:v1')))!)).toEqual([]);
  });

  test('calendar is keyboard operable', async ({ page }) => {
    await page.goto('/book?specialty=general-medicine&service=initial-consultation');
    const day = page.locator('button.day[tabindex="0"]');
    await day.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('button.day:focus')).toHaveCount(1);
    await page.keyboard.press('PageDown');
    await page.keyboard.press('Home');
    await expect(page.locator('button.day:focus')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Previous month' })).toBeVisible();
  });

  test('works when localStorage is blocked and tells the user', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => { throw new Error('blocked'); };
      Storage.prototype.getItem = () => { throw new Error('blocked'); };
    });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await bookGeneralMedicine(page);
    await expect(page.getByRole('heading', { level: 1, name: /Demo appointment saved/ })).toBeVisible();
    await expect(page.getByText('Your browser blocked saving')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('mobile: booking steps remain usable at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await bookGeneralMedicine(page, 'mobile@example.com');
    await expect(page.getByRole('heading', { level: 1, name: /Demo appointment saved/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});

// 7. Contact form
test('contact form validates and never claims delivery; location tabs work with the keyboard', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Validate demo form' }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();
  await page.getByLabel(/Your name/).fill('Alex');
  await page.getByLabel(/E-mail address/).fill('alex@example.com');
  await page.getByLabel(/Topic/).selectOption('General question');
  await page.getByLabel(/Message/).fill('Hello, this is a demo message.');
  let requests = 0;
  page.on('request', (r) => r.method() === 'POST' && requests++);
  await page.getByRole('button', { name: 'Validate demo form' }).click();
  await expect(page.getByText(/not sent or delivered/)).toBeVisible();
  expect(requests).toBe(0);
  await page.getByRole('tab', { name: /Riverside/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Garden Annex/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('18 Linden Court');
});

// 8. Reduced motion
test('respects prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const t = await page.evaluate(() => getComputedStyle(document.querySelector('.btn')!).transitionDuration);
  expect(parseFloat(t)).toBeLessThan(0.01);
});
