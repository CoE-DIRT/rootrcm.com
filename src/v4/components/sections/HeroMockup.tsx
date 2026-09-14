// Ported from DIRT premium-react-site: src/components/sections/HeroMockup.jsx
// Adapted as a reusable "command viewframe" shell — the DIRT source hard-codes
// fictional dollar rows (flagged in docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md);
// ROOT instead frames its own interactive dirtDemo-backed preview as children.
import type { ReactNode } from 'react';
import { FileChartColumnIncreasing, SearchCheck, ShieldCheck } from 'lucide-react';

export interface HeroMockupProps {
  label?: string;
  badge?: ReactNode;
  children: ReactNode;
}

export function HeroMockup({ label = 'Command Viewframe', badge, children }: HeroMockupProps) {
  return (
    <div className="glass-surface glass-surface--matrix relative overflow-hidden rounded-[var(--radius-hero)] p-4 sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_44%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(90deg,rgba(15,23,42,0.08),rgba(99,102,241,0.15),rgba(15,23,42,0.08))]"
      />
      <div className="relative">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:mb-3">{label}</p>
        {badge ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-intelligence/25 bg-intelligence/10 px-3 py-1 text-xs font-semibold text-data-blue sm:mb-4">
            <FileChartColumnIncreasing className="h-3.5 w-3.5" aria-hidden="true" />
            {badge}
          </div>
        ) : null}

        <div
          role="region"
          aria-label={`${label} preview`}
          className="hero-mockup-scroll min-w-0 overflow-x-hidden"
        >
          {children}
        </div>

        <div className="mt-3 grid gap-2 rounded-[var(--radius-root)] border border-border bg-bg-deep/70 p-3 text-xs text-muted sm:mt-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <SearchCheck className="h-4 w-4 shrink-0 text-recovery" aria-hidden="true" /> Synthetic demo data only
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-data-blue" aria-hidden="true" /> Human-reviewed decision framing
          </div>
        </div>
      </div>
    </div>
  );
}
