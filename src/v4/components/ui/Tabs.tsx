import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';

export const Tabs = RadixTabs.Root;
export const TabsContent = RadixTabs.Content;

export function TabsList({ className, ...props }: React.ComponentProps<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      className={cn('inline-flex gap-1 rounded-[var(--radius-root)] border border-border bg-panel p-1', className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'rounded-[calc(var(--radius-root)-2px)] px-3 py-1.5 text-sm font-medium text-muted transition-colors',
        'data-[state=active]:bg-accent data-[state=active]:text-accent-ink hover:text-text',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  );
}
