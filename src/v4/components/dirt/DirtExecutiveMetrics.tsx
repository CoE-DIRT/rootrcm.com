import { dirtDemo, formatCompactUsd } from '@/data/dirtDemo';
import { cn } from '@/lib/cn';

const metricCards = [
  { label: 'Monthly charges', value: formatCompactUsd(dirtDemo.executive.charges) },
  { label: 'Collections', value: formatCompactUsd(dirtDemo.executive.collections) },
  { label: 'Total A/R', value: formatCompactUsd(dirtDemo.executive.totalAr) },
  { label: 'A/R over 90', value: formatCompactUsd(dirtDemo.executive.arOver90) },
  { label: 'Clean claim', value: dirtDemo.executive.cleanClaimRate },
  { label: 'Denial rate', value: dirtDemo.executive.denialRate },
  { label: 'Value at risk', value: formatCompactUsd(dirtDemo.executive.valueAtRisk) },
];

/** Lightweight executive metrics shared by the hero and full command center. */
export function DirtExecutiveMetrics({ compact = false }: { compact?: boolean }) {
  const visibleMetrics = compact ? metricCards.slice(0, 4) : metricCards;
  return (
    <>
      <div className={cn('flex flex-wrap items-end justify-between gap-3', compact && 'flex-col items-start gap-1.5')}>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">DIRT command center</p>
          <h2 className={cn('mt-1 font-semibold text-text', compact ? 'text-lg' : 'text-2xl sm:text-3xl')}>
            Executive revenue view
          </h2>
          {!compact ? (
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Illustrative operating scenario · sample metrics for {dirtDemo.practice.name}.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted">Illustrative sample metrics · {dirtDemo.practice.name}</p>
          )}
        </div>
        <p className="rounded-full border border-border px-3 py-1 text-xs text-signal-amber">{dirtDemo.practice.period}</p>
      </div>

      <div className={cn('grid min-w-0 gap-3', compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7')}>
        {visibleMetrics.map((m) => (
          <div
            key={m.label}
            className={cn(
              'root-metric-cell min-w-0 rounded-[var(--radius-root)] border border-border',
              compact ? 'p-3' : 'p-4',
            )}
          >
            <p className="truncate text-[11px] uppercase tracking-wide text-muted">{m.label}</p>
            <p className={cn('mt-2 truncate font-semibold text-text', compact ? 'text-lg' : 'text-xl')}>{m.value}</p>
          </div>
        ))}
      </div>

    </>
  );
}
