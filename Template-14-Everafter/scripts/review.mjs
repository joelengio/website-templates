// Builds labelled desktop and mobile screenshot contact sheets in ./review for visual inspection.
// Usage: npm run build && npm run review
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { launch, open, routesFromConfig, startServer } from './lib.mjs';

const { base, stop } = await startServer(4183);
const browser = await launch();
const outDir = path.resolve('review');
mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) if (f.endsWith('.jpg')) rmSync(path.join(outDir, f));
const tmp = mkdtempSync(path.join(tmpdir(), 'everafter-review-'));

const allRoutes = await routesFromConfig();
// One representative of every dynamic family keeps the sheets legible; e2e covers every route.
const pick = (prefix) => allRoutes.filter((r) => r.startsWith(prefix)).slice(0, 2);
const routes = [
  '/', '/weddings', ...pick('/weddings/'), '/services', ...pick('/services/'), '/packages', '/destinations', ...pick('/destinations/'),
  '/about', '/journal', ...pick('/journal/'), '/plan', '/contact', '/demo-notice', '/this-page-does-not-exist'
];

const profiles = [
  { name: 'desktop', width: 1440, height: 900, crop: 2300, tile: 560, cols: 3, rows: 2 },
  { name: 'mobile', width: 390, height: 844, crop: 2600, tile: 270, cols: 6, rows: 1 }
];

async function sheet(name, items, cols, tile) {
  const html = `<body style="margin:0;background:#1d1013;font-family:Arial,sans-serif"><div style="display:grid;grid-template-columns:repeat(${cols},${tile}px);gap:14px;padding:14px;width:max-content">${items
    .map((i) => `<figure style="margin:0;background:#fff"><figcaption style="background:#5e1f2e;color:#fff;font:600 13px/1.3 Arial;padding:7px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.label}</figcaption><img src="file://${i.file}" style="display:block;width:${tile}px"></figure>`)
    .join('')}</div></body>`;
  const f = path.join(tmp, `${name}.html`);
  writeFileSync(f, html);
  const p = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await p.goto('file://' + f);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(outDir, `${name}.jpg`), fullPage: true, type: 'jpeg', quality: 62 });
  await p.close();
  console.log('wrote', `review/${name}.jpg`);
}

for (const prof of profiles) {
  const ctx = await browser.newContext({ viewport: { width: prof.width, height: prof.height }, hasTouch: prof.name === 'mobile' });
  const page = await ctx.newPage();
  const items = [];
  const grab = async (label, id) => {
    const file = path.join(tmp, `${prof.name}-${id}.png`);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: prof.width, height: Math.min(h, prof.crop) }, fullPage: true });
    items.push({ label: `${prof.name} ${prof.width}px — ${label}`, file });
  };
  let n = 0;
  for (const r of routes) {
    await open(page, base, r);
    await grab(r, `r${n++}`);
  }
  // Significant states
  await open(page, base, '/weddings/villa-serena-lake-como');
  await page.locator('.mosaic__item button').nth(1).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(tmp, `${prof.name}-lb.png`) });
  items.push({ label: `${prof.name} — lightbox open (wedding gallery)`, file: path.join(tmp, `${prof.name}-lb.png`) });
  await page.keyboard.press('Escape');

  await open(page, base, '/weddings?location=Italy&style=Coastal+Elegance&type=Elopement');
  await grab('weddings — filters with empty state', 's-empty');

  await open(page, base, '/packages?x=1');
  await page.getByLabel(/Floral installation/).check();
  await page.locator('.estimate').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(tmp, `${prof.name}-est.png`) });
  items.push({ label: `${prof.name} — packages add-ons and estimate`, file: path.join(tmp, `${prof.name}-est.png`) });

  await open(page, base, '/plan');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(tmp, `${prof.name}-err.png`) });
  items.push({ label: `${prof.name} — questionnaire validation error`, file: path.join(tmp, `${prof.name}-err.png`) });
  await page.getByRole('radio', { name: /^Wedding/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: 'We have a season' }).check();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(tmp, `${prof.name}-cond.png`) });
  items.push({ label: `${prof.name} — questionnaire conditional date step`, file: path.join(tmp, `${prof.name}-cond.png`) });

  // Fast-forward to the review + completion screens
  await page.getByLabel('Season', { exact: true }).selectOption('summer');
  const years = await page.getByLabel('Year', { exact: true }).locator('option').allInnerTexts();
  await page.getByLabel('Year', { exact: true }).selectOption(years[1]);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: /Tuscany/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Estimated number of guests').fill('90');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('checkbox', { name: /Rustic heritage/ }).check();
  await page.getByRole('checkbox', { name: /Romantic garden/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('checkbox', { name: /Full planning/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: /\$25,000/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Your name').fill('Alex Rowe');
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(300);
  await grab('questionnaire — review step', 's-review');
  await page.getByRole('checkbox', { name: /I understand this enquiry is a demonstration/ }).check();
  await page.getByRole('button', { name: 'Complete preview' }).click();
  await page.getByRole('heading', { name: /nothing was sent/ }).waitFor();
  await page.waitForTimeout(300);
  await grab('questionnaire — demonstration completion screen', 's-done');

  if (prof.name === 'mobile') {
    await open(page, base, '/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(tmp, 'mobile-menu.png') });
    items.push({ label: 'mobile — navigation menu open', file: path.join(tmp, 'mobile-menu.png') });
  }
  await ctx.close();

  const per = prof.cols * prof.rows;
  for (let i = 0; i * per < items.length; i++) await sheet(`${prof.name}-contact-sheet-${i + 1}`, items.slice(i * per, (i + 1) * per), prof.cols, prof.tile);
}

await browser.close();
stop();
rmSync(tmp, { recursive: true, force: true });
