/**
 * UX-0.2: 1 full-page PNG per route × viewport × theme.
 * Only run: npx playwright test e2e/baseline/capture.spec.ts
 * Uses the existing accessible theme switch; never overrides CSS tokens.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { allRoutes } from '../../src/seo/routeRegistry.js';

const OUTPUT = resolve(process.cwd(), 'docs/website/baseline/screens');
const viewports = [
  { width: 1920, height: 1080 },
  { width: 834, height: 1194 },
  { width: 390, height: 844 },
] as const;
const themes = ['light', 'dark'] as const;

function routeSlug(routePath: string): string {
  return routePath.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'home';
}
export function captureFilename(routePath: string, width: number, height: number, theme: string): string {
  return routeSlug(routePath) + '__' + width + 'x' + height + '__' + theme + '.png';
}

// Detect collisions rather than overwriting another route's baseline evidence.
const allSlugs = allRoutes.map(({ path }) => routeSlug(path));
if (new Set(allSlugs).size !== allSlugs.length) {
  throw new Error('UX-0.2: duplicate route screenshot slug detected.');
}

function writeIndex(): void {
  mkdirSync(OUTPUT, { recursive: true });
  const headings = [
    '# UX-0.2 — Full-page screenshot baseline',
    '',
    'Generated from src/seo/routeRegistry.js by the Playwright baseline capture spec.',
    '',
    '- Source: local Vite server at http://localhost:4319 (not the production site).',
    '- Includes all canonical, alias, internal, and noindex/system routes.',
    '- Viewports: 1920×1080, 834×1194, 390×844; light and dark.',
    '- Theme selected through the existing Light theme switch; no CSS overrides.',
    '- Full-page screenshots with animations disabled; non-essential consent rejected when prompted.',
    '',
    'Expected: ' + (allRoutes.length * viewports.length * themes.length) + ' PNGs.',
    '',
    '| Route | 1920×1080 light | 1920×1080 dark | 834×1194 light | 834×1194 dark | 390×844 light | 390×844 dark |',
    '|---|---|---|---|---|---|---|',
  ];
  for (const route of allRoutes) {
    const links = viewports.flatMap(({ width, height }) =>
      themes.map((theme) => '[PNG](./' + captureFilename(route.path, width, height, theme) + ')'),
    );
    headings.push('| ' + route.path + ' | ' + links.join(' | ') + ' |');
  }
  headings.push('', '## Validation', '',
    'Every capture test must pass, and the branch workflow verifies expected PNG count and every index link before committing evidence.', '');
  writeFileSync(resolve(OUTPUT, 'index.md'), headings.join('\n'), 'utf8');
}

// Each worker writes the same deterministic index; all capture filenames are
// disjoint. The branch workflow checks existence only after all tests finish.
writeIndex();

test.describe('UX-0.2 per-route screenshot baseline', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of allRoutes) {
    test('capture ' + route.path, async ({ page }) => {
      test.setTimeout(240_000);
      await page.goto(route.path, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.locator('main#main-content').waitFor({ state: 'visible', timeout: 20_000 });

      // No analytics opt-in; screenshots should show the unobstructed page.
      const reject = page.getByRole('button', { name: 'Reject non-essential' });
      try { await reject.click({ timeout: 4_000 }); } catch {
        // A persisted consent choice or page without a prompt is valid.
      }

      const themeSwitch = page.getByRole('switch', { name: 'Light theme' });
      await expect(themeSwitch).toBeVisible();

      for (const { width, height } of viewports) {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: 'reduce' });

        // Reveal below-fold sections and trigger loading of lazy media.
        await page.evaluate(async () => {
          const step = Math.max(400, Math.floor(window.innerHeight * 0.9));
          const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
          for (let y = 0; y < height; y += step) {
            window.scrollTo(0, y);
            await new Promise<void>((done) => window.setTimeout(done, 25));
          }
          window.scrollTo(0, 0);
          await document.fonts.ready;
        });

        for (const theme of themes) {
          if ((await page.locator('html').getAttribute('data-theme')) !== theme) {
            await themeSwitch.click();
          }
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))));
          await page.screenshot({
            path: resolve(OUTPUT, captureFilename(route.path, width, height, theme)),
            fullPage: true,
            animations: 'disabled',
            caret: 'hide',
            timeout: 45_000,
          });
        }
      }
    });
  }
});
