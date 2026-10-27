// UX-0.3 browser evidence collector. Non-mutating: runs on local Vite only.
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { allRoutes } from '../../src/seo/routeRegistry.js';

const DIR = resolve('.ux03-results');
const ORIGIN = 'http://127.0.0.1:4319';
mkdirSync(DIR, { recursive: true });
const indexable = new Set(allRoutes.filter((r) => !r.internal && !r.alias && !r.system && !r.noindex).map((r) => r.path));
const registered = new Set(allRoutes.map((r) => r.path));
const measurements = [];
const seenLinks = new Map();
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const page = await context.newPage();

const norm = (s) => s.endsWith('/') || /\.[a-z0-9]+$/i.test(s) ? s : s + '/';
const slug = (p) => p.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'home';
const allIssues = [];
async function recordLink(source, href) {
  try {
    const url = new URL(href, ORIGIN);
    if (!['https:', 'http:'].includes(url.protocol)) return;
    if (url.hostname !== 'rootrcm.com' && url.hostname !== 'www.rootrcm.com' && url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') return;
    url.protocol = 'http:';
    url.hostname = '127.0.0.1';
    url.port = '4319';
    url.hash = '';
    const target = url.pathname + url.search;
    if (!seenLinks.has(target)) seenLinks.set(target, { sources: [], target });
    seenLinks.get(target).sources.push(source);
  } catch { /* malformed URL handled as a browser issue if needed */ }
}

for (const route of allRoutes) {
  const item = { route: route.path, indexable: indexable.has(route.path), themes: {}, styles: {}, content: '', canonical: null };
  const response = await page.goto(ORIGIN + route.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (!response || response.status() >= 400) {
    allIssues.push({ route: route.path, category: 'HTTP route', severity: 'Critical', detail: 'Navigation status ' + (response?.status() ?? 'no response'), theme: 'light' });
  }
  await page.locator('main#main-content').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  const reject = page.getByRole('button', { name: 'Reject non-essential' });
  if (await reject.count()) await reject.click({ timeout: 800 }).catch(() => {});
  const canonical = await page.locator('link[rel=canonical]').first().getAttribute('href').catch(() => null);
  item.canonical = canonical;
  if (item.indexable && (!canonical || new URL(canonical, ORIGIN).pathname !== route.path)) {
    allIssues.push({ route: route.path, category: 'SEO canonical', severity: 'High', detail: 'Missing or mismatched canonical: ' + (canonical ?? 'null'), theme: 'light' });
  }
  item.content = await page.locator('main#main-content').innerText().catch(() => '');
  const links = await page.locator('a[href]').evaluateAll((elements) => elements.map((a) => ({ href: a.getAttribute('href'), cta: Boolean(a.closest('[data-cta]') || a.hasAttribute('data-cta')) })));
  for (const link of links) if (link.href) await recordLink(route.path, link.href);
  for (const theme of ['light', 'dark']) {
    const switcher = page.getByRole('switch', { name: 'Light theme' }).first();
    if (await switcher.count()) {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        if (await page.locator('html').getAttribute('data-theme') === theme) break;
        await switcher.click({ timeout: 1500 }).catch(() => {});
      }
    }
    const painted = await page.locator('html').getAttribute('data-theme');
    if (painted !== theme) {
      allIssues.push({ route: route.path, theme, category: 'Theme control', severity: 'Critical', detail: 'Theme switch failed: expected ' + theme + ', got ' + painted });
    }
    try {
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      item.themes[theme] = { violations: results.violations.map((v) => ({
        id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
        nodes: v.nodes.slice(0, 12).map((n) => ({ target: n.target, failureSummary: n.failureSummary })),
        affectedElements: v.nodes.length
      })) };
      for (const v of item.themes[theme].violations) allIssues.push({
        route: route.path, theme, category: 'Accessibility: ' + v.id, severity: 'Critical',
        detail: v.help + ' (' + v.affectedElements + ' elements; ' + v.impact + ')',
        target: v.nodes[0]?.target?.join(' ') || '',
      });
    } catch (err) {
      item.themes[theme] = { error: String(err) };
      allIssues.push({ route: route.path, theme, category: 'Audit runtime', severity: 'High', detail: String(err) });
    }
    item.styles[theme] = await page.locator('main').evaluate((main) => {
      const result = {};
      for (const selector of ['h1', 'h2', 'p', 'button']) {
        result[selector] = [...main.querySelectorAll(selector)].slice(0, 4).map((el) => {
          const c = getComputedStyle(el);
          return {
            fontFamily: c.fontFamily, fontSize: c.fontSize, lineHeight: c.lineHeight,
            fontWeight: c.fontWeight, color: c.color, backgroundColor: c.backgroundColor,
            padding: c.padding, borderRadius: c.borderRadius
          };
        });
      }
      return result;
    }).catch(() => ({}));
  }
  measurements.push(item);
  writeFileSync(resolve(DIR, 'browser-progress.json'), JSON.stringify({ completed: measurements.length, route: route.path }), 'utf8');
}
await browser.close();

// Resolve local links without following redirects; Vite SPA-fallback HTML is
// treated as a 404 if a path is neither a registry route nor a genuine asset.
const reqBrowser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const reqContext = await reqBrowser.newContext();
const linkIssues = [];
for (const [target, meta] of seenLinks) {
  let url = new URL(target, ORIGIN);
  const chain = [];
  let status = null;
  let mime = '';
  try {
    for (let hop = 0; hop < 8; hop += 1) {
      const resp = await reqContext.request.get(url.toString(), { maxRedirects: 0, timeout: 8000, failOnStatusCode: false });
      status = resp.status();
      mime = resp.headers()['content-type'] || '';
      if (![301, 302, 303, 307, 308].includes(status)) break;
      const location = resp.headers().location;
      if (!location) break;
      url = new URL(location, url);
      chain.push(url.pathname);
    }
  } catch (error) {
    status = 'network-error';
  }
  const path = norm(url.pathname);
  const fallback = status === 200 && mime.includes('text/html') && !registered.has(path) && !registered.has(url.pathname) && url.pathname !== '/';
  if (typeof status !== 'number' || status >= 400 || fallback) {
    for (const source of [...new Set(meta.sources)]) {
      linkIssues.push({ route: source, theme: 'light', category: 'Internal link 404',
        severity: 'Critical', detail: target + ' → ' + String(status) + (fallback ? ' (SPA fallback)' : '') });
    }
  } else if (chain.length > 1) {
    for (const source of [...new Set(meta.sources)]) linkIssues.push({
      route: source, theme: 'light', category: 'Redirect chain', severity: 'Low', detail: target + ' → ' + chain.join(' → ')
    });
  }
}
await reqContext.dispose();
await reqBrowser.close();
writeFileSync(resolve(DIR, 'browser.json'), JSON.stringify({ timestamp: new Date().toISOString(), routes: measurements, issues: [...allIssues, ...linkIssues], linkCount: seenLinks.size }, null, 2));
console.log(JSON.stringify({ routes: measurements.length, themedAxeScans: measurements.length * 2, links: seenLinks.size, issues: allIssues.length + linkIssues.length }));
if (measurements.length !== allRoutes.length) process.exitCode = 1;
