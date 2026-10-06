import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import { cn } from '@/lib/cn';

/**
 * Light/dark switch. Announced as a switch named "Light theme" so assistive tech reads the
 * on/off state change; the icon is decorative. The choice persists in localStorage.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const light = theme === 'light';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Light theme"
      title={light ? 'Switch to dark theme' : 'Switch to light theme'}
      onClick={toggle}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-text',
        'transition-colors hover:border-border-strong hover:bg-panel motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue',
        className,
      )}
    >
      {light ? <Sun className="h-[18px] w-[18px]" aria-hidden="true" /> : <Moon className="h-[18px] w-[18px]" aria-hidden="true" />}
    </button>
  );
}
