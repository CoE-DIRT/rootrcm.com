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
      <CookieConsent />
      <AnalyticsBoot />
      <PersonalizationProvider>
        <MarketingHeader minimal={minimal} />
        <main id="main-content">{children}</main>
        <MarketingFooter minimal={minimal} />
        <FloatingSiteControls />
        <IntentBannerHost />
      </PersonalizationProvider>
    </div>
  );
}
