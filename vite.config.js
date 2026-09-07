import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      input: {
        home: resolve(rootDir, 'index.html'),
        rcm: resolve(rootDir, 'services/rcm/index.html'),
        practiceOps: resolve(rootDir, 'services/practice-ops/index.html'),
        dirt: resolve(rootDir, 'technology/dirt/index.html'),
        diagnostic: resolve(rootDir, 'diagnostic/index.html'),
        about: resolve(rootDir, 'company/about/index.html'),
        contact: resolve(rootDir, 'contact/index.html'),
        privacy: resolve(rootDir, 'legal/privacy/index.html'),
        terms: resolve(rootDir, 'legal/terms/index.html'),
        thankYou: resolve(rootDir, 'thank-you/index.html'),
        notFound: resolve(rootDir, '404.html'),
      },
    },
  },
  test: { environment: 'jsdom' },
});
