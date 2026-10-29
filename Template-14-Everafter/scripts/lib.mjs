// Shared helpers for the browser scripts (e2e + visual review).
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

export const routesFromConfig = async () => {
  // Reads route slugs out of the built sitemap so scripts always follow the real site configuration.
  const xml = await (await fetch(process.env.BASE + '/sitemap.xml')).text();
  return [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
};

export async function startServer(port) {
  const base = `http://localhost:${port}`;
  process.env.BASE = base;
  const server = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
  process.on('exit', () => server.kill());
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(base)).ok) break; } catch { /* waiting for server */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  return { base, stop: () => server.kill() };
}

export async function launch() {
  const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].find((p) => p && existsSync(p));
  return chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
}

/** Opens a URL, scrolls through the page so reveal animations and lazy images run, then returns to the top. */
export async function open(page, base, url) {
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
  // Settle reveal animations so screenshots and contrast checks see final colours.
  await page.addStyleTag({ content: '.reveal{transition:none !important}' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')));
  await page.waitForTimeout(250);
}
