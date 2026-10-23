import { expect, test } from '@playwright/test';

test.describe('Phase 1.1b browser palette', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`${theme} uses proper solid CTA ink and strong glass`, async ({ browser }) => {
      const context = await browser.newContext({ colorScheme: theme });
      await context.addInitScript((value) => { localStorage.setItem('root-theme', value); }, theme);
      const page = await context.newPage();
      try {
        await page.goto('/');
        const values = await page.evaluate(() => {
          const root = getComputedStyle(document.documentElement);
          const cta = document.querySelector('a.root-primary-cta');
          const nav = document.querySelector('header.v4-header');
          return {
            applied: document.documentElement.getAttribute('data-theme'),
            accent: root.getPropertyValue('--accent').trim().toLowerCase(),
            ink: root.getPropertyValue('--accent-fg').trim().toLowerCase(),
            buttonInk: cta ? getComputedStyle(cta).color : '',
            buttonFill: cta ? getComputedStyle(cta).backgroundColor : '',
            blur: nav ? getComputedStyle(nav).backdropFilter : '',
          };
        });
        expect(values.applied).toBe(theme);
        expect(values.accent).toBe(theme === 'light' ? '#0066ff' : '#00f0ff');
        expect(values.ink).toBe(theme === 'light' ? '#ffffff' : '#011a3d');
        expect(values.buttonInk).toBe(theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(1, 26, 61)');
        expect(values.buttonFill).toBe(theme === 'light' ? 'rgb(0, 102, 255)' : 'rgb(0, 240, 255)');
        expect(values.blur).toContain('blur(18px)');
        await page.evaluate(() => window.scrollTo(0, 80));
        await expect(page.locator('header.v4-header')).toHaveAttribute('data-scrolled', 'true');
        await expect.poll(() => page.locator('header.v4-header').evaluate((el) => getComputedStyle(el).backdropFilter)).toContain('blur(10px)');
      } finally {
        await context.close();
      }
    });
  }
});
