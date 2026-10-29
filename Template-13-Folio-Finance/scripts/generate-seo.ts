/**
 * Generates public/sitemap.xml and public/robots.txt from the template config so they always match your site URL,
 * enabled pages, services, team, industries and articles. Runs automatically before `npm run build`.
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../src/config/articles';
import { industries } from '../src/config/industries';
import { pages } from '../src/config/layout';
import { services } from '../src/config/services';
import { site } from '../src/config/site';
import { team } from '../src/config/team';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = site.url.replace(/\/$/, '');

const paths: string[] = ['/'];
if (pages.services) paths.push('/services', ...services.map((s) => `/services/${s.slug}`));
if (pages.industries) paths.push('/industries', ...industries.map((i) => `/industries/${i.slug}`));
if (pages.about) paths.push('/about');
if (pages.team) paths.push('/team', ...team.map((m) => `/team/${m.slug}`));
if (pages.pricing) paths.push('/pricing');
if (pages.tools) paths.push('/tools');
if (pages.insights) paths.push('/insights', ...articles.map((a) => `/insights/${a.slug}`));
if (pages.booking) paths.push('/book');
if (pages.contact) paths.push('/contact');
if (pages.disclaimer) paths.push('/disclaimer');

const today = new Date().toISOString().slice(0, 10);
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  paths.map((p) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
writeFileSync(
  resolve(root, 'public/robots.txt'),
  `User-agent: *\n${site.seo.noindexDemo ? 'Disallow: /' : 'Allow: /'}\n\nSitemap: ${base}/sitemap.xml\n`,
);
console.log(`SEO: wrote sitemap.xml (${paths.length} URLs) and robots.txt for ${base}`);
