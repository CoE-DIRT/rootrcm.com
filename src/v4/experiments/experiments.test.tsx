import { StrictMode } from 'react';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App.jsx';
import { applyAnalyticsConsent, resetAnalyticsConsent } from '../analytics/consent';
import { resetFirstPartyForTests } from '../analytics/firstParty';
import { resetGa4ForTests } from '../analytics/ga4';
import { sanitizeText } from '../analytics/sanitize';
import { resetTrackerForTests } from '../analytics/tracker';
import type { TrackingEvent } from '../analytics/taxonomy';
import { pricingModels } from '../../siteData.js';
import {
  EXPERIMENT_STORAGE_KEY,
  experimentsEnabled,
  getExperimentContext,
  pickVariant,
  resetExperimentsForTests,
  resolveExperiment,
  resolveExperimentsEnabled,
  setExperimentRandomForTests,
} from './engine';
import { EXPERIMENT_KEYS, EXPERIMENTS, experimentList } from './registry';
import { useExperiment } from './useExperiment';

const ENDPOINT = 'https://tracking.example.test/ingest';

let fetchMock: ReturnType<typeof vi.fn>;

const sentEvents = (): TrackingEvent[] =>
  fetchMock.mock.calls.flatMap((call) => JSON.parse((call[1] as RequestInit).body as string).events as TrackingEvent[]);

const flush = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(2_200);
  });

function wipe() {
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0];
    if (name) document.cookie = `${name}=; Max-Age=0; path=/`;
  });
}

beforeEach(() => {
  wipe();
  resetAnalyticsConsent();
  resetTrackerForTests();
  resetFirstPartyForTests();
  resetGa4ForTests();
  resetExperimentsForTests();
  vi.useFakeTimers();
  vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
  fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('{}', { status: 202 }));
  vi.stubGlobal('fetch', fetchMock);
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  window.history.pushState({}, '', '/');
});

const consent = () => applyAnalyticsConsent({ firstParty: true, ga4: false });

function Probe({ experiment }: { experiment: (typeof EXPERIMENT_KEYS)[number] }) {
  const state = useExperiment(experiment);
  return (
    <span data-testid="probe" {...state.attrs}>
      {state.variant}|{state.label ?? '-'}
    </span>
  );
}

describe('experiment registry', () => {
  it('defines the six required tests, each with a written decision rule', () => {
    expect(EXPERIMENT_KEYS).toEqual(['heroCta', 'headerCta', 'pricingPresentation', 'talkToUsPlacement', 'followUsDesign', 'checkoutCta']);
    for (const definition of experimentList) {
      expect(definition.hypothesis.length, definition.id).toBeGreaterThan(40);
      expect(definition.primaryMetric.length, definition.id).toBeGreaterThan(20);
      expect(definition.guardrails.length, definition.id).toBeGreaterThanOrEqual(1);
      expect(definition.stopRules.length, definition.id).toBeGreaterThanOrEqual(3);
      expect(definition.stopRules.join(' ')).toMatch(/inconclusive/);
    }
  });

  it('uses unique, sanitiser-safe ids and a control as the first variant', () => {
    const ids = new Set<string>();
    for (const definition of experimentList) {
      expect(ids.has(definition.id)).toBe(false);
      ids.add(definition.id);
      expect(sanitizeText(definition.id, 64), definition.id).toBe(definition.id);
      expect(definition.variants[0].id).toBe('control');
      expect(definition.variants[0].label, 'the control keeps the page copy').toBeUndefined();
      expect(definition.variants.length).toBeGreaterThanOrEqual(2);
      const variantIds = definition.variants.map((variant) => variant.id);
      expect(new Set(variantIds).size).toBe(variantIds.length);
      for (const variant of definition.variants) {
        expect(sanitizeText(variant.id, 32), `${definition.id}:${variant.id}`).toBe(variant.id);
        expect(variant.weight).toBeGreaterThan(0);
      }
    }
  });

  it('never changes the published price: labels may name $2,500 and no other amount', () => {
    for (const definition of experimentList) {
      for (const variant of definition.variants) {
        const amounts = (variant.label ?? '').match(/\$[\d,]+/g) ?? [];
        for (const amount of amounts) expect(amount).toBe('$2,500');
      }
    }
  });

  it('keeps the inquiry context within the contact Function limit even if every test is assigned', () => {
    const ids = experimentList.map((definition) => definition.id).join(',');
    const variants = experimentList.map((definition) => definition.variants[definition.variants.length - 1].id).join(',');
    expect(ids.length).toBeLessThanOrEqual(200);
    expect(variants.length).toBeLessThanOrEqual(200);
  });
});

describe('experiment rules', () => {
  it('are off in production unless explicitly enabled, and on elsewhere unless explicitly disabled', () => {
    expect(resolveExperimentsEnabled({ siteEnv: 'production', flag: '' })).toBe(false);
    expect(resolveExperimentsEnabled({ siteEnv: 'production', flag: 'false' })).toBe(false);
    expect(resolveExperimentsEnabled({ siteEnv: 'production', flag: 'true' })).toBe(true);
    expect(resolveExperimentsEnabled({ siteEnv: 'production', flag: ' TRUE ' })).toBe(true);
    expect(resolveExperimentsEnabled({ siteEnv: 'preview', flag: '' })).toBe(true);
    expect(resolveExperimentsEnabled({ siteEnv: 'development', flag: '' })).toBe(true);
    expect(resolveExperimentsEnabled({ siteEnv: 'preview', flag: 'false' })).toBe(false);
  });

  it('is wired to the build flag', () => {
    expect(experimentsEnabled()).toBe(true); // jsdom runs as "development"
    vi.stubEnv('VITE_EXPERIMENTS_ENABLED', 'false');
    expect(experimentsEnabled()).toBe(false);
  });

  it('chooses variants by weight', () => {
    const definition = EXPERIMENTS.heroCta;
    expect(pickVariant(definition, 0)).toBe('control');
    expect(pickVariant(definition, 0.49)).toBe('control');
    expect(pickVariant(definition, 0.5)).toBe('fixed-fee');
    expect(pickVariant(definition, 0.999)).toBe('fixed-fee');
  });
});

describe('experiment resolution', () => {
  it('shows the control and stores nothing before the visitor consents', () => {
    expect(resolveExperiment('heroCta')).toMatchObject({ variant: 'control', source: 'off' });
    expect(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY)).toBeNull();
  });

  it('shows the control when there is nowhere to send measurements', () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', '');
    consent();
    expect(resolveExperiment('heroCta')).toMatchObject({ variant: 'control', source: 'off' });
    expect(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY)).toBeNull();
  });

  it('assigns once after consent, keeps the assignment, and survives a reload', () => {
    consent();
    setExperimentRandomForTests(() => 0.9);
    const first = resolveExperiment('heroCta');
    expect(first).toMatchObject({ variant: 'fixed-fee', source: 'assigned', label: 'Book the $2,500 Diagnostic', experimentId: 'exp-hero-cta-v1' });
    expect(JSON.parse(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY) as string)).toEqual({ 'exp-hero-cta-v1': 'fixed-fee' });
    expect(resolveExperiment('heroCta')).toBe(first); // stable within the page

    // "Reload": the module state is rebuilt, the stored assignment is reused even though the dice would now say control.
    resetExperimentsForTests();
    setExperimentRandomForTests(() => 0.01);
    expect(resolveExperiment('heroCta').variant).toBe('fixed-fee');
  });

  it('replaces a stored assignment that is no longer a valid variant', () => {
    consent();
    window.localStorage.setItem(EXPERIMENT_STORAGE_KEY, JSON.stringify({ 'exp-hero-cta-v1': 'retired-variant' }));
    setExperimentRandomForTests(() => 0.01);
    expect(resolveExperiment('heroCta').variant).toBe('control');
    expect(JSON.parse(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY) as string)['exp-hero-cta-v1']).toBe('control');
  });

  it('falls back to the control when storage cannot hold an assignment', () => {
    consent();
    setExperimentRandomForTests(() => 0.9);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(resolveExperiment('heroCta')).toMatchObject({ variant: 'control', source: 'off' });
  });

  it('honours a QA override without consent, without storing it, and ignores unknown variants', () => {
    window.history.pushState({}, '', '/?exp_headerCta=explore&exp_heroCta=does-not-exist');
    expect(resolveExperiment('headerCta')).toMatchObject({ variant: 'explore', source: 'override', label: 'Explore the Diagnostic' });
    expect(resolveExperiment('heroCta')).toMatchObject({ variant: 'control', source: 'off' });
    expect(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY)).toBeNull();
    expect(getExperimentContext()).toEqual({}); // overrides are never reported with an inquiry
  });

  it('ignores overrides when tests are disabled', () => {
    vi.stubEnv('VITE_EXPERIMENTS_ENABLED', 'false');
    window.history.pushState({}, '', '/?exp_headerCta=explore');
    expect(resolveExperiment('headerCta')).toMatchObject({ variant: 'control', source: 'off' });
  });

  it('reports only assigned tests with an inquiry, as parallel id and variant lists', () => {
    consent();
    setExperimentRandomForTests(() => 0.9);
    resolveExperiment('heroCta');
    resolveExperiment('headerCta');
    expect(getExperimentContext()).toEqual({ experiment: 'exp-hero-cta-v1,exp-header-cta-v1', experiment_variant: 'fixed-fee,explore' });
  });

  describe('inquiry context from stored assignments', () => {
    const store = (assignments: Record<string, string>) => window.localStorage.setItem(EXPERIMENT_STORAGE_KEY, JSON.stringify(assignments));

    it('includes assignments made on earlier pages even though this page resolved none of them', () => {
      // Home assigned these; the visitor then navigated (a full page load) to /diagnostic/, whose minimal shell has no A/B surface.
      store({ 'exp-hero-cta-v1': 'fixed-fee', 'exp-header-cta-v1': 'explore' });
      consent();
      expect(getExperimentContext()).toEqual({ experiment: 'exp-hero-cta-v1,exp-header-cta-v1', experiment_variant: 'fixed-fee,explore' });
    });

    it('reports nothing without consent, when tests are disabled, or when there is nowhere to measure', () => {
      store({ 'exp-hero-cta-v1': 'fixed-fee' });
      expect(getExperimentContext()).toEqual({}); // no consent
      consent();
      expect(getExperimentContext()).not.toEqual({});
      vi.stubEnv('VITE_EXPERIMENTS_ENABLED', 'false');
      expect(getExperimentContext()).toEqual({});
      vi.stubEnv('VITE_EXPERIMENTS_ENABLED', 'true');
      vi.stubEnv('VITE_TRACKING_ENDPOINT', '');
      expect(getExperimentContext()).toEqual({});
    });

    it('ignores unknown experiments, unknown variants and non-object stores, and keeps registry order', () => {
      consent();
      store({ 'exp-header-cta-v1': 'explore', 'exp-hero-cta-v1': 'no-such-variant', 'exp-retired-v0': 'x', 'exp-follow-us-design-v1': 'control' });
      const context = getExperimentContext();
      expect(context.experiment?.split(',')).toEqual(['exp-header-cta-v1', 'exp-follow-us-design-v1']);
      expect(context.experiment_variant).toBe('explore,control');
      window.localStorage.setItem(EXPERIMENT_STORAGE_KEY, '["exp-header-cta-v1"]');
      expect(getExperimentContext()).toEqual({});
      window.localStorage.setItem(EXPERIMENT_STORAGE_KEY, 'not json');
      expect(getExperimentContext()).toEqual({});
    });

    it('never reports an experiment the visitor is only seeing through a QA override', () => {
      consent();
      store({ 'exp-header-cta-v1': 'control', 'exp-hero-cta-v1': 'fixed-fee' });
      window.history.pushState({}, '', '/?exp_headerCta=explore');
      expect(getExperimentContext()).toEqual({ experiment: 'exp-hero-cta-v1', experiment_variant: 'fixed-fee' });
    });

    it('stays within the 200 characters the contact Function accepts, even with every experiment assigned', () => {
      consent();
      store(Object.fromEntries(experimentList.map((definition) => [definition.id, definition.variants[definition.variants.length - 1].id])));
      const context = getExperimentContext();
      expect((context.experiment ?? '').split(',')).toHaveLength(EXPERIMENT_KEYS.length);
      expect((context.experiment ?? '').length).toBeLessThanOrEqual(200);
      expect((context.experiment_variant ?? '').length).toBeLessThanOrEqual(200);
    });
  });
});

describe('useExperiment', () => {
  it('renders the control with no attribution and records nothing without consent', async () => {
    render(<Probe experiment="headerCta" />);
    await flush();
    const probe = screen.getByTestId('probe');
    expect(probe.textContent).toBe('control|-');
    expect(probe.hasAttribute('data-experiment')).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY)).toBeNull();
  });

  it('records exactly one exposure per session, even under StrictMode and across remounts', async () => {
    consent();
    setExperimentRandomForTests(() => 0.9);
    const first = render(
      <StrictMode>
        <Probe experiment="headerCta" />
      </StrictMode>,
    );
    const probe = screen.getByTestId('probe');
    expect(probe.textContent).toBe('explore|Explore the Diagnostic');
    expect(probe.getAttribute('data-experiment')).toBe('exp-header-cta-v1');
    expect(probe.getAttribute('data-variant')).toBe('explore');
    first.unmount();
    render(<Probe experiment="headerCta" />);
    await flush();
    const exposures = sentEvents().filter((event) => event.event_name === 'experiment_exposure');
    expect(exposures).toHaveLength(1);
    expect(exposures[0].properties).toEqual({ experiment_id: 'exp-header-cta-v1', variant: 'explore' });
  });

  it('switches to the assigned variant when consent is granted, and back to the control when it is withdrawn', async () => {
    setExperimentRandomForTests(() => 0.9);
    render(<Probe experiment="followUsDesign" />);
    expect(screen.getByTestId('probe').textContent).toBe('control|-');

    act(() => consent());
    expect(screen.getByTestId('probe').textContent).toBe('labeled|-');
    expect(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY)).not.toBeNull();

    act(() => applyAnalyticsConsent({ firstParty: false, ga4: false }));
    expect(screen.getByTestId('probe').textContent).toBe('control|-');
    expect(screen.getByTestId('probe').hasAttribute('data-experiment')).toBe(false);
    expect(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY)).toBeNull();
    await flush();
  });

  it('does not count a QA override as an exposure', async () => {
    consent();
    window.history.pushState({}, '', '/?exp_headerCta=explore');
    render(<Probe experiment="headerCta" />);
    expect(screen.getByTestId('probe').textContent).toBe('explore|Explore the Diagnostic');
    expect(screen.getByTestId('probe').hasAttribute('data-experiment')).toBe(false);
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'experiment_exposure')).toHaveLength(0);
  });
});

describe('experiment surfaces (QA overrides)', () => {
  function renderRoute(path: string) {
    window.history.pushState({}, '', path);
    return render(<App />);
  }

  it('header: the variant changes the label only, never the destination', () => {
    renderRoute('/?exp_headerCta=explore');
    const link = screen.getAllByRole('link', { name: /^Explore the Diagnostic$/ }).find((anchor) => anchor.getAttribute('data-location') === 'header');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/diagnostic/');
    expect(link?.getAttribute('data-cta')).toBe('book-diagnostic');
    expect(screen.queryByRole('link', { name: /^Book a Diagnostic$/ })).toBeNull();
  });

  it('pricing: the comparison table adds no price and leaves the published $2,500 Diagnostic intact', () => {
    renderRoute('/pricing/');
    expect(screen.queryByTestId('pricing-glance')).toBeNull();
    expect(screen.getAllByText(/\$2,500 fixed fee/).length).toBeGreaterThan(0);
    const controlHtml = document.body.textContent ?? '';
    cleanup();
    resetExperimentsForTests(); // a new page load resolves every test afresh

    renderRoute('/pricing/?exp_pricingPresentation=at-a-glance');
    const table = screen.getByTestId('pricing-glance');
    for (const model of pricingModels) {
      const row = within(table).getByRole('rowheader', { name: model.name }).closest('tr') as HTMLElement;
      expect(within(row).getByText(model.price)).toBeTruthy();
    }
    expect(within(table).getByText('$2,500 fixed fee')).toBeTruthy();
    // Everything the control shows is still shown.
    const variantHtml = document.body.textContent ?? '';
    expect(variantHtml).toContain('Intelligence and execution, scoped to your business.');
    expect(variantHtml.length).toBeGreaterThan(controlHtml.length);
  });

  it('talk to us placement: the footer variant removes only the floating control', () => {
    renderRoute('/');
    expect(screen.getByRole('button', { name: /^Talk to us$/ })).toBeTruthy();
    cleanup();
    resetExperimentsForTests();

    renderRoute('/?exp_talkToUsPlacement=footer-only');
    expect(screen.queryByRole('button', { name: /^Talk to us$/ })).toBeNull();
    expect(screen.getAllByRole('link', { name: /Talk to us/ }).length).toBeGreaterThan(0); // footer band stays
    expect(screen.getAllByRole('button', { name: /Follow ROOT/ }).length).toBeGreaterThan(0); // Follow is a separate test
  });

  it('follow us design: labeled shows network names beside the icons', () => {
    renderRoute('/');
    const controlLinks = within(screen.getAllByRole('navigation', { name: /Follow ROOT on social media/i })[0]).getAllByRole('link');
    expect(controlLinks[0].textContent).toBe('');
    cleanup();
    resetExperimentsForTests();

    renderRoute('/?exp_followUsDesign=labeled');
    const labeled = within(screen.getAllByRole('navigation', { name: /Follow ROOT on social media/i })[0]).getAllByRole('link');
    expect(labeled.map((link) => link.textContent)).toContain('LinkedIn');
    expect(labeled[0].getAttribute('aria-label')).toMatch(/opens in new tab/);
  });
});

describe('pricing-card links (the pricing test metric)', () => {
  const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const cards = () => Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-cta="pricing-card"]'));

  it('reports every core and specialised card as an approved cta_click with its destination and model', () => {
    window.history.pushState({}, '', '/pricing/');
    render(<App />);
    const models = pricingModels.slice(1); // the featured Diagnostic card has its own book-diagnostic link
    expect(
      cards().map((link) => ({
        text: link.textContent,
        href: link.getAttribute('href'),
        destination: link.getAttribute('data-destination'),
        location: link.getAttribute('data-location'),
        engagement: link.getAttribute('data-engagement-type'),
      })),
    ).toEqual(
      models.map((model: (typeof pricingModels)[number], index: number) => ({
        text: model.cta,
        href: model.href,
        destination: model.href,
        location: index < 2 ? 'pricing-core' : 'pricing-specialized',
        engagement: slug(model.name),
      })),
    );
    expect(new Set(cards().map((link) => link.getAttribute('data-engagement-type'))).size).toBe(models.length);
  });

  it('turns a card click into a tracked cta_click', async () => {
    document.cookie = `root_consent=${encodeURIComponent(JSON.stringify({ 'root-session': true, 'root-first-party-analytics': true }))}; path=/`;
    consent();
    window.history.pushState({}, '', '/pricing/');
    render(<App />);
    const managed = cards().find((link) => link.getAttribute('data-engagement-type') === 'managed-rcm') as HTMLElement;
    managed.addEventListener('click', (event) => event.preventDefault(), { once: true });
    act(() => managed.click());
    await flush();
    const clicks = sentEvents().filter((event) => event.event_name === 'cta_click');
    expect(clicks.map((event) => event.properties)).toContainEqual(
      expect.objectContaining({ cta_id: 'pricing-card', cta_location: 'pricing-core', destination: '/contact/', engagement_type: 'managed-rcm' }),
    );
  });
});

describe('talk to us placement on minimal shells', () => {
  const returningVisitor = (assignment: Record<string, string> = {}) => {
    document.cookie = `root_consent=${encodeURIComponent(JSON.stringify({ 'root-session': true, 'root-first-party-analytics': true }))}; path=/`;
    window.localStorage.setItem(EXPERIMENT_STORAGE_KEY, JSON.stringify(assignment));
    consent();
  };
  const go = (path: string) => {
    window.history.pushState({}, '', path);
    return render(<App />);
  };
  const exposures = () => sentEvents().filter((event) => event.event_name === 'experiment_exposure').map((event) => event.properties.experiment_id);

  it('removes the floating control for an assigned visitor on a page that has the footer band', async () => {
    returningVisitor({ 'exp-talk-to-us-placement-v1': 'footer-only' });
    go('/pricing/');
    expect(screen.queryByRole('button', { name: /^Talk to us$/ })).toBeNull();
    await flush();
    expect(exposures()).toContain('exp-talk-to-us-placement-v1');
  });

  it('keeps the floating control on the minimal shell, where nothing else offers contact, and records no exposure', async () => {
    returningVisitor({ 'exp-talk-to-us-placement-v1': 'footer-only' });
    go('/diagnostic/');
    expect(screen.getByRole('button', { name: /^Talk to us$/ })).toBeTruthy();
    expect(document.querySelector('[data-experiment="exp-talk-to-us-placement-v1"]')).toBeNull();
    await flush();
    expect(exposures()).not.toContain('exp-talk-to-us-placement-v1');
  });

  it('ignores a QA override on the minimal shell too', () => {
    go('/diagnostic/?exp_talkToUsPlacement=footer-only');
    expect(screen.getByRole('button', { name: /^Talk to us$/ })).toBeTruthy();
  });
});

describe('experiment surfaces (assigned visitors)', () => {
  it('attribute clicks to the assigned variant and leave other clicks untagged', () => {
    window.history.pushState({}, '', '/');
    // A returning visitor: the saved choice is in Klaro's cookie, which AnalyticsBoot reads when the page mounts.
    document.cookie = `root_consent=${encodeURIComponent(JSON.stringify({ 'root-session': true, 'root-first-party-analytics': true }))}; path=/`;
    consent();
    setExperimentRandomForTests(() => 0.9);
    render(<App />);
    const details: Record<string, unknown>[] = [];
    window.addEventListener('root:cta', (event) => details.push((event as CustomEvent).detail));

    const header = screen.getAllByRole('link', { name: /^Explore the Diagnostic$/ }).find((anchor) => anchor.getAttribute('data-location') === 'header') as HTMLElement;
    header.addEventListener('click', (event) => event.preventDefault(), { once: true });
    act(() => header.click());
    expect(details.at(-1)).toMatchObject({ cta: 'book-diagnostic', location: 'header', experiment: 'exp-header-cta-v1', experiment_variant: 'explore' });
    expect(JSON.stringify(details.at(-1))).not.toMatch(/@|tel:/);
    expect(getExperimentContext().experiment).toContain('exp-header-cta-v1');
  });
});
