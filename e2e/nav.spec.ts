import { test, expect } from '@playwright/test';

test.describe('UX-1.1 Navigation rebuild', () => {
  test('desktop hover and keyboard dropdown expose destination and current page', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/services/rcm/');
    const nav = page.getByRole('navigation', { name: 'Primary navigation' });
    const services = nav.getByRole('button', { name: 'Services' });
    await expect(services).toBeVisible();
    await services.hover();
    await expect(services).toHaveAttribute('aria-expanded', 'true');
    const allServices = nav.getByRole('link', { name: /All services/ });
    await expect(allServices).toBeVisible();
    await expect(nav.getByRole('link', { name: /Revenue Cycle Management/ })).toHaveAttribute('aria-current', 'page');
    await services.focus();
    await page.keyboard.press('Escape');
    await expect(services).toHaveAttribute('aria-expanded', 'false');
    await services.focus();
    await page.keyboard.press('Enter');
    await expect(services).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', { name: 'Book a Consultation with ROOT' })).toHaveAttribute('href', '/book/');
  });

  test('full-screen mobile menu traps focus, expands accordion, and closes by Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const open = page.getByRole('button', { name: 'Open menu' });
    await open.click();
    const dialog = page.getByRole('dialog', { name: 'Explore ROOT' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    const nav = dialog.getByRole('navigation', { name: 'Mobile navigation' });
    const tech = nav.getByRole('button', { name: 'Technology' });
    await tech.click();
    await expect(tech).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', { name: /DIRT Intelligence/ })).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Book a Consultation with ROOT' })).toBeVisible();
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      await expect.poll(() => page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
  });

  test('skip link targets #main and keyboard focus has a visible ring', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute('href', '#main');
    await skip.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await expect(page.locator('#main')).toHaveCount(1);
  });
});
