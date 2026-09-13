import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const fieldStyles =
  'w-full rounded-[var(--radius-root)] border border-border bg-panel px-4 py-3 text-sm text-text ' +
  'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ' +
  'disabled:pointer-events-none disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldStyles, className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldStyles, 'min-h-32 resize-y', className)} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn('text-sm font-medium text-text', className)} {...props} />
  ),
);
Label.displayName = 'Label';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, hint, required, children }: FormFieldProps) {
  const hintId = useId();
  const errorId = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden="true" className="text-accent"> *</span> : null}
      </Label>
      {children}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-signal-amber">
          {error}
        </p>
      ) : null}
    </div>
  );
}
