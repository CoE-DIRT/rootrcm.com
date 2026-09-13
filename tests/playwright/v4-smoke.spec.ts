import { test, expect } from '@playwright/test';

test.describe('ROOT V4 smoke', () => {
  test('home page still renders the legacy-approved hero (V4 has not replaced it yet)', async ({ page }) => {
    // Home runs an A/B headline experiment (src/experiments.js) — assert the
    // variant-invariant eyebrow, not either variant's exact headline text.
    await page.goto('/');
    await expect(page.getByText('RCM + Operations + Technology', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /Start the \$2,500 Diagnostic/i }).first()).toBeVisible();
  });

  test('V4 component lab renders primitives and is marked noindex', async ({ page }) => {
    await page.goto('/__v4-lab/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.getByRole('heading', { name: 'V4 component gallery' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Primary', exact: true })).toBeVisible();
  });

  test('V4 mega menu opens on click and lists real service links', async ({ page, isMobile }) => {
    test.skip(isMobile, 'mega menu is a desktop-only nav; mobile uses the sheet, covered separately');
    await page.goto('/__v4-lab/');
    await page.getByRole('button', { name: 'Services' }).click();
    await expect(
      page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Revenue Cycle Management' }),
    ).toBeVisible();
  });

  test('cookie consent banner offers Accept / Reject / Manage, and the disclosure page lists it', async ({ page }) => {
    await page.goto('/legal/cookies/');
    await expect(page.getByRole('button', { name: 'Accept all' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reject non-essential' })).toBeVisible();
    await expect(page.getByText('root_consent')).toBeVisible();

    await page.getByRole('button', { name: 'Accept all' }).click();
    await expect(page.getByRole('button', { name: 'Accept all' })).toBeHidden();
  });

  test('mobile viewport shows the hamburger and opens the mobile sheet', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'desktop project covers the inline nav');
    await page.goto('/__v4-lab/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('link', { name: 'Platform' })).toBeVisible();
  });
});
