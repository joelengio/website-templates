// Minimal static server that mimics Firebase Hosting for local testing: serves ./dist, applies the rewrites and
// response headers from firebase.json (including the Content-Security-Policy), and falls back to /index.html for
// client-side routes. Usage: npm run build && npm run serve:dist   (PORT env var, default 4173)
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const port = Number(process.env.PORT || 4173);
const config = JSON.parse(readFileSync(path.resolve('firebase.json'), 'utf8')).hosting;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };

const globToRegex = (g) => {
  let re = '';
  for (let i = 0; i < g.length; i++) {
    if (g.startsWith('**/', i)) { re += '(?:.*/)?'; i += 2; }
    else if (g.startsWith('**', i)) { re += '.*'; i += 1; }
    else if (g[i] === '*') re += '[^/]*';
    else if (g.startsWith('@(', i)) { const end = g.indexOf(')', i); re += `(?:${g.slice(i + 2, end)})`; i = end; }
    else re += g[i].replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^/?${re.replace(/^\/+/, '')}$`);
};
const headerRules = (config.headers || []).map((h) => ({ re: globToRegex(h.source), headers: h.headers }));

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let rel = decodeURIComponent(url.pathname);
  let file = path.join(root, rel);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let status = 200;
  if (!existsSync(file)) {
    if (path.extname(rel)) { status = 404; file = ''; } else { file = path.join(root, 'index.html'); rel = '/index.html'; }
  }
  const headers = {};
  for (const r of headerRules) if (r.re.test(rel.replace(/^\//, ''))) for (const h of r.headers) headers[h.key] = h.value;
  if (!file) { res.writeHead(404, { ...headers, 'Content-Type': 'text/plain' }).end('Not found'); return; }
  headers['Content-Type'] = types[path.extname(file)] || 'application/octet-stream';
  res.writeHead(status, headers).end(readFileSync(file));
}).listen(port, '127.0.0.1', () => console.log(`Serving dist/ on http://127.0.0.1:${port}`));
