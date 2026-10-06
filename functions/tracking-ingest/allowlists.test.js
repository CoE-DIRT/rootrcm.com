import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { OUTPUT, renderAllowlists } from '../../scripts/appwrite/sync-analytics-allowlists.js';
import * as allowlists from './allowlists.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const sync = (cwd, args = ['--check']) => spawnSync(process.execPath, [resolve(ROOT, 'scripts/appwrite/sync-analytics-allowlists.js'), ...args], { cwd, encoding: 'utf8' });

describe('generated allowlists for the tracking-ingest Function', () => {
  it('are up to date with the route registry and the campaign registry', () => {
    expect(readFileSync(OUTPUT, 'utf8'), 'stale: run node scripts/appwrite/sync-analytics-allowlists.js').toBe(renderAllowlists());
  });

  it('contain only plain data, so the deployed Function needs nothing from src/', () => {
    const text = readFileSync(OUTPUT, 'utf8');
    expect(text).not.toMatch(/\bimport\b|\brequire\(/);
    expect(allowlists.KNOWN_PATHS).toContain('/');
    expect(allowlists.KNOWN_PATHS).toContain('/404/');
    expect(allowlists.KNOWN_PATHS).not.toContain('/404.html');
    expect(allowlists.KNOWN_PATHS.some((path) => path.includes('__v4-lab') || path.includes('dirt-poc-01'))).toBe(false);
  });

  it('can be checked from any directory with a relative or an absolute script path', () => {
    const relative = spawnSync(process.execPath, ['scripts/appwrite/sync-analytics-allowlists.js', '--check'], { cwd: ROOT, encoding: 'utf8' });
    expect({ status: relative.status, out: relative.stdout }).toEqual({ status: 0, out: 'allowlists.js is up to date\n' });
    const elsewhere = sync(resolve(ROOT, 'functions'));
    expect({ status: elsewhere.status, out: elsewhere.stdout }).toEqual({ status: 0, out: 'allowlists.js is up to date\n' });
  });
});
