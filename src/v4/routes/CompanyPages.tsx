import { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader } from '@/components/ui/Section';
import { TrustSignals } from '@/components/TrustSignals';
import { MediaFrame } from '@/components/ui/MediaFrame';
import InquiryForm from '../../components/InquiryForm.jsx';
import { attachFormFrictionListeners } from '@/analytics/formFriction';
import { companyInfo, outreachChannels, mediaAssets } from '../../siteData.js';

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
              Talk through your practice&apos;s operating problem.
            </h1>
            <p className="mt-4 text-lg text-muted">
              Share deidentified commercial context about A/R, denials, reporting, credentialing, or practice operations.
              ROOT will route the conversation to the right next step.
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
          <div ref={formWrapRef} className="rounded-[var(--radius-root)] border border-border bg-panel/50 p-4 ph-no-capture" data-ph-mask>
            <InquiryForm />
          </div>
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
              className="rounded-[var(--radius-root)] border border-border px-4 py-2 text-sm text-text hover:border-accent"
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
          Built around the business side of independent medicine.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          ROOT exists to give independent practices an accountable operating partner across revenue cycle, credentialing,
          practice operations, analytics, automation, and technology, without confusing business support with clinical
          authority.
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
            <h2 className="mt-2 text-2xl font-semibold text-text">Revenue first. Evidence before complexity.</h2>
            <p className="mt-4 text-sm text-muted">
              ROOT prioritizes cash impact, client acquisition, delivery, retention, operational leverage, commercial
              credibility, automation, and then technical sophistication.
            </p>
            <p className="mt-3 text-sm text-muted">
              DIRT extends that model with analytical discipline: identify the constraint, quantify the opportunity,
              prioritize action, and measure what changes.
            </p>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader title="Bring us the number that does not make sense." />
        <a href="/contact/" className="mt-6 inline-flex rounded-[var(--radius-root)] bg-accent px-4 py-2 text-sm font-medium text-accent-ink" data-cta="talk-to-root">
          Start a Conversation
        </a>
      </Section>
    </V4Shell>
  );
}
