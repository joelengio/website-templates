/**
 * Captures labelled screenshots of the key screens at mobile (390 px) and desktop (1440 px) and composes them into contact sheets
 * in review/. Requires a running preview server:  npm run build && npm run preview  (then in another shell)  npm run review
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Page } from '@playwright/test';
import sharp from 'sharp';
import { rooms } from '../src/config/rooms';
import { availability } from '../src/lib/availability';
import { addDays } from '../src/lib/dates';
import { today } from '../src/lib/stay';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'review');
const base = process.env.REVIEW_URL ?? 'http://127.0.0.1:4173';
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (/^(desktop|mobile)-sheet-\d+\.jpg$/.test(f)) rmSync(resolve(out, f));

const open = (id: string, nights = 3) => {
  const room = rooms.find((r) => r.id === id)!;
  for (let d = 14; d < 300; d++) {
    const checkIn = addDays(today(), d);
    const checkOut = addDays(checkIn, nights);
    if (availability(room, checkIn, checkOut).left >= 1) return { checkIn, checkOut };
  }
  throw new Error('no stay');
};
const stay = open('sea-deluxe');
const qs = `in=${stay.checkIn}&out=${stay.checkOut}&adults=2&children=0`;

interface Shot {
  label: string;
  path: string;
  prep?: (p: Page) => Promise<void>;
  full?: boolean;
}
const freeze = (p: Page) => p.addStyleTag({ content: '*{transition:none!important;animation:none!important}.js .reveal{opacity:1!important;transform:none!important}' });
const settle = async (p: Page) => {
  await freeze(p);
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(300);
};

const shots: Shot[] = [
  { label: 'Home', path: '/', full: true },
  { label: 'Rooms & Suites', path: '/rooms', full: true },
  { label: 'Rooms — filtered (Suites)', path: '/rooms?cat=Suites', full: true },
  { label: 'Room detail', path: '/rooms/sea-view-deluxe', full: true },
  { label: 'Calendar open', path: '/booking', prep: async (p) => void (await p.getByRole('button', { name: /Check-in/ }).first().click()) },
  { label: 'Booking — room & rate', path: `/booking?${qs}&room=sea-deluxe`, full: true },
  {
    label: 'Booking — your details',
    path: `/booking?${qs}&room=sea-deluxe`,
    prep: async (p) => {
      await p.getByRole('button', { name: /^Select Sea View Deluxe, Flexible Rate/ }).click();
      await p.getByLabel('First name').waitFor();
    },
  },
  {
    label: 'Booking — review',
    path: `/booking?${qs}&room=sea-deluxe`,
    full: true,
    prep: async (p) => {
      await p.getByRole('button', { name: /^Select Sea View Deluxe, Flexible Rate/ }).click();
      await p.getByLabel('First name').fill('Ada');
      await p.getByLabel('Last name').fill('Lovelace');
      await p.getByLabel('Email').fill('ada@example.com');
      await p.getByLabel('Phone').fill('+44 20 7946 0000');
      await p.getByRole('button', { name: 'Review reservation' }).click();
      await p.getByRole('heading', { name: 'Review your reservation' }).waitFor();
    },
  },
  {
    label: 'Confirmation (demo)',
    path: `/booking?${qs}&room=sea-deluxe`,
    full: true,
    prep: async (p) => {
      await p.getByRole('button', { name: /^Select Sea View Deluxe, Flexible Rate/ }).click();
      await p.getByLabel('First name').fill('Ada');
      await p.getByLabel('Last name').fill('Lovelace');
      await p.getByLabel('Email').fill('ada@example.com');
      await p.getByLabel('Phone').fill('+44 20 7946 0000');
      await p.getByRole('button', { name: 'Review reservation' }).click();
      await p.getByRole('checkbox').check();
      await p.getByRole('button', { name: 'Confirm demonstration booking' }).click();
      await p.getByText('Not a real booking.').waitFor();
    },
  },
  { label: 'Manage reservations', path: '/reservations', full: true },
  { label: 'Offers', path: '/offers', full: true },
  { label: 'Offer detail + eligibility', path: '/offers/family-vacation', full: true },
  { label: 'Dining', path: '/dining', full: true },
  { label: 'Venue + menu', path: '/dining/olive-room', full: true },
  { label: 'Experiences', path: '/experiences', full: true },
  { label: 'Experience detail', path: '/experiences/hammam-ritual', full: true },
  { label: 'Gallery', path: '/gallery', full: true },
  { label: 'Lightbox', path: '/gallery', prep: async (p) => void (await p.getByRole('button', { name: /Open Terraces at dusk/ }).click()) },
  { label: 'About', path: '/about', full: true },
  { label: 'Explore', path: '/explore', full: true },
  { label: 'Journal', path: '/journal', full: true },
  { label: 'Contact & FAQ', path: '/contact', full: true },
  { label: '404', path: '/no-such-page' },
];

interface Tile {
  label: string;
  data: Buffer;
  w: number;
  h: number;
}

async function capture(kind: 'desktop' | 'mobile') {
  const vp = kind === 'desktop' ? { width: 1440, height: 900 } : { width: 390, height: 844 };
  const maxH = kind === 'desktop' ? 3600 : 3800;
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  const tiles: Tile[] = [];
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(base + s.path);
    await page.locator('h1, h2').first().waitFor();
    if (s.prep) await s.prep(page);
    if (s.full) await settle(page);
    else await freeze(page);
    const png = await page.screenshot({ fullPage: !!s.full });
    const meta = await sharp(png).metadata();
    const h = Math.min(meta.height!, maxH);
    const data = await sharp(png).extract({ left: 0, top: 0, width: meta.width!, height: h }).toBuffer();
    tiles.push({ label: `${s.label}${(meta.height ?? 0) > maxH ? ' (top of page)' : ''}`, data, w: meta.width!, h });
    await ctx.close();
  }
  await browser.close();
  return tiles;
}

async function sheet(kind: 'desktop' | 'mobile', tiles: Tile[]) {
  const perSheet = kind === 'desktop' ? 4 : 8;
  const cols = kind === 'desktop' ? 2 : 4;
  const tileW = kind === 'desktop' ? 720 : 300;
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  let n = 0;
  for (let i = 0; i < tiles.length; i += perSheet) {
    const chunk = tiles.slice(i, i + perSheet);
    const cells = await Promise.all(
      chunk.map(async (t) => {
        const img = await sharp(t.data).resize({ width: tileW }).jpeg({ quality: 80 }).toBuffer();
        return `<figure><figcaption>${t.label}</figcaption><img src="data:image/jpeg;base64,${img.toString('base64')}" width="${tileW}"></figure>`;
      }),
    );
    const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#1e1d1a;font:600 15px system-ui;color:#fff;width:${cols * (tileW + 24) + 24}px}
h1{font:600 20px system-ui;margin:0 0 18px}.g{display:grid;grid-template-columns:repeat(${cols},${tileW}px);gap:24px;align-items:start}figure{margin:0}figcaption{padding:6px 0 8px;color:#f2d3b8}img{display:block;border:1px solid #555}</style>
<h1>Haven Stays — ${kind === 'desktop' ? 'Desktop 1440 px' : 'Mobile 390 px'} · sheet ${++n}</h1><div class="g">${cells.join('')}</div>`;
    const p = await browser.newPage();
    await p.setContent(html);
    const png = await p.screenshot({ fullPage: true });
    writeFileSync(resolve(out, `${kind}-sheet-${n}.jpg`), await sharp(png).jpeg({ quality: 82 }).toBuffer());
    await p.close();
  }
  await browser.close();
  return n;
}

async function main() {
  for (const kind of ['desktop', 'mobile'] as const) {
    const tiles = await capture(kind);
    const n = await sheet(kind, tiles);
    console.log(`${kind}: ${tiles.length} screens → ${n} contact sheets in review/`);
  }
}
void main();
