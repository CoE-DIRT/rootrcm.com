// Lighthouse runs against the local Vite server, one browser device per route.
// A lab navigation cannot measure field INP; record explicit null (not TBT as INP).
import { chromium } from '@playwright/test';
import { allRoutes } from '../../src/seo/routeRegistry.js';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const totalShards = Number(process.env.UX03_SHARDS || 6);
const shard = Number(process.env.UX03_SHARD || 0);
const outDir = resolve('.ux03-results/lighthouse');
mkdirSync(outDir, { recursive: true });
const slug = (p) => p.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'home';
const cli = resolve('node_modules/.bin/lighthouse');
const output = [];
for (const [index, route] of allRoutes.entries()) {
  if (index % totalShards !== shard) continue;
  for (const device of ['mobile', 'desktop']) {
    const path = resolve(outDir, slug(route.path) + '__' + device + '.json');
    const args = ['http://127.0.0.1:4319' + route.path,
      '--only-categories=performance', '--output=json', '--output-path=' + path,
      '--quiet', '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
      '--max-wait-for-load=20000', '--throttling-method=simulate'];
    if (device === 'desktop') args.push('--preset=desktop');
    const result = spawnSync(cli, args, {
      env: { ...process.env, CHROME_PATH: chromium.executablePath() },
      encoding: 'utf8', timeout: 110000, maxBuffer: 2_000_000
    });
    if (result.status !== 0) {
      output.push({ route: route.path, device, error: (result.stderr || result.stdout || String(result.error)).slice(-1000),
        lcpMs: null, cls: null, tbtMs: null, inpMs: null });
      continue;
    }
    try {
      const data = JSON.parse(readFileSync(path, 'utf8'));
      const audits = data.audits || {};
      const get = (key) => audits[key]?.numericValue ?? null;
      output.push({ route: route.path, device, performanceScore: data.categories?.performance?.score ?? null,
        lcpMs: get('largest-contentful-paint'), cls: get('cumulative-layout-shift'), tbtMs: get('total-blocking-time'),
        inpMs: get('interaction-to-next-paint'), requestedUrl: data.requestedUrl, finalUrl: data.finalDisplayedUrl || data.finalUrl,
        lighthouseVersion: data.lighthouseVersion });
    } catch (error) { output.push({ route: route.path, device, error: String(error), lcpMs: null, cls: null, tbtMs: null, inpMs: null }); }
    rmSync(path, { force: true });
  }
}
const destination = resolve('.ux03-results', 'lighthouse-' + shard + '.json');
writeFileSync(destination, JSON.stringify({ shard, totalShards, measurements: output }, null, 2));
const errors = output.filter((x) => x.error);
console.log(JSON.stringify({ shard, count: output.length, errors: errors.length, destination }));
// Incomplete or unavailable metrics remain visibly unverified, not fabricated.
if (errors.length) console.error(JSON.stringify(errors.slice(0, 5)));
