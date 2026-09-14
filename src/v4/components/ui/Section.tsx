import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** 'shell'/'grid'/'safe'/'flow' apply the DIRT glass section-shell treatment (docs/final-merge/DESIGN-TOKEN-MERGE.md). */
  tone?: 'default' | 'soft' | 'shell' | 'grid' | 'safe' | 'flow';
  /** Widen the inner content rail for dense DIRT surfaces (tables, dashboards). */
  wide?: boolean;
}

const shellTones = new Set(['shell', 'grid', 'safe', 'flow']);

export function Section({ className, children, tone = 'default', wide = false, ...props }: SectionProps) {
  const isShell = shellTones.has(tone);
  return (
    <section
      className={cn(
        'w-full py-16 md:py-24',
        tone === 'soft' && 'bg-bg-soft',
        className,
      )}
      {...props}
    >
      <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', wide ? 'max-w-7xl' : 'max-w-6xl')}>
        {isShell ? (
          <div
            className={cn(
              'section-shell',
              tone === 'grid' && 'section-shell--grid',
              tone === 'safe' && 'section-shell--safe',
              tone === 'flow' && 'section-shell--flow',
            )}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = 'left', className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center text-center', className)}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-data-blue">{eyebrow}</span>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h2>
      {description ? (
        <p className={cn('text-pretty max-w-2xl text-base text-muted', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      ) : null}
      <div
        aria-hidden="true"
        className={cn(
          'h-px w-24 bg-gradient-to-r from-data-blue/70 via-intelligence/55 to-transparent',
          align === 'center' && 'mx-auto',
        )}
      />
    </div>
  );
}

export function CTAGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center', className)}>{children}</div>;
}
