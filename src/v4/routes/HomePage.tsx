import { ArrowRight } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { Callout } from '@/components/ui/Callout';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { GlassCard } from '@/components/ui/GlassCard';
import { HeroSection } from '@/components/sections/HeroSection';
import { HeroMockup } from '@/components/sections/HeroMockup';

import { TrustSignals } from '@/components/TrustSignals';
import { usePersonalization } from '@/growth/PersonalizationProvider';
import {
  commercialJourney,
  mediaAssets,
  platformNodes,
  servicePages,
  pricingModels,
  resourceArticles,
} from '../../siteData.js';


import { DirtExecutiveMetrics } from '@/components/dirt/DirtExecutiveMetrics';

const diagnostic = pricingModels.find((model: { name: string }) => model.name === 'Revenue Optimization Diagnostic');

const featureImages = [
  "/media/images/healthcare-operations-collaboration.jpg",
  "/media/images/practice-operations-workstation.jpg",
  "/media/images/practice-admin-workstation.jpg",
  "/media/images/rcm-billing-financial-operations.jpg",
  "/media/images/physician-nurse-coordination.jpg",
  "/media/images/practice-team-collaboration.jpg"
];

const healthcareSegments = [
  { name: 'Behavioral Health Groups', signal: 'Documentation-driven denials, payer enrollment timelines, and revenue visibility across group practices.', href: '/solutions/denials/' },
  { name: 'Ambulatory Surgery Centers', signal: 'Case reimbursement, authorization exposure, payer performance, and facility A/R.', href: '/solutions/revenue-leakage/' },
  { name: 'Office-Based Surgery & Labs', signal: 'Procedure economics, site-of-service workflows, participation, and reimbursement variance.', href: '/solutions/reporting-visibility/' },
  { name: 'Anesthesia Groups', signal: 'Provider enrollment, professional claims, payer follow-up, and aging A/R.', href: '/solutions/credentialing-bottlenecks/' },
  { name: 'Cardiology & Electrophysiology', signal: 'Complex procedures, authorization workflow, payer behavior, and financial visibility.', href: '/solutions/denials/' },
  { name: 'Multispecialty Practices', signal: 'Revenue intelligence by specialty, provider, payer, and location.', href: '/solutions/scaling-practice-ops/' },
];



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
        description="We help independent physician practices and specialty groups connect revenue cycle management, credentialing, practice operations, and data intelligence—so leaders can investigate revenue exposure and assign the next action."
        supportLine={personalization.ctaSupport}
        mockup={
          <HeroMockup badge="DIRT product preview">
            <div className="min-w-0 space-y-3" data-dirt-command><DirtExecutiveMetrics compact /></div>
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
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text">Find the cause. Own the next action.</h2>
            <p className="text-muted">
              We connect the financial signals across revenue, payer activity, enrollment, and operations. Our embedded DIRT capability helps us examine patterns and priorities. We connect validated findings to operating action.
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
        <SectionHeader eyebrow="Connected intelligence + execution" title="One revenue story across every system." description="Your EHR, clearinghouse, payer portals, and financial reports each hold part of the answer. We reconcile those signals and connect the findings to the business process." align="left" />
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
              className="rounded-full border border-border px-4 py-2 text-sm text-text transition-colors hover:border-data-blue/45 hover:bg-panel hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue motion-reduce:transition-none"
            >
              {service.title}
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Built for US healthcare"
          title="Different specialties. One accountable revenue picture."
          description="We work with practice owners, administrators, and revenue leaders. Our focus includes cardiology, vascular, surgical, and multispecialty revenue operations."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {healthcareSegments.map((segment, index) => (
            <a key={segment.name} href={segment.href} className="root-feature-card glass block overflow-hidden rounded-[var(--radius-root)]">
              <div className="aspect-square overflow-hidden bg-panel-solid">
                <img src={featureImages[index]} alt={`Editorial context for ${segment.name}; not a ROOT client or team photo`} width={480} height={480} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-text">{segment.name}</h3>
                <p className="mt-2 text-sm text-muted">{segment.signal}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Explore revenue solution <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="See the method"
          title="From a revenue signal to a decision."
          description="Explore an illustrative operating view to see how revenue signals can be organized, prioritized, and connected to clear next steps. Sample metrics are labeled throughout."
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
              See how ROOT works <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
      </Section>

      {diagnostic ? (
        <Section tone="flow" wide>
          <SectionHeader eyebrow="Revenue Optimization Diagnostic" title="Find the financial exposure worth investigating." description={diagnostic.bestFor} />
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

      <Section>
        <SectionHeader eyebrow="How we work together" title="A clear path from question to action." description="Start with our Diagnostic when you need evidence before deciding. If you already know the service you need, we can scope that work directly." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {commercialJourney.map((step, index) => (
            <GlassCard key={step.title} as="div" hover={false} className="p-5">
              <p className="text-xs font-semibold text-accent">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-text">{step.title}</h3>
              <p className="mt-3 text-sm text-muted">{step.copy}</p>
              <LinkButton href={step.href} variant="ghost" size="sm" className="mt-4">Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" /></LinkButton>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeader eyebrow="Resources" title="Practical intelligence for healthcare revenue leaders." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceArticles.slice(0, 3).map((article: { slug: string; title: string; summary?: string }) => (
            <a
              key={article.slug}
              href={`/resources/${article.slug}/`}
              className="glass rounded-[var(--radius-root)] p-5 transition-colors hover:border-data-blue/45"
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
          We do not accept PHI through this site. Diagnostic engagements use deidentified operational data only.
        </Callout>
      </Section>
    </>
  );
}
