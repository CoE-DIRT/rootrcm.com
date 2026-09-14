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
        'rounded-[var(--radius-root)] border p-4 text-sm text-muted shadow-[var(--shadow-panel-soft)] backdrop-blur-[20px]',
        tone === 'warning'
          ? 'border-signal-blush/28 bg-[linear-gradient(135deg,rgba(236,72,153,0.08),rgba(244,63,94,0.06))]'
          : 'border-data-blue/25 bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(99,102,241,0.06))]',
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
