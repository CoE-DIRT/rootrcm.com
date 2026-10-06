import { defineConfig, devices } from '@playwright/test';

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
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
