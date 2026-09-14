// Ported from DIRT premium-react-site: src/components/ui/ConversionPanel.jsx
import type { ReactNode } from 'react';
import { CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export interface ConversionPanelProps {
  title: ReactNode;
  text: ReactNode;
  primaryText: string;
  primaryHref: string;
  primaryProps?: Record<string, string>;
  secondaryText?: string;
  secondaryHref?: string;
  className?: string;
}

export function ConversionPanel({
  title,
  text,
  primaryText,
  primaryHref,
  primaryProps,
  secondaryText = 'Contact',
  secondaryHref = '/contact/',
  className,
}: ConversionPanelProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-panel)] border border-border bg-[linear-gradient(135deg,rgba(15,23,42,0.82),rgba(7,11,18,0.96))] p-6 shadow-[var(--shadow-root)] md:p-8',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-10 h-44 w-44 rounded-full bg-data-blue/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/70 via-intelligence/55 to-transparent"
      />
      <h3 className="text-xl font-semibold text-text md:text-3xl">{title}</h3>
      <p className="mt-3 max-w-3xl text-sm text-muted md:text-base">{text}</p>
      <CTAGroup className="mt-5">
        <LinkButton href={primaryHref} variant="primary" size="md" {...primaryProps}>
          {primaryText}
        </LinkButton>
        <LinkButton href={secondaryHref} variant="outline" size="md">
          {secondaryText}
        </LinkButton>
      </CTAGroup>
    </section>
  );
}
