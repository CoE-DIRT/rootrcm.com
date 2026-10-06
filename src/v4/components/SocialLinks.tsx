import { socialProfiles } from '../../siteData.js';
import { SocialIcon } from '@/components/SocialIcons';
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';

interface SocialLinksProps {
  /** `icons`: compact round buttons with tooltips. `labeled`: icon plus visible text. */
  variant?: 'icons' | 'labeled';
  /** Analytics location key (`data-location`). */
  location?: string;
  className?: string;
  /** Accessible name for the group. */
  label?: string;
}

const itemClass =
  'group inline-flex items-center justify-center gap-2 rounded-full border border-border text-muted ' +
  'transition-[color,border-color,background-color,transform] duration-200 ' +
  'hover:-translate-y-0.5 hover:border-accent hover:bg-panel hover:text-text ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

/**
 * Accessible social controls: every link has an `aria-label` that names the network and warns that it
 * opens a new tab, a 44px hit area, and either a tooltip (icons) or a visible label (labeled).
 */
export function SocialLinks({ variant = 'icons', location = 'social-links', className, label = 'Follow ROOT on social media' }: SocialLinksProps) {
  const profiles = (socialProfiles as { label: string; href: string }[]).filter((profile) => profile.href);
  if (!profiles.length) return null;

  return (
    <TooltipProvider>
      <nav aria-label={label} className={className}>
        <ul className={cn('flex flex-wrap gap-2', variant === 'labeled' && 'gap-2')}>
          {profiles.map((profile) => {
            const link = (
              <a
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`ROOT on ${profile.label} (opens in new tab)`}
                data-cta="social-click"
                data-location={location}
                data-destination={profile.label}
                className={cn(itemClass, variant === 'icons' ? 'h-11 w-11' : 'min-h-11 px-4 text-sm font-medium')}
              >
                <SocialIcon label={profile.label} />
                {variant === 'labeled' ? <span>{profile.label}</span> : null}
              </a>
            );
            return <li key={profile.label}>{variant === 'icons' ? <Tooltip label={profile.label}>{link}</Tooltip> : link}</li>;
          })}
        </ul>
      </nav>
    </TooltipProvider>
  );
}
