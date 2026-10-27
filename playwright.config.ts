import { defineConfig, devices } from '@playwright/test';

// Capture is intentionally excluded from the normal CI/browser suite. It is
// discovered only when its exact, explicit command is used.
// Share the CLI-selected suite with Playwright worker subprocesses; workers
// receive different argv values and otherwise load the default testDir.
const captureRequested = process.env.ROOT_UX02_CAPTURE === '1' || process.argv.some((arg) =>
  arg.replaceAll('\\', '/').includes('e2e/baseline/capture.spec.ts'),
);
if (captureRequested) process.env.ROOT_UX02_CAPTURE = '1';

export default defineConfig({
  testDir: captureRequested ? './e2e/baseline' : './tests/playwright',
  fullyParallel: true,
  ...(captureRequested ? { workers: 2 } : {}),
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
  },
  projects: captureRequested ? [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ] : [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
