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
    let detach = () => {};

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
      // Klaro calls `update` on every registered watcher OBJECT (a bare function would throw) after it has saved the
      // visitor's choice to the root_consent cookie. Analytics reads that cookie when it hears this event.
      const manager = klaroModule.default.getManager(klaroConfig);
      const watcher = {
        update: (_manager: unknown, name: string) => {
          if (name === 'saveConsents') window.dispatchEvent(new CustomEvent('root:consent-change'));
        },
      };
      manager.watch(watcher);
      detach = () => manager.unwatch(watcher);
      window.dispatchEvent(new CustomEvent('root:consent-change'));
    });

    function handleOpenSettings() {
      import('klaro').then((klaroModule) => klaroModule.default.show(klaroConfig, true));
    }

    window.addEventListener('root:open-cookie-settings', handleOpenSettings);
    return () => {
      disposed = true;
      detach();
      window.removeEventListener('root:open-cookie-settings', handleOpenSettings);
    };
  }, []);

  return null;
}
