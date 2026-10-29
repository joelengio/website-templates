// Generates the trainer "portrait" placeholders: bold monogram cards (initials on charcoal with a lime edge).
// They deliberately contain no faces — replace public/images/trainer-N.webp with real coach photography.
// Usage: npm run images   (needs Chromium; set CHROMIUM_PATH if it is not auto-detected)
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = path.join(root, 'public/images');
const font = `data:font/woff2;base64,${readFileSync(path.join(root, 'node_modules/@fontsource/big-shoulders-display/files/big-shoulders-display-latin-800-normal.woff2')).toString('base64')}`;
const names = [...readFileSync(path.join(root, 'src/config/trainers.ts'), 'utf8').matchAll(/name: '([^']+)'/g)].map((m) => m[1]);
const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 800, height: 1000 } });
for (const [i, name] of names.slice(0, 6).entries()) {
  const initials = name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2);
  await page.setContent(`<style>
    @font-face{font-family:B;src:url(${font})}
    body{margin:0;width:800px;height:1000px;position:relative;overflow:hidden;background:
      repeating-linear-gradient(115deg, rgba(200,255,46,.05) 0 2px, transparent 2px 46px),
      radial-gradient(90% 70% at 30% 20%, #232a1c 0%, #121416 60%, #0c0d0e 100%);font-family:B,sans-serif}
    .bar{position:absolute;left:0;top:0;bottom:0;width:14px;background:#c8ff2e}
    .num{position:absolute;right:48px;top:40px;font-size:64px;color:rgba(241,237,228,.25);letter-spacing:.06em}
    span.m{position:absolute;left:56px;bottom:70px;font-size:420px;line-height:.8;color:#f1ede4;letter-spacing:.01em}
    span.m i{font-style:normal;color:#c8ff2e}
  </style><div class="bar"></div><div class="num">0${i + 1}</div><span class="m">${initials[0]}<i>${initials[1] ?? ''}</i></span>`);
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
  writeFileSync(path.join(out, `trainer-${i + 1}.webp`), Buffer.from(webp, 'base64'));
}
await browser.close();
