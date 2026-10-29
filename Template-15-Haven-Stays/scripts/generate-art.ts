/**
 * Generates the template's original illustrated imagery (public/images/*.webp).
 *
 * Every picture is drawn procedurally from code in this file — no photography, no third-party
 * artwork — so it is original to this template and free of redistribution questions.
 * Replace the files with your own photography (same file names) for a production site.
 *
 *   npm run art
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'public/images');
mkdirSync(out, { recursive: true });

const W = 1600;
const H = 1000;

/* ---------- helpers ---------- */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
function mix(a: string, b: string, t: number) {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const f = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${f(r1, r2)}${f(g1, g2)}${f(b1, b2)}`;
}
const n = (x: number) => Math.round(x * 10) / 10;

type Mood = 'dawn' | 'day' | 'dusk' | 'night';
const skies: Record<Mood, { top: string; mid: string; low: string; sun: string; sunY: number; ink: string }> = {
  dawn: { top: '#c9b9a4', mid: '#efc9a6', low: '#f7e3c6', sun: '#fff1d2', sunY: 0.5, ink: '#5b4b3e' },
  day: { top: '#8fb3be', mid: '#cfe0df', low: '#f3ecdd', sun: '#fffaf0', sunY: 0.22, ink: '#3c4a44' },
  dusk: { top: '#5d5a74', mid: '#d79a78', low: '#f4c590', sun: '#ffe2b0', sunY: 0.52, ink: '#2e2a33' },
  night: { top: '#15181f', mid: '#2b3040', low: '#4a4a56', sun: '#efe6cf', sunY: 0.2, ink: '#101216' },
};

const defs = (mood: Mood, id = 'g') => {
  const s = skies[mood];
  return `<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.top}"/><stop offset=".55" stop-color="${s.mid}"/><stop offset="1" stop-color="${s.low}"/></linearGradient>
  <radialGradient id="${id}sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${s.sun}" stop-opacity="1"/><stop offset=".35" stop-color="${s.sun}" stop-opacity=".55"/><stop offset="1" stop-color="${s.sun}" stop-opacity="0"/></radialGradient>
  <filter id="${id}grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
  <linearGradient id="${id}shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>`;
};

function sky(mood: Mood, x = 0.5, withSun = true, horizon = 0.62, id = 'g') {
  const s = skies[mood];
  const sy = n(H * s.sunY * (horizon / 0.62));
  const stars =
    mood === 'night'
      ? Array.from({ length: 70 }, (_, i) => {
          const r = rng(i + 11);
          return `<circle cx="${n(r() * W)}" cy="${n(r() * H * 0.5)}" r="${n(0.6 + r() * 1.4)}" fill="#fff" opacity="${n(0.3 + r() * 0.6)}"/>`;
        }).join('')
      : '';
  return `<rect width="${W}" height="${H}" fill="url(#${id}sky)"/>${stars}${
    withSun ? `<circle cx="${n(W * x)}" cy="${sy}" r="${mood === 'night' ? 150 : 260}" fill="url(#${id}sun)"/><circle cx="${n(W * x)}" cy="${sy}" r="${mood === 'night' ? 30 : 44}" fill="${skies[mood].sun}" opacity=".95"/>` : ''
  }`;
}

function ridges(r: () => number, base: number, count: number, from: string, to: string, amp = 160, y0 = 0.5) {
  let svg = '';
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const y = H * (y0 + t * (base - y0));
    const a = amp * (1 - t * 0.5);
    const pts: string[] = [];
    const ph = r() * 10;
    const f1 = 0.004 + r() * 0.004;
    const f2 = 0.011 + r() * 0.01;
    for (let x = 0; x <= W; x += 20) {
      const yy = y - a * (0.55 * Math.sin(x * f1 + ph) + 0.3 * Math.sin(x * f2 + ph * 2) + 0.15 * Math.sin(x * 0.03 + ph));
      pts.push(`${x},${n(yy)}`);
    }
    svg += `<polygon points="0,${H} ${pts.join(' ')} ${W},${H}" fill="${mix(from, to, t)}"/>`;
  }
  return svg;
}

function sea(top: number, c1: string, c2: string, r: () => number, glow?: { x: number; color: string }) {
  let svg = `<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect y="${n(top)}" width="${W}" height="${n(H - top)}" fill="url(#sea)"/>`;
  for (let i = 0; i < 70; i++) {
    const y = top + 6 + Math.pow(r(), 1.6) * (H - top - 8);
    const w = 20 + r() * 180 * (0.4 + (y - top) / (H - top));
    const x = glow ? glow.x + (r() - 0.5) * 360 * (0.3 + (y - top) / (H - top)) - w / 2 : r() * W;
    svg += `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(1.5 + r() * 2.5)}" rx="1.5" fill="${glow ? glow.color : '#ffffff'}" opacity="${n(0.1 + r() * 0.3)}"/>`;
  }
  return svg;
}

function cypress(x: number, base: number, h: number, c: string) {
  const w = h * 0.16;
  return `<path d="M${n(x)} ${n(base - h)} C${n(x + w)} ${n(base - h * 0.6)} ${n(x + w * 1.1)} ${n(base - h * 0.2)} ${n(x + w * 0.5)} ${n(base)} L${n(x - w * 0.5)} ${n(base)} C${n(x - w * 1.1)} ${n(base - h * 0.2)} ${n(x - w)} ${n(base - h * 0.6)} ${n(x)} ${n(base - h)}Z" fill="${c}"/>`;
}
function olive(x: number, base: number, h: number, trunk: string, leaf: string, r: () => number) {
  let svg = `<path d="M${n(x)} ${n(base)} q${n(-h * 0.05)} ${n(-h * 0.4)} ${n(h * 0.06)} ${n(-h * 0.7)}" stroke="${trunk}" stroke-width="${n(h * 0.05)}" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 9; i++) svg += `<ellipse cx="${n(x + (r() - 0.4) * h * 0.7)}" cy="${n(base - h * (0.65 + r() * 0.3))}" rx="${n(h * (0.18 + r() * 0.12))}" ry="${n(h * (0.08 + r() * 0.06))}" fill="${leaf}" opacity=".92"/>`;
  return svg;
}
function palm(x: number, base: number, h: number, c: string, r: () => number) {
  let svg = `<path d="M${n(x)} ${n(base)} q${n(h * 0.12)} ${n(-h * 0.5)} ${n(h * 0.02)} ${n(-h)}" stroke="${c}" stroke-width="${n(h * 0.035)}" fill="none" stroke-linecap="round"/>`;
  const tx = x + h * 0.02;
  const ty = base - h;
  for (let i = 0; i < 9; i++) {
    const a = (-Math.PI * 0.95 + (i / 8) * Math.PI * 0.9) + (r() - 0.5) * 0.2;
    const l = h * (0.34 + r() * 0.12);
    const ex = tx + Math.cos(a) * l;
    const ey = ty + Math.sin(a) * l * 0.5 + l * 0.35;
    svg += `<path d="M${n(tx)} ${n(ty)} Q${n((tx + ex) / 2)} ${n(ty - l * 0.35)} ${n(ex)} ${n(ey)}" stroke="${c}" stroke-width="${n(h * 0.022)}" fill="none" stroke-linecap="round"/>`;
  }
  return svg;
}

/* A stack of cubic terraces with openings — the "architecture" motif. */
function villa(x: number, base: number, w: number, floors: number, wall: string, shade: string, glass: string, lit: boolean, r: () => number, arches = false) {
  let svg = '';
  const fh = w * 0.2;
  for (let f = 0; f < floors; f++) {
    const fw = w * (1 - f * 0.16) * (0.9 + r() * 0.15);
    const fx = x + (w - fw) * (f % 2 ? 0.2 : 0.8) * r() + (f ? 0 : 0);
    const y = base - (f + 1) * fh;
    svg += `<rect x="${n(fx)}" y="${n(y)}" width="${n(fw)}" height="${n(fh)}" fill="${wall}"/><rect x="${n(fx - 6)}" y="${n(y - 6)}" width="${n(fw + 12)}" height="8" fill="${mix(wall, '#ffffff', 0.25)}"/><rect x="${n(fx + fw * 0.6)}" y="${n(y)}" width="${n(fw * 0.4)}" height="${n(fh)}" fill="${shade}" opacity=".35"/>`;
    const cols = Math.max(2, Math.floor(fw / 90));
    for (let c = 0; c < cols; c++) {
      const cw = (fw / cols) * 0.5;
      const cx = fx + (fw / cols) * c + (fw / cols - cw) / 2;
      const fill = lit && r() > 0.35 ? '#ffd9a0' : glass;
      if (arches) svg += `<path d="M${n(cx)} ${n(y + fh - 8)} V${n(y + fh * 0.4)} a${n(cw / 2)} ${n(cw / 2)} 0 0 1 ${n(cw)} 0 V${n(y + fh - 8)}Z" fill="${fill}"/>`;
      else svg += `<rect x="${n(cx)}" y="${n(y + fh * 0.24)}" width="${n(cw)}" height="${n(fh * 0.6)}" fill="${fill}"/>`;
    }
  }
  return svg;
}

function frame(inner: string, mood: Mood, id = 'g') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs(mood, id)}</defs>${inner}<rect width="${W}" height="${H}" fill="url(#${id}shade)"/><rect width="${W}" height="${H}" filter="url(#${id}grain)"/></svg>`;
}

/* ---------- scenes ---------- */
interface Opt {
  seed: number;
  mood: Mood;
}

function coast({ seed, mood }: Opt, o: { villas?: number; palms?: boolean; boat?: boolean; pool?: boolean } = {}) {
  const r = rng(seed);
  const s = skies[mood];
  const hz = 0.58;
  const sx = 0.3 + r() * 0.4;
  let svg = sky(mood, sx, true, hz);
  svg += ridges(r, 0.58, 2, mix(s.mid, '#6c7a6a', 0.55), mix(s.mid, '#55644f', 0.6), 70, 0.5);
  svg += sea(H * hz, mix('#7ea6a8', s.mid, 0.4), mix('#2f5558', s.top, mood === 'night' ? 0.8 : 0.1), r, { x: W * sx, color: s.sun });
  // headland with terraces
  svg += `<path d="M0 ${H} L0 ${H * 0.64} C${W * 0.2} ${H * 0.6} ${W * 0.4} ${H * 0.72} ${W * 0.62} ${H * 0.86} L${W * 0.7} ${H}Z" fill="#7a8460"/>`;
  svg += `<path d="M0 ${H} L0 ${H * 0.78} C${W * 0.18} ${H * 0.76} ${W * 0.32} ${H * 0.86} ${W * 0.44} ${H}Z" fill="#4a5233"/>`;
  const wall = mix('#efe5d3', s.mid, mood === 'dusk' ? 0.25 : 0.05);
  const v = o.villas ?? 3;
  for (let i = 0; i < v; i++) svg += villa(W * (0.08 + i * 0.17), H * (0.7 + i * 0.045), 250 + r() * 70, 2 + (i % 2), wall, '#7c6a58', mood === 'day' ? '#4e6f73' : '#38424a', mood !== 'day', r, i % 2 === 0);
  if (o.pool) svg += `<rect x="${W * 0.54}" y="${H * 0.88}" width="${W * 0.34}" height="${H * 0.07}" fill="#79b7bd"/><rect x="${W * 0.54}" y="${H * 0.88}" width="${W * 0.34}" height="6" fill="#d9f0ef" opacity=".7"/>`;
  if (o.palms !== false) for (let i = 0; i < 3; i++) svg += palm(W * (0.55 + r() * 0.4), H * (0.97 + r() * 0.02), 330 + r() * 120, mix('#2f3623', s.ink, 0.3), r);
  if (o.boat !== false) {
    const bx = W * (0.55 + r() * 0.3);
    const by = H * (0.68 + r() * 0.1);
    svg += `<path d="M${n(bx)} ${n(by)} h90 l-18 14 h-54z" fill="${s.ink}"/><path d="M${n(bx + 45)} ${n(by)} v-60 l34 54z" fill="#f5efe4" opacity=".95"/>`;
  }
  return frame(svg, mood);
}

function mountain({ seed, mood }: Opt, o: { lake?: boolean; lodge?: boolean; snow?: boolean } = {}) {
  const r = rng(seed);
  const s = skies[mood];
  let svg = sky(mood, 0.3 + r() * 0.4, true, 0.5);
  const cols = [mix(s.mid, '#8a97a6', 0.6), mix(s.mid, '#667589', 0.7), mix('#4a5a5a', s.ink, 0.2), mix('#33402f', s.ink, 0.25)];
  for (let i = 0; i < cols.length; i++) {
    const pts: string[] = [];
    const by = H * (0.46 + i * 0.1);
    const amp = 250 - i * 45;
    const ph = r() * 20;
    for (let x = 0; x <= W; x += 16) {
      const k = Math.abs(Math.sin(x * 0.0035 + ph)) * 0.7 + Math.abs(Math.sin(x * 0.011 + ph * 1.3)) * 0.3;
      pts.push(`${x},${n(by - amp * k)}`);
    }
    svg += `<polygon points="0,${H} ${pts.join(' ')} ${W},${H}" fill="${cols[i]}"/>`;
    if (o.snow !== false && i === 0) svg += `<polygon points="0,${H} ${pts.join(' ')} ${W},${H}" fill="#fff" opacity=".28" clip-path="inset(0 0 ${n(H * 0.85)}px 0)"/>`;
  }
  if (o.lake) svg += `<rect y="${H * 0.78}" width="${W}" height="${H * 0.22}" fill="${mix('#6e8f94', s.mid, 0.3)}"/>` + Array.from({ length: 24 }, () => `<rect x="${n(r() * W)}" y="${n(H * 0.79 + r() * H * 0.19)}" width="${n(40 + r() * 140)}" height="2" fill="#fff" opacity=".25"/>`).join('');
  for (let i = 0; i < 26; i++) svg += cypress(r() * W, H * (0.8 + r() * 0.18), 120 + r() * 200, mix('#2f3623', s.ink, 0.4));
  if (o.lodge !== false) {
    const lx = W * (0.4 + r() * 0.2);
    svg += `<polygon points="${lx},${H * 0.72} ${lx + 140},${H * 0.64} ${lx + 280},${H * 0.72}" fill="#5b4a3d"/><rect x="${lx + 10}" y="${H * 0.72}" width="260" height="90" fill="#8a6a4c"/>` + [0, 1, 2, 3].map((k) => `<rect x="${lx + 30 + k * 60}" y="${H * 0.745}" width="34" height="46" fill="${mood === 'day' ? '#4e6f73' : '#ffd9a0'}"/>`).join('');
  }
  return frame(svg, mood);
}

function pool({ seed, mood }: Opt) {
  const r = rng(seed);
  const s = skies[mood];
  let svg = sky(mood, 0.7, true, 0.4);
  svg += ridges(r, 0.4, 2, mix(s.mid, '#6c7a6a', 0.5), '#55644f', 60, 0.33);
  svg += `<rect y="${H * 0.4}" width="${W}" height="${H * 0.6}" fill="#e6dac6"/>`;
  svg += `<polygon points="${W * 0.12},${H * 0.5} ${W * 0.88},${H * 0.5} ${W * 0.96},${H * 0.93} ${W * 0.04},${H * 0.93}" fill="#e9f1ee"/>`;
  svg += `<defs><linearGradient id="pl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc1c4"/><stop offset="1" stop-color="#2d7b83"/></linearGradient></defs><polygon points="${W * 0.14},${H * 0.52} ${W * 0.86},${H * 0.52} ${W * 0.93},${H * 0.9} ${W * 0.07},${H * 0.9}" fill="url(#pl)"/>`;
  for (let i = 0; i < 40; i++) svg += `<rect x="${n(W * (0.12 + r() * 0.74))}" y="${n(H * (0.54 + r() * 0.34))}" width="${n(30 + r() * 120)}" height="2.5" rx="1" fill="#fff" opacity="${n(0.12 + r() * 0.3)}"/>`;
  for (let i = 0; i < 4; i++) {
    const lx = W * (0.14 + i * 0.22);
    svg += `<rect x="${n(lx)}" y="${H * 0.93}" width="190" height="14" fill="#f5efe4"/><rect x="${n(lx + 6)}" y="${H * 0.93 + 14}" width="8" height="26" fill="#8f7a5a"/><rect x="${n(lx + 176)}" y="${H * 0.93 + 14}" width="8" height="26" fill="#8f7a5a"/>`;
  }
  svg += `<g>${[0.05, 0.24, 0.52, 0.8, 0.94].map((p) => olive(W * p, H * 0.5, 190, '#4b3f33', '#4a5233', r)).join('')}</g>`;
  svg += `<g>${[0.02, 0.97].map((p) => palm(W * p, H * 1.02, 560, '#2f3623', r)).join('')}</g>`;
  return frame(svg, mood);
}

function arch({ seed, mood }: Opt, o: { count?: number; fountain?: boolean } = {}) {
  const r = rng(seed);
  const s = skies[mood];
  const wall = mix('#e8dcc7', s.mid, 0.12);
  let svg = `<rect width="${W}" height="${H}" fill="${wall}"/><rect y="${H * 0.78}" width="${W}" height="${H * 0.22}" fill="${mix('#c8b79b', s.ink, 0.1)}"/>`;
  const c = o.count ?? 4;
  const aw = W / c;
  for (let i = 0; i < c; i++) {
    const x = i * aw + aw * 0.14;
    const w = aw * 0.72;
    const top = H * 0.16;
    svg += `<path d="M${n(x)} ${H * 0.78} V${n(top + w / 2)} a${n(w / 2)} ${n(w / 2)} 0 0 1 ${n(w)} 0 V${H * 0.78}Z" fill="${mix(s.top, s.mid, 0.4)}"/>`;
    svg += `<path d="M${n(x)} ${H * 0.78} V${n(top + w / 2)} a${n(w / 2)} ${n(w / 2)} 0 0 1 ${n(w)} 0 V${H * 0.78}Z" fill="none" stroke="${mix(wall, '#000000', 0.14)}" stroke-width="14"/>`;
    svg += ridges(r, 0.8, 1, '#7a8460', '#7a8460', 40, 0.62).replace(/<polygon/, `<polygon clip-path="url(#c${i})"`);
    svg = svg.replace(/<polygon clip-path="url\(#c\d+\)"[^>]*\/>/, '');
    svg += cypress(x + w * 0.5, H * 0.78, 250 + r() * 130, '#33402f');
    svg += `<rect x="${n(x - 8)}" y="${H * 0.78}" width="${n(w + 16)}" height="${H * 0.06}" fill="${mix(wall, '#000', 0.08)}" opacity=".55"/>`;
  }
  if (o.fountain) svg += `<ellipse cx="${W / 2}" cy="${H * 0.9}" rx="190" ry="40" fill="#8fb7b8"/><ellipse cx="${W / 2}" cy="${H * 0.9}" rx="190" ry="40" fill="none" stroke="#c8b79b" stroke-width="10"/><path d="M${W / 2} ${H * 0.9} v-80" stroke="#fff" stroke-width="5" opacity=".7"/>`;
  svg += Array.from({ length: 8 }, () => `<ellipse cx="${n(r() * W)}" cy="${n(H * 0.86 + r() * H * 0.1)}" rx="${n(30 + r() * 60)}" ry="${n(8 + r() * 10)}" fill="#33402f" opacity="${n(0.35 + r() * 0.3)}"/>`).join('');
  return frame(svg, mood);
}

/** Interior: bedroom with a window onto a landscape. */
function room({ seed, mood }: Opt, o: { bath?: boolean; view?: 'sea' | 'mountain' | 'garden'; suite?: boolean; bed?: 'king' | 'twin' | 'bunk' } = {}) {
  const r = rng(seed);
  const wall = mix('#efe6d4', '#d9c9ae', r() * 0.5);
  const floor = mix('#b49a76', '#8a7254', r() * 0.6);
  let svg = `<rect width="${W}" height="${H}" fill="${wall}"/><rect y="${H * 0.72}" width="${W}" height="${H * 0.28}" fill="${floor}"/>`;
  for (let i = 0; i < 12; i++) svg += `<line x1="${n((W / 11) * i)}" y1="${H * 0.72}" x2="${n(W / 2 + (i - 5.5) * 220)}" y2="${H}" stroke="#000" stroke-opacity=".1"/>`;
  // window
  const wx = W * 0.55;
  const wy = H * 0.1;
  const ww = W * 0.38;
  const wh = H * 0.55;
  const view = o.view ?? 'sea';
  const m: Mood = mood === 'night' ? 'night' : mood;
  const vs = skies[m];
  svg += `<defs><clipPath id="win"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}"/></clipPath></defs><g clip-path="url(#win)"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${vs.mid}"/>`;
  svg += `<circle cx="${wx + ww * 0.7}" cy="${wy + wh * 0.3}" r="46" fill="${vs.sun}" opacity=".9"/>`;
  if (view === 'sea') svg += `<rect x="${wx}" y="${wy + wh * 0.5}" width="${ww}" height="${wh * 0.5}" fill="${mix('#4f8a90', vs.mid, 0.2)}"/>` + Array.from({ length: 14 }, () => `<rect x="${n(wx + r() * ww)}" y="${n(wy + wh * (0.52 + r() * 0.46))}" width="${n(30 + r() * 90)}" height="2" fill="#fff" opacity=".35"/>`).join('');
  else if (view === 'mountain') svg += `<polygon points="${wx},${wy + wh} ${wx + ww * 0.3},${wy + wh * 0.35} ${wx + ww * 0.55},${wy + wh * 0.7} ${wx + ww * 0.8},${wy + wh * 0.3} ${wx + ww},${wy + wh * 0.75} ${wx + ww},${wy + wh}" fill="${mix('#6a7c8a', vs.mid, 0.2)}"/><polygon points="${wx},${wy + wh} ${wx},${wy + wh * 0.8} ${wx + ww * 0.4},${wy + wh * 0.6} ${wx + ww},${wy + wh * 0.85} ${wx + ww},${wy + wh}" fill="#33402f"/>`;
  else svg += `<rect x="${wx}" y="${wy + wh * 0.6}" width="${ww}" height="${wh * 0.4}" fill="#6b7a4a"/>` + [0.1, 0.4, 0.75].map((p) => cypress(wx + ww * p, wy + wh, wh * 0.7, '#33402f')).join('');
  svg += `</g><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="none" stroke="#2b2924" stroke-width="10"/><line x1="${wx + ww / 2}" y1="${wy}" x2="${wx + ww / 2}" y2="${wy + wh}" stroke="#2b2924" stroke-width="6"/>`;
  // curtains
  svg += `<path d="M${wx - 50} ${wy - 30} h50 v${wh + 40} h-50z" fill="${mix('#e6dac6', '#b5603f', 0.12)}"/><path d="M${wx + ww} ${wy - 30} h50 v${wh + 40} h-50z" fill="${mix('#e6dac6', '#b5603f', 0.12)}"/><rect x="${wx - 80}" y="${wy - 40}" width="${ww + 160}" height="10" fill="#2b2924"/>`;
  // bed
  const linen = mix('#f5efe4', '#dccdb4', r() * 0.4);
  const accent = [`#b5603f`, '#4a5233', '#9a7443', '#23221f'][seed % 4];
  if (o.bed === 'twin') {
    for (const bx of [W * 0.06, W * 0.3]) {
      svg += `<rect x="${bx}" y="${H * 0.3}" width="${W * 0.2}" height="${H * 0.28}" rx="10" fill="#5b4a3d"/><rect x="${bx - 8}" y="${H * 0.52}" width="${W * 0.2 + 16}" height="${H * 0.22}" rx="14" fill="${linen}"/><rect x="${bx - 8}" y="${H * 0.62}" width="${W * 0.2 + 16}" height="${H * 0.12}" fill="${accent}" opacity=".85"/><rect x="${bx + 20}" y="${H * 0.48}" width="${W * 0.1}" height="${H * 0.07}" rx="10" fill="#fff"/>`;
    }
  } else {
    svg += `<rect x="${W * 0.05}" y="${H * 0.28}" width="${W * 0.4}" height="${H * 0.32}" rx="14" fill="${mix('#5b4a3d', accent, 0.2)}"/><rect x="${W * 0.03}" y="${H * 0.5}" width="${W * 0.44}" height="${H * 0.26}" rx="18" fill="${linen}"/><rect x="${W * 0.03}" y="${H * 0.62}" width="${W * 0.44}" height="${H * 0.14}" rx="10" fill="${accent}" opacity=".88"/>`;
    svg += [0.08, 0.2, 0.32].map((p) => `<rect x="${W * p}" y="${H * 0.44}" width="${W * 0.1}" height="${H * 0.09}" rx="14" fill="#fff" opacity=".95"/>`).join('');
  }
  svg += `<rect x="${W * 0.48}" y="${H * 0.58}" width="${W * 0.05}" height="${H * 0.14}" fill="#5b4a3d"/><rect x="${W * 0.475}" y="${H * 0.45}" width="${W * 0.05}" height="${H * 0.13}" rx="10" fill="#e9c98f"/>`;
  // artwork + rug
  svg += `<rect x="${W * 0.14}" y="${H * 0.07}" width="${W * 0.2}" height="${H * 0.16}" fill="#fff" stroke="#2b2924" stroke-width="6"/><circle cx="${W * 0.24}" cy="${H * 0.15}" r="${H * 0.045}" fill="${accent}" opacity=".85"/><rect x="${W * 0.15}" y="${H * 0.17}" width="${W * 0.18}" height="${H * 0.05}" fill="#9a7443" opacity=".5"/>`;
  svg += `<ellipse cx="${W * 0.45}" cy="${H * 0.9}" rx="${W * 0.3}" ry="${H * 0.07}" fill="${mix('#d4c3a6', accent, 0.15)}" opacity=".9"/>`;
  if (o.suite) svg += `<rect x="${W * 0.6}" y="${H * 0.68}" width="${W * 0.28}" height="${H * 0.12}" rx="20" fill="#7a8460"/><rect x="${W * 0.6}" y="${H * 0.6}" width="${W * 0.28}" height="${H * 0.1}" rx="20" fill="#68724f"/><rect x="${W * 0.7}" y="${H * 0.84}" width="${W * 0.14}" height="${H * 0.05}" rx="6" fill="#5b4a3d"/>`;
  if (o.bath) svg += `<rect x="${W * 0.6}" y="${H * 0.74}" width="${W * 0.3}" height="${H * 0.14}" rx="60" fill="#fbf8f1" stroke="#d9cdb7" stroke-width="6"/><path d="M${W * 0.9} ${H * 0.74} v-90 q0 -30 -30 -30" stroke="#9a7443" stroke-width="8" fill="none"/>`;
  svg += `<line x1="${W * 0.38}" y1="0" x2="${W * 0.38}" y2="${H * 0.1}" stroke="#2b2924"/><ellipse cx="${W * 0.38}" cy="${H * 0.12}" rx="46" ry="30" fill="#e9c98f" opacity=".95"/>`;
  return frame(svg, m);
}

function bath({ seed, mood }: Opt) {
  const r = rng(seed);
  let svg = `<rect width="${W}" height="${H}" fill="#e3d6bf"/>`;
  for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) svg += `<rect x="${i * 180}" y="${j * 120}" width="176" height="116" fill="${mix('#e8dcc7', '#cdbb9c', r() * 0.5)}"/>`;
  svg += `<rect y="${H * 0.78}" width="${W}" height="${H * 0.22}" fill="#8f7a5a"/><ellipse cx="${W * 0.5}" cy="${H * 0.72}" rx="${W * 0.28}" ry="${H * 0.1}" fill="#fbf8f1" stroke="#d3c5ab" stroke-width="10"/><ellipse cx="${W * 0.5}" cy="${H * 0.72}" rx="${W * 0.25}" ry="${H * 0.075}" fill="#a9d1d0"/><path d="M${W * 0.78} ${H * 0.7} v-260 q0 -60 -70 -60" stroke="#9a7443" stroke-width="12" fill="none"/>`;
  svg += `<rect x="${W * 0.08}" y="${H * 0.1}" width="${W * 0.22}" height="${H * 0.45}" rx="${W * 0.11}" fill="#c9d8d6"/><rect x="${W * 0.08}" y="${H * 0.1}" width="${W * 0.22}" height="${H * 0.45}" rx="${W * 0.11}" fill="none" stroke="#2b2924" stroke-width="8"/>`;
  svg += [0, 1, 2].map((i) => `<ellipse cx="${W * (0.12 + i * 0.05)}" cy="${H * 0.92 - i * 12}" rx="${70 - i * 12}" ry="${20}" fill="#b8ad9b"/>`).join('');
  return frame(svg, mood);
}

function spa({ seed }: Opt) {
  const r = rng(seed);
  let svg = `<rect width="${W}" height="${H}" fill="#2a2d22"/><defs><radialGradient id="warm" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#f2c98e" stop-opacity=".55"/><stop offset="1" stop-color="#f2c98e" stop-opacity="0"/></radialGradient></defs>`;
  for (let i = 0; i < 12; i++) svg += `<rect x="${i * 140}" y="0" width="136" height="${H * 0.6}" fill="${mix('#3a3f2c', '#51573a', r())}"/>`;
  svg += `<rect width="${W}" height="${H}" fill="url(#warm)"/><rect y="${H * 0.6}" width="${W}" height="${H * 0.4}" fill="#4a4034"/><ellipse cx="${W * 0.5}" cy="${H * 0.78}" rx="${W * 0.36}" ry="${H * 0.13}" fill="#2f5a5c"/><ellipse cx="${W * 0.5}" cy="${H * 0.78}" rx="${W * 0.36}" ry="${H * 0.13}" fill="none" stroke="#b49a76" stroke-width="12"/>`;
  for (let i = 0; i < 18; i++) svg += `<ellipse cx="${n(W * (0.2 + r() * 0.6))}" cy="${n(H * (0.72 + r() * 0.12))}" rx="${n(40 + r() * 90)}" ry="3" fill="#fff" opacity="${n(0.08 + r() * 0.15)}"/>`;
  for (let i = 0; i < 5; i++) {
    const x = W * (0.12 + i * 0.19);
    svg += `<ellipse cx="${n(x)}" cy="${H * 0.94}" rx="46" ry="14" fill="#6e6a60"/><ellipse cx="${n(x)}" cy="${H * 0.9}" rx="36" ry="12" fill="#85807a"/><ellipse cx="${n(x)}" cy="${H * 0.865}" rx="24" ry="9" fill="#9a958c"/><path d="M${n(x + 4)} ${H * 0.86} c-20 -40 20 -60 0 -110" stroke="#fff" stroke-width="3" fill="none" opacity=".2"/>`;
  }
  svg += [0.15, 0.85].map((p) => `<rect x="${W * p - 14}" y="${H * 0.54}" width="28" height="40" rx="6" fill="#f5efe4"/><ellipse cx="${W * p}" cy="${H * 0.525}" rx="9" ry="16" fill="#f2c98e"/>`).join('');
  return frame(svg, 'night');
}

function dining({ seed, mood }: Opt, o: { bar?: boolean; terrace?: boolean } = {}) {
  const r = rng(seed);
  const night = mood === 'night' || mood === 'dusk';
  let svg = '';
  if (o.terrace) {
    svg += sky(mood, 0.35, true, 0.5) + sea(H * 0.5, '#79a8ab', '#2f5558', r, { x: W * 0.35, color: skies[mood].sun });
    svg += `<rect y="${H * 0.62}" width="${W}" height="${H * 0.38}" fill="#cdb894"/>`;
  } else {
    svg += `<rect width="${W}" height="${H}" fill="${night ? '#2a2620' : '#e8dcc7'}"/><rect y="${H * 0.66}" width="${W}" height="${H * 0.34}" fill="${night ? '#473b2d' : '#b49a76'}"/>`;
    for (let i = 0; i < 5; i++) svg += `<path d="M${W * (0.04 + i * 0.2)} ${H * 0.66} V${H * 0.3} a${W * 0.07} ${W * 0.07} 0 0 1 ${W * 0.14} 0 V${H * 0.66}Z" fill="${night ? '#14130f' : '#c3d4d2'}" opacity=".85"/>`;
  }
  if (o.bar) {
    svg += `<rect x="${W * 0.06}" y="${H * 0.55}" width="${W * 0.88}" height="${H * 0.1}" fill="#5b4a3d"/><rect x="${W * 0.06}" y="${H * 0.65}" width="${W * 0.88}" height="${H * 0.25}" fill="#3b2f26"/>`;
    for (let i = 0; i < 16; i++) svg += `<rect x="${n(W * (0.1 + i * 0.053))}" y="${n(H * (0.36 + (i % 2) * 0.09))}" width="${n(W * 0.012 + (i % 3) * 5)}" height="${n(H * (0.17 - (i % 2) * 0.05))}" rx="6" fill="${['#b5603f', '#4a5233', '#9a7443', '#e9c98f'][i % 4]}" opacity=".9"/>`;
    svg += `<rect x="${W * 0.06}" y="${H * 0.33}" width="${W * 0.88}" height="8" fill="#9a7443"/><rect x="${W * 0.06}" y="${H * 0.5}" width="${W * 0.88}" height="8" fill="#9a7443"/>`;
    for (let i = 0; i < 5; i++) svg += `<rect x="${W * (0.14 + i * 0.17)}" y="${H * 0.74}" width="14" height="${H * 0.2}" fill="#9a7443"/><ellipse cx="${W * (0.14 + i * 0.17) + 7}" cy="${H * 0.74}" rx="46" ry="14" fill="#b5603f"/>`;
  } else {
    for (let t = 0; t < 3; t++) {
      const tx = W * (0.2 + t * 0.3);
      const ty = H * (0.72 + (t % 2) * 0.05);
      svg += `<rect x="${tx - 6}" y="${ty}" width="12" height="${H * 0.2}" fill="#5b4a3d"/><ellipse cx="${tx}" cy="${ty}" rx="${W * 0.12}" ry="${H * 0.045}" fill="${['#f5efe4', '#efe3cc', '#f5efe4'][t]}"/>`;
      svg += [-0.06, 0, 0.06].map((d) => `<ellipse cx="${tx + W * d}" cy="${ty - 4}" rx="28" ry="9" fill="#fff" stroke="#c9bba3" stroke-width="3"/><ellipse cx="${tx + W * d}" cy="${ty - 6}" rx="11" ry="4" fill="${['#b5603f', '#4a5233', '#9a7443'][t]}"/>`).join('');
      svg += `<rect x="${tx - 3}" y="${ty - 56}" width="6" height="48" fill="#cfe0df" opacity=".7"/><path d="M${tx - 14} ${ty - 56} h28 v-24 q-14 -12 -28 0z" fill="#cfe0df" opacity=".7"/>`;
    }
  }
  const nPend = 5;
  for (let i = 0; i < nPend; i++) {
    const px = W * (0.1 + i * 0.2);
    const len = H * (0.12 + (i % 2) * 0.1);
    svg += `<line x1="${px}" y1="0" x2="${px}" y2="${len}" stroke="#2b2924" stroke-width="2"/><path d="M${px - 36} ${len + 40} q36 -64 72 0z" fill="#9a7443"/><ellipse cx="${px}" cy="${len + 42}" rx="${night ? 140 : 40}" ry="${night ? 70 : 12}" fill="#ffd9a0" opacity="${night ? 0.28 : 0.4}"/>`;
  }
  return frame(svg, mood);
}

function food({ seed, mood }: Opt, o: { palette?: string[] } = {}) {
  const r = rng(seed);
  const pal = o.palette ?? ['#b5603f', '#4a5233', '#9a7443', '#e9c98f'];
  let svg = `<rect width="${W}" height="${H}" fill="${mix('#7b6a58', '#4a4036', r() * 0.6)}"/>`;
  for (let i = 0; i < 24; i++) svg += `<rect x="0" y="${i * 44}" width="${W}" height="2" fill="#000" opacity=".1"/>`;
  const plates = [
    [W * 0.3, H * 0.5, 300],
    [W * 0.7, H * 0.45, 230],
    [W * 0.62, H * 0.82, 160],
  ];
  plates.forEach(([x, y, rad], i) => {
    svg += `<circle cx="${x}" cy="${y + 14}" r="${rad}" fill="#000" opacity=".25"/><circle cx="${x}" cy="${y}" r="${rad}" fill="#f5efe4"/><circle cx="${x}" cy="${y}" r="${rad * 0.78}" fill="#fbf8f1" stroke="#e1d7c3" stroke-width="4"/>`;
    for (let k = 0; k < 7; k++) {
      const a = r() * Math.PI * 2;
      const d = r() * rad * 0.4;
      svg += `<circle cx="${n(x + Math.cos(a) * d)}" cy="${n(y + Math.sin(a) * d)}" r="${n(rad * (0.07 + r() * 0.12))}" fill="${pal[(k + i) % pal.length]}" opacity=".92"/>`;
    }
    svg += `<path d="M${x - rad * 0.3} ${y + rad * 0.2} q${rad * 0.3} ${rad * 0.25} ${rad * 0.6} 0" stroke="${pal[i % pal.length]}" stroke-width="10" fill="none" opacity=".8" stroke-linecap="round"/>`;
  });
  svg += `<rect x="${W * 0.86}" y="${H * 0.1}" width="${W * 0.05}" height="${H * 0.5}" rx="20" fill="#cfe0df" opacity=".6"/><circle cx="${W * 0.88}" cy="${H * 0.1}" r="${W * 0.05}" fill="#cfe0df" opacity=".6"/>`;
  return frame(svg, mood);
}

function village({ seed, mood }: Opt, o: { harbor?: boolean; terraces?: boolean } = {}) {
  const r = rng(seed);
  const s = skies[mood];
  let svg = sky(mood, 0.6, true, 0.45);
  svg += ridges(r, 0.5, 2, mix(s.mid, '#6c7a6a', 0.5), '#55644f', 120, 0.34);
  if (o.harbor) {
    svg += sea(H * 0.62, '#79a8ab', '#2f5558', r, { x: W * 0.6, color: s.sun });
    for (let i = 0; i < 5; i++) {
      const bx = W * (0.08 + i * 0.17 + r() * 0.05);
      const by = H * (0.7 + r() * 0.2);
      svg += `<path d="M${n(bx)} ${n(by)} h110 l-24 20 h-62z" fill="${['#b5603f', '#f5efe4', '#4a5233', '#9a7443', '#23221f'][i]}"/><line x1="${n(bx + 55)}" y1="${n(by)}" x2="${n(bx + 55)}" y2="${n(by - 90)}" stroke="#2b2924" stroke-width="3"/>`;
    }
  }
  const rows = 4;
  for (let row = 0; row < rows; row++) {
    const y = H * (0.5 + row * 0.1);
    let x = -20;
    while (x < W) {
      const w = 80 + r() * 90;
      const h = 70 + r() * 80;
      const wall = mix('#efe5d3', ['#d9a98a', '#e6d3b0', '#c98d6a'][Math.floor(r() * 3)], 0.4);
      svg += `<rect x="${n(x)}" y="${n(y - h)}" width="${n(w)}" height="${n(h + 90)}" fill="${wall}"/><polygon points="${n(x - 6)},${n(y - h)} ${n(x + w / 2)},${n(y - h - 36)} ${n(x + w + 6)},${n(y - h)}" fill="${mix('#b5603f', '#7c3f2b', r())}"/><rect x="${n(x + w * 0.3)}" y="${n(y - h * 0.6)}" width="${n(w * 0.16)}" height="${n(h * 0.35)}" fill="#3a4448"/>`;
      x += w + 6 + r() * 10;
    }
  }
  svg += [0.06, 0.92].map((p) => cypress(W * p, H, 480, '#2f3623')).join('');
  return frame(svg, mood);
}

function trail({ seed, mood }: Opt) {
  const r = rng(seed);
  let svg = mountain({ seed, mood }, { lodge: false });
  svg = svg.replace('</svg>', '');
  svg += `<path d="M${W * 0.5} ${H * 0.62} C${W * 0.35} ${H * 0.72} ${W * 0.7} ${H * 0.8} ${W * 0.45} ${H * 0.9} S${W * 0.3} ${H} ${W * 0.35} ${H}" stroke="#e8dcc7" stroke-width="26" fill="none" opacity=".85"/>`;
  for (let i = 0; i < 40; i++) svg += `<circle cx="${n(r() * W)}" cy="${n(H * 0.9 + r() * H * 0.1)}" r="${n(3 + r() * 6)}" fill="${['#b5603f', '#e9c98f', '#fff'][i % 3]}" opacity=".8"/>`;
  return svg + '</svg>';
}

function market({ seed, mood }: Opt) {
  const r = rng(seed);
  let svg = `<rect width="${W}" height="${H}" fill="#e9dfcb"/><rect y="${H * 0.7}" width="${W}" height="${H * 0.3}" fill="#c4ae8b"/>`;
  for (let i = 0; i < 6; i++) {
    const x = W * (0.03 + i * 0.16);
    const c = ['#b5603f', '#4a5233', '#9a7443', '#f5efe4', '#7c3f2b', '#c98d6a'][i];
    svg += `<polygon points="${x},${H * 0.28} ${x + 220},${H * 0.28} ${x + 250},${H * 0.4} ${x - 30},${H * 0.4}" fill="${c}"/>` + Array.from({ length: 5 }, (_, k) => `<rect x="${x - 30 + k * 56}" y="${H * 0.4}" width="28" height="18" rx="9" fill="${c}"/>`).join('') + `<rect x="${x - 10}" y="${H * 0.62}" width="240" height="${H * 0.1}" fill="#6e5a46"/>`;
    for (let k = 0; k < 9; k++) svg += `<circle cx="${n(x + 10 + (k % 5) * 44 + r() * 8)}" cy="${n(H * 0.6 - Math.floor(k / 5) * 26)}" r="${n(18 + r() * 8)}" fill="${['#b5603f', '#9bab5c', '#e9c98f', '#7a8460'][(k + i) % 4]}"/>`;
  }
  return frame(svg, mood);
}

function textureLeaf({ seed }: Opt) {
  const r = rng(seed);
  let svg = `<rect width="${W}" height="${H}" fill="#3a4130"/>`;
  for (let i = 0; i < 28; i++) {
    const x = r() * W;
    const y = r() * H;
    const a = r() * 360;
    svg += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(a)})"><path d="M0 0 C60 -90 200 -90 280 0 C200 90 60 90 0 0Z" fill="${mix('#4a5233', '#9aa56b', r())}" opacity=".85"/><path d="M0 0 H280" stroke="#2f3623" stroke-width="3"/></g>`;
  }
  return frame(svg, 'day');
}

/* ---------- manifest ---------- */
interface Art {
  file: string;
  svg: () => string;
  width?: number;
}

const D = (seed: number, mood: Mood): Opt => ({ seed, mood });
const art: Art[] = [
  // heroes & brand
  { file: 'hero-coast', svg: () => coast(D(7, 'dusk'), { villas: 3, pool: true }), width: 2000 },
  { file: 'hero-mountain', svg: () => mountain(D(21, 'dawn'), { lake: true }), width: 2000 },
  { file: 'hero-pool', svg: () => pool(D(5, 'day')), width: 2000 },
  { file: 'og-image', svg: () => coast(D(7, 'dusk'), { villas: 3 }), width: 1200 },
  // introduction / editorial
  { file: 'intro-arches', svg: () => arch(D(3, 'day'), { count: 4 }) },
  { file: 'intro-courtyard', svg: () => arch(D(9, 'dawn'), { count: 3, fountain: true }) },
  { file: 'intro-villa', svg: () => coast(D(12, 'day'), { villas: 2 }) },
  { file: 'terrace-night', svg: () => coast(D(33, 'night'), { villas: 3, boat: false }) },
  // rooms
  { file: 'room-garden-king-1', svg: () => room(D(1, 'day'), { view: 'garden' }) },
  { file: 'room-garden-king-2', svg: () => bath(D(1, 'day')) },
  { file: 'room-garden-king-3', svg: () => arch(D(15, 'day'), { count: 2 }) },
  { file: 'room-garden-twin-1', svg: () => room(D(2, 'day'), { view: 'garden', bed: 'twin' }) },
  { file: 'room-garden-twin-2', svg: () => bath(D(2, 'dawn')) },
  { file: 'room-garden-twin-3', svg: () => arch(D(16, 'dawn'), { count: 3 }) },
  { file: 'room-sea-deluxe-1', svg: () => room(D(3, 'dusk'), { view: 'sea' }) },
  { file: 'room-sea-deluxe-2', svg: () => coast(D(17, 'day'), { villas: 1 }) },
  { file: 'room-sea-deluxe-3', svg: () => bath(D(3, 'dusk')) },
  { file: 'room-terrace-suite-1', svg: () => room(D(4, 'dawn'), { view: 'sea', suite: true }) },
  { file: 'room-terrace-suite-2', svg: () => coast(D(18, 'dawn'), { villas: 2, palms: true }) },
  { file: 'room-terrace-suite-3', svg: () => bath(D(4, 'day')) },
  { file: 'room-pool-villa-1', svg: () => room(D(5, 'day'), { view: 'sea', suite: true, bath: true }) },
  { file: 'room-pool-villa-2', svg: () => pool(D(19, 'dusk')) },
  { file: 'room-pool-villa-3', svg: () => bath(D(5, 'dawn')) },
  { file: 'room-family-1', svg: () => room(D(6, 'day'), { view: 'garden', bed: 'twin', suite: true }) },
  { file: 'room-family-2', svg: () => arch(D(20, 'day'), { count: 4, fountain: true }) },
  { file: 'room-family-3', svg: () => bath(D(6, 'day')) },
  { file: 'room-loft-1', svg: () => room(D(7, 'dawn'), { view: 'mountain' }) },
  { file: 'room-loft-2', svg: () => mountain(D(22, 'day'), { lodge: true }) },
  { file: 'room-loft-3', svg: () => bath(D(7, 'night')) },
  { file: 'room-owners-1', svg: () => room(D(8, 'dusk'), { view: 'sea', suite: true, bath: true }) },
  { file: 'room-owners-2', svg: () => coast(D(23, 'dusk'), { villas: 3, pool: true }) },
  { file: 'room-owners-3', svg: () => pool(D(24, 'dawn')) },
  { file: 'room-wellness-1', svg: () => room(D(9, 'day'), { view: 'garden', bath: true }) },
  { file: 'room-wellness-2', svg: () => spa(D(25, 'night')) },
  { file: 'room-wellness-3', svg: () => textureLeaf(D(26, 'day')) },
  { file: 'room-cabin-1', svg: () => room(D(10, 'dawn'), { view: 'mountain', suite: true }) },
  { file: 'room-cabin-2', svg: () => mountain(D(27, 'dusk'), { lodge: true, lake: true }) },
  { file: 'room-cabin-3', svg: () => bath(D(10, 'dusk')) },
  // dining
  { file: 'dining-terrace', svg: () => dining(D(11, 'dusk'), { terrace: true }) },
  { file: 'dining-olive-room', svg: () => dining(D(12, 'night')) },
  { file: 'dining-bar', svg: () => dining(D(13, 'night'), { bar: true }) },
  { file: 'dining-breakfast', svg: () => dining(D(14, 'day'), { terrace: true }) },
  { file: 'dining-table', svg: () => dining(D(15, 'dusk')) },
  { file: 'food-1', svg: () => food(D(31, 'day')) },
  { file: 'food-2', svg: () => food(D(32, 'day'), { palette: ['#9a7443', '#b5603f', '#f5efe4', '#4a5233'] }) },
  { file: 'food-3', svg: () => food(D(33, 'day'), { palette: ['#4a5233', '#e9c98f', '#b5603f', '#7a8460'] }) },
  // wellness & experiences
  { file: 'spa-hammam', svg: () => spa(D(41, 'night')) },
  { file: 'spa-bath', svg: () => bath(D(42, 'day')) },
  { file: 'spa-garden', svg: () => textureLeaf(D(43, 'day')) },
  { file: 'exp-sailing', svg: () => coast(D(51, 'day'), { villas: 0, boat: true, palms: false }) },
  { file: 'exp-hiking', svg: () => trail(D(52, 'dawn')) },
  { file: 'exp-market', svg: () => market(D(53, 'day')) },
  { file: 'exp-cooking', svg: () => food(D(54, 'day'), { palette: ['#9bab5c', '#e9c98f', '#b5603f', '#f5efe4'] }) },
  { file: 'exp-sunset', svg: () => coast(D(55, 'dusk'), { villas: 1, boat: true }) },
  { file: 'exp-stargazing', svg: () => mountain(D(56, 'night'), { lodge: true }) },
  { file: 'exp-yoga', svg: () => pool(D(57, 'dawn')) },
  { file: 'exp-dinner', svg: () => dining(D(58, 'night'), { terrace: true }) },
  { file: 'exp-olive', svg: () => arch(D(59, 'dusk'), { count: 5 }) },
  // destination
  { file: 'dest-village', svg: () => village(D(61, 'day'), { harbor: true }) },
  { file: 'dest-hills', svg: () => village(D(62, 'dusk')) },
  { file: 'dest-cove', svg: () => coast(D(63, 'day'), { villas: 0, palms: false }) },
  { file: 'dest-peak', svg: () => mountain(D(64, 'day')) },
  { file: 'dest-market', svg: () => market(D(65, 'dawn')) },
  { file: 'dest-lake', svg: () => mountain(D(66, 'dawn'), { lake: true, lodge: false }) },
  // journal
  { file: 'journal-1', svg: () => food(D(71, 'day')) },
  { file: 'journal-2', svg: () => village(D(72, 'dawn'), { harbor: true }) },
  { file: 'journal-3', svg: () => trail(D(73, 'day')) },
  { file: 'journal-4', svg: () => spa(D(74, 'night')) },
  { file: 'journal-5', svg: () => coast(D(75, 'dawn'), { villas: 2 }) },
  { file: 'journal-6', svg: () => textureLeaf(D(76, 'day')) },
  // people-free story images
  { file: 'about-story', svg: () => arch(D(81, 'dusk'), { count: 4 }) },
  { file: 'about-sustain', svg: () => textureLeaf(D(82, 'day')) },
  { file: 'about-team', svg: () => dining(D(83, 'day')) },
  { file: 'offer-couples', svg: () => coast(D(91, 'dusk'), { villas: 1, boat: true }) },
  { file: 'offer-family', svg: () => pool(D(92, 'day')) },
  { file: 'offer-wellness', svg: () => spa(D(93, 'night')) },
  { file: 'offer-extended', svg: () => mountain(D(94, 'dawn'), { lake: true }) },
  { file: 'offer-seasonal', svg: () => village(D(95, 'dusk')) },
  { file: 'offer-early', svg: () => arch(D(96, 'dawn'), { count: 3 }) },
];

async function main() {
  let total = 0;
  for (const a of art) {
    const svg = a.svg();
    const width = a.width ?? 1600;
    const buf = await sharp(Buffer.from(svg), { density: 72 }).resize({ width }).webp({ quality: 74, effort: 5 }).toBuffer();
    writeFileSync(resolve(out, `${a.file}.webp`), buf);
    total += buf.length;
  }
  // brand marks
  const green = '#3f4730';
  const mark = (bg: string, fg: string, rx: number) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${rx}" fill="${bg}"/><path d="M14 46 V28 a18 18 0 0 1 36 0 V46" fill="none" stroke="${fg}" stroke-width="4.5" stroke-linecap="round"/><path d="M24 46 V32 a8 8 0 0 1 16 0 V46" fill="none" stroke="${fg}" stroke-width="4.5" stroke-linecap="round"/><path d="M10 46 H54" stroke="${fg}" stroke-width="4.5" stroke-linecap="round"/></svg>`;
  writeFileSync(resolve(root, 'public/favicon.svg'), mark(green, '#f5efe4', 14));
  writeFileSync(resolve(root, 'public/logo-mark.svg'), mark('none', 'currentColor', 0));
  await sharp(Buffer.from(mark(green, '#f5efe4', 0)), { density: 300 }).resize(180, 180).png().toFile(resolve(root, 'public/apple-touch-icon.png'));
  console.log(`Wrote ${art.length} images (${(total / 1048576).toFixed(2)} MB) to public/images`);
}
void main();
