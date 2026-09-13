import type { ReactNode } from 'react';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

const icons = { info: Info, warning: AlertTriangle, compliance: ShieldCheck } as const;

export interface CalloutProps {
  tone?: keyof typeof icons;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Callout({ tone = 'info', title, children, className }: CalloutProps) {
  const Icon = icons[tone];
  return (
    <div
      role={tone === 'warning' ? 'alert' : 'note'}
      className={cn(
        'flex gap-3 rounded-[var(--radius-root)] border border-border bg-panel/60 p-4 text-sm text-muted',
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <div>
        {title ? <p className="mb-1 font-medium text-text">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-root)] border border-dashed border-border p-10 text-center">
      <p className="text-sm font-medium text-text">{title}</p>
      {description ? <p className="text-sm text-muted">{description}</p> : null}
    </div>
  );
}

export function ErrorState({ title, description }: { title: string; description?: string }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded-[var(--radius-root)] border border-signal-amber/40 bg-signal-amber/5 p-10 text-center">
      <p className="text-sm font-medium text-text">{title}</p>
      {description ? <p className="text-sm text-muted">{description}</p> : null}
    </div>
  );
}
