import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const theme = readFileSync('src/theme/theme.css', 'utf8');
const styles = readFileSync('src/v4/styles/tailwind.css', 'utf8');
const chrome = readFileSync('src/v4/styles/chrome.css', 'utf8');
const nestedGrid = readFileSync('src/v4/components/dirt/NestedDataGridContainer.tsx', 'utf8');

const light = {
  panel: [255, 255, 255], alpha: 0.78, readableAlpha: 0.92,
  backgrounds: ['#F4F7FB', '#e7eef9', '#ffffff'],
  saturated: '#0066FF',
  ink: ['#0f172a', '#475569', '#2563eb'],
};
const dark = {
  panel: [18, 24, 38], alpha: 0.78, readableAlpha: 0.92,
  backgrounds: ['#060D1A', '#011A3D', '#0b1930'],
  saturated: '#00F0FF',
  ink: ['#e8ecf4', '#9aa3b8', '#7aa7ff'],
};

function hexRgb(hex) {
  return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}
function composited(panel, alpha, background) {
  return panel.map((channel, index) => channel * alpha + background[index] * (1 - alpha));
}
function luminance(rgb) {
  const linear = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
function blockAfter(marker) {
  const start = theme.indexOf(marker);
  expect(start).toBeGreaterThanOrEqual(0);
  return theme.slice(start, theme.indexOf('}', start) + 1);
}

describe('Phase 1.1 dual-theme accessible glass design system', () => {
  it('defines every required light and dark token at the theme root', () => {
    const l = blockAfter(':root {');
    const d = blockAfter(":root[data-theme='dark'],");
    const values = [
      ['--glass-bg:', 'rgba(255, 255, 255, 0.55)', 'rgba(18, 24, 38, 0.55)'],
      ['--glass-bg-strong:', 'rgba(255, 255, 255, 0.78)', 'rgba(18, 24, 38, 0.78)'],
      ['--glass-border:', 'rgba(15, 23, 42, 0.12)', 'rgba(255, 255, 255, 0.18)'],
      ['--glass-blur:', '16px', '18px'],
      ['--glass-shadow:', '0 8px 32px rgba(15, 23, 42, 0.08)', '0 8px 32px rgba(0, 0, 0, 0.35)'],
      ['--text-primary:', '#0f172a', '#e8ecf4'],
      ['--text-muted:', '#475569', '#9aa3b8'],
      ['--accent:', '#2563eb', '#7aa7ff'],
    ];
    for (const [name, lv, dv] of values) {
      expect(l).toContain(`${name} ${lv};`);
      expect(d).toContain(`${name} ${dv};`);
    }
  });

  it.each([['light', light], ['dark', dark]])('%s theme passes 4.5:1 on representative site backgrounds at 78% opacity', (_name, tokens) => {
    for (const background of tokens.backgrounds) {
      const panel = composited(tokens.panel, tokens.alpha, hexRgb(background));
      for (const foreground of tokens.ink) {
        expect(contrast(hexRgb(foreground), panel)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it.each([['light', light], ['dark', dark]])('%s readable tier passes 4.5:1 even on sampled saturated brand backgrounds', (_name, tokens) => {
    const panel = composited(tokens.panel, tokens.readableAlpha, hexRgb(tokens.saturated));
    for (const foreground of tokens.ink) {
      expect(contrast(hexRgb(foreground), panel)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('uses the strong/readable tier for text-bearing cards, shells, and headers', () => {
    const card = styles.slice(styles.indexOf('.v4-root .glass-surface {'), styles.indexOf('.v4-root .glass-surface--readable {'));
    const shell = styles.slice(styles.indexOf('.v4-root .section-shell {'), styles.indexOf('@supports not (backdrop-filter:', styles.indexOf('.v4-root .section-shell {')));
    expect(card).toContain('background: var(--glass-bg-strong)');
    expect(shell).toContain('background: var(--glass-bg-strong)');
    expect(styles).toContain('.v4-root .glass-surface--readable { background: var(--glass-bg-readable); }');
    expect(chrome).toContain('background: var(--glass-bg-readable)');
    expect(styles).toContain('background: var(--glass-fallback)');
    expect(blockAfter(':root {')).toContain('--glass-fallback: #f7f9fd;');
    expect(blockAfter(":root[data-theme='dark'],")).toContain('--glass-fallback: #121826;');
    expect(nestedGrid).not.toContain('text-muted/70');
    expect(styles).toContain('blur(var(--glass-blur))');
  });
});
