import * as RadixNav from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export const NavigationMenu = RadixNav.Root;
export const NavigationMenuList = RadixNav.List;
export const NavigationMenuLink = RadixNav.Link;

export function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof RadixNav.Item>) {
  return <RadixNav.Item className={cn('relative', className)} {...props} />;
}

export function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<typeof RadixNav.Trigger>) {
  return (
    <RadixNav.Trigger
      className={cn(
        'group flex items-center gap-1 rounded-[var(--radius-root)] px-3 py-2 text-sm font-medium text-text',
        'hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-3.5 w-3.5 text-muted transition-transform duration-150 group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
    </RadixNav.Trigger>
  );
}

export function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof RadixNav.Content>) {
  return (
    <RadixNav.Content
      className={cn(
        'absolute left-0 top-full z-50 mt-2 w-[min(90vw,640px)] rounded-[var(--radius-root)] border border-border bg-panel-solid bg-panel p-6 shadow-root',
        className,
      )}
      {...props}
    />
  );
}
