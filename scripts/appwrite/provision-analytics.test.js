import { describe, expect, it, vi } from 'vitest';
import { validateEvent } from '../../functions/tracking-ingest/contract.js';
import { COLUMNS, DATABASE_ID, INDEXES, PLAN, TABLE_ID, provision, verifyPrivate } from './provision-analytics.js';

const notFound = () => Object.assign(new Error('not found'), { code: 404, type: 'table_not_found' });

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
    listColumns: vi.fn(async () => ({ columns: [...state.columns.values()] })),
    createVarcharColumn: vi.fn(async (p) => addColumn({ key: p.key, type: 'varchar', size: p.size })),
    createDatetimeColumn: vi.fn(async (p) => addColumn({ key: p.key, type: 'datetime' })),
    createIntegerColumn: vi.fn(async (p) => addColumn({ key: p.key, type: 'integer' })),
    createFloatColumn: vi.fn(async (p) => addColumn({ key: p.key, type: 'float' })),
    listIndexes: vi.fn(async () => ({ indexes: [...state.indexes.values()] })),
    createIndex: vi.fn(async (p) => {
      record('createIndex');
      state.indexes.set(p.key, { key: p.key, ...p });
    }),
  };
}

describe('analytics table provisioning', () => {
  it('creates a PRIVATE table: no permissions and row security off', async () => {
    const tables = fakeTables();
    const report = await provision({ tables, pollMs: 0 });
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
    await provision({ tables, pollMs: 0 });
    tables.state.calls.length = 0;
    const second = await provision({ tables, pollMs: 0 });
    expect(second.created).toEqual([]);
    expect(tables.state.calls).toEqual([]);
  });

  it('refuses to continue when the table exists but is not private, and changes nothing', async () => {
    const tables = fakeTables({ table: { $permissions: ['read("any")'], rowSecurity: false } });
    await expect(provision({ tables, pollMs: 0 })).rejects.toThrow(/NOT private/);
    expect(tables.state.calls).toEqual([]);
    const rowLevel = fakeTables({ table: { $permissions: [], rowSecurity: true } });
    await expect(provision({ tables: rowLevel, pollMs: 0 })).rejects.toThrow(/NOT private/);
  });

  it('refuses to modify a column whose definition differs', async () => {
    const tables = fakeTables({ table: { $permissions: [], rowSecurity: false }, columns: [{ key: 'page_path', type: 'varchar', size: 50 }] });
    await expect(provision({ tables, pollMs: 0 })).rejects.toThrow(/page_path/);
    expect(tables.state.calls).not.toContain('createColumn');
  });

  it('tolerates a concurrent creation (409) of a column or index', async () => {
    const tables = fakeTables();
    tables.createDatetimeColumn.mockImplementation(async (p) => {
      tables.state.columns.set(p.key, { key: p.key, type: 'datetime', status: 'available' });
      throw Object.assign(new Error('exists'), { code: 409, type: 'column_already_exists' });
    });
    await expect(provision({ tables, pollMs: 0 })).resolves.toBeTruthy();
  });

  it('stores exactly the columns the Function can write, and indexes timestamp, event name, page path and retention', () => {
    const event = {
      schema_version: 1,
      event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
      event_name: 'purchase',
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
        cta_id: 'a', cta_location: 'b', destination: '/diagnostic/', engagement_type: 'c', form_id: 'd', status: 'paid', percent_scrolled: 50,
        product_id: 'revenue-optimization-diagnostic', currency: 'USD', value: 2500, variant: 'v', experiment_id: 'e', transaction_id: 'cs_test_a1B2c3D4e5F6g7H8',
      },
    };
    const result = validateEvent(event, { now: new Date(), retentionDays: 90 });
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

  it('accepts 403 and 404 as refusals', async () => {
    expect((await verifyPrivate({ endpoint: 'https://a.test/v1', projectId: 'p', fetchImpl: responding([403, 404, 401]) })).ok).toBe(true);
  });

  it('fails if any unauthenticated request succeeds or the server errors', async () => {
    expect((await verifyPrivate({ endpoint: 'https://a.test/v1', projectId: 'p', fetchImpl: responding([401, 201, 401]) })).ok).toBe(false);
    expect((await verifyPrivate({ endpoint: 'https://a.test/v1', projectId: 'p', fetchImpl: responding([200, 401, 401]) })).ok).toBe(false);
    expect((await verifyPrivate({ endpoint: 'https://a.test/v1', projectId: 'p', fetchImpl: responding([401, 401, 500]) })).ok).toBe(false);
  });
});
