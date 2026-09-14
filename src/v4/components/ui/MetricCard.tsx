// Ported from DIRT premium-react-site: src/components/ui/MetricCard.jsx
import type { ReactNode } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusPill, type StatusPillTone } from '@/components/ui/StatusPill';
import { cn } from '@/lib/cn';

export interface MetricCardProps {
  label: string;
  displayLabel?: string;
  value: ReactNode;
  note?: ReactNode;
  tone?: StatusPillTone;
  accent?: 'indigo' | 'cyan' | 'green' | 'amber' | 'blush';
  className?: string;
}

export function MetricCard({
  label,
  displayLabel,
  value,
  note,
  tone = 'planned',
  accent = 'indigo',
  className,
}: MetricCardProps) {
  return (
    <GlassCard variant="metric" accent={accent} hover={false} className={cn('h-full min-h-[132px] p-4', className)}>
      <div className="flex h-full flex-col gap-4">
        <div className="min-h-7">
          <StatusPill tone={tone} className="max-w-[12.5rem]" title={label} aria-label={label}>
            {displayLabel ?? label}
          </StatusPill>
        </div>
        <div className="mt-auto min-w-0">
          <p className="truncate text-2xl font-semibold leading-tight text-text">{value}</p>
          {note ? <p className="mt-2 text-xs leading-5 text-muted">{note}</p> : null}
        </div>
      </div>
    </GlassCard>
  );
}
