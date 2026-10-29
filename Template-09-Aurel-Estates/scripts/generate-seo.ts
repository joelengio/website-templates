/**
 * Generates public/sitemap.xml and public/robots.txt from the template config so they always match
 * your site URL, enabled pages and property data. Runs automatically before `npm run build`.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { site } from '../src/config/site';
import { pages } from '../src/config/layout';
import { properties } from '../src/config/properties';
import { articles } from '../src/config/content';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = site.url.replace(/\/$/, '');

const paths: string[] = [];
if (pages.home) paths.push('/');
if (pages.properties) paths.push('/properties', ...properties.map((p) => `/properties/${p.slug}`));
if (pages.services) paths.push('/services');
if (pages.about) paths.push('/about');
if (pages.journal) paths.push('/journal', ...articles.map((a) => `/journal/${a.slug}`));
if (pages.contact) paths.push('/contact');

const today = new Date().toISOString().slice(0, 10);
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  paths.map((p) => `  <url><loc>${base}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
writeFileSync(
  resolve(root, 'public/robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /favorites\nDisallow: /compare\n\nSitemap: ${base}/sitemap.xml\n`,
);
console.log(`SEO: wrote sitemap.xml (${paths.length} URLs) and robots.txt for ${base}`);
