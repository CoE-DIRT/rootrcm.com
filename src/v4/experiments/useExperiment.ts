import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { track } from '../analytics/tracker';
import { controlResolution, resolveExperiment, subscribeExperiments } from './engine';
import type { ExperimentKey } from './registry';

export interface ExperimentState {
  variant: string;
  isControl: boolean;
  /** Visible copy for wording tests; undefined on the control and on structural tests. */
  label: string | undefined;
  /**
   * Spread onto the element the test changes so clicks inside it carry the experiment context
   * (read by src/App.jsx via `closest('[data-experiment]')`). Empty unless the visitor is actually assigned,
   * so QA overrides and non-consenting visitors never contribute to a result.
   */
  attrs: { 'data-experiment'?: string; 'data-variant'?: string };
}

/**
 * Resolve an experiment for the current visitor and record one `experiment_exposure` per session when they are
 * assigned. Exposure means "this surface rendered for a consented visitor"; on narrow screens that includes
 * visitors who never open the mobile menu, which dilutes both arms equally.
 */
export function useExperiment(key: ExperimentKey, { eligible = true }: { eligible?: boolean } = {}): ExperimentState {
  // `eligible: false` is for a surface the test cannot fairly compare (e.g. the control's fallback does not exist there):
  // it shows the control and neither assigns, stores nor records an exposure.
  const read = () => (eligible ? resolveExperiment(key) : controlResolution(key));
  const resolution = useSyncExternalStore(subscribeExperiments, read, read);

  useEffect(() => {
    if (resolution.source !== 'assigned') return;
    track(
      'experiment_exposure',
      { experiment_id: resolution.experimentId, variant: resolution.variant },
      { dedupeKey: `exposure:${resolution.experimentId}`, dedupeScope: 'session' },
    );
  }, [resolution]);

  return useMemo<ExperimentState>(
    () => ({
      variant: resolution.variant,
      isControl: resolution.variant === 'control',
      label: resolution.label,
      attrs: resolution.source === 'assigned' ? { 'data-experiment': resolution.experimentId, 'data-variant': resolution.variant } : {},
    }),
    [resolution],
  );
}
