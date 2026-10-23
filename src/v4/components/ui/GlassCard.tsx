// Ported from DIRT premium-react-site: src/components/ui/GlassCard.jsx
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type GlassCardVariant = 'glass' | 'readable' | 'metric' | 'matrix' | 'lifecycle' | 'trust' | 'solution';
type GlassCardAccent = 'indigo' | 'cyan' | 'green' | 'amber' | 'blush';

const variantClass: Record<GlassCardVariant, string> = {
  glass: 'glass-surface',
  readable: 'glass-surface glass-surface--readable',
  metric: 'glass-surface glass-surface--metric',
  matrix: 'glass-surface glass-surface--matrix',
  lifecycle: 'glass-surface glass-surface--lifecycle',
  trust: 'glass-surface glass-surface--trust',
  solution: 'glass-surface glass-surface--matrix',
};

const accentClass: Record<GlassCardAccent, string> = {
  indigo: 'from-intelligence/80 to-intelligence-soft/35',
  cyan: 'from-data-blue/80 to-data-blue/35',
  green: 'from-recovery/80 to-data-blue/30',
  amber: 'from-signal-amber/75 to-signal-error/28',
  blush: 'from-signal-blush/80 to-signal-error/35',
};

export interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  hover?: boolean;
  variant?: GlassCardVariant;
  accent?: GlassCardAccent;
}

/**
 * `as` renders the requested element as the actual root — className and all other
 * props land on it, not on an inner wrapper. (Rendering `Comp` as an inner child
 * while props stayed on an outer `div` broke layout callers like `TrustSignals`,
 * where a flex className on the "root" never reached the element that needed it.)
 */
export function GlassCard({
  as: Comp = 'article',
  children,
  className,
  hover = true,
  variant = 'glass',
  accent,
  ...props
}: GlassCardProps) {
  return (
    <Comp
      className={cn(
        'relative min-w-0 overflow-hidden rounded-[var(--radius-panel)] p-5 transition-premium',
        hover &&
          'duration-300 ease-out hover:border-[var(--glass-border)] hover:shadow-[var(--shadow-glass-3)] motion-reduce:transition-none',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {accent ? (
        <div
          aria-hidden="true"
          className={cn('pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r', accentClass[accent])}
        />
      ) : null}
      {children}
    </Comp>
  );
}
