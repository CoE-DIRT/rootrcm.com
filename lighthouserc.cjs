/**
 * Phase 3.3: audits the exact production Vite artifact through a local preview
 * server. CLS <=0.05 is the stretch goal; >0.1 fails the CI build.
 * Do not assert deployed-field Web Vitals from this synthetic lab run.
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      url: [
        'http://127.0.0.1:4173/',
        'http://127.0.0.1:4173/pricing/',
        'http://127.0.0.1:4173/technology/dirt/',
      ],
      numberOfRuns: 2,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        onlyCategories: ['performance'],
      },
    },
    assert: {
      assertions: {
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, aggregationMethod: 'pessimistic' }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 1500, aggregationMethod: 'median' }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
};
