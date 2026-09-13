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
};

export function formatCompactUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}
