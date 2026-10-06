import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { APPROVED_CTAS, IGNORED_CTAS } from './approvedCtas.ts';
import { storageInventory } from '../consent/storageInventory.ts';

// Governance checks that keep analytics, consent and configuration honest as the code changes.
// They read the source tree, so a new call to action, storage key or environment variable cannot slip in unclassified.

const ROOT = process.cwd();

function walk(directory, files = []) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      if (name === 'node_modules') continue;
      walk(path, files);
    } else if (/\.(jsx?|tsx?)$/.test(name) && !/\.test\.[jt]sx?$/.test(name)) {
      files.push(path);
    }
  }
  return files;
}

const sourceFiles = walk(join(ROOT, 'src')).map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, 'utf8') }));
const KEBAB = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

describe('call-to-action governance', () => {
  // data-cta="x", cta="x" (TrackedLink) and cta: 'x' (channel and CTA data). Capitalised or spaced values are button labels, not ids.
  const found = new Map();
  const note = (id, path) => {
    if (!KEBAB.test(id)) return;
    if (!found.has(id)) found.set(id, new Set());
    found.get(id).add(path);
  };
  for (const { path, text } of sourceFiles) {
    for (const match of text.matchAll(/(?:data-cta=|\bcta=)["']([^"']+)["']|\bcta:\s*["']([^"']+)["']/g)) note(match[1] ?? match[2], path);
    // data-cta={cond ? 'a' : 'b'}: every quoted id inside the braces counts, except values being compared (=== 'x').
    for (const expression of text.matchAll(/data-cta=\{([^}]*)\}/g)) {
      for (const literal of expression[1].matchAll(/(["'])([^"']*)\1/g)) {
        if (!/={2,3}\s*$/.test(expression[1].slice(0, literal.index))) note(literal[2], path);
      }
    }
  }

  it('classifies every call-to-action id in the source as tracked or deliberately ignored', () => {
    const unclassified = [...found.keys()].filter((id) => !APPROVED_CTAS.has(id) && !IGNORED_CTAS.has(id));
    expect(unclassified, `Add to APPROVED_CTAS (tracked) or IGNORED_CTAS (not tracked) in src/v4/analytics/approvedCtas.ts: ${unclassified.map((id) => `${id} (${[...found.get(id)].join(', ')})`).join('; ')}`).toEqual([]);
  });

  it('keeps no stale entries: every approved or ignored id is still used', () => {
    const stale = [...APPROVED_CTAS, ...IGNORED_CTAS].filter((id) => !found.has(id));
    expect(stale).toEqual([]);
  });

  it('never both tracks and ignores an id', () => {
    expect([...APPROVED_CTAS].filter((id) => IGNORED_CTAS.has(id))).toEqual([]);
  });
});

describe('browser storage governance', () => {
  const disclosed = (key) => storageInventory.some((row) => row.key.split(/[\s/,]+/).includes(key));

  // Klaro service ids look like storage keys but are not stored under that name.
  const SERVICE_IDS = new Set(['root-session', 'root-analytics', 'root-first-party-analytics']);

  it('discloses every root-* / root_* key written by the source on the cookie policy', () => {
    const keys = new Map();
    for (const { path, text } of sourceFiles) {
      if (path.endsWith('storageInventory.ts')) continue;
      for (const match of text.matchAll(/["'`](root[-_][a-z0-9_-]+)["'`]/g)) {
        const key = match[1];
        if (SERVICE_IDS.has(key)) continue;
        if (!keys.has(key)) keys.set(key, new Set());
        keys.get(key).add(path);
      }
    }
    const undisclosed = [...keys.keys()].filter((key) => !disclosed(key));
    expect(undisclosed, `Add to src/v4/consent/storageInventory.ts (and docs/v4/COOKIE-MANIFEST.md): ${undisclosed.map((key) => `${key} (${[...keys.get(key)].join(', ')})`).join('; ')}`).toEqual([]);
  });

  it('only calls localStorage and sessionStorage with keys that can be traced to a disclosed literal', () => {
    // Module-level constants such as `const ANON_KEY = 'root-aid'` anywhere in the source.
    const constants = new Map();
    for (const { text } of sourceFiles) {
      for (const match of text.matchAll(/\b(?:const|export const)\s+([A-Z][A-Z0-9_]*)\s*=\s*["'`]([^"'`]+)["'`]/g)) constants.set(match[1], match[2]);
    }
    const untraceable = [];
    for (const { path, text } of sourceFiles) {
      for (const match of text.matchAll(/\b(?:local|session)Storage\s*\.\s*(?:getItem|setItem|removeItem)\(\s*(\$\{JSON\.stringify\([A-Z0-9_]+\)\}|[^,)]+)/g)) {
        const argument = match[1].trim();
        // `${JSON.stringify(NAME)}` appears in the inline theme bootstrap script.
        const named = argument.match(/^\$\{JSON\.stringify\(([A-Z0-9_]+)\)\}$/)?.[1];
        const literal = argument.match(/^["'`]([^"'`]+)["'`]$/)?.[1] ?? constants.get(named ?? argument);
        if (!literal) untraceable.push(`${path}: ${argument}`);
        else if (!disclosed(literal)) untraceable.push(`${path}: ${literal} (not disclosed)`);
      }
    }
    // The experiment and tracker modules pass keys through helpers; those keys are covered by the literal scan above.
    expect(untraceable.filter((entry) => !/experiments\/engine\.ts|analytics\/ids\.ts|analytics\/tracker\.ts/.test(entry))).toEqual([]);
  });

  it('keeps the legacy experiment keys out of the source', () => {
    const joined = sourceFiles.map((file) => file.text).join('\n');
    expect(joined).not.toContain('root-conversion-experiments-v1');
    expect(joined).not.toContain('root-v4-experiments-v1');
  });
});

describe('public configuration governance', () => {
  const example = readFileSync(join(ROOT, '.env.example'), 'utf8');
  const guard = readFileSync(join(ROOT, 'src/build/envGuard.js'), 'utf8');

  it('documents in .env.example every VITE_ variable the source reads', () => {
    const used = new Map();
    for (const { path, text } of [...sourceFiles, { path: 'vite.config.js', text: readFileSync(join(ROOT, 'vite.config.js'), 'utf8') }]) {
      for (const match of text.matchAll(/\bVITE_[A-Z0-9_]+\b/g)) {
        if (!used.has(match[0])) used.set(match[0], new Set());
        used.get(match[0]).add(path);
      }
    }
    const missing = [...used.keys()].filter((name) => !new RegExp(`^#?\\s*${name}=?`, 'm').test(example));
    expect(missing, `Document in .env.example: ${missing.map((name) => `${name} (${[...used.get(name)].join(', ')})`).join('; ')}`).toEqual([]);
  });

  it('refuses secret-shaped browser variables and non-test Stripe keys at build time', () => {
    expect(guard).toMatch(/SECRET\|API_KEY/);
    expect(guard).toMatch(/pk_test_/);
  });

  it('never lists a server-side secret as an assignable VITE_ variable', () => {
    expect(example).not.toMatch(/^VITE_[A-Z_]*(?:SECRET|PRIVATE|PASSWORD|API_KEY|WEBHOOK)[A-Z_]*=/m);
    expect(example).not.toMatch(/^(?:STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|APPWRITE_API_KEY)=/m);
  });
});
