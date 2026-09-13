import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent('root:open-cookie-settings'));
}

export function CookieSettings({ children = 'Cookie Settings', className }: { children?: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={cn(
        'rounded text-sm text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
    >
      {children}
    </button>
  );
}
