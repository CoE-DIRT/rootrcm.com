import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = Object.fromEntries([
  'tokens', 'src/theme/theme.css',
  'glass', 'src/v4/styles/tailwind.css',
  'chrome', 'src/v4/styles/chrome.css',
  'hero', 'src/v4/components/sections/HeroSection.tsx',
  'home', 'src/v4/routes/HomePage.tsx',
  'pricing', 'src/v4/routes/PricingPage.tsx',
  'form', 'src/v4/routes/DiagnosticPage.tsx',
  'footer', 'src/v4/components/MarketingFooter.tsx',
  'drawer', 'src/v4/components/ui/Sheet.tsx',
].map(([id, path]) => [id, readFileSync(path, 'utf8')]));
const rgb = (hex) => [1,3,5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
const lum = (value) => value.map((c) => c / 255).map((c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((n, c, i) => n + c * [.2126,.7152,.0722][i], 0);
const ratio = (a,b) => { const l = [lum(a),lum(b)].sort((x,y) => y-x); return (l[0]+.05)/(l[1]+.05); };
const mix = (a,b,alpha) => a.map((c,i) => c * alpha + b[i] * (1-alpha));

describe('CPO Phase 1.3 contrast matrix and tier contract', () => {
  it('retains both AA CTA color pairs and rejects white on neon cyan', () => {
    expect(ratio(rgb('#FFFFFF'), rgb('#0066FF'))).toBeGreaterThanOrEqual(4.5);
    expect(ratio(rgb('#011A3D'), rgb('#00F0FF'))).toBeGreaterThanOrEqual(4.5);
    expect(ratio(rgb('#FFFFFF'), rgb('#00F0FF'))).toBeLessThan(4.5);
    expect(source.tokens).toContain('--accent-fg: #011A3D;');
    expect(source.glass).toContain('box-shadow: var(--accent-glow), var(--focus-ring)');
  });

  it('keeps legible secondary text over both glass tiers and mesh', () => {
    const bg = rgb('#F4F7FB'), ink = rgb('#011A3D');
    expect(ratio(mix(ink,bg,.72),bg)).toBeGreaterThan(4.5);
    const lightMesh = mix(rgb('#0066FF'),bg,.12);
    const lightGlass = mix(rgb('#FFFFFF'),lightMesh,.60);
    expect(ratio(mix(ink,lightGlass,.72),lightGlass)).toBeGreaterThan(4.5);
    const darkMesh = mix(rgb('#00F0FF'),rgb('#060D1A'),.10);
    const darkGlass = mix(rgb('#011A3D'),darkMesh,.68);
    const darkSecondary = mix(rgb('#FFFFFF'),darkGlass,.60);
    expect(ratio(darkSecondary,darkGlass)).toBeGreaterThan(4.5);
    expect(source.tokens).not.toContain('--text-secondary: rgba(1, 26, 61, 0.60);');
  });

  it('enforces >=3:1 solid input border contrast and readable placeholder text', () => {
    const darkInput = mix(rgb('#011A3D'), rgb('#060D1A'), .85);
    expect(ratio(rgb('#7B8DA5'),rgb('#FFFFFF'))).toBeGreaterThanOrEqual(3);
    expect(ratio(rgb('#8398B6'),darkInput)).toBeGreaterThanOrEqual(3);
    expect(ratio(rgb('#394F6D'),rgb('#FFFFFF'))).toBeGreaterThanOrEqual(4.5);
    expect(ratio(rgb('#A7B2C4'),darkInput)).toBeGreaterThanOrEqual(4.5);
    expect(source.chrome).toContain('font-size: 16px;');
    expect(source.tokens).toContain('--form-input-bg: #FFFFFF;');
    expect(source.tokens).toContain('--form-input-bg: rgba(1, 26, 61, 0.85);');
  });

  it('centralizes component opacity into glass tiers and caps transition times and blur', () => {
    expect(source.chrome).toContain('.v4-header.glass-strong');
    expect(source.chrome).toContain('blur(10px)');
    expect(source.drawer).toContain('glass-strong root-mobile-drawer');
    expect(source.hero).toContain('root-hero-content glass');
    expect(source.hero).toContain('root-hero-heading glass-strong');
    expect(source.home).toContain('className="root-feature-card glass');
    expect(source.pricing).toContain('variant="glass"');
    expect(source.form).toContain('variant="readable"');
    expect(source.footer).toContain('v4-footer glass-subtle');
    expect(source.glass).not.toContain('animation: media-reveal');
    expect(source.chrome).toContain('180ms ease-out');
    expect(source.glass).toContain('transition-duration: 180ms');
    expect(source.glass).toContain('box-shadow: none;');
  });
});
