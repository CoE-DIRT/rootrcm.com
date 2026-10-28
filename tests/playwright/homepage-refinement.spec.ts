import { expect, test } from '@playwright/test';

test.describe('Reference-led homepage visual refinement', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [375, 768, 1366] as const) {
      test(`${theme} ${width}px: visible art direction, DIRT and service discovery`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript((saved) => localStorage.setItem('root-theme', saved), theme);
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        const hero = page.locator('.root-home-hero');
        await expect(hero).toBeVisible();
        await expect(hero.locator('h1')).toHaveCount(1);
        await expect(hero.locator('.root-home-hero-photo-image')).toHaveAttribute('src', '/media/images/home-practice-operations.jpg');
        await expect(hero.locator('.root-home-hero-photo-callout')).toBeVisible();
        await expect(hero.locator('[data-hero-dirt-preview] .root-dashboard-preview')).toBeVisible();

        const cards = page.locator('[data-commercial-service-grid] .root-commercial-bento');
        await expect(cards).toHaveCount(6);
        await expect(page.locator('[data-commercial-service-grid] a[href="/services/medical-billing/"]')).toHaveCount(1);
        await expect(page.locator('[data-commercial-service-grid] a[href="/services/credentialing/"]')).toHaveCount(1);

        const viewportWidth = await page.evaluate(() => window.innerWidth);
        for (const selector of ['.root-home-hero-photo', '.home-visual-dirt-preview', '[data-commercial-service-grid]']) {
          const bounds = await page.locator(selector).boundingBox();
          expect(bounds, `missing bounding box for ${selector}`).not.toBeNull();
          if (bounds) {
            expect(bounds.x, `${selector} left clip`).toBeGreaterThanOrEqual(-1);
            expect(bounds.x + bounds.width, `${selector} right clip`).toBeLessThanOrEqual(viewportWidth + 1);
          }
        }
      });
    }
  }

  test('hero links preserve existing diagnostic and contact destinations', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('.root-home-hero');
    await expect(hero.locator('a[href="/diagnostic/"]')).toHaveCount(1);
    await expect(hero.locator('a[href="/contact/"]')).toHaveCount(1);
    await expect(page.locator('.root-home-hero-photo-image')).toHaveAttribute('width', '1600');
    await expect(page.locator('.root-home-hero-photo-image')).toHaveAttribute('height', '900');
  });
});
