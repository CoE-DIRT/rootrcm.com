import { expect, test, type Browser, type Page, type TestInfo } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const screenshotDir = 'test-results/phase-1-2-evidence';
const routes = ['/', '/pricing/', '/contact/', '/technology/dirt/'] as const;
type Theme = 'light' | 'dark';

async function openTheme(browser: Browser, theme: Theme) {
  // OS intentionally disagrees with the requested theme, proving the first-visit rule.
  const context = await browser.newContext({ colorScheme: theme === 'light' ? 'dark' : 'light', viewport: { width: 1440, height: 900 } });
  if (theme === 'dark') {
    await context.addInitScript(() => { localStorage.setItem('root-theme', 'dark'); });
  }
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('header.v4-header')).toBeVisible();
  return { context, page };
}

async function screenshot(page: Page, label: string) {
  mkdirSync(screenshotDir, { recursive: true });
  await page.screenshot({ path: `${screenshotDir}/${label}.png`, animations: 'disabled', fullPage: false });
}

test.describe('Phase 1.2 CPO seven-gate evidence', () => {
  for (const theme of ['light', 'dark'] as const) {
    // This focused suite creates one authoritative desktop PNG per gate/theme.
    test(`01 first-paint default and storage: ${theme}`, async ({ browser }, testInfo: TestInfo) => {
      test.skip(testInfo.project.name !== 'chromium');
      const { context, page } = await openTheme(browser, theme);
      try {
        await screenshot(page, `01-bootstrap-${theme}`);
        expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
        const value = await page.evaluate(() => localStorage.getItem('root-theme'));
        expect(value).toBe(theme === 'dark' ? 'dark' : null);
        const c = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--app-bg').trim().toLowerCase());
        expect(c).toBe(theme === 'light' ? '#f4f7fb' : '#060d1a');
      } finally { await context.close(); }
    });

    test(`02 source token swap: ${theme}`, async ({ browser }, testInfo: TestInfo) => {
      test.skip(testInfo.project.name !== 'chromium');
      const { context, page } = await openTheme(browser, theme);
      try {
        const result = await page.evaluate(() => ({
          bg: getComputedStyle(document.documentElement).getPropertyValue('--glass-bg').trim(),
          strong: getComputedStyle(document.documentElement).getPropertyValue('--glass-bg-strong').trim(),
          blur: getComputedStyle(document.querySelector('.glass-surface')!).backdropFilter,
        }));
        await screenshot(page, `02-tokens-${theme}`);
        expect(result.bg).toContain(theme === 'light' ? '255, 255, 255, 0.6' : '1, 26, 61, 0.4');
        expect(result.strong).toContain(theme === 'light' ? '255, 255, 255, 0.8' : '1, 26, 61, 0.68');
        expect(result.blur).toContain('blur(12px)');
      } finally { await context.close(); }
    });

    test(`03 toggle preserves card and grid geometry: ${theme}`, async ({ browser }, testInfo: TestInfo) => {
      test.skip(testInfo.project.name !== 'chromium');
      const { context, page } = await openTheme(browser, theme);
      try {
        const selector = 'header.v4-header, .homeHero, .homeHero .heroCopy, .homeHero .glass-surface';
        const before = await page.locator(selector).evaluateAll((nodes) => nodes.map((el) => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10); }));
        await screenshot(page, `03-layout-${theme}`);
        await page.getByRole('switch', { name: 'Light theme' }).click();
        const after = await page.locator(selector).evaluateAll((nodes) => nodes.map((el) => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10); }));
        expect(after).toEqual(before);
      } finally { await context.close(); }
    });

    test(`04 glass distinction and edge: ${theme}`, async ({ browser }, testInfo: TestInfo) => {
      test.skip(testInfo.project.name !== 'chromium');
      const { context, page } = await openTheme(browser, theme);
      try {
        const surface = page.locator('.homeHero .glass-surface').first();
        await expect(surface).toBeVisible();
        const colors = await surface.evaluate((el) => {
          const card = getComputedStyle(el), root = getComputedStyle(document.documentElement);
          return { border: card.borderTopColor, bg: card.backgroundColor, page: root.getPropertyValue('--app-bg').trim() };
        });
        await screenshot(page, `04-edge-${theme}`);
        expect(colors.border).not.toBe('rgba(0, 0, 0, 0)');
        expect(colors.bg).not.toBe('rgba(0, 0, 0, 0)');
        expect(colors.page.toLowerCase()).toBe(theme === 'light' ? '#f4f7fb' : '#060d1a');
      } finally { await context.close(); }
    });

    test(`05 visible keyboard focus ring: ${theme}`, async ({ browser }, testInfo: TestInfo) => {
      test.skip(testInfo.project.name !== 'chromium');
      const { context, page } = await openTheme(browser, theme);
      try {
        const control = page.getByRole('switch', { name: 'Light theme' });
        await control.focus();
        const focus = await control.evaluate((el) => ({
          matching: el.matches(':focus-visible'),
          shadow: getComputedStyle(el).boxShadow,
          outline: getComputedStyle(el).outlineStyle,
        }));
        expect(focus.matching).toBe(true);
        expect(focus.shadow !== 'none' || focus.outline !== 'none').toBe(true);
        await page.goto('/technology/dirt/');
        const scroller = page.locator('.root-inset-focus').first();
        await expect(scroller).toBeVisible();
        await scroller.focus();
        const tableRing = await scroller.evaluate((el) => getComputedStyle(el).boxShadow);
        expect(tableRing).toContain('inset');
        await screenshot(page, `05-focus-${theme}`);
      } finally { await context.close(); }
    });

    test(`06 mesh below glass: ${theme}`, async ({ browser }, testInfo: TestInfo) => {
      test.skip(testInfo.project.name !== 'chromium');
      const { context, page } = await openTheme(browser, theme);
      try {
        const data = await page.evaluate(() => {
          const mesh = document.querySelector('.root-mesh')!;
          const content = mesh.nextElementSibling!;
          return {
            mesh: getComputedStyle(mesh).zIndex,
            content: getComputedStyle(content).zIndex,
            parent: mesh.parentElement?.contains(content),
            orb: getComputedStyle(mesh, '::before').opacity,
          };
        });
        await screenshot(page, `06-mesh-${theme}`);
        expect(Number(data.mesh)).toBeLessThan(Number(data.content));
        expect(data.parent).toBe(true);
        expect(Number(data.orb)).toBeLessThanOrEqual(0.12);
      } finally { await context.close(); }
    });

    test(`07 saved theme survives route changes and reloads: ${theme}`, async ({ browser }, testInfo: TestInfo) => {
      test.skip(testInfo.project.name !== 'chromium');
      const { context, page } = await openTheme(browser, theme);
      try {
        const transitions: string[] = [];
        for (const route of routes) {
          await page.goto(route);
          transitions.push((await page.locator('html').getAttribute('data-theme')) ?? 'missing');
        }
        await page.reload();
        transitions.push((await page.locator('html').getAttribute('data-theme')) ?? 'missing');
        await screenshot(page, `07-navigation-${theme}`);
        expect(transitions).toEqual(Array(routes.length + 1).fill(theme));
      } finally { await context.close(); }
    });
  }
});
