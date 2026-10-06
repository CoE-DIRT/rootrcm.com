// Local integration check for the tracking-ingest Function (ADR-009): the real node-appwrite SDK and the real
// main.js / handler.js / store.js talk to a fake Appwrite HTTP server on 127.0.0.1. Synthetic data only; no network
// beyond loopback; no credentials. It proves the request shapes the SDK actually sends (row id = event id, empty row
// permissions, project and key headers, 409 handled as a duplicate, expires_at purge), not that a real project is configured.
//
//   npm ci --prefix functions/tracking-ingest
//   node scripts/appwrite/local-integration.mjs
import http from 'node:http';
import assert from 'node:assert/strict';

const seen = new Set();
const requests = [];
let deleteCalls = 0;

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    const url = new URL(req.url, 'http://127.0.0.1');
    requests.push({ method: req.method, path: url.pathname, search: url.search, headers: req.headers, body });
    const rows = '/v1/tablesdb/web_analytics/tables/tracking_events/rows';
    res.setHeader('content-type', 'application/json');
    if (req.method === 'POST' && url.pathname === rows) {
      const parsed = JSON.parse(body);
      if (seen.has(parsed.rowId)) {
        res.statusCode = 409;
        return res.end(JSON.stringify({ message: 'Row with the requested ID already exists.', code: 409, type: 'row_already_exists', version: '1.8.0' }));
      }
      seen.add(parsed.rowId);
      res.statusCode = 201;
      return res.end(JSON.stringify({ $id: parsed.rowId, $createdAt: new Date().toISOString(), ...parsed.data }));
    }
    if (req.method === 'DELETE' && url.pathname === rows) {
      deleteCalls += 1;
      res.statusCode = 200;
      return res.end(JSON.stringify(deleteCalls === 1 ? { total: 2, rows: [{ $id: 'a' }, { $id: 'b' }] } : { total: 0, rows: [] }));
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'not found', code: 404, type: 'general_route_not_found' }));
  });
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

process.env.APPWRITE_FUNCTION_API_ENDPOINT = `http://127.0.0.1:${port}/v1`;
process.env.APPWRITE_PROJECT_ID = 'synthetic-project';
process.env.APPWRITE_DATABASE_ID = 'web_analytics';
process.env.APPWRITE_TABLE_ID = 'tracking_events';
process.env.APPWRITE_API_KEY = 'synthetic-key-not-a-real-secret';

const { default: main } = await import(new URL('../../functions/tracking-ingest/main.js', import.meta.url).href);

const errors = [];
const run = async (req) => {
  let out;
  const res = {
    json: (body, status = 200, headers = {}) => (out = { kind: 'json', body, status, headers }),
    text: (body, status = 200, headers = {}) => (out = { kind: 'text', body, status, headers }),
  };
  await main({ req, res, error: (message) => errors.push(message), log: () => {} });
  return out;
};

const uuid = (n) => `3f2504e0-4f89-41d3-9a0c-${String(n).padStart(12, '0')}`;
const event = (n) => ({
  schema_version: 1, event_id: uuid(n), event_name: 'cta_click', timestamp: new Date().toISOString(), page_path: '/pricing/',
  target_key: 'book-diagnostic.header', session_id: uuid(900), anonymous_id: uuid(800), consent: true, environment: 'preview',
  properties: { cta_id: 'book-diagnostic', cta_location: 'header' },
});
const post = (events) => ({ method: 'POST', headers: { origin: 'https://rootrcm.com', 'content-type': 'text/plain;charset=UTF-8' }, bodyText: JSON.stringify({ events }) });

// 1. valid batch -> created through the real SDK
let out = await run(post([event(1), event(2)]));
assert.equal(out.status, 202);
assert.deepEqual(out.body, { ok: true, accepted: 2, rejected: 0 });
const creates = requests.filter((r) => r.method === 'POST');
assert.equal(creates.length, 2);
const first = JSON.parse(creates[0].body);
assert.equal(first.rowId, uuid(1));
assert.deepEqual(first.permissions, []);
assert.equal(first.data.event_name, 'cta_click');
assert.equal(creates[0].headers['x-appwrite-project'], 'synthetic-project');
assert.equal(creates[0].headers['x-appwrite-key'], 'synthetic-key-not-a-real-secret');
assert.equal(JSON.stringify(out).includes('synthetic-key'), false, 'response must not contain the key');

// 2. duplicate event id -> real 409 from the server -> idempotent 202
out = await run(post([event(1)]));
assert.equal(out.status, 202);

// 3. invalid event never reaches the database
const before = requests.length;
out = await run(post([{ ...event(3), email: 'someone@example.test' }]));
assert.equal(out.status, 400);
assert.equal(requests.length, before);

// 4. scheduled purge -> DELETE with expires_at query + limit
out = await run({ method: 'GET', headers: { 'x-appwrite-trigger': 'schedule' }, bodyText: '', });
assert.equal(out.status, 200);
assert.deepEqual(out.body, { ok: true, purged: 2 });
const del = requests.find((r) => r.method === 'DELETE');
const queries = JSON.parse(del.body).queries.map((q) => JSON.parse(q));
assert.ok(queries.some((q) => q.method === 'lessThanEqual' && q.attribute === 'expires_at'), 'purge must filter on expires_at');
assert.ok(queries.some((q) => q.method === 'limit'), 'purge must be bounded');

// 5. an HTTP GET from the site's origin cannot purge
const deletesBefore = requests.filter((r) => r.method === 'DELETE').length;
out = await run({ method: 'GET', headers: { origin: 'https://rootrcm.com' }, bodyText: '' });
assert.equal(out.status, 405);
assert.equal(requests.filter((r) => r.method === 'DELETE').length, deletesBefore);

// 6. database outage -> generic 503, nothing leaks
server.close();
await new Promise((r) => setTimeout(r, 50));
out = await run(post([event(10)]));
assert.equal(out.status, 503);
assert.deepEqual(out.body, { ok: false });
assert.equal(JSON.stringify(out).match(/synthetic|127\.0\.0\.1|ECONN/i), null);

console.log('integration OK:', { requests: requests.length, errorsLogged: errors });
