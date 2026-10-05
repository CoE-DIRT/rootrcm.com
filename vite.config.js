import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resourceArticles, routeMeta, servicePages, solutionPages } from './src/siteData.js';

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
  cookies: 'legal/cookies/index.html',
  thankYou: 'thank-you/index.html',
  notFound: '404.html',
  v4Lab: '__v4-lab/index.html',
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

function canonicalRouteMetadata() {
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return {
    name: 'root-canonical-route-metadata',
    transformIndexHtml(html, context) {
      const path = context.path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
      const meta = routeMeta[path];
      if (!meta) return html;
      // Bots and social crawlers must receive the same copy as the hydrated app.
      let output = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escape(meta.title)}</title>`);
      for (const [attribute, key, value] of [
        ['name', 'description', meta.description],
        ['property', 'og:title', meta.title],
        ['property', 'og:description', meta.description],
        ['name', 'twitter:title', meta.title],
        ['name', 'twitter:description', meta.description],
      ]) {
        output = output.replace(new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*\\/?>`),
          () => `<meta ${attribute}="${key}" content="${escape(value)}" />`);
      }
      return output.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (match, start, content, end) => {
        const data = JSON.parse(content);
        if (data['@type'] !== 'WebPage') return match;
        return start + JSON.stringify({ ...data, name: meta.title, description: meta.description }).replaceAll('<', '\\u003c') + end;
      });
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
  if (production && env.VITE_CONTACT_MODE === 'owned') {
    if (!env.VITE_TURNSTILE_SITE_KEY || !/^https:\/\//.test(env.VITE_FORM_ENDPOINT || '')) {
      throw new Error('Owned contact mode requires a public Turnstile site key and HTTPS Function endpoint.');
    }
  }
  const excludedFromProduction = new Set(['caseStudyDirtPoc01', 'v4Lab']);
  const inputs = production
    ? Object.fromEntries(Object.entries(routeInputs).filter(([name]) => !excludedFromProduction.has(name)))
    : routeInputs;

  return {
  plugins: [commercialPricingGuard(), canonicalRouteMetadata(), production ? productionIsolation() : null, tailwindcss(), react()].filter(Boolean),
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
  test: { environment: 'jsdom', exclude: ['node_modules/**', 'dist-staging/**', 'tests/playwright/**'] },
  };
});
