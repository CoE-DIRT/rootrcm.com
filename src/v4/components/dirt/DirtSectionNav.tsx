// Ported from DIRT premium-react-site: src/components/layout/HomeRow.jsx
// Adapted into a section-anchor nav for /technology/dirt/ (all internal links, stable ids).
import { cn } from '@/lib/cn';

export interface DirtSectionNavItem {
  id: string;
  label: string;
}

export function DirtSectionNav({ items, className }: { items: DirtSectionNavItem[]; className?: string }) {
  return (
    <nav
      aria-label="DIRT page sections"
      className={cn(
        'glass-surface flex w-full max-w-full flex-wrap items-center gap-1 rounded-[var(--radius-panel)] px-2 py-1.5 sm:w-fit sm:rounded-full',
        className,
      )}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rounded-full px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-panel hover:text-text sm:whitespace-nowrap sm:px-3"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
