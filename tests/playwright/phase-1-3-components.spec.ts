import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const evidencePath = 'test-results/phase-1-3-evidence';
for (const theme of ['light', 'dark'] as const) {
  test.describe(`Phase 1.3 — ${theme} visual and accessibility contract`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((v) => { if (v === 'dark') localStorage.setItem('root-theme','dark'); }, theme);
    });

    test('sticky nav, scrimmed 16:9 hero, feature images, and strong dashboard', async ({ page }) => {
      await page.goto('/');
      const nav = page.locator('header.v4-header');
      await expect(nav).toBeVisible();
      expect(await nav.evaluate(el => getComputedStyle(el).position)).toBe('sticky');
      const bg = await nav.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
      const hero = page.locator('.root-hero-media img');
      await expect(hero).toBeVisible();
      expect(await hero.getAttribute('width')).toBe('1600');
      expect(await hero.getAttribute('height')).toBe('900');
      await expect(page.locator('.root-hero-readable h1')).toBeVisible();
      const imageScrim = await page.locator('.root-hero-media').evaluate(el => getComputedStyle(el, '::after').backgroundColor);
      expect(imageScrim).not.toBe('rgba(0, 0, 0, 0)');
      const features = page.locator('[data-feature-card]');
      await expect(features).toHaveCount(4);
      for (const card of await features.all()) {
        const image = card.locator('img');
        await expect(image).toBeVisible();
        const dimensions = await image.evaluate(el => { const rect=el.getBoundingClientRect(); return { w: rect.width, h: rect.height }; });
        expect(Math.abs(dimensions.w - dimensions.h)).toBeLessThan(2);
      }
      const dashboard = page.locator('[data-dashboard-preview]');
      await expect(dashboard).toBeVisible();
      const strong = await dashboard.evaluate(el => getComputedStyle(el).backgroundColor);
      const glass = await page.locator('html').evaluate(el => getComputedStyle(el).getPropertyValue('--glass-bg-strong').trim());
      expect(glass).toContain(theme === 'light' ? '255, 255, 255' : '1, 26, 61');
      expect(strong).toContain(theme === 'light' ? '255, 255, 255' : '1, 26, 61');
      await page.keyboard.press('Tab');
      await features.first().focus();
      const focus = await features.first().evaluate(el => getComputedStyle(el).outlineStyle);
      expect(focus).toBe('solid');
      const reject = page.getByRole('button', { name: 'Reject non-essential' });
      if (await reject.isVisible().catch(() => false)) await reject.click();
      mkdirSync(evidencePath, { recursive: true });
      await page.screenshot({ path: `${evidencePath}/home-${theme}.png`, animations: 'disabled' });
    });

    test('diagnostic solid field, 3:1+ border and footer legal link', async ({ page }) => {
      await page.goto('/diagnostic/');
      const surface = page.locator('#diagnostic-form');
      await expect(surface).toBeVisible();
      const input = surface.locator('input[autocomplete="name"]');
      await expect(input).toBeVisible();
      const styles = await input.evaluate(el => ({
        color: getComputedStyle(el).color,
        bg: getComputedStyle(el).backgroundColor,
        border: getComputedStyle(el).borderTopColor,
      }));
      expect(styles.bg).toBe(theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(18, 24, 38)');
      expect(styles.border).toBe(theme === 'light' ? 'rgb(100, 116, 139)' : 'rgb(167, 178, 196)');
      const footer = page.locator('footer').last();
      await expect(footer).toBeVisible();
      const legal = footer.locator('a[href="/privacy-policy/"]').first();
      await expect(legal).toBeVisible();
      expect(await legal.evaluate(el => getComputedStyle(el).color)).toBe(
        theme === 'light' ? 'rgb(57, 79, 109)' : 'rgb(232, 236, 244)',
      );
      mkdirSync(evidencePath, { recursive: true });
      await surface.screenshot({ path: `${evidencePath}/diagnostic-${theme}.png`, animations: 'disabled' });
    });

    test('reduced motion removes glass transition', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      const node = page.locator('.glass-feature-card').first();
      await expect(node).toBeVisible();
      expect(await node.evaluate(el => getComputedStyle(el).transitionDuration)).toMatch(/^(0s|0\.01ms)$/);
    });
  });
}
