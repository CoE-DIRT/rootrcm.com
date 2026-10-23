import { expect, test, type Page } from '@playwright/test';
import { auditContrast } from './helpers/contrast';

async function prepare(page: Page, theme: 'light' | 'dark', route: string) {
  await page.addInitScript((value) => {
    localStorage.setItem('root-theme', value);
    localStorage.setItem('root-conversion-experiments-v1', JSON.stringify({ homeHero: 'a', diagnosticHero: 'a' }));
  }, theme);
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  const reject = page.getByRole('button', { name: 'Reject non-essential' });
  if (await reject.isVisible().catch(() => false)) await reject.click();
}

test.describe('Phase 1.3 CPO tier assignments and AA', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`${theme}: sticky navigation and strong mobile drawer`, async ({ page, isMobile }) => {
      await prepare(page, theme, '/');
      const header = page.locator('header.v4-header');
      await expect(header).toHaveClass(/glass-strong/);
      const styles = await header.evaluate((el) => {
        const s = getComputedStyle(el);
        return { position: s.position, background: s.backgroundColor, blur: s.backdropFilter };
      });
      expect(styles.position).toBe('sticky');
      expect(styles.blur).toContain('blur(18px)');
      await page.evaluate(() => window.scrollTo(0, 120));
      await expect(header).toHaveAttribute('data-scrolled', 'true');
      const headerTop = await header.evaluate((el) => el.getBoundingClientRect().top);
      expect(Math.abs(headerTop)).toBeLessThanOrEqual(1);
      await expect.poll(() => header.evaluate((el) => getComputedStyle(el).backdropFilter)).toContain('blur(10px)');
      if (isMobile) {
        await page.getByRole('button', { name: 'Open menu' }).click();
        const drawer = page.getByRole('dialog', { name: /Menu/i });
        await expect(drawer).toHaveClass(/glass-strong/);
        const scrim = page.locator('.root-mobile-scrim');
        await expect(scrim).toHaveCSS('background-color', 'rgba(1, 26, 61, 0.5)');
        const background = await drawer.evaluate((el) => getComputedStyle(el).backgroundColor);
        expect(background).toBe(theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(1, 26, 61, 0.68)');
      }
    });

    test(`${theme}: hero media is decorative and all headline copy is on tiered glass`, async ({ page }) => {
      await prepare(page, theme, '/');
      await expect(page.locator('[data-hero-image-placeholder] img')).toHaveAttribute('alt', '');
      await expect(page.locator('[data-hero-image-placeholder] img')).toHaveAttribute('width', '1600');
      await expect(page.locator('.root-hero-content')).toHaveClass(/glass/);
      await expect(page.locator('.root-hero-heading')).toHaveClass(/glass-strong/);
      await expect(page.locator('.root-hero-heading h1')).toBeVisible();
      await expect(page.locator('.root-hero-heading')).toHaveCSS('background-color', theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(1, 26, 61, 0.68)');
    });

    test(`${theme}: feature grid has six tiered cards and square imagery`, async ({ page }) => {
      await prepare(page, theme, '/');
      const cards = page.locator('.root-feature-card');
      await expect(cards).toHaveCount(6);
      for (const card of await cards.all()) {
        await expect(card).toHaveClass(/glass/);
        const image = card.locator('img');
        await expect(image).toHaveAttribute('width', '480');
        await expect(image).toHaveAttribute('height', '480');
        await expect(image).toHaveAttribute('alt', /not a ROOT client or team photo/);
        const token = await card.locator('p').first().evaluate((el) => ({
          color: getComputedStyle(el).color,
          expected: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
        }));
        expect(token.color).not.toBe('rgba(0, 0, 0, 0)');
      }
    });

    test(`${theme}: dashboard preview uses strong glass and legible metrics`, async ({ page }) => {
      await prepare(page, theme, '/');
      const dashboard = page.locator('.root-dashboard-preview');
      await expect(dashboard).toHaveClass(/glass-strong/);
      await expect(dashboard.locator('[role="region"]')).toHaveAttribute('aria-label', /monthly charges.*collections.*accounts receivable/i);
      const text = await dashboard.locator('.text-muted').first().evaluate((el) => getComputedStyle(el).color);
      expect(text).toBe(theme === 'light' ? 'rgb(57, 79, 109)' : 'rgb(167, 178, 196)');
    });

    test(`${theme}: pricing uses base glass and opaque price token`, async ({ page }) => {
      await prepare(page, theme, '/pricing/');
      const cards = page.locator('.glass-surface.glass');
      expect(await cards.count()).toBeGreaterThanOrEqual(3);
      await expect(cards.first().locator('p.font-semibold.text-text').first()).toBeVisible();
    });

    test(`${theme}: Diagnostic fields are high-contrast over strong glass`, async ({ page }) => {
      await prepare(page, theme, '/diagnostic/');
      const surface = page.locator('#diagnostic-form');
      await expect(surface).toHaveClass(/glass-strong/);
      const input = surface.locator('input[autocomplete="name"]');
      await expect(input).toBeVisible();
      const actual = await input.evaluate((el) => {
        const styles = getComputedStyle(el);
        return { color: styles.color, background: styles.backgroundColor, border: styles.borderTopColor, size: styles.fontSize };
      });
      expect(actual.background).toBe(theme === 'light' ? 'rgb(255, 255, 255)' : 'rgba(1, 26, 61, 0.85)');
      expect(actual.size).toBe('16px');
      expect(actual.border).toBe(theme === 'light' ? 'rgb(123, 141, 165)' : 'rgb(131, 152, 182)');
    });

    test(`${theme}: footer is decorative subtle glass; core components pass AA`, async ({ page }) => {
      await prepare(page, theme, '/');
      await expect(page.locator('footer.v4-footer')).toHaveClass(/glass-subtle/);
      const failures = await auditContrast(page);
      expect(failures).toEqual([]);
    });
  }
});
