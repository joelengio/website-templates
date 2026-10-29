// Real-browser end-to-end checks against the production build (served with `vite preview`).
// Usage: npm run build && npm run test:e2e   (set CHROMIUM_PATH if Chromium is not auto-detected)
// Writes screenshots and results.json to ./e2e-output (git-ignored).
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const out = path.resolve('e2e-output');
mkdirSync(out, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail: ok ? '' : String(detail).slice(0, 600) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? ' — ' + String(detail).slice(0, 400) : ''}`); };

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
const stop = () => server.kill();
process.on('exit', stop);
for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 200)); }

const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const routes = ['/', '/programs', '/programs/hiit', '/schedule', '/trainers', '/trainers/maya-okafor', '/membership', '/facilities', '/about', '/journal', '/journal/how-to-start-strength-training', '/contact', '/demo-notice'];
const widths = [360, 390, 768, 1024, 1440];

// Polls an async condition (UI updates after clicks are asynchronous).
async function until(fn, ms = 4000) { const end = Date.now() + ms; for (;;) { try { if (await fn()) return true; } catch { /* retry */ } if (Date.now() > end) return false; await new Promise((r) => setTimeout(r, 100)); } }

async function open(page, url) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  // scroll slowly so IntersectionObserver reveals and lazy images load
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 200)); } window.scrollTo(0, 0); });
  await page.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
}

// 1. Layout / assets / console at every breakpoint on every route
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  const errors = [], failed = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => failed.push(r.url()));
  page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  const bad = [];
  for (const r of routes) {
    await open(page, r);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
      h1: document.querySelectorAll('h1').length,
      noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      small: [...document.querySelectorAll('a,button,input,select,textarea,summary')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.height < 24 || b.width < 24) && !e.classList.contains('sr-only') && getComputedStyle(e).position !== 'absolute' && e.type !== 'radio' && e.type !== 'checkbox'; }).map((e) => e.outerHTML.slice(0, 80)),
      fonts: document.fonts.check("700 20px 'Big Shoulders Display'") && document.fonts.check("400 16px 'Manrope'")
    }));
    if (info.overflow > 0 || info.broken.length || info.h1 !== 1 || info.noAlt || info.small.length || !info.fonts) bad.push({ r, ...info });
  }
  check(`[${w}px] ${routes.length} routes: no horizontal overflow, no broken images, one h1, alt text, touch-target ≥24px, fonts loaded`, bad.length === 0, JSON.stringify(bad));
  check(`[${w}px] no console errors / failed requests`, errors.length === 0 && failed.length === 0, JSON.stringify({ errors, failed }));
  await ctx.close();
}

// 2. Accessibility audit (axe-core WCAG 2.1 A/AA, incl. contrast) — serious/critical fail
const axeSrc = readFileSync(path.resolve('node_modules/axe-core/axe.min.js'), 'utf8');
async function axeRun(page) {
  await page.addScriptTag({ content: axeSrc });
  return page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.filter((x) => ['serious', 'critical', 'moderate'].includes(x.impact)).map((x) => `${x.id}[${x.impact}](${x.nodes.length}): ${x.nodes[0].target} ${x.nodes[0].failureSummary?.split('\n')[1] ?? ''}`));
}
for (const w of [1280, 390]) {
  const actx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const ap = await actx.newPage();
  const found = [];
  for (const r of routes) { await open(ap, r); const v = await axeRun(ap); if (v.length) found.push({ r, v }); }
  check(`axe-core WCAG 2.1 A/AA at ${w}px: no violations on ${routes.length} routes`, found.length === 0, JSON.stringify(found));
  await actx.close();
}

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

// 3. SPA fallback, 404, direct nested route loading
for (const r of ['/programs/boxing-fitness', '/trainers/dario-velasquez', '/journal/warm-up-habits-that-last']) {
  const res = await fetch(BASE + r);
  const html = await res.text();
  await page.goto(BASE + r, { waitUntil: 'networkidle' });
  check(`Direct load of nested route ${r}`, res.ok && html.includes('<div id="root">') && (await page.locator('h1').count()) === 1);
}
await page.goto(BASE + '/definitely-missing', { waitUntil: 'networkidle' });
check('Unknown URL renders the in-app 404 with noindex', (await page.locator('h1').textContent()).length > 3 && (await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));
await page.goto(BASE + '/programs/not-a-program', { waitUntil: 'networkidle' });
check('Unknown program slug renders a helpful 404', (await page.getByText('Error 404').count()) === 1);

// 4. Static SEO assets
for (const f of ['/robots.txt', '/sitemap.xml', '/favicon.svg', '/logo.svg']) { const r = await fetch(BASE + f); check(`${f} served`, r.ok && !(await r.clone().text()).includes('<div id="root">')); }
const sm = await (await fetch(BASE + '/sitemap.xml')).text();
check('sitemap lists program, trainer and article URLs', sm.includes('/programs/hiit') && sm.includes('/trainers/maya-okafor') && sm.includes('/journal/how-to-start-strength-training') && sm.includes('/schedule'));
const html = await (await fetch(BASE + '/')).text();
check('index.html has description, canonical, Open Graph, favicon and theme-color', /name="description"/.test(html) && /rel="canonical"/.test(html) && /property="og:image"/.test(html) && /rel="icon"/.test(html) && /theme-color/.test(html));
await page.goto(BASE + '/programs/hiit', { waitUntil: 'networkidle' });
check('Page-specific metadata updates (title, canonical, og:title)', (await page.title()).startsWith('HIIT') && (await page.locator('link[rel=canonical]').getAttribute('href')).endsWith('/programs/hiit') && (await page.locator('meta[property="og:title"]').getAttribute('content')).startsWith('HIIT'));

// 5. Mobile menu
await open(page, '/');
await page.getByRole('button', { name: 'Open menu' }).click();
check('Mobile menu opens (aria-expanded=true)', (await page.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded')) === 'true');
await page.screenshot({ path: path.join(out, 'mobile-menu-390.png') });
await page.keyboard.press('Escape');
check('Escape closes mobile menu', await page.getByRole('button', { name: 'Open menu' }).isVisible());
await page.getByRole('button', { name: 'Open menu' }).click();
await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: /Programs/ }).click();
await page.waitForURL('**/programs');
await page.getByRole('button', { name: 'Open menu' }).waitFor({ timeout: 3000 }).catch(() => {});
check('Mobile menu navigates and closes', await page.getByRole('button', { name: 'Open menu' }).isVisible());

// 6. Programs search and filters
await page.getByRole('button', { name: 'Combat', exact: true }).click();
check('Program category filter works', await until(async () => (await page.locator('.program-card').count()) === 1));
await page.getByRole('button', { name: 'All', exact: true }).click();
await page.getByRole('searchbox').fill('mobility');
check('Program search works', await until(async () => (await page.locator('.program-card').count()) === 1));
await page.getByRole('searchbox').fill('qqqzzz');
check('Program empty state', await until(async () => (await page.getByText('No programs match').count()) === 1));
await open(page, '/programs?q=boxing');
check('Program search is URL-addressable', await until(async () => (await page.locator('.program-card').count()) === 1));
await page.locator('.program-card .card-link').first().click();
await page.waitForURL('**/programs/boxing-fitness');
await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Boxing Fitness', null, { timeout: 5000 }).catch(() => {});
check('Program card opens its detail page', (await page.locator('h1').textContent()) === 'Boxing Fitness');

// 7. Schedule + booking at 390px
await open(page, '/schedule');
await page.getByRole('button', { name: /next week/i }).click();
await page.getByRole('button', { name: /Tuesday/ }).click();
check('Day selection updates the timetable', await until(async () => (await page.locator('h2.schedule-day-title').textContent()).includes('Tuesday')));
await page.getByRole('button', { name: 'Boxing Fitness', exact: true }).click();
check('Class-type filter shows empty state when no match', await until(async () => (await page.getByText('No classes match these filters').count()) === 1));
await page.getByRole('button', { name: 'Clear filters' }).click();
await page.getByLabel('Trainer').selectOption('maya-okafor');
check('Trainer filter works', await until(async () => (await page.locator('.class-row').count()) === 1));
await page.getByLabel('Trainer').selectOption('All');
const bookBtn = page.locator('.class-row button', { hasText: /^Book$/ }).first();
await bookBtn.focus();
await page.keyboard.press('Enter');
await page.getByRole('dialog').waitFor();
check('Booking modal opens and moves focus inside', await page.evaluate(() => document.querySelector('[role=dialog]').contains(document.activeElement)));
check('Booking modal states it is a demonstration', (await page.getByRole('dialog').getByText(/Demo booking/i).count()) > 0);
for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
check('Modal traps Tab focus', await page.evaluate(() => document.querySelector('[role=dialog]').contains(document.activeElement)));
check('Page behind modal is inert', await page.evaluate(() => document.getElementById('root').hasAttribute('inert') || [...document.getElementById('root').children].every((c) => c.hasAttribute('inert'))));
{ const v = await axeRun(page); check('axe: booking modal has no violations', v.length === 0, JSON.stringify(v)); }
await page.keyboard.press('Escape');
check('Escape closes modal and returns focus to the trigger', (await page.getByRole('dialog').count()) === 0 && (await page.evaluate(() => document.activeElement?.className)).includes('btn'));
await bookBtn.click();
await page.getByRole('button', { name: /confirm demo reservation/i }).click();
check('Empty booking details show validation errors', (await page.locator('.field-error').count()) >= 2);
await page.getByRole('dialog').getByLabel(/full name/i).fill('Riley Morgan');
await page.getByRole('dialog').getByLabel(/email/i).fill('riley@example.com');
await page.getByRole('button', { name: /confirm demo reservation/i }).click();
await page.getByText('Demo reservation saved').waitFor();
check('Booking confirmation shows reference and demo disclosure', (await page.getByRole('dialog').getByText(/Reference/).count()) > 0 && (await page.getByRole('dialog').getByText(/nothing is sent to the club/i).count()) > 0);
await page.screenshot({ path: path.join(out, 'booking-confirmed-390.png') });
const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('vigor-club-demo-reservations-v1')));
check('Reservation persisted to localStorage', stored.length === 1 && stored[0].email === 'riley@example.com');
await page.getByRole('button', { name: 'Done' }).click();
check('Class row now shows Booked and Manage (duplicate booking prevented)', (await page.getByText('Booked', { exact: true }).count()) === 1 && (await page.getByRole('button', { name: /^Manage — / }).count()) === 1);
await open(page, '/schedule');
check('Reservation survives a page reload', (await page.locator('.res-list li').count()) === 1);
await page.getByRole('button', { name: /^Cancel/ }).first().click();
await page.getByRole('button', { name: 'Keep reservation' }).click();
check('Keep reservation leaves the booking intact', (await page.locator('.res-list li').count()) === 1);
await page.getByRole('button', { name: /^Cancel/ }).first().click();
await page.getByRole('button', { name: 'Yes, cancel it' }).click();
check('Cancel removes reservation and shows empty state', (await page.getByText('No reservations yet').count()) === 1 && (await page.evaluate(() => JSON.parse(localStorage.getItem('vigor-club-demo-reservations-v1')).length)) === 0);
await open(page, '/schedule?day=2&class=wed-1730-box');
check('Deep link ?day=&class= opens that class details', (await page.getByRole('dialog').getByRole('heading', { name: 'Boxing Rounds' }).count()) === 1);

// 8. Membership
await open(page, '/membership');
const priceText = async () => (await page.locator('.plan').nth(1).locator('.plan-price b').innerText());
const monthlyPrice = await priceText();
await page.getByRole('radiogroup', { name: 'Billing period' }).getByRole('radio', { name: /Annual/ }).click();
const annualPrice = await priceText();
check('Billing toggle changes plan prices', monthlyPrice !== annualPrice && Number(annualPrice.replace(/\D/g, '')) < Number(monthlyPrice.replace(/\D/g, '')), `${monthlyPrice} → ${annualPrice}`);
const tw = await page.locator('.table-wrap').evaluate((e) => ({ sw: e.scrollWidth, cw: e.clientWidth }));
check('Comparison table scrolls inside its own region on mobile', tw.sw > tw.cw && (await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)));
await page.getByRole('button', { name: /Choose Elite/ }).click();
check('Choosing a plan preselects it in the signup form', await page.getByRole('radio', { name: /Elite/ }).first().isChecked());
await page.getByRole('button', { name: /review enquiry/i }).click();
check('Signup validation errors shown', (await page.locator('#join .field-error').count()) >= 3);
await page.locator('#join').getByLabel(/full name/i).fill('Sam Lee');
await page.locator('#join').getByLabel(/^Email/).fill('sam@example.com');
await page.locator('#join input[type=date]').fill('2099-01-01');
await page.getByRole('button', { name: /review enquiry/i }).click();
await page.getByRole('checkbox').check();
await page.getByRole('button', { name: /submit demo enquiry/i }).click();
await page.getByRole('heading', { name: /demo enquiry recorded/i }).waitFor();
check('Signup ends with explicit no-payment/no-activation disclosure', (await page.getByText(/no membership was created or activated/i).count()) === 1);
await page.screenshot({ path: path.join(out, 'signup-done-390.png') });

// 9. Contact form never fakes delivery
await open(page, '/contact');
await page.getByRole('button', { name: /Validate message/ }).click();
check('Contact form validation errors', (await page.locator('.field-error').count()) >= 4);
await page.getByLabel('Your name').fill('Sam');
await page.getByLabel('Email').fill('sam@example.com');
await page.getByLabel('What is it about?').selectOption('membership');
await page.getByLabel('Message').fill('A message that is long enough.');
await page.getByRole('button', { name: /Validate message/ }).click();
await page.getByText('Message not sent').waitFor();
check('Contact demo discloses non-delivery', (await page.getByText('Message not sent').count()) === 1 && (await page.getByText(/Message sent/).count()) === 0);

// 10. Gallery lightbox keyboard + focus return
await open(page, '/facilities');
const first = page.locator('.masonry-item').first();
await first.focus(); await page.keyboard.press('Enter');
check('Lightbox opens from keyboard', await page.getByRole('dialog').isVisible());
await page.keyboard.press('ArrowRight');
check('Lightbox ArrowRight advances', (await page.locator('.lb-figure figcaption').innerText()).includes('2 /'));
await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
check('Lightbox focus is trapped inside dialog', await page.evaluate(() => document.querySelector('.lightbox').contains(document.activeElement)));
await page.keyboard.press('Escape');
check('Escape closes lightbox and returns focus', !(await page.getByRole('dialog').count()) && (await page.evaluate(() => document.activeElement?.className)).includes('masonry-item'));

// 11. Keyboard: skip link
await open(page, '/');
await page.keyboard.press('Tab');
check('Skip link is first focusable element', (await page.evaluate(() => document.activeElement?.textContent)) === 'Skip to content');
const focusStyle = await page.evaluate(() => { document.querySelector('.btn--primary').focus(); const s = getComputedStyle(document.activeElement); return s.outlineStyle + ' ' + s.outlineWidth; });
check('Focused controls have a visible outline', /solid 3px/.test(focusStyle), focusStyle);

// 12. Reduced motion
const rm = await browser.newContext({ viewport: { width: 1024, height: 800 }, reducedMotion: 'reduce' });
const rp = await rm.newPage();
await rp.goto(BASE + '/', { waitUntil: 'networkidle' });
check('Reduced motion: reveal content visible immediately and no marquee/hero animation', await rp.evaluate(() => [...document.querySelectorAll('.reveal')].every((e) => e.classList.contains('is-in')) && getComputedStyle(document.querySelector('.ticker-track')).animationName === 'none' || getComputedStyle(document.querySelector('.ticker-track')).animationDuration.startsWith('0.001')));
await rm.close();

// 13. Offline-ish resilience: blocked localStorage must not break booking page
const blocked = await browser.newContext({ viewport: { width: 1024, height: 800 } });
await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
const bp = await blocked.newPage();
const berr = []; bp.on('pageerror', (e) => berr.push(String(e)));
await bp.goto(BASE + '/schedule', { waitUntil: 'networkidle' });
check('Schedule renders with localStorage blocked (graceful failure)', (await bp.locator('h1').count()) === 1 && berr.length === 0, berr.join('|'));
await blocked.close();

writeFileSync(path.join(out, 'results.json'), JSON.stringify({ at: new Date().toISOString(), results }, null, 2));
await browser.close();
stop();
const failedChecks = results.filter((r) => !r.ok);
console.log(`\n${results.length - failedChecks.length}/${results.length} browser checks passed`);
process.exit(failedChecks.length ? 1 : 0);
