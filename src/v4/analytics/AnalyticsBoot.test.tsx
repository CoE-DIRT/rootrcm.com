import { StrictMode } from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsBoot } from './AnalyticsBoot';
import { hasAnalyticsConsent, setAnalyticsConsent } from './adapter';
import { resetAnalyticsConsent } from './consent';
import { resetFirstPartyForTests } from './firstParty';
import { resetGa4ForTests } from './ga4';
import { resetTrackerForTests } from './tracker';
import type { TrackingEvent } from './taxonomy';

const ENDPOINT = 'https://tracking.example.test/ingest';

// Klaro writes an answer for EVERY configured service (the required session service is always true), and analytics only
// honours a saved choice that is complete in that sense.
function setConsentCookie(services: Record<string, boolean>) {
  document.cookie = `root_consent=${encodeURIComponent(JSON.stringify({ 'root-session': true, 'root-first-party-analytics': false, ...services }))}; path=/`;
}

function wipe() {
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0];
    if (name) document.cookie = `${name}=; Max-Age=0; path=/`;
  });
  document.body.innerHTML = '';
  delete window.dataLayer;
  delete window.gtag;
}

let fetchMock: ReturnType<typeof vi.fn>;

const sentEvents = (): TrackingEvent[] =>
  fetchMock.mock.calls.flatMap((call) => JSON.parse((call[1] as RequestInit).body as string).events as TrackingEvent[]);

const flush = () => act(async () => {
  await vi.advanceTimersByTimeAsync(2_200);
});

beforeEach(() => {
  wipe();
  resetAnalyticsConsent();
  resetTrackerForTests();
  resetFirstPartyForTests();
  resetGa4ForTests();
  vi.useFakeTimers();
  vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
  fetchMock = vi.fn(async () => new Response('{}', { status: 202 }));
  vi.stubGlobal('fetch', fetchMock);
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const dispatchCta = (detail: Record<string, unknown>) => window.dispatchEvent(new CustomEvent('root:cta', { detail }));

describe('AnalyticsBoot (visitor has consented to first-party analytics)', () => {
  beforeEach(() => setConsentCookie({ 'root-first-party-analytics': true }));

  it('records exactly one page view per page load, even under React StrictMode double mounting', async () => {
    window.history.pushState({}, '', '/pricing/');
    render(
      <StrictMode>
        <AnalyticsBoot />
      </StrictMode>,
    );
    await flush();
    const pageViews = sentEvents().filter((event) => event.event_name === 'page_view');
    expect(pageViews).toHaveLength(1);
    expect(pageViews[0].page_path).toBe('/pricing/');
  });

  it('turns approved CTA clicks into cta_click and ignores unapproved or chrome-only CTAs', async () => {
    render(<AnalyticsBoot />);
    dispatchCta({ cta: 'book-diagnostic', location: 'home-hero', destination: '/diagnostic/', engagementType: 'diagnostic' });
    dispatchCta({ cta: 'logo', location: 'header' });
    dispatchCta({ cta: 'some-new-unreviewed-cta', location: 'hero' });
    dispatchCta({ cta: 'youtube-coming-soon' });
    await flush();
    const clicks = sentEvents().filter((event) => event.event_name === 'cta_click');
    expect(clicks).toHaveLength(1);
    expect(clicks[0]).toMatchObject({
      target_key: 'book-diagnostic.home-hero',
      properties: { cta_id: 'book-diagnostic', cta_location: 'home-hero', destination: '/diagnostic/', engagement_type: 'diagnostic' },
    });
  });

  it('carries the experiment context of the clicked element and never a contact value', async () => {
    render(<AnalyticsBoot />);
    dispatchCta({ cta: 'book-diagnostic', location: 'header', experiment: 'exp-header-cta-v1', experiment_variant: 'b' });
    await flush();
    const [click] = sentEvents().filter((event) => event.event_name === 'cta_click');
    expect(click.properties).toMatchObject({ experiment_id: 'exp-header-cta-v1', variant: 'b' });
  });

  it('reports phone clicks without the number — from CTA events and from bare tel: links', async () => {
    render(
      <>
        <AnalyticsBoot />
        <a id="bare" href="tel:+13025064685" data-location="contact-card">
          Call
        </a>
        <a id="tracked" href="tel:+13025064685" data-cta="phone-call" data-location="footer-contact">
          Call
        </a>
      </>,
    );
    dispatchCta({ cta: 'phone-call', location: 'footer-contact', engagementType: 'phone', destination: 'tel:+13025064685' });
    document.getElementById('bare')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    // A tel link that already carries data-cta is reported through root:cta only (no double count from the click listener).
    document.getElementById('tracked')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await flush();
    const phones = sentEvents().filter((event) => event.event_name === 'phone_click');
    expect(phones).toHaveLength(2);
    expect(sentEvents().some((event) => event.event_name === 'cta_click')).toBe(false);
    expect(JSON.stringify(sentEvents())).not.toMatch(/3025064685|tel:/);
  });

  it('reports form results by form id only — never field values', async () => {
    render(
      <>
        <AnalyticsBoot />
        <form id="f" data-form-id="contact-inquiry">
          <input name="email" defaultValue="alex@example.com" />
        </form>
      </>,
    );
    const form = document.getElementById('f')!;
    form.dispatchEvent(new CustomEvent('root:form-success'));
    form.dispatchEvent(new CustomEvent('root:form-failure'));
    // A form without an id is not reportable.
    const anonymous = document.createElement('form');
    document.body.appendChild(anonymous);
    anonymous.dispatchEvent(new CustomEvent('root:form-success'));
    await flush();
    const submits = sentEvents().filter((event) => event.event_name === 'form_submit');
    expect(submits.map((event) => event.properties)).toEqual([
      { form_id: 'contact-inquiry', status: 'success' },
      { form_id: 'contact-inquiry', status: 'failure' },
    ]);
    expect(JSON.stringify(submits)).not.toContain('alex@example.com');
  });

  it('records each scroll milestone once per page and nothing on short pages', async () => {
    render(<AnalyticsBoot />);
    const setViewport = (scrollHeight: number, scrollY: number) => {
      Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: scrollHeight });
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
      Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY });
    };
    const scroll = async () => {
      window.dispatchEvent(new Event('scroll'));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(40);
      });
    };

    setViewport(900, 50); // 100px of scroll room: too short to measure
    await scroll();
    setViewport(4000, 0);
    await scroll();
    expect(sentEvents().filter((event) => event.event_name === 'scroll')).toHaveLength(0);

    setViewport(4000, 1200); // (1200+800)/4000 = 50%
    await scroll();
    setViewport(4000, 1200);
    await scroll(); // same position again: no duplicates
    setViewport(4000, 3200); // 100%
    await scroll();
    await flush();
    const milestones = sentEvents()
      .filter((event) => event.event_name === 'scroll')
      .map((event) => event.properties.percent_scrolled);
    expect(milestones).toEqual([25, 50, 75, 90]);
  });
});

describe('AnalyticsBoot (no consent)', () => {
  it('captures nothing and creates no identifiers', async () => {
    render(<AnalyticsBoot />);
    dispatchCta({ cta: 'book-diagnostic', location: 'home-hero' });
    window.dispatchEvent(new Event('scroll'));
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
  });

  // Klaro saves the visitor's choice to the root_consent cookie and then notifies watchers; CookieConsent turns that
  // notification into the root:consent-change event. (consent-integration.test.tsx drives the real Klaro.)
  const announce = () => act(() => void window.dispatchEvent(new CustomEvent('root:consent-change')));

  it('starts when a saved choice is announced and stops when it is withdrawn', async () => {
    render(<AnalyticsBoot />);
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();

    setConsentCookie({ 'root-first-party-analytics': true });
    announce();
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'page_view')).toHaveLength(1);

    setConsentCookie({ 'root-first-party-analytics': false });
    fetchMock.mockClear();
    announce();
    dispatchCta({ cta: 'book-diagnostic', location: 'home-hero' });
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
  });

  it('ignores a cookie that is malformed or not an object', async () => {
    for (const raw of ['not json', '[]', 'null', '"x"']) {
      document.cookie = `root_consent=${encodeURIComponent(raw)}; path=/`;
      render(<AnalyticsBoot />);
      announce();
      await flush();
      cleanup();
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not treat the withdrawal of an unrelated service as a withdrawal of analytics', async () => {
    setConsentCookie({ 'root-first-party-analytics': true, 'root-analytics': false });
    render(<AnalyticsBoot />);
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'page_view')).toHaveLength(1);
  });
});

describe('AnalyticsBoot (PostHog consent)', () => {
  afterEach(() => {
    setAnalyticsConsent({ analytics: false, marketing: false });
    Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, value: undefined });
  });

  it('grants the PostHog service only for an explicit root-analytics choice', async () => {
    setConsentCookie({ 'root-analytics': true });
    render(<AnalyticsBoot />);
    await flush();
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it('refuses the PostHog service under Global Privacy Control even though the visitor ticked it', async () => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, value: true });
    setConsentCookie({ 'root-analytics': true, 'root-first-party-analytics': true });
    render(<AnalyticsBoot />);
    await flush();
    expect(hasAnalyticsConsent()).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled(); // first-party analytics is refused by the same signal
  });
});
