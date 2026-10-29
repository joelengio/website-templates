// Creates the single canonical hand-off archive: handoff/OneStop-Infinite-Template-11-Vigor-Club.zip (+ .sha256).
// The project sits at the archive root; node_modules, dist, VCS data, local env files, test output and the handoff folder are excluded.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'handoff');
const name = 'OneStop-Infinite-Template-11-Vigor-Club.zip';
const outFile = path.join(outDir, name);
mkdirSync(outDir, { recursive: true });
if (existsSync(outFile)) rmSync(outFile);

const excludes = ['node_modules/*', 'dist/*', '.git/*', 'handoff/*', 'e2e-output/*', 'coverage/*', '.firebase/*', '.env', '.env.local', '*.log', '*.tsbuildinfo', '.DS_Store', '*.zip'];
execFileSync('zip', ['-r', '-X', '-q', outFile, '.', '-x', ...excludes], { cwd: root, stdio: 'inherit' });

const sha = createHash('sha256').update(readFileSync(outFile)).digest('hex');
writeFileSync(`${outFile}.sha256`, `${sha}  ${name}\n`);
console.log(`Created ${path.relative(root, outFile)} (${(statSync(outFile).size / 1024).toFixed(0)} KB)\nSHA-256 ${sha}`);
