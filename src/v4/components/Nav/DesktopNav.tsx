import { useState } from 'react';
import * as RadixNav from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { primaryNav } from '../../../siteData.js';
import type { NavItem } from './types';
import { isCurrent, isSectionCurrent } from './navState';
import { NavCta } from './NavCta';

const items = primaryNav as NavItem[];

export function DesktopNav({ currentPath }: { currentPath: string }) {
  const [expanded, setExpanded] = useState('');
  return (
    <nav className="hidden min-w-0 xl:block" aria-label="Primary navigation" data-nav="desktop">
      <RadixNav.Root delayDuration={80} skipDelayDuration={100} className="relative" value={expanded} onValueChange={setExpanded} onMouseLeave={() => setExpanded('')}>
        <RadixNav.List className="flex list-none items-center gap-0.5">
          {items.map((item) => item.isCTA ? (
            <RadixNav.Item key={item.href} className="ml-2">
              <NavCta location="header" className="whitespace-nowrap" />
            </RadixNav.Item>
          ) : (
            <RadixNav.Item key={item.href} value={item.label}>
              <RadixNav.Trigger
                type="button"
                aria-label={item.label}
                aria-current={isCurrent(item, currentPath) ? 'page' : isSectionCurrent(item, currentPath) ? 'true' : undefined}
                aria-expanded={expanded === item.label}
                onMouseEnter={() => setExpanded(item.label)}
                onKeyDown={(event) => { if (event.key === 'Escape') setExpanded(''); }}
                data-current={isCurrent(item, currentPath) ? 'page' : isSectionCurrent(item, currentPath) ? 'section' : undefined}
                className="ux-nav-trigger group relative inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-root)] px-3 text-sm font-medium text-text hover:bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                {item.label}
                <ChevronDown className="h-4 w-4 text-muted transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
              </RadixNav.Trigger>
              <RadixNav.Content className="ux-nav-content p-5 md:p-6">
                <div className="mb-4 border-b border-border pb-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{item.label}</p>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
                <ul className="grid list-none grid-cols-2 gap-2 lg:grid-cols-3">
                  {(item.children ?? []).map((child) => (
                    <li key={child.href} className="min-w-0">
                      <RadixNav.Link
                        href={child.href}
                        aria-current={isCurrent(child, currentPath) ? 'page' : undefined}
                        className="ux-nav-child block min-h-14 rounded-[var(--radius-root)] p-2.5 text-text hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                      >
                        <span className="block truncate text-sm font-semibold">{child.label}</span>
                        <span className="mt-1 block truncate text-xs text-muted">{child.description}</span>
                      </RadixNav.Link>
                    </li>
                  ))}
                </ul>
              </RadixNav.Content>
            </RadixNav.Item>
          ))}
        </RadixNav.List>
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2">
          <RadixNav.Viewport className="ux-nav-viewport" />
        </div>
      </RadixNav.Root>
    </nav>
  );
}
