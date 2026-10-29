// Generates every original, procedural image used by the template into public/images (WebP).
// Usage: npm run images [-- <name-filter> ...]   (needs Chromium; set CHROMIUM_PATH if it is not auto-detected)
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { K, BG, PRODUCT_ART } from './product-art.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../public/images');
mkdirSync(path.join(out, 'products'), { recursive: true });
const filters = process.argv.slice(2);

const PW = 800, PH = 1000;
const hashStr = (s) => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
const bgOf = (name, extra = {}) => ({ ...BG[name], horizon: 0.72, lightX: 0.28, lightY: 0.2, ...extra });

// ── product views ────────────────────────────────────────────────────────────
const WIDE = new Set(['tray', 'throw', 'mirror', 'bowl', 'scarf', 'sunglasses']);
const SHADOW_W = { tote: 0.42, crossbody: 0.4, cardholder: 0.4, pouch: 0.42, scarf: 0.36, sunglasses: 0.34, knit: 0.34, shirt: 0.34, trouser: 0.26, throw: 0.46, cushion: 0.4, basket: 0.4, tray: 0.5, mirror: 0.3, lamp: 0.28, stool: 0.36, sidetable: 0.4, vase: 0.28, bowl: 0.5, mugs: 0.52, candle: 0.34, bottle: 0.24, jar: 0.46, perfume: 0.3, diffuser: 0.26, planter: 0.3 };
const pick = (colorEntry) => { const [k, , o] = colorEntry; const c = { ...K[k] }; const opts = { ...(o || {}) }; if (opts.shade) { c.b = opts.shade; delete opts.shade; } return { c, opts }; };

function studio(p, entry, i) {
  const { c, opts } = pick(entry); const bg = p.colorBg?.[i] ?? p.bg;
  const lift = 0;
  return { w: PW, h: PH, seed: hashStr(p.slug) + i, bg: bgOf(bg), items: [{ t: p.type, x: 0.5, y: 0.78 + lift, u: p.u, c, o: { ...p.o, ...opts }, sw: SHADOW_W[p.type] ?? 0.4 }] };
}
function detail(p, entry) {
  const { c, opts } = pick(entry);
  const ZOOM = { cushion: 1.35, throw: 1.35, trouser: 1.3, knit: 1.45, shirt: 1.45, scarf: 1.35, tote: 1.6, crossbody: 1.6, sunglasses: 1.6, pouch: 1.6, perfume: 1.6 };
  const big = p.u * (ZOOM[p.type] ?? (WIDE.has(p.type) ? 1.55 : 1.85));
  return { w: PW, h: PH, seed: hashStr(p.slug) + 90, grain: 9, vig: 0.28, bg: bgOf('dusk', { wall: ['#6b6258', '#4f4841'], floor: ['#403a34', '#322e2a'], horizon: 0.9, lightX: 0.2, lightY: 0.12 }), items: [{ t: p.type, x: 0.5, y: p.type === 'cardholder' || p.type === 'tray' ? 0.78 : 1.0 + (big - p.u) * 0.12, u: big, c, o: { ...p.o, ...opts }, shadow: false }] };
}
const PROPS = {
  bud: () => ({ t: 'vase', c: K.chalk, o: { shape: 'bud', stems: 3 }, u: 0.3 }),
  books: () => ({ t: 'books', c: { a: K.oat.a, b: K.clay.a, d: K.sage.a }, u: 0.3 }),
  bowl: () => ({ t: 'bowl', c: K.sage, o: { speckle: true }, u: 0.26 }),
  candle: () => ({ t: 'candle', c: K.cedarwax, o: {}, u: 0.26 }),
  plant: () => ({ t: 'planter', c: K.terracotta, o: { leaf: '#6d7a55' }, u: 0.34 })
};
function scene(p, entry) {
  const { c, opts } = pick(entry); const s = hashStr(p.slug); const bgName = ['clay', 'blush', 'stone', 'sage'][s % 4];
  const variant = s % 3;
  const bg = bgOf(bgName, { horizon: 0.64, lightX: variant === 1 ? 0.75 : 0.25, ...(variant === 0 ? { window: { x: 0.12, y: 0.06, ww: 0.42, wh: 0.5 } } : variant === 1 ? { arch: { x: 0.5, y: 0.1, ww: 0.34, wh: 0.5 } } : { leaves: { x: 0.9, y: 0.7, rot: -0.35, n: 3, a: 0.2 } }) });
  const ledgeY = 0.93, th = 0.1, top = ledgeY - th * (1.3 * PW) / PH;
  const items = [{ t: 'ledge', x: 0.5, y: ledgeY, u: (1.3 * PW) / PH, c: K.travertine, o: { th }, shadow: false, k: 3 }];
  const names = Object.keys(PROPS); const a = names[s % names.length], b = names[(s + 2) % names.length];
  const main = { t: p.type, x: 0.5, y: top, u: p.u * 0.9, c, o: { ...p.o, ...opts }, sw: SHADOW_W[p.type] ?? 0.4, sa: 0.3 };
  if (!WIDE.has(p.type)) { items.push({ ...PROPS[a](), x: 0.14, y: top, k: 5, sa: 0.25 }); items.push({ ...PROPS[b](), x: 0.87, y: top, k: 6, sa: 0.25 }); } else items.push({ ...PROPS[a](), x: 0.86, y: top, k: 5, sa: 0.25 });
  items.push(main);
  return { w: PW, h: PH, seed: s + 5, bg, items };
}
function colorsView(p) {
  const n = p.colors.length; const f = n === 2 ? 0.7 : 0.54; const xs = n === 2 ? [0.3, 0.7] : [0.2, 0.5, 0.8];
  const items = p.colors.map((e, i) => { const { c, opts } = pick(e); return { t: p.type, x: xs[i], y: 0.78 + (i === 1 && n === 3 ? 0.03 : 0), u: p.u * f, c, o: { ...p.o, ...opts }, sw: SHADOW_W[p.type] ?? 0.4, k: 9 + i }; });
  items.sort((a, b) => a.y - b.y);
  return { w: PW, h: PH, seed: hashStr(p.slug) + 33, bg: bgOf(p.bg === 'ivory' ? 'stone' : 'ivory'), items };
}

const jobs = [];
for (const p of PRODUCT_ART) {
  p.colors.forEach((e, i) => jobs.push([`products/${p.slug}-${e[1]}`, studio(p, e, i), 0.78]));
  jobs.push([`products/${p.slug}-detail`, detail(p, p.colors[0]), 0.76]);
  jobs.push([`products/${p.slug}-scene`, scene(p, p.colors[0]), 0.78]);
  if (p.colors.length > 1) jobs.push([`products/${p.slug}-colors`, colorsView(p), 0.78]);
}

// ── editorial scenes ─────────────────────────────────────────────────────────
const ledge = (w, h, y = 0.9, th = 0.05, c = K.travertine) => ({ t: 'ledge', x: 0.5, y, u: (1.25 * w) / h, c, o: { th: th * h / ((1.25 * w) / h * h) }, shadow: false, k: 3 });
function ed(name, w, h, bg, items, extra = {}, q = 0.74) {
  const s = hashStr(name); const horizon = bg.horizon ?? 0.66;
  jobs.push([name, { w, h, seed: s, grain: 8, bg: { ...BG[bg.base || 'ivory'], horizon, lightX: 0.25, lightY: 0.18, ...bg }, items, ...extra }, q]);
}
const E = (t, x, y, u, c, o = {}, extra = {}) => ({ t, x, y, u, c, o, ...extra });
const BOOKS = { a: K.oat.a, b: K.clay.a, d: K.sage.a };
const BOOKS2 = { a: K.cocoa.a, b: K.sand.a, d: K.charcoal.a };

// hero (2000x1200): arch, ledge, stoneware and fragrance
{
  const w = 2000, h = 1200, ly = 0.93, th = 0.07, tp = ly - th;
  ed('hero-main', w, h, { base: 'ivory', horizon: 0.62, wall: ['#f4ece0', '#e6dac7'], floor: ['#d8cab3', '#c6b69c'], arch: { x: 0.54, y: 0.06, ww: 0.3, wh: 0.58 }, window: { x: 0.04, y: 0.08, ww: 0.3, wh: 0.46 } }, [
    { ...ledge(w, h, ly, th), u: 2.4 }, E('books', 0.7, tp, 0.5, BOOKS), E('candle', 0.7, tp - 0.5 * 0.52 * 0.9, 0.34, K.cedarwax, {}, { sa: 0.2 }),
    E('vase', 0.5, tp, 0.58, K.chalk, { shape: 'round', speckle: true, stems: 3, stemColor: '#cbb98f' }, { sw: 0.4 }), E('bowl', 0.34, tp, 0.36, K.clay, { speckle: true }, { sw: 0.5 }),
    E('vase', 0.86, tp, 0.42, K.charcoal, { shape: 'tall' }), E('vase', 0.2, tp, 0.3, K.sage, { shape: 'bud', stems: 2 })
  ]);
  ed('hero-bags', 1000, 1250, { base: 'blush', horizon: 0.6, leaves: { x: 0.82, y: 0.72, rot: -0.3, n: 4, a: 0.22 } }, [
    { ...ledge(1000, 1250, 0.92, 0.06), u: 1.4 }, E('tote', 0.4, 0.836, 0.5, K.cognac, {}, { sw: 0.42 }), E('sunglasses', 0.8, 0.836, 0.3, K.tortoise, {}, { sw: 0.34 })
  ]);
  ed('hero-home', 1000, 1250, { base: 'sage', horizon: 0.66, window: { x: 0.08, y: 0.06, ww: 0.7, wh: 0.5 } }, [
    E('lamp', 0.3, 0.8, 0.62, K.chalk, { speckle: true }, { sw: 0.28 }), E('stool', 0.7, 0.88, 0.5, K.natural, {}, { sw: 0.36 })
  ]);
}

// category tiles
const catTile = (name, base, items, bgx = {}) => ed(name, 800, 1000, { base, horizon: 0.7, ...bgx }, items, {}, 0.76);
catTile('cat-bags-accessories', 'clay', [E('tote', 0.42, 0.84, 0.62, K.cognac, {}, { sw: 0.42 }), E('cardholder', 0.78, 0.84, 0.3, K.ink, {}, { sw: 0.4 })], { window: { x: 0.1, y: 0.06, ww: 0.5, wh: 0.5 } });
catTile('cat-apparel', 'stone', [E('knit', 0.5, 0.86, 0.52, K.oat, {}, { sw: 0.34 })], { arch: { x: 0.2, y: 0.06, ww: 0.6, wh: 0.66 } });
catTile('cat-homeware', 'ivory', [E('vase', 0.34, 0.84, 0.54, K.chalk, { shape: 'round', speckle: true, stems: 3, stemColor: '#cbb98f' }, { sw: 0.3 }), E('bowl', 0.72, 0.84, 0.34, K.clay, { speckle: true }, { sw: 0.5 })], { leaves: { x: 0.9, y: 0.7, rot: -0.3, n: 3, a: 0.2 } });
catTile('cat-furniture-lighting', 'blush', [E('stool', 0.34, 0.9, 0.5, K.natural, {}, { sw: 0.36 }), E('lamp', 0.72, 0.86, 0.68, K.charcoal, { speckle: true }, { sw: 0.28 })], { window: { x: 0.45, y: 0.06, ww: 0.5, wh: 0.5 } });
catTile('cat-beauty', 'sage', [E('bottle', 0.34, 0.84, 0.5, K.amber, { kind: 'dropper' }, { sw: 0.24 }), E('jar', 0.62, 0.84, 0.34, K.creamjar, {}, { sw: 0.46 }), E('perfume', 0.85, 0.84, 0.34, K.parfum, {}, { sw: 0.3 })], { arch: { x: 0.5, y: 0.08, ww: 0.4, wh: 0.58 } });

// collection heroes (1600x1000)
const colHero = (slug, base, items, bgx = {}) => ed(`collection-${slug}`, 1600, 1000, { base, horizon: 0.66, ...bgx }, [{ ...ledge(1600, 1000, 0.93, 0.06), u: 1.9 }, ...items], {}, 0.74);
const lt = 0.93 - 0.06; // ledge top (fraction of h)
colHero('the-slow-home', 'sage', [E('throw', 0.3, lt, 0.5, K.oat, { stripes: [[0.12, 0.16, 'b'], [0.2, 0.22, 'b']] }), E('mugs', 0.52, lt, 0.4, K.clay), E('vase', 0.72, lt, 0.5, K.chalk, { shape: 'jug', speckle: true }), E('bowl', 0.88, lt, 0.28, K.sage, { speckle: true })], { window: { x: 0.08, y: 0.06, ww: 0.4, wh: 0.5 } });
colHero('leather-atelier', 'clay', [E('tote', 0.32, lt, 0.58, K.cognac), E('cardholder', 0.58, lt, 0.3, K.ink), E('crossbody', 0.8, lt, 0.5, K.oat)], { arch: { x: 0.58, y: 0.06, ww: 0.3, wh: 0.58 } });
colHero('linen-and-wool', 'ivory', [E('cushion', 0.25, lt, 0.4, K.sage, {}), E('scarf', 0.46, lt, 0.46, K.clay, { stripes: [[0.1, 0.16, 'b'], [0.2, 0.22, 'b']] }), E('shirt', 0.7, lt, 0.5, K.ivory), E('cushion', 0.9, lt, 0.34, K.rust, {})], { leaves: { x: 0.12, y: 0.7, rot: 0.4, n: 4, a: 0.2 } });
colHero('ritual-and-fragrance', 'blush', [E('candle', 0.3, lt, 0.36, K.figwax), E('perfume', 0.48, lt, 0.4, K.parfum), E('bottle', 0.64, lt, 0.46, K.amber, { kind: 'dropper' }), E('diffuser', 0.82, lt, 0.58, K.glassgreen)], { window: { x: 0.5, y: 0.05, ww: 0.42, wh: 0.5 } });
colHero('light-and-form', 'stone', [E('lamp', 0.26, lt, 0.62, K.chalk, { speckle: true }), E('stool', 0.5, lt, 0.46, K.natural), E('sidetable', 0.74, lt, 0.5, K.travertine, { stone: true }), E('vase', 0.9, lt, 0.4, K.charcoal, { shape: 'tall' })], { arch: { x: 0.04, y: 0.06, ww: 0.3, wh: 0.58 } });
colHero('quiet-essentials', 'ivory', [E('knit', 0.24, lt, 0.5, K.camel), E('trouser', 0.46, lt, 0.5, K.charcoal), E('shirt', 0.68, lt, 0.5, K.sage), E('sunglasses', 0.88, lt, 0.3, K.tortoise)], { window: { x: 0.3, y: 0.06, ww: 0.45, wh: 0.5 } });
colHero('gifts-under-100', 'clay', [E('candle', 0.22, lt, 0.34, K.cedarwax), E('mugs', 0.42, lt, 0.4, K.chalk), E('vase', 0.62, lt, 0.36, K.sage, { shape: 'bud', stems: 3 }), E('cardholder', 0.82, lt, 0.28, K.cognac)], { leaves: { x: 0.9, y: 0.7, rot: -0.3, n: 3, a: 0.2 } });
colHero('new-arrivals', 'stone', [E('crossbody', 0.28, lt, 0.5, K.ink), E('vase', 0.5, lt, 0.5, K.clay, { shape: 'round', speckle: true }), E('knit', 0.74, lt, 0.5, K.clay, { cardigan: true }), E('planter', 0.92, lt, 0.4, K.terracotta)], { arch: { x: 0.4, y: 0.06, ww: 0.3, wh: 0.58 } });

// brand / about / newsletter / og
ed('story-atelier', 1200, 1500, { base: 'clay', horizon: 0.7, window: { x: 0.08, y: 0.05, ww: 0.7, wh: 0.5 } }, [{ ...ledge(1200, 1500, 0.9, 0.05), u: 1.2 }, E('tote', 0.4, 0.86, 0.5, K.cognac), E('books', 0.78, 0.86, 0.3, BOOKS2), E('candle', 0.78, 0.86 - 0.3 * 0.52, 0.2, K.cedarwax)]);
ed('story-materials', 1200, 900, { base: 'stone', horizon: 0.62, leaves: { x: 0.12, y: 0.75, rot: 0.35, n: 4, a: 0.22 } }, [{ ...ledge(1200, 900, 0.93, 0.07), u: 1.3 }, E('throw', 0.3, 0.86, 0.55, K.oat, { stripes: [[0.12, 0.16, 'b'], [0.2, 0.22, 'b']] }), E('basket', 0.68, 0.86, 0.5, K.natural), E('scarf', 0.88, 0.86, 0.4, K.clay, {})]);
ed('about-hero', 2000, 1000, { base: 'ivory', horizon: 0.64, arch: { x: 0.3, y: 0.05, ww: 0.24, wh: 0.6 }, window: { x: 0.62, y: 0.08, ww: 0.3, wh: 0.46 } }, [{ ...ledge(2000, 1000, 0.94, 0.06), u: 2.3 }, E('vase', 0.18, 0.88, 0.56, K.clay, { shape: 'tall' }), E('stool', 0.5, 0.88, 0.42, K.natural), E('lamp', 0.76, 0.88, 0.6, K.chalk, { speckle: true }), E('bowl', 0.9, 0.88, 0.26, K.sage)]);
ed('about-craft', 1200, 900, { base: 'sage', horizon: 0.64, window: { x: 0.45, y: 0.05, ww: 0.5, wh: 0.48 } }, [{ ...ledge(1200, 900, 0.93, 0.07), u: 1.3 }, E('mugs', 0.3, 0.86, 0.4, K.charcoal), E('vase', 0.55, 0.86, 0.5, K.chalk, { shape: 'jug', speckle: true }), E('tray', 0.84, 0.86, 0.36, K.natural)]);
ed('about-sourcing', 1200, 900, { base: 'blush', horizon: 0.64, arch: { x: 0.12, y: 0.06, ww: 0.3, wh: 0.58 } }, [{ ...ledge(1200, 900, 0.93, 0.07), u: 1.3 }, E('knit', 0.4, 0.86, 0.5, K.oat), E('basket', 0.74, 0.86, 0.46, K.natural), E('planter', 0.92, 0.86, 0.34, K.terracotta)]);
ed('newsletter-bg', 1600, 800, { base: 'stone', horizon: 0.7, leaves: { x: 0.1, y: 0.8, rot: 0.45, n: 5, a: 0.24 } }, [{ ...ledge(1600, 800, 0.94, 0.06), u: 1.9 }, E('vase', 0.78, 0.88, 0.56, K.chalk, { shape: 'round', stems: 3, stemColor: '#cbb98f' }), E('candle', 0.64, 0.88, 0.3, K.cedarwax)], {}, 0.7);
ed('og-image', 1200, 630, { base: 'ivory', horizon: 0.66, arch: { x: 0.56, y: 0.06, ww: 0.24, wh: 0.6 } }, [{ ...ledge(1200, 630, 0.93, 0.07), u: 1.4 }, E('vase', 0.64, 0.86, 0.54, K.chalk, { shape: 'round', speckle: true, stems: 3, stemColor: '#cbb98f' }), E('bowl', 0.82, 0.86, 0.28, K.clay), E('tote', 0.4, 0.86, 0.5, K.cognac)], {}, 0.76);

// journal covers (1200x800)
const jr = (n, base, items, bgx = {}) => ed(`journal-${n}`, 1200, 800, { base, horizon: 0.66, ...bgx }, [{ ...ledge(1200, 800, 0.93, 0.07), u: 1.4 }, ...items], {}, 0.72);
jr(1, 'sage', [E('mugs', 0.34, 0.86, 0.4, K.chalk), E('throw', 0.64, 0.86, 0.5, K.oat, { stripes: [[0.12, 0.16, 'b']] })], { window: { x: 0.1, y: 0.05, ww: 0.45, wh: 0.5 } });
jr(2, 'ivory', [E('knit', 0.3, 0.86, 0.5, K.camel, { cardigan: true }), E('scarf', 0.58, 0.86, 0.44, K.oat, { stripes: [[0.1, 0.16, 'b']] }), E('sunglasses', 0.84, 0.86, 0.26, K.tortoise)], { arch: { x: 0.62, y: 0.06, ww: 0.28, wh: 0.58 } });
jr(3, 'blush', [E('candle', 0.3, 0.86, 0.36, K.figwax), E('diffuser', 0.52, 0.86, 0.56, K.glassgreen), E('bottle', 0.74, 0.86, 0.42, K.amber, { kind: 'dropper' })], { leaves: { x: 0.9, y: 0.75, rot: -0.35, n: 3, a: 0.22 } });
jr(4, 'stone', [E('tote', 0.34, 0.86, 0.5, K.cognac), E('cardholder', 0.62, 0.86, 0.26, K.ink), E('crossbody', 0.84, 0.86, 0.38, K.oat)], { window: { x: 0.4, y: 0.05, ww: 0.5, wh: 0.5 } });
jr(5, 'clay', [E('lamp', 0.3, 0.86, 0.56, K.chalk, { speckle: true }), E('stool', 0.62, 0.86, 0.4, K.natural), E('books', 0.84, 0.86, 0.26, BOOKS2)], { arch: { x: 0.04, y: 0.06, ww: 0.26, wh: 0.58 } });
jr(6, 'ivory', [E('vase', 0.3, 0.86, 0.5, K.charcoal, { shape: 'tall', stems: 3, stemColor: '#d9cdb6' }), E('bowl', 0.56, 0.86, 0.34, K.clay, { speckle: true }), E('vase', 0.8, 0.86, 0.34, K.chalk, { shape: 'bud', stems: 2 })], { window: { x: 0.45, y: 0.05, ww: 0.45, wh: 0.5 } });
jr(7, 'sage', [E('basket', 0.34, 0.86, 0.46, K.natural), E('cushion', 0.62, 0.86, 0.36, K.rust, {}), E('planter', 0.86, 0.86, 0.4, K.terracotta)], { leaves: { x: 0.12, y: 0.75, rot: 0.4, n: 4, a: 0.22 } });
jr(8, 'stone', [E('shirt', 0.32, 0.86, 0.5, K.ivory), E('trouser', 0.56, 0.86, 0.5, K.charcoal), E('tray', 0.84, 0.86, 0.3, K.walnut)], { arch: { x: 0.35, y: 0.06, ww: 0.28, wh: 0.58 } });

// ── render ───────────────────────────────────────────────────────────────────
const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].filter((c) => c && existsSync(c));
const browser = await chromium.launch({ executablePath: candidates[0], args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');
await page.addScriptTag({ content: readFileSync(path.join(here, 'objects.js'), 'utf8') });
await page.addScriptTag({ content: readFileSync(path.join(here, 'scenes.js'), 'utf8') });
let n = 0;
for (const [name, spec, quality] of jobs) {
  if (filters.length && !filters.some((f) => name.includes(f))) continue;
  const data = await page.evaluate(({ spec, quality }) => { const c = document.getElementById('c'); window.renderScene(c, spec); return c.toDataURL('image/webp', quality); }, { spec, quality });
  const file = path.join(out, `${name}.webp`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
  n++;
}
console.log(`generated ${n} images`);
await browser.close();
