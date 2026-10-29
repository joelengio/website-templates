// Creates the single canonical hand-off archive: handoff/OneStop-Infinite-Template-10-Serene-House.zip (+ .sha256)
// The project sits at the archive root (no enclosing folder). Excluded: node_modules, dist, VCS data, local env files,
// credentials, test output, other archives and the handoff folder itself. The archive is integrity-tested after creation.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'handoff');
const name = 'OneStop-Infinite-Template-10-Serene-House.zip';
const outFile = path.join(outDir, name);

// documentation/review holds the large QA screenshot sheets (kept in git, not shipped inside the site archive).
const excludedDirs = new Set(['node_modules', 'dist', '.git', 'handoff', 'documentation', 'e2e-output', 'coverage', '.firebase', '.vite']);
const excludedFile = (f) =>
  /\.(zip|tgz|gz|7z|rar|tsbuildinfo|log|pem|key)$/i.test(f) || f === '.DS_Store' || f === '.firebaserc' || (/^\.env/.test(f) && f !== '.env.example');

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir).sort()) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!excludedDirs.has(entry)) walk(full, acc);
    } else if (!excludedFile(entry)) acc.push(path.relative(root, full));
  }
  return acc;
}

mkdirSync(outDir, { recursive: true });
if (existsSync(outFile)) rmSync(outFile);
execFileSync('zip', ['-X', '-q', outFile, '-@'], { cwd: root, input: walk(root).join('\n') + '\n' });

execFileSync('unzip', ['-tq', outFile], { stdio: 'inherit' });
const listing = execFileSync('unzip', ['-Z1', outFile], { encoding: 'utf8' }).split('\n').filter(Boolean);
const bad = listing.filter((p) => /(^|\/)(node_modules|dist|\.git)\//.test(p) || /\.zip$/i.test(p) || /(^|\/)\.env(\.|$)(?!example)/.test(p));
if (bad.length) throw new Error(`Forbidden entries in archive: ${bad.join(', ')}`);
if (listing.some((p) => p.startsWith('Template-10-Serene-House/'))) throw new Error('Archive must not contain the enclosing folder');
for (const must of ['package.json', 'package-lock.json', 'index.html', 'README.md']) if (!listing.includes(must)) throw new Error(`${must} missing at archive root`);

const sha = createHash('sha256').update(readFileSync(outFile)).digest('hex');
writeFileSync(`${outFile}.sha256`, `${sha}  ${name}\n`);
console.log(`Created ${path.relative(root, outFile)} — ${listing.length} files, ${(statSync(outFile).size / 1048576).toFixed(2)} MB\nSHA-256 ${sha}`);
