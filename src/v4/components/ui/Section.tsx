import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  tone?: 'default' | 'soft';
}

export function Section({ className, children, tone = 'default', ...props }: SectionProps) {
  return (
    <section
      className={cn(
        'w-full py-16 md:py-24',
        tone === 'soft' && 'bg-bg-soft',
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = 'left', className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center text-center', className)}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</span>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-base text-muted">{description}</p> : null}
    </div>
  );
}

export function CTAGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center', className)}>{children}</div>;
}
