import { ArrowRight } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { SocialLinks } from '@/components/SocialLinks';
import { CookieSettings } from '../consent/CookieSettings';
import { useExperiment } from '@/experiments/useExperiment';
import { companyInfo, footerGroups, legalLinks, outreachChannels } from '../../siteData.js';

interface MarketingFooterProps {
  minimal?: boolean;
}

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
  const channels = outreachChannels.filter((channel) => channel.status === 'Live' && channel.href);

  if (minimal) {
    return (
      <footer className="border-t border-border bg-bg-soft py-8 text-center text-xs text-muted">
        <p>
          © {year} {companyInfo.legalName}. Commercial inquiries only. Do not send patient information.
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

            </div>
          </div>

        </section>

        <div className="root-grid py-10">
          <div className="md:col-span-12 xl:col-span-4">
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
              {channels.map((channel) => (
                <p key={channel.label}>
                  <a href={channel.href} data-cta={channel.cta} data-location={channel.label === 'WhatsApp' ? 'footer-outreach' : 'footer-contact'} data-destination={channel.label} data-engagement-type={channel.engagementType} className="inline-flex min-h-11 items-center text-sm hover:underline">
                    {channel.label === 'Call' ? companyInfo.phone : channel.label === 'Email' ? companyInfo.email : channel.label}
                  </a>
                </p>
              ))}
            </address>
            <FooterSocial />
          </div>

          {footerGroups.map((group: { title: string; links: { label: string; href: string }[] }) => (
            <nav key={group.title} aria-label={group.title} className="md:col-span-6 xl:col-span-2">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{group.title}</h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} data-cta={link.href === '/book/' ? 'book-conversation' : undefined} data-location="footer" data-destination={link.href} data-engagement-type={link.href === '/book/' ? 'consultation' : undefined} className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-text hover:underline motion-reduce:transition-none">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="border-t border-border pt-5 text-xs leading-5 text-muted">Partner opportunities are subject to eligibility, conflicts review, legal compliance, and individually approved written agreements; no referral commission is promised or payable merely for an introduction. No patient referrals or PHI through this site. <a href="/partners/terms/" className="font-medium text-accent hover:underline">Partner Guidelines</a>.</p>
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
