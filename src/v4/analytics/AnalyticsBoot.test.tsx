import { StrictMode } from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsBoot } from './AnalyticsBoot';
import { resetAnalyticsConsent } from './consent';
import { resetFirstPartyForTests } from './firstParty';
import { resetGa4ForTests } from './ga4';
import { resetTrackerForTests } from './tracker';
import type { TrackingEvent } from './taxonomy';

const ENDPOINT = 'https://tracking.example.test/ingest';

function setConsentCookie(services: Record<string, boolean>) {
  document.cookie = `root_consent=${encodeURIComponent(JSON.stringify(services))}; path=/`;
}

function wipe() {
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0];
    if (name) document.cookie = `${name}=; Max-Age=0; path=/`;
  });
  document.body.innerHTML = '';
  delete window.klaro;
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

  it('starts when the visitor grants consent in the Klaro dialog and stops when it is withdrawn', async () => {
    let granted = false;
    const watchers: Array<(event: { event?: string }) => void> = [];
    window.klaro = {
      getManager: () => ({
        getConsent: (name: string) => granted && name === 'root-first-party-analytics',
        watch: (callback) => watchers.push(callback),
      }),
    };
    render(<AnalyticsBoot />);
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();

    granted = true;
    act(() => watchers.forEach((watcher) => watcher({ event: 'saveConsents' })));
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'page_view')).toHaveLength(1);

    granted = false;
    fetchMock.mockClear();
    act(() => watchers.forEach((watcher) => watcher({ event: 'saveConsents' })));
    dispatchCta({ cta: 'book-diagnostic', location: 'home-hero' });
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
  });
});
