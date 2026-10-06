/**
 * What a Vite mode means for the artifact it produces.
 *
 * `development` is the dev server (or an explicit development build). Every other mode, `production` and anything custom
 * such as `preview` or `staging`, produces an artifact that can be deployed to a URL someone can reach, so it never
 * includes internal routes and defaults to a non-indexable environment unless it is the production build.
 */
export const isDeployableMode = (mode) => mode !== 'development';

/** The environment a build reports when VITE_SITE_ENV is not set. Only a production-mode build is "production". */
export function defaultSiteEnvForMode(mode) {
  if (mode === 'production') return 'production';
  return mode === 'development' ? 'development' : 'preview';
}

/** An explicit VITE_SITE_ENV wins (it is validated by assertSafePublicEnv); otherwise the mode decides. */
export const resolveBuildSiteEnv = ({ mode, configured }) => String(configured || '').trim() || defaultSiteEnvForMode(mode);
