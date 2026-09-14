import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { dirtDemo, formatCompactUsd } from '@/data/dirtDemo';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ResponsiveTableShell } from '@/components/ui/ResponsiveTableShell';
import { NestedDataGridContainer } from '@/components/dirt/NestedDataGridContainer';
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

export function DirtCommandCenter({ compact = false }: { compact?: boolean }) {
  const visibleMetrics = compact ? metricCards.slice(0, 4) : metricCards;

  return (
    <div className={cn('min-w-0 space-y-8', compact && 'space-y-4')} data-dirt-command>
      <div className={cn('flex flex-wrap items-end justify-between gap-3', compact && 'flex-col items-start gap-2')}>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">DIRT command center</p>
          <h2 className={cn('mt-1 font-semibold text-text', compact ? 'text-lg' : 'text-2xl sm:text-3xl')}>
            Executive revenue view
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Synthetic demonstration for {dirtDemo.practice.name} — {dirtDemo.practice.label}. Not client results.
          </p>
        </div>
        <p className="rounded-full border border-border px-3 py-1 text-xs text-signal-amber">{dirtDemo.practice.period}</p>
      </div>

      <div className={cn('grid min-w-0 gap-3', compact ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7')}>
        {visibleMetrics.map((m) => (
          <div key={m.label} className="min-w-0 rounded-[var(--radius-root)] border border-border bg-panel/50 p-4">
            <p className="truncate text-[11px] uppercase tracking-wide text-muted">{m.label}</p>
            <p className="mt-2 truncate text-xl font-semibold text-text">{m.value}</p>
          </div>
        ))}
      </div>

      {!compact ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <ArAgingMatrix />
            <DenialPareto />
          </div>
          <PayerPerformanceTable />
          <div className="grid gap-6 lg:grid-cols-2">
            <UnderpaymentPanel />
            <PriorityQueue />
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-data-blue">
              Expandable triage &amp; explanation
            </h3>
            <NestedDataGridContainer />
          </div>
        </>
      ) : (
        <div className="grid min-w-0 gap-4">
          <ArAgingMatrix />
          <PriorityQueue limit={3} />
        </div>
      )}
    </div>
  );
}

export function ArAgingMatrix() {
  return (
    <div className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-4">
      <h3 className="text-sm font-semibold text-text">A/R aging landscape</h3>
      <p className="mt-1 text-xs text-muted">Recoverability differs by bucket — not one backlog.</p>
      <div className="mt-4 h-56 w-full" role="img" aria-label="A/R aging bar chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dirtDemo.aging}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="bucket" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => formatCompactUsd(Number(v))} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip
              cursor={{ fill: 'rgba(99,102,241,0.08)' }}
              contentStyle={{ background: 'var(--color-panel)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}
              formatter={(value) => [formatCompactUsd(Number(value)), 'A/R']}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {dirtDemo.aging.map((row) => (
                <Cell key={row.bucket} fill={String(row.bucket).includes('120') || String(row.bucket).startsWith('91') ? 'var(--color-signal-amber)' : 'var(--color-accent)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DenialPareto() {
  return (
    <div className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-4">
      <h3 className="text-sm font-semibold text-text">Denial analytics</h3>
      <p className="mt-1 text-xs text-muted">Cause families with value at risk — synthetic events.</p>
      <div className="mt-4 h-56 w-full" role="img" aria-label="Denial category bar chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dirtDemo.denials} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => formatCompactUsd(Number(v))} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="category" width={88} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--color-panel)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}
              formatter={(value, _n, item) => [formatCompactUsd(Number(value)), `${item?.payload?.count ?? ''} events`]}
            />
            <Bar dataKey="value" fill="var(--color-data-blue)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type PayerRow = (typeof dirtDemo.payers)[number];
const payerHelper = createColumnHelper<PayerRow>();
const payerColumns = [
  payerHelper.accessor('payer', { header: 'Payer' }),
  payerHelper.accessor('cleanClaim', { header: 'Clean claim %' }),
  payerHelper.accessor('denialRate', { header: 'Denial %' }),
  payerHelper.accessor('arOver90', {
    header: 'A/R >90',
    cell: (info) => formatCompactUsd(info.getValue()),
  }),
  payerHelper.accessor('trend', { header: 'Trend' }),
];

export function PayerPerformanceTable() {
  const table = useReactTable({ data: dirtDemo.payers, columns: payerColumns, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="min-w-0 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-text">Payer performance</h3>
        <p className="text-xs text-muted">Clean claim, denial rate, and aged A/R by payer group.</p>
      </div>
      <ResponsiveTableShell caption="Payer performance: clean claim rate, denial rate, and aged A/R by payer group" minWidthClassName="min-w-[640px]">
        <thead className="bg-bg-deep/60 text-xs uppercase tracking-wide text-muted">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} scope="col" className="px-4 py-2 font-medium">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-border/80">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2.5 text-text">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </ResponsiveTableShell>
    </div>
  );
}

export function UnderpaymentPanel() {
  return (
    <div className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-4">
      <h3 className="text-sm font-semibold text-text">Underpayment / review opportunities</h3>
      <ul className="mt-4 space-y-3">
        {dirtDemo.underpayments.map((row) => (
          <li key={row.id} className="rounded border border-border/80 bg-bg-soft/40 p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-text">{row.description}</p>
              <span className="text-sm text-accent">{formatCompactUsd(row.amount)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Owner: {row.owner} · Next: {row.next}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PriorityQueue({ limit }: { limit?: number }) {
  const rows = typeof limit === 'number' ? dirtDemo.queue.slice(0, limit) : dirtDemo.queue;
  return (
    <div className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-4">
      <h3 className="text-sm font-semibold text-text">Priority action queue</h3>
      <p className="mt-1 text-xs text-muted">Signal → finding → significance → owner → next action.</p>
      <ol className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.id} className="grid gap-1 border-l-2 border-accent pl-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-signal-amber">{row.priority}</span>
              <span className="text-sm font-medium text-text">{row.signal}</span>
              <span className="text-xs text-accent">{row.significance}</span>
            </div>
            <p className="text-xs text-muted">{row.finding}</p>
            <p className="text-xs text-text">
              <span className="text-muted">Owner:</span> {row.owner} · <span className="text-muted">Next:</span> {row.action}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DirtSignalFlow() {
  return (
    <Section className="!px-0 !py-0">
      <SectionHeader
        eyebrow="Operating logic"
        title="From signal to an owned next action"
        description="Five stages keep evidence hierarchy visible for independent-practice decision makers."
      />
      <ol className="mt-6 grid gap-3 md:grid-cols-5">
        {dirtDemo.signalFlow.map((step, index) => (
          <li key={step.stage} className="rounded-[var(--radius-root)] border border-border bg-panel/50 p-4">
            <span className="text-xs font-semibold text-accent">{String(index + 1).padStart(2, '0')}</span>
            <p className="mt-2 text-sm font-semibold text-text">{step.stage}</p>
            <p className="mt-2 text-xs text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
