// Ported from DIRT premium-react-site: src/components/ui/PipelineCard.jsx
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusPill, type StatusPillTone } from '@/components/ui/StatusPill';
import { cn } from '@/lib/cn';

export interface PipelineCardProps {
  status: string;
  statusTone?: StatusPillTone;
  title: string;
  note: string;
  contract?: string;
  accent?: 'indigo' | 'cyan' | 'green' | 'amber' | 'blush';
  className?: string;
}

export function PipelineCard({ status, statusTone = 'planned', title, note, contract, accent = 'indigo', className }: PipelineCardProps) {
  return (
    <GlassCard variant="glass" accent={accent} className={cn('h-full min-h-[184px] p-4', className)}>
      <div className="flex h-full flex-col gap-4">
        <div className="min-h-7">
          <StatusPill tone={statusTone}>{status}</StatusPill>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold leading-tight text-text">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{note}</p>
        </div>
        {contract ? <p className="text-xs uppercase tracking-[0.14em] text-muted">{contract}</p> : null}
      </div>
    </GlassCard>
  );
}
