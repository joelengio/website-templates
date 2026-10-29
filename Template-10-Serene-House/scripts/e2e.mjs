// Real-browser end-to-end checks. Builds are served with `vite preview`.
// Usage: npm run build && npm run test:e2e   (set CHROMIUM_PATH if Chromium is not auto-detected)
// Writes screenshots to ./e2e-output (git-ignored).
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const out = path.resolve('e2e-output');
mkdirSync(out, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
const stop = () => server.kill();
process.on('exit', stop);
for (let i = 0; i < 50; i++) { try { if ((await fetch(BASE)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 200)); }

const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
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

// 1b. Automated accessibility audit (axe-core) — serious/critical violations fail
{
  const axeSrc = readFileSync(path.resolve('node_modules/axe-core/axe.min.js'), 'utf8');
  const actx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ap = await actx.newPage();
  const found = [];
  for (const r of routes) {
    await open(ap, r);
    await ap.addScriptTag({ content: axeSrc });
    const v = await ap.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.filter((x) => ['serious', 'critical'].includes(x.impact)).map((x) => `${x.id}(${x.nodes.length}): ${x.nodes[0].target}`));
    if (v.length) found.push({ r, v });
  }
  check('axe-core WCAG 2.1 A/AA: no serious/critical violations on all routes', found.length === 0, JSON.stringify(found).slice(0, 900));
  await actx.close();
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
