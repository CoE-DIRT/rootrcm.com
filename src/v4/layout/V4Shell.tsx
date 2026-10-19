import type { ReactNode } from 'react';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { CookieConsent } from '@/consent/CookieConsent';
import { FloatingSiteControls } from '../../components/SiteChrome.jsx';
import { IntentBannerHost } from '@/growth/IntentBanner';
import { AnalyticsBoot } from '@/analytics/AnalyticsBoot';
import { PersonalizationProvider } from '@/growth/PersonalizationProvider';
import { cn } from '@/lib/cn';

interface V4ShellProps {
  children: ReactNode;
  minimal?: boolean;
  className?: string;
}

/** Shared V4 chrome: consent, header/footer, floating outreach, growth hosts. */
export function V4Shell({ children, minimal = false, className }: V4ShellProps) {
  return (
    <div className={cn('v4-root min-h-screen bg-bg text-text', className)}>
      <a href="#main-content" className="sr-only z-[100] rounded-md bg-panel px-4 py-3 text-text shadow-lg focus:fixed focus:left-4 focus:top-4 focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-data-blue">
        Skip to main content
      </a>
      <CookieConsent />
      <AnalyticsBoot />
      <PersonalizationProvider>
        <MarketingHeader minimal={minimal} />
        <main id="main-content">{children}</main>
        <MarketingFooter minimal={minimal} />
        <FloatingSiteControls placementTest={!minimal} />
        <IntentBannerHost />
      </PersonalizationProvider>
    </div>
  );
}
