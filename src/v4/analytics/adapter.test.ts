import posthog from 'posthog-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The first test drives the real posthog-js (nothing is sent: the transport is stubbed), because the behaviour that matters is
// the library's own: reset() clears its stored consent, so the order of reset() and opt_out_capturing() decides whether a
// visitor who withdrew consent is still being captured. A mock would only repeat what the adapter assumes.
//
// posthog-js lives in node_modules, which vitest does not reload between tests, so its singleton keeps its state from one test
// to the next. The later tests start from that state on purpose (an instance that was opted out by the first one) and spy on
// the calls the adapter makes.

class QuietRequest {
  readyState = 0;
  status = 0;
  onreadystatechange: unknown = null;
  open() {}
  setRequestHeader() {}
  send() {}
  abort() {}
  addEventListener() {}
  removeEventListener() {}
}

/** A fresh copy of the adapter module (its consent and active-adapter state start empty); posthog-js itself is shared. */
async function loadAdapter() {
  vi.resetModules();
  return import('./adapter');
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', 'phc_synthetic_test_key');
  vi.stubEnv('VITE_PUBLIC_POSTHOG_HOST', 'https://ph.example.test');
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
  vi.stubGlobal('XMLHttpRequest', QuietRequest);
  window.history.pushState({}, '', '/pricing/');
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  window.history.pushState({}, '', '/');
});

const revoke = { analytics: false, marketing: false };
const grant = { analytics: true, marketing: false };

describe('PostHog adapter: consent lifecycle (real posthog-js)', () => {
  it('stays opted out once consent is withdrawn, and captures again only after the visitor accepts again', async () => {
    const adapter = await loadAdapter();

    adapter.setAnalyticsConsent(grant);
    await vi.waitFor(() => expect(adapter.getActiveAnalyticsAdapterId()).toBe('posthog'));
    expect(posthog.is_capturing()).toBe(true);

    adapter.setAnalyticsConsent(revoke);
    expect(adapter.getActiveAnalyticsAdapterId()).toBeNull();
    // posthog.reset() clears the stored consent: an opt-out recorded BEFORE it is wiped and the instance carries on capturing.
    expect(posthog.has_opted_out_capturing()).toBe(true);
    expect(posthog.is_capturing()).toBe(false);

    adapter.setAnalyticsConsent(grant);
    await vi.waitFor(() => expect(adapter.getActiveAnalyticsAdapterId()).toBe('posthog'));
    expect(posthog.has_opted_out_capturing()).toBe(false);
    expect(posthog.is_capturing()).toBe(true);

    adapter.setAnalyticsConsent(revoke);
    expect(posthog.is_capturing()).toBe(false);
  });
});

describe('PostHog adapter: call order', () => {
  it('resets before it opts out when consent is withdrawn', async () => {
    const adapter = await loadAdapter();
    vi.spyOn(posthog, 'init').mockImplementation(() => undefined as never);
    posthog.opt_in_capturing({ captureEventName: false });
    const calls: string[] = [];
    vi.spyOn(posthog, 'reset').mockImplementation(() => void calls.push('reset'));
    vi.spyOn(posthog, 'opt_out_capturing').mockImplementation(() => void calls.push('opt_out_capturing'));

    adapter.setAnalyticsConsent(grant);
    await vi.waitFor(() => expect(adapter.getActiveAnalyticsAdapterId()).toBe('posthog'));
    adapter.setAnalyticsConsent(revoke);
    expect(calls).toEqual(['reset', 'opt_out_capturing']);
  });

  it('lifts a remembered opt-out when the visitor accepts again, without an opt-in event of its own', async () => {
    const adapter = await loadAdapter();
    vi.spyOn(posthog, 'init').mockImplementation(() => undefined as never);
    posthog.opt_out_capturing();
    const optIn = vi.spyOn(posthog, 'opt_in_capturing');

    adapter.setAnalyticsConsent(grant);
    await vi.waitFor(() => expect(adapter.getActiveAnalyticsAdapterId()).toBe('posthog'));
    expect(optIn).toHaveBeenCalledTimes(1);
    expect(optIn).toHaveBeenCalledWith({ captureEventName: false });
    expect(posthog.is_capturing()).toBe(true);
    adapter.setAnalyticsConsent(revoke);
  });

  it('does not opt in a visitor who never opted out', async () => {
    const adapter = await loadAdapter();
    vi.spyOn(posthog, 'init').mockImplementation(() => undefined as never);
    posthog.opt_in_capturing({ captureEventName: false });
    const optIn = vi.spyOn(posthog, 'opt_in_capturing');

    adapter.setAnalyticsConsent(grant);
    await vi.waitFor(() => expect(adapter.getActiveAnalyticsAdapterId()).toBe('posthog'));
    expect(optIn).not.toHaveBeenCalled();
    adapter.setAnalyticsConsent(revoke);
  });

  it('does not start PostHog without a project key', async () => {
    vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', '');
    const init = vi.spyOn(posthog, 'init');
    const adapter = await loadAdapter();
    adapter.setAnalyticsConsent(grant);
    await vi.waitFor(() => expect(adapter.getActiveAnalyticsAdapterId()).toBe('noop'));
    expect(init).not.toHaveBeenCalled();
  });
});

describe('PostHog adapter: what it is started with', () => {
  type StartedConfig = Record<string, unknown> & { before_send: (capture: unknown) => { properties: Record<string, unknown> } };

  async function startedConfig(): Promise<StartedConfig> {
    const adapter = await loadAdapter();
    const init = vi.spyOn(posthog, 'init').mockImplementation(() => undefined as never);
    adapter.setAnalyticsConsent(grant);
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    adapter.setAnalyticsConsent(revoke);
    expect(init.mock.calls[0][0]).toBe('phc_synthetic_test_key');
    return init.mock.calls[0][1] as unknown as StartedConfig;
  }

  it('masks text and attributes, strips fragments and routes every event through the sanitiser', async () => {
    const config = await startedConfig();
    expect(config).toMatchObject({
      api_host: 'https://ph.example.test',
      mask_all_text: true,
      mask_all_element_attributes: true,
      disable_capture_url_hashes: true,
      disable_session_recording: false, // a registered page opened without a query string
    });
    expect(config.sanitize_properties).toBeUndefined();
    const sent = config.before_send({ uuid: '3f2504e0-4f89-41d3-9a0c-0305e82c3301', event: '$pageview', properties: { $current_url: `${window.location.origin}/pricing/?patient=jane-doe` } });
    expect(sent.properties.$current_url).toBe(`${window.location.origin}/pricing/`);
  });

  it('records no session and maps no heatmap for a page opened with a query string', async () => {
    window.history.pushState({}, '', '/pricing/?patient=jane-doe');
    const config = await startedConfig();
    expect(config).toMatchObject({ disable_session_recording: true, capture_heatmaps: false });
  });

  it('records no session and maps no heatmap for a path that is not one of the site\'s pages', async () => {
    window.history.pushState({}, '', '/patients/jane-doe/');
    const config = await startedConfig();
    expect(config).toMatchObject({ disable_session_recording: true, capture_heatmaps: false });
  });
});
