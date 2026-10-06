// Provision the PRIVATE analytics table for ADR-009: database `web_analytics`, table `tracking_events`.
//
//   node scripts/appwrite/provision-analytics.js plan             # default: prints the plan, no network, no credentials
//   node scripts/appwrite/provision-analytics.js apply            # creates what is missing, never modifies or deletes
//   node scripts/appwrite/provision-analytics.js verify-private   # proves unauthenticated callers cannot read or write
//
// `apply` needs a setup-time API key in the environment, never in a file or on the command line. Scopes: the write scopes
// (databases.write, tables.write, columns.write, indexes.write) to create what is missing AND the matching read scopes
// (databases.read, tables.read, columns.read, indexes.read), because every run first reads what already exists.
// Delete the key afterwards.
//   APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_SETUP_API_KEY
// Install the SDK first:  npm ci --prefix functions/tracking-ingest
//
// The table is created with NO permissions and row security OFF, so only server-side API keys can read or write it.
// Re-running is safe: existing resources are verified, never overwritten. A table that is not private is reported and
// left untouched.
import { realpathSync } from 'node:fs';
import process from 'node:process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { COLUMN_SIZES } from '../../functions/tracking-ingest/contract.js';

export const DATABASE_ID = 'web_analytics';
export const TABLE_ID = 'tracking_events';

const text = (key, required = false) => ({ key, type: 'varchar', size: COLUMN_SIZES[key], required });

/** Every stored column. Kept in step with the rows contract.js validateEvent() can produce (see the test). */
export const COLUMNS = [
  text('event_name', true),
  { key: 'occurred_at', type: 'datetime', required: true },
  { key: 'received_at', type: 'datetime', required: true },
  { key: 'expires_at', type: 'datetime', required: true },
  { key: 'schema_version', type: 'integer', min: 1, max: 1000, required: true },
  text('page_path', true),
  text('session_id', true),
  text('anonymous_id', true),
  text('environment', true),
  text('target_key'),
  text('referrer_host'),
  text('utm_source'),
  text('utm_medium'),
  text('utm_campaign'),
  text('cta_id'),
  text('cta_location'),
  text('destination'),
  text('engagement_type'),
  text('form_id'),
  text('status'),
  { key: 'percent_scrolled', type: 'integer', min: 0, max: 100, required: false },
  text('product_id'),
  text('currency'),
  { key: 'value', type: 'float', min: 0, max: 1_000_000, required: false },
  text('variant'),
  text('experiment_id'),
  text('transaction_id'),
];

/** Timestamp, event name, page path and retention, as required. */
export const INDEXES = [
  { key: 'idx_occurred_at', columns: ['occurred_at'], orders: ['desc'] },
  { key: 'idx_event_name', columns: ['event_name'], orders: ['asc'] },
  { key: 'idx_page_path', columns: ['page_path'], orders: ['asc'] },
  { key: 'idx_expires_at', columns: ['expires_at'], orders: ['asc'] },
];

export const PLAN = {
  database: { databaseId: DATABASE_ID, name: 'Web analytics' },
  table: { databaseId: DATABASE_ID, tableId: TABLE_ID, name: 'Tracking events', permissions: [], rowSecurity: false, enabled: true },
  columns: COLUMNS,
  indexes: INDEXES,
};

const isNotFound = (error) => Boolean(error) && (error.code === 404 || /not_found/.test(String(error.type || '')));
const isConflict = (error) => Boolean(error) && (error.code === 409 || /already_exists/.test(String(error.type || '')));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Appwrite answers a list call with 25 items unless it is asked for more, and this table has more than 25 columns. */
const LIST_PAGE_SIZE = 100;

/**
 * Every item of an Appwrite list, read page by page with explicit limit and offset queries. `list(queries)` makes one call and
 * `collection` names the array in its answer. Items are keyed by `key`. A short page is the last one; a page that adds nothing
 * new means the server ignored the offset, so reading stops there instead of looping forever.
 */
async function listAll(list, collection, Query) {
  const items = new Map();
  for (let offset = 0; ; offset += LIST_PAGE_SIZE) {
    const page = (await list([Query.limit(LIST_PAGE_SIZE), Query.offset(offset)]))?.[collection] ?? [];
    const before = items.size;
    for (const item of page) items.set(item.key, item);
    if (page.length < LIST_PAGE_SIZE || items.size === before) return [...items.values()];
  }
}

function columnCall(tables, column) {
  const base = { databaseId: DATABASE_ID, tableId: TABLE_ID, key: column.key, required: column.required };
  switch (column.type) {
    case 'varchar':
      return tables.createVarcharColumn({ ...base, size: column.size });
    case 'datetime':
      return tables.createDatetimeColumn(base);
    case 'integer':
      return tables.createIntegerColumn({ ...base, min: column.min, max: column.max });
    case 'float':
      return tables.createFloatColumn({ ...base, min: column.min, max: column.max });
    default:
      throw new Error(`Unsupported column type: ${column.type}`);
  }
}

/**
 * Differences between a column that already exists and the plan, over every declared constraint (type, size, required, bounds,
 * not an array). Empty means the column is what the plan says. A column that is looser or stricter than the Function expects
 * would make valid events fail after this script reported success, so any difference is an error.
 */
export function describeColumnMismatches(found, column) {
  const differences = [];
  const compare = (label, actual, expected) => {
    if (actual !== expected) differences.push(`${label}: expected ${String(expected)}, found ${String(actual)}`);
  };
  compare('type', found.type, column.type);
  compare('required', found.required === true, column.required === true);
  compare('array', found.array === true, false);
  if (column.type === 'varchar') compare('size', found.size, column.size);
  if (column.type === 'integer' || column.type === 'float') {
    compare('min', Number(found.min), column.min);
    compare('max', Number(found.max), column.max);
  }
  return differences;
}

const sameList = (a, b) => Array.isArray(a) && a.length === b.length && a.every((value, index) => String(value).toLowerCase() === String(b[index]).toLowerCase());

/** Differences between an existing index and the plan: its columns, and its order when Appwrite reports one. */
export function describeIndexMismatches(found, index) {
  const differences = [];
  if (!sameList(found.columns, index.columns)) differences.push(`columns: expected ${index.columns.join(',')}, found ${(found.columns ?? []).join(',')}`);
  if (Array.isArray(found.orders) && found.orders.length && !sameList(found.orders, index.orders)) {
    differences.push(`orders: expected ${index.orders.join(',')}, found ${found.orders.join(',')}`);
  }
  return differences;
}

/**
 * Idempotent provisioning against an injected TablesDB service. Returns a report of what was created, what already
 * existed and any problem. Throws if the table exists but is not private or a column differs from the plan.
 * `Query` is the SDK's query builder (only `limit` and `offset` are used), injected like the service so tests need no SDK.
 */
export async function provision({ tables, Query, log = () => {}, pollMs = 1000, pollAttempts = 60 }) {
  if (!Query || typeof Query.limit !== 'function' || typeof Query.offset !== 'function') throw new Error('provision() needs the SDK Query helpers (limit, offset).');
  const listColumns = async () => listAll((queries) => tables.listColumns({ databaseId: DATABASE_ID, tableId: TABLE_ID, queries }), 'columns', Query);
  const listIndexes = async () => listAll((queries) => tables.listIndexes({ databaseId: DATABASE_ID, tableId: TABLE_ID, queries }), 'indexes', Query);
  const report = { created: [], existing: [] };

  try {
    await tables.get({ databaseId: DATABASE_ID });
    report.existing.push(`database:${DATABASE_ID}`);
  } catch (error) {
    if (!isNotFound(error)) throw error;
    await tables.create({ databaseId: DATABASE_ID, name: PLAN.database.name, enabled: true });
    report.created.push(`database:${DATABASE_ID}`);
    log(`created database ${DATABASE_ID}`);
  }

  try {
    const table = await tables.getTable({ databaseId: DATABASE_ID, tableId: TABLE_ID });
    const permissions = table.$permissions ?? [];
    if (permissions.length > 0 || table.rowSecurity === true) {
      throw new Error(`Table ${TABLE_ID} exists but is NOT private (permissions: ${permissions.length}, rowSecurity: ${table.rowSecurity}). Refusing to continue; fix it in the console.`);
    }
    report.existing.push(`table:${TABLE_ID}`);
  } catch (error) {
    if (!isNotFound(error)) throw error;
    await tables.createTable({ ...PLAN.table });
    report.created.push(`table:${TABLE_ID}`);
    log(`created private table ${TABLE_ID}`);
  }

  const present = new Map((await listColumns()).map((column) => [column.key, column]));
  // Check every existing column before creating any missing one, so a mismatch aborts without partial changes.
  const mismatches = COLUMNS.flatMap((column) => {
    const found = present.get(column.key);
    return found ? describeColumnMismatches(found, column).map((difference) => `${column.key} ${difference}`) : [];
  });
  if (mismatches.length) throw new Error(`Existing columns differ from the plan (${mismatches.join('; ')}). Refusing to modify them.`);
  for (const column of COLUMNS) {
    if (present.has(column.key)) {
      report.existing.push(`column:${column.key}`);
      continue;
    }
    try {
      await columnCall(tables, column);
      report.created.push(`column:${column.key}`);
    } catch (error) {
      if (!isConflict(error)) throw error;
      report.existing.push(`column:${column.key}`);
    }
  }

  for (let attempt = 0; attempt < pollAttempts; attempt += 1) {
    const keys = new Set((await listColumns()).filter((column) => column.status === 'available').map((column) => column.key));
    if (COLUMNS.every((column) => keys.has(column.key))) break;
    if (attempt === pollAttempts - 1) throw new Error('Timed out waiting for columns to become available.');
    await sleep(pollMs);
  }

  const haveIndexes = new Map((await listIndexes()).map((index) => [index.key, index]));
  const indexMismatches = INDEXES.flatMap((index) => {
    const found = haveIndexes.get(index.key);
    return found ? describeIndexMismatches(found, index).map((difference) => `${index.key} ${difference}`) : [];
  });
  if (indexMismatches.length) throw new Error(`Existing indexes differ from the plan (${indexMismatches.join('; ')}). Refusing to modify them.`);
  for (const index of INDEXES) {
    if (haveIndexes.has(index.key)) {
      report.existing.push(`index:${index.key}`);
      continue;
    }
    try {
      await tables.createIndex({ databaseId: DATABASE_ID, tableId: TABLE_ID, key: index.key, type: 'key', columns: index.columns, orders: index.orders });
      report.created.push(`index:${index.key}`);
    } catch (error) {
      if (!isConflict(error)) throw error;
      report.existing.push(`index:${index.key}`);
    }
  }
  return report;
}

/** The statuses Appwrite answers an unauthenticated caller with when it is refused: unauthorised or forbidden. */
const REFUSAL_STATUSES = new Set([401, 403]);

/**
 * Prove the table is private: unauthenticated requests (project header only, no key, no session) must be refused with an
 * authorisation denial (401 or 403). A 2xx means the table is publicly reachable. Anything else (404 from the wrong endpoint,
 * project or path, 429, 5xx, a network failure) proves nothing about this table, so it is "inconclusive" and fails the check
 * rather than certifying it. Uses synthetic data only.
 */
export async function verifyPrivate({ endpoint, projectId, fetchImpl = fetch }) {
  const base = `${endpoint.replace(/\/$/, '')}/tablesdb/${DATABASE_ID}/tables/${TABLE_ID}`;
  const headers = { 'x-appwrite-project': projectId, 'content-type': 'application/json' };
  const probes = [
    ['read rows', `${base}/rows`, { method: 'GET', headers }],
    ['write a row', `${base}/rows`, { method: 'POST', headers, body: JSON.stringify({ rowId: 'unique()', data: { event_name: 'page_view' } }) }],
    ['read the table definition', base, { method: 'GET', headers }],
  ];
  const results = [];
  for (const [label, url, init] of probes) {
    let status = 0;
    try {
      status = (await fetchImpl(url, init)).status;
    } catch {
      /* unreachable: inconclusive */
    }
    const outcome = REFUSAL_STATUSES.has(status) ? 'refused' : status >= 200 && status < 300 ? 'allowed' : 'inconclusive';
    results.push({ label, status, outcome, refused: outcome === 'refused' });
  }
  return { ok: results.every((result) => result.outcome === 'refused'), results };
}

function describePlan() {
  const lines = [
    `Database  ${PLAN.database.databaseId} ("${PLAN.database.name}")`,
    `Table     ${TABLE_ID}  permissions: none  rowSecurity: off  (private: server-side API keys only)`,
    'Columns',
    ...COLUMNS.map((column) => `  ${column.key.padEnd(18)} ${column.type}${column.size ? `(${column.size})` : ''}${column.required ? '  required' : ''}`),
    'Indexes',
    ...INDEXES.map((index) => `  ${index.key.padEnd(16)} ${index.columns.join(', ')} ${index.orders.join(', ')}`),
  ];
  return lines.join('\n');
}

function requireEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}. Values are never printed.`);
}

async function main(command = 'plan') {
  if (command === 'plan') {
    process.stdout.write(`${describePlan()}\n\nDry run only: nothing was created. Run "apply" with credentials in the environment to provision.\n`);
    return;
  }
  if (command === 'apply') {
    requireEnv(['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_SETUP_API_KEY']);
    const { Client, TablesDB, Query } = createRequire(new URL('../../functions/tracking-ingest/package.json', import.meta.url))('node-appwrite');
    const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_SETUP_API_KEY);
    const report = await provision({ tables: new TablesDB(client), Query, log: (line) => process.stdout.write(`${line}\n`) });
    process.stdout.write(`created: ${report.created.length}, already present: ${report.existing.length}\n`);
    return;
  }
  if (command === 'verify-private') {
    requireEnv(['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID']);
    const result = await verifyPrivate({ endpoint: process.env.APPWRITE_ENDPOINT, projectId: process.env.APPWRITE_PROJECT_ID });
    const words = { refused: 'refused     ', allowed: 'ALLOWED     ', inconclusive: 'INCONCLUSIVE' };
    for (const probe of result.results) process.stdout.write(`${words[probe.outcome]} ${probe.status}  ${probe.label}\n`);
    if (result.results.some((probe) => probe.outcome === 'allowed')) {
      process.stderr.write('The table is reachable without credentials. Treat this as a blocker and fix its permissions.\n');
      process.exitCode = 1;
    } else if (!result.ok) {
      process.stderr.write('Inconclusive: a probe was not an authorisation denial (wrong endpoint or project, rate limit, outage). The table is NOT certified private; fix the cause and run again.\n');
      process.exitCode = 1;
    }
    return;
  }
  throw new Error('Usage: provision-analytics.js [plan|apply|verify-private]');
}

/** True when this file is the script node was started with, whether it was given as a relative, absolute or symlinked path. */
export function isEntryPoint(metaUrl, argv1) {
  if (!argv1) return false;
  try {
    return metaUrl === pathToFileURL(realpathSync(resolve(argv1))).href;
  } catch {
    return false;
  }
}

if (isEntryPoint(import.meta.url, process.argv[1])) {
  main(process.argv[2]).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
