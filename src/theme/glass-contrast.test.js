import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/theme/theme.css', 'utf8');
const glass = readFileSync('src/v4/styles/tailwind.css', 'utf8');
const chrome = readFileSync('src/v4/styles/chrome.css', 'utf8');
const button = readFileSync('src/v4/components/ui/Button.tsx', 'utf8');
const card = readFileSync('src/v4/components/ui/GlassCard.tsx', 'utf8');
const hero = readFileSync('src/v4/components/sections/HeroSection.tsx', 'utf8');
const grid = readFileSync('src/v4/components/dirt/NestedDataGridContainer.tsx', 'utf8');

function extractBlock(marker) {
  const start = css.indexOf(marker);
  expect(start, marker).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start) + 1);
}
const lightTokens = extractBlock(':root {');
const darkTokens = extractBlock(":root[data-theme='dark'] {");
function expectToken(block, name, value) {
  expect(block, name).toContain(`${name}: ${value};`);
}
function rgb(hex) {
  return [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));
}
function mix(front, back, alpha) {
  return front.map((component, i) => component * alpha + back[i] * (1 - alpha));
}
function luminance(color) {
  const linear = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(fg, bg) {
  const [lighter, darker] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Phase 1.1a/b canonical dual-mode palette', () => {
  it('implements approved light and dark tokens without changing the Vite architecture', () => {
    const rows = [
      ['--app-bg', '#F4F7FB', '#060D1A'],
      ['--app-bg-deep', '#EDF2F9', '#03070F'],
      ['--glass-bg', 'rgba(255, 255, 255, 0.60)', 'rgba(1, 26, 61, 0.40)'],
      ['--glass-bg-strong', 'rgba(255, 255, 255, 0.80)', 'rgba(1, 26, 61, 0.68)'],
      ['--glass-bg-subtle', 'rgba(255, 255, 255, 0.38)', 'rgba(1, 26, 61, 0.24)'],
      ['--glass-border', 'rgba(1, 26, 61, 0.10)', 'rgba(0, 240, 255, 0.20)'],
      ['--glass-highlight', 'rgba(255, 255, 255, 0.90)', 'rgba(255, 255, 255, 0.10)'],
      ['--shadow-glass-2', '0 8px 32px rgba(1, 26, 61, 0.10)', '0 8px 32px rgba(0, 0, 0, 0.45)'],
      ['--text-primary', '#011A3D', '#FFFFFF'],
      ['--text-secondary', 'rgba(1, 26, 61, 0.72)', 'rgba(255, 255, 255, 0.60)'],
      ['--text-secondary-solid', '#394F6D', '#A7B2C4'],
      ['--accent', '#0066FF', '#00F0FF'],
      ['--accent-hover', '#0052CC', '#4DF5FF'],
      ['--accent-pressed', '#0047B3', '#00C4D1'],
      ['--accent-fg', '#FFFFFF', '#011A3D'],
      ['--success', '#0E7C5A', '#34D399'],
      ['--warning', '#9A5B00', '#FBBF24'],
      ['--danger', '#C0242B', '#F87171'],
      ['--noise-opacity', '0.035', '0.05'],
    ];
    for (const [key, light, dark] of rows) {
      expectToken(lightTokens, key, light);
      expectToken(darkTokens, key, dark);
    }
    for (const [key, val] of [['--glass-blur-sm', '8px'], ['--glass-blur', '12px'], ['--glass-blur-lg', '18px'], ['--glass-blur-max', '20px'], ['--mesh-behind-text-max', '0.12']]) {
      expectToken(lightTokens, key, val);
    }
  });

  it('keeps dark CTA ink navy on neon cyan; all button states pass 4.5:1', () => {
    for (const background of ['#00F0FF', '#4DF5FF', '#00C4D1']) {
      expect(contrast(rgb('#011A3D'), rgb(background))).toBeGreaterThanOrEqual(4.5);
    }
    for (const background of ['#0066FF', '#0052CC', '#0047B3']) {
      expect(contrast(rgb('#FFFFFF'), rgb(background))).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(rgb('#FFFFFF'), rgb('#00F0FF'))).toBeLessThan(1.5);
    expect(button).toContain('root-primary-cta');
    expect(glass).toContain('color: var(--accent-fg)');
    expect(glass).toContain('background-color: var(--accent-hover)');
  });

  it.each([
    ['light', [255, 255, 255], 0.80, '#F4F7FB', '#0066FF', '#011A3D', '#394F6D'],
    ['dark', [1, 26, 61], 0.68, '#060D1A', '#00F0FF', '#FFFFFF', '#A7B2C4'],
  ])('%s strong glass maintains normal-text AA with capped mesh', (_name, panel, alpha, base, orb, primary, muted) => {
    const backdrop = mix(rgb(orb), rgb(base), 0.12);
    const glassBackground = mix(panel, backdrop, alpha);
    for (const foreground of [primary, muted]) {
      expect(contrast(rgb(foreground), glassBackground)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('uses dual edges, both blur engines, fallbacks and reduced transparency', () => {
    expectToken(lightTokens, '--glass-inner-ring', 'inset 0 0 0 1px var(--glass-border)');
    expectToken(lightTokens, '--glass-inner-light', 'inset 0 1px 0 0 var(--glass-highlight)');
    expect(glass).toContain('var(--glass-inner-ring), var(--glass-inner-light)');
    expect(glass).toContain('-webkit-backdrop-filter:');
    expect(glass).toContain('backdrop-filter:');
    expect(glass).toContain('prefers-reduced-transparency: reduce');
    expect(chrome).toContain('prefers-reduced-transparency: reduce');
    expect(glass).toContain('background: var(--glass-fallback)');
    expect(chrome).toContain('background: var(--glass-fallback)');
    expect(glass).toContain('background: var(--glass-solid)');
    expectToken(lightTokens, '--glass-fallback', 'rgba(247, 249, 253, 0.96)');
    expectToken(darkTokens, '--glass-fallback', 'rgba(18, 24, 38, 0.96)');
  });

  it('caps mesh and adds low-opacity SVG noise; avoids animated glass wrappers', () => {
    expect(glass).toContain('opacity: var(--mesh-behind-text-max)');
    expect(glass).toContain('opacity: var(--noise-opacity)');
    expect(glass).toContain('feTurbulence');
    expect(hero).toContain('className="root-mesh');
    expect(hero).not.toContain('className="homeHero relative" data-reveal');
    expect(card).not.toContain('transform-gpu');
    expect(grid).not.toContain('text-muted/70');
    expect(glass).toContain('[data-reveal]:has(.glass-surface)');
  });

  it('uses 18px initial / 10px scrolled header blur and respects focus', () => {
    expect(chrome).toContain('blur(var(--glass-blur-lg))');
    expect(chrome).toContain('blur(10px)');
    expect(chrome).toContain('var(--glass-bg-readable)');
    expect(glass).toContain('box-shadow: var(--focus-ring)');
  });
});
