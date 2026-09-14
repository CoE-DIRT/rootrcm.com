// Ported from DIRT premium-react-site: src/components/ui/StatusPill.jsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type StatusPillTone =
  | 'illustrative'
  | 'planned'
  | 'synthetic'
  | 'neutral'
  | 'info'
  | 'warning'
  | 'success'
  | 'risk';

const toneClass: Record<StatusPillTone, string> = {
  illustrative: 'border-signal-amber/35 bg-signal-amber/12 text-signal-amber',
  planned: 'border-intelligence/35 bg-intelligence/12 text-text',
  synthetic: 'border-data-blue/35 bg-data-blue/12 text-data-blue',
  neutral: 'border-border bg-bg-deep/70 text-muted',
  info: 'border-data-blue/35 bg-data-blue/12 text-data-blue',
  warning: 'border-signal-amber/35 bg-signal-amber/12 text-signal-amber',
  success: 'border-recovery/35 bg-recovery/12 text-recovery',
  risk: 'border-signal-blush/30 bg-signal-blush/12 text-signal-blush',
};

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusPillTone;
}

export function StatusPill({ children, tone = 'neutral', className, ...props }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 min-w-0 max-w-full items-center justify-center whitespace-normal rounded-full border px-3 py-1 text-center text-[11px] font-semibold uppercase leading-[1.15] tracking-[0.13em]',
        toneClass[tone] ?? toneClass.neutral,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
