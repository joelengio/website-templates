/**
 * Captures labelled desktop (1440) and mobile (390) screenshots of every page and reservation step,
 * then assembles contact sheets in review/ (ImageMagick `montage` required).
 * Usage: npm run build && npm run preview (in another shell), then `npm run review`.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Page } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'review');
const raw = join(root, 'review-tmp');
const base = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

const pages: [string, string][] = [
  ['home', '/'], ['menus', '/menus'], ['reserve', '/reserve'], ['experiences', '/experiences'], ['experience-detail', '/experiences/chef-tasting-menu'],
  ['private-dining', '/private-dining'], ['our-story', '/our-story'], ['gallery', '/gallery'], ['journal', '/journal'],
  ['article', '/journal/why-we-cook-with-saffron'], ['contact', '/contact'], ['order', '/order'], ['404', '/nope'],
];

async function settle(page: Page, full: boolean) {
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important;transition:none!important}.hero__img{animation:none!important}' });
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  void full;
  await page.waitForTimeout(250);
}

async function reservationSteps(page: Page, prefix: string) {
  await page.goto(`${base}/reserve`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  const shot = async (n: string) => { await settle(page, false); await page.screenshot({ path: join(raw, `${prefix}-res-${n}.png`), fullPage: true }); };
  await shot('1-date');
  await page.locator('.calendar__day[aria-disabled="false"]').last().click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await shot('2-party');
  await page.getByRole('button', { name: 'Continue' }).click();
  await shot('3-time');
  await page.locator('.slot:not([disabled])').first().click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await shot('4-details-errors');
  await page.getByLabel(/Full name/).fill('Ada Lovelace');
  await page.getByLabel(/^Email/).fill('ada@example.com');
  await page.getByLabel(/^Phone/).fill('+1 555 010 2000');
  await page.getByRole('button', { name: 'Continue' }).click();
  await shot('5-review');
  await page.getByLabel(/I understand this is a simulated reservation/).check();
  await page.getByRole('button', { name: 'Confirm demo reservation' }).click();
  await shot('6-confirmed');
  await page.goto(`${base}/reserve/manage`, { waitUntil: 'networkidle' });
  await shot('7-manage');
}

function sheet(files: string[], outFile: string, cols: number, tile: string) {
  execFileSync('montage', [...files, '-tile', `${cols}x`, '-geometry', `${tile}+10+10`, '-background', '#16100c', '-fill', '#f4ead8', '-pointsize', '18', '-label', '%t', outFile]);
}

mkdirSync(out, { recursive: true });
rmSync(raw, { recursive: true, force: true });
mkdirSync(raw, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
for (const [prefix, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]] as const) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await settle(page, true);
    // Cap very tall pages so the sheet stays legible; the first screens carry the design review.
    await page.screenshot({ path: join(raw, `${prefix}-${name}.png`), fullPage: true });
  }
  await reservationSteps(page, prefix);
  await ctx.close();
}
await browser.close();

// Crop tall pages to a reviewable height, label, then assemble sheets.
const cropH = { desktop: 2600, mobile: 3200 } as const;
for (const f of readdirSync(raw)) {
  const prefix = f.startsWith('desktop') ? 'desktop' : 'mobile';
  const label = f.replace('.png', '');
  execFileSync('convert', [join(raw, f), '-crop', `x${cropH[prefix]}+0+0`, '+repage', '-gravity', 'North', '-background', '#2e2219', '-fill', '#d1a247', '-pointsize', '28', '-splice', '0x44', '-annotate', '+0+8', label, join(raw, `l-${f}`)]);
}
const labelled = (p: string, pat: RegExp) => readdirSync(raw).filter((f) => f.startsWith(`l-${p}`) && pat.test(f)).sort().map((f) => join(raw, f));
const reorder = (list: string[]) => list;
sheet(reorder(labelled('desktop', /^(?!.*-res-)/)), join(out, 'contact-sheet-desktop-pages.jpg'), 4, '540x1000>');
sheet(reorder(labelled('desktop', /-res-/)), join(out, 'contact-sheet-desktop-reservation.jpg'), 4, '540x1000>');
sheet(reorder(labelled('mobile', /^(?!.*-res-)/)), join(out, 'contact-sheet-mobile-pages.jpg'), 7, '260x1100>');
sheet(reorder(labelled('mobile', /-res-/)), join(out, 'contact-sheet-mobile-reservation.jpg'), 7, '260x1100>');
rmSync(raw, { recursive: true, force: true });
console.log('Contact sheets written to review/');
