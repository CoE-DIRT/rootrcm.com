import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TrackingEvent } from '../analytics/taxonomy';

// Drives the REAL Klaro (not a mock) through the banner and the preferences dialog. A mocked Klaro once hid a defect:
// the bundled Klaro exposes no `window.klaro` and calls `watcher.update(...)`, so a first-time visitor's "Accept all"
// was never noticed by analytics. These tests keep that bridge honest.

const ENDPOINT = 'https://tracking.example.test/ingest';
let fetchMock: ReturnType<typeof vi.fn>;

const sentEvents = (): TrackingEvent[] =>
  (fetchMock.mock.calls as [string, RequestInit][]).flatMap(([, init]) => JSON.parse(init.body as string).events as TrackingEvent[]);

function wipe() {
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0];
    if (name) document.cookie = `${name}=; Max-Age=0; path=/`;
  });
  document.body.innerHTML = '';
  document.head.querySelectorAll('link[rel="stylesheet"]').forEach((node) => node.remove());
}

async function load() {
  vi.resetModules(); // the Klaro services are chosen at import time from the stubbed environment
  const [{ CookieConsent }, { AnalyticsBoot }, firstParty] = await Promise.all([
    import('./CookieConsent'),
    import('../analytics/AnalyticsBoot'),
    import('../analytics/firstParty'),
  ]);
  render(
    <>
      <CookieConsent />
      <AnalyticsBoot />
    </>,
  );
  return firstParty;
}

beforeEach(() => {
  wipe();
  vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
  fetchMock = vi.fn(async () => new Response('{}', { status: 202 }));
  vi.stubGlobal('fetch', fetchMock);
  window.history.pushState({}, '', '/pricing/');
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  wipe();
  window.history.pushState({}, '', '/');
});

describe('analytics follows the real cookie banner', () => {
  it('records nothing before a choice and creates no identifiers', async () => {
    const firstParty = await load();
    await screen.findByRole('button', { name: 'Accept all' });
    firstParty.flushFirstParty();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
  });

  it('starts counting the current page as soon as a first-time visitor accepts', async () => {
    const firstParty = await load();
    fireEvent.click(await screen.findByRole('button', { name: 'Accept all' }));
    await waitFor(() => expect(window.localStorage.getItem('root-aid')).not.toBeNull());
    act(() => firstParty.flushFirstParty());
    await waitFor(() => expect(sentEvents().filter((event) => event.event_name === 'page_view')).toHaveLength(1));
    expect(sentEvents()[0]).toMatchObject({ page_path: '/pricing/', consent: true });
    expect(decodeURIComponent(document.cookie)).toContain('"root-first-party-analytics":true');
  });

  it('records nothing and stores no identifier when the visitor rejects non-essential cookies', async () => {
    const firstParty = await load();
    fireEvent.click(await screen.findByRole('button', { name: 'Reject non-essential' }));
    await waitFor(() => expect(decodeURIComponent(document.cookie)).toContain('"root-first-party-analytics":false'));
    act(() => firstParty.flushFirstParty());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
  });

  it('stops and forgets the visitor when analytics is switched off in the preferences dialog', async () => {
    const firstParty = await load();
    fireEvent.click(await screen.findByRole('button', { name: 'Accept all' }));
    await waitFor(() => expect(window.localStorage.getItem('root-aid')).not.toBeNull());

    act(() => void window.dispatchEvent(new CustomEvent('root:open-cookie-settings')));
    const analytics = await waitFor(() => {
      const box = document.querySelector<HTMLInputElement>('#purpose-item-analytics');
      expect(box).not.toBeNull();
      return box as HTMLInputElement;
    });
    fireEvent.click(analytics);
    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }));

    await waitFor(() => expect(window.localStorage.getItem('root-aid')).toBeNull());
    expect(window.sessionStorage.getItem('root-sid')).toBeNull();
    expect(decodeURIComponent(document.cookie)).toContain('"root-first-party-analytics":false');
    fetchMock.mockClear();
    act(() => firstParty.flushFirstParty());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('recognises a returning visitor from the saved cookie without any click', async () => {
    document.cookie = `root_consent=${encodeURIComponent(JSON.stringify({ 'root-session': true, 'root-first-party-analytics': true }))}; path=/`;
    const firstParty = await load();
    await waitFor(() => expect(window.localStorage.getItem('root-aid')).not.toBeNull());
    act(() => firstParty.flushFirstParty());
    await waitFor(() => expect(sentEvents().filter((event) => event.event_name === 'page_view')).toHaveLength(1));
  });
});

describe('a saved choice that predates a newly configured service', () => {
  // Klaro asks again when the saved choice does not cover every configured service. Analytics must not keep acting on the
  // old "yes" while the banner is asking, and must pick the new answer up as soon as the visitor gives it.
  const olderChoice = () =>
    (document.cookie = `root_consent=${encodeURIComponent(JSON.stringify({ 'root-session': true, 'root-first-party-analytics': true }))}; path=/`);

  beforeEach(() => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST12345');
    vi.stubEnv('VITE_GA_NON_PRODUCTION', 'true'); // this service is configured only so the cookie below is stale
  });

  it('stays silent while the banner is asking again, then starts once the visitor answers', async () => {
    olderChoice();
    const firstParty = await load();
    await screen.findByRole('button', { name: 'Accept all' }); // Klaro is asking again
    act(() => firstParty.flushFirstParty());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Accept all' }));
    await waitFor(() => expect(window.localStorage.getItem('root-aid')).not.toBeNull());
    act(() => firstParty.flushFirstParty());
    await waitFor(() => expect(sentEvents().filter((event) => event.event_name === 'page_view')).toHaveLength(1));
    expect(decodeURIComponent(document.cookie)).toContain('"google-analytics":true');
  });

  it('records nothing when the visitor declines the new question, even though they once said yes', async () => {
    olderChoice();
    const firstParty = await load();
    fireEvent.click(await screen.findByRole('button', { name: 'Reject non-essential' }));
    await waitFor(() => expect(decodeURIComponent(document.cookie)).toContain('"root-first-party-analytics":false'));
    act(() => firstParty.flushFirstParty());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
  });
});
