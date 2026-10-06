// Provision the PRIVATE analytics table for ADR-009: database `web_analytics`, table `tracking_events`.
//
//   node scripts/appwrite/provision-analytics.js plan             # default: prints the plan, no network, no credentials
//   node scripts/appwrite/provision-analytics.js apply            # creates what is missing, never modifies or deletes
//   node scripts/appwrite/provision-analytics.js verify-private   # proves unauthenticated callers cannot read or write
//
// `apply` needs a setup-time API key (scopes: databases.write, tables.write, columns.write, indexes.write)
// in the environment, never in a file or on the command line:
//   APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_SETUP_API_KEY
// Install the SDK first:  npm ci --prefix functions/tracking-ingest
//
// The table is created with NO permissions and row security OFF, so only server-side API keys can read or write it.
// Re-running is safe: existing resources are verified, never overwritten. A table that is not private is reported and
// left untouched.
import process from 'node:process';
import { createRequire } from 'node:module';
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
 * Idempotent provisioning against an injected TablesDB service. Returns a report of what was created, what already
 * existed and any problem. Throws if the table exists but is not private or a column differs from the plan.
 */
export async function provision({ tables, log = () => {}, pollMs = 1000, pollAttempts = 60 }) {
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

  const present = new Map(((await tables.listColumns({ databaseId: DATABASE_ID, tableId: TABLE_ID })).columns ?? []).map((column) => [column.key, column]));
  // Check every existing column before creating any missing one, so a mismatch aborts without partial changes.
  for (const column of COLUMNS) {
    const found = present.get(column.key);
    if (found && (found.type !== column.type || (column.type === 'varchar' && found.size !== column.size))) {
      throw new Error(`Column ${column.key} exists with a different definition (${found.type}${found.size ? `(${found.size})` : ''}). Refusing to modify it.`);
    }
  }
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
    const { columns = [] } = await tables.listColumns({ databaseId: DATABASE_ID, tableId: TABLE_ID });
    const keys = new Set(columns.filter((column) => column.status === 'available').map((column) => column.key));
    if (COLUMNS.every((column) => keys.has(column.key))) break;
    if (attempt === pollAttempts - 1) throw new Error('Timed out waiting for columns to become available.');
    await sleep(pollMs);
  }

  const haveIndexes = new Set(((await tables.listIndexes({ databaseId: DATABASE_ID, tableId: TABLE_ID })).indexes ?? []).map((index) => index.key));
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

/**
 * Prove the table is private: unauthenticated requests (project header only, no key, no session) must be refused.
 * Any 2xx means the table is publicly reachable. Uses synthetic data only.
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
    const response = await fetchImpl(url, init);
    results.push({ label, status: response.status, refused: response.status >= 400 && response.status < 500 });
  }
  return { ok: results.every((result) => result.refused), results };
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
    const { Client, TablesDB } = createRequire(new URL('../../functions/tracking-ingest/package.json', import.meta.url))('node-appwrite');
    const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_SETUP_API_KEY);
    const report = await provision({ tables: new TablesDB(client), log: (line) => process.stdout.write(`${line}\n`) });
    process.stdout.write(`created: ${report.created.length}, already present: ${report.existing.length}\n`);
    return;
  }
  if (command === 'verify-private') {
    requireEnv(['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID']);
    const result = await verifyPrivate({ endpoint: process.env.APPWRITE_ENDPOINT, projectId: process.env.APPWRITE_PROJECT_ID });
    for (const probe of result.results) process.stdout.write(`${probe.refused ? 'refused ' : 'ALLOWED '} ${probe.status}  ${probe.label}\n`);
    if (!result.ok) {
      process.stderr.write('The table is reachable without credentials. Treat this as a blocker and fix its permissions.\n');
      process.exitCode = 1;
    }
    return;
  }
  throw new Error('Usage: provision-analytics.js [plan|apply|verify-private]');
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main(process.argv[2]).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
