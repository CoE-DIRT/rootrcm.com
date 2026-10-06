import { getGaMeasurementId, getSiteEnv, getTrackingEndpoint } from '../analytics/config';
import { analyticsAllowed, subscribeAnalyticsConsent } from '../analytics/consent';
import type { SiteEnv } from '../analytics/taxonomy';
import { EXPERIMENT_KEYS, EXPERIMENTS, type ExperimentDefinition, type ExperimentKey } from './registry';

/**
 * Experiment assignment. Rules, in order:
 *  1. Tests are off in production unless VITE_EXPERIMENTS_ENABLED=true; elsewhere they are on unless it is "false".
 *  2. A QA override (?exp_<key>=<variant>) shows that variant on this page only. It is never stored and never
 *     tracked, and it works without consent because nothing is recorded.
 *  3. Without analytics consent, or when there is nowhere to send measurements, everyone sees the control and
 *     nothing is stored.
 *  4. Otherwise the visitor gets one randomly chosen variant per experiment, kept in localStorage so the page stays
 *     consistent. If storage is unavailable the control is shown (an unstable assignment would corrupt results).
 *  Withdrawing consent deletes the stored assignments.
 */
export const EXPERIMENT_STORAGE_KEY = 'root-exp-v2';

export type ResolutionSource = 'off' | 'assigned' | 'override';

export interface Resolution {
  key: ExperimentKey;
  experimentId: string;
  variant: string;
  source: ResolutionSource;
  label: string | undefined;
}

/** Pure rule for whether tests may run at all (exported for tests). Production is opt-in; everywhere else is opt-out. */
export function resolveExperimentsEnabled({ siteEnv, flag }: { siteEnv: SiteEnv; flag: string }): boolean {
  const value = flag.trim().toLowerCase();
  if (value === 'true') return true;
  if (value === 'false') return false;
  return siteEnv !== 'production';
}

export function experimentsEnabled(): boolean {
  const flag = typeof import.meta.env.VITE_EXPERIMENTS_ENABLED === 'string' ? import.meta.env.VITE_EXPERIMENTS_ENABLED : '';
  return resolveExperimentsEnabled({ siteEnv: getSiteEnv(), flag });
}

/** Tests need a destination for their measurements; with neither sink configured there is nothing to learn. */
export const experimentsMeasurable = (): boolean => getTrackingEndpoint() !== '' || getGaMeasurementId() !== '';

/** Whether the "root-exp-v2" storage key can ever be written in this build (drives the cookie-policy disclosure). */
export const experimentsMayStoreAssignments = (): boolean => experimentsEnabled() && experimentsMeasurable();

/** Weighted choice; `value` is a number in [0, 1). Exported for tests. */
export function pickVariant(definition: ExperimentDefinition, value: number): string {
  const total = definition.variants.reduce((sum, variant) => sum + variant.weight, 0);
  let threshold = value * total;
  for (const variant of definition.variants) {
    threshold -= variant.weight;
    if (threshold < 0) return variant.id;
  }
  return definition.variants[0].id;
}

function defaultRandom(): number {
  const cryptoApi = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
    const bucket = new Uint32Array(1);
    cryptoApi.getRandomValues(bucket);
    return bucket[0] / 2 ** 32;
  }
  return Math.random();
}

let random: () => number = defaultRandom;

function readStore(): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** True only if the value can be read back, so a blocked or full store never yields an unstable assignment. */
function writeStore(store: Record<string, string>): boolean {
  try {
    const serialised = JSON.stringify(store);
    window.localStorage.setItem(EXPERIMENT_STORAGE_KEY, serialised);
    return window.localStorage.getItem(EXPERIMENT_STORAGE_KEY) === serialised;
  } catch {
    return false;
  }
}

function removeStore(): void {
  try {
    window.localStorage.removeItem(EXPERIMENT_STORAGE_KEY);
  } catch {
    /* nothing to remove */
  }
}

function overrideFor(key: ExperimentKey, definition: ExperimentDefinition) {
  try {
    const requested = new URLSearchParams(window.location.search).get(`exp_${key}`);
    return requested ? definition.variants.find((variant) => variant.id === requested) : undefined;
  } catch {
    return undefined;
  }
}

const controls = new Map<ExperimentKey, Resolution>();

/**
 * The control with no assignment, no storage and no exposure: what a surface shows when the test does not apply to it
 * (see `useExperiment(key, { eligible: false })`). The same object every time, as `useSyncExternalStore` requires.
 */
export function controlResolution(key: ExperimentKey): Resolution {
  let resolution = controls.get(key);
  if (!resolution) {
    const definition = EXPERIMENTS[key];
    const control = definition.variants[0];
    resolution = { key, experimentId: definition.id, variant: control.id, source: 'off', label: control.label };
    controls.set(key, resolution);
  }
  return resolution;
}

function compute(key: ExperimentKey): Resolution {
  const definition = EXPERIMENTS[key];
  const control = definition.variants[0];
  const off = controlResolution(key);
  if (typeof window === 'undefined' || !experimentsEnabled()) return off;

  const override = overrideFor(key, definition);
  if (override) return { key, experimentId: definition.id, variant: override.id, source: 'override', label: override.label };

  if (!analyticsAllowed() || !experimentsMeasurable()) return off;

  const store = readStore();
  let chosen = definition.variants.find((variant) => variant.id === store[definition.id]);
  if (!chosen) {
    const id = pickVariant(definition, random());
    chosen = definition.variants.find((variant) => variant.id === id) ?? control;
    if (!writeStore({ ...store, [definition.id]: chosen.id })) return off;
  }
  return { key, experimentId: definition.id, variant: chosen.id, source: 'assigned', label: chosen.label };
}

const cache = new Map<ExperimentKey, Resolution>();
const listeners = new Set<() => void>();
let wired = false;

function wireConsent(): void {
  if (wired) return;
  wired = true;
  subscribeAnalyticsConsent(() => {
    if (!analyticsAllowed()) removeStore();
    cache.clear();
    listeners.forEach((listener) => listener());
  });
}

/** Stable per page load: the same object is returned until consent changes. */
export function resolveExperiment(key: ExperimentKey): Resolution {
  let resolution = cache.get(key);
  if (!resolution) {
    resolution = compute(key);
    cache.set(key, resolution);
  }
  return resolution;
}

export function subscribeExperiments(listener: () => void): () => void {
  wireConsent();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Experiment context for a commercial inquiry: every test this visitor is assigned to. The site is a multi-page app and
 * the inquiry page (/diagnostic/ uses the minimal shell) renders none of the header, footer or home surfaces, so the
 * context comes from the persisted assignments, not from what this page happened to resolve. Ids and variants only
 * (comma-joined, parallel lists); the contact Function bounds each to 200 characters.
 * Nothing is reported without analytics consent, and a QA override (never stored, never tracked) is never reported.
 */
export function getExperimentContext(): { experiment?: string; experiment_variant?: string } {
  if (typeof window === 'undefined' || !experimentsEnabled() || !experimentsMeasurable() || !analyticsAllowed()) return {};
  const store = readStore();
  const assigned = EXPERIMENT_KEYS.flatMap((key) => {
    const definition = EXPERIMENTS[key];
    const variant = store[definition.id];
    if (overrideFor(key, definition)) return [];
    return definition.variants.some((candidate) => candidate.id === variant) ? [{ id: definition.id, variant }] : [];
  });
  if (!assigned.length) return {};
  return {
    experiment: assigned.map((entry) => entry.id).join(','),
    experiment_variant: assigned.map((entry) => entry.variant).join(','),
  };
}

/** Test helpers. */
export function resetExperimentsForTests(): void {
  cache.clear();
  listeners.clear();
  wired = false;
  random = defaultRandom;
}

export function setExperimentRandomForTests(next: (() => number) | null): void {
  random = next ?? defaultRandom;
}
