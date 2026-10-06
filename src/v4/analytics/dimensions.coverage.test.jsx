import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import App from '../../App.jsx';
import { analyticsPaths } from '../../seo/routeRegistry.js';
import { servicePages } from '../../siteData.js';
import { APPROVED_CTAS, IGNORED_CTAS } from './approvedCtas.ts';
import { CTA_LOCATIONS, DESTINATION_LABELS, ENGAGEMENT_TYPES, FORM_IDS, PRODUCT_IDS, STATUSES } from './dimensions.js';
import { sanitizePath } from './sanitize.ts';

// The tracking-ingest Function stores a descriptive value only when it is registered (dimensions.js), so the registry has to be
// exactly what the site can emit: a value the site emits but the registry lacks would be silently dropped, and a value the
// registry lists but nothing emits is clutter that widens what the Function accepts for no reason.
//
// "What the site can emit" is read three ways, because no one of them sees everything:
//   - source: the literals written in non-test source (`data-location="home-hero"`);
//   - render: every public page rendered with its menus and panels open (values computed from data, such as pricing models);
//   - derived: the few families built from a template or a variable, listed below with the code that builds them.

const ROOT = process.cwd();

function walk(directory, files = []) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      if (name !== 'node_modules') walk(path, files);
    } else if (/\.(jsx?|tsx?)$/.test(name) && !/\.test\.[jt]sx?$/.test(name)) {
      files.push(path);
    }
  }
  return files;
}
const sources = walk(join(ROOT, 'src')).map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, 'utf8') }));
const sourceOf = (path) => sources.find((file) => file.path === path)?.text ?? '';

const literals = (pattern) => {
  const values = new Map();
  for (const { path, text } of sources) {
    for (const match of text.matchAll(pattern)) {
      const value = match.slice(1).find((group) => group !== undefined);
      if (!values.has(value)) values.set(value, new Set());
      values.get(value).add(path);
    }
  }
  return values;
};

const fromSource = {
  location: literals(/(?:data-location=|\blocation=)["']([^"']+)["']|\blocation:\s*["']([^"']+)["']/g),
  engagement: literals(/(?:data-engagement-type=|\bengagementType=)["']([^"']+)["']|\bengagementType:\s*["']([^"']+)["']/g),
  form: literals(/(?:data-form-id=|\bformId=)["']([^"']+)["']|attachFormFrictionListeners\([^,()]+,\s*["']([^"']+)["']\)/g),
  destination: literals(/data-destination=["']([^"']+)["']/g),
};

/** Families the source builds from a template or a variable, with the code that builds them. */
const derived = {
  location: [
    // src/pages.jsx (service pages): location={`service-${service.slug}`}
    ...servicePages.map((service) => `service-${service.slug}`),
    // src/components/InquiryForm.jsx: data-location={`${variant}-form`} and {`${variant}-form-fallback`}, variant contact | diagnostic
    ...['contact', 'diagnostic'].flatMap((variant) => [`${variant}-form`, `${variant}-form-fallback`]),
    // src/v4/growth/IntentBanner.tsx: data-location={active.id}
    ...[...sourceOf('src/v4/growth/IntentBanner.tsx').matchAll(/^\s+id:\s*'([a-z-]+)'/gm)].map((match) => match[1]),
    // src/v4/analytics/listeners.ts: a tel: link without a data-location is reported at "page"
    'page',
    // src/v4/routes/PricingPage.tsx: cardTracking(model, 'pricing-core' | 'pricing-specialized')
    'pricing-specialized',
  ],
  engagement: ['contact', 'diagnostic'], // src/components/InquiryForm.jsx: data-engagement-type={variant}
  form: ['contact-inquiry', 'diagnostic-inquiry'], // src/components/InquiryForm.jsx: formId || (variant === 'diagnostic' ? 'diagnostic-inquiry' : 'contact-inquiry')
};

const ATTRIBUTES = { cta: 'data-cta', location: 'data-location', engagement: 'data-engagement-type', destination: 'data-destination', form: 'data-form-id' };
const rendered = Object.fromEntries(Object.keys(ATTRIBUTES).map((key) => [key, new Map()]));

function harvest(page) {
  const selector = Object.values(ATTRIBUTES).map((name) => `[${name}]`).join(',');
  for (const element of document.querySelectorAll(selector)) {
    for (const [key, name] of Object.entries(ATTRIBUTES)) {
      const value = element.getAttribute(name);
      if (!value) continue;
      if (!rendered[key].has(value)) rendered[key].set(value, new Set());
      rendered[key].get(value).add(page);
    }
  }
}

beforeAll(() => {
  for (const path of analyticsPaths()) {
    window.history.pushState({}, '', path);
    render(<App />);
    harvest(path);
    const menu = screen.queryByRole('button', { name: 'Open menu' });
    if (menu) {
      fireEvent.click(menu);
      harvest(`${path} (menu)`);
    }
    for (const name of [/Talk to us/i, /Follow/i]) {
      const [button] = screen.queryAllByRole('button', { name });
      if (button) {
        fireEvent.click(button);
        harvest(`${path} (panel)`);
      }
    }
    cleanup();
  }
  window.history.pushState({}, '', '/');
}, 120_000);

afterEach(() => cleanup());
afterAll(() => window.history.pushState({}, '', '/'));

/** A link address is never reported (the sanitizer drops it), so it needs no registration. */
const neverSent = (value) => /^[a-z][a-z0-9+.-]*:/i.test(value) || value.includes('@') || value.includes('?');
const isPage = (value) => value.startsWith('/');

const universe = (dimension) =>
  new Set([...fromSource[dimension].keys(), ...rendered[dimension].keys(), ...(derived[dimension] ?? [])].filter((value) => !neverSent(value) && !isPage(value)));
const where = (dimension, value) => `${value} (${[...(fromSource[dimension]?.get(value) ?? []), ...(rendered[dimension]?.get(value) ?? [])].slice(0, 3).join(', ')})`;
const FIX = 'Edit src/v4/analytics/dimensions.js, then run: node scripts/appwrite/sync-analytics-allowlists.js';

describe('the analytics vocabulary is exactly what the site can emit', () => {
  it('rendered every public page (a page that renders nothing would make every check below pass for nothing)', () => {
    expect(rendered.cta.size).toBeGreaterThan(10);
    expect(rendered.location.size).toBeGreaterThan(20);
    expect(rendered.destination.size).toBeGreaterThan(8);
    expect(rendered.form.size).toBe(3);
    expect(fromSource.location.size).toBeGreaterThan(25);
  });

  it('classifies every rendered call-to-action id as tracked or deliberately ignored', () => {
    const unclassified = [...rendered.cta.keys()].filter((id) => !APPROVED_CTAS.has(id) && !IGNORED_CTAS.has(id));
    expect(unclassified.map((id) => where('cta', id))).toEqual([]);
  });

  it.each([
    ['location', CTA_LOCATIONS],
    ['engagement', ENGAGEMENT_TYPES],
    ['form', FORM_IDS],
  ])('%s: registers every value the site emits, and only those', (dimension, registry) => {
    const emitted = universe(dimension);
    const missing = [...emitted].filter((value) => !registry.includes(value));
    expect(missing.map((value) => where(dimension, value)), `Not registered. ${FIX}`).toEqual([]);
    const stale = registry.filter((value) => !emitted.has(value));
    expect(stale, `Registered but emitted nowhere (source, rendered pages or the derived families in this test). ${FIX}`).toEqual([]);
  });

  it('destination: every address is one of the site\'s pages, a registered channel label, or a link address that is never sent; and every label is used', () => {
    const labels = new Set();
    const problems = [];
    for (const value of new Set([...fromSource.destination.keys(), ...rendered.destination.keys()])) {
      if (neverSent(value)) continue;
      if (isPage(value)) {
        if (sanitizePath(value) === '/404/' && value !== '/404/') problems.push(`${value} is not one of the site's pages`);
      } else {
        labels.add(value);
        if (!DESTINATION_LABELS.includes(value)) problems.push(`${where('destination', value)} is not a registered label`);
      }
    }
    expect(problems, FIX).toEqual([]);
    expect(DESTINATION_LABELS.filter((label) => !labels.has(label)), `Registered but emitted nowhere. ${FIX}`).toEqual([]);
  });

  it('status and product: the registered values are the ones the code reports', () => {
    const listeners = sourceOf('src/v4/analytics/listeners.ts');
    const checkout = sourceOf('src/v4/growth/checkout.ts');
    expect(listeners).toMatch(/'success' : 'failure'/);
    expect(checkout).toMatch(/status: 'paid'/);
    expect([...STATUSES].sort()).toEqual(['failure', 'paid', 'success']);
    expect(checkout).toContain('DIAGNOSTIC_PRODUCT_ID');
    expect(PRODUCT_IDS).toEqual(['revenue-optimization-diagnostic']);
  });
});
