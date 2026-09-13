import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resourceArticles, servicePages, solutionPages } from './src/siteData.js';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const routeInputs = {
  home: 'index.html',
  platform: 'platform/index.html',
  solutions: 'solutions/index.html',
  services: 'services/index.html',
  technology: 'technology/index.html',
  dirt: 'technology/dirt/index.html',
  caseStudies: 'case-studies/index.html',
  caseStudyDirtPoc01: 'case-studies/dirt-poc-01/index.html',
  pricing: 'pricing/index.html',
  resources: 'resources/index.html',
  diagnostic: 'diagnostic/index.html',
  about: 'company/about/index.html',
  contact: 'contact/index.html',
  privacy: 'legal/privacy/index.html',
  terms: 'legal/terms/index.html',
  thankYou: 'thank-you/index.html',
  notFound: '404.html',
};

solutionPages.forEach((page) => {
  routeInputs[`solution-${page.slug}`] = `solutions/${page.slug}/index.html`;
});

servicePages.forEach((service) => {
  routeInputs[`service-${service.slug}`] = `services/${service.slug}/index.html`;
});

resourceArticles.forEach((article) => {
  routeInputs[`resource-${article.slug}`] = `resources/${article.slug}/index.html`;
});

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

function productionIsolation() {
  return {
    name: 'root-production-isolation',
    closeBundle() {
      rmSync(resolve(rootDir, 'dist-staging/case-studies/dirt-poc-01'), { recursive: true, force: true });
      rmSync(resolve(rootDir, 'dist-staging/assets/case-studies/dirt-poc-01'), { recursive: true, force: true });
    },
  };
}

export default defineConfig(({ mode }) => {
  const production = mode === 'production';
  const inputs = production
    ? Object.fromEntries(Object.entries(routeInputs).filter(([name]) => name !== 'caseStudyDirtPoc01'))
    : routeInputs;

  return {
  plugins: [commercialPricingGuard(), production ? productionIsolation() : null, react()].filter(Boolean),
  resolve: {
    alias: {
      tailwindcss: resolve(rootDir, 'src/tailwind-disabled.css'),
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
    },
  },
  test: { environment: 'jsdom' },
  };
});
