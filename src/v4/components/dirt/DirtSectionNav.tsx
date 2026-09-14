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
      className={cn('glass-surface flex w-fit max-w-full flex-wrap items-center gap-1 rounded-full px-2 py-1.5', className)}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-panel hover:text-text"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
