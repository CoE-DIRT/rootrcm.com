import { ArrowRight, ShieldCheck } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { Callout } from '@/components/ui/Callout';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { DirtCommandCenter } from '@/components/dirt/DirtCommandCenter';
import { TrustSignals } from '@/components/TrustSignals';
import { usePersonalization } from '@/growth/PersonalizationProvider';
import {
  brandAssets,
  mediaAssets,
  platformNodes,
  servicePages,
  pricingModels,
  resourceArticles,
} from '../../siteData.js';
import { syntheticPractice } from '../../proofData.js';

const diagnostic = pricingModels.find((model: { name: string }) => model.name === 'Revenue Optimization Diagnostic');

export function HomePage() {
  return (
    <V4Shell>
      <HomePageContent />
    </V4Shell>
  );
}

function HomePageContent() {
  const personalization = usePersonalization();

  return (
    <>
      {/* Full-bleed hero */}
      <section className="homeHero relative isolate overflow-hidden" data-reveal>
        <div className="absolute inset-0 -z-10">
          <img
            src={mediaAssets.homePracticeOperations}
            alt=""
            className="h-full w-full object-cover object-center opacity-40"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />
        </div>

        <div className="heroCopy mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-8 lg:pb-20">
          <div>
            <div className="flex items-center gap-3">
              <img src={brandAssets.mark} alt="ROOT" width={40} height={40} className="h-10 w-10" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">ROOT</p>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              RCM + Operations + Technology
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">
              Run the business side of medicine better.
            </h1>
            <p className="lede mt-4 max-w-xl text-lg text-muted">
              ROOT is the operating partner for independent physician practices — managing billing, denials, A/R,
              credentialing, practice operations, and technology.
            </p>
            <p className="mt-3 text-sm font-medium text-text">
              One operating partner for the business side of medicine.
            </p>
            <p className="mt-3 text-sm text-accent/90">{personalization.ctaSupport}</p>
            <CTAGroup className="mt-8">
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
            <p className="mt-6 flex items-center gap-2 text-sm text-muted">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Clinical care stays with your practice. ROOT runs the business layer.
            </p>
          </div>
          <div className="rounded-[var(--radius-root)] border border-border bg-panel/70 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">DIRT product preview</p>
            <p className="mt-2 text-sm text-muted">
              Signal → finding → financial significance → owner → next action — for practice leadership, not only analysts.
            </p>
            <div className="mt-4 max-h-[320px] overflow-hidden">
              <DirtCommandCenter compact />
            </div>
            <LinkButton href="/technology/dirt/" variant="secondary" size="sm" className="mt-4">
              Explore DIRT
            </LinkButton>
          </div>
        </div>
      </section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="Where work gets stuck"
          title="Where work gets stuck"
          description="Revenue leakage, aging A/R, and credentialing bottlenecks compound quietly across the practice business."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <MediaFrame
            src={mediaAssets.practiceTeamCollaboration}
            alt="Practice team collaborating on operations. Editorial stock photograph; not ROOT staff or clients."
            caption="Editorial operations context — not a client claim"
            aspect="video"
            priority
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text">How ROOT helps</h2>
            <p className="text-muted">
              ROOT treats billing, denials, A/R, credentialing, and reporting as one operating system — then uses DIRT to
              rank what to fix first.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              {platformNodes.slice(0, 4).map((node: { label: string; copy: string }) => (
                <li key={node.label} className="border-l-2 border-accent pl-3">
                  <span className="font-medium text-text">{node.label}</span> — {node.copy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Operating model" title="One partner across the practice business." align="left" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platformNodes.map((node: { label: string; copy: string }) => (
            <div key={node.label} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
              <p className="text-sm font-semibold text-text">{node.label}</p>
              <p className="mt-2 text-sm text-muted">{node.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="Service families"
          title="Services that stay owned"
          description="Revenue operations, practice operations, and technology as visible service groups."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {servicePages.map((service: { slug: string; title: string }) => (
            <a
              key={service.slug}
              href={`/services/${service.slug}/`}
              className="rounded-[var(--radius-root)] border border-border px-4 py-2 text-sm text-text hover:border-accent"
            >
              {service.title}
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Proof of capability"
          title="See how ROOT structures the work"
          description={`Illustrative case studies using synthetic data such as ${syntheticPractice.name} — never presented as verified client outcomes.`}
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-center">
          <MediaFrame
            src="/assets/case-studies/dirt-poc-01/previews/master-infographic.png"
            alt="DIRT proof-of-concept infographic preview. Anonymized illustrative artifact."
            caption="Anonymized proof artifact — publication review may apply"
            aspect="wide"
          />
          <div>
            <p className="text-sm text-muted">
              Fictional practice scenarios and synthetic operating exports show how ROOT connects leakage signals to
              owners and next actions.
            </p>
            <LinkButton href="/case-studies/" variant="ghost" size="sm" className="mt-6">
              View proof of capability <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
      </Section>

      {diagnostic ? (
        <Section tone="soft">
          <SectionHeader eyebrow="START HERE" title="$2,500 fixed. A clear plan." description={diagnostic.bestFor} />
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <p className="text-2xl font-semibold text-accent">{diagnostic.price}</p>
            <ul className="flex flex-wrap gap-2 text-xs text-muted">
              {diagnostic.includes.map((item: string) => (
                <li key={item} className="rounded-full border border-border px-3 py-1">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <LinkButton
            href={diagnostic.href}
            variant="primary"
            size="md"
            className="mt-6"
            data-cta="book-diagnostic"
            data-location="home-pricing"
            data-destination="/diagnostic/"
          >
            Start the $2,500 Diagnostic
          </LinkButton>
        </Section>
      ) : null}

      <Section>
        <SectionHeader eyebrow="Know what to act on next" title="Know what to act on next." description="DIRT intelligence for practice leadership." />
        <MediaFrame
          src={mediaAssets.dirtAnalytics}
          alt="Illustrative analytics workstation. Editorial stock photograph; not ROOT product UI or client data."
          caption="Editorial analytics context — live DIRT surfaces use synthetic demo data only"
          className="mt-8"
          aspect="video"
        />
        <LinkButton href="/technology/dirt/" variant="secondary" size="sm" className="mt-6">
          Open DIRT command center
        </LinkButton>
      </Section>

      <Section tone="soft">
        <SectionHeader eyebrow="Resources" title="Operating knowledge, not filler." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceArticles.slice(0, 3).map((article: { slug: string; title: string; summary?: string }) => (
            <a
              key={article.slug}
              href={`/resources/${article.slug}/`}
              className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5 hover:border-accent"
            >
              <p className="text-sm font-medium text-text">{article.title}</p>
              {article.summary ? <p className="mt-2 text-xs text-muted">{article.summary}</p> : null}
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader align="center" eyebrow="Trust" title="What we can stand behind." />
        <TrustSignals className="mx-auto mt-8 max-w-3xl" />
        <CTAGroup className="mt-10 justify-center">
          <LinkButton href="/diagnostic/" variant="primary" size="lg" data-cta="book-diagnostic" data-location="home-final-cta" data-destination="/diagnostic/">
            Start the $2,500 Diagnostic
          </LinkButton>
          <LinkButton href="/contact/" variant="outline" size="lg">
            Talk to ROOT
          </LinkButton>
        </CTAGroup>
        <Callout tone="compliance" className="mx-auto mt-8 max-w-xl">
          No PHI is collected on this site. Diagnostic engagements use deidentified operational data only.
        </Callout>
      </Section>
    </>
  );
}
