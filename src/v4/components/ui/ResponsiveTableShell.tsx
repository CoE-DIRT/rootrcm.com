// Ported from DIRT premium-react-site: src/components/ui/ResponsiveTableShell.jsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ResponsiveTableShellProps {
  children: ReactNode;
  caption?: string;
  label?: string;
  minWidthClassName?: string;
  className?: string;
}

/**
 * One semantic, keyboard-scrollable table region. The focusable wrapper carries the
 * accessible name so screen-reader and keyboard users get labeled horizontal scroll;
 * edge fades are decorative only and never hide data.
 */
export function ResponsiveTableShell({
  children,
  caption,
  label,
  minWidthClassName = 'min-w-[820px]',
  className,
}: ResponsiveTableShellProps) {
  return (
    <div className={cn('glass-surface glass-surface--matrix relative overflow-hidden p-0', className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-8 bg-gradient-to-r from-bg-deep via-bg-deep/84 to-transparent lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-10 bg-gradient-to-l from-bg-deep via-bg-deep/84 to-transparent lg:block" />
      <div
        role="region"
        aria-label={label ?? caption}
        tabIndex={0}
        className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-data-blue [scrollbar-color:rgba(99,102,241,0.24)_transparent] [scrollbar-width:thin]"
      >
        <table className={cn('w-full border-collapse text-left text-sm text-text', minWidthClassName)}>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          {children}
        </table>
      </div>
    </div>
  );
}
