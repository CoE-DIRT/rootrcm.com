import type { SVGProps } from 'react';

/** Brand glyphs for the approved ROOT social profiles. Decorative: the link carries the accessible name. */
export function SocialIcon({ label, ...props }: { label: string } & SVGProps<SVGSVGElement>) {
  const common = { viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false, width: 20, height: 20, ...props } as SVGProps<SVGSVGElement>;
  switch (label) {
    case 'Facebook':
      return (
        <svg {...common}>
          <path fill="currentColor" d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" />
        </svg>
      );
    case 'Instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'X':
      return (
        <svg {...common}>
          <path fill="currentColor" d="M5 4h4.1l3.1 4.5L16 4h3l-5.3 6.1L19.5 20h-4.1l-3.7-5.2L7 20H4l5.7-6.8L5 4Zm3.1 2 7.9 12h.9L9 6h-.9Z" />
        </svg>
      );
    case 'LinkedIn':
      return (
        <svg {...common}>
          <path fill="currentColor" d="M6.5 9.5H3.7V20h2.8V9.5ZM5.1 4A1.65 1.65 0 1 0 5.1 7.3 1.65 1.65 0 0 0 5.1 4Zm15.2 5.3c-1.6 0-2.7.7-3.3 1.5V9.5h-2.8c0 .5-.1 10.5-.1 10.5h2.8v-5.9c0-.3 0-.6.1-.8.3-.6.9-1.3 2-1.3 1.4 0 2 1.1 2 2.6V20h2.8v-6.4c0-3.4-1.8-4.8-4.5-4.8Z" />
        </svg>
      );
    case 'Pinterest':
      return (
        <svg {...common}>
          <path fill="currentColor" d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.82-.17-2.08.03-2.98.19-.81 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.44.84-2.52 1.88-2.52.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.89 1.54 1.89 1.85 0 3.28-1.95 3.28-4.77 0-2.49-1.79-4.23-4.35-4.23-2.96 0-4.7 2.22-4.7 4.52 0 .9.34 1.85.78 2.37.09.1.1.19.07.3-.08.33-.26 1.04-.29 1.19-.05.19-.15.23-.35.14-1.3-.6-2.12-2.5-2.12-4.03 0-3.28 2.38-6.3 6.87-6.3 3.6 0 6.41 2.57 6.41 6 0 3.58-2.26 6.46-5.39 6.46-1.05 0-2.04-.55-2.38-1.19l-.65 2.47c-.23.9-.87 2.03-1.3 2.72A10 10 0 1 0 12 2Z" />
        </svg>
      );
    case 'Reddit':
      return (
        <svg {...common}>
          <path fill="currentColor" d="M14.5 3.3 15.9 8c1.4.1 2.7.6 3.7 1.4a2 2 0 1 1 1.3 3.5c0 3.6-4.1 6.5-9 6.5s-9-2.9-9-6.5a2 2 0 1 1 1.3-3.5A8.5 8.5 0 0 1 8 8l1.5-4.7 3.1.8 1.9-.8ZM8.8 13.1a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm6.4 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm-6.1 3.5a4.8 4.8 0 0 0 5.8 0 .6.6 0 0 1 .8.9 6 6 0 0 1-7.4 0 .6.6 0 1 1 .8-.9Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}
