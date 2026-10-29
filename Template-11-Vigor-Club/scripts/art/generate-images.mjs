// Generates the original procedural artwork into public/images (WebP).
// Usage: npm run images   (needs Chromium; set CHROMIUM_PATH if it is not auto-detected)
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../public/images');
mkdirSync(out, { recursive: true });

const L = { w: 1600, h: 1067 }, T = { w: 1000, h: 1300 }, H = { w: 2000, h: 1200 }, S = { w: 1200, h: 1200 }, Pt = { w: 800, h: 1000 };
const specs = [
  ['hero-main', 'hall', H, 11, { pose: 'press', ax: 0.84, s: 0.5 }], ['hero-alt', 'hall', H, 12, { pose: 'dead', ax: 0.64, gx: 0.3, s: 0.56 }],
  ['intro-lifter', 'lifter', T, 21, { pose: 'dead' }], ['philosophy-plates', 'barbell', H, 22, {}], ['cta-stripes', 'stripes', H, 23, { plates: true }],
  ['prog-strength', 'cage', L, 31, {}], ['prog-functional', 'kettlebells', L, 32, {}], ['prog-hiit', 'track', L, 33, {}], ['prog-boxing', 'boxing', L, 34, {}],
  ['prog-mobility', 'mobility', L, 35, {}], ['prog-personal', 'lifter', L, 36, { pose: 'squat' }], ['prog-group', 'studio', L, 37, {}], ['prog-performance', 'hall', L, 38, { pose: 'dead', ax: 0.5 }],
  ['trainer-1', 'portrait', Pt, 41, { hair: 'bun' }], ['trainer-2', 'portrait', Pt, 42, { hair: 'cap', rim: '#F1EDE4' }], ['trainer-3', 'portrait', Pt, 43, { hair: 'long' }],
  ['trainer-4', 'portrait', Pt, 44, { hair: 'cap' }], ['trainer-5', 'portrait', Pt, 45, { hair: 'short', rim: '#F1EDE4' }], ['trainer-6', 'portrait', Pt, 46, { hair: 'bun' }],
  ['fac-strength', 'cage', T, 51, {}], ['fac-cardio', 'cardio', L, 52, {}], ['fac-functional', 'ropes', L, 53, {}], ['fac-group', 'studio', H, 54, { n: 4 }],
  ['fac-personal', 'lifter', T, 55, { pose: 'squat' }], ['fac-recovery', 'recovery', L, 56, {}], ['fac-plunge', 'water', S, 57, {}], ['fac-track', 'track', L, 58, {}],
  ['fac-boxing', 'boxing', S, 59, {}], ['fac-free', 'kettlebells', L, 60, { n: 6 }],
  ['about-story', 'lifter', T, 61, { pose: 'press' }], ['about-floor', 'hall', H, 62, { pose: 'swing', ax: 0.6 }], ['about-community', 'studio', H, 63, { n: 5 }],
  ['j-1', 'lifter', L, 71, { pose: 'dead' }], ['j-2', 'recovery', L, 72, {}], ['j-3', 'mobility', L, 73, {}], ['j-4', 'kettlebells', L, 74, { n: 4 }],
  ['j-5', 'track', L, 75, {}], ['j-6', 'water', L, 76, {}], ['j-7', 'barbell', L, 77, {}], ['j-8', 'stripes', L, 78, {}],
  ['og-image', 'hall', { w: 1200, h: 630 }, 81, { pose: 'press', ax: 0.72, s: 0.5 }], ['contact-map', 'mapgrid', L, 82, {}]
];

const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].filter((c) => c && existsSync(c));
const browser = await chromium.launch({ executablePath: candidates[0], args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');
await page.addScriptTag({ content: readFileSync(path.join(here, 'scenes.js'), 'utf8') });
const only = process.argv[2];
for (const [name, scene, size, seed, opts] of specs) {
  if (only && !name.startsWith(only)) continue;
  const quality = size.w >= 2000 ? 0.74 : 0.8;
  const data = await page.evaluate(({ scene, size, seed, opts, quality }) => {
    const c = document.getElementById('c');
    window.renderScene(c, { scene, w: size.w, h: size.h, seed, opts });
    return c.toDataURL('image/webp', quality);
  }, { scene, size, seed, opts, quality });
  writeFileSync(path.join(out, `${name}.webp`), Buffer.from(data.split(',')[1], 'base64'));
  console.log('generated', name);
}
await browser.close();
