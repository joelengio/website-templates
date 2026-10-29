// Real-browser end-to-end checks. Builds are served with `vite preview`.
// Usage: npm run build && npm run test:e2e   (set CHROMIUM_PATH if Chromium is not auto-detected)
// Writes screenshots to ./e2e-output (git-ignored).
import { chromium, firefox, webkit } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const out = path.resolve('e2e-output');
mkdirSync(out, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

const server = spawn('npx', ['vite', 'preview', '--configLoader', 'runner', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
const stop = () => server.kill();
process.on('exit', stop);
for (let i = 0; i < 50; i++) { try { if ((await fetch(BASE)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 200)); }

// E2E_BROWSER=firefox|webkit runs the same checks in another engine (install it first: npx playwright-core install firefox).
const engine = process.env.E2E_BROWSER || 'chromium';
const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p));
const browser = engine === 'chromium' ? await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] }) : await { firefox, webkit }[engine].launch();
const routes = ['/', '/treatments', '/treatments/signature-serene-massage', '/packages', '/booking', '/booking/manage', '/about', '/gallery', '/journal', '/journal/the-art-of-slow-mornings', '/contact', '/demo-notice'];
const widths = [360, 390, 768, 1024, 1440];

async function open(page, url) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  // force lazy images to load so "broken image" checks are meaningful
  await page.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
}

// 1. Direct URL access, console errors, broken images, overflow at every breakpoint
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  const errors = [], failed = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => failed.push(r.url()));
  page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  let bad = [];
  for (const r of routes) {
    await open(page, r);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
      h1: document.querySelectorAll('h1').length,
      noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      small: [...document.querySelectorAll('a,button,input,select,textarea')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.height < 24 || b.width < 24) && !e.classList.contains('sr-only') && getComputedStyle(e).position !== 'absolute' && e.type !== 'radio' && e.type !== 'checkbox'; }).map((e) => e.outerHTML.slice(0, 80))
    }));
    if (info.overflow > 0 || info.broken.length || info.h1 !== 1 || info.noAlt || info.small.length) bad.push({ r, ...info });
    if (w === 390 || w === 1440) await page.screenshot({ path: path.join(out, `${r === '/' ? 'home' : r.slice(1).replace(/\//g, '_')}-${w}.png`), fullPage: true });
  }
  check(`[${w}px] ${routes.length} routes: no overflow, no broken images, one h1, alt text, touch targets`, bad.length === 0, JSON.stringify(bad).slice(0, 400));
  check(`[${w}px] no console errors / failed requests`, errors.length === 0 && failed.length === 0, JSON.stringify({ errors, failed }).slice(0, 300));
  await ctx.close();
}

// 1b. Automated accessibility audit (axe-core).
// Run with reduced motion so reveal transitions have finished: otherwise axe samples half-faded text and silently
// skips colour-contrast checks. Every WCAG 2.x A/AA and best-practice violation (any impact) fails the build.
{
  const axeSrc = readFileSync(path.resolve('node_modules/axe-core/axe.min.js'), 'utf8');
  const found = [];
  for (const width of [1280, 390]) {
    const actx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const ap = await actx.newPage();
    for (const r of [...routes, '/missing-page']) {
      await open(ap, r);
      await ap.addScriptTag({ content: axeSrc });
      const v = await ap.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] })).violations.map((x) => `${x.id}(${x.impact}) ${x.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' ; ')}`));
      if (v.length) found.push({ width, r, v });
    }
    await actx.close();
  }
  check('axe-core WCAG 2.1 A/AA + best-practice: zero violations (12 routes + 404, 1280 & 390 px, motion settled)', found.length === 0, JSON.stringify(found).slice(0, 900));
}

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

// 2. Unknown route falls back to SPA 404 UI
await page.goto(BASE + '/definitely-missing', { waitUntil: 'networkidle' });
check('Unknown URL renders the in-app 404 with noindex', (await page.locator('h1').innerText()).includes('wandered') && (await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));

// 3. Static SEO assets
for (const f of ['/robots.txt', '/sitemap.xml', '/favicon.svg']) { const r = await fetch(BASE + f); check(`${f} served`, r.ok && !(await r.clone().text()).includes('<div id="root">')); }
const sm = await (await fetch(BASE + '/sitemap.xml')).text();
check('sitemap lists treatment and article URLs', sm.includes('/treatments/hot-stone-ritual') && sm.includes('/journal/the-art-of-slow-mornings'));
const html = await (await fetch(BASE + '/')).text();
check('index.html has description, canonical and Open Graph tags', /name="description"/.test(html) && /rel="canonical"/.test(html) && /property="og:image"/.test(html));

// 4. Mobile menu
await open(page, '/');
await page.getByRole('button', { name: 'Open menu' }).click();
check('Mobile menu opens (aria-expanded=true)', (await page.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded')) === 'true');
await page.keyboard.press('Escape');
check('Escape closes mobile menu', await page.getByRole('button', { name: 'Open menu' }).isVisible());
await page.getByRole('button', { name: 'Open menu' }).click();
await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Treatments' }).click();
await page.waitForURL('**/treatments');
await page.getByRole('button', { name: 'Open menu' }).waitFor({ timeout: 3000 }).catch(() => {});
check('Mobile menu navigates and closes', await page.getByRole('button', { name: 'Open menu' }).isVisible());

// 5. Treatments filter + search
await page.getByRole('button', { name: 'Facials' }).click();
check('Category filter works', (await page.locator('.treatment-card').count()) === 3);
await page.getByRole('button', { name: 'All', exact: true }).click();
await page.getByRole('searchbox').fill('stone');
check('Search works', (await page.locator('.treatment-card').count()) >= 1 && (await page.locator('.treatment-card').count()) < 6);

// 6. Booking flow at 390px
await open(page, '/booking');
await page.getByRole('radio', { name: /Luminous Botanical Facial/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('radio', { name: /Priya Nair/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
await page.locator('.cal-day:not([disabled])').first().click();
await page.locator('.slot:not([disabled])').first().click();
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('button', { name: 'Continue' }).click();
check('Empty details show validation errors', (await page.locator('.field-error').count()) >= 2);
await page.getByLabel('Full name').fill('Riley Morgan');
await page.getByLabel('Email', { exact: false }).first().fill('riley@example.com');
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('checkbox').check();
await page.getByRole('button', { name: 'Confirm demo booking' }).click();
await page.getByText('Demo booking confirmed').waitFor();
check('Booking confirmed on mobile with demo disclosure', (await page.getByText(/NOT sent to any real business/i).count()) > 0);
await page.screenshot({ path: path.join(out, 'booking-confirmed-390.png'), fullPage: true });
const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('serene-house-demo-bookings-v1')));
check('Booking persisted to localStorage', stored.length === 1 && stored[0].staffName === 'Priya Nair');

// 7. Persistence across reload + reschedule + cancel
await open(page, '/booking/manage');
check('Booking visible after reload', await page.getByText('Luminous Botanical Facial').first().isVisible());
await page.getByRole('link', { name: 'Reschedule' }).click();
await page.locator('.cal-day:not([disabled])').nth(3).click();
await page.locator('.slot:not([disabled])').first().click();
const newDate = await page.locator('.cal-day.is-selected').getAttribute('aria-label');
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('checkbox').check();
await page.getByRole('button', { name: 'Confirm new time' }).click();
await page.getByText('Demo booking updated').waitFor();
const moved = await page.evaluate(() => JSON.parse(localStorage.getItem('serene-house-demo-bookings-v1'))[0]);
check('Reschedule updates stored booking', !!newDate && moved.updatedAt !== undefined && moved.status === 'confirmed');
await page.goto(BASE + '/booking/manage');
await page.getByRole('button', { name: 'Cancel booking' }).click();
await page.getByRole('button', { name: 'Yes, cancel it' }).click();
check('Cancel marks booking cancelled', (await page.locator('.status--cancelled').count()) === 1);

// 7b. Availability allocation + duplicate-booking prevention (realistic multi-booking journey)
{
  const KEY = 'serene-house-demo-bookings-v1';
  const stash = () => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || '[]'), KEY);
  const pickDateTime = async (staffName) => {
    await page.goto(BASE + '/booking?treatment=signature-serene-massage', { waitUntil: 'networkidle' });
    if (staffName) await page.getByRole('radio', { name: new RegExp(staffName) }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('.cal-day:not([disabled])').first().click();
  };
  const finish = async (name, email) => {
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Email', { exact: false }).first().fill(email);
    await page.getByRole('button', { name: 'Continue' }).click();
  };
  const confirmBooking = async () => {
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Confirm demo booking' }).click();
    await page.getByText('Demo booking confirmed').waitFor();
  };
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate((k) => localStorage.removeItem(k), KEY);
  await pickDateTime();
  const slot = page.locator('.slot:not([disabled])').first();
  const slotLabel = (await slot.innerText()).trim();
  await slot.click();
  await finish('Casey Lane', 'casey@example.com');
  await confirmBooking();
  const [first] = await stash();
  // same guest, same time -> blocked before confirmation
  await pickDateTime();
  await page.locator('.slot', { hasText: slotLabel }).first().click();
  await finish('Casey Lane', 'CASEY@example.com');
  await page.getByText(/already has a booking at that time/).first().waitFor();
  check('Duplicate booking by the same guest/time is blocked', (await stash()).length === 1 && (await page.getByRole('checkbox').count()) === 0);
  // different guest, same slot, no preference -> a different therapist is allocated
  await pickDateTime();
  await page.locator('.slot', { hasText: slotLabel }).first().click();
  await finish('Dana Fox', 'dana@example.com');
  await confirmBooking();
  const all = await stash();
  check('A second guest gets a different therapist at the same time', all.length === 2 && all[0].staffId !== first.staffId && all[0].date === first.date && all[0].time === first.time);
  // choosing the already-booked therapist makes that time unavailable
  await pickDateTime(first.staffName);
  check('Slot is disabled for a therapist who is already booked', await page.locator('.slot', { hasText: slotLabel }).first().isDisabled());
  // cancelling frees the slot again
  await page.goto(BASE + '/booking/manage', { waitUntil: 'networkidle' });
  await page.locator('.booking-item', { hasText: 'casey@example.com' }).getByRole('button', { name: 'Cancel booking' }).click();
  await page.getByRole('button', { name: 'Yes, cancel it' }).click();
  await pickDateTime(first.staffName);
  check('Cancelling a booking frees the therapist\u2019s slot', await page.locator('.slot', { hasText: slotLabel }).first().isEnabled());
  // "Make another" after a reschedule starts a clean new booking
  await page.goto(BASE + '/booking/manage', { waitUntil: 'networkidle' });
  await page.locator('.booking-item', { hasText: 'dana@example.com' }).getByRole('link', { name: 'Reschedule' }).click();
  await page.locator('.cal-day:not([disabled])').nth(2).click();
  await page.locator('.slot:not([disabled])').first().click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Confirm new time' }).click();
  await page.getByText('Demo booking updated').waitFor();
  await page.getByRole('button', { name: 'Make another demo booking' }).click();
  await page.getByRole('heading', { name: 'Choose your treatment or package' }).waitFor();
  check('"Make another booking" after rescheduling returns to a fresh booking flow', !page.url().includes('reschedule'));
  await page.evaluate((k) => localStorage.removeItem(k), KEY);
}

// 8. Contact form never fakes delivery
await open(page, '/contact');
await page.getByRole('button', { name: /Validate message/ }).click();
check('Contact form validation errors', (await page.locator('.field-error').count()) === 4);
await page.getByLabel('Your name').fill('Sam'); await page.getByLabel('Email').fill('sam@example.com'); await page.getByLabel('Subject').fill('Hi there'); await page.getByLabel('Message').fill('A message that is long enough.');
await page.getByRole('button', { name: /Validate message/ }).click();
await page.getByText('Message not sent').waitFor();
check('Contact demo discloses non-delivery', (await page.getByText('Message not sent').count()) === 1);

// 9. Gallery lightbox keyboard + focus return
await open(page, '/gallery');
const first = page.locator('.masonry-item').first();
await first.focus(); await page.keyboard.press('Enter');
check('Lightbox opens', await page.getByRole('dialog').isVisible());
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(500); // let the 250 ms entrance animation finish
const vp = page.viewportSize();
const box = await page.locator('.lightbox').boundingBox();
const imgBox = await page.locator('.lightbox img').boundingBox();
check('Lightbox covers the whole viewport and its image is fully on screen', Math.abs(box.x) < 1 && Math.abs(box.y) < 1 && Math.abs(box.width - vp.width) < 2 && Math.abs(box.height - vp.height) < 2 && imgBox.y >= 0 && imgBox.y + imgBox.height <= vp.height + 1, JSON.stringify({ box, imgBox, vp }));
check('Lightbox ArrowRight advances', (await page.locator('.lb-figure figcaption').innerText()).includes('2 /'));
check('Lightbox focus is trapped inside dialog', await page.evaluate(() => document.querySelector('.lightbox').contains(document.activeElement)));
await page.keyboard.press('Escape');
check('Escape closes lightbox and returns focus', !(await page.getByRole('dialog').count()) && (await page.evaluate(() => document.activeElement?.className)).includes('masonry-item'));

// 10. Keyboard: skip link
await open(page, '/');
await page.keyboard.press('Tab');
check('Skip link is first focusable element', (await page.evaluate(() => document.activeElement?.textContent)) === 'Skip to content');

// 11. Reduced motion
const rm = await browser.newContext({ viewport: { width: 1024, height: 800 }, reducedMotion: 'reduce' });
const rp = await rm.newPage();
await rp.goto(BASE + '/', { waitUntil: 'networkidle' });
check('Reduced motion: reveal content visible immediately', await rp.evaluate(() => [...document.querySelectorAll('.reveal')].every((e) => e.classList.contains('is-in'))));
await rm.close();

await browser.close();
stop();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} browser checks passed`);
process.exit(failed.length ? 1 : 0);
