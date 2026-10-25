import { expect, test } from '@playwright/test';

const pages = [
  ['/', 'Revenue intelligence for healthcare organizations that refuse to guess.'],
  ['/services/', 'End-to-end RCM execution, instrumented at every handoff.'],
  ['/solutions/', 'Solutions by specialty, not generic revenue cycle promises.'],
  ['/case-studies/', 'Measured outcomes, not testimonials.'],
  ['/pricing/', 'Transparent platform tiers for predictable revenue operations.'],
  ['/resources/', 'The revenue intelligence library.'],
  ['/contact/', 'Book a revenue diagnostic. Leave with a hypothesis.'],
] as const;

test.describe('Phase 2 CSO content and semantic markup', () => {
  for (const [route, headline] of pages) {
    test(`${route}: one canonical H1, definition, workflows, visible CTAs and head`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(headline);
      const editorial = page.locator('[data-cso-route]');
      await expect(editorial).toBeVisible();
      await expect(editorial.locator('article')).toHaveCount(3);
      await expect(editorial.locator('ol')).toHaveCount(3);
      for (const list of await editorial.locator('ol').all()) {
        expect(await list.locator('li').count()).toBeGreaterThanOrEqual(2);
      }
      const definition = page.locator('[data-cso-definition]');
      await expect(definition).toBeVisible();
      await expect(definition).not.toBeEmpty();
      await expect(page.locator('a[href="/diagnostic/"]').last()).toBeVisible();
      await expect(page.locator('a[href="/resources/"]').last()).toBeVisible();
      const canonical = page.locator('head link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', `https://rootrcm.com${route}`);
      await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
      const json = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(json.length).toBeGreaterThanOrEqual(3);
      if (route === '/contact/') expect(json.some((data) => JSON.parse(data)['@type'] === 'LocalBusiness')).toBe(false);
    });
  }
});
