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
  ['hero-arch', 'arch', H, 11, {}], ['hero-mist', 'mist', H, 12, {}],
  ['intro-stones', 'stones', T, 21, {}], ['intro-leaves', 'leaves', L, 22, {}],
  ['philosophy-ripples', 'ripples', H, 31, {}], ['cta-dunes', 'dunes', H, 32, {}],
  ['treat-massage', 'bowl', L, 41, {}], ['treat-facial', 'bloom', L, 42, {}], ['treat-body', 'linen', L, 43, {}],
  ['treat-wellness', 'ripples', L, 44, { dark: true, shift: 0.4 }], ['treat-ritual', 'wood', L, 45, {}], ['treat-skincare', 'bottles', L, 46, {}],
  ['treat-stone', 'stones', L, 47, { dark: true, shift: 0.35 }], ['treat-botanical', 'leaves', L, 48, { dark: true }],
  ['pkg-day', 'arch', L, 51, { shift: 0.35 }], ['pkg-couples', 'bowl', L, 52, { shift: 0.4 }], ['pkg-seasonal', 'dunes', L, 53, { shift: 0.3 }], ['pkg-renew', 'mist', L, 54, {}],
  ['about-story', 'arch', T, 61, { dark: true, shift: 0.5 }], ['about-facility', 'linen', H, 62, { phase: 2 }], ['about-garden', 'leaves', T, 63, { dark: true }],
  ['gal-pool', 'ripples', T, 71, { shift: 0.6 }], ['gal-suite', 'linen', L, 72, { phase: 4 }], ['gal-bloom', 'bloom', S, 73, { dark: true }], ['gal-stones', 'stones', S, 74, { shift: 0.6 }],
  ['gal-oils', 'bottles', T, 75, {}], ['gal-towels', 'wood', L, 76, {}], ['gal-lounge', 'arch', L, 77, { dark: true, shift: 0.62 }], ['gal-candle', 'bowl', T, 78, { shift: 0.55 }],
  ['gal-hills', 'mist', L, 79, {}], ['gal-sand', 'dunes', S, 80, { shift: 0.25 }], ['gal-garden', 'leaves', S, 81, {}],
  ['team-1', 'portrait', Pt, 91, { tone: 0, skin: 0, hair: 0, bun: true }], ['team-2', 'portrait', Pt, 92, { tone: 1, skin: 1, hair: 1, long: true }],
  ['team-3', 'portrait', Pt, 93, { tone: 2, skin: 2, hair: 2 }], ['team-4', 'portrait', Pt, 94, { tone: 3, skin: 3, hair: 3, long: true }],
  ['team-5', 'portrait', Pt, 95, { tone: 4, skin: 4, hair: 4, bun: true }], ['team-6', 'portrait', Pt, 96, { tone: 5, skin: 5, hair: 5 }],
  ['j-1', 'leaves', L, 101, { dark: true }], ['j-2', 'ripples', L, 102, {}], ['j-3', 'stones', L, 103, {}], ['j-4', 'bloom', L, 104, {}],
  ['j-5', 'linen', L, 105, { phase: 1 }], ['j-6', 'mist', L, 106, {}], ['j-7', 'bowl', L, 107, { shift: 0.5 }], ['j-8', 'dunes', L, 108, {}],
  ['og-image', 'arch', { w: 1200, h: 630 }, 111, { shift: 0.3 }], ['contact-map', 'mist', L, 112, {}]
];

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
