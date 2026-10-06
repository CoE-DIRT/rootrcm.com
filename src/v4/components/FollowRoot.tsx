import { SocialLinks } from '@/components/SocialLinks';

/** Labeled social profile links. Thin wrapper kept for existing call sites; SocialLinks is the single implementation. */
export function FollowRoot({ className }: { className?: string }) {
  return <SocialLinks variant="labeled" location="follow-root" className={className} label="Follow ROOT on social media" />;
}
