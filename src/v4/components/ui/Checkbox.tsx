import { forwardRef } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {
  label?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkbox = (
      <RadixCheckbox.Root
        ref={ref}
        id={id}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-panel ' +
            'data-[state=checked]:bg-accent data-[state=checked]:border-accent ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          className,
        )}
        {...props}
      >
        <RadixCheckbox.Indicator>
          <Check className="h-3.5 w-3.5 text-accent-ink" strokeWidth={3} />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    );
    if (!label) return checkbox;
    return (
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-sm text-text">
        {checkbox}
        <span>{label}</span>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
