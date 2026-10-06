import { LIMITS, validateEvent } from './contract.js';

// Pure request handling for the `tracking-ingest` Function. The Appwrite adapter (main.js) supplies the request
// facts and a `store`; nothing here touches the network, the environment or the console, and nothing derived from
// a request body is ever logged. Responses are generic: status codes and counts only.

const DEFAULT_ORIGINS = ['https://rootrcm.com', 'https://www.rootrcm.com'];
const DEFAULT_RETENTION_DAYS = 90;
const PURGE_BATCHES = 40;
const PURGE_BUDGET_MS = 20_000;
const WRITE_CONCURRENCY = 5;

/** Parse and bound the Function's non-secret settings. Invalid values fall back to safe defaults. */
export function parseConfig(env = {}) {
  const origins = String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const allowedOrigins = new Set();
  for (const entry of origins.length ? origins : DEFAULT_ORIGINS) {
    try {
      const url = new URL(entry);
      if (url.origin === entry && (url.protocol === 'https:' || url.hostname === 'localhost')) allowedOrigins.add(url.origin);
    } catch {
      /* ignore malformed entries */
    }
  }
  if (!allowedOrigins.size) DEFAULT_ORIGINS.forEach((origin) => allowedOrigins.add(origin));

  const days = Number.parseInt(String(env.TRACKING_RETENTION_DAYS || ''), 10);
  const retentionDays = Number.isInteger(days) && days >= 1 && days <= 365 ? days : DEFAULT_RETENTION_DAYS;
  return { allowedOrigins, retentionDays };
}

const baseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  vary: 'Origin',
};

function respond(status, body, origin, config) {
  const headers = { ...baseHeaders };
  if (config.allowedOrigins.has(origin)) {
    headers['access-control-allow-origin'] = origin;
    headers['access-control-allow-methods'] = 'POST, OPTIONS';
    headers['access-control-allow-headers'] = 'content-type';
    headers['access-control-max-age'] = '600';
  }
  return { status, body, headers };
}

const byteLength = (text) => new TextEncoder().encode(text).byteLength;

/** Run `task` over `items` with bounded concurrency; never throws, returns each outcome. */
async function mapBounded(items, limit, task) {
  const outcomes = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      try {
        outcomes[index] = { ok: true, value: await task(items[index]) };
      } catch {
        outcomes[index] = { ok: false };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return outcomes;
}

async function purge({ store, now, config }) {
  const started = Date.now();
  let deleted = 0;
  for (let batch = 0; batch < PURGE_BATCHES && Date.now() - started < PURGE_BUDGET_MS; batch += 1) {
    const count = await store.purgeExpired(now().toISOString());
    deleted += count;
    if (count === 0) break;
  }
  return respond(200, { ok: true, purged: deleted }, '', config);
}

/**
 * @param {{ method: string, headers: Record<string, string>, bodyText: string, trigger?: string }} request
 * @param {{ store: { createEvent(rowId: string, row: object): Promise<'created'|'duplicate'>, purgeExpired(isoNow: string): Promise<number> },
 *           config: ReturnType<typeof parseConfig>, now?: () => Date }} deps
 */
export async function handleTracking(request, { store, config, now = () => new Date() }) {
  const method = String(request.method || '').toUpperCase();
  const headers = Object.fromEntries(Object.entries(request.headers || {}).map(([key, value]) => [key.toLowerCase(), String(value)]));
  const origin = headers.origin || '';

  // Appwrite sets this trigger for cron executions. The only thing a scheduled run does is delete expired rows,
  // and that is also all a forged header could achieve, so an HTTP caller cannot read or write anything this way.
  if (request.trigger === 'schedule' && method === 'GET') return purge({ store, now, config });

  if (!config.allowedOrigins.has(origin)) return respond(403, { ok: false }, origin, config);
  if (method === 'OPTIONS') return respond(204, null, origin, config);
  if (method !== 'POST') return respond(405, { ok: false }, origin, config);

  const bodyText = typeof request.bodyText === 'string' ? request.bodyText : '';
  if (byteLength(bodyText) > LIMITS.bodyBytes) return respond(413, { ok: false }, origin, config);

  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return respond(400, { ok: false }, origin, config);
  }
  const keys = payload && typeof payload === 'object' && !Array.isArray(payload) ? Object.keys(payload) : [];
  if (keys.length !== 1 || keys[0] !== 'events' || !Array.isArray(payload.events) || payload.events.length === 0) {
    return respond(400, { ok: false }, origin, config);
  }
  if (payload.events.length > LIMITS.batchSize) return respond(413, { ok: false }, origin, config);

  const at = now();
  const accepted = [];
  const seen = new Set();
  let rejected = 0;
  for (const event of payload.events) {
    const result = validateEvent(event, { now: at, retentionDays: config.retentionDays });
    // The same event twice in one batch counts once; across batches the store reports it as a duplicate.
    if (!result.ok || seen.has(result.rowId)) {
      rejected += 1;
      continue;
    }
    seen.add(result.rowId);
    accepted.push(result);
  }
  if (!accepted.length) return respond(400, { ok: false, accepted: 0, rejected }, origin, config);

  const outcomes = await mapBounded(accepted, WRITE_CONCURRENCY, (item) => store.createEvent(item.rowId, item.row));
  // A failed write returns 503 so the browser retries the batch; events already stored come back as duplicates.
  if (outcomes.some((outcome) => !outcome.ok)) return respond(503, { ok: false }, origin, config);

  return respond(202, { ok: true, accepted: accepted.length, rejected }, origin, config);
}
