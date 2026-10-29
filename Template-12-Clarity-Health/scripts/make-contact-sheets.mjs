// Builds labelled desktop and mobile contact sheets from the per-route screenshots written by the E2E suite
// (review/shots/<route>-<width>.png). Usage: npm run build && npm run test:e2e && npm run review
import { chromium } from '@playwright/test';
import { existsSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const shots = path.resolve('review/shots');
const out = path.resolve('review');
const exe = process.env.PW_CHROMIUM_PATH || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const sheets = [
  { file: 'contact-sheet-desktop-1440.jpg', width: 1440, cols: 4, cell: 360, label: 'Desktop 1440px' },
  { file: 'contact-sheet-mobile-390.jpg', width: 390, cols: 8, cell: 190, label: 'Mobile 390px' },
  { file: 'contact-sheet-tablet-768.jpg', width: 768, cols: 6, cell: 240, label: 'Tablet 768px' }
];

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
for (const s of sheets) {
  const files = readdirSync(shots).filter((f) => f.endsWith(`-${s.width}.png`)).sort();
  if (!files.length) { console.log(`no screenshots for ${s.width}px`); continue; }
  const tiles = files.map((f) => {
    const label = f.replace(`-${s.width}.png`, '').replace(/_/g, '/');
    const data = readFileSync(path.join(shots, f)).toString('base64');
    return `<figure><div class="frame"><img src="data:image/png;base64,${data}" alt=""></div><figcaption>/${label === 'home' ? '' : label}</figcaption></figure>`;
  }).join('');
  const frameH = Math.round(s.cell * (s.width >= 1000 ? 1.2 : 2.6));
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:24px;background:#f1f4f7;font:13px/1.3 Helvetica,Arial,sans-serif;color:#0e2a47;width:${s.cols * (s.cell + 16) + 48}px}
    h1{font:600 22px Georgia,serif;margin:0 0 4px} p{margin:0 0 16px;color:#4d5f73}
    .grid{display:grid;grid-template-columns:repeat(${s.cols},${s.cell}px);gap:16px}
    figure{margin:0}.frame{height:${frameH}px;overflow:hidden;border:1px solid #c9d5df;border-radius:8px;background:#fff}
    img{width:100%;display:block}figcaption{margin-top:6px;font-weight:600;word-break:break-all}
  </style><h1>CLARITY HEALTH — ${s.label}</h1><p>Top of each page, full-page screenshots from the Playwright run. ${files.length} routes.</p><div class="grid">${tiles}</div>`;
  const tmp = path.join(out, '__sheet.html');
  writeFileSync(tmp, html);
  const page = await browser.newPage({ viewport: { width: s.cols * (s.cell + 16) + 48, height: 800 } });
  await page.goto(`file://${tmp}`);
  await page.waitForLoadState('load');
  await page.screenshot({ path: path.join(out, s.file), fullPage: true, type: 'jpeg', quality: 80 });
  await page.close();
  rmSync(tmp);
  console.log('wrote', s.file);
}
await browser.close();
