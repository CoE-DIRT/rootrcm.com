// Consolidate actual audit results into a ranked, inspectable defect matrix.
// No synthetic findings are created when measurements are missing.
import { allRoutes } from '../../src/seo/routeRegistry.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p) => JSON.parse(readFileSync(resolve(p), 'utf8'));
const dir = resolve('docs/website/baseline');
const evidence = resolve(dir, 'ux-0-3-evidence');
mkdirSync(evidence, { recursive: true });
const browser = read('.ux03-results/browser.json');
if (browser.routes.length !== allRoutes.length) throw Error('Incomplete browser coverage');
const lighthouse = [];
for (let shard = 0; shard < 6; shard += 1) {
  const p = '.ux03-results/lighthouse-' + shard + '.json';
  if (!existsSync(p)) throw Error('Missing Lighthouse shard ' + shard);
  lighthouse.push(...read(p).measurements);
}
if (lighthouse.length !== allRoutes.length * 2) throw Error('Incomplete Lighthouse run count');
const slug = (p) => p.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'home';
const issues = [];
for (const issue of browser.issues) {
  issues.push({ ...issue, fix:
    issue.category.startsWith('Accessibility:') ? 'Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes.'
    : issue.category.includes('404') ? 'Repair internal target or approved redirect; verify CTA/link destination.'
    : issue.category === 'SEO canonical' ? 'Repair canonical URL generation in the existing SEO head/registry.'
    : issue.category === 'Theme control' ? 'Fix the existing ThemeToggle synchronization without changing palette tokens.'
    : 'Investigate and rerun the failed browser audit.' });
}
for (const metric of lighthouse) {
  if (metric.error) {
    issues.push({ route: metric.route, category: 'Lighthouse unavailable (' + metric.device + ')', theme: 'light',
      severity: 'Low', detail: metric.error, fix: 'Restore lab measurement and rerun before establishing performance status.' });
    continue;
  }
  if (metric.lcpMs !== null && metric.lcpMs > 2500) {
    issues.push({ route: metric.route, category: 'LCP (' + metric.device + ')', severity: 'High', theme: 'light',
      detail: String(Math.round(metric.lcpMs)) + ' ms (threshold 2500 ms)',
      fix: 'Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk.' });
  }
  if (metric.cls !== null && metric.cls > 0.1) {
    issues.push({ route: metric.route, category: 'CLS (' + metric.device + ')', severity: 'High', theme: 'light',
      detail: metric.cls.toFixed(3) + ' (threshold 0.100)',
      fix: 'Reserve image/component dimensions and eliminate post-load font or layout shifts.' });
  }
}
function shingle(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  const out = new Set();
  for (let i = 0; i <= words.length - 5; i += 1) out.add(words.slice(i, i + 5).join(' '));
  return out;
}
const corpus = browser.routes.map((r) => ({ route: r.route, set: shingle(r.content) }));
const duplicates = [];
for (let i = 0; i < corpus.length; i += 1) {
  for (let j = i + 1; j < corpus.length; j += 1) {
    const a = corpus[i], b = corpus[j];
    if (a.set.size < 20 || b.set.size < 20) continue;
    let overlap = 0;
    for (const sh of a.set) if (b.set.has(sh)) overlap += 1;
    const score = overlap / (a.set.size + b.set.size - overlap);
    if (score > 0.85) {
      duplicates.push({ first: a.route, second: b.route, overlap: Number(score.toFixed(3)) });
      issues.push({ route: a.route + ' ↔ ' + b.route, category: 'Duplicate copy',
        severity: 'Medium', theme: 'light', detail: String(Math.round(score * 100)) + '% 5-word shingle Jaccard overlap of main content',
        fix: 'Review canonical intent and differentiate decision-support information; retain legally necessary shared wording.' });
    }
  }
}
const styleEvidence = {};
for (const theme of ['light', 'dark']) {
  for (const selector of ['h1', 'h2', 'p', 'button']) {
    const signatures = new Map();
    for (const route of browser.routes) {
      for (const style of route.styles?.[theme]?.[selector] || []) {
        const key = JSON.stringify(style);
        if (!signatures.has(key)) signatures.set(key, []);
        signatures.get(key).push(route.route);
      }
    }
    const samples = [...signatures].map(([signature, paths]) => ({ style: JSON.parse(signature), routes: [...new Set(paths)] }));
    styleEvidence[theme + ':' + selector] = samples;
    if (samples.length > 2) {
      issues.push({ route: 'Cross-route (' + selector + ', ' + theme + ')', theme,
        category: 'Computed-style conflict', severity: 'Medium',
        detail: String(samples.length) + ' distinct computed style signatures (>2 threshold; may include intentional variants)',
        fix: 'Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides.' });
    }
  }
}
const ranking = { Critical: 0, High: 1, Medium: 2, Low: 3 };
issues.sort((a, b) => ranking[a.severity] - ranking[b.severity] || a.route.localeCompare(b.route) || a.category.localeCompare(b.category));
const clean = (s) => String(s || '').replace(/\|/g, '/').replace(/[\r\n]+/g, ' ').slice(0, 350);
const lines = [
  '# UX-0.3 — Route defect matrix', '',
  '**Scope:** local Vite browser audits against the feature-branch source; all ' + allRoutes.length + ' route-registry entries, both themes for axe, mobile and desktop for Lighthouse.',
  '**Evidence:** [Browser/axe/links JSON](./ux-0-3-evidence/browser.json), [Lighthouse metrics JSON](./ux-0-3-evidence/lighthouse.json), [Style comparison JSON](./ux-0-3-evidence/styles.json), [Duplicate pairs JSON](./ux-0-3-evidence/duplicates.json).',
  '',
  '**Limits:** Lighthouse navigation reports LCP, CLS and TBT; field INP is not measured without real interactions / CrUX data and is recorded as null. No INP value is inferred from TBT. A Lighthouse failure is explicitly reported, never scored as passing.',
  '**Classification:** Critical = axe WCAG violation, broken CTA/404 or theme control failure; High = LCP > 2.5s, CLS > 0.1 or missing canonical; Medium = copy overlap > 85% / >2 style signatures; Low = redirect/cosmetic or incomplete lab measurement.',
  '',
  '| Metric | Audited / finding count |',
  '|---|---:|',
  '| Registry routes | ' + browser.routes.length + ' |',
  '| Axe scans (light + dark) | ' + browser.routes.length * 2 + ' |',
  '| Lighthouse runs (mobile + desktop) | ' + lighthouse.length + ' |',
  '| Lighthouse runs with errors | ' + lighthouse.filter((r) => r.error).length + ' |',
  '| Tested unique internal URLs | ' + browser.linkCount + ' |',
  '| Critical | ' + issues.filter((r) => r.severity === 'Critical').length + ' |',
  '| High | ' + issues.filter((r) => r.severity === 'High').length + ' |',
  '| Medium | ' + issues.filter((r) => r.severity === 'Medium').length + ' |',
  '| Low | ' + issues.filter((r) => r.severity === 'Low').length + ' |',
  '',
  '## Performance measurements',
  '',
  '| Route | Mobile LCP ms | Mobile CLS | Mobile TBT ms | Mobile INP ms | Desktop LCP ms | Desktop CLS | Desktop TBT ms | Desktop INP ms |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|'
];
const format = (n, d = 0) => typeof n === 'number' ? n.toFixed(d) : 'N/A';
for (const route of allRoutes) {
  const mob = lighthouse.find((x) => x.route === route.path && x.device === 'mobile') || {};
  const desk = lighthouse.find((x) => x.route === route.path && x.device === 'desktop') || {};
  lines.push('| ' + route.path + ' | ' + format(mob.lcpMs) + ' | ' + format(mob.cls, 3) + ' | ' + format(mob.tbtMs) + ' | ' + format(mob.inpMs) + ' | ' + format(desk.lcpMs) + ' | ' + format(desk.cls, 3) + ' | ' + format(desk.tbtMs) + ' | ' + format(desk.inpMs) + ' |');
}
lines.push('', '## Ranked findings', '',
  '| ID | Route | Category | Severity | Evidence (screenshot/JSON link) | Proposed fix |',
  '|---|---|---|---|---|---|');
if (!issues.length) lines.push('| — | All checked | No findings from available evidence | — | [Raw data](./ux-0-3-evidence/browser.json) | Continue regression monitoring. |');
for (const [i, issue] of issues.entries()) {
  const route = allRoutes.find((r) => issue.route === r.path)?.path || issue.route.split(' ↔ ')[0];
  const name = slug(route);
  const theme = issue.theme === 'dark' ? 'dark' : 'light';
  const screenshot = './screens/' + name + '__390x844__' + theme + '.png';
  // Every critical has a screenshot pre-committed by UX-0.2.
  if (issue.severity === 'Critical' && !existsSync(resolve(dir, screenshot))) {
    throw Error('Critical finding lacks screenshot ' + screenshot);
  }
  const source = issue.category.startsWith('LCP') || issue.category.startsWith('CLS') || issue.category.startsWith('Lighthouse') ? 'lighthouse.json' :
    issue.category.includes('style') ? 'styles.json' : issue.category.includes('Duplicate') ? 'duplicates.json' : 'browser.json';
  const ref = '[JSON](./ux-0-3-evidence/' + source + ')' + (issue.severity === 'Critical' ? ' · [Screenshot](' + screenshot + ')' : '');
  lines.push('| UX03-' + String(i + 1).padStart(4, '0') + ' | ' + clean(issue.route) + ' | ' + clean(issue.category + ': ' + issue.detail) + ' | **' + issue.severity + '** | ' + ref + ' | ' + clean(issue.fix) + ' |');
}
lines.push('', '## Interpretation and release decision', '',
  '- Axe criticals require semantic/component remediation, then retest with a keyboard and at least one screen reader; axe alone cannot prove WCAG 2.2 AA compliance.',
  '- Styles compare computed font, color, padding and border-radius. Distinct signatures can be legitimate role-specific designs; they are triage flags, not automatic CSS changes.',
  '- Shingle similarity uses **5-word Jaccard similarity of main-content text**, excluding global navigation and footer.',
  '- Screenshot links point to the immutable UX-0.2 route/theme evidence on this branch; screenshots establish visual context, while the JSON identifies exact axe selectors and rule IDs.',
  '- Tests run against local development Vite, **not measured production field experience**. Performance numbers must be reconfirmed against a representative production preview before launch.',
  '- No user-facing website source files or deployment configuration were modified for this audit.', '');
const markdown = lines.join('\n');
copyFileSync(resolve('.ux03-results/browser.json'), resolve(evidence, 'browser.json'));
writeFileSync(resolve(evidence, 'lighthouse.json'), JSON.stringify(lighthouse, null, 2));
writeFileSync(resolve(evidence, 'styles.json'), JSON.stringify(styleEvidence, null, 2));
writeFileSync(resolve(evidence, 'duplicates.json'), JSON.stringify(duplicates, null, 2));
writeFileSync(resolve(evidence, 'issues.json'), JSON.stringify(issues, null, 2));
writeFileSync(resolve(dir, 'issue-matrix.md'), markdown);
console.log(JSON.stringify({ total: issues.length, critical: issues.filter((x) => x.severity === 'Critical').length,
  high: issues.filter((x) => x.severity === 'High').length, medium: issues.filter((x) => x.severity === 'Medium').length,
  lighthouseRuns: lighthouse.length, incompleteLighthouse: lighthouse.filter((x) => x.error).length,
  screenshotEvidence: issues.filter((x) => x.severity === 'Critical').length, lines: lines.length }));
