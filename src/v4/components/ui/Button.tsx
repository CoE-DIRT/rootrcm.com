import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium ' +
    'transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-[var(--ease-premium)] ' +
    'focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-data-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg ' +
    'disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-ink hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(112,224,173,0.35)]',
        secondary: 'border border-border bg-panel text-text hover:-translate-y-0.5 hover:border-data-blue/45 hover:bg-panel/70',
        outline: 'border border-border text-text hover:-translate-y-0.5 hover:border-data-blue/45 hover:bg-panel',
        ghost: 'text-text hover:bg-panel',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-11 px-5',
        lg: 'h-13 px-7 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export interface LinkButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <a ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
LinkButton.displayName = 'LinkButton';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, children, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-root)] text-text ' +
          'hover:bg-panel transition-colors focus-visible:outline-none focus-visible:ring-2 ' +
          'focus-visible:ring-accent motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = 'IconButton';
