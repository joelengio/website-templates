import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

// Uses a pre-installed Chromium when available (PW_CHROMIUM_PATH or /opt/pw-browsers/chromium); otherwise Playwright's own browser.
const executablePath = process.env.PW_CHROMIUM_PATH || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
// PW_BROWSER=firefox|webkit runs the same suite in another engine (npx playwright install firefox webkit).
const browserName = (process.env.PW_BROWSER || 'chromium') as 'chromium' | 'firefox' | 'webkit';
const PORT = Number(process.env.E2E_PORT || 4173);

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    browserName,
    launchOptions: browserName === 'chromium' ? { executablePath, args: ['--no-sandbox'] } : {},
    trace: 'off'
  },
  // Serves the production build with Firebase-style rewrites and headers (including the CSP).
  webServer: {
    command: `PORT=${PORT} node scripts/serve-dist.mjs`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
