/** Writes public/sitemap.xml and public/robots.txt from src/config (run automatically before build). */
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abs, allRoutes } from './routes';
import { site } from '../src/config/site';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const routes = allRoutes().filter((r) => r.indexable);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url>\n    <loc>${abs(r.path)}</loc>${r.lastmod ? `\n    <lastmod>${r.lastmod}</lastmod>` : ''}\n    <priority>${r.path === '/' ? '1.0' : r.path.split('/').length > 2 ? '0.6' : '0.8'}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`;
writeFileSync(join(root, 'public/sitemap.xml'), xml);

const robots = `# ${site.brand.name} — demonstration site
User-agent: *
Allow: /
Disallow: /order
Disallow: /reserve/manage

Sitemap: ${abs('/sitemap.xml')}
`;
writeFileSync(join(root, 'public/robots.txt'), robots);
console.log(`SEO: wrote sitemap.xml (${routes.length} URLs) and robots.txt for ${site.url}`);
