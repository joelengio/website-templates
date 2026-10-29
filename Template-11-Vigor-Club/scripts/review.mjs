// Visual QA: captures every route at the five review widths and assembles labelled contact sheets in ./review.
// Usage: npm run build && npm run review   (set CHROMIUM_PATH if Chromium is not auto-detected)
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const PORT = 4180;
const BASE = `http://localhost:${PORT}`;
const shots = path.resolve('e2e-output/review-shots');
const out = path.resolve('review');
rmSync(shots, { recursive: true, force: true });
mkdirSync(shots, { recursive: true });
mkdirSync(out, { recursive: true });

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
process.on('exit', () => server.kill());
for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 200)); }

const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const routes = [
  ['/', 'Home'], ['/programs', 'Programs'], ['/programs/boxing-fitness', 'Program detail'], ['/schedule', 'Schedule'], ['/trainers', 'Trainers'],
  ['/trainers/maya-okafor', 'Trainer detail'], ['/membership', 'Membership'], ['/facilities', 'Facilities'], ['/about', 'About'],
  ['/journal', 'Journal'], ['/journal/how-to-start-strength-training', 'Article'], ['/contact', 'Contact'], ['/nope', '404']
];
const widths = [360, 390, 768, 1024, 1440];
const file = (r, w) => `${r === '/' ? 'home' : r.slice(1).replace(/\//g, '_')}-${w}.jpg`;

async function settle(page) {
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 200)); } window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 500)); });
  await page.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
}

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  for (const [r] of routes) {
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    await settle(page);
    await page.screenshot({ path: path.join(shots, file(r, w)), fullPage: true, type: 'jpeg', quality: 74 });
  }
  await ctx.close();
  console.log('captured width', w);
}

// interaction states (390 mobile + 1440 desktop)
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => { const st = document.createElement('style'); st.textContent = 'html{scroll-behavior:auto!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  const snap = async (name) => p.screenshot({ path: path.join(shots, `ix-${name}.jpg`), type: 'jpeg', quality: 78 });
  await p.goto(BASE + '/'); await p.getByRole('button', { name: 'Open menu' }).click(); await snap('mobile-menu');
  await p.goto(BASE + '/schedule?day=2&class=wed-1730-box', { waitUntil: 'networkidle' }); await snap('class-modal');
  await p.getByRole('dialog').getByLabel(/full name/i).fill('Riley Morgan'); await p.getByRole('dialog').getByLabel(/email/i).fill('riley@example.com');
  await p.getByRole('button', { name: /confirm demo reservation/i }).click(); await p.getByText('Demo reservation saved').waitFor(); await snap('booking-confirmed');
  await p.goto(BASE + '/membership', { waitUntil: 'networkidle' }); await p.getByRole('radiogroup', { name: 'Billing period' }).getByRole('radio', { name: /Annual/ }).click();
  await p.locator('.plan-grid').scrollIntoViewIfNeeded(); await snap('pricing-annual');
  await p.locator('.table-wrap').scrollIntoViewIfNeeded(); await snap('comparison-table');
  await p.goto(BASE + '/facilities', { waitUntil: 'networkidle' }); await p.locator('.masonry-item').first().click(); await snap('lightbox');
  await p.goto(BASE + '/contact', { waitUntil: 'networkidle' }); await p.getByRole('button', { name: /validate message/i }).click(); await snap('form-errors');
  await ctx.close();
}

// ---- contact sheets ----
const sheetPage = await (await browser.newContext({ viewport: { width: 1800, height: 1000 } })).newPage();
const b64 = (f) => 'data:image/jpeg;base64,' + readFileSync(path.join(shots, f)).toString('base64');
async function sheet(name, title, cells, { cellW, cols, maxH }) {
  const html = `<style>body{margin:0;background:#101214;color:#f1ede4;font:600 15px system-ui}h1{font:800 26px system-ui;margin:0;padding:18px 20px;background:#0c0d0e;border-bottom:3px solid #c8ff2e}
  .g{display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:18px;padding:20px;align-items:start}.c{width:${cellW}px}.l{padding:6px 2px;color:#c8ff2e;font-size:13px}.l small{color:#a9aeb4;font-weight:500}
  .f{width:${cellW}px;max-height:${maxH}px;overflow:hidden;border:1px solid #333;position:relative}.f img{width:100%;display:block}.f.cut::after{content:'… page continues';position:absolute;inset:auto 0 0 0;text-align:center;font-size:12px;padding:20px 0 6px;background:linear-gradient(transparent,#000)}</style>
  <h1>${title}</h1><div class="g">${cells.map((c) => `<div class="c"><div class="l">${c.label} <small>${c.sub}</small></div><div class="f ${c.cut ? 'cut' : ''}"><img src="${b64(c.file)}"></div></div>`).join('')}</div>`;
  await sheetPage.setViewportSize({ width: cols * (cellW + 18) + 40, height: 800 });
  await sheetPage.setContent(html, { waitUntil: 'load' });
  await sheetPage.screenshot({ path: path.join(out, name), fullPage: true, type: 'jpeg', quality: 80 });
  console.log('sheet', name);
}
const dim = async (f) => { const { width, height } = await sheetPage.evaluate(async (src) => { const i = new Image(); i.src = src; await i.decode(); return { width: i.naturalWidth, height: i.naturalHeight }; }, b64(f)); return { width, height }; };
const cellsFor = async (w, cellW, maxH) => Promise.all(routes.map(async ([r, label]) => { const f = file(r, w); const d = await dim(f); return { label, sub: `${w}px · ${r}`, file: f, cut: d.height * (cellW / d.width) > maxH }; }));
const chunk = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

const d = await cellsFor(1440, 400, 2600);
for (const [i, part] of chunk(d, 6).entries()) await sheet(`desktop-1440-sheet-${i + 1}.jpg`, `VIGOR CLUB — desktop 1440px (${i + 1}/${chunk(d, 6).length})`, part, { cellW: 400, cols: 3, maxH: 2600 });
const t = [...(await cellsFor(1024, 300, 2200)), ...(await cellsFor(768, 300, 2200))];
for (const [i, part] of chunk(t, 13).entries()) await sheet(`tablet-1024-768-sheet-${i + 1}.jpg`, `VIGOR CLUB — tablet ${i === 0 ? '1024px' : '768px'}`, part, { cellW: 300, cols: 5, maxH: 2200 });
for (const w of [390, 360]) {
  const m = await cellsFor(w, 230, 2400);
  for (const [i, part] of chunk(m, 7).entries()) await sheet(`mobile-${w}-sheet-${i + 1}.jpg`, `VIGOR CLUB — mobile ${w}px (${i + 1}/${chunk(m, 7).length})`, part, { cellW: 230, cols: 7, maxH: 2400 });
}
const ix = ['mobile-menu', 'class-modal', 'booking-confirmed', 'pricing-annual', 'comparison-table', 'lightbox', 'form-errors'].map((n) => ({ label: n, sub: '390px interaction state', file: `ix-${n}.jpg`, cut: false }));
await sheet('mobile-interactions-sheet.jpg', 'VIGOR CLUB — mobile interaction states (390px)', ix, { cellW: 250, cols: 7, maxH: 900 });

await browser.close();
server.kill();
