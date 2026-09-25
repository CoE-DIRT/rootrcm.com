import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { routeMeta, pricingModels, platformNodes, solutionPages } from './siteData.js';

const liveSources = [
  'src/v4/routes/HomePage.tsx',
  'src/v4/routes/PlatformPage.tsx',
  'src/v4/routes/TechnologyPages.tsx',
  'src/v4/routes/CompanyPages.tsx',
  'src/v4/components/sections/HeroSection.tsx',
  'src/experiments.js',
  'src/pages.jsx',
];

describe('canonical ROOT commercial narrative', () => {
  it('keeps one ROOT identity and one embedded DIRT role', () => {
    expect(routeMeta['/'].title).toMatch(/Healthcare Revenue Intelligence/);
    expect(routeMeta['/technology/dirt'].description).toMatch(/Data Intelligence for Revenue Transformation/);
    expect(platformNodes.find((node) => node.label === 'DIRT Intelligence')?.copy).toMatch(/DIRT — Data Intelligence for Revenue Transformation/);
    expect(pricingModels[0].name).toBe('Revenue Optimization Diagnostic');
    expect(pricingModels[0].price).toBe('$2,500 fixed fee');
    expect(solutionPages.find((page) => page.slug === 'revenue-leakage')?.summary).toMatch(/underpayments/);
  });

  it('does not reintroduce the superseded homepage, platform or experiment narrative', () => {
    for (const path of liveSources) {
      const source = readFileSync(path, 'utf8');
      expect(source, path).not.toMatch(/Run the business side of medicine better/i);
      expect(source, path).not.toMatch(/One operating layer for your practice/i);
      expect(source, path).not.toMatch(/home-hero-revenue-framing-v1/i);
    }
  });

  it('identifies financial relevance and clearly marks advanced predictive work as a roadmap', () => {
    const home = readFileSync('src/v4/routes/HomePage.tsx', 'utf8');
    const dirt = readFileSync('src/v4/routes/TechnologyPages.tsx', 'utf8');
    expect(home).toContain('Ambulatory Surgery Centers');
    expect(home).toContain('Cardiology & Electrophysiology');
    expect(dirt).toContain('From explainable rules to validated predictive models.');
    expect(dirt).toContain('development directions, not claims of live production AI');
    expect(dirt).toContain('All figures on this page are synthetic');
  });
});
