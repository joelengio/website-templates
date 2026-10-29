/**
 * Generates public/sitemap.xml and public/robots.txt from the template config so they always match your site URL,
 * enabled pages, courses, instructors and articles. Runs automatically before `npm run build`.
 * Private/demo dashboard routes (/learn/*) are excluded from the sitemap and disallowed in robots.txt.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { site } from '../src/config/site';
import { pages } from '../src/config/layout';
import { courses } from '../src/config/courses';
import { instructors } from '../src/config/instructors';
import { articles } from '../src/config/content';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = site.url.replace(/\/$/, '');

const paths: string[] = [];
if (pages.home) paths.push('/');
if (pages.courses) paths.push('/courses', ...courses.map((c) => `/courses/${c.slug}`));
if (pages.instructors) paths.push('/instructors', ...instructors.map((i) => `/instructors/${i.slug}`));
if (pages.paths) paths.push('/paths');
if (pages.plans) paths.push('/plans');
if (pages.about) paths.push('/about');
if (pages.journal) paths.push('/journal', ...articles.map((a) => `/journal/${a.slug}`));
if (pages.contact) paths.push('/contact');

const today = new Date().toISOString().slice(0, 10);
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  paths.map((p) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
writeFileSync(resolve(root, 'public/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /learn\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`SEO: wrote sitemap.xml (${paths.length} URLs) and robots.txt for ${base}`);
