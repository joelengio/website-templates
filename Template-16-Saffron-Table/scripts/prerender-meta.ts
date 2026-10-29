/**
 * After `vite build`, writes one HTML file per route (dist/<route>.html) with page-specific <title>,
 * description, canonical and Open Graph tags so crawlers/social previews see correct metadata without
 * running JavaScript. Firebase `cleanUrls` serves /menus from menus.html; everything else falls back to
 * the SPA rewrite. The React app still takes over at runtime.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abs, allRoutes, type RouteMeta } from './routes';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function render(r: RouteMeta): string {
  const url = abs(r.path);
  const img = abs(r.image);
  let html = template;
  const sub = (re: RegExp, replacement: string) => {
    if (!re.test(html)) throw new Error(`Template tag not found: ${re}`);
    html = html.replace(re, replacement);
  };
  sub(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  sub(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(r.description)}"`);
  sub(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  sub(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(r.title)}"`);
  sub(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(r.description)}"`);
  sub(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="${r.type}"`);
  sub(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  sub(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${img}"`);
  if (!r.indexable) html = html.replace('</head>', '    <meta name="robots" content="noindex, nofollow" />\n  </head>');
  return html;
}

let count = 0;
for (const r of allRoutes()) {
  if (r.path === '/') {
    writeFileSync(join(dist, 'index.html'), render(r));
  } else {
    const file = join(dist, `${r.path.slice(1)}.html`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, render(r));
  }
  count++;
}
console.log(`Prerendered metadata for ${count} routes`);
