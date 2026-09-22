// Ported from DIRT premium-react-site: src/components/ui/NoPhiBanner.jsx
import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface NoPhiBannerProps {
  children: ReactNode;
  tone?: 'default' | 'warning';
  className?: string;
}

export function NoPhiBanner({ children, tone = 'default', className }: NoPhiBannerProps) {
  return (
    <aside
      className={cn(
        'rounded-[var(--radius-root)] border p-4 text-sm text-muted',
        tone === 'warning' ? 'border-signal-blush/25 bg-signal-blush/[0.04]' : 'border-data-blue/20 bg-data-blue/[0.04]',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck
          className={cn('mt-0.5 h-4 w-4 shrink-0', tone === 'warning' ? 'text-signal-blush' : 'text-data-blue')}
          aria-hidden="true"
        />
        <p>{children}</p>
      </div>
    </aside>
  );
}
