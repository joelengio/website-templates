/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { site } from './src/config/site.ts';
import { theme } from './src/config/theme.ts';

const base = site.url.replace(/\/$/, '');
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const abs = (p: string) => (/^https?:\/\//.test(p) ? p : `${base}${p}`);

/** Keeps the static <head> of index.html (what crawlers and link previews read first) in sync with src/config. */
function seoHead(): Plugin {
  return {
    name: 'aurel-seo-head',
    transformIndexHtml(html) {
      const head = [
        `<title>${esc(site.seo.defaultTitle)}</title>`,
        `<meta name="description" content="${esc(site.seo.description)}" />`,
        `<link rel="canonical" href="${base}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${esc(site.brand.name)}" />`,
        `<meta property="og:title" content="${esc(site.seo.defaultTitle)}" />`,
        `<meta property="og:description" content="${esc(site.seo.description)}" />`,
        `<meta property="og:url" content="${base}/" />`,
        `<meta property="og:image" content="${esc(abs(site.seo.ogImage))}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(site.seo.defaultTitle)}" />`,
        `<meta name="twitter:description" content="${esc(site.seo.description)}" />`,
        `<meta name="twitter:image" content="${esc(abs(site.seo.ogImage))}" />`,
      ].join('\n    ');
      return html
        .replace(/<meta name="theme-color"[^>]*>/, `<meta name="theme-color" content="${theme.colors.forest}" />`)
        .replace(/<title>[\s\S]*?<\/title>[\s\S]*?<meta name="twitter:card"[^>]*>/, head)
        .replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript><p style="padding:2rem;font-family:sans-serif">${esc(site.brand.name)} needs JavaScript enabled to display this website.</p></noscript>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), seoHead()],
  build: { sourcemap: false, chunkSizeWarningLimit: 700 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
