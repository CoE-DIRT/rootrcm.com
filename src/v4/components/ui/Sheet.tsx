import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const Sheet = RadixDialog.Root;
export const SheetTrigger = RadixDialog.Trigger;

export function SheetContent({
  children,
  title,
  side = 'right',
  className,
}: {
  children: ReactNode;
  title: string;
  side?: 'left' | 'right';
  className?: string;
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm" />
      <RadixDialog.Content
        className={cn(
          'fixed top-0 z-50 h-full w-[min(360px,100%)] overflow-y-auto border-border bg-panel-solid bg-panel p-6 ' +
            'shadow-root focus:outline-none',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          className,
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <RadixDialog.Title className="text-base font-semibold text-text">{title}</RadixDialog.Title>
          <RadixDialog.Close
            aria-label="Close menu"
            className="rounded-full p-1.5 text-muted hover:bg-bg-soft hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-5 w-5" />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
