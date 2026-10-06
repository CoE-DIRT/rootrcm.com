import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { routeMeta, socialProfiles } from '../siteData.js';
import { faqItems } from '../faqData.js';
import {
  SITE_ORIGIN,
  allRoutes,
  buildInputs,
  canonicalAliases,
  internalRoutes,
  resolveCanonicalPath,
  sitemapPaths,
} from './routeRegistry.js';
import { metaForPath, renderPageHtml } from './head.js';
import { buildRobots, buildSitemap } from './sitemap.js';
import { organizationSchema } from './schema.js';

// Vitest runs from the repository root.
const repoFile = (file) => resolve(process.cwd(), file);
const read = (entry) => readFileSync(repoFile(entry), 'utf8');
const requiredRoutes = ['/', '/about/', '/services/', '/solutions/', '/case-studies/', '/pricing/', '/resources/', '/contact/', '/book/', '/faq/', '/privacy-policy/', '/terms/', '/refund-policy/', '/thank-you/'];

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

describe('route registry', () => {
  it('has unique keys and paths, and an HTML entry file for every route', () => {
    expect(new Set(allRoutes.map((route) => route.key)).size).toBe(allRoutes.length);
    expect(new Set(allRoutes.map((route) => route.path)).size).toBe(allRoutes.length);
    for (const route of allRoutes) expect(existsSync(repoFile(route.entry)), route.entry).toBe(true);
  });

  it('contains every required public route', () => {
    const paths = allRoutes.map((route) => route.path);
    for (const path of requiredRoutes) expect(paths, path).toContain(path);
    expect(paths.filter((path) => /^\/services\/[^/]+\/$/.test(path)).length).toBeGreaterThan(5);
  });

  it('keeps internal and development routes out of production inputs and the sitemap', () => {
    const production = buildInputs({ production: true });
    for (const route of internalRoutes) {
      expect(Object.keys(production)).not.toContain(route.key);
      expect(sitemapPaths()).not.toContain(route.path);
    }
    expect(Object.keys(buildInputs({ production: false }))).toContain('v4Lab');
  });

  it('resolves legacy aliases to their canonical URL', () => {
    expect(resolveCanonicalPath('/company/about')).toBe('/about/');
    expect(resolveCanonicalPath('/legal/privacy/index.html')).toBe('/privacy-policy/');
    expect(resolveCanonicalPath('/legal/terms/')).toBe('/terms/');
    expect(resolveCanonicalPath('/')).toBe('/');
    expect(resolveCanonicalPath('/404.html')).toBe('/404.html');
    for (const target of Object.values(canonicalAliases)) expect(allRoutes.map((route) => route.path)).toContain(target);
  });
});

describe('route metadata', () => {
  it('gives every indexable route a unique, bounded title and description', () => {
    const titles = new Map();
    const descriptions = new Map();
    for (const path of sitemapPaths()) {
      const { meta } = metaForPath(path);
      expect(meta, path).toBeTruthy();
      expect(meta.title.length, `${path} title`).toBeLessThanOrEqual(65);
      expect(meta.description.length, `${path} description`).toBeGreaterThanOrEqual(50);
      expect(meta.description.length, `${path} description`).toBeLessThanOrEqual(160);
      expect(titles.has(meta.title), `duplicate title ${meta.title}`).toBe(false);
      expect(descriptions.has(meta.description), `duplicate description on ${path}`).toBe(false);
      titles.set(meta.title, path);
      descriptions.set(meta.description, path);
    }
  });

  it('declares an H1 for every static public route', () => {
    for (const path of requiredRoutes) expect(metaForPath(path).meta.h1, path).toBeTruthy();
  });
});

describe('rendered page head', () => {
  const entries = allRoutes.filter((route) => !route.internal);

  it('renders exactly one title, description, canonical, theme bootstrap and no-JS H1 per page', () => {
    for (const route of entries) {
      const html = renderPageHtml(read(route.entry), route.path);
      const canonical = resolveCanonicalPath(route.path);
      const where = route.entry;
      expect(html.match(/<title>/g), where).toHaveLength(1);
      expect(html.match(/<meta name="description"/g), where).toHaveLength(1);
      expect(html.match(/<link rel="canonical"/g), where).toHaveLength(1);
      expect(html, where).toContain(`<link rel="canonical" href="${SITE_ORIGIN}${canonical}" />`);
      expect(html, where).toContain(`<meta property="og:url" content="${SITE_ORIGIN}${canonical}" />`);
      expect(html.match(/data-root-theme/g), where).toHaveLength(1);
      expect(html.match(/<noscript>[\s\S]*?<h1>/g), where).toHaveLength(1);
      expect(html.match(/<h1>/g), where).toHaveLength(1);
    }
  });

  it('is idempotent', () => {
    const once = renderPageHtml(read('contact/index.html'), '/contact/');
    expect(renderPageHtml(once, '/contact/')).toBe(once);
  });

  it('marks only system pages noindex, and every page in a non-production environment', () => {
    const robots = (route, options) => /<meta name="robots" content="noindex, nofollow" \/>/.test(renderPageHtml(read(route.entry), route.path, options));
    for (const route of entries) {
      expect(robots(route), route.entry).toBe(Boolean(route.noindex));
      expect(robots(route, { siteEnv: 'preview' }), `${route.entry} (preview)`).toBe(true);
    }
  });

  it('never leaves an internal route indexable, whatever the environment (their metadata is dev-server only)', () => {
    const robots = (html) => html.match(/<meta name="robots" content="[^"]*" \/>/g);
    for (const route of internalRoutes) {
      for (const options of [undefined, { siteEnv: 'production' }, { siteEnv: 'preview' }, { siteEnv: 'development' }]) {
        const html = renderPageHtml(read(route.entry), route.path, options);
        expect(robots(html), `${route.entry} ${JSON.stringify(options)}`).toEqual(['<meta name="robots" content="noindex, nofollow" />']);
        expect(renderPageHtml(html, route.path, options), 'idempotent').toBe(html);
      }
    }
  });

  it('points legacy alias pages at the canonical URL', () => {
    expect(renderPageHtml(read('company/about/index.html'), '/company/about/')).toContain(`href="${SITE_ORIGIN}/about/"`);
    expect(renderPageHtml(read('legal/privacy/index.html'), '/legal/privacy/')).toContain(`href="${SITE_ORIGIN}/privacy-policy/"`);
  });

  it('emits valid JSON-LD: Organization on home, FAQPage matching the FAQ items, never LocalBusiness', () => {
    const home = jsonLdBlocks(renderPageHtml(read('index.html'), '/'));
    expect(home.map((block) => block['@type'])).toEqual(['Organization', 'WebSite', 'WebPage']);
    const faq = jsonLdBlocks(renderPageHtml(read('faq/index.html'), '/faq/')).find((block) => block['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(faqItems.length);
    expect(faq.mainEntity[0].name).toBe(faqItems[0].question);
    for (const route of entries) expect(renderPageHtml(read(route.entry), route.path)).not.toContain('LocalBusiness');
  });

  it('keeps the Organization schema factual: published address, no unverified profile', () => {
    const org = organizationSchema();
    expect(org.address).toMatchObject({ addressLocality: 'Claymont', addressRegion: 'DE', postalCode: '19703', addressCountry: 'US' });
    expect(org.sameAs).not.toContain(socialProfiles.find((profile) => profile.label === 'Reddit').href);
    expect(org.sameAs.length).toBeGreaterThan(0);
  });

  it('adds a Search Console verification tag only when configured', () => {
    expect(renderPageHtml(read('index.html'), '/')).not.toContain('google-site-verification');
    expect(renderPageHtml(read('index.html'), '/', { gscVerification: 'abc123' })).toContain('<meta name="google-site-verification" content="abc123" />');
  });
});

describe('sitemap and robots', () => {
  it('lists every canonical public route once, with absolute HTTPS URLs', () => {
    const xml = buildSitemap();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toHaveLength(sitemapPaths().length);
    expect(new Set(locs).size).toBe(locs.length);
    for (const loc of locs) expect(loc.startsWith('https://rootrcm.com/')).toBe(true);
    for (const path of requiredRoutes.filter((path) => path !== '/thank-you/')) expect(locs).toContain(`${SITE_ORIGIN}${path}`);
  });

  it('excludes aliases, system and internal pages', () => {
    const xml = buildSitemap();
    for (const excluded of ['/company/about/', '/legal/privacy/', '/legal/terms/', '/thank-you/', '/404.html', '/__v4-lab/', '/case-studies/dirt-poc-01/']) {
      expect(xml).not.toContain(`${SITE_ORIGIN}${excluded}`);
    }
  });

  it('allows crawling and advertises the sitemap in production, and blocks everything elsewhere', () => {
    expect(buildRobots()).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
    expect(buildRobots({ siteEnv: 'preview' })).toBe('User-agent: *\nDisallow: /\n');
  });

  it('has no hand-maintained copy that could drift from the generated files', () => {
    expect(existsSync(repoFile('public/sitemap.xml'))).toBe(false);
    expect(existsSync(repoFile('public/robots.txt'))).toBe(false);
  });
});

describe('static route data', () => {
  it('has a route entry for each route metadata key (except dev-only ones)', () => {
    const paths = new Set(allRoutes.map((route) => route.path));
    for (const key of Object.keys(routeMeta)) {
      if (key === '/__v4-lab' || key === '/case-studies/dirt-poc-01') continue;
      expect(paths.has(`${key}/`) || paths.has(key), key).toBe(true);
    }
  });
});
