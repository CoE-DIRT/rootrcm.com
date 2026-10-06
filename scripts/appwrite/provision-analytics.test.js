import { spawnSync } from 'node:child_process';
import { mkdtempSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { COLUMNS, DATABASE_ID, INDEXES, PLAN, TABLE_ID, describeColumnMismatches, describeIndexMismatches, isEntryPoint, provision, verifyPrivate } from './provision-analytics.js';

const notFound = () => Object.assign(new Error('not found'), { code: 404, type: 'table_not_found' });

/** The two SDK query builders the script uses, as plain descriptors the fake below understands. */
const fakeQuery = { limit: (value) => ({ method: 'limit', values: [value] }), offset: (value) => ({ method: 'offset', values: [value] }) };

/** Appwrite lists 25 items unless a limit query asks for more, and honours an offset. The fake behaves the same way. */
const APPWRITE_DEFAULT_PAGE = 25;
const page = (items, queries = []) => {
  const limit = queries.find((query) => query.method === 'limit')?.values[0] ?? APPWRITE_DEFAULT_PAGE;
  const offset = queries.find((query) => query.method === 'offset')?.values[0] ?? 0;
  return items.slice(offset, offset + limit);
};

const apply = (tables, options = {}) => provision({ tables, Query: fakeQuery, pollMs: 0, ...options });

/** An in-memory stand-in for the Appwrite TablesDB service. It has no update or delete methods on purpose. */
function fakeTables({ table = null, columns = [] } = {}) {
  const state = {
    database: Boolean(table),
    table,
    columns: new Map(columns.map((column) => [column.key, { status: 'available', ...column }])),
    indexes: new Map(),
    calls: [],
  };
  const record = (name) => state.calls.push(name);
  const addColumn = (column) => {
    record('createColumn');
    state.columns.set(column.key, { ...column, status: 'available' });
  };
  return {
    state,
    get: vi.fn(async () => {
      if (!state.database) throw notFound();
      return {};
    }),
    create: vi.fn(async () => {
      record('create');
      state.database = true;
      return {};
    }),
    getTable: vi.fn(async () => {
      if (!state.table) throw notFound();
      return state.table;
    }),
    createTable: vi.fn(async (params) => {
      record('createTable');
      state.table = { $permissions: params.permissions, rowSecurity: params.rowSecurity };
      return state.table;
    }),
    listColumns: vi.fn(async ({ queries } = {}) => ({ total: state.columns.size, columns: page([...state.columns.values()], queries) })),
    // Appwrite reports every constraint it was created with, so the fake does too.
    createVarcharColumn: vi.fn(async (p) => addColumn({ key: p.key, type: 'varchar', size: p.size, required: p.required, array: false })),
    createDatetimeColumn: vi.fn(async (p) => addColumn({ key: p.key, type: 'datetime', required: p.required, array: false })),
    createIntegerColumn: vi.fn(async (p) => addColumn({ key: p.key, type: 'integer', required: p.required, min: p.min, max: p.max, array: false })),
    createFloatColumn: vi.fn(async (p) => addColumn({ key: p.key, type: 'float', required: p.required, min: p.min, max: p.max, array: false })),
    listIndexes: vi.fn(async ({ queries } = {}) => ({ total: state.indexes.size, indexes: page([...state.indexes.values()], queries) })),
    createIndex: vi.fn(async (p) => {
      record('createIndex');
      state.indexes.set(p.key, { key: p.key, ...p });
    }),
  };
}

describe('analytics table provisioning', () => {
  it('creates a PRIVATE table: no permissions and row security off', async () => {
    const tables = fakeTables();
    const report = await apply(tables);
    expect(tables.createTable).toHaveBeenCalledTimes(1);
    expect(tables.createTable).toHaveBeenCalledWith(expect.objectContaining({ databaseId: DATABASE_ID, tableId: TABLE_ID, permissions: [], rowSecurity: false, enabled: true }));
    expect(PLAN.table.permissions).toEqual([]);
    expect(PLAN.table.rowSecurity).toBe(false);
    expect(report.created).toContain(`database:${DATABASE_ID}`);
    expect(report.created).toContain(`table:${TABLE_ID}`);
    expect(report.created.filter((entry) => entry.startsWith('column:'))).toHaveLength(COLUMNS.length);
    expect(report.created.filter((entry) => entry.startsWith('index:'))).toHaveLength(INDEXES.length);
  });

  it('is idempotent: a second run creates nothing', async () => {
    const tables = fakeTables();
    await apply(tables);
    tables.state.calls.length = 0;
    const second = await apply(tables);
    expect(second.created).toEqual([]);
    expect(tables.state.calls).toEqual([]);
  });

  describe('lists past the 25 items Appwrite returns by default', () => {
    it('has more columns than one default page, which is why the script has to ask for more', () => {
      expect(COLUMNS.length).toBeGreaterThan(APPWRITE_DEFAULT_PAGE);
    });

    it('waits for all of the columns, then creates every index (an unqualified list call could never see the last columns)', async () => {
      const tables = fakeTables();
      const report = await apply(tables, { pollAttempts: 5 });
      expect(tables.state.columns.size).toBe(COLUMNS.length);
      expect(report.created.filter((entry) => entry.startsWith('index:'))).toHaveLength(INDEXES.length);
      // Every list call asked for an explicit page; none relied on the server default.
      for (const [params] of tables.listColumns.mock.calls) expect(params.queries.map((query) => query.method)).toEqual(['limit', 'offset']);
      for (const [params] of tables.listIndexes.mock.calls) expect(params.queries.map((query) => query.method)).toEqual(['limit', 'offset']);
    });

    it('compares the columns beyond the first page too, instead of treating them as missing', async () => {
      const planColumns = COLUMNS.map((column) => ({ ...column, array: false, status: 'available' }));
      const last = planColumns[planColumns.length - 1];
      const broken = planColumns.map((column) => (column.key === last.key ? { ...column, required: !column.required } : column));
      const tables = fakeTables({ table: { $permissions: [], rowSecurity: false }, columns: broken });
      await expect(apply(tables)).rejects.toThrow(new RegExp(`${last.key} required`));
      expect(tables.state.calls).not.toContain('createColumn');
    });

    it('is idempotent against a table that already holds every column, without trying to create the last ones again', async () => {
      const tables = fakeTables();
      await apply(tables);
      tables.state.calls.length = 0;
      tables.createVarcharColumn.mockClear();
      const second = await apply(tables);
      expect(second.created).toEqual([]);
      expect(tables.state.calls).toEqual([]);
      expect(tables.createVarcharColumn).not.toHaveBeenCalled();
    });

    it('reads every page of a long list, and stops if the server ignores the offset instead of looping forever', async () => {
      const tables = fakeTables();
      tables.listIndexes.mockImplementation(async ({ queries }) => {
        const limit = queries.find((query) => query.method === 'limit').values[0];
        return { indexes: Array.from({ length: limit }, (_unused, index) => ({ key: `idx_${index}`, columns: ['x'], orders: ['ASC'] })) }; // always the same full page
      });
      await expect(apply(tables)).resolves.toBeTruthy(); // terminates; none of these keys is one the plan creates
      expect(tables.listIndexes.mock.calls.length).toBeLessThanOrEqual(2);
    });

    it('refuses to run without the SDK query helpers rather than silently listing 25 items', async () => {
      await expect(provision({ tables: fakeTables(), pollMs: 0 })).rejects.toThrow(/Query helpers/);
    });
  });

  it('refuses to continue when the table exists but is not private, and changes nothing', async () => {
    const tables = fakeTables({ table: { $permissions: ['read("any")'], rowSecurity: false } });
    await expect(apply(tables)).rejects.toThrow(/NOT private/);
    expect(tables.state.calls).toEqual([]);
    const rowLevel = fakeTables({ table: { $permissions: [], rowSecurity: true } });
    await expect(apply(rowLevel)).rejects.toThrow(/NOT private/);
  });

  it('refuses to modify a column whose definition differs', async () => {
    const tables = fakeTables({ table: { $permissions: [], rowSecurity: false }, columns: [{ key: 'page_path', type: 'varchar', size: 50 }] });
    await expect(apply(tables)).rejects.toThrow(/page_path/);
    expect(tables.state.calls).not.toContain('createColumn');
  });

  describe('existing columns are compared on every declared constraint', () => {
    /** The plan's own columns, as Appwrite would report them, with one column altered. */
    const planColumns = (alter = {}) =>
      COLUMNS.map((column) => ({ ...column, array: false, status: 'available', ...(alter[column.key] ?? {}) }));
    const tableOf = (columns) => fakeTables({ table: { $permissions: [], rowSecurity: false }, columns });

    it('accepts a table that already matches the plan, creating nothing', async () => {
      const tables = tableOf(planColumns());
      tables.state.indexes = new Map(INDEXES.map((index) => [index.key, { key: index.key, columns: index.columns, orders: index.orders.map((order) => order.toUpperCase()) }]));
      const report = await apply(tables);
      expect(report.created).toEqual([]);
      expect(tables.state.calls).toEqual([]);
    });

    it.each([
      ['a required column that is optional', { event_name: { required: false } }, /event_name required: expected true, found false/],
      ['an optional column that is required', { cta_id: { required: true } }, /cta_id required: expected false, found true/],
      ['a value column capped below what a purchase needs', { value: { max: 1000 } }, /value max: expected 1000000, found 1000/],
      ['a value column with a different floor', { value: { min: 1 } }, /value min: expected 0, found 1/],
      ['a percent column with a narrower range', { percent_scrolled: { max: 50 } }, /percent_scrolled max: expected 100, found 50/],
      ['a column that is an array', { target_key: { array: true } }, /target_key array: expected false, found true/],
      ['a text column that is too small', { page_path: { size: 50 } }, /page_path size: expected 190, found 50/],
      ['a column of another type', { value: { type: 'integer' } }, /value type: expected float, found integer/],
    ])('refuses %s and changes nothing', async (_label, alter, message) => {
      const tables = tableOf(planColumns(alter));
      await expect(apply(tables)).rejects.toThrow(message);
      expect(tables.state.calls).toEqual([]);
    });

    it('reports every difference at once, and creates nothing while any exists', async () => {
      const tables = fakeTables({
        table: { $permissions: [], rowSecurity: false },
        columns: planColumns({ value: { max: 1 }, event_name: { required: false } }).filter((column) => column.key !== 'status'), // one column is also missing
      });
      await expect(apply(tables)).rejects.toThrow(/event_name required[\s\S]*value max/);
      expect(tables.state.calls).not.toContain('createColumn');
    });

    it('describes a clean column as having no differences', () => {
      for (const column of COLUMNS) expect(describeColumnMismatches({ ...column, array: false }, column), column.key).toEqual([]);
    });

    it('refuses an existing index over different columns or in another order, and accepts the same one in any letter case', async () => {
      expect(describeIndexMismatches({ key: 'idx_page_path', columns: ['event_name'], orders: ['ASC'] }, INDEXES[2])).toHaveLength(1);
      expect(describeIndexMismatches({ key: 'idx_occurred_at', columns: ['occurred_at'], orders: ['ASC'] }, INDEXES[0])).toHaveLength(1);
      expect(describeIndexMismatches({ key: 'idx_occurred_at', columns: ['occurred_at'], orders: ['DESC'] }, INDEXES[0])).toEqual([]);
      expect(describeIndexMismatches({ key: 'idx_occurred_at', columns: ['occurred_at'] }, INDEXES[0])).toEqual([]); // no order reported
      const tables = tableOf(planColumns());
      tables.state.indexes = new Map([['idx_page_path', { key: 'idx_page_path', columns: ['event_name'], orders: ['ASC'] }]]);
      await expect(apply(tables)).rejects.toThrow(/idx_page_path columns/);
      expect(tables.state.calls).not.toContain('createIndex');
    });
  });

  it('tolerates a concurrent creation (409) of a column or index', async () => {
    const tables = fakeTables();
    tables.createDatetimeColumn.mockImplementation(async (p) => {
      tables.state.columns.set(p.key, { key: p.key, type: 'datetime', status: 'available' });
      throw Object.assign(new Error('exists'), { code: 409, type: 'column_already_exists' });
    });
    await expect(apply(tables)).resolves.toBeTruthy();
  });

  it('stores exactly the columns the Function can write, and indexes timestamp, event name, page path and retention', async () => {
    // The default registry registers no campaign, so register one for this test to exercise the utm_campaign column too.
    vi.resetModules();
    vi.doMock('../../functions/tracking-ingest/allowlists.js', async (importOriginal) => ({ ...(await importOriginal()), UTM_CAMPAIGNS: ['launch'] }));
    let validate;
    try {
      ({ validateEvent: validate } = await import('../../functions/tracking-ingest/contract.js'));
    } finally {
      vi.doUnmock('../../functions/tracking-ingest/allowlists.js');
      vi.resetModules();
    }
    // One event that uses every stored column: a click carries a target key, and every other column is optional.
    const event = {
      schema_version: 1,
      event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
      event_name: 'cta_click',
      timestamp: new Date().toISOString(),
      page_path: '/checkout/success/',
      target_key: 'book-diagnostic.header',
      session_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
      anonymous_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3303',
      consent: true,
      environment: 'preview',
      referrer_host: 'www.google.com',
      utm_source: 'linkedin',
      utm_medium: 'social',
      utm_campaign: 'launch',
      properties: {
        cta_id: 'book-diagnostic', cta_location: 'header', destination: '/diagnostic/', engagement_type: 'diagnostic', form_id: 'contact-inquiry', status: 'success', percent_scrolled: 50,
        product_id: 'revenue-optimization-diagnostic', currency: 'USD', value: 2500, variant: 'fixed-fee', experiment_id: 'exp-hero-cta-v1', transaction_id: '3f2504e04f8941d39a0c0305e82c3301',
      },
    };
    const result = validate(event, { now: new Date(), retentionDays: 90 });
    expect(result.ok).toBe(true);
    expect(COLUMNS.map((column) => column.key).sort()).toEqual(Object.keys(result.row).sort());
    expect(INDEXES.map((index) => index.columns[0]).sort()).toEqual(['event_name', 'expires_at', 'occurred_at', 'page_path']);
  });

  it('never provisions a column for personal data', () => {
    const forbidden = /(^|_)(name|email|phone|message|ip|user_agent|ua|address|dob|ssn|mrn|patient|payment|card|token|password)(_|$)/;
    for (const column of COLUMNS) {
      const key = column.key.replace('event_name', 'event').replace('utm_campaign', 'utm');
      expect(forbidden.test(key), column.key).toBe(false);
    }
  });
});

describe('private-table verification', () => {
  const responding = (statuses) => {
    const queue = [...statuses];
    return vi.fn(async () => ({ status: queue.shift() }));
  };

  it('passes when unauthenticated reads and writes are refused, and sends no credentials', async () => {
    const fetchImpl = responding([401, 401, 401]);
    const result = await verifyPrivate({ endpoint: 'https://appwrite.example.test/v1/', projectId: 'synthetic-project', fetchImpl });
    expect(result.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    for (const [url, init] of fetchImpl.mock.calls) {
      expect(url).toMatch(new RegExp(`^https://appwrite\\.example\\.test/v1/tablesdb/${DATABASE_ID}/tables/${TABLE_ID}`));
      expect(Object.keys(init.headers).map((name) => name.toLowerCase())).not.toContain('x-appwrite-key');
      expect(Object.keys(init.headers).map((name) => name.toLowerCase())).not.toContain('cookie');
    }
    expect(fetchImpl.mock.calls.map(([, init]) => init.method)).toEqual(['GET', 'POST', 'GET']);
  });

  it('accepts only authorisation denials (401 and 403) as proof that the table is private', async () => {
    const result = await verifyPrivate({ endpoint: 'https://a.test/v1', projectId: 'p', fetchImpl: responding([403, 401, 403]) });
    expect(result.ok).toBe(true);
    expect(result.results.map((probe) => probe.outcome)).toEqual(['refused', 'refused', 'refused']);
  });

  it.each([
    ['not found (wrong endpoint, project or path)', 404],
    ['rate limited', 429],
    ['bad request', 400],
    ['a server error', 500],
    ['a gateway error', 502],
    ['a redirect', 302],
  ])('does not certify the table as private on %s: the result is inconclusive', async (_label, status) => {
    const result = await verifyPrivate({ endpoint: 'https://a.test/v1', projectId: 'p', fetchImpl: responding([401, status, 401]) });
    expect(result.ok).toBe(false);
    expect(result.results[1]).toMatchObject({ status, outcome: 'inconclusive', refused: false });
  });

  it('is inconclusive, not certified, when the endpoint cannot be reached', async () => {
    const result = await verifyPrivate({
      endpoint: 'https://a.test/v1',
      projectId: 'p',
      fetchImpl: vi.fn(async () => {
        throw new TypeError('network');
      }),
    });
    expect(result.ok).toBe(false);
    expect(result.results.map((probe) => probe.outcome)).toEqual(['inconclusive', 'inconclusive', 'inconclusive']);
  });

  it('fails, as ALLOWED, if any unauthenticated request succeeds', async () => {
    const wrote = await verifyPrivate({ endpoint: 'https://a.test/v1', projectId: 'p', fetchImpl: responding([401, 201, 401]) });
    expect(wrote.ok).toBe(false);
    expect(wrote.results[1].outcome).toBe('allowed');
    const read = await verifyPrivate({ endpoint: 'https://a.test/v1', projectId: 'p', fetchImpl: responding([200, 401, 401]) });
    expect(read.ok).toBe(false);
    expect(read.results[0].outcome).toBe('allowed');
  });
});

describe('command line entry point', () => {
  const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const SCRIPT = 'scripts/appwrite/provision-analytics.js';
  const run = (args, cwd = ROOT, script = SCRIPT) => spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8', env: { PATH: process.env.PATH } });

  it('runs when started with the relative path the runbook uses, and prints the plan (it used to exit silently)', () => {
    const result = run(['plan']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Database  web_analytics');
    expect(result.stdout).toContain('Dry run only: nothing was created');
  });

  it('defaults to the plan, and runs from another directory with an absolute path', () => {
    expect(run([]).stdout).toContain('Dry run only');
    const elsewhere = run(['plan'], tmpdir(), join(ROOT, SCRIPT));
    expect(elsewhere.status).toBe(0);
    expect(elsewhere.stdout).toContain('tracking_events');
  });

  it('runs through a symlink to the script', () => {
    const directory = mkdtempSync(join(tmpdir(), 'provision-link-'));
    const link = join(directory, 'provision.js');
    symlinkSync(join(ROOT, SCRIPT), link);
    expect(run(['plan'], directory, link).stdout).toContain('Dry run only');
  });

  it('refuses an unknown command with a non-zero exit and a usage line', () => {
    const result = run(['drop-everything']);
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/Usage: provision-analytics\.js/);
  });

  it('names the missing variables, never a value, when credentials are absent', () => {
    for (const command of ['apply', 'verify-private']) {
      const result = run([command]);
      expect(result.status, command).toBe(1);
      expect(result.stderr).toMatch(/Missing environment variables: APPWRITE_ENDPOINT/);
    }
  });

  it('recognises itself as the entry point only when node was started with this very file', () => {
    const url = pathToFileURL(join(ROOT, SCRIPT)).href;
    expect(isEntryPoint(url, join(ROOT, SCRIPT))).toBe(true);
    expect(isEntryPoint(url, join(ROOT, 'scripts/../', SCRIPT))).toBe(true);
    expect(isEntryPoint(url, undefined)).toBe(false);
    expect(isEntryPoint(url, join(ROOT, 'scripts/appwrite/provision-analytics.test.js'))).toBe(false);
    expect(isEntryPoint(url, join(ROOT, 'does-not-exist.js'))).toBe(false);
  });
});
