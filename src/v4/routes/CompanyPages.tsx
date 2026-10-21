import { useEffect, useRef } from 'react';
import { ChevronDown, ShieldCheck, Linkedin, Github, ArrowUpRight, Mail, Phone, MessageCircle } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { TrustSignals } from '@/components/TrustSignals';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Callout } from '@/components/ui/Callout';
import { GlassCard } from '@/components/ui/GlassCard';
import { WorkforceGrid } from '@/components/sections/WorkforceGrid';
import InquiryForm from '../../components/InquiryForm.jsx';
import { attachFormFrictionListeners } from '@/analytics/formFriction';
import { companyInfo, outreachChannels, mediaAssets, pricingModels, leadershipProfiles } from '../../siteData.js';
import { faqGroups, faqItems } from '../../faqData.js';

export function ContactPage() {
  const formWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = formWrapRef.current?.querySelector('form');
    if (!form) return undefined;
    return attachFormFrictionListeners(form, 'contact-inquiry');
  }, []);

  const live = outreachChannels.filter((c: { status: string; href?: string }) => c.status === 'Live' && c.href);

  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Contact ROOT</p>
            <h1 className="mt-3 text-4xl font-semibold text-text sm:text-5xl">
              Bring us the revenue question your systems cannot answer.
            </h1>
            <p className="mt-4 text-lg text-muted">
              Tell ROOT about your financial visibility, payer performance, aging A/R, denial patterns, credentialing, or growth challenge. We will identify the right commercial next step.
            </p>
            <p className="mt-6 flex items-start gap-2 text-sm text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
              Do not submit PHI through this website.
            </p>
            <div className="mt-8 space-y-2 text-sm text-muted">
              <p className="font-medium text-text">{companyInfo.legalName}</p>
              {companyInfo.addressLines.map((line: string) => (
                <p key={line}>{line}</p>
              ))}
              <p>{companyInfo.phone}</p>
              <p>{companyInfo.email}</p>
            </div>
          </div>
          <GlassCard as="div" variant="glass" hover={false} id="contact-form" className="ph-no-capture p-4" data-ph-mask>
            <div ref={formWrapRef}>
              <InquiryForm />
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeader title="Live outreach channels" description="Chatbot and virtual front desk are planned — not available yet." />
        <div className="mt-6 flex flex-wrap gap-3">
          {live.map((channel: { label: string; href?: string; cta: string; engagementType: string }) => (
            <a
              key={channel.label}
              href={channel.href}
              data-cta={channel.cta}
              data-location="contact-page-outreach"
              data-engagement-type={channel.engagementType}
              className="rounded-full border border-border px-4 py-2 text-sm text-text transition-colors hover:border-data-blue/45"
              target={channel.href?.startsWith('http') ? '_blank' : undefined}
              rel={channel.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {channel.label}
            </a>
          ))}
        </div>
        <TrustSignals className="mt-10" />
        <MediaFrame
          src={mediaAssets.practiceConsultation}
          alt="Practice consultation context. Editorial stock photograph; not ROOT staff or clients."
          caption="Editorial consultation context"
          className="mt-10"
          aspect="wide"
        />
      </Section>
    </V4Shell>
  );
}

export function AboutPage() {
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Company</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-text sm:text-5xl">
          Built for the business behind healthcare.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          ROOT brings revenue cycle management, data intelligence, credentialing, practice operations, and healthcare technology into one accountable operating model. We connect financial insight to the people and processes needed to act on it; clinical authority remains with your practice.
        </p>
      </Section>
      <Section tone="soft">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <MediaFrame
            src={mediaAssets.operationsCollaboration}
            alt="Healthcare operations collaboration. Editorial stock photograph; not ROOT staff or clients."
            caption="Photography is editorial context only and does not represent ROOT clients, employees, or results."
            aspect="video"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">How ROOT operates</p>
            <h2 className="mt-2 text-2xl font-semibold text-text">Revenue intelligence with execution behind it.</h2>
            <p className="mt-4 text-sm text-muted">
              After years working across US healthcare revenue operations, recurring denials, aging balances, fragmented EHR and payer reports, and credentialing delays made one pattern clear: organizations need a connected financial picture, not another isolated workflow.
            </p>
            <p className="mt-3 text-sm text-muted">
              ROOT was founded to join revenue operations with data intelligence. DIRT connects financial signals, helps explain revenue exposure, and informs prioritized action; ROOT provides the operating ownership to follow through.
            </p>
          </div>
        </div>
      </Section>
      <Section id="leadership" tone="soft" aria-labelledby="leadership-heading">
        <SectionHeader
          eyebrow="People & accountability"
          title={<span id="leadership-heading">Meet ROOT's co-founders.</span>}
          description="Co-founded by Aftab Shaukat and Kashif Ali, ROOT connects healthcare revenue intelligence with accountable execution. Their professional roles and verified profiles are listed below."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {leadershipProfiles.map((person: { id: string; name: string; role: string; isCoFounder: boolean; focus: string; linkedIn: string; gitHub: string | null }) => (
            <GlassCard key={person.id} as="article" variant="glass" hover={false} className="flex h-full flex-col p-6">
              <div className="flex items-start gap-4">
                <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-panel text-xl font-semibold text-accent">
                  {person.name.split(' ').map((part) => part.charAt(0)).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text">{person.name}</h3>
                  {person.isCoFounder && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent">Co-Founder</p>}
                  <p className="mt-1 text-sm font-medium text-accent">{person.role}</p>
                  <p className="mt-1 text-xs text-muted">ROOT — Revenue Operations &amp; Outcomes Technology</p>
                </div>
              </div>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-muted">{person.focus}</p>
              <nav aria-label={person.name + ' professional profiles'} className="mt-6 flex flex-wrap gap-2">
                <a href={person.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-text hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue">
                  <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
                {person.gitHub ? (
                  <a href={person.gitHub} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-text hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue">
                    <Github className="h-4 w-4" aria-hidden="true" /> GitHub <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : null}
              </nav>
            </GlassCard>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
          <a href={companyInfo.emailHref} className="inline-flex items-center gap-2 hover:text-text"><Mail className="h-4 w-4" aria-hidden="true" />{companyInfo.email}</a>
          <a href={companyInfo.phoneHref} className="inline-flex items-center gap-2 hover:text-text"><Phone className="h-4 w-4" aria-hidden="true" />{companyInfo.phone}</a>
          <a href={companyInfo.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-text"><MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp ROOT</a>
        </div>
        <p className="mt-3 text-xs text-muted">Corporate correspondence: {companyInfo.addressLines.join(', ')}, United States.</p>
      </Section>
      <Section tone="grid" wide>
        <SectionHeader eyebrow="Responsibility areas" title="Intelligence and execution across the healthcare business." />
        <div className="mt-8">
          <WorkforceGrid />
        </div>
      </Section>

      <Section id="responsible-operations" tone="soft" aria-labelledby="responsible-operations-heading">
        <SectionHeader
          eyebrow="Public trust & responsible operations"
          title={<span id="responsible-operations-heading">The standards we aim to uphold.</span>}
          description="ROOT is a Wyoming-incorporated business focused on evidence-based healthcare revenue operations. DIRT is our embedded data-intelligence capability, not a separate company. Our commitments below describe how we intend to operate; they are not claims of independent certification."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <GlassCard as="div" variant="glass" hover={false} className="p-6">
            <h3 className="text-lg font-semibold text-text">Truthful claims and accountable execution</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We work to make service claims, proposed outcomes, and operational reporting accurate and verifiable. Demonstrations and modeled examples are identified as illustrative; financial results are not guaranteed.
            </p>
          </GlassCard>
          <GlassCard as="div" variant="glass" hover={false} className="p-6">
            <h3 className="text-lg font-semibold text-text">Privacy-first commercial inquiries</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              ROOT public forms are for business inquiries, not patient information. Please do not send medical records, claim extracts, member identifiers, payment credentials, or other sensitive clinical information through our website or marketing channels.
            </p>
            <a className="mt-4 inline-block text-sm font-medium text-accent hover:underline" href="/privacy-policy/">Read the Privacy Policy →</a>
          </GlassCard>
          <GlassCard as="div" variant="glass" hover={false} className="p-6">
            <h3 className="text-lg font-semibold text-text">Responsible information and technology use</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We aim to limit access to the information needed for a task, use approved systems for sensitive work, and review third-party tools before granting access. Client-specific safeguards and agreements must be established before restricted healthcare data is accepted.
            </p>
          </GlassCard>
          <GlassCard as="div" variant="glass" hover={false} className="p-6">
            <h3 className="text-lg font-semibold text-text">Respectful workplace and business conduct</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Our operating principles oppose unlawful harassment, discrimination, retaliation, bribery, misleading claims, and fraudulent healthcare billing. We seek respectful collaboration and appropriate procedures for raising concerns.
            </p>
          </GlassCard>
        </div>
        <p className="mt-6 max-w-4xl text-sm text-muted">
          These are public operating commitments, not proof of HIPAA certification, SOC 2 attestation, ISO certification, or completion of any external audit. For business questions or corrections, email <a className="text-accent hover:underline" href="mailto:info@rootrcm.com">info@rootrcm.com</a>. Do not include PHI.
        </p>
      </Section>

      <Section>
        <SectionHeader title="Bring us the financial question your systems cannot answer." />
        <LinkButton href="/contact/" variant="primary" size="md" className="mt-6" data-cta="talk-to-root">
          Start a Conversation
        </LinkButton>
      </Section>
    </V4Shell>
  );
}

interface FaqItem {
  group: string;
  question: string;
  answer: string;
  href?: string;
}

export function FaqPage() {
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
        <h1 className="mt-4 measure-exec text-4xl font-semibold text-text sm:text-5xl">Frequently asked questions</h1>
        <p className="mt-4 max-w-2xl measure-body text-lg text-muted">
          Straight answers about ROOT, the Revenue Optimization Diagnostic, how we handle data, and how engagements work. This public website accepts deidentified commercial inquiries only.
        </p>
      </Section>

      {faqGroups.map((group: string, index: number) => (
        <Section key={group} tone={index % 2 === 0 ? 'soft' : 'default'} dense>
          <h2 className="text-2xl font-semibold text-text sm:text-3xl">{group}</h2>
          <div className="mt-6 divide-y divide-border rounded-[var(--radius-panel)] border border-border bg-panel/40">
            {(faqItems as FaqItem[])
              .filter((item) => item.group === group)
              .map((item) => (
                <details key={item.question} className="group px-5 py-4 open:bg-panel/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded text-left text-base font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-medium">{item.question}</h3>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm text-muted md:text-base">{item.answer}</p>
                  {item.href ? (
                    <p className="mt-3 text-sm">
                      <a href={item.href} className="font-medium text-accent hover:underline">
                        Learn more →
                      </a>
                    </p>
                  ) : null}
                </details>
              ))}
          </div>
        </Section>
      ))}

      <Section>
        <SectionHeader title="Still have a question?" description="Send a deidentified question or start with the fixed-fee Diagnostic." />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/contact/" variant="primary" size="lg" data-cta="talk-to-root" data-location="faq" data-destination="/contact/" data-engagement-type="consultation">
            Contact ROOT
          </LinkButton>
          <LinkButton href="/diagnostic/" variant="outline" size="lg" data-cta="book-diagnostic" data-location="faq" data-destination="/diagnostic/" data-engagement-type="diagnostic">
            Explore the Diagnostic
          </LinkButton>
        </div>
      </Section>
    </V4Shell>
  );
}

/** Optional external scheduling link (e.g. Calendly). Only an https URL is honoured; unset means "not live yet". */
function bookingUrl(): string {
  const value = (import.meta.env.VITE_BOOKING_URL as string | undefined)?.trim() || '';
  return /^https:\/\//.test(value) ? value : '';
}

export function BookPage() {
  const formWrapRef = useRef<HTMLDivElement>(null);
  const diagnostic = pricingModels[0];
  const scheduleUrl = bookingUrl();

  useEffect(() => {
    const form = formWrapRef.current?.querySelector('form');
    if (!form) return undefined;
    return attachFormFrictionListeners(form, 'book-inquiry');
  }, []);

  const live = outreachChannels.filter((c: { status: string; href?: string }) => c.status === 'Live' && c.href);

  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Book a conversation' }]} />
        <div className="mt-4 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="measure-exec text-4xl font-semibold text-text sm:text-5xl">Book a conversation about your revenue cycle.</h1>
            <p className="mt-4 text-lg text-muted">
              Choose the entry point that fits. Start with the fixed-fee Revenue Optimization Diagnostic, or request a discovery conversation and tell us what your systems cannot answer.
            </p>

            <GlassCard as="div" variant="matrix" accent="cyan" hover={false} className="mt-8 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-data-blue">Focused entry engagement</p>
              <h2 className="mt-2 text-xl font-semibold text-text">{diagnostic.name}</h2>
              <p className="mt-1 text-lg text-accent">{diagnostic.price}</p>
              <p className="mt-3 text-sm text-muted">{diagnostic.bestFor}</p>
              <LinkButton
                href="/diagnostic/"
                variant="primary"
                size="md"
                className="mt-5"
                data-cta="book-diagnostic"
                data-location="book-page"
                data-destination="/diagnostic/"
                data-engagement-type="diagnostic"
              >
                Explore the Diagnostic
              </LinkButton>
            </GlassCard>

            <div className="mt-6 space-y-3">
              {scheduleUrl ? (
                <LinkButton
                  href={scheduleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="md"
                  data-cta="schedule-call"
                  data-location="book-page"
                  data-engagement-type="scheduling"
                >
                  Pick a time (opens in a new tab)
                </LinkButton>
              ) : (
                <Callout tone="info" title="Online scheduling">
                  Self-serve scheduling is not live yet. Use the request form, or reach ROOT directly by phone, WhatsApp or email below.
                </Callout>
              )}
              <p className="flex items-start gap-2 text-sm text-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                Do not submit PHI through this website.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {live.map((channel: { label: string; href?: string; cta: string; engagementType: string }) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  data-cta={channel.cta}
                  data-location="book-page-outreach"
                  data-engagement-type={channel.engagementType}
                  className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm text-text transition-colors hover:border-data-blue/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue"
                  target={channel.href?.startsWith('http') ? '_blank' : undefined}
                  rel={channel.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {channel.label}
                </a>
              ))}
            </div>
          </div>

          <GlassCard as="div" variant="glass" hover={false} id="book-form" className="ph-no-capture p-4" data-ph-mask>
            <div ref={formWrapRef}>
              <InquiryForm formId="book-inquiry" />
            </div>
          </GlassCard>
        </div>
      </Section>
    </V4Shell>
  );
}
