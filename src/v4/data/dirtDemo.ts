import { syntheticPractice, proofWorkAssets } from '../../proofData.js';

/** Deidentified demonstration dataset for DIRT command surfaces. */
export const dirtDemo = {
  practice: syntheticPractice,
  executive: {
    charges: syntheticPractice.monthlyCharges,
    collections: syntheticPractice.monthlyCollections,
    totalAr: syntheticPractice.totalAr,
    arOver90: syntheticPractice.arOver90,
    cleanClaimRate: syntheticPractice.cleanClaimRate,
    denialRate: syntheticPractice.denialRate,
    valueAtRisk: 214000,
  },
  aging: proofWorkAssets.arAnalysis.buckets.map(([bucket, amount]) => ({ bucket: String(bucket), amount: Number(amount) })),
  denials: proofWorkAssets.denialPareto.categories.map(([category, count, value, owner]) => ({
    category: String(category),
    count: Number(count),
    value: Number(value),
    owner: String(owner),
  })),
  payers: [
    { payer: 'Commercial Plus', cleanClaim: 88, denialRate: 9.4, arOver90: 92000, trend: 'stable' },
    { payer: 'Medicare', cleanClaim: 91, denialRate: 6.2, arOver90: 48000, trend: 'improving' },
    { payer: 'Regional Medicaid', cleanClaim: 79, denialRate: 14.1, arOver90: 71000, trend: 'worsening' },
    { payer: 'Workers Comp', cleanClaim: 72, denialRate: 18.5, arOver90: 54000, trend: 'worsening' },
  ],
  underpayments: [
    { id: 'UP-104', description: 'Fee schedule variance — Commercial Plus E/M', amount: 18600, owner: 'Payer ops', next: 'Contract vs remittance audit' },
    { id: 'UP-118', description: 'Modifier underpayment cluster', amount: 12400, owner: 'Coding lead', next: 'Sample 20 claims' },
    { id: 'UP-131', description: 'Secondary balance not billed', amount: 9800, owner: 'Billing lead', next: 'Queue secondary claims' },
  ],
  queue: [
    { id: 'Q-01', signal: 'Eligibility denials', finding: 'Front-end verification gaps on new patients', significance: '$64K', owner: 'Front desk lead', action: 'Mandatory eligibility check SOP', priority: 'High' },
    { id: 'Q-02', signal: 'Auth-driven A/R', finding: 'Referral packets incomplete before DOS', significance: '$52K', owner: 'Auth coordinator', action: 'Pre-visit auth checklist', priority: 'High' },
    { id: 'Q-03', signal: 'Aging 120+', finding: 'Commercial follow-up overdue', significance: '$118K', owner: 'AR team', action: 'Escalate payer tickets', priority: 'High' },
    { id: 'Q-04', signal: 'Credentialing lag', finding: 'Two providers pending committee', significance: 'Timing risk', owner: 'Credentialing', action: 'Weekly payer chase', priority: 'Medium' },
    { id: 'Q-05', signal: 'Posting exceptions', finding: 'Unmatched remits blocking close', significance: '$31K', owner: 'Payment posting', action: 'Daily exception sweep', priority: 'Medium' },
  ],
  signalFlow: [
    { stage: 'Signal', detail: 'Denial spike + aging concentration in Commercial' },
    { stage: 'Finding', detail: 'Eligibility and authorization defects upstream of claim submission' },
    { stage: 'Financial significance', detail: '$116K combined value at risk in 90 days' },
    { stage: 'Owner', detail: 'Front desk lead + Auth coordinator (shared SLA)' },
    { stage: 'Next action', detail: 'Stand up pre-visit checklist; review in 14 days' },
  ],
  /** Nested Data Grid Container fixture — ported row shape from
   * D/src/content/experienceContent.js nestedGridDefaults, populated with ROOT's
   * synthetic practice data only (docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md). */
  triageMetrics: [
    { label: 'Queue volume', displayLabel: 'Queue volume', value: '48 items', note: 'Open triage items this cycle.', tone: 'synthetic' as const, accent: 'cyan' as const },
    { label: 'Value at risk', displayLabel: 'Value at risk', value: formatCompactUsd(214000), note: 'Combined significance across the queue.', tone: 'illustrative' as const, accent: 'amber' as const },
    { label: 'Human review required', displayLabel: 'Human review', value: '100%', note: 'Every recommendation needs owner sign-off.', tone: 'risk' as const, accent: 'blush' as const },
    { label: 'Owned this cycle', displayLabel: 'Owned', value: '3 of 5', note: 'Items with a named owner and next action.', tone: 'success' as const, accent: 'green' as const },
    { label: 'Avg. days open', displayLabel: 'Avg. days open', value: '9d', note: 'Since signal first appeared.', tone: 'neutral' as const, accent: 'indigo' as const },
  ],
  triageRows: [
    {
      id: 'ROW-01',
      title: 'Eligibility denials — new patient front end',
      summary: 'Front-end verification gaps on new patients before date of service.',
      segment: 'Front desk',
      owner: 'Front desk lead',
      risk: 'Ready for action',
      score: '0.82',
      pattern: 'Eligibility checks skipped for same-day and short-notice appointments.',
      evidence: 'Synthetic sample of 40 denied claims shows missing eligibility verification timestamps.',
      humanCheck: 'Confirm the front-desk SOP gap with a supervisor before enforcing a mandatory check.',
      recommendation: 'Stand up a mandatory eligibility-check SOP for same-day visits; review in 14 days.',
    },
    {
      id: 'ROW-02',
      title: 'Auth-driven A/R — incomplete referral packets',
      summary: 'Referral packets incomplete before date of service, delaying authorization.',
      segment: 'Authorization',
      owner: 'Auth coordinator',
      risk: 'Watch closely',
      score: '0.71',
      pattern: 'Referral intake missing payer-required fields in a recurring subset of specialties.',
      evidence: 'Synthetic sample flags incomplete packets clustering around two referring practices.',
      humanCheck: 'Auth coordinator validates whether the gap is intake process or payer requirement drift.',
      recommendation: 'Add a pre-visit authorization checklist gated on packet completeness.',
    },
    {
      id: 'ROW-03',
      title: 'Aging 120+ — Commercial follow-up overdue',
      summary: 'Commercial payer follow-up has lapsed past the 120-day threshold.',
      segment: 'A/R',
      owner: 'A/R team',
      risk: 'Ready for action',
      score: '0.88',
      pattern: 'Follow-up cadence breaks down once claims pass 90 days without payer response.',
      evidence: 'Synthetic aging export shows a concentration of stalled claims in one payer category.',
      humanCheck: 'A/R lead confirms which accounts are genuinely stalled versus pending appeal.',
      recommendation: 'Escalate open payer tickets and set a 7-day follow-up cadence past 90 days.',
    },
  ],
  /** InteractiveMiniDashboard fixture — explicit synthetic baseline/scenario, no
   * "Live" framing (docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md issue #2). */
  scenario: {
    baselineDso: 32,
    modeledDso: 28,
    baselineRecoverable: 4200000,
    modeledRecoverable: 4550000,
  },
};

export function formatCompactUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}
