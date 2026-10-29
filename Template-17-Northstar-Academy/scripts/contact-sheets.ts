/**
 * Builds labelled desktop and mobile screenshot contact sheets into review/.
 * Requires a running preview server (npm run build && npm run preview) and ImageMagick's `montage`.
 *   PW_CHROMIUM_PATH=/path/to/chrome BASE_URL=http://127.0.0.1:4173 npm run review
 */
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'review');
const base = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const key = 'northstar-academy:learner:v1';
const state = {
  version: 1,
  enrollments: {
    'web-foundations': { enrolledAt: '2026-10-01T10:00:00.000Z', lessonsDone: ['m1-l1', 'm1-l2', 'm1-l3', 'm2-l1'], last: 'lesson:m2-l2', lastAt: '2026-10-06T10:00:00.000Z' },
    'spreadsheet-analytics': { enrolledAt: '2026-10-02T10:00:00.000Z', lessonsDone: ['m1-l1', 'm1-l2'] },
    'visual-hierarchy': { enrolledAt: '2026-10-02T10:00:00.000Z', completedAt: '2026-10-03T10:00:00.000Z', lessonsDone: ['m1-l1', 'm1-l2', 'm1-l3', 'm2-l1', 'm2-l2', 'm2-l3'] },
  },
  quizzes: {
    'web-foundations:m1-quiz': { attempts: 2, best: 100, last: 100, passed: true, answers: {}, updatedAt: '2026-10-03T09:00:00.000Z' },
    'visual-hierarchy:m1-quiz': { attempts: 1, best: 100, last: 100, passed: true, answers: {}, updatedAt: '2026-10-03T09:00:00.000Z' },
    'visual-hierarchy:m2-quiz': { attempts: 2, best: 67, last: 67, passed: false, answers: {}, updatedAt: '2026-10-03T09:30:00.000Z' },
  },
  bookmarkedCourses: ['practical-prompt-craft'],
  bookmarkedLessons: ['web-foundations:m1-l1'],
  activity: Array.from({ length: 6 }, (_, i) => ({ date: new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10), minutes: [35, 20, 0, 42, 18, 25][i] })).filter((a) => a.minutes),
};
const completed = JSON.parse(JSON.stringify(state));
completed.quizzes['visual-hierarchy:m2-quiz'] = { attempts: 3, best: 100, last: 100, passed: true, answers: {}, updatedAt: '2026-10-03T10:00:00.000Z' };

const publicRoutes = ['/', '/courses', '/courses/web-foundations', '/instructors', '/instructors/priya-raman', '/paths', '/plans', '/about', '/journal', '/journal/why-quizzes-help-you-remember', '/contact', '/not-a-page'];
const learnRoutes = ['/learn', '/learn/web-foundations', '/learn/web-foundations/lesson/m1-l1', '/learn/web-foundations/quiz/m1-quiz', '/learn/bookmarks', '/learn/completed', '/learn/visual-hierarchy/certificate'];

mkdirSync(out, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'ns-sheets-'));
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });

async function sheet(name: string, routes: string[], width: number, height: number, cols: number, seeded: boolean) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  if (seeded) await ctx.addInitScript(([k, v]) => localStorage.setItem(k as string, JSON.stringify(v)), [key, completed]);
  const page = await ctx.newPage();
  const files: string[] = [];
  for (const [i, r] of routes.entries()) {
    await page.goto(base + r, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('img').forEach((im) => ((im as HTMLImageElement).loading = 'eager')));
    await page.waitForTimeout(400);
    const file = join(tmp, `${name}-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: file, fullPage: true, clip: undefined });
    // Keep the first screens only so sheets stay readable.
    execFileSync('convert', [file, '-crop', `${width}x${Math.round(height * 1.7)}+0+0`, '+repage', file]);
    files.push(file, `label:${r}`);
  }
  const labelled = routes.map((r, i) => [join(tmp, `${name}-${String(i).padStart(2, '0')}.png`), r] as const);
  const args = ['-background', '#f1eee8', '-fill', '#0f1e3d', '-font', 'DejaVu-Sans-Bold', '-pointsize', '15', '-tile', `${cols}x`, '-geometry', `${Math.round(width > 600 ? 640 : 300)}x+14+14`];
  for (const [f, label] of labelled) args.push('-label', `${name.replace('-', ' ')} ${width}px  ${label}`, f);
  args.push('-quality', '84', join(out, `${name}-${width}.jpg`));
  execFileSync('montage', args);
  await ctx.close();
}

await sheet('public-pages', publicRoutes, 1440, 900, 3, false);
await sheet('learning-dashboard', learnRoutes, 1440, 900, 3, true);
await sheet('public-pages', publicRoutes, 390, 844, 6, false);
await sheet('learning-dashboard', learnRoutes, 390, 844, 7, true);
await browser.close();
rmSync(tmp, { recursive: true, force: true });
console.log('Contact sheets written to review/');
