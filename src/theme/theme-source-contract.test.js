import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const componentRoots = ['src/components', 'src/v4/components'];
function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (/\.(tsx|jsx)$/.test(name) && !/\.test\.[jt]sx?$/.test(name)) files.push(path);
  }
  return files;
}

describe('CPO 1.2 shared token discipline', () => {
  it('keeps raw hex and rgba definitions out of all production React components', () => {
    const offenders = [];
    const hex = /#[0-9a-fA-F]{3,8}\b/;
    const rawColor = /rgba?\s*\(/;
    for (const dir of componentRoots) {
      for (const path of walk(join(root, dir))) {
        const rows = readFileSync(path, 'utf8').split('\n');
        rows.forEach((line, index) => {
          if (hex.test(line) || rawColor.test(line)) {
            offenders.push(`${relative(root, path)}:${index + 1} ${line.trim().slice(0, 150)}`);
          }
        });
      }
    }
    expect(offenders).toEqual([]);
  });

  it('uses CSS variables for theme-independent three-tier glass and focus behavior', () => {
    const css = readFileSync('src/v4/styles/tailwind.css', 'utf8');
    const tokens = readFileSync('src/theme/theme.css', 'utf8');
    for (const cls of ['.glass {', '.glass-strong {', '.glass-subtle {']) expect(css).toContain(cls);
    for (const token of ['--glass-bg:', '--glass-bg-strong:', '--glass-bg-subtle:', '--focus-ring:', '--glass-fallback-default:', '--glass-fallback-strong:']) expect(tokens).toContain(token);
    expect(css).toContain('prefers-reduced-transparency: reduce');
    expect(css).toContain('prefers-reduced-motion: reduce');
    expect(css).toContain('@media (forced-colors: active)');
    expect(css).toContain('box-shadow: var(--focus-ring)');
  });

  it('defaults light without an html attribute and opts into dark only by data-theme', () => {
    const css = readFileSync('src/theme/theme.css', 'utf8');
    const config = readFileSync('src/theme/themeConfig.js', 'utf8');
    const useTheme = readFileSync('src/theme/useTheme.ts', 'utf8');
    expect(css).toContain(":root:not([data-theme]),");
    expect(css).toContain(":root[data-theme='dark'] {");
    expect(config).toContain("t='light'");
    expect(useTheme).not.toContain('followSystemTheme');
  });
});
