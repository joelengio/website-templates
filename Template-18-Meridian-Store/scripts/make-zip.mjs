// Creates the single canonical hand-off archive: handoff/OneStop-Infinite-Template-18-Meridian-Store.zip (+ .sha256).
// The project sits at archive root. Excludes node_modules, dist, VCS data, local env files, test output, screenshots and the handoff folder itself.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'handoff');
const name = 'OneStop-Infinite-Template-18-Meridian-Store.zip';
const outFile = path.join(outDir, name);
mkdirSync(outDir, { recursive: true });
for (const f of [outFile, `${outFile}.sha256`]) if (existsSync(f)) rmSync(f);

const excludes = ['node_modules/*', 'dist/*', '.git/*', 'handoff/*', 'e2e-output/*', 'review/*', 'coverage/*', '.firebase/*', '.env', '.env.local', '.env.*.local', '*.log', '*.tsbuildinfo', '.DS_Store', '*.zip'];
execFileSync('zip', ['-r', '-X', '-q', outFile, '.', '-x', ...excludes], { cwd: root, stdio: 'inherit' });

const sha = createHash('sha256').update(readFileSync(outFile)).digest('hex');
writeFileSync(`${outFile}.sha256`, `${sha}  ${name}\n`);
console.log(`Created ${path.relative(root, outFile)} (${(statSync(outFile).size / 1024).toFixed(0)} KB)\nSHA-256 ${sha}`);
