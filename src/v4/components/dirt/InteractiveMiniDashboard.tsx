// Local sample scenario for explaining how financial priorities can be compared.
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
      aria-label="Illustrative revenue-cycle scenario preview"
    >
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Bounded scenario model</p>
          <h2 className="mt-1 text-lg font-semibold text-text">Revenue-cycle scenario</h2>
        </div>
        <button
          type="button"
          onClick={() => setModeled((v) => !v)}
          className="rounded-full border border-intelligence/30 bg-intelligence/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text transition-colors hover:border-data-blue/45"
        >
          {modeled ? 'Return to example baseline' : 'Compare a modeled scenario'}
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-root)] border border-border bg-bg-deep/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Days sales outstanding</p>
          <p className={modeled ? 'mt-2 text-3xl font-semibold text-recovery' : 'mt-2 text-3xl font-semibold text-text'}>
            {currentDso}d
          </p>
          <p className="mt-1 text-xs text-muted">{modeled ? 'Modeled view with priorities applied' : 'Illustrative baseline estimate'}</p>
        </div>
        <div className="rounded-[var(--radius-root)] border border-border bg-bg-deep/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Recoverable A/R estimate</p>
          <p className={modeled ? 'mt-2 text-3xl font-semibold text-recovery' : 'mt-2 text-3xl font-semibold text-text'}>
            {moneyFormatter.format(currentRecovery)}
          </p>
          <p className="mt-1 text-xs text-muted">{modeled ? 'Modeled estimate' : 'Illustrative baseline estimate'}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        Illustrative figures show how revenue signals can be arranged for review. A practice-specific analysis uses the reports, contracts, and operating context the practice authorizes.
      </p>
    </GlassCard>
  );
}
