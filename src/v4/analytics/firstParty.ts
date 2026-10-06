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
/** The longest `Retry-After` that is waited out. A server asking for more than this is not retried at all this page view. */
const MAX_RETRY_AFTER_MS = 30_000;
/** 4xx answers that mean "later", not "this payload is wrong": request timeout and too many requests. */
const RETRYABLE_CLIENT_STATUSES: ReadonlySet<number> = new Set([408, 429]);
const CONTENT_TYPE = 'text/plain;charset=UTF-8';

let queue: TrackingEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let listenersInstalled = false;
let inFlight = 0;
// Withdrawing consent bumps the generation, cancels pending retries and aborts requests still in flight, so nothing
// that was queued before the withdrawal can be sent after it.
let generation = 0;
const retryTimers = new Set<ReturnType<typeof setTimeout>>();
const controllers = new Set<AbortController>();

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

/**
 * How long the server asked to wait, from a `Retry-After` header in seconds or as an HTTP date. `undefined` when there is
 * none (a cross-origin response only exposes the header when the server lists it in Access-Control-Expose-Headers, and a
 * proxy in front of the Function may not), in which case the normal backoff applies.
 */
function retryAfterMs(response: Response): number | undefined {
  const header = response.headers.get('retry-after')?.trim();
  if (!header) return undefined;
  if (/^\d+$/.test(header)) return Number(header) * 1_000;
  const date = Date.parse(header);
  return Number.isFinite(date) ? Math.max(date - Date.now(), 0) : undefined;
}

async function post(batch: TrackingEvent[], attempt: number, beacon: boolean, owner: number): Promise<void> {
  const url = endpoint();
  if (!url || !batch.length || owner !== generation) return;
  const body = JSON.stringify({ events: batch });

  if (beacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      if (navigator.sendBeacon(url, new Blob([body], { type: CONTENT_TYPE }))) return;
    } catch {
      /* fall through to fetch */
    }
  }

  const controller = new AbortController();
  controllers.add(controller);
  inFlight += 1;
  let requestedDelay: number | undefined;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': CONTENT_TYPE },
      body,
      keepalive: true,
      credentials: 'omit',
      mode: 'cors',
      signal: controller.signal,
    });
    // 2xx accepted. Another 4xx means the Function rejected the payload, and retrying cannot help; 408 and 429 are
    // transient like a 5xx and take the bounded retry path below.
    if (response.ok) return;
    if (response.status >= 400 && response.status < 500 && !RETRYABLE_CLIENT_STATUSES.has(response.status)) return;
    requestedDelay = retryAfterMs(response);
    throw new Error(`transient ${response.status}`);
  } catch {
    // A server that asks for a longer pause than we are willing to hold the batch for is not asked again this page view.
    const tooLong = requestedDelay !== undefined && requestedDelay > MAX_RETRY_AFTER_MS;
    if (owner === generation && attempt < RETRY_DELAYS_MS.length && !tooLong) {
      const retry = setTimeout(() => {
        retryTimers.delete(retry);
        void post(batch, attempt + 1, false, owner);
      }, Math.max(RETRY_DELAYS_MS[attempt], requestedDelay ?? 0));
      retryTimers.add(retry);
    }
  } finally {
    controllers.delete(controller);
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
    void post(batch, 0, beacon, generation);
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

/** Consent withdrawn: drop the queue, cancel every pending retry and abort requests still in flight. */
export function clearFirstPartyQueue(): void {
  queue = [];
  generation += 1;
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
  retryTimers.forEach((retry) => clearTimeout(retry));
  retryTimers.clear();
  controllers.forEach((controller) => controller.abort());
  controllers.clear();
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
