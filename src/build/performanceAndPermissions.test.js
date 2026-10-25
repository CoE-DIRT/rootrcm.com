import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { appwriteCollectionPolicy, inspectAppwritePermissionSet } from './appwritePermissionsPolicy.js';

describe('Phase 3.3 image, lazy and font CLS contracts', () => {
  const read = (p) => readFileSync(p, 'utf8');
  it('reserves layout before images and visual components load', () => {
    const src = read('src/v4/components/ui/GlassPlaceholder.tsx');
    expect(src).toContain('aspectRatio: ratio[aspect]');
    expect(src).toContain('minHeight');
    expect(src).toContain('aria-busy');
    const media = read('src/v4/components/ui/MediaFrame.tsx');
    expect(media).toContain('GlassPlaceholder');
    expect(media).toContain('height={intrinsicSize[aspect].height}');
    expect(media).toContain("loading={priority ? 'eager' : 'lazy'}");
    const hero = read('src/v4/components/sections/HeroSection.tsx');
    expect(hero).toContain('fetchPriority="high"');
    expect(hero).toContain('loading="eager"');
    const carousel = read('src/components/CaseStudyCarousel.jsx');
    expect((carousel.match(/width=\{1200\} height=\{675\}/g) || []).length).toBe(2);
    expect(carousel).toContain('GlassPlaceholder aspect="carousel"');
  });
  it('lazy-loads dashboard/chart, pricing comparison and case study carousel with skeletons', () => {
    const dirt = read('src/v4/routes/TechnologyPages.tsx');
    expect(dirt).toContain("lazy(() => import('@/components/dirt/DirtCommandCenter')");
    expect(dirt).toContain('GlassPlaceholder minHeight="40rem"');
    const pricing = read('src/v4/routes/PricingPage.tsx');
    expect(pricing).toContain("lazy(() => import('./PricingGlance')");
    expect(pricing).toContain('GlassPlaceholder busy minHeight="38rem"');
    const cases = read('src/pages.jsx');
    expect(cases).toContain("lazy(() => import('./components/CaseStudyCarousel.jsx'))");
    expect(cases).toContain('GlassPlaceholder aspect="carousel" busy');
  });
  it('uses deterministic local system font stack with no remote brand font preload', () => {
    const css = read('src/v4/styles/tailwind.css');
    expect(css).toMatch(/--font-display:\s*system-ui/);
    expect(css).toMatch(/--font-sans:\s*system-ui/);
    expect(css).not.toContain('fonts.googleapis.com');
    const html = read('index.html');
    expect(html).not.toContain('fonts.googleapis.com');
  });
  it('configures a Lighthouse hard CLS failure at 0.1 and a local preview of all 4 routes', () => {
    const config = JSON.parse(read('.lighthouserc.json')).ci;
    expect(config.assert.assertions['cumulative-layout-shift'][0]).toBe('error');
    expect(config.assert.assertions['cumulative-layout-shift'][1].maxNumericValue).toBe(0.1);
    expect(config.collect.url).toHaveLength(4);
    expect(config.collect.startServerCommand).toContain('vite preview');
  });
});
describe('Phase 3.4 Appwrite project safety policy and observed table boundaries', () => {
  it('keeps existing private tracking_events locked and does not invent CMS collections', () => {
    expect(inspectAppwritePermissionSet('tracking_events', [])).toMatchObject({ safe: true });
    expect(inspectAppwritePermissionSet('tracking_events', ['create("any")']).safe).toBe(false);
    expect(inspectAppwritePermissionSet('tracking_events', ['read("any")']).safe).toBe(false);
    expect(appwriteCollectionPolicy.diagnostic_leads.status).toMatch(/NOT_PROVISIONED/);
    expect(appwriteCollectionPolicy.diagnostic_leads.permissions).toEqual(['create("any")']);
  });
  it('denies visitor read/update/delete of potential leads and enforces admin CMS writes', () => {
    expect(inspectAppwritePermissionSet('diagnostic_leads', ['create("any")']).safe).toBe(true);
    expect(inspectAppwritePermissionSet('diagnostic_leads', ['create("any")', 'read("any")']).safe).toBe(false);
    expect(inspectAppwritePermissionSet('diagnostic_leads', ['create("any")', 'write("any")']).safe).toBe(false);
    expect(inspectAppwritePermissionSet('case_studies', appwriteCollectionPolicy.case_studies.permissions).safe).toBe(true);
    expect(inspectAppwritePermissionSet('resources', appwriteCollectionPolicy.resources.permissions).safe).toBe(true);
    expect(inspectAppwritePermissionSet('resources', [...appwriteCollectionPolicy.resources.permissions, 'write("users")']).safe).toBe(false);
  });
});
