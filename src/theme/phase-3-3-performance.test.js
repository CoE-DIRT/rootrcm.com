import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const source = (p) => readFileSync(p, 'utf8');

describe('Phase 3.3 performance/CLS architecture contract', () => {
  it('uses reserved image geometry across hero, features, and media frames', () => {
    const placeholder = source('src/v4/components/ui/GlassPlaceholder.tsx');
    const media = source('src/v4/components/ui/MediaFrame.tsx');
    const hero = source('src/v4/components/sections/HeroSection.tsx');
    const home = source('src/v4/routes/HomePage.tsx');
    expect(placeholder).toContain('style={{ aspectRatio: reservedAspect[aspect] }}');
    expect(placeholder).toContain("square: '1 / 1'");
    expect(media).toContain('reservedIntrinsic[aspect].width');
    expect(media).toContain("loading={priority ? 'eager' : 'lazy'}");
    expect(hero).toContain('fetchPriority="high"');
    expect(hero).toContain('loading="eager"');
    expect(hero).toContain('root-home-hero-photo relative');
    expect(home).toContain('<GlassPlaceholder aspect="video"');
    expect(home).toContain('loading="lazy"');
  });
  it('keeps heavy components in separately loaded chunks and reserves a skeleton', () => {
    const price = source('src/v4/routes/PricingPage.tsx');
    const dirt = source('src/v4/routes/TechnologyPages.tsx');
    const content = source('src/v4/routes/ContentPages.tsx');
    const carousel = source('src/components/CaseStudyCarousel.jsx');
    expect(price).toContain("lazy(() => import('./PricingGlance'))");
    expect(price).toContain('<GlassSkeleton minHeight="30rem"');
    expect(dirt).toContain("lazy(() => import('@/components/dirt/DirtCommandCenter')");
    expect(dirt).toContain('<GlassSkeleton minHeight="100rem"');
    expect(content).toContain('<GlassSkeleton minHeight="32rem"');
    expect(carousel.match(/width=\{1600\} height=\{900\}/g)).toHaveLength(2);
    expect(carousel).toContain("aspectRatio: '16 / 9'");
  });
  it('avoids font network layout changes and enforces Lighthouse CLS in GitHub CI', () => {
    const theme = source('src/v4/styles/tailwind.css');
    const lighthouse = source('lighthouserc.cjs');
    const workflow = source('.github/workflows/ci.yml');
    expect(theme).toContain('--font-display: system-ui');
    expect(theme).toContain('--font-sans: system-ui');
    expect(lighthouse).toContain("'cumulative-layout-shift'");
    expect(lighthouse).toContain('maxNumericValue: 0.1');
    expect(lighthouse).toContain('maxNumericValue: 1500');
    expect(workflow).toContain('lighthouse-cls:');
    expect(workflow).toContain('@lhci/cli@0.15.1 autorun');
    expect(workflow).toContain('if: always()');
  });
});
