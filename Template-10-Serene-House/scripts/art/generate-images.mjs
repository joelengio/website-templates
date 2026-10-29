// Generates the remaining procedural artwork (contact-map backdrop) into public/images (WebP).
// Usage: npm run images   (needs Chromium; set CHROMIUM_PATH if it is not auto-detected)
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../public/images');
mkdirSync(out, { recursive: true });

const L = { w: 1600, h: 1067 };
// Only the abstract demonstration-map backdrop is still procedural; every other picture is licensed photography
// (see scripts/photos/sources.json) or a generated monogram (generate-monograms.mjs).
const specs = [['contact-map', 'mist', L, 112, {}]];

const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium', undefined].filter((c, i, a) => c === undefined ? i === a.length - 1 : c && existsSync(c));
const browser = await chromium.launch({ executablePath: candidates[0], args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');
await page.addScriptTag({ content: readFileSync(path.join(here, 'scenes.js'), 'utf8') });
for (const [name, scene, size, seed, opts] of specs) {
  const quality = size.w >= 2000 ? 0.72 : 0.78;
  const data = await page.evaluate(({ scene, size, seed, opts, quality }) => {
    const c = document.getElementById('c');
    window.renderScene(c, { scene, w: size.w, h: size.h, seed, opts });
    return c.toDataURL('image/webp', quality);
  }, { scene, size, seed, opts, quality });
  writeFileSync(path.join(out, `${name}.webp`), Buffer.from(data.split(',')[1], 'base64'));
  console.log('generated', name);
}
await browser.close();
