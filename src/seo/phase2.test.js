import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { phase2Content, positioning } from './phase2Content.js';
import { routeMeta } from '../siteData.js';
import { renderPageHtml } from './head.js';
import { ORGANIZATION_ID } from './schema.js';

const files = { '/': 'index.html', '/services/': 'services/index.html', '/solutions/': 'solutions/index.html', '/case-studies/': 'case-studies/index.html', '/pricing/': 'pricing/index.html', '/resources/': 'resources/index.html', '/contact/': 'contact/index.html' };
const blocks = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

describe('Phase 2.1–2.3 seven-route CSO contract', () => {
  it('maintains an explicit revenue intelligence identity', () => {
    expect(positioning).toBe('ROOT is the revenue intelligence authority that turns healthcare revenue cycle complexity into predictable, auditable financial outcomes.');
    expect(Object.keys(phase2Content).sort()).toEqual(Object.keys(files).sort());
  });

  it.each(Object.keys(files))('%s has one definitive H1, bounded metadata, an extractable definition and workflows', (route) => {
    const data = phase2Content[route], key = route === '/' ? '/' : route.slice(0, -1);
    expect(data.title.length, `${route} title`).toBeGreaterThanOrEqual(50);
    expect(data.title.length, `${route} title`).toBeLessThanOrEqual(60);
    expect(data.description.length, `${route} meta`).toBeGreaterThanOrEqual(140);
    expect(data.description.length, `${route} meta`).toBeLessThanOrEqual(160);
    expect(data.lead.trim().split(/\s+/).length, `${route} lead`).toBeGreaterThanOrEqual(40);
    expect(data.lead.trim().split(/\s+/).length, `${route} lead`).toBeLessThanOrEqual(60);
    expect(data.h1.endsWith('.')).toBe(true);
    expect(data.h1).not.toContain('?');
    expect(data.sections.length).toBeGreaterThanOrEqual(3);
    expect(data.sections.length).toBeLessThanOrEqual(5);
    for (const section of data.sections) {
      expect(section.body.split(/(?<=[.!?])\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(2);
      expect(section.items.length).toBeGreaterThanOrEqual(2);
    }
    expect(data.principle.length).toBeGreaterThan(40);
    expect(data.definition).toMatch(/^(ROOT is|A healthcare|Healthcare RCM|The ROOT|ROOT pricing|A revenue)/);
    expect(routeMeta[key]).toMatchObject({ title: data.title, description: data.description, h1: data.h1 });
    const html = renderPageHtml(readFileSync(files[route], 'utf8'), route);
    expect(html).toContain(`<h1>${data.h1}</h1>`);
    expect(html).toContain(data.definition);
    expect(html).toContain(data.sections[0].heading);
    expect(html).toContain('<ol>');
    expect(html).toContain('href="/diagnostic/"');
    expect(html).toContain('href="/resources/"');
    if (route === '/resources/') expect(readFileSync('public/downloads/root-revenue-intelligence-checklist.txt', 'utf8')).toContain('Do not place PHI');
    expect(html).toContain(`<meta property="og:url" content="https://rootrcm.com${route}" />`);
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
  });

  it('has unique commercial title and description metadata', () => {
    expect(new Set(Object.values(phase2Content).map((p) => p.title)).size).toBe(7);
    expect(new Set(Object.values(phase2Content).map((p) => p.description)).size).toBe(7);
  });

  it('emits real schema only, Service on pricing/services, Organization with contact on contact', () => {
    const home = blocks(renderPageHtml(readFileSync(files['/'], 'utf8'), '/'));
    const org = home.find((b) => b['@type'] === 'Organization');
    expect(org).toMatchObject({ '@id': ORGANIZATION_ID, url: 'https://rootrcm.com/' });
    expect(org.sameAs).toContain('https://www.linkedin.com/company/rootrcm/');
    for (const route of ['/services/', '/pricing/']) {
      const service = blocks(renderPageHtml(readFileSync(files[route], 'utf8'), route)).find((b) => b['@type'] === 'Service');
      expect(service.provider).toEqual({ '@id': ORGANIZATION_ID });
    }
    const contact = blocks(renderPageHtml(readFileSync(files['/contact/'], 'utf8'), '/contact/'));
    expect(contact.find((b) => b['@type'] === 'Organization').contactPoint).toHaveLength(1);
    expect(contact.map((b) => b['@type'])).not.toContain('LocalBusiness');
  });

  it('uses Article OpenGraph and JSON-LD only for actual resource articles', () => {
    const hub = renderPageHtml(readFileSync(files['/resources/'], 'utf8'), '/resources/');
    expect(hub).toContain('<meta property="og:type" content="website" />');
    const resource = '/resources/asc-denials-guide/';
    // Find a real article route from the same registry instead of inventing a slug.
    const articles = Object.entries(routeMeta).filter(([key]) => key.startsWith('/resources/'));
    expect(articles.length).toBeGreaterThan(0);
    const [key] = articles[0];
    const entry = `${key.slice(1)}/index.html`;
    const html = renderPageHtml(readFileSync(entry, 'utf8'), `${key}/`);
    expect(html).toContain('<meta property="og:type" content="article" />');
    expect(blocks(html).map((b) => b['@type'])).toContain('Article');
    expect(resource).toMatch(/^\/resources\//);
  });
});
