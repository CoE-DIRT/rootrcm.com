// Ported from DIRT premium-react-site: src/components/sections/HeroSection.jsx
// ROOT copy/CTA/business-truth substituted for DIRT's commercial text (MERGE-LAW.md).
import type { ReactNode } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { NoPhiBanner } from '@/components/ui/NoPhiBanner';
import { useExperiment } from '@/experiments/useExperiment';
import { mediaAssets } from '../../../siteData.js';

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
  const displayTitle = usesPriorityMessage ? 'Find the revenue work worth doing first.' : title;
  const displayDescription = usesPriorityMessage
    ? 'Connect revenue-cycle, payer, and practice-operations signals to a prioritized view with clear owners and next steps.'
    : description;
  return (
    // The "homeHero" / "heroCopy" / "lede" class names are styling hooks (legacy CSS and the light theme target them).
    <section id="hero" className="homeHero relative isolate overflow-hidden">
      <div className="root-hero-media pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={mediaAssets.homePracticeOperations}
          width={1600}
          height={900}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="root-mesh pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:px-8">
        <div className="heroCopy root-hero-glass flex flex-col gap-5">
          <div className="hero-reading-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-data-blue">{displayEyebrow}</p>
            <h1 className="measure-exec mt-3 text-balance text-4xl font-semibold leading-[1.08] text-text sm:text-5xl lg:text-[3.5rem]">
              {displayTitle}
            </h1>
            <p className="lede measure-hero-support mt-4 text-pretty text-base text-muted md:text-lg">{displayDescription}</p>
          </div>
          <p className="text-sm font-medium text-text">Where revenue cycle management meets data intelligence.</p>
          {supportLine ? <p className="max-w-2xl text-sm text-accent/90">{supportLine}</p> : null}
          <CTAGroup>
            <LinkButton
              href="/diagnostic/"
              variant="primary"
              size="lg"
              data-cta="book-diagnostic"
              data-location="home-hero"
              data-destination="/diagnostic/"
              data-engagement-type="diagnostic"
              {...heroCta.attrs}
            >
              {heroCta.label ?? 'Discover Your Revenue Exposure'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/contact/" variant="outline" size="lg" data-cta="talk-to-root" data-location="home-hero">
              Talk to ROOT
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
        {mockup}
      </div>
    </section>
  );
}
