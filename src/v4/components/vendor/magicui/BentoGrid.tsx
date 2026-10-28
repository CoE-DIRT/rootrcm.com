/**
 * Adapted from Magic UI Bento Grid (MIT).
 * Original: https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/bento-grid.tsx
 * Copyright (c) Magic UI. See LICENSE.magicui.md.
 *
 * Adaptation: preserve real <a> navigation, visible CTAs without hover,
 * ROOT design tokens and mobile-first sizing; no Next.js or icon package required.
 */
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export function BentoGrid({ children, className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3', className)}
    >
      {children}
    </div>
  );
}

export interface BentoCardProps extends Omit<ComponentPropsWithoutRef<'article'>, 'title'> {
  name: string;
  description: string;
  href: string;
  cta: string;
  icon: ReactNode;
  media?: { src: string; alt: string };
  number?: string;
}

export function BentoCard({
  name, description, href, cta, icon, media, number, className, ...props
}: BentoCardProps) {
  return (
    <article
      {...props}
      className={cn(
        'root-commercial-bento group relative flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-panel)]',
        'glass-surface glass-strong transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none',
        className,
      )}
    >
      {media ? (
        <div className="root-commercial-bento-image relative aspect-[2/1] min-h-0 overflow-hidden bg-panel-solid">
          <img
            src={media.src}
            alt={media.alt}
            width={800}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.035] motion-reduce:transition-none"
          />
        </div>
      ) : (
        <div className="root-commercial-bento-symbol relative flex min-h-32 items-end justify-between overflow-hidden border-b border-border px-6 pb-5 pt-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-root)] border border-border bg-panel text-data-blue">
            {icon}
          </span>
          <span className="text-xs font-semibold tracking-[0.15em] text-muted" aria-hidden="true">{number}</span>
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-6">
        {media ? (
          <span className="text-xs font-semibold tracking-[0.16em] text-data-blue" aria-hidden="true">
            {number}
          </span>
        ) : null}
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-text">{name}</h3>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
        <a
          href={href}
          className="root-commercial-bento-link mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-3 text-sm font-semibold text-accent no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue"
        >
          {cta} <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">: {name}</span>
        </a>
      </div>
    </article>
  );
}
