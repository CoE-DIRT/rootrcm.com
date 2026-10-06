import process from 'node:process';
import { Client, TablesDB, Query } from 'node-appwrite';
import { handleTracking, parseConfig } from './handler.js';
import { createAppwriteStore } from './store.js';

// Appwrite HTTP Function adapter for deidentified analytics ingestion (ADR-009).
// Server-only variables (never VITE_*): APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID,
// APPWRITE_API_KEY (scopes rows.read and rows.write only). Settings: ALLOWED_ORIGINS, TRACKING_RETENTION_DAYS.
// APPWRITE_FUNCTION_API_ENDPOINT is provided by the Appwrite runtime.
// Nothing derived from a request is logged; failures log a constant string only.

let store;

function getStore(env) {
  if (store) return store;
  const required = ['APPWRITE_FUNCTION_API_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_DATABASE_ID', 'APPWRITE_TABLE_ID', 'APPWRITE_API_KEY'];
  if (required.some((name) => !env[name])) return null;
  const client = new Client().setEndpoint(env.APPWRITE_FUNCTION_API_ENDPOINT).setProject(env.APPWRITE_PROJECT_ID).setKey(env.APPWRITE_API_KEY);
  store = createAppwriteStore({ tables: new TablesDB(client), Query, databaseId: env.APPWRITE_DATABASE_ID, tableId: env.APPWRITE_TABLE_ID });
  return store;
}

export default async ({ req, res, error }) => {
  const activeStore = getStore(process.env);
  if (!activeStore) {
    error('tracking-ingest is not configured');
    return res.json({ ok: false }, 500);
  }
  try {
    const result = await handleTracking(
      { method: req.method, headers: req.headers, bodyText: req.bodyText || '', trigger: req.headers['x-appwrite-trigger'] || '' },
      { store: activeStore, config: parseConfig(process.env) },
    );
    if (result.status >= 500) error('tracking-ingest request failed');
    return result.body === null ? res.text('', result.status, result.headers) : res.json(result.body, result.status, result.headers);
  } catch {
    error('tracking-ingest request failed');
    return res.json({ ok: false }, 500);
  }
};
