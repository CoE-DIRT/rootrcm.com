import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { primaryNav } from '../../../siteData.js';
import type { NavItem } from './types';
import { isCurrent, isSectionCurrent } from './navState';
import { NavCta } from './NavCta';

const items = primaryNav.filter((item) => !item.isCTA) as NavItem[];

export function MobileNav({ currentPath, onOpenChange }: { currentPath: string; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
    if (next) window.dispatchEvent(new CustomEvent('root:nav-open'));
  };
  return (
    <Dialog.Root open={open} onOpenChange={change}>
      <Dialog.Trigger asChild>
        <button type="button" aria-label="Open menu" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text hover:bg-panel focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] xl:hidden">
          <Menu size={20} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="root-mobile-scrim fixed inset-0 z-50" />
        <Dialog.Content className="ux-nav-mobile-sheet fixed inset-0 z-[60] flex h-[100dvh] w-screen flex-col overflow-hidden text-text focus:outline-none xl:hidden" aria-describedby={undefined} aria-modal="true">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
            <Dialog.Title className="text-lg font-semibold">Menu</Dialog.Title>
            <Dialog.Close aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]">
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
            <Accordion.Root type="multiple" className="space-y-2">
              {items.map((item) => (
                <Accordion.Item value={item.label} key={item.href} className="rounded-[var(--radius-root)] border border-border">
                  <Accordion.Header>
                    <Accordion.Trigger
                      aria-current={isCurrent(item, currentPath) ? 'page' : isSectionCurrent(item, currentPath) ? 'true' : undefined}
                      data-current={isCurrent(item, currentPath) ? 'page' : isSectionCurrent(item, currentPath) ? 'section' : undefined}
                      className="group flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--radius-root)] px-4 text-left font-medium focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                    >
                      {item.label}
                      <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden pb-3">
                    <ul className="space-y-1 px-2">
                      {(item.children ?? []).map((child) => (
                        <li key={child.href}>
                          <a href={child.href} onClick={() => change(false)}
                            aria-current={isCurrent(child, currentPath) ? 'page' : undefined}
                            className="block min-h-12 rounded-[var(--radius-root)] px-3 py-2 text-sm hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                          >
                            <span className="block font-semibold">{child.label}</span>
                            <span className="block truncate text-xs text-muted">{child.description}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </nav>
          <div className="ux-nav-mobile-action shrink-0 border-t border-border bg-[var(--surface-glass)] px-5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-4">
            <NavCta location="mobile-nav" className="flex w-full justify-center" onClick={() => change(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
