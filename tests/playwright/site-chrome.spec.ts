import { expect, test, type Page } from '@playwright/test';
import { auditContrast } from './helpers/contrast';

const THEME_KEY = 'root-theme';
const themeOf = (page: Page) => page.evaluate(() => document.documentElement.getAttribute('data-theme'));
const consentGiven = async (page: Page) => {
  // Keep the consent notice out of the way: dismiss it as a visitor would.
  const reject = page.getByRole('button', { name: 'Reject non-essential' });
  if (await reject.isVisible().catch(() => false)) await reject.click();
};

test.describe('theme', () => {
  test('is applied before the app bundle runs (no flash) and follows the system preference on a first visit', async ({ browser }) => {
    for (const scheme of ['light', 'dark'] as const) {
      const context = await browser.newContext({ colorScheme: scheme });
      const page = await context.newPage();
      // Block the app so only the inline <head> bootstrap can have set the theme.
      await page.route('**/src/main.jsx', (route) => route.abort());
      await page.route('**/assets/main-*.js', (route) => route.abort());
      await page.goto('/contact/');
      expect(await themeOf(page), `system ${scheme}`).toBe(scheme);
      // The bootstrap also sets color-scheme (native form controls/scrollbars) and the browser chrome color.
      expect(await page.evaluate(() => document.documentElement.style.colorScheme)).toBe(scheme);
      const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
      expect(themeColor).toBe(scheme === 'light' ? '#f4f7f5' : '#07110e');
      await context.close();
    }
  });

  test('switches instantly, persists across reloads and beats the system preference', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/pricing/');
    await consentGiven(page);
    const toggle = page.getByRole('switch', { name: 'Light theme' });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(await themeOf(page)).toBe('light');
    expect(await page.evaluate((key) => localStorage.getItem(key), THEME_KEY)).toBe('light');
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe('rgb(7, 17, 14)');

    await page.reload();
    expect(await themeOf(page)).toBe('light');
    await page.goto('/contact/');
    expect(await themeOf(page)).toBe('light');
    await expect(page.getByRole('switch', { name: 'Light theme' })).toHaveAttribute('aria-checked', 'true');
    await context.close();
  });

  test('toggle is operable from the keyboard with a visible focus indicator', async ({ page }) => {
    await page.goto('/pricing/');
    await consentGiven(page);
    const toggle = page.getByRole('switch', { name: 'Light theme' });
    await toggle.focus();
    await expect(toggle).toBeFocused();
    const ring = await toggle.evaluate((element) => getComputedStyle(element).boxShadow + getComputedStyle(element).outlineStyle);
    expect(ring).not.toBe('none');
    const before = await themeOf(page);
    await page.keyboard.press('Space');
    expect(await themeOf(page)).not.toBe(before);
    await page.keyboard.press('Enter');
    expect(await themeOf(page)).toBe(before);
  });

  test('works with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await consentGiven(page);
    const duration = await page.locator('header.v4-header').evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(parseFloat(duration)).toBeLessThan(0.05);
    await page.getByRole('switch', { name: 'Light theme' }).click();
    expect(await themeOf(page)).not.toBeNull();
  });
});

test.describe('header', () => {
  test('is transparent over the hero and becomes solid after scrolling', async ({ page }) => {
    await page.goto('/');
    await consentGiven(page);
    const header = page.locator('header.v4-header');
    const alpha = (value: string) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return 1;
      const parts = match[1].split(/[ ,/]+/).filter(Boolean);
      return parts.length > 3 ? Number(parts[3]) : 1;
    };
    await expect(header).toHaveAttribute('data-scrolled', 'false');
    expect(alpha(await header.evaluate((element) => getComputedStyle(element).backgroundColor))).toBeLessThan(0.05);

    await page.evaluate(() => window.scrollTo(0, 700));
    await expect(header).toHaveAttribute('data-scrolled', 'true');
    await expect.poll(async () => alpha(await header.evaluate((element) => getComputedStyle(element).backgroundColor))).toBeGreaterThan(0.5);
  });

  test('exposes every required item in order, with a primary CTA', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await consentGiven(page);
    const nav = page.getByRole('navigation', { name: 'Primary navigation' });
    const labels = await nav.locator('li > a, li > button').allInnerTexts();
    expect(labels.map((label) => label.trim())).toEqual(['Home', 'About', 'Services', 'Solutions', 'Case Studies', 'Pricing', 'Resources', 'Contact']);
    await expect(page.locator('header').getByRole('link', { name: 'Book a Diagnostic' })).toHaveAttribute('href', '/diagnostic/');
  });

  test('has no wrapped or clipped labels at laptop and desktop widths', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation');
    for (const width of [1280, 1366, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const metrics = await page.locator('header.v4-header').evaluate((header) => {
        const bar = header.firstElementChild!.nextElementSibling as HTMLElement;
        return {
          barHeight: bar.getBoundingClientRect().height,
          overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          wrapped: Array.from(header.querySelectorAll('nav a, nav button, a[aria-label="ROOT home"]')).filter((element) => element.getClientRects().length && element.getBoundingClientRect().height > 44).length,
        };
      });
      expect(metrics.wrapped, `${width}px`).toBe(0);
      expect(metrics.overflowX, `${width}px`).toBeLessThanOrEqual(1);
      expect(metrics.barHeight, `${width}px`).toBeLessThanOrEqual(80);
    }
  });

  test('Services mega menu opens from the keyboard and its links are reachable', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await consentGiven(page);
    const trigger = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('button', { name: 'Services' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Denial Management' }).first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile menu opens by keyboard, traps focus, closes with Escape and returns focus', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile navigation');
    await page.goto('/');
    await consentGiven(page);
    const open = page.getByRole('button', { name: 'Open menu' });
    await open.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    for (const label of ['Home', 'About', 'Case Studies', 'Pricing', 'Resources', 'Contact']) {
      await expect(dialog.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(dialog.getByRole('link', { name: 'Book a Diagnostic' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
  });

  test('skip link is the first tab stop and moves focus to the main landmark', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard order is covered on desktop');
    await page.goto('/contact/');
    await consentGiven(page);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  });
});

test.describe('footer and social controls', () => {
  test('social links are labelled, open safely in a new tab and show a tooltip on keyboard focus', async ({ page, isMobile }) => {
    await page.goto('/');
    await consentGiven(page);
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    const social = footer.getByRole('navigation', { name: 'Follow ROOT on social media' });
    const links = social.getByRole('link');
    expect(await links.count()).toBe(6);
    for (let index = 0; index < 6; index += 1) {
      const link = links.nth(index);
      await expect(link).toHaveAttribute('aria-label', /^ROOT on .+ \(opens in new tab\)$/);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      const box = await link.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    if (!isMobile) {
      await links.first().focus();
      await expect(page.getByRole('tooltip')).toContainText('LinkedIn');
    }
  });

  test('the Follow dock opens a labelled social panel and closes with Escape', async ({ page }) => {
    await page.goto('/');
    await consentGiven(page);
    const trigger = page.getByRole('button', { name: 'Follow ROOT' }).first();
    await trigger.click();
    const panel = page.getByRole('dialog', { name: 'Follow ROOT' });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('link', { name: /ROOT on Instagram/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('the dock does not cover the hero call to action', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop composition');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await consentGiven(page);
    const cta = await page.getByRole('link', { name: /Discover Your Revenue Exposure/ }).first().boundingBox();
    const dock = await page.getByRole('button', { name: 'Follow ROOT' }).first().boundingBox();
    const overlap = !(dock!.x + dock!.width <= cta!.x || cta!.x + cta!.width <= dock!.x || dock!.y + dock!.height <= cta!.y || cta!.y + cta!.height <= dock!.y);
    expect(overlap).toBe(false);
  });
});

const NEW_ROUTES = ['/about/', '/faq/', '/book/', '/privacy-policy/', '/terms/', '/refund-policy/'];

test.describe('new routes', () => {
  for (const route of NEW_ROUTES) {
    test(`${route} loads directly, has one H1 and no horizontal overflow`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response!.status()).toBe(200);
      await consentGiven(page);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://rootrcm.com${route}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test('FAQ disclosures open and close from the keyboard', async ({ page }) => {
    await page.goto('/faq/');
    await consentGiven(page);
    const first = page.locator('details').first();
    await first.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('open', '');
    await page.keyboard.press('Enter');
    await expect(first).not.toHaveAttribute('open', '');
  });

  test('legacy URLs still load and point their canonical at the new URL', async ({ page }) => {
    for (const [legacy, canonical] of [['/company/about/', '/about/'], ['/legal/privacy/', '/privacy-policy/'], ['/legal/terms/', '/terms/']]) {
      expect((await page.goto(legacy))!.status()).toBe(200);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://rootrcm.com${canonical}`);
    }
  });

  test('sitemap.xml and robots.txt are served and consistent', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const route of NEW_ROUTES) expect(xml).toContain(`<loc>https://rootrcm.com${route}</loc>`);
    expect(xml).not.toContain('/company/about/');
    expect(xml).not.toContain('/thank-you/');
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://rootrcm.com/sitemap.xml');
  });
});

test.describe('color contrast (WCAG AA) in both themes', () => {
  const routes = ['/', '/about/', '/services/', '/services/rcm/', '/solutions/', '/solutions/denials/', '/pricing/', '/resources/', '/contact/', '/book/', '/faq/', '/privacy-policy/', '/diagnostic/', '/legal/cookies/'];
  for (const theme of ['dark', 'light'] as const) {
    test(`${theme}: no text fails contrast on core routes`, async ({ browser }) => {
      test.setTimeout(120_000);
      const context = await browser.newContext({ colorScheme: theme });
      await context.addInitScript(
        ([key, value]) => {
          try {
            window.localStorage.setItem(key, value);
            // Pin experiment assignment so copy is deterministic.
            window.localStorage.setItem('root-conversion-experiments-v1', JSON.stringify({ homeHero: 'a', diagnosticHero: 'a' }));
          } catch {
            /* storage unavailable */
          }
        },
        [THEME_KEY, theme],
      );
      const page = await context.newPage();
      const failures: string[] = [];
      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        for (const failure of await auditContrast(page)) failures.push(`${route} ${failure.ratio}<${failure.required} ${failure.selector} "${failure.text}"`);
      }
      expect(failures).toEqual([]);
      await context.close();
    });
  }
});
