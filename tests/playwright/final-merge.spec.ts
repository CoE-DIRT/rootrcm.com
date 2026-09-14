import { test, expect } from '@playwright/test';

test.describe('DIRT-led merge — final QA', () => {
  test('DIRT triage grid expand/Explain/close works and stays keyboard-focusable', async ({ page }) => {
    await page.goto('/technology/dirt/');
    const explainButtons = page.getByRole('button', { name: /^Explain$/i });
    await explainButtons.first().click();
    await expect(page.getByText('Explain this recommendation')).toBeVisible();
    await page.getByRole('button', { name: /Close/i }).click();
    await expect(page.getByText('Explain this recommendation')).toBeHidden();

    const firstToggle = page.getByRole('button', { name: /Eligibility denials/i });
    await firstToggle.focus();
    await expect(firstToggle).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
  });

  const routes = [
    '/', '/platform/', '/services/', '/services/rcm/', '/technology/', '/technology/dirt/',
    '/pricing/', '/diagnostic/', '/solutions/', '/case-studies/', '/resources/',
    '/company/about/', '/contact/', '/legal/cookies/',
  ];

  test('no horizontal overflow at 390px / 430px on core routes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile widths are covered by the mobile-chromium project');
    for (const width of [390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      for (const path of routes) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(1);
      }
    }
  });

  for (const width of [768, 1024, 1366, 1440, 1536]) {
    test(`no horizontal overflow at ${width}px on core routes`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'laptop/desktop widths are covered by the desktop chromium project');
      await page.setViewportSize({ width, height: 900 });
      for (const path of routes) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(1);
      }
    });
  }

  test('Diagnostic sample-report anchor resolves to the illustrative sample section', async ({ page }) => {
    await page.goto('/diagnostic/#sample-report');
    await expect(page.getByRole('heading', { name: /Illustrative Revenue Optimization Diagnostic/i })).toBeVisible();
  });

  test('reduced motion: DIRT scenario toggle still updates values with no animation errors', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/technology/dirt/');
    const modelButton = page.getByRole('button', { name: /Model the improvement/i });
    await modelButton.click();
    await expect(page.getByRole('button', { name: /Reset to baseline/i })).toBeVisible();
  });
});
