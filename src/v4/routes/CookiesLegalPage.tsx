import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { CookieConsent } from '@/consent/CookieConsent';
import { AnalyticsBoot } from '@/analytics/AnalyticsBoot';
import { CookieSettings } from '@/consent/CookieSettings';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ResponsiveTableShell } from '@/components/ui/ResponsiveTableShell';
import { visibleStorageRows } from '@/consent/storageInventory';

export function CookiesLegalPage() {
  return (
    <div className="v4-root min-h-screen bg-bg text-text">
      <CookieConsent />
      <AnalyticsBoot />
      <MarketingHeader />
      <main id="main-content">
        <Section className="pt-10">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy', href: '/privacy-policy/' }, { label: 'Cookies' }]} />
          <SectionHeader
            eyebrow="Legal"
            title="Cookies"
            description="Every cookie and browser-storage key ROOT sets, why, and for how long. No non-essential cookie runs before you consent."
            className="mt-6"
          />
          <div className="mt-8">
            <ResponsiveTableShell caption="Every cookie and browser-storage key ROOT sets" minWidthClassName="min-w-[560px]">
              <thead className="bg-bg-deep/70 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3">Key</th>
                  <th scope="col" className="px-4 py-3">Type</th>
                  <th scope="col" className="px-4 py-3">Provider</th>
                  <th scope="col" className="px-4 py-3">Purpose</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {visibleStorageRows().map((row) => (
                  <tr key={row.key} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs text-text">{row.key}</td>
                    <td className="px-4 py-3 text-muted">{row.kind}</td>
                    <td className="px-4 py-3 text-muted">{row.provider}</td>
                    <td className="px-4 py-3 text-muted">{row.purpose}</td>
                    <td className="px-4 py-3 text-muted">{row.category}</td>
                    <td className="px-4 py-3 text-muted">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </ResponsiveTableShell>
          </div>
          <p className="mt-6 text-sm text-muted">
            Analytics stay off until you accept them, and ROOT honors the Global Privacy Control signal by keeping them off. Withdrawing consent deletes the analytics
            identifiers listed above. The inquiry form may load a bot-protection challenge from Cloudflare, and online checkout (when offered) is hosted by Stripe;
            both are third parties with their own storage practices. Details are in the <a className="text-accent hover:underline" href="/privacy-policy/">privacy policy</a>.
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
