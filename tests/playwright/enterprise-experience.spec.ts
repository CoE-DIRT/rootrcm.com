import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test.describe('Founder-authorized enterprise launch experience', () => {
  for (const theme of ['light','dark'] as const) {
    for (const width of [375,768,1366] as const) {
      test(`${theme} ${width}px: flagship modules, pricing and interactive demo remain usable`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript((saved) => localStorage.setItem('root-theme', saved), theme);
        await page.goto('/');
        await expect(page.locator('.root-home-hero')).toBeVisible();
        await expect(page.getByRole('link', { name: /Free introductory consultation/i }).first()).toBeVisible();
        await expect(page.locator('.root-workflow-card').first()).toBeVisible();
        await expect(page.locator('.root-product-frame')).toHaveCount(1);
        await expect(page.locator('.root-tier-card')).toHaveCount(4);
        await expect(page.locator('.root-scenario-carousel')).toHaveCount(1);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        for (const selector of ['.root-product-frame', '.root-tier-grid', '.root-scenario-carousel', '.root-conversion-frame']) {
          const rect = await page.locator(selector).boundingBox();
          expect(rect, `No geometry for ${selector}`).not.toBeNull();
          if (rect) {
            expect(rect.x, `${selector} left overflow`).toBeGreaterThanOrEqual(-1);
            expect(rect.x + rect.width, `${selector} right overflow`).toBeLessThanOrEqual(viewportWidth + 1);
          }
        }
      });
    }
  }

  test('DIRT workbench tabs change metrics and human action queue', async ({ page }) => {
    await page.goto('/');
    const workbench = page.locator('.root-product-frame');
    await expect(workbench.getByRole('heading', { name: 'An operating view of where cash is held up.' })).toBeVisible();
    await workbench.getByRole('tab', { name: 'Denial analytics' }).click();
    await expect(workbench.getByRole('tab', { name: 'Denial analytics' })).toHaveAttribute('aria-selected','true');
    await expect(workbench.getByText('Modifier denial cluster')).toBeVisible();
    await workbench.getByRole('tab', { name: 'Credentialing' }).click();
    await expect(workbench.getByText('Effective-date validation')).toBeVisible();
    await expect(workbench.getByRole('tab', { name: 'Revenue intelligence' }).click();
    await expect(workbench.getByText('Aging balances by payer')).toBeVisible();
  });

  test('scenario carousel is actually interactive and does not impersonate a customer', async ({ page }) => {
    await page.goto('/');
    const gallery = page.locator('.root-proof-section');
    await expect(gallery.getByRole('heading', { name: /Turn claim exceptions into a prioritized recovery queue/ })).toBeVisible();
    await gallery.getByRole('button', { name: 'Next scenario' }).click();
    await expect(gallery.getByRole('heading', { name: /Give leadership one operating picture across specialties/ })).toBeVisible();
    await gallery.getByRole('button', { name: 'Previous scenario' }).click();
    await expect(gallery.getByRole('heading', { name: /Turn claim exceptions into a prioritized recovery queue/ })).toBeVisible();
    await expect(gallery.getByText('VERIFICATION PENDING')).toBeVisible();
    await expect(gallery.getByText('IN PREPARATION')).toBeVisible();
  });

  test('pricing page includes free consultation, published diagnostic, ongoing and custom paths', async ({ page }) => {
    await page.goto('/pricing/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.root-tier-card')).toHaveCount(5);
    await expect(page.getByRole('link', { name: /Free introductory consultation/i }).first()).toHaveAttribute('href','/contact/#contact-form');
    await expect(page.getByText('$2,500').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Full MSO + Technology' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Credentialing' })).toBeVisible();
  });
});
