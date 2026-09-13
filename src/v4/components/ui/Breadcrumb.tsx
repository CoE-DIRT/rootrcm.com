import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.label}>
              <li className="flex items-center gap-1.5">
                {item.href && !isLast ? (
                  <a href={item.href} className="hover:text-text">
                    {item.label}
                  </a>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-text' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast ? <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
