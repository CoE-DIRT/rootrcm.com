import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

// Run against the actual pre-cleanup revision and the candidate, never reconstructed captions.
const output = process.env.EVIDENCE_DIR || 'test-results/phase-4-layout';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const routes = ['/', '/contact/', '/about/', '/resources/', '/case-studies/', '/diagnostic/', '/platform/', '/pricing/', '/services/', '/technology/', '/technology/dirt/',
  ...['revenue-leakage', 'aging-ar', 'denials', 'credentialing-bottlenecks', 'operational-efficiency', 'reporting-visibility', 'scaling-practice-ops'].map(s => `/solutions/${s}/`),
  ...['ar-recovery', 'patient-balances', 'credentialing', 'payment-posting', 'reporting-analytics'].map(s => `/services/${s}/`)];
const metrics = [];
mkdirSync(output, { recursive: true });
try {
  for (const width of [375, 768, 1366]) {
    for (const [revision, port] of [['before', 4325], ['after', 4326]]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'light' });
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(`http://127.0.0.1:${port}${route}`);
        await page.waitForLoadState('networkidle');
        const reject = page.getByRole('button', { name: 'Reject non-essential' });
        if (await reject.isVisible()) await reject.click();
        await page.evaluate(() => document.fonts.ready);
        const frames = page.locator('figure').filter({ has: page.locator('[data-glass-placeholder]') });
        if (await frames.count() === 0) throw new Error(`No image frames rendered: ${revision} ${route}`);
        for (let index = 0; index < await frames.count(); index++) {
          const frame = frames.nth(index);
          await frame.scrollIntoViewIfNeeded();
          await frame.locator('img').evaluate(async img => { if (!img.complete) await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; }); });
          await page.waitForTimeout(100);
          const id = `${route === '/' ? 'home' : route.replaceAll('/', '-').replace(/^-|-$/g, '')}-${index}`;
          // Include the adjacent copy and section spacing in the visual evidence.
          const box = await frame.boundingBox();
          const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
          const scrollY = await page.evaluate(() => window.scrollY);
          const y = Math.max(0, box.y + scrollY - 80);
          await page.screenshot({ path: `${output}/${id}-${width}-${revision}.png`, animations: 'disabled', clip: { x: 0, y, width, height: Math.min(box.height + 200, docHeight - y) } });
          metrics.push({ id, route, width, revision, height: box.height, image: await frame.locator('img').getAttribute('src'), caption: await frame.locator('figcaption').count(), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
        }
      }
      await context.close();
    }
  }
} finally { await browser.close(); }
writeFileSync(`${output}/metrics.json`, JSON.stringify(metrics, null, 2));
if (metrics.some(row => row.overflow)) throw new Error('Horizontal page overflow in layout evidence');
