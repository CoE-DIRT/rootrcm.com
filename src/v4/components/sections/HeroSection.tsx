// Ported from DIRT premium-react-site: src/components/sections/HeroSection.jsx
// ROOT copy/CTA/business-truth substituted for DIRT's commercial text (MERGE-LAW.md).
import type { ReactNode } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { NoPhiBanner } from '@/components/ui/NoPhiBanner';

export interface HeroSectionProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  supportLine?: ReactNode;
  mockup: ReactNode;
}

export function HeroSection({ eyebrow, title, description, supportLine, mockup }: HeroSectionProps) {
  return (
    // "homeHero" + "heroCopy"/"lede" hooks are read directly by src/experiments.js
    // (applyPageExperiment) for the live home-hero A/B test — keep them even though
    // this component now owns the DIRT-led markup/visual system.
    <section id="hero" className="homeHero relative" data-reveal>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-8 h-64 bg-[radial-gradient(circle_at_18%_10%,rgba(99,102,241,0.22),transparent_45%)]"
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:px-8">
        <div className="heroCopy flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-data-blue">{eyebrow}</p>
          <h1 className="measure-exec text-balance text-4xl font-semibold leading-[1.08] text-text sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          <p className="lede measure-hero-support text-pretty text-base text-muted md:text-lg">{description}</p>
          <p className="text-sm font-medium text-text">One operating partner for the business side of medicine.</p>
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
            >
              Start the $2,500 Diagnostic <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/contact/" variant="outline" size="lg" data-cta="talk-to-root" data-location="home-hero">
              Talk to ROOT
            </LinkButton>
          </CTAGroup>
          <NoPhiBanner>
            No PHI is collected on this site. Clinical care stays with your practice — ROOT runs the business layer.
          </NoPhiBanner>
          <p className="hero-support-line flex items-center gap-2 text-sm text-muted">
            <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Independent-practice operating partner for billing, denials, A/R, credentialing, and technology.
          </p>
        </div>
        {mockup}
      </div>
    </section>
  );
}
