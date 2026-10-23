import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(path, 'utf8');
const nav = read('src/v4/components/MarketingHeader.tsx');
const sheet = read('src/v4/components/ui/Sheet.tsx');
const hero = read('src/v4/components/sections/HeroSection.tsx');
const home = read('src/v4/routes/HomePage.tsx');
const dashboard = read('src/v4/components/sections/HeroMockup.tsx');
const form = read('src/v4/routes/DiagnosticPage.tsx');
const footer = read('src/v4/components/MarketingFooter.tsx');
const css = read('src/v4/styles/tailwind.css');
const chrome = read('src/v4/styles/chrome.css');
const tokens = read('src/theme/theme.css');
const card = read('src/v4/components/ui/GlassCard.tsx');

function rgb(hex) { return [1,3,5].map(i=>Number.parseInt(hex.slice(i,i+2),16)); }
function lum(rgbValues) {
  const linear = rgbValues.map(x => { const v=x/255; return v<=.04045?v/12.92:((v+.055)/1.055)**2.4; });
  return linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
}
function contrast(a,b) {
  const [light,dark] = [lum(rgb(a)),lum(rgb(b))].sort((x,y)=>y-x);
  return (light+.05)/(dark+.05);
}
describe('Phase 1.3 component accessibility and design mandate', () => {
  it('uses a sticky, strong glass navigation and strong mobile portal', () => {
    expect(nav).toContain('v4-header sticky');
    expect(chrome).toContain('background: var(--glass-bg-strong)');
    expect(chrome).toContain('border-bottom: 1px solid var(--glass-border)');
    expect(sheet).toContain('v4-mobile-drawer glass-strong');
    expect(chrome).toContain('.v4-mobile-drawer { background: var(--glass-bg-strong)');
  });
  it('scrims a sourced full-bleed editorial hero image with decorative 55% glass and strong H1 panel', () => {
    expect(hero).toContain('src={mediaAssets.homePracticeOperations}');
    expect(hero).toContain('width={1600}');
    expect(hero).toContain('height={900}');
    expect(hero).toContain('alt=""');
    expect(hero).toContain('root-hero-glass');
    expect(hero).toContain('hero-reading-panel');
    expect(css).toContain('background: var(--hero-image-scrim)');
    expect(css).toContain('background: var(--glass-hero)');
    expect(css).toContain('background: var(--glass-bg-readable)');
    expect(tokens).toContain('--glass-hero: rgba(255, 255, 255, 0.55)');
    expect(tokens).toContain('--glass-hero: rgba(1, 26, 61, 0.55)');
  });
  it('keeps square aspect ratio editorial media for all featured cards, and reading surface strong', () => {
    expect(home).toContain('data-feature-grid');
    expect(home).toContain('data-feature-card');
    expect(home).toContain('aspect-square');
    expect(home).toContain('src={media.src}');
    expect(css).toContain('.v4-root .glass-feature-card');
    expect(css).toContain('background: var(--glass-bg)');
    expect(css).toContain('.v4-root .glass-feature-copy');
    expect(css).toContain('background: var(--glass-bg-readable)');
    expect(css).toContain('.v4-root .glass-feature-card:focus-visible');
  });
  it('uses strong dashboard surface and explicitly describes real synthetic metric dimensions', () => {
    expect(dashboard).toContain('root-dashboard-preview');
    expect(dashboard).toContain('data-dashboard-preview');
    expect(dashboard).toContain('aria-label="Illustrative revenue metrics: monthly charges, collections, total accounts receivable, and A/R over 90 days"');
    expect(css).toContain('.v4-root .root-dashboard-preview');
    expect(css).toContain('background: var(--glass-bg-strong)');
  });
  it('keeps diagnostic fields solid and border/placeholder/error/focus tokens accessible', () => {
    expect(form).toContain('id="diagnostic-form"');
    expect(form).toContain('variant="readable"');
    expect(css).toContain('background: var(--form-field-bg)');
    expect(css).toContain('border: 1px solid var(--form-field-border)');
    expect(css).toContain('color: var(--form-placeholder)');
    expect(css).toContain('color: var(--danger)');
    expect(css).toContain('box-shadow: var(--focus-ring)');
    expect(contrast('#64748B','#FFFFFF')).toBeGreaterThanOrEqual(3);
    expect(contrast('#A7B2C4','#121826')).toBeGreaterThanOrEqual(3);
    expect(contrast('#394F6D','#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#A7B2C4','#121826')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#C0242B','#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#F87171','#121826')).toBeGreaterThanOrEqual(4.5);
  });
  it('uses low glass footer and solid AA legal link colors', () => {
    expect(footer).toContain('v4-footer');
    expect(chrome).toContain('background: var(--glass-bg-subtle)');
    expect(chrome).toContain('color: var(--footer-link)');
    expect(contrast('#394F6D','#F4F7FB')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#E8ECF4','#060D1A')).toBeGreaterThanOrEqual(4.5);
  });
  it('honors motion and the 32px shadow-blur ceiling without animated gradients/neon', () => {
    expect(card).toContain('duration-200 ease-out');
    expect(css).toContain('transition: background-color 200ms ease-out');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).not.toContain('--shadow-command: 0 16px 40px');
    expect(tokens).not.toContain('--shadow-glass-3: 0 16px 48px');
    expect(tokens).not.toContain('--accent-glow: 0 0 16px');
  });
});
