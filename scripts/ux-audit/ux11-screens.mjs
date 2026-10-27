import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const dir = 'docs/website/ux-1-1/screens';
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const viewports = [[1920, 1080], [390, 844]];
for (const [width, height] of viewports) {
  for (const mode of ['light', 'dark']) {
    const ctx = await browser.newContext({
      viewport: { width, height }, reducedMotion: 'reduce',
      deviceScaleFactor: 1, colorScheme: mode,
    });
    const page = await ctx.newPage();
    await page.addInitScript((theme) => localStorage.setItem('root-theme', theme), mode);
    await page.goto('http://127.0.0.1:4319/', { waitUntil: 'networkidle' });
    await page.locator('main#main-content').waitFor({ state: 'visible' });
    const reject = page.getByRole('button', { name: /reject non-essential/i });
    if (await reject.count()) await reject.click({ timeout: 1200 }).catch(() => {});
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    });
    await page.waitForTimeout(400);
    const p = dir + '/home__' + width + 'x' + height + '__' + mode + '__after.png';
    await page.screenshot({ path: p, fullPage: true, animations: 'disabled' });
    console.log('Saved', p);
    await ctx.close();
  }
}
await browser.close();
