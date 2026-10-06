/// <reference types="vite/client" />

/** Public (browser-exposed) configuration. Secrets never belong here — see src/build/envGuard.js. */
interface ImportMetaEnv {
  readonly VITE_SITE_ENV?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_GA_NON_PRODUCTION?: string;
  readonly VITE_TRACKING_ENDPOINT?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_CHECKOUT_ENDPOINT?: string;
  readonly VITE_EXPERIMENTS_ENABLED?: string;
  readonly VITE_BOOKING_URL?: string;
  readonly VITE_GSC_VERIFICATION?: string;
}

declare module 'klaro' {
  const Klaro: {
    setup: (config: unknown) => void;
    show: (config: unknown, modal?: boolean) => void;
    getManager: (config: unknown) => { watch: (watcher: unknown) => void; unwatch: (watcher: unknown) => void };
  };
  export default Klaro;
}
