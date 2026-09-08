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

export default defineConfig({
  plugins: [react()],
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
