/**
 * Builds the single canonical hand-off archive:
 *   handoff/OneStop-Infinite-Template-13-Folio-Finance.zip
 * The project sits at the archive root (no enclosing folder) and excludes node_modules, dist, .git,
 * env files, credentials, other archives and the handoff folder itself.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'handoff');
const name = 'OneStop-Infinite-Template-13-Folio-Finance.zip';
const out = join(outDir, name);

const excludedDirs = new Set(['node_modules', 'dist', '.git', 'handoff', 'review', 'playwright-report', 'test-results', '.firebase', '.vite']);
const excludedFile = (f: string) =>
  /\.(zip|tgz|gz|7z|rar|tsbuildinfo|log|pem|key)$/i.test(f) || f === '.DS_Store' || f === '.firebaserc' || (/^\.env/.test(f) && f !== '.env.example');

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!excludedDirs.has(entry)) walk(full, acc);
    } else if (!excludedFile(entry)) acc.push(relative(root, full));
  }
  return acc;
}

const files = walk(root);
mkdirSync(outDir, { recursive: true });
if (existsSync(out)) rmSync(out);
execFileSync('zip', ['-X', '-q', out, '-@'], { cwd: root, input: files.join('\n') + '\n' });

execFileSync('unzip', ['-tq', out], { stdio: 'inherit' });
const listing = execFileSync('unzip', ['-Z1', out], { encoding: 'utf8' }).split('\n').filter(Boolean);
const bad = listing.filter((p) => /(^|\/)(node_modules|dist|\.git)\//.test(p) || /\.zip$/i.test(p) || /(^|\/)\.env(\.|$)(?!example)/.test(p));
if (bad.length) throw new Error(`Forbidden entries in archive: ${bad.join(', ')}`);
if (listing.some((p) => p.startsWith('Template-13-Folio-Finance/'))) throw new Error('Archive must not contain the enclosing folder');
if (!listing.includes('package.json') || !listing.includes('package-lock.json')) throw new Error('package.json / lockfile missing at archive root');

const sha = createHash('sha256').update(readFileSync(out)).digest('hex');
writeFileSync(`${out}.sha256`, `${sha}  ${name}\n`);
console.log(`Wrote ${relative(root, out)} — ${listing.length} files, ${(statSync(out).size / 1048576).toFixed(2)} MB\nSHA-256: ${sha}`);
