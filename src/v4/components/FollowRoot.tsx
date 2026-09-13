import { socialProfiles } from '../../siteData.js';
import { cn } from '@/lib/cn';

export function FollowRoot({ className }: { className?: string }) {
  return (
    <nav aria-label="Follow ROOT on social media" className={cn('flex flex-wrap gap-3', className)}>
      {socialProfiles.map((profile: { label: string; href: string }) => (
        <a
          key={profile.href}
          href={profile.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="social-click"
          data-location="follow-root"
          data-destination={profile.label}
          className="rounded-[var(--radius-root)] border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-text"
        >
          {profile.label}
        </a>
      ))}
    </nav>
  );
}
