import { ArrowRight } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { Callout } from '@/components/ui/Callout';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { GlassCard } from '@/components/ui/GlassCard';
import { HeroSection } from '@/components/sections/HeroSection';
import { HeroMockup } from '@/components/sections/HeroMockup';
import { DirtCommandCenter } from '@/components/dirt/DirtCommandCenter';
import { TrustSignals } from '@/components/TrustSignals';
import { usePersonalization } from '@/growth/PersonalizationProvider';
import {
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
      <HeroSection
        eyebrow="Healthcare Revenue Intelligence + Operating Infrastructure"
        title="The intelligence behind healthcare revenue."
        description="ROOT connects revenue cycle management, credentialing, practice operations, and data intelligence to expose financial risk, understand payer performance, and turn findings into accountable action."
        supportLine={personalization.ctaSupport}
        mockup={
          <HeroMockup badge="DIRT product preview">
            <DirtCommandCenter compact />
          </HeroMockup>
        }
      />

      <Section tone="soft">
        <SectionHeader
          eyebrow="The financial blind spots"
          title="Revenue is lost between disconnected workflows."
          description="Denials, underpayments, payer delays, aging A/R, and credentialing gaps often become visible only after they have affected cash flow."
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
            <h2 className="text-2xl font-semibold text-text">Find the cause. Own the next action.</h2>
            <p className="text-muted">
              ROOT connects the financial signals across revenue, payer activity, enrollment, and operations. DIRT identifies patterns and priorities; ROOT connects the findings to real execution.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              {platformNodes.slice(0, 4).map((node: { label: string; copy: string }) => (
                <li key={node.label} className="border-l-2 border-data-blue pl-3">
                  <span className="font-medium text-text">{node.label}</span> — {node.copy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section wide>
        <SectionHeader eyebrow="Connected intelligence + execution" title="One revenue story across every system." description="Your EHR, clearinghouse, payer portals, and financial reports each hold part of the answer. ROOT connects the business process; DIRT connects the signals." align="left" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <GlassCard variant="lifecycle" hover={false} accent="cyan" className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-data-blue">The differentiator</p>
            <h3 className="mt-2 text-xl font-semibold text-text">DIRT · Data Intelligence for Revenue Transformation</h3>
            <p className="mt-3 text-sm text-muted">
              {platformNodes.find((node: { label: string }) => node.label.includes('DIRT'))?.copy}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/technology/dirt/" variant="secondary" size="sm">
                Explore revenue intelligence
              </LinkButton>
              <LinkButton href="/diagnostic/" variant="ghost" size="sm" data-cta="book-diagnostic" data-location="home-operating-model" data-destination="/diagnostic/">
                Discover your revenue exposure
              </LinkButton>
            </div>
          </GlassCard>
          <dl className="divide-y divide-border border-t border-border">
            {platformNodes
              .filter((node: { label: string }) => !node.label.includes('DIRT'))
              .map((node: { label: string; copy: string }) => (
                <div key={node.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="text-sm font-medium text-text">{node.label}</dt>
                  <dd className="text-sm text-muted">{node.copy}</dd>
                </div>
              ))}
          </dl>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="Healthcare operating capabilities"
          title="Intelligence with people and processes behind it."
          description="Managed RCM, credentialing, practice operations, data architecture, and automation—connected around financial performance."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {servicePages.map((service: { slug: string; title: string }) => (
            <a
              key={service.slug}
              href={`/services/${service.slug}/`}
              className="rounded-full border border-border px-4 py-2 text-sm text-text transition-colors hover:border-data-blue/45 hover:text-white"
            >
              {service.title}
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="See the method"
          title="From a revenue signal to a decision."
          description={`Explore synthetic, clearly labeled demonstrations using ${syntheticPractice.name} to see how ROOT connects financial findings to owned corrective action.`}
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-center">
          <MediaFrame
            src={mediaAssets.dirtAnalytics}
            alt="Illustrative analytics workstation. Editorial stock photograph; not ROOT product UI or client data."
            caption="Editorial analytics context — case studies use synthetic data only"
            aspect="wide"
          />
          <div>
            <p className="text-sm text-muted">
              See how payer, denial, A/R, and credentialing signals can be reconciled, prioritized by financial significance, and connected to an accountable next step.
            </p>
            <LinkButton href="/case-studies/" variant="ghost" size="sm" className="mt-6">
              View proof of capability <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
      </Section>

      {diagnostic ? (
        <Section tone="flow" wide>
          <SectionHeader eyebrow="Revenue Intelligence Diagnostic" title="Find the financial exposure worth investigating." description={diagnostic.bestFor} />
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
            Discover your revenue exposure
          </LinkButton>
        </Section>
      ) : null}

      <Section tone="soft">
        <SectionHeader eyebrow="Resources" title="Practical intelligence for healthcare revenue leaders." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceArticles.slice(0, 3).map((article: { slug: string; title: string; summary?: string }) => (
            <a
              key={article.slug}
              href={`/resources/${article.slug}/`}
              className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5 transition-colors hover:border-data-blue/45"
            >
              <p className="text-sm font-medium text-text">{article.title}</p>
              {article.summary ? <p className="mt-2 text-xs text-muted">{article.summary}</p> : null}
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader align="center" eyebrow="Trust" title="Financial intelligence needs dependable evidence." />
        <TrustSignals className="mx-auto mt-8 max-w-3xl" />
        <CTAGroup className="mt-10 justify-center">
          <LinkButton href="/diagnostic/" variant="primary" size="lg" data-cta="book-diagnostic" data-location="home-final-cta" data-destination="/diagnostic/">
            Discover your revenue exposure
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
