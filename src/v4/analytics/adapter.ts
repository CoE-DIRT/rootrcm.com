/**
 * Provider-agnostic analytics adapter. PostHog boots only when a project key exists
 * AND analytics consent is granted. Never capture PHI or raw form values.
 */

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
const queue: AnalyticsEvent[] = [];

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
      posthog.init(key, {
        api_host: getPostHogHost(),
        capture_pageview: true,
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
        disable_session_recording: false,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: 'input, textarea, select, [data-ph-mask], .ph-no-capture',
          blockSelector: '[data-ph-block], .ph-no-capture',
        },
        sanitize_properties(properties) {
          const next = { ...properties };
          delete next.email;
          delete next.phone;
          delete next.name;
          delete next.$set;
          delete next.$set_once;
          return next;
        },
      });
    },
    track({ name, properties }) {
      posthog.capture(name, properties);
    },
    shutdown() {
      posthog.opt_out_capturing();
      posthog.reset();
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
  activeAdapter = posthog ?? createNoopAdapter();
  await activeAdapter.init();
  while (queue.length) {
    const event = queue.shift();
    if (event) activeAdapter.track(event);
  }
}

export function trackAnalytics(event: AnalyticsEvent): void {
  if (!consented || !activeAdapter) {
    if (queue.length < 50) queue.push(event);
    return;
  }
  activeAdapter.track(event);
}

export function getActiveAnalyticsAdapterId(): string | null {
  return activeAdapter?.id ?? null;
}
