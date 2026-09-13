import { useEffect } from 'react';
import { klaroConfig } from './klaroConfig';
import './klaro-overrides.css';

/**
 * Mounts Klaro (BSD-3-Clause, kiprotect/klaro) as the consent engine. First-visit notice
 * offers Accept all / Reject non-essential / Manage preferences per spec section O.
 * Mount once near the app root, before any non-essential script would run.
 */
export function CookieConsent() {
  useEffect(() => {
    let disposed = false;

    Promise.all([import('klaro'), import('klaro/dist/klaro.css?url')]).then(([klaroModule, cssUrl]) => {
      if (disposed) return;
      const href = (cssUrl as { default: string }).default;
      if (href && !document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
      klaroModule.default.setup(klaroConfig);
      window.dispatchEvent(new CustomEvent('root:consent-change'));
    });

    function handleOpenSettings() {
      import('klaro').then((klaroModule) => klaroModule.default.show(klaroConfig, true));
    }

    window.addEventListener('root:open-cookie-settings', handleOpenSettings);
    return () => {
      disposed = true;
      window.removeEventListener('root:open-cookie-settings', handleOpenSettings);
    };
  }, []);

  return null;
}
