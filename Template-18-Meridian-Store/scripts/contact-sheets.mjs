// Builds labelled screenshot contact sheets (JPEG) in ./review from the screenshots written by `npm run test:e2e`.
// Usage: npm run test:e2e && npm run review
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const shots = path.resolve('e2e-output');
const out = path.resolve('review');
mkdirSync(out, { recursive: true });
const files = readdirSync(shots).filter((f) => f.endsWith('.png'));

const NICE = {
  home: 'Home', shop: 'Shop', 'shop-filtered': 'Shop · filtered (beauty, price ↑)', collections: 'Collections', collection: 'Collection page', 'product-variants': 'Product · variants', 'product-single': 'Product · single option',
  'product-soldout': 'Product · sold out', 'product-comingsoon': 'Product · coming soon', 'cart-empty': 'Bag · empty', 'wishlist-empty': 'Wishlist · empty', 'checkout-empty': 'Checkout · empty bag', 'orders-empty': 'Order history · empty',
  about: 'About', journal: 'Journal', article: 'Journal article', faq: 'FAQ / support', contact: 'Contact', demo: 'About this demo', legal: 'Privacy & storage', 'not-found': '404',
  'flow-1-drawer': 'Slide-out bag', 'flow-2-cart': 'Bag page + promo', 'flow-3-checkout-bag': 'Checkout 1 · bag', 'flow-4-checkout-errors': 'Checkout 2 · validation errors', 'flow-5-checkout-details': 'Checkout 2 · details',
  'flow-6-checkout-delivery': 'Checkout 3 · delivery', 'flow-7-checkout-review': 'Checkout 4 · review', 'flow-8-order-confirmation': 'Demo order summary', 'flow-9-order-history': 'Order history', 'flow-10-wishlist': 'Wishlist',
  'filter-drawer': 'Filter drawer', 'mobile-menu': 'Mobile menu', 'mega-menu': 'Mega menu'
};
const WIDTHS = [1440, 1024, 768, 390, 360];
const sheets = [];
for (const w of WIDTHS) {
  const pages = files.filter((f) => f.startsWith(`${w}-`) && !f.includes('-flow-') && !f.includes('-filter-') && !f.includes('-mobile-') && !f.includes('-mega-'));
  const flow = files.filter((f) => f.startsWith(`${w}-flow-`));
  const extra = files.filter((f) => f.startsWith(`${w}-filter-`) || f.startsWith(`${w}-mobile-`) || f.startsWith(`${w}-mega-`));
  if (pages.length) sheets.push({ file: `contact-sheet-${w}px-pages.jpg`, title: `MERIDIAN STORE — Template 18 — ${w}px — all pages`, items: pages, w });
  if (flow.length || extra.length) sheets.push({ file: `contact-sheet-${w}px-purchase-flow.jpg`, title: `MERIDIAN STORE — Template 18 — ${w}px — purchase flow (bag → checkout → demo order → history → wishlist)`, items: [...flow, ...extra], w });
}
const keys = Object.keys(NICE);
const order = (f) => keys.indexOf(f.replace(/^\d+-/, '').replace('.png', ''));

const browser = await chromium.launch({ executablePath: [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p)), args: ['--no-sandbox'] });
for (const s of sheets) {
  const cols = s.w >= 1024 ? 4 : s.w >= 768 ? 4 : 6;
  const cellW = s.w >= 1024 ? 330 : s.w >= 768 ? 250 : 200;
  const cropH = s.w >= 1024 ? 230 : s.w >= 768 ? 330 : 380;
  const items = [...s.items].sort((a, b) => order(a) - order(b));
  const cells = items.map((f) => {
    const key = f.replace(/^\d+-/, '').replace('.png', '');
    return `<figure><div class="crop"><img src="${f}"></div><figcaption>${NICE[key] ?? key}</figcaption></figure>`;
  }).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#2b2724;font:12px/1.3 system-ui,sans-serif;color:#f3ede2;padding:16px;width:${cols * (cellW + 12) + 20}px}
    h1{font:600 16px system-ui;margin:0 0 4px}p{margin:0 0 14px;color:#cfc6b8}
    .grid{display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:12px}
    figure{margin:0}.crop{width:${cellW}px;height:${cropH}px;overflow:hidden;background:#faf7f2;border:1px solid #5a534b}
    img{width:${cellW}px;display:block}figcaption{padding:5px 2px;font-weight:600}
  </style><h1>${s.title}</h1><p>Top of each page captured from the E2E run (full-page screenshots are in e2e-output/). Viewport width ${s.w}px.</p><div class="grid">${cells}</div>`;
  const htmlPath = path.join(shots, `sheet-${s.w}.html`);
  writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: cols * (cellW + 12) + 40, height: 800 } });
  await page.goto('file://' + htmlPath);
  await page.waitForLoadState('load');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, s.file), fullPage: true, type: 'jpeg', quality: 78 });
  await page.close();
  console.log('wrote review/' + s.file);
}
await browser.close();
