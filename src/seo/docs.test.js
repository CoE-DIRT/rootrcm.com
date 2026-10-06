import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { allRoutes, sitemapPaths } from './routeRegistry.js';

// Documentation that lists routes must not drift from the registry the build actually uses.
const read = (file) => readFileSync(resolve(process.cwd(), file), 'utf8');

describe('SEO documentation matches the route registry', () => {
  const sitemapDoc = read('docs/website/sitemap.md');

  it('lists every indexable route and states the right count', () => {
    for (const path of sitemapPaths()) expect(sitemapDoc, path).toContain(`\`${path}\``);
    expect(sitemapDoc).toContain(`${sitemapPaths().length} URLs`);
    expect(read('docs/seo/search-console.md')).toContain(`${sitemapPaths().length} URLs`);
  });

  it('names every noindex and alias route as excluded', () => {
    for (const route of allRoutes.filter((candidate) => (candidate.noindex || candidate.alias) && !candidate.internal && !candidate.system)) {
      expect(sitemapDoc, route.path).toContain(route.path);
    }
  });

  it('no longer describes static sitemap or robots files', () => {
    for (const file of ['docs/seo/README.md', 'docs/seo/technical-seo.md', 'docs/deployment/github-pages.md', 'docs/website/sitemap.md']) {
      expect(read(file), file).not.toMatch(/public\/sitemap\.xml` (is|includes)|public\/robots\.txt` (points|are)|`public\/robots\.txt` and `public\/sitemap\.xml` are copied/);
    }
  });

  it('never claims verification, indexing or rankings', () => {
    // A sentence that says something "is verified/indexed/ranked" must be negated or conditional ("not", "no", "once", "until", "if", ...).
    const claim = /\b(is|are|was|has been) (verified|indexed|ranking|ranked)\b/i;
    const hedge = /\b(no|not|never|nothing|until|once|only|unless|if|before|after)\b/i;
    for (const file of ['docs/seo/README.md', 'docs/seo/search-console.md', 'docs/seo/google-business-profile.md', 'docs/seo/keyword-evidence.md']) {
      const unhedged = read(file)
        .split(/(?<=[.!?])\s+|\n+/)
        .filter((sentence) => claim.test(sentence) && !hedge.test(sentence));
      expect(unhedged, file).toEqual([]);
    }
    expect(read('docs/seo/search-console.md')).toMatch(/not verified/i);
    expect(read('docs/seo/google-business-profile.md')).toMatch(/not done/i);
  });
});
