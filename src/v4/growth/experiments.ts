/**
 * V4 experiment framework: A/B + capped MVT, draft lifecycle, QA overrides.
 * Initial experiments stay DRAFT until founder activation.
 */

export type ExperimentStatus = 'draft' | 'active' | 'paused' | 'complete';

export interface ExperimentVariant {
  id: string;
  weight: number;
  payload: Record<string, string>;
}

export interface ExperimentDefinition {
  key: string;
  id: string;
  status: ExperimentStatus;
  type: 'ab' | 'mvt';
  paths: string[];
  trafficSources?: string[];
  factors?: { name: string; variants: ExperimentVariant[] }[];
  variants?: ExperimentVariant[];
  /** Cap simultaneous active factors for MVT */
  maxActiveFactors?: number;
}

export const v4Experiments: ExperimentDefinition[] = [
  {
    key: 'heroValueProp',
    id: 'v4-hero-value-prop-v1',
    status: 'draft',
    type: 'ab',
    paths: ['/'],
    variants: [
      { id: 'a', weight: 1, payload: { headline: 'Run the business side of medicine better.' } },
      { id: 'b', weight: 1, payload: { headline: 'Find where your practice is losing revenue—and what to fix first.' } },
    ],
  },
  {
    key: 'ctaWording',
    id: 'v4-cta-wording-v1',
    status: 'draft',
    type: 'ab',
    paths: ['/', '/pricing', '/diagnostic'],
    variants: [
      { id: 'a', weight: 1, payload: { cta: 'Start the $2,500 Diagnostic' } },
      { id: 'b', weight: 1, payload: { cta: 'Book the Revenue Diagnostic' } },
    ],
  },
  {
    key: 'diagnosticPlacement',
    id: 'v4-diagnostic-placement-v1',
    status: 'draft',
    type: 'ab',
    paths: ['/'],
    variants: [
      { id: 'a', weight: 1, payload: { placement: 'hero' } },
      { id: 'b', weight: 1, payload: { placement: 'mid-page' } },
    ],
  },
  {
    key: 'dirtPresentation',
    id: 'v4-dirt-presentation-v1',
    status: 'draft',
    type: 'ab',
    paths: ['/', '/technology/dirt'],
    variants: [
      { id: 'a', weight: 1, payload: { frame: 'command-center' } },
      { id: 'b', weight: 1, payload: { frame: 'signal-flow' } },
    ],
  },
  {
    key: 'proofPricingOrder',
    id: 'v4-proof-pricing-order-v1',
    status: 'draft',
    type: 'ab',
    paths: ['/'],
    variants: [
      { id: 'a', weight: 1, payload: { order: 'proof-then-pricing' } },
      { id: 'b', weight: 1, payload: { order: 'pricing-then-proof' } },
    ],
  },
  {
    key: 'homeMvt',
    id: 'v4-home-mvt-v1',
    status: 'draft',
    type: 'mvt',
    paths: ['/'],
    maxActiveFactors: 2,
    factors: [
      {
        name: 'hero',
        variants: [
          { id: 'ops', weight: 1, payload: { tone: 'operations' } },
          { id: 'rev', weight: 1, payload: { tone: 'revenue' } },
        ],
      },
      {
        name: 'magnet',
        variants: [
          { id: 'diag', weight: 1, payload: { magnet: 'diagnostic' } },
          { id: 'guide', weight: 1, payload: { magnet: 'resource' } },
        ],
      },
    ],
  },
];

const STORAGE_KEY = 'root-v4-experiments-v1';

function overrides(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith('exp_')) out[key.slice(4)] = value;
  });
  return out;
}

function readStore(): Record<string, string> {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function pickWeighted(variants: ExperimentVariant[]): string {
  if (import.meta.env.MODE === 'test') return variants[0]?.id ?? 'a';
  const total = variants.reduce((sum, v) => sum + v.weight, 0) || 1;
  let r = Math.random() * total;
  for (const v of variants) {
    r -= v.weight;
    if (r <= 0) return v.id;
  }
  return variants[0]?.id ?? 'a';
}

export function getV4Assignment(key: string): string | null {
  const def = v4Experiments.find((e) => e.key === key);
  if (!def || def.status !== 'active') {
    const ov = overrides()[key];
    return ov || (def?.status === 'draft' ? def.variants?.[0]?.id ?? def.factors?.[0]?.variants[0]?.id ?? null : null);
  }
  const ov = overrides()[key];
  if (ov) return ov;
  const store = readStore();
  if (store[key]) return store[key];
  const variants = def.variants ?? def.factors?.[0]?.variants ?? [];
  const id = pickWeighted(variants);
  store[key] = id;
  writeStore(store);
  return id;
}

export function listDraftExperiments(): ExperimentDefinition[] {
  return v4Experiments.filter((e) => e.status === 'draft');
}
