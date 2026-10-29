// Creates the single canonical hand-off archive plus its SHA-256 file:
//   handoff/OneStop-Infinite-Template-12-Clarity-Health.zip  (+ .sha256)
// The project sits at the archive root. Excluded: node_modules, dist, VCS data, local env files, secrets, the handoff
// folder itself (so no other archives are nested), test output and per-run screenshots.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'handoff');
const name = 'OneStop-Infinite-Template-12-Clarity-Health.zip';
const outFile = path.join(outDir, name);
mkdirSync(outDir, { recursive: true });
for (const f of [outFile, `${outFile}.sha256`]) if (existsSync(f)) rmSync(f);

const excludes = [
  'node_modules/*', 'dist/*', '.git/*', 'handoff/*', 'e2e-output/*', 'coverage/*', '.firebase/*', 'playwright-report/*', 'test-results/*',
  'review/shots/*', '.env', '.env.*', '*.log', '*.tsbuildinfo', '.DS_Store', '*.pem', '*.key', '*.zip', '.firebaserc'
];
execFileSync('zip', ['-r', '-X', '-q', outFile, '.', '-x', ...excludes], { cwd: root, stdio: 'inherit' });

const sha = createHash('sha256').update(readFileSync(outFile)).digest('hex');
writeFileSync(`${outFile}.sha256`, `${sha}  ${name}\n`);
console.log(`Created ${path.relative(root, outFile)} (${(statSync(outFile).size / 1024).toFixed(0)} KB)\nSHA-256 ${sha}`);
