import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';

// Both themes share the V4 components, so a hard-coded white or black utility is invisible on one of them (white text on the
// near-white light surface was exactly the defect). Use the theme tokens (text-text, bg-panel, border-border-strong, ...).
// Overlay scrims such as bg-black/60 are theme independent on purpose and are allowed.
const ROOT = process.cwd();
const HARD_CODED = /(?:^|[\s"'`:])(?:hover:|focus:|group-hover:|active:)?(?:text|bg|border|ring|fill|stroke)-(?:white|black)(?!\/|[\w-])/g;

function walk(directory, files = []) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (/\.(tsx|jsx)$/.test(name) && !/\.test\.[jt]sx?$/.test(name)) files.push(path);
  }
  return files;
}

describe('theme-aware colour classes', () => {
  it('uses no hard-coded white or black utilities in the V4 components and routes', () => {
    const offenders = [];
    for (const path of walk(join(ROOT, 'src/v4'))) {
      const matches = readFileSync(path, 'utf8').match(HARD_CODED);
      if (matches) offenders.push(`${relative(ROOT, path)}: ${matches.map((match) => match.trim()).join(', ')}`);
    }
    expect(offenders).toEqual([]);
  });

  it('would catch the defect it guards against (the matcher itself)', () => {
    for (const bad of ['hover:text-white', 'text-white', 'bg-black', ' border-white', '"hover:bg-white"']) {
      expect(bad.match(HARD_CODED), bad).not.toBeNull();
    }
    for (const fine of ['bg-black/60', 'hover:border-border-strong', 'text-text', 'bg-white/5', 'text-whitespace', 'hover:text-white-ish']) {
      expect(fine.match(HARD_CODED), fine).toBeNull();
    }
  });
});
