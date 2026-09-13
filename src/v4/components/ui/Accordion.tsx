import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Accordion = RadixAccordion.Root;

export function AccordionItem({ value, trigger, children }: { value: string; trigger: string; children: React.ReactNode }) {
  return (
    <RadixAccordion.Item value={value} className="border-b border-border">
      <RadixAccordion.Header>
        <RadixAccordion.Trigger
          className={cn(
            'group flex w-full items-center justify-between py-4 text-left text-sm font-medium text-text',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          )}
        >
          {trigger}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform duration-150 group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="pb-4 text-sm text-muted data-[state=open]:animate-in data-[state=closed]:animate-out">
        {children}
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
}
