import { servicePages, solutionPages, companyInfo, socialProfiles } from '../../siteData.js';
import { FollowRoot } from './FollowRoot';
import { CookieSettings } from '../consent/CookieSettings';

interface MarketingFooterProps {
  minimal?: boolean;
}

const resourceLinks = [
  { label: 'Resources', href: '/resources/' },
  { label: 'Case Studies', href: '/case-studies/' },
  { label: 'Diagnostic', href: '/diagnostic/' },
];

const legalLinks = [
  { label: 'Privacy', href: '/legal/privacy/' },
  { label: 'Terms', href: '/legal/terms/' },
  { label: 'Cookies', href: '/legal/cookies/' },
];

export function MarketingFooter({ minimal = false }: MarketingFooterProps) {
  if (minimal) {
    return (
      <footer className="v4-root border-t border-border bg-bg-soft py-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} ROOT — Revenue Operations &amp; Outcomes Technology.
      </footer>
    );
  }

  return (
    <footer className="v4-root border-t border-border bg-bg-soft py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <p className="text-lg font-semibold text-text">ROOT</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Revenue Operations &amp; Outcomes Technology — RCM, operations, and technology partner for independent
            physician practices.
          </p>
          <FollowRoot className="mt-5" />
        </div>

        <nav aria-label="Services">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Services</p>
          <ul className="flex flex-col gap-2">
            {servicePages.slice(0, 6).map((service: { slug: string; title: string }) => (
              <li key={service.slug}>
                <a href={`/services/${service.slug}/`} className="text-sm text-muted hover:text-text">
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Solutions">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Solutions</p>
          <ul className="flex flex-col gap-2">
            {solutionPages.slice(0, 6).map((page: { slug: string; title: string }) => (
              <li key={page.slug}>
                <a href={`/solutions/${page.slug}/`} className="text-sm text-muted hover:text-text">
                  {page.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company &amp; legal">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Company</p>
          <ul className="flex flex-col gap-2">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-muted hover:text-text">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/company/about/" className="text-sm text-muted hover:text-text">
                About
              </a>
            </li>
            <li>
              <a href="/contact/" className="text-sm text-muted hover:text-text">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-6xl flex-col gap-4 border-t border-border px-4 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} ROOT — Revenue Operations &amp; Outcomes Technology. {companyInfo?.legalName ?? ''}</p>
        <div className="flex flex-wrap gap-4">
          {legalLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-text">
              {link.label}
            </a>
          ))}
          <CookieSettings className="hover:text-text" />
        </div>
      </div>
      {/* socialProfiles feeds FollowRoot above; keeping the import used here documents the source of truth. */}
      <span className="sr-only">{socialProfiles.length} approved social channels</span>
    </footer>
  );
}
