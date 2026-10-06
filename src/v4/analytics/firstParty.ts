import { getTrackingEndpoint } from './config';
import type { TrackingEvent } from './taxonomy';

/**
 * First-party transport to the Appwrite `tracking-ingest` Function. Batches events, never blocks the page,
 * flushes with sendBeacon/keepalive when the page is hidden, and retries a bounded number of times.
 * `text/plain` is used so cross-origin posts stay "simple" requests (no CORS preflight); the Function
 * parses the JSON body regardless of content type.
 */
const MAX_QUEUE = 50;
const MAX_BATCH = 20;
const FLUSH_DELAY_MS = 2_000;
const RETRY_DELAYS_MS = [1_000, 4_000];
const CONTENT_TYPE = 'text/plain;charset=UTF-8';

let queue: TrackingEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let listenersInstalled = false;
let inFlight = 0;

function endpoint(): string {
  return getTrackingEndpoint();
}

function schedule(delay: number): void {
  if (timer !== undefined) return;
  timer = setTimeout(() => {
    timer = undefined;
    flushFirstParty();
  }, delay);
}

async function post(batch: TrackingEvent[], attempt: number, beacon: boolean): Promise<void> {
  const url = endpoint();
  if (!url || !batch.length) return;
  const body = JSON.stringify({ events: batch });

  if (beacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      if (navigator.sendBeacon(url, new Blob([body], { type: CONTENT_TYPE }))) return;
    } catch {
      /* fall through to fetch */
    }
  }

  inFlight += 1;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': CONTENT_TYPE },
      body,
      keepalive: true,
      credentials: 'omit',
      mode: 'cors',
      cache: 'no-store',
    });
    // 2xx accepted; 4xx means the Function rejected the payload — retrying cannot help.
    if (response.ok || (response.status >= 400 && response.status < 500)) return;
    throw new Error(`transient ${response.status}`);
  } catch {
    if (attempt < RETRY_DELAYS_MS.length) {
      setTimeout(() => void post(batch, attempt + 1, false), RETRY_DELAYS_MS[attempt]);
    }
  } finally {
    inFlight -= 1;
  }
}

/** Send everything queued now (in batches). Safe to call at any time. */
export function flushFirstParty({ beacon = false }: { beacon?: boolean } = {}): void {
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
  while (queue.length) {
    const batch = queue.splice(0, MAX_BATCH);
    void post(batch, 0, beacon);
  }
}

export function enqueueFirstParty(event: TrackingEvent, { immediate = false }: { immediate?: boolean } = {}): void {
  if (!endpoint()) return;
  if (queue.length >= MAX_QUEUE) queue.shift();
  queue.push(event);
  installFlushListeners();
  if (immediate || queue.length >= MAX_BATCH) flushFirstParty();
  else schedule(FLUSH_DELAY_MS);
}

/** Drop anything not yet sent (consent withdrawn). */
export function clearFirstPartyQueue(): void {
  queue = [];
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
}

function installFlushListeners(): void {
  if (listenersInstalled || typeof document === 'undefined') return;
  listenersInstalled = true;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushFirstParty({ beacon: true });
  });
  window.addEventListener('pagehide', () => flushFirstParty({ beacon: true }));
}

export const queuedFirstPartyCount = (): number => queue.length;
export const inFlightFirstPartyCount = (): number => inFlight;

/** Test helper. */
export function resetFirstPartyForTests(): void {
  clearFirstPartyQueue();
  inFlight = 0;
  listenersInstalled = false;
}
