/**
 * Generates public/sitemap.xml and public/robots.txt from the template configuration so they always match
 * your site URL, enabled pages and content. Runs automatically before `npm run build`.
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/config/layout';
import { rooms } from '../src/config/rooms';
import { venues } from '../src/config/dining';
import { experiences } from '../src/config/experiences';
import { offers } from '../src/config/offers';
import { articles } from '../src/config/content';
import { site } from '../src/config/site';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = site.url.replace(/\/$/, '');

const paths: string[] = ['/'];
if (pages.rooms) paths.push('/rooms', ...rooms.filter((r) => r.units > 0).map((r) => `/rooms/${r.slug}`));
if (pages.booking) paths.push('/booking');
if (pages.offers) paths.push('/offers', ...offers.map((o) => `/offers/${o.slug}`));
if (pages.dining) paths.push('/dining', ...venues.map((v) => `/dining/${v.slug}`));
if (pages.experiences) paths.push('/experiences', ...experiences.map((e) => `/experiences/${e.slug}`));
if (pages.gallery) paths.push('/gallery');
if (pages.about) paths.push('/about');
if (pages.explore) paths.push('/explore');
if (pages.journal) paths.push('/journal', ...articles.map((a) => `/journal/${a.slug}`));
if (pages.contact) paths.push('/contact');

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
writeFileSync(resolve(root, 'public/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /reservations\nDisallow: /booking/confirmation/\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`SEO: wrote sitemap.xml (${paths.length} URLs) and robots.txt for ${base}`);
