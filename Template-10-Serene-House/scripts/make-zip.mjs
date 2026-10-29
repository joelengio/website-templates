// Creates the single canonical hand-off archive: handoff/OneStop-Infinite-Template-10-Serene-House.zip
// Contains the project at archive root; excludes node_modules, dist, VCS data, local env files and the handoff folder itself.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, statSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'handoff');
const outFile = path.join(outDir, 'OneStop-Infinite-Template-10-Serene-House.zip');
mkdirSync(outDir, { recursive: true });
if (existsSync(outFile)) rmSync(outFile);

const excludes = ['node_modules/*', 'dist/*', '.git/*', 'handoff/*', 'e2e-output/*', 'coverage/*', '.firebase/*', '.env', '.env.local', '*.log', '*.tsbuildinfo', '.DS_Store'];
execFileSync('zip', ['-r', '-X', '-q', outFile, '.', '-x', ...excludes], { cwd: root, stdio: 'inherit' });

const sha = createHash('sha256').update(readFileSync(outFile)).digest('hex');
console.log(`Created ${path.relative(root, outFile)} (${(statSync(outFile).size / 1024).toFixed(0)} KB)\nSHA-256 ${sha}`);
