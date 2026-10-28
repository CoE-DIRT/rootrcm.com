// Ported from DIRT premium-react-site: src/components/sections/HeroSection.jsx
// ROOT copy/CTA/business-truth substituted for DIRT's commercial text (MERGE-LAW.md).
import type { ReactNode } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { NoPhiBanner } from '@/components/ui/NoPhiBanner';
import { GlassPlaceholder } from '@/components/ui/GlassPlaceholder';
import { useExperiment } from '@/experiments/useExperiment';

export interface HeroSectionProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  supportLine?: ReactNode;
  mockup: ReactNode;
}

export function HeroSection({ eyebrow, title, description, supportLine, mockup }: HeroSectionProps) {
  const heroCta = useExperiment('heroCta');
  const usesPriorityMessage = heroCta.variant === 'fixed-fee';
  const displayEyebrow = usesPriorityMessage ? 'A clearer view of revenue work' : eyebrow;
  // The commercial H1 and opening definition are canonical, not experiment variants.
  // CTA label testing can continue without conflicting with SEO and no-JS copy.
  const displayTitle = title;
  const displayDescription = description;
  return (
    // The "homeHero" / "heroCopy" / "lede" class names are styling hooks (legacy CSS and the light theme target them).
    <section id="hero" className="homeHero root-home-hero relative">
      <div className="hero-photo-backdrop" data-hero-image-placeholder aria-hidden="true">
        <GlassPlaceholder aspect="video" className="h-full">
          <img src="/media/images/home-practice-operations.jpg" alt="" width={1600} height={900} loading="eager" fetchPriority="high" decoding="async" />
        </GlassPlaceholder>
      </div>
      <div
        aria-hidden="true"
        className="root-mesh pointer-events-none absolute inset-x-0 -top-8 h-72 [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
      />
      <div className="root-home-hero-layout relative z-10 mx-auto grid w-full max-w-7xl gap-7 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-9 lg:px-8">
        <div className="heroCopy root-hero-content glass flex flex-col gap-5">
          <div className="root-hero-heading glass-strong">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-data-blue">{displayEyebrow}</p>
            <h1 className="root-home-hero-title measure-exec mt-3 text-balance text-4xl font-semibold leading-[1.08] text-text sm:text-5xl lg:text-[3.5rem]">
              {displayTitle}
            </h1>
            <p className="lede root-home-hero-description measure-hero-support mt-3 text-pretty text-base text-muted md:text-lg">{displayDescription}</p>
          </div>
          <p className="text-sm font-medium text-text">Where revenue cycle management meets data intelligence.</p>
          {supportLine ? <p className="max-w-2xl text-sm text-accent/90">{supportLine}</p> : null}
          <CTAGroup>
            <LinkButton
              href="/diagnostic/"
              variant="outline"
              size="lg"
              data-cta="book-diagnostic"
              data-location="home-hero"
              data-destination="/diagnostic/"
              data-engagement-type="diagnostic"
              {...heroCta.attrs}
            >
              {heroCta.label ?? 'Discover Your Revenue Exposure'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/contact/" variant="primary" size="lg" data-cta="talk-to-root" data-location="home-hero" data-destination="/contact/" data-engagement-type="consultation">
              Free introductory consultation
            </LinkButton>
          </CTAGroup>
          <NoPhiBanner>
            We do not accept PHI through this site. Clinical care stays with your practice — we support the business layer.
          </NoPhiBanner>
          <p className="hero-support-line flex items-center gap-2 text-sm text-muted">
            <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Healthcare revenue intelligence, managed RCM, credentialing, and operational accountability.
          </p>
        </div>
        <div className="root-home-hero-visual min-w-0" aria-label="ROOT operating experience">
          <div className="root-home-hero-photo relative isolate overflow-hidden rounded-[var(--radius-hero)] border border-border">
            <img
              src="/media/images/home-practice-operations.jpg"
              alt="Healthcare practice reception and administrative operations setting."
              width={1600}
              height={900}
              decoding="async"
              loading="eager"
              className="root-home-hero-photo-image h-full w-full object-cover"
            />
            <div className="home-visual-photo-overlay" aria-hidden="true" />
            <div className="root-home-hero-photo-callout glass-strong absolute inset-x-4 top-4 z-10 max-w-[21rem] rounded-[var(--radius-root)] p-4 sm:inset-x-auto sm:left-5 sm:top-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-data-blue">Built around your existing systems</p>
              <p className="mt-1 text-sm font-semibold leading-snug text-text">Billing execution + accountable financial intelligence.</p>
            </div>
          </div>
          <div className="home-visual-dirt-preview" data-hero-dirt-preview>
            {mockup}
          </div>
        </div>
      </div>
    </section>
  );
}
