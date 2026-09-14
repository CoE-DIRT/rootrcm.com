// Ported from DIRT premium-react-site: src/components/dashboards/InteractiveMiniDashboard.jsx
// Renamed "Live Financial Triage Monitor" / "Apply DIRT Intelligence" to explicit
// synthetic/modeled framing (docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md issue #2) —
// this is a local, no-network scenario toggle over a fixture, never a live signal.
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { dirtDemo } from '@/data/dirtDemo';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function InteractiveMiniDashboard() {
  const [modeled, setModeled] = useState(false);
  const { baselineDso, modeledDso, baselineRecoverable, modeledRecoverable } = dirtDemo.scenario;

  const currentDso = modeled ? modeledDso : baselineDso;
  const currentRecovery = modeled ? modeledRecoverable : baselineRecoverable;

  return (
    <GlassCard
      as="section"
      variant="glass"
      hover={false}
      className="my-8 p-5 md:p-6"
      aria-label="Synthetic no-PHI financial scenario preview"
    >
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Bounded scenario model</p>
          <h2 className="mt-1 text-lg font-semibold text-text">Synthetic financial triage scenario</h2>
        </div>
        <button
          type="button"
          onClick={() => setModeled((v) => !v)}
          className="rounded-full border border-intelligence/30 bg-intelligence/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text transition-colors hover:border-data-blue/45"
        >
          {modeled ? 'Reset to baseline' : 'Model the improvement'}
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-root)] border border-border bg-bg-deep/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Days sales outstanding</p>
          <p className={modeled ? 'mt-2 text-3xl font-semibold text-recovery' : 'mt-2 text-3xl font-semibold text-text'}>
            {currentDso}d
          </p>
          <p className="mt-1 text-xs text-muted">{modeled ? 'Modeled with prioritization applied' : 'Baseline synthetic estimate'}</p>
        </div>
        <div className="rounded-[var(--radius-root)] border border-border bg-bg-deep/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Recoverable A/R estimate</p>
          <p className={modeled ? 'mt-2 text-3xl font-semibold text-recovery' : 'mt-2 text-3xl font-semibold text-text'}>
            {moneyFormatter.format(currentRecovery)}
          </p>
          <p className="mt-1 text-xs text-muted">{modeled ? 'Modeled upside, not a guarantee' : 'Pre-optimization baseline'}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        Synthetic directional model only, based on fictional practice data. Not a guarantee of collections or
        reimbursement, and not connected to any live account.
      </p>
    </GlassCard>
  );
}
