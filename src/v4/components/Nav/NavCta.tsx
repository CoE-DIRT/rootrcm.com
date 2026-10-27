import { LinkButton } from '@/components/ui/Button';
import { useExperiment } from '@/experiments/useExperiment';
import { primaryCta } from '../../../siteData.js';

export function NavCta({ location, onClick, className = '' }: { location: 'header' | 'mobile-nav'; onClick?: () => void; className?: string }) {
  const experiment = useExperiment('headerCta');
  return (
    <LinkButton
      href={primaryCta.href}
      variant="primary"
      size="md"
      aria-label="Book a Consultation with ROOT"
      className={className}
      onClick={onClick}
      data-cta={primaryCta.cta}
      data-location={location}
      data-destination={primaryCta.href}
      data-engagement-type={primaryCta.engagementType}
      {...experiment.attrs}
    >
      {experiment.label ?? primaryCta.label}
    </LinkButton>
  );
}
