import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { CookieConsent } from '@/consent/CookieConsent';
import { CookieSettings } from '@/consent/CookieSettings';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface CookieRow {
  key: string;
  provider: string;
  purpose: string;
  category: string;
  duration: string;
}

const cookieRows: CookieRow[] = [
  {
    key: 'root_consent',
    provider: 'ROOT (Klaro)',
    purpose: 'Stores which cookie categories you have accepted or rejected.',
    category: 'Necessary',
    duration: '365 days',
  },
];

export function CookiesLegalPage() {
  return (
    <div className="v4-root min-h-screen bg-bg text-text">
      <CookieConsent />
      <MarketingHeader />
      <main id="main-content">
        <Section className="pt-10">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Legal', href: '/legal/privacy/' }, { label: 'Cookies' }]} />
          <SectionHeader
            eyebrow="Legal"
            title="Cookies"
            description="Every cookie and browser-storage key ROOT sets, why, and for how long. No non-essential cookie runs before you consent."
            className="mt-6"
          />
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-root)] border border-border">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-panel text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Key</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {cookieRows.map((row) => (
                  <tr key={row.key} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs text-text">{row.key}</td>
                    <td className="px-4 py-3 text-muted">{row.provider}</td>
                    <td className="px-4 py-3 text-muted">{row.purpose}</td>
                    <td className="px-4 py-3 text-muted">{row.category}</td>
                    <td className="px-4 py-3 text-muted">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-muted">
            No analytics or marketing vendor is active on rootrcm.com today. When one goes live it will be added to
            this table and to the Analytics/Marketing categories below before it runs.
          </p>
          <CookieSettings className="mt-6 rounded-[var(--radius-root)] border border-border px-4 py-2 text-text hover:border-accent">
            Manage cookie preferences
          </CookieSettings>
        </Section>
      </main>
      <MarketingFooter />
    </div>
  );
}
