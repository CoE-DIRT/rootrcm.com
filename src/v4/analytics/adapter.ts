/**
 * Provider-agnostic analytics adapter. PostHog boots only when a project key exists
 * AND the visitor has accepted the PostHog service. Never capture PHI or raw form values; what PostHog may collect is bounded by
 * `posthogPrivacy.ts`.
 */
import { buildPostHogConfig } from './posthogPrivacy';

export type AnalyticsCapability =
  | 'pageview'
  | 'event'
  | 'heatmap'
  | 'clickmap'
  | 'scrollmap'
  | 'session_replay'
  | 'funnel';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
}

export interface AnalyticsAdapter {
  id: string;
  capabilities: AnalyticsCapability[];
  init: () => void | Promise<void>;
  track: (event: AnalyticsEvent) => void;
  identify?: (anonymousId: string) => void;
  shutdown?: () => void;
}

type ConsentSnapshot = {
  analytics: boolean;
  marketing: boolean;
};

let activeAdapter: AnalyticsAdapter | null = null;
let consented = false;

export function getPostHogKey(): string {
  return (import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined)?.trim() || '';
}

export function getPostHogHost(): string {
  return (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined)?.trim() || 'https://us.i.posthog.com';
}

/** Consent gate — call from Klaro watcher / AnalyticsBoot. */
export function setAnalyticsConsent(snapshot: ConsentSnapshot): void {
  const next = Boolean(snapshot.analytics);
  if (next === consented) return;
  consented = next;
  if (!consented) {
    activeAdapter?.shutdown?.();
    activeAdapter = null;
    return;
  }
  void bootAnalytics();
}

export function hasAnalyticsConsent(): boolean {
  return consented;
}

async function createPostHogAdapter(): Promise<AnalyticsAdapter | null> {
  const key = getPostHogKey();
  if (!key) return null;

  const { default: posthog } = await import('posthog-js');
  return {
    id: 'posthog',
    capabilities: ['pageview', 'event', 'heatmap', 'clickmap', 'scrollmap', 'session_replay', 'funnel'],
    init() {
      posthog.init(key, buildPostHogConfig({ host: getPostHogHost(), pageUrl: window.location.href }));
      // After a withdrawal the shared PostHog instance is still loaded (init() on it is a no-op) and still opted out, and its
      // opt-out is remembered across page loads. The visitor has accepted the service again, so lift it explicitly. A fresh
      // visitor has no opt-out and sends no opt-in event of its own.
      if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing({ captureEventName: false });
    },
    track({ name, properties }) {
      posthog.capture(name, properties);
    },
    shutdown() {
      // reset() clears PostHog's stored consent together with the visitor's identity, so it must come first: an opt-out
      // recorded before it is wiped, and capturing would carry on for the instance that is still running.
      posthog.reset();
      posthog.opt_out_capturing();
    },
  };
}

function createNoopAdapter(): AnalyticsAdapter {
  return {
    id: 'noop',
    capabilities: ['pageview', 'event'],
    init() {},
    track() {},
  };
}

export async function bootAnalytics(): Promise<void> {
  if (!consented) return;
  if (activeAdapter) return;

  const posthog = await createPostHogAdapter();
  if (!consented) return;
  activeAdapter = posthog ?? createNoopAdapter();
  await activeAdapter.init();
}

export function trackAnalytics(event: AnalyticsEvent): void {
  if (!consented || !activeAdapter) return;
  activeAdapter.track(event);
}

export function getActiveAnalyticsAdapterId(): string | null {
  return activeAdapter?.id ?? null;
}
