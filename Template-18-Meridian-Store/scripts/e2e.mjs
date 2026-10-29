// Real-browser end-to-end checks (Playwright + axe-core) against the production build served by `vite preview`.
// Usage: npm run build && npm run test:e2e   (set CHROMIUM_PATH if Chromium is not auto-detected)
// Writes screenshots, results.json and axe findings to ./e2e-output (git-ignored); `npm run review` turns screenshots into contact sheets.
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const PORT = 4183;
const BASE = `http://localhost:${PORT}`;
const out = path.resolve('e2e-output');
mkdirSync(out, { recursive: true });
const results = [];
const axeNotes = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: Boolean(ok), detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
process.on('exit', () => server.kill());
for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 250)); }

const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const axeSource = readFileSync(path.resolve('node_modules/axe-core/axe.min.js'), 'utf8');
const WIDTHS = [360, 390, 768, 1024, 1440];

const ROUTES = [
  ['home', '/'], ['shop', '/shop'], ['shop-filtered', '/shop?category=beauty&sort=price-asc'], ['collections', '/collections'], ['collection', '/collections/the-slow-home'],
  ['product-variants', '/products/merino-crew'], ['product-single', '/products/atelier-tote'], ['product-soldout', '/products/bud-vase'], ['product-comingsoon', '/products/weekender-duffel'],
  ['cart-empty', '/cart'], ['wishlist-empty', '/wishlist'], ['checkout-empty', '/checkout'], ['orders-empty', '/orders'],
  ['about', '/about'], ['journal', '/journal'], ['article', '/journal/the-slow-morning-table'], ['faq', '/faq'], ['contact', '/contact'], ['demo', '/demo'], ['legal', '/legal/privacy'], ['not-found', '/no-such-page']
];

async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); } window.scrollTo(0, 0); });
  await page.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
  await page.waitForTimeout(150);
}
const open = async (page, url) => { await page.goto(BASE + url, { waitUntil: 'networkidle' }); await settle(page); };

async function metrics(page) {
  return page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
    h1: document.querySelectorAll('h1').length,
    noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
    tiny: [...document.querySelectorAll('a,button,input:not([type=checkbox]):not([type=radio]),select,textarea,summary')].filter((e) => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && (b.height < 24 || b.width < 24) && !e.closest('.sr-only') && cs.position !== 'absolute' && cs.display !== 'inline'; }).map((e) => e.outerHTML.slice(0, 90)),
    clipped: [...document.querySelectorAll('h1,h2,h3,p,button,a,label')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.right > window.innerWidth + 1 && !e.closest('.stepper,[hidden]'); }).slice(0, 3).map((e) => e.outerHTML.slice(0, 90))
  }));
}

async function axe(page, label) {
  await page.evaluate(axeSource);
  const res = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help, sample: v.nodes[0]?.html.slice(0, 120) }));
  });
  const serious = res.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  res.filter((v) => v.impact !== 'critical' && v.impact !== 'serious').forEach((v) => axeNotes.push({ label, ...v }));
  check(`axe: no critical/serious violations — ${label}`, serious.length === 0, serious.map((v) => `${v.id}(${v.nodes}) ${v.sample}`).join('; '));
}

function watch(page, bucket) {
  page.on('console', (m) => { if (m.type() === 'error') bucket.errors.push(m.text()); });
  page.on('pageerror', (e) => bucket.errors.push(String(e)));
  page.on('requestfailed', (r) => bucket.failed.push(r.url()));
  page.on('response', (r) => { if (r.status() >= 400) bucket.failed.push(`${r.status()} ${r.url()}`); });
}

async function shot(page, name) { await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true }); }

async function guard(label, fn) { try { await fn(); } catch (e) { check(`${label} completed without an unexpected error`, false, String(e.message).split('\n')[0]); } }

// ═════ 1. every page × every breakpoint ═════
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  const bucket = { errors: [], failed: [] };
  watch(page, bucket);
  const problems = [];
  for (const [name, url] of ROUTES) {
    await open(page, url);
    const m = await metrics(page);
    if (m.overflow > 0) problems.push(`${name}: horizontal overflow ${m.overflow}px`);
    if (m.broken.length) problems.push(`${name}: broken images ${m.broken.slice(0, 2).join(',')}`);
    if (name !== 'not-found' && m.h1 !== 1) problems.push(`${name}: ${m.h1} h1 elements`);
    if (m.noAlt) problems.push(`${name}: ${m.noAlt} images without alt`);
    if (m.clipped.length) problems.push(`${name}: clipped ${m.clipped[0]}`);
    if (m.tiny.length) axeNotes.push({ label: `${w}px ${name}`, id: 'tap-target-24px', impact: 'info', nodes: m.tiny.length, help: 'interactive element smaller than 24px', sample: m.tiny[0] });
    await shot(page, `${w}-${name}`);
    if ([360, 768, 1440].includes(w) || ['home', 'product-variants', 'shop'].includes(name)) await axe(page, `${w}px ${name}`);
  }
  check(`layout @${w}px: ${ROUTES.length} pages — no overflow, broken images, bad headings or clipping`, problems.length === 0, problems.join(' | '));
  check(`console/network @${w}px: no errors or failed requests`, bucket.errors.length === 0 && bucket.failed.length === 0, [...bucket.errors, ...bucket.failed].slice(0, 3).join(' | '));
  await ctx.close();
}

// ═════ 2. complete purchasing journey at every breakpoint ═════
async function purchaseJourney(w) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  const bucket = { errors: [], failed: [] };
  watch(page, bucket);
  const issues = [];
  const audit = async (label) => { const m = await metrics(page); if (m.overflow > 0) issues.push(`${label}: overflow ${m.overflow}`); if (m.broken.length) issues.push(`${label}: broken images`); };

  await open(page, '/products/merino-crew');
  await page.getByRole('radio', { name: /Color Charcoal/ }).check({ force: true });
  await page.getByRole('radio', { name: /Size M$/ }).check({ force: true }).catch(async () => page.getByLabel('Size M').check({ force: true }));
  await page.getByRole('button', { name: 'Add to bag' }).click();
  const drawer = page.getByRole('dialog', { name: /Bag/ });
  await drawer.waitFor();
  await page.waitForTimeout(400);
  await audit('drawer'); await page.screenshot({ path: path.join(out, `${w}-flow-1-drawer.png`) }); await axe(page, `${w}px cart drawer`);
  await drawer.getByRole('link', { name: 'View bag' }).click();
  await page.waitForURL('**/cart'); await settle(page);
  await page.getByLabel('Promo code').fill('welcome10'); await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByText(/applied/).first().waitFor();
  await audit('cart'); await shot(page, `${w}-flow-2-cart`); await axe(page, `${w}px cart page (items+promo)`);
  await page.getByRole('button', { name: /Checkout/ }).click();
  await page.waitForURL('**/checkout'); await settle(page);
  await audit('checkout-1'); await shot(page, `${w}-flow-3-checkout-bag`);
  await page.getByRole('button', { name: 'Continue to details' }).click();
  await page.getByRole('button', { name: 'Continue to delivery' }).click();
  await page.getByText('Please fix the following:').waitFor();
  await audit('checkout-errors'); await shot(page, `${w}-flow-4-checkout-errors`); await axe(page, `${w}px checkout validation errors`);
  await page.getByLabel('Email').fill('alex@example.com'); await page.getByLabel('First name').fill('Alex'); await page.getByLabel('Last name').fill('Sample');
  await page.getByLabel('Address', { exact: true }).fill('12 Sample Street'); await page.getByLabel('City').fill('Portland'); await page.getByLabel('State').fill('OR'); await page.getByLabel('Postal code').fill('97205');
  await audit('checkout-details'); await shot(page, `${w}-flow-5-checkout-details`);
  await page.getByRole('button', { name: 'Continue to delivery' }).click();
  await page.getByRole('heading', { name: 'Choose a delivery method' }).waitFor();
  await audit('checkout-delivery'); await shot(page, `${w}-flow-6-checkout-delivery`); await axe(page, `${w}px checkout delivery`);
  await page.getByRole('button', { name: 'Continue to review' }).click();
  await page.getByRole('heading', { name: /Review and confirm/ }).waitFor();
  await page.getByRole('checkbox', { name: /I understand/ }).check();
  await audit('checkout-review'); await shot(page, `${w}-flow-7-checkout-review`); await axe(page, `${w}px checkout review`);
  await page.getByRole('button', { name: 'Confirm DEMO order' }).click();
  await page.getByRole('heading', { name: 'Your DEMO order summary' }).waitFor(); await settle(page);
  await audit('order'); await shot(page, `${w}-flow-8-order-confirmation`); await axe(page, `${w}px order confirmation`);
  await open(page, '/orders'); await audit('orders'); await shot(page, `${w}-flow-9-order-history`); await axe(page, `${w}px order history`);
  // wishlist with items
  await open(page, '/shop');
  await page.getByRole('button', { name: /Add .* to wishlist/ }).first().click();
  await page.getByRole('button', { name: /Add .* to wishlist/ }).nth(2).click();
  await open(page, '/wishlist'); await audit('wishlist'); await shot(page, `${w}-flow-10-wishlist`); await axe(page, `${w}px wishlist`);
  check(`purchase journey @${w}px: cart → promo → checkout validation → delivery → confirm → history → wishlist`, issues.length === 0 && bucket.errors.length === 0 && bucket.failed.length === 0, [...issues, ...bucket.errors, ...bucket.failed].slice(0, 4).join(' | '));
  await ctx.close();
}
for (const w of WIDTHS) await guard(`purchase journey @${w}px`, () => purchaseJourney(w));

// ═════ 3. behaviour checks (desktop) ═════
await guard('desktop behaviour checks', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const bucket = { errors: [], failed: [] };
  watch(page, bucket);
  const stored = (key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), key);

  // filtering, search, sorting, URL deep links
  await open(page, '/shop');
  const count = async () => Number((await page.locator('.results-count').innerText()).split(' ')[0]);
  const total = await count();
  check('shop lists at least 30 products', total >= 30, `${total}`);
  await page.getByLabel('Search products').first().fill('linen');
  await page.waitForTimeout(150);
  const linen = await count();
  check('search narrows results and updates the URL', linen > 0 && linen < total && page.url().includes('q=linen'), `${linen} results`);
  await page.getByLabel('Search products').first().fill('');
  await page.locator('aside').getByRole('checkbox', { name: /Homeware/ }).check();
  await page.locator('aside').getByRole('checkbox', { name: /In stock only/ }).check();
  await page.locator('aside').getByRole('button', { name: '$50 – $150' }).click();
  await page.waitForTimeout(150);
  const multi = await count();
  const chips = await page.locator('.chips .chip').count();
  check('multiple simultaneous filters with active chips', multi > 0 && multi < total && chips >= 3, `${multi} results, ${chips} chips`);
  await page.getByRole('button', { name: /Remove filter: Homeware/ }).click();
  await page.waitForTimeout(100);
  check('removing a chip updates results', (await count()) >= multi);
  await page.getByRole('button', { name: 'Reset all' }).first().click();
  check('reset restores the full catalogue', (await count()) === total);
  await page.getByLabel('Sort by').selectOption('price-asc');
  const prices = await page.$$eval('.product-grid .price .price-now', (els) => els.map((e) => Number(e.textContent.replace(/[^0-9.]/g, ''))));
  check('sort by price ascending is ordered', prices.every((p, i) => i === 0 || p >= prices[i - 1]), prices.slice(0, 6).join(','));
  await page.getByLabel('Sort by').selectOption('name-asc');
  const names = await page.$$eval('.card-title', (els) => els.map((e) => e.textContent));
  check('sort by name A–Z is ordered', names.every((n, i) => i === 0 || n.localeCompare(names[i - 1]) >= 0));
  await open(page, '/shop?q=qqqqqq');
  check('helpful empty state for no results', await page.getByRole('heading', { name: 'No products match your filters' }).isVisible());
  await open(page, '/shop?category=beauty&min=50&max=100&stock=1');
  const deep = await count();
  check('filtered deep link restores state from the URL', deep > 0 && deep < total && (await page.getByLabel('Minimum ($)').first().inputValue()) === '50', `${deep}`);

  // variants & stock on the product page
  await open(page, '/products/stoneware-vase');
  const priceText = () => page.locator('.price-lg .price-now').innerText();
  const before = await priceText();
  await page.getByRole('radio', { name: /Size Large/ }).check({ force: true });
  const after = await priceText();
  check('variant selection updates price', before === '$98' && after === '$138', `${before} → ${after}`);
  const img1 = await page.locator('.gallery-main img').getAttribute('alt');
  await page.getByRole('radio', { name: /Color Clay/ }).check({ force: true });
  const img2 = await page.locator('.gallery-main img').getAttribute('alt');
  check('variant selection updates the product image', img1.includes('Chalk') && img2.includes('Clay'), `${img1} → ${img2}`);
  await open(page, '/products/slim-cardholder');
  await page.getByRole('radio', { name: /Color Sand/ }).check({ force: true });
  check('zero-stock variant shows a sold-out message and a disabled button', (await page.getByText(/Sold out \(demonstration inventory\)/).isVisible()) && (await page.getByRole('button', { name: 'Sold out' }).isDisabled()));
  await open(page, '/products/atelier-tote');
  await page.getByRole('radio', { name: /Color Ink/ }).check({ force: true });
  check('low stock message', await page.getByText(/Only 3 left/).isVisible());
  const plus = page.getByRole('button', { name: /Increase quantity/ });
  await plus.click(); await plus.click();
  check('quantity cannot exceed stock', (await plus.isDisabled()) && (await page.getByRole('textbox', { name: /Quantity/ }).inputValue()) === '3');

  // gallery viewer + keyboard
  await page.getByRole('button', { name: /full screen/ }).click();
  const viewer = page.getByRole('dialog', { name: 'Product image viewer' });
  await viewer.waitFor();
  await page.keyboard.press('ArrowRight');
  check('lightbox keyboard navigation', await viewer.getByText(/Image 2 of/).isVisible());
  await page.keyboard.press('Escape');
  check('lightbox closes with Escape and returns focus', (await viewer.count()) === 0 && (await page.evaluate(() => document.activeElement?.className?.includes('gallery-open'))));

  // add to cart, drawer a11y, persistence
  await page.getByRole('button', { name: 'Add to bag' }).click();
  const drawer = page.getByRole('dialog', { name: /Bag/ });
  await drawer.waitFor();
  check('add to bag opens the slide-out cart with the line item', await drawer.getByText('Atelier Leather Tote').isVisible());
  check('cart change is announced to assistive tech (live region)', (await page.locator('.toast[role=status]').innerText()).includes('Added 3'));
  await page.waitForTimeout(100);
  const focusInside = await page.evaluate(() => document.querySelector('[role=dialog]').contains(document.activeElement));
  check('focus moves into the cart drawer', focusInside);
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  check('focus stays trapped inside the cart drawer', await page.evaluate(() => document.querySelector('[role=dialog]').contains(document.activeElement)));
  await page.keyboard.press('Escape');
  check('Escape closes the drawer and restores focus to the trigger', (await drawer.count()) === 0 && (await page.evaluate(() => document.activeElement?.getAttribute('aria-label')?.startsWith('Add') || document.activeElement?.textContent?.includes('Add to bag'))));
  const cartStored = await stored('meridian-store:cart:v1');
  check('cart persisted to localStorage', cartStored?.lines?.[0]?.qty === 3, JSON.stringify(cartStored));
  await page.reload({ waitUntil: 'networkidle' });
  check('cart survives a reload (header count)', (await page.getByRole('button', { name: /Bag, 3 items/ }).count()) === 1);

  // cart page operations
  await open(page, '/cart');
  const inputQty = page.getByRole('textbox', { name: /Quantity/ });
  await inputQty.fill('99'); await inputQty.blur();
  check('excessive typed quantity is clamped to stock', (await inputQty.inputValue()) === '3');
  await page.getByRole('button', { name: /Decrease quantity/ }).click();
  check('quantity decrease updates line total', (await page.locator('.cart-line-total').first().innerText()) === '$570.00', await page.locator('.cart-line-total').first().innerText());
  await page.getByLabel('Promo code').fill('nonsense'); await page.getByRole('button', { name: 'Apply' }).click();
  check('invalid coupon shows an error and is not applied', (await page.getByText(/not a valid promo code/).first().isVisible()) && !(await stored('meridian-store:cart:v1')).promoCode);
  await page.getByLabel('Promo code').fill('MERIDIAN25'); await page.getByRole('button', { name: 'Apply' }).click();
  const sum = await page.locator('.cart-summary .totals').innerText();
  // subtotal 570.00, 25% = 142.50 capped at 120.00 → discount 120.00; subtotal after 450.00 → free shipping; tax 6% of 450 = 27.00; total 477.00
  check('coupon cap, free shipping and tax produce the exact total', /−\$120\.00/.test(sum) && /Free/.test(sum) && /\$27\.00/.test(sum) && /\$477\.00/.test(sum), sum.replace(/\s+/g, ' '));
  await page.getByLabel('Estimate shipping to').selectOption('GB');
  const gb = await page.locator('.cart-summary .totals').innerText();
  check('destination changes tax treatment (inclusive VAT)', /included/.test(gb), gb.replace(/\s+/g, ' '));
  await page.getByRole('button', { name: 'Clear bag' }).click();
  await page.getByRole('button', { name: 'Yes, clear bag' }).click();
  check('clear bag empties the cart and shows the empty state', await page.getByRole('heading', { name: 'Your bag is empty', level: 2 }).isVisible() && (await stored('meridian-store:cart:v1')).lines.length === 0);

  // wishlist persistence
  await open(page, '/shop');
  await page.getByRole('button', { name: 'Add Atelier Leather Tote to wishlist' }).click();
  await page.reload({ waitUntil: 'networkidle' });
  check('wishlist survives a reload', await page.getByRole('button', { name: 'Remove Atelier Leather Tote from wishlist' }).getAttribute('aria-pressed') === 'true');

  // corrupt storage recovery
  await page.evaluate(() => { localStorage.setItem('meridian-store:cart:v1', '{{broken'); localStorage.setItem('meridian-store:orders:v1', 'nope'); localStorage.setItem('meridian-store:wishlist:v1', '[1,2'); });
  await page.reload({ waitUntil: 'networkidle' });
  check('corrupt localStorage does not break the app', (await page.locator('h1').count()) === 1);
  await open(page, '/orders');
  check('orders empty state after corrupt data', await page.getByRole('heading', { name: 'No demo orders yet' }).isVisible());

  // header: search overlay + mega menu
  await open(page, '/');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByLabel('Search products').fill('vase');
  await page.waitForTimeout(150);
  check('search overlay shows live suggestions', (await page.locator('.search-results li').count()) > 0);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Shop menu' }).click();
  check('mega menu opens from the caret button', await page.locator('.mega').getByRole('link', { name: 'Furniture & lighting', exact: true }).isVisible());
  await page.keyboard.press('Escape');
  check('mega menu closes with Escape', !(await page.locator('.mega').getByRole('link', { name: 'Furniture & lighting', exact: true }).isVisible()));
  await page.locator('.primary-nav').getByRole('link', { name: 'Collections', exact: true }).hover();
  await page.waitForTimeout(250);
  check('mega menu opens on hover', await page.locator('.mega').getByRole('link', { name: 'Light & Form', exact: true }).isVisible());
  await page.screenshot({ path: path.join(out, '1440-mega-menu.png') });

  // missing image fallback
  const ctx2 = await browser.newContext({ viewport: { width: 1024, height: 800 } });
  const p2 = await ctx2.newPage();
  await p2.route('**/images/products/atelier-tote-cognac.webp', (r) => r.abort());
  await p2.goto(BASE + '/products/atelier-tote', { waitUntil: 'networkidle' });
  check('missing product image falls back to a labelled placeholder', (await p2.locator('.img-fallback[role=img]').count()) > 0);
  await ctx2.close();

  // 404 for direct deep link
  const res = await page.goto(BASE + '/products/nope-nope', { waitUntil: 'networkidle' });
  check('unknown deep link serves the SPA with a custom 404', res.status() === 200 && (await page.getByRole('heading', { name: /couldn’t find that page/ }).isVisible()));

  // robots + sitemap
  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  check('robots.txt and sitemap.xml are generated', /Sitemap:/.test(robots) && /<loc>.*\/products\/atelier-tote<\/loc>/.test(sitemap), `${(sitemap.match(/<loc>/g) || []).length} urls`);
  await open(page, '/products/atelier-tote');
  const seo = await page.evaluate(() => ({ title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href, og: document.querySelector('meta[property="og:title"]')?.content, desc: document.querySelector('meta[name=description]')?.content, ld: JSON.parse(document.querySelector('script[data-seo-jsonld]')?.textContent || 'null') }));
  check('per-page SEO: title, canonical, Open Graph, product JSON-LD', seo.title.startsWith('Atelier Leather Tote') && seo.canonical?.endsWith('/products/atelier-tote') && seo.og && seo.desc.length > 40 && seo.ld?.['@type'] === 'Product' && seo.ld.offers.lowPrice === '285.00', JSON.stringify({ t: seo.title, c: seo.canonical }));
  check('console/network clean during behaviour checks', bucket.errors.length === 0 && bucket.failed.length === 0, [...bucket.errors, ...bucket.failed].slice(0, 3).join(' | '));
  await ctx.close();
});

// ═════ 4. mobile-specific behaviour ═════
await guard('mobile behaviour checks', async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true });
  const page = await ctx.newPage();
  await open(page, '/shop');
  await page.getByRole('button', { name: /^Filters/ }).click();
  const dlg = page.getByRole('dialog', { name: 'Filters' });
  await dlg.waitFor();
  await dlg.getByRole('checkbox', { name: /Apparel/ }).check();
  await page.waitForTimeout(150);
  check('mobile filter drawer applies filters live', (await dlg.getByRole('button', { name: /Show \d+ products/ }).count()) === 1);
  await page.screenshot({ path: path.join(out, '390-filter-drawer.png') });
  await axe(page, '390px filter drawer');
  await dlg.getByRole('button', { name: /Show/ }).click();
  check('mobile filter drawer closes and keeps the filter', (await page.getByRole('dialog').count()) === 0 && page.url().includes('category=apparel'));
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await menu.getByRole('button', { name: 'Shop' }).click();
  check('mobile menu expands mega-menu sections', await menu.getByRole('link', { name: 'Apparel' }).isVisible());
  await page.screenshot({ path: path.join(out, '390-mobile-menu.png') });
  await axe(page, '390px mobile menu');
  await page.keyboard.press('Escape');
  await ctx.close();
});

// ═════ 5. reduced motion ═════
await guard('reduced-motion check', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await open(page, '/');
  const dur = await page.evaluate(() => getComputedStyle(document.querySelector('.btn')).transitionDuration);
  check('prefers-reduced-motion shortens transitions', parseFloat(dur) < 0.01, dur);
  await ctx.close();
});

await browser.close();
server.kill();
const failed = results.filter((r) => !r.ok);
writeFileSync(path.join(out, 'results.json'), JSON.stringify({ passed: results.length - failed.length, failed: failed.length, results, axeNotes }, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} checks passed. ${axeNotes.length} non-blocking notes in e2e-output/results.json.`);
process.exit(failed.length ? 1 : 0);
