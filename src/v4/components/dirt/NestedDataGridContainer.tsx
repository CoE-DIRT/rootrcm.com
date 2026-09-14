// Ported from DIRT premium-react-site: src/components/sections/NestedDataGridContainer.jsx
import { useEffect, useId, useState } from 'react';
import { ChevronDown, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusPill, type StatusPillTone } from '@/components/ui/StatusPill';
import { dirtDemo } from '@/data/dirtDemo';
import { cn } from '@/lib/cn';

function mapRiskTone(riskLabel: string): StatusPillTone {
  const normalized = riskLabel.toLowerCase();
  if (normalized.includes('watch')) return 'illustrative';
  if (normalized.includes('review')) return 'risk';
  if (normalized.includes('ready')) return 'success';
  return 'neutral';
}

function riskDisplayLabel(riskLabel: string): string {
  const normalized = riskLabel.toLowerCase();
  if (normalized.includes('ready for action')) return 'Action Ready';
  if (normalized.includes('watch closely')) return 'Watchlist';
  return riskLabel;
}

export function NestedDataGridContainer() {
  const [openRows, setOpenRows] = useState<string[]>([]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const activeRow = dirtDemo.triageRows.find((row) => row.id === activeRowId) ?? null;
  const baseId = useId();
  const explainPanelId = `${baseId}-explain-panel`;

  function toggleRow(id: string) {
    setOpenRows((current) => (current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id]));
  }

  // Move focus into the explanation panel when it opens (or switches to a different
  // row) so keyboard/screen-reader users land where the Explain action's result
  // actually appeared, instead of it silently inserting off-screen below the queue.
  // (Looked up by id rather than a ref: GlassCard is a plain function component that
  // spreads unrecognized props onto its root element, so id/role/tabIndex pass
  // through, but a `ref` prop would need explicit forwarding it doesn't do.)
  useEffect(() => {
    if (activeRowId) {
      document.getElementById(explainPanelId)?.focus();
    }
  }, [activeRowId, explainPanelId]);

  return (
    <div className="grid min-w-0 gap-5">
      <div className="min-w-0 space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dirtDemo.triageMetrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              displayLabel={metric.displayLabel}
              value={metric.value}
              note={metric.note}
              tone={metric.tone}
              accent={metric.accent}
            />
          ))}
        </div>

        <GlassCard variant="glass" accent="cyan" hover={false} className="overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-data-blue">Priority triage queue</p>
              <h3 className="mt-2 text-xl font-semibold text-text">Synthetic RCM triage surface for finance and billing review</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="info">No-PHI</StatusPill>
              <StatusPill tone="neutral">Synthetic Data</StatusPill>
              <StatusPill tone="warning">Human Review Required</StatusPill>
            </div>
          </div>

          <div className="hidden grid-cols-[1.2fr_0.7fr_0.75fr_0.55fr_0.45fr_minmax(8rem,0.7fr)] gap-3 border-b border-border bg-bg-deep/70 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted md:grid">
            <span>Queue item</span>
            <span>Segment</span>
            <span>Owner</span>
            <span>Risk</span>
            <span>Illustrative score</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-border">
            {dirtDemo.triageRows.map((row) => {
              const isOpen = openRows.includes(row.id);
              const isActive = activeRowId === row.id;
              const panelId = `${baseId}-${row.id}-panel`;

              return (
                <div key={row.id} className={isActive ? 'bg-bg-deep/45' : undefined}>
                  <div className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_0.7fr_0.75fr_0.55fr_0.45fr_minmax(8rem,0.7fr)] md:items-center">
                    <button
                      type="button"
                      onClick={() => toggleRow(row.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="inline-flex appearance-none items-start gap-3 rounded-[var(--radius-root)] border-0 bg-transparent p-1 text-left"
                    >
                      {isOpen ? (
                        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-data-blue" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-data-blue" aria-hidden="true" />
                      )}
                      <span>
                        <span className="block text-sm font-semibold text-text">{row.title}</span>
                        <span className="mt-1 block text-xs text-muted md:max-w-[36ch]">{row.summary}</span>
                      </span>
                    </button>
                    <p className="text-sm text-muted">
                      <span className="text-muted/70 md:hidden">Segment: </span>
                      {row.segment}
                    </p>
                    <p className="text-sm text-muted">
                      <span className="text-muted/70 md:hidden">Owner: </span>
                      {row.owner}
                    </p>
                    <div>
                      <span className="mb-1 block text-xs text-muted/70 md:hidden">Risk: </span>
                      <StatusPill tone={mapRiskTone(row.risk)} className="max-w-[8.25rem]" title={row.risk}>
                        {riskDisplayLabel(row.risk)}
                      </StatusPill>
                    </div>
                    <p
                      className="text-sm text-muted"
                      title="Illustrative fixture value, not a validated model confidence or probability"
                    >
                      <span className="text-muted/70 md:hidden">Illustrative score: </span>
                      {row.score}
                    </p>
                    <button
                      type="button"
                      id={`${baseId}-${row.id}-explain-trigger`}
                      onClick={() => setActiveRowId(row.id)}
                      aria-label={`Explain: ${row.title}`}
                      aria-controls={explainPanelId}
                      aria-expanded={isActive}
                      className={cn(
                        'inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-[var(--radius-root)] border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors md:w-auto',
                        isActive
                          ? 'border-intelligence/40 bg-intelligence/15 text-text'
                          : 'border-intelligence/30 bg-intelligence/12 text-text hover:border-data-blue/40',
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span aria-hidden="true">Explain</span>
                    </button>
                  </div>

                  {isOpen ? (
                    <div id={panelId} className="overflow-hidden border-t border-border/60 bg-bg-deep/70">
                      <div className="grid gap-4 px-5 py-4 md:grid-cols-3">
                        <div className="rounded-[var(--radius-root)] border border-border bg-bg-deep/55 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-data-blue">Operational pattern</p>
                          <p className="mt-2 text-sm text-muted">{row.pattern}</p>
                        </div>
                        <div className="rounded-[var(--radius-root)] border border-border bg-bg-deep/55 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-data-blue">Synthetic evidence</p>
                          <p className="mt-2 text-sm text-muted">{row.evidence}</p>
                        </div>
                        <div className="rounded-[var(--radius-root)] border border-border bg-bg-deep/55 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-data-blue">Human validation</p>
                          <p className="mt-2 text-sm text-muted">{row.humanCheck}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {activeRow ? (
        <GlassCard
          id={explainPanelId}
          role="region"
          aria-label={`Explanation: ${activeRow.title}`}
          tabIndex={-1}
          variant="glass"
          accent="blush"
          hover={false}
          className="h-fit p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-data-blue"
        >
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-blush">Explain this recommendation</p>
                <h3 className="mt-2 text-lg font-semibold text-text">{activeRow.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-data-blue" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => {
                    const triggerId = activeRowId ? `${baseId}-${activeRowId}-explain-trigger` : null;
                    setActiveRowId(null);
                    if (triggerId) document.getElementById(triggerId)?.focus();
                  }}
                  className="rounded-[var(--radius-root)] border border-border px-2.5 py-1 text-xs font-medium text-muted hover:border-data-blue/40 hover:text-text"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4 px-5 py-5">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Detected pattern</p>
              <p className="mt-2 text-sm text-muted">{activeRow.pattern}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Evidence is synthetic</p>
              <p className="mt-2 text-sm text-muted">{activeRow.evidence}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">What a human should validate</p>
              <p className="mt-2 text-sm text-muted">{activeRow.humanCheck}</p>
            </section>
            <section className="rounded-[var(--radius-root)] border border-recovery/20 bg-recovery/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-recovery">Recommended action</p>
              <p className="mt-2 text-sm text-muted">{activeRow.recommendation}</p>
            </section>
          </div>
        </GlassCard>
      ) : null}
    </div>
  );
}
