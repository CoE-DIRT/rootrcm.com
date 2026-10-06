import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyAnalyticsConsent, resetAnalyticsConsent } from '../analytics/consent';
import { resetFirstPartyForTests } from '../analytics/firstParty';
import { resetGa4ForTests } from '../analytics/ga4';
import { resetTrackerForTests } from '../analytics/tracker';
import { EXPERIMENT_STORAGE_KEY, experimentsEnabled, resetExperimentsForTests, resolveExperiment, setExperimentRandomForTests } from './engine';
import { useExperiment } from './useExperiment';

// This file simulates the production site: the environment resolves to "production" whatever the host.
vi.mock('../analytics/config', async (importOriginal) => {
  const original = await importOriginal<typeof import('../analytics/config')>();
  return { ...original, getSiteEnv: () => 'production' as const, isProductionEnv: () => true };
});

let fetchMock: ReturnType<typeof vi.fn>;

function Probe() {
  const state = useExperiment('headerCta');
  return <span data-testid="probe">{state.variant}</span>;
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  resetAnalyticsConsent();
  resetTrackerForTests();
  resetFirstPartyForTests();
  resetGa4ForTests();
  resetExperimentsForTests();
  vi.useFakeTimers();
  vi.stubEnv('VITE_TRACKING_ENDPOINT', 'https://tracking.example.test/ingest');
  fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('{}', { status: 202 }));
  vi.stubGlobal('fetch', fetchMock);
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  window.history.pushState({}, '', '/');
});

describe('experiments in production', () => {
  it('are disabled by default: consenting visitors see the control, nothing is stored, no exposure is sent', async () => {
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    setExperimentRandomForTests(() => 0.9);
    expect(experimentsEnabled()).toBe(false);

    render(<Probe />);
    expect(screen.getByTestId('probe').textContent).toBe('control');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_200);
    });
    expect(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('ignore QA override links, so a crafted URL cannot change the live page', () => {
    window.history.pushState({}, '', '/?exp_headerCta=explore');
    expect(resolveExperiment('headerCta')).toMatchObject({ variant: 'control', source: 'off' });
  });

  it('run only after an explicit build-time opt-in, and still only for consenting visitors', () => {
    vi.stubEnv('VITE_EXPERIMENTS_ENABLED', 'true');
    setExperimentRandomForTests(() => 0.9);
    expect(experimentsEnabled()).toBe(true);
    expect(resolveExperiment('headerCta')).toMatchObject({ variant: 'control', source: 'off' }); // no consent yet

    resetExperimentsForTests();
    setExperimentRandomForTests(() => 0.9);
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    expect(resolveExperiment('headerCta')).toMatchObject({ variant: 'explore', source: 'assigned' });
  });
});
