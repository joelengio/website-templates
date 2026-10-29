// Generates the team "portrait" placeholders: calm monogram cards (initials on a soft botanical tint).
// They deliberately contain no faces — replace public/images/team-N.webp with real staff photography.
// Usage: npm run images   (needs Chromium; set CHROMIUM_PATH if it is not auto-detected)
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = path.join(root, 'public/images');
const font = `data:font/woff2;base64,${readFileSync(path.join(root, 'node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')).toString('base64')}`;
const staffSrc = readFileSync(path.join(root, 'src/config/staff.ts'), 'utf8');
const names = [...staffSrc.matchAll(/name: '([^']+)'/g)].map((m) => m[1]);
const tints = [
  ['#c9d1b4', '#8a9a74'], ['#e6d9bd', '#b99c6b'], ['#d6dcc6', '#6f8260'],
  ['#ead9c3', '#a98a63'], ['#cfd8c4', '#7d8f6c'], ['#e2d6c0', '#8c7a55']
];
const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 800, height: 1000 } });
for (const [i, name] of names.slice(0, 6).entries()) {
  const initials = name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2);
  const [a, b] = tints[i % tints.length];
  await page.setContent(`<style>
    @font-face{font-family:C;src:url(${font})}
    body{margin:0;width:800px;height:1000px;display:grid;place-items:center;overflow:hidden;
      background:radial-gradient(120% 90% at 30% 15%, #f7f2e6 0%, ${a} 55%, ${b} 130%);font-family:C,serif}
    .arch{position:absolute;inset:90px 130px 0;border:2px solid rgba(255,255,255,.55);border-bottom:0;border-radius:300px 300px 0 0;
      background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))}
    .arch::after{content:'';position:absolute;inset:26px 26px 0;border:1px solid rgba(255,255,255,.4);border-bottom:0;border-radius:280px 280px 0 0}
    span{position:relative;font-size:250px;letter-spacing:.06em;color:#46543a;text-shadow:0 1px 24px rgba(255,255,255,.5);margin-top:60px}
  </style><div class="arch"></div><span>${initials}</span>`);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: 'png' });
  const webp = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', 0.86).split(',')[1];
  }, png.toString('base64'));
  writeFileSync(path.join(out, `team-${i + 1}.webp`), Buffer.from(webp, 'base64'));
}
await browser.close();
