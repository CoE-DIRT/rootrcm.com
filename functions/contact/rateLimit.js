const WINDOW_MS = 15 * 60 * 1000;
const TABLE_PATH = '/tablesdb/web_security/tables/lead_rate_limits/rows';
function connection(env) {
  const endpoint = new URL(env.APPWRITE_FUNCTION_API_ENDPOINT);
  if (endpoint.protocol !== 'https:' || !env.APPWRITE_FUNCTION_PROJECT_ID || !env.CONTACT_RUNTIME_API_KEY) throw new Error('Rate service unavailable');
  return { url: endpoint.href.replace(/\/$/, '') + TABLE_PATH, headers: {
    'content-type': 'application/json', 'x-appwrite-project': env.APPWRITE_FUNCTION_PROJECT_ID,
    'x-appwrite-key': env.CONTACT_RUNTIME_API_KEY,
  } };
}
export async function consumeEmailSlot(email, env, now = Date.now(), request = fetch) {
  const { url, headers } = connection(env);
  if (!env.CONTACT_RELAY_SECRET || env.CONTACT_RELAY_SECRET.length < 32) throw new Error('Rate service unavailable');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(env.CONTACT_RELAY_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode('contact-rate-v1:' + Math.floor(now / WINDOW_MS) + ':' + email.trim().toLowerCase()));
  const id = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  // Unique row creation is atomic across instances; no read/increment race.
  for (let slot = 0; slot < 3; slot++) {
    const response = await request(url, { method: 'POST', headers, redirect: 'error',
      signal: AbortSignal.timeout(4000), body: JSON.stringify({ rowId: id + '-' + slot, data: {}, permissions: [] }) });
    if (response.ok) return true;
    if (response.status !== 409) throw new Error('Rate service unavailable');
  }
  return false;
}
// Scheduled hourly. Only opaque counters older than 24 hours are removed.
export async function purgeExpiredCounters(env, now = Date.now(), request = fetch) {
  const { url, headers } = connection(env);
  const query = new URLSearchParams();
  query.append('queries[]', JSON.stringify({ method: 'lessThan', attribute: '$createdAt', values: [new Date(now - 86400000).toISOString()] }));
  query.append('queries[]', JSON.stringify({ method: 'limit', values: [100] }));
  for (let batch = 0; batch < 5; batch++) {
    const response = await request(url + '?' + query, { headers, signal: AbortSignal.timeout(4000), redirect: 'error' });
    if (!response.ok) throw new Error('Counter cleanup unavailable');
    const { rows } = await response.json();
    for (const row of rows) {
      const deletion = await request(url + '/' + encodeURIComponent(row.$id), { method: 'DELETE', headers, signal: AbortSignal.timeout(4000), redirect: 'error' });
      if (!deletion.ok && deletion.status !== 404) throw new Error('Counter cleanup unavailable');
    }
    if (rows.length < 100) return;
  }
}
