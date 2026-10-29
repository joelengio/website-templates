// Generates the original procedural artwork into public/images (WebP).
// Usage: npm run images   (needs Chromium; set CHROMIUM_PATH if it is not auto-detected)
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../public/images');
mkdirSync(out, { recursive: true });

const L = { w: 1400, h: 1000 }, E = { w: 1200, h: 900 }, W = { w: 1200, h: 800 }, T = { w: 1000, h: 1250 }, Pt = { w: 800, h: 1000 };
const em = (motif, bg, scale) => ({ motif, bg, scale });
const specs = [
  ['hero-main', 'room', T, 11, { kind: 'hero' }],
  ['hero-card', 'emblem', { w: 600, h: 600 }, 12, em('stethoscope', 'mist')],
  ['intro-main', 'room', E, 13, { kind: 'consult' }],
  ['about-story', 'room', T, 14, { kind: 'corridor' }],
  ['about-care', 'room', { w: 1400, h: 900 }, 15, { kind: 'lounge' }],
  ['cta-band', 'cta', { w: 2000, h: 900 }, 16, {}],
  ['og-image', 'og', { w: 1200, h: 630 }, 17, {}],
  ['map-riverside', 'map', L, 18, { pinX: 0.46, pinY: 0.5 }],
  ['map-annex', 'map', L, 19, { pinX: 0.62, pinY: 0.42 }],
  ['spec-general', 'emblem', E, 21, em('stethoscope', 'mist')],
  ['spec-cardiology', 'emblem', E, 22, em('heart', 'blush')],
  ['spec-dermatology', 'emblem', E, 23, em('droplet', 'teal')],
  ['spec-orthopedics', 'emblem', E, 24, em('bone', 'sand')],
  ['spec-pediatrics', 'emblem', E, 25, em('blocks', 'sky', 1.05)],
  ['spec-dentistry', 'emblem', E, 26, em('tooth', 'navy')],
  ['spec-physio', 'emblem', E, 27, em('figure', 'teal')],
  ['spec-womens', 'emblem', E, 28, em('flower', 'blush')],
  ['doc-1', 'portrait', Pt, 31, { bg: 0, skin: 4, hair: 2, style: 'short' }],
  ['doc-2', 'portrait', Pt, 32, { bg: 1, skin: 2, hair: 1, style: 'short', beard: true, glasses: true }],
  ['doc-3', 'portrait', Pt, 33, { bg: 3, skin: 0, hair: 4, style: 'short', glasses: true }],
  ['doc-4', 'portrait', Pt, 34, { bg: 2, skin: 3, hair: 0, style: 'long' }],
  ['doc-5', 'portrait', Pt, 35, { bg: 5, skin: 1, hair: 0, style: 'bun' }],
  ['doc-6', 'portrait', Pt, 36, { bg: 4, skin: 1, hair: 5, style: 'short' }],
  ['doc-7', 'portrait', Pt, 37, { bg: 1, skin: 2, hair: 5, style: 'scarf', scarf: '#2c5680' }],
  ['doc-8', 'portrait', Pt, 38, { bg: 0, skin: 0, hair: 3, style: 'long', glasses: true }],
  ['doc-9', 'portrait', Pt, 39, { bg: 3, skin: 5, hair: 5, style: 'bald', beard: true, scrub: true }],
  ['doc-10', 'portrait', Pt, 40, { bg: 2, skin: 0, hair: 3, style: 'bun', shirt: '#d9735e' }],
  ['fac-reception', 'room', L, 51, { kind: 'reception' }],
  ['fac-consultation', 'room', L, 52, { kind: 'consult' }],
  ['fac-diagnostics', 'room', L, 53, { kind: 'diagnostics' }],
  ['fac-rehab', 'room', L, 54, { kind: 'rehab' }],
  ['fac-family', 'room', L, 55, { kind: 'family' }],
  ['svc-consultation', 'emblem', W, 61, em('chairdesk', 'mist')],
  ['svc-diagnostic', 'emblem', W, 62, em('magnifier', 'teal')],
  ['svc-preventive', 'emblem', W, 63, em('shield', 'sand')],
  ['svc-specialist', 'emblem', W, 64, em('archplus', 'sky')],
  ['svc-screening', 'emblem', W, 65, em('clipboard', 'blush')],
  ['art-1', 'emblem', W, 71, em('moon', 'navy')],
  ['art-2', 'emblem', W, 72, em('heart', 'mist')],
  ['art-3', 'emblem', W, 73, em('sun', 'sky')],
  ['art-4', 'emblem', W, 74, em('tooth', 'teal')],
  ['art-5', 'emblem', W, 75, em('chairdesk', 'sand')],
  ['art-6', 'emblem', W, 76, em('calendar', 'blush')],
  ['art-7', 'emblem', W, 77, em('magnifier', 'mist')],
  ['art-8', 'emblem', W, 78, em('glass', 'teal')]
];

const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].filter((c) => c && existsSync(c));
const browser = await chromium.launch({ executablePath: candidates[0], args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');
await page.addScriptTag({ content: readFileSync(path.join(here, 'scenes.js'), 'utf8') });
for (const [name, scene, size, seed, opts] of specs) {
  const quality = size.w >= 2000 ? 0.7 : 0.8;
  const data = await page.evaluate(({ scene, size, seed, opts, quality }) => {
    const c = document.getElementById('c');
    window.renderScene(c, { scene, w: size.w, h: size.h, seed, opts });
    return c.toDataURL('image/webp', quality);
  }, { scene, size, seed, opts, quality });
  writeFileSync(path.join(out, `${name}.webp`), Buffer.from(data.split(',')[1], 'base64'));
  console.log('generated', name);
}
await browser.close();
