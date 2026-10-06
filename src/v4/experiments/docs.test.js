import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { experimentList } from './registry.ts';

const doc = readFileSync(resolve(process.cwd(), 'docs/analytics/experiments.md'), 'utf8');

describe('experiments documentation', () => {
  it.each(experimentList.map((definition) => [definition.id, definition]))('documents %s, its variants and their copy', (_id, definition) => {
    expect(doc).toContain(`\`${definition.id}\``);
    for (const variant of definition.variants) {
      expect(doc, variant.id).toContain(`\`${variant.id}\``);
      if (variant.label) expect(doc, variant.label).toContain(variant.label);
    }
  });

  it('states that no result exists and that production is off by default', () => {
    expect(doc).toMatch(/no experiment has been run/i);
    expect(doc).toMatch(/off in production/i);
    expect(doc).not.toMatch(/is the winner|won the test|statistically significant win/i);
  });
});
