import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const systemChromium = process.platform === 'linux' && existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined;

export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: true,
  reporter: [['list']],
  webServer: [
    {
      command: 'npx vite --port 4319 --strictPort',
      url: 'http://localhost:4319',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      // The dev server defaults to a non-indexable "development" site environment. The specs that check the generated
      // sitemap.xml, robots.txt and page heads expect the production artifacts, so this server declares production.
      env: { VITE_SITE_ENV: 'production' },
    },
    {
      // A second dev server with SYNTHETIC public configuration, used only by analytics-checkout.spec.ts so the
      // first-party analytics and test-mode checkout paths can be driven in a browser against stubbed endpoints.
      // None of these hosts, keys or services is real; every request to them is intercepted by the spec.
      command: 'npx vite --port 4320 --strictPort',
      url: 'http://localhost:4320',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        VITE_TRACKING_ENDPOINT: 'https://tracking.example.test/ingest',
        VITE_CHECKOUT_ENDPOINT: 'https://checkout-fn.example.test/run',
        VITE_STRIPE_PUBLISHABLE_KEY: ['pk', 'test', `SYNTHETIC${'x'.repeat(20)}`].join('_'),
        VITE_EXPERIMENTS_ENABLED: 'true',
      },
    },
  ],
  use: {
    baseURL: 'http://localhost:4319',
    // Codex cloud images may already provide Chromium. Prefer it there so validation does not depend on a redundant
    // browser download; CI and other machines continue to use Playwright's managed browser.
    launchOptions: systemChromium ? { executablePath: systemChromium } : undefined,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
