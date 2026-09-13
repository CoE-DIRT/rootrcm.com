/**
 * GrowthBook feature-flag / experiment adapter.
 * Uses only the open-source SDK. Disabled until a client key is configured.
 * Experiments remain DRAFT in src/v4/growth/experiments.ts until founder activation.
 */
import { getV4Assignment, listDraftExperiments } from '../growth/experiments';

export function getGrowthBookClientKey(): string {
  return (import.meta.env.VITE_PUBLIC_GROWTHBOOK_KEY as string | undefined)?.trim() || '';
}

export function isGrowthBookConfigured(): boolean {
  return Boolean(getGrowthBookClientKey());
}

/** Resolve a flag-like key through local V4 experiment assignments (draft-safe). */
export function resolveFeatureVariant(key: string): string | null {
  return getV4Assignment(key);
}

export function listReadyExperiments() {
  return listDraftExperiments();
}
