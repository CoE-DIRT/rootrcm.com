import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
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

const launchPricingCorrections = {
  '$2,500-$7,500/month': '$1,500-$2,500/month',
  'Monthly + performance-aligned where appropriate': 'Onboarding from $1,500; approximately 5% of collections where appropriate',
};

function commercialPricingGuard() {
  return {
    name: 'root-commercial-pricing-guard',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/')) return null;

      const corrected = Object.entries(launchPricingCorrections).reduce(
        (output, [from, to]) => output.replaceAll(from, to),
        code,
      );

      return corrected === code ? null : { code: corrected, map: null };
    },
  };
}

export default defineConfig({
  plugins: [commercialPricingGuard(), react()],
  base: '/',
  server: {
    watch: {
      ignored: ['**/.codex-qa/**', '**/dist-staging/**'],
    },
  },
  build: {
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      input: Object.fromEntries(Object.entries(routeInputs).map(([name, path]) => [name, resolve(rootDir, path)])),
    },
  },
  test: { environment: 'jsdom' },
});
