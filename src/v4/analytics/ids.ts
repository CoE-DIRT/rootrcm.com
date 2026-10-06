/**
 * Anonymous browser and session identifiers. Created only after analytics consent and removed when
 * consent is withdrawn. They are random UUIDs: no fingerprinting, no derivation from user data.
 */
const ANON_KEY = 'root-aid';
const SESSION_KEY = 'root-sid';

const memory: Record<string, string> = {};

export function newUuid(): string {
  const cryptoApi = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID();
  const bytes = new Uint8Array(16);
  if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') cryptoApi.getRandomValues(bytes);
  else for (let index = 0; index < 16; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function readOrCreate(store: 'local' | 'session', key: string): string {
  try {
    const storage = store === 'local' ? window.localStorage : window.sessionStorage;
    const existing = storage.getItem(key);
    if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
    const created = newUuid();
    storage.setItem(key, created);
    return created;
  } catch {
    // Storage blocked: keep a per-page-view identifier in memory only.
    return (memory[key] ||= newUuid());
  }
}

export const getAnonymousId = (): string => readOrCreate('local', ANON_KEY);
export const getSessionId = (): string => readOrCreate('session', SESSION_KEY);

function removeKeys(keys: string[]): void {
  for (const key of keys) {
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch {
      /* nothing to clear */
    }
  }
}

/** First-party analytics withdrawn: forget the identifiers that exist only for it (GA4 has its own cookies). */
export function clearFirstPartyIds(): void {
  delete memory[ANON_KEY];
  delete memory[SESSION_KEY];
  removeKeys([ANON_KEY, SESSION_KEY, 'root-utm']);
}

/** Every analytics sink withdrawn: forget the de-duplication markers as well. */
export function clearDedupeMarkers(): void {
  removeKeys(['root-analytics-seen']);
}

/** Forget every analytics identifier and marker (all analytics withdrawn). */
export function clearAnalyticsIds(): void {
  clearFirstPartyIds();
  clearDedupeMarkers();
}
