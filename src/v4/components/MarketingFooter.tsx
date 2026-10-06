import { ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { SocialLinks } from '@/components/SocialLinks';
import { CookieSettings } from '../consent/CookieSettings';
import { useExperiment } from '@/experiments/useExperiment';
import { companyInfo, footerGroups, legalLinks, outreachChannels } from '../../siteData.js';

interface MarketingFooterProps {
  minimal?: boolean;
}

interface Channel {
  label: string;
  href?: string;
  status: string;
  cta: string;
  engagementType: string;
}

const channelIcons: Record<string, typeof Phone> = { 'instant-chat': MessageCircle, phone: Phone, email: Mail };

/** Footer social controls; the icon-only vs labeled design is an A/B test (exp-follow-us-design-v1). */
function FooterSocial() {
  const experiment = useExperiment('followUsDesign');
  return (
    <div className="mt-5" {...experiment.attrs}>
      <SocialLinks variant={experiment.variant === 'labeled' ? 'labeled' : 'icons'} location="footer-social" />
    </div>
  );
}

export function MarketingFooter({ minimal = false }: MarketingFooterProps) {
  const year = new Date().getFullYear();

  if (minimal) {
    return (
      <footer className="border-t border-border bg-bg-soft py-8 text-center text-xs text-muted">
        <p>
          © {year} {companyInfo.legalName}. No PHI is collected through this public website.
        </p>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {legalLinks.map((link: { label: string; href: string }) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-text">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    );
  }

  const liveChannels = (outreachChannels as Channel[]).filter((channel) => channel.status === 'Live' && channel.href);

  return (
    <footer className="v4-footer border-t border-border bg-gradient-to-b from-bg-deep to-bg">
      <div className="mx-auto w-full max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <section aria-labelledby="footer-talk-heading" className="v4-footer-cta rounded-[var(--radius-hero)] border border-border p-6 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <h2 id="footer-talk-heading" className="text-2xl font-semibold text-text sm:text-3xl">
                Talk to ROOT about your revenue cycle.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
                Bring a deidentified revenue question. We will recommend the right next step, starting with the fixed-fee Revenue Optimization Diagnostic when it fits.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <LinkButton
                href="/contact/"
                variant="primary"
                size="lg"
                data-cta="talk-to-root"
                data-location="footer"
                data-destination="/contact/"
                data-engagement-type="consultation"
              >
                Talk to us <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </LinkButton>
              <LinkButton
                href="/book/"
                variant="outline"
                size="lg"
                data-cta="book-conversation"
                data-location="footer"
                data-destination="/book/"
                data-engagement-type="consultation"
              >
                Book a conversation
              </LinkButton>
            </div>
          </div>
          <ul className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5" aria-label="Direct contact channels">
            {liveChannels.map((channel) => {
              const Icon = channelIcons[channel.engagementType] ?? MessageCircle;
              const external = channel.href?.startsWith('http');
              return (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    data-cta={channel.cta}
                    data-location="footer-outreach"
                    data-destination={channel.label}
                    data-engagement-type={channel.engagementType}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-text transition-colors hover:border-accent hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue motion-reduce:transition-none"
                  >
                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                    {channel.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid gap-10 py-14 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <a href="/" aria-label="ROOT home" className="inline-flex items-center gap-2 text-lg font-semibold text-text">
              <img src="/brand/logos/root/root-mark-76.webp" alt="" width={28} height={28} className="h-7 w-7" loading="lazy" />
              ROOT
            </a>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Revenue Operations &amp; Outcomes Technology — healthcare revenue intelligence, managed RCM, credentialing, and the operating infrastructure behind financial performance.
            </p>
            <address className="mt-5 space-y-1 text-sm not-italic text-muted">
              <p className="font-medium text-text">{companyInfo.legalName}</p>
              {companyInfo.addressLines.map((line: string) => (
                <p key={line}>{line}</p>
              ))}
              <p>
                <a
                  href={companyInfo.phoneHref}
                  data-cta="phone-call"
                  data-location="footer-contact"
                  data-engagement-type="phone"
                  className="hover:text-text hover:underline"
                >
                  {companyInfo.phone}
                </a>
              </p>
              <p>
                <a href={companyInfo.emailHref} data-cta="email-root" data-location="footer-contact" data-engagement-type="email" className="hover:text-text hover:underline">
                  {companyInfo.email}
                </a>
              </p>
            </address>
            <FooterSocial />
          </div>

          {footerGroups.map((group: { title: string; links: { label: string; href: string }[] }) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{group.title}</h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted transition-colors hover:text-text hover:underline motion-reduce:transition-none">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {companyInfo.legalName}. Public website: commercial inquiries only — do not send PHI.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Legal">
            {legalLinks.map((link: { label: string; href: string }) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-text hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <CookieSettings className="hover:text-text hover:underline" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
