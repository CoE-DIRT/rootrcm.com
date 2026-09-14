// Ported from DIRT premium-react-site: src/components/sections/CompetitiveTable.jsx
// DIRT's source table makes competitive/limitation claims about named competitor
// categories (excluded per docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md — "no market
// facts imported"). This keeps only the responsive table/card structure, reframed as
// a neutral explanation of where ROOT and DIRT sit next to systems a practice already
// runs — no claims about any vendor's limitations or "best-fit buyer".
import { GlassCard } from '@/components/ui/GlassCard';
import { ResponsiveTableShell } from '@/components/ui/ResponsiveTableShell';

const rows = [
  {
    category: 'Primary role',
    root: 'Business-side operating partner',
    dirt: 'Revenue intelligence layer',
    ehr: 'Clinical & practice system of record',
    clearing: 'Claims transaction rails',
  },
  {
    category: 'Data handled',
    root: 'Operational & billing data, no PHI on this site',
    dirt: 'No-PHI operational metadata',
    ehr: 'Clinical & demographic PHI',
    clearing: 'Claims & payer transaction data',
  },
  {
    category: 'Governance',
    root: 'Human-owned execution with named accountability',
    dirt: 'Every recommendation requires human review before action',
    ehr: 'System-bound clinical workflows',
    clearing: 'Transaction & payer-rule driven',
  },
  {
    category: 'Works above the existing stack',
    root: 'Yes — practice keeps its EHR/PM',
    dirt: 'Yes — no system replacement',
    ehr: 'N/A — system of record',
    clearing: 'N/A — transaction layer',
  },
];

const columns: { key: keyof (typeof rows)[number]; label: string; accent?: boolean }[] = [
  { key: 'root', label: 'ROOT', accent: true },
  { key: 'dirt', label: 'DIRT' },
  { key: 'ehr', label: 'EHR / PM systems' },
  { key: 'clearing', label: 'Clearinghouses' },
];

export function CompetitiveTable() {
  return (
    <div className="space-y-4">
      <div className="hidden xl:block">
        <ResponsiveTableShell caption="How ROOT and DIRT fit next to systems a practice already runs" minWidthClassName="min-w-[880px]">
          <thead className="bg-bg-deep/90">
            <tr className="border-b border-border">
              <th scope="col" className="sticky left-0 z-20 bg-bg-deep px-4 py-3 font-semibold text-text">
                Dimension
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={column.accent ? 'px-4 py-3 font-semibold text-accent' : 'px-4 py-3 font-semibold text-muted'}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.category} className="border-b border-border/80 align-top transition-colors hover:bg-intelligence/5">
                <th scope="row" className="sticky left-0 z-10 bg-bg-deep px-4 py-4 font-semibold text-text">
                  {row.category}
                </th>
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 text-muted">
                    {column.accent ? (
                      <div className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-text">
                        {row[column.key as keyof typeof row]}
                      </div>
                    ) : (
                      row[column.key as keyof typeof row]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </ResponsiveTableShell>
      </div>

      <div className="grid gap-4 xl:hidden">
        {rows.map((row) => (
          <GlassCard key={row.category} variant="matrix" accent="indigo" hover={false} className="p-4">
            <h3 className="text-base font-semibold text-text">{row.category}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={
                    column.accent
                      ? 'rounded-[var(--radius-root)] border border-accent/30 bg-accent/10 px-3 py-3'
                      : 'rounded-[var(--radius-root)] border border-border bg-bg-deep/70 px-3 py-3'
                  }
                >
                  <p className={column.accent ? 'text-[11px] font-semibold uppercase tracking-[0.16em] text-accent' : 'text-[11px] font-semibold uppercase tracking-[0.16em] text-muted'}>
                    {column.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text">{row[column.key as keyof typeof row]}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
