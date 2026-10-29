import { defineConfig } from '@playwright/test';

// Set PW_CHROMIUM_PATH to use a pre-installed Chromium binary instead of `npx playwright install`.
// Set PW_BROWSER=firefox (or webkit) to run the same suite in another engine (`npx playwright install firefox` first).
const browserName = (process.env.PW_BROWSER || 'chromium') as 'chromium' | 'firefox' | 'webkit';
const executablePath = browserName === 'chromium' ? process.env.PW_CHROMIUM_PATH || undefined : undefined;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName,
    launchOptions: browserName === 'chromium' ? { executablePath, args: ['--no-sandbox'] } : {},
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
