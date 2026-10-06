import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildInputs } from './src/seo/routeRegistry.js';
import { renderPageHtml } from './src/seo/head.js';
import { buildRobots, buildSitemap } from './src/seo/sitemap.js';
import { assertSafePublicEnv } from './src/build/envGuard.js';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

function commercialPricingGuard() {
  return {
    name: 'root-commercial-pricing-guard',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/')) return null;
      if (code.includes('$2,500-$7,500/month') || code.includes('Monthly + performance-aligned where appropriate')) {
        throw new Error('ROOT launch pricing guard: source contains a superseded public pricing string.');
      }
      return null;
    },
  };
}

/**
 * Writes unique, canonical metadata, social tags, JSON-LD, the no-flash theme bootstrap and a no-JS
 * fallback into every route's HTML so crawlers see what the hydrated app renders (src/seo/head.js).
 */
function rootHtmlHead({ siteEnv, gscVerification }) {
  return {
    name: 'root-html-head',
    transformIndexHtml(html, context) {
      return renderPageHtml(html, context.path, { siteEnv, gscVerification });
    },
  };
}

/** sitemap.xml and robots.txt are generated from the route registry so they cannot drift from the site. */
function rootSeoArtifacts({ siteEnv }) {
  const files = { '/sitemap.xml': ['application/xml', () => buildSitemap()], '/robots.txt': ['text/plain', () => buildRobots({ siteEnv })] };
  return {
    name: 'root-seo-artifacts',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const entry = files[(request.url || '').split('?')[0]];
        if (!entry) return next();
        response.setHeader('content-type', `${entry[0]}; charset=utf-8`);
        response.end(entry[1]());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots({ siteEnv }) });
    },
  };
}

function productionIsolation() {
  return {
    name: 'root-production-isolation',
    closeBundle() {
      rmSync(resolve(rootDir, 'dist-staging/case-studies/dirt-poc-01'), { recursive: true, force: true });
      rmSync(resolve(rootDir, 'dist-staging/assets/case-studies/dirt-poc-01'), { recursive: true, force: true });
      rmSync(resolve(rootDir, 'dist-staging/__v4-lab'), { recursive: true, force: true });
    },
  };
}

export default defineConfig(({ mode }) => {
  const production = mode === 'production';
  const env = loadEnv(mode, rootDir, 'VITE_');
  assertSafePublicEnv(env);
  if (production && env.VITE_CONTACT_MODE === 'owned') {
    if (!env.VITE_TURNSTILE_SITE_KEY || !/^https:\/\//.test(env.VITE_FORM_ENDPOINT || '')) {
      throw new Error('Owned contact mode requires a public Turnstile site key and HTTPS Function endpoint.');
    }
  }
  const siteEnv = env.VITE_SITE_ENV || 'production';
  const inputs = buildInputs({ production });

  return {
  plugins: [
    commercialPricingGuard(),
    rootHtmlHead({ siteEnv, gscVerification: env.VITE_GSC_VERIFICATION || '' }),
    rootSeoArtifacts({ siteEnv }),
    production ? productionIsolation() : null,
    tailwindcss(),
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src/v4'),
    },
  },
  base: '/',
  server: {
    watch: {
      ignored: ['**/.codex-qa/**', '**/dist-staging/**'],
    },
  },
  build: {
    sourcemap: !production,
    target: 'es2022',
    rollupOptions: {
      input: Object.fromEntries(Object.entries(inputs).map(([name, path]) => [name, resolve(rootDir, path)])),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/@tanstack/react-table')) return 'charts';
          if (id.includes('node_modules/klaro')) return 'consent';
          if (id.includes('node_modules/posthog-js')) return 'analytics';
          if (id.includes('node_modules/@growthbook/growthbook')) return 'growth';
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['node_modules/**', 'dist-staging/**', 'tests/playwright/**'],
    // Klaro keeps its consent managers in module state. Inlining it lets tests that call vi.resetModules() get a fresh one.
    server: { deps: { inline: ['klaro'] } },
  },
  };
});
