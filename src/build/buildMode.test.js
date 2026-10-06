import { describe, expect, it } from 'vitest';
import { buildInputs, internalRoutes } from '../seo/routeRegistry.js';
import { buildRobots } from '../seo/sitemap.js';
import { defaultSiteEnvForMode, internalRoutesEnabled, isDeployableMode, resolveBuildSiteEnv } from './buildMode.js';

describe('build mode', () => {
  it('is production only for a production-mode build; every other mode is not indexable by default', () => {
    expect(defaultSiteEnvForMode('production')).toBe('production');
    expect(defaultSiteEnvForMode('preview')).toBe('preview');
    expect(defaultSiteEnvForMode('staging')).toBe('preview');
    expect(defaultSiteEnvForMode('test')).toBe('preview');
    expect(defaultSiteEnvForMode('development')).toBe('development');
    expect(defaultSiteEnvForMode('')).toBe('preview');
  });

  it('lets an explicit VITE_SITE_ENV decide, and falls back to the mode when it is blank', () => {
    expect(resolveBuildSiteEnv({ mode: 'production', configured: 'preview' })).toBe('preview');
    expect(resolveBuildSiteEnv({ mode: 'preview', configured: 'production' })).toBe('production');
    expect(resolveBuildSiteEnv({ mode: 'preview', configured: '' })).toBe('preview');
    expect(resolveBuildSiteEnv({ mode: 'preview', configured: '   ' })).toBe('preview');
    expect(resolveBuildSiteEnv({ mode: 'preview', configured: undefined })).toBe('preview');
    expect(resolveBuildSiteEnv({ mode: 'production', configured: undefined })).toBe('production');
  });

  it('keeps internal routes out of every deployable build, not only the production one', () => {
    for (const mode of ['production', 'preview', 'staging']) {
      expect(isDeployableMode(mode), mode).toBe(true);
      const inputs = Object.keys(buildInputs({ production: isDeployableMode(mode) }));
      for (const route of internalRoutes) expect(inputs, `${mode}: ${route.key}`).not.toContain(route.key);
    }
    expect(isDeployableMode('development')).toBe(false);
    expect(Object.keys(buildInputs({ production: isDeployableMode('development') }))).toContain('v4Lab');
  });

  it('serves a disallow-all robots.txt for a preview-mode build with no VITE_SITE_ENV', () => {
    const siteEnv = resolveBuildSiteEnv({ mode: 'preview', configured: '' });
    expect(buildRobots({ siteEnv })).toBe('User-agent: *\nDisallow: /\n');
  });

  describe('internal routes at run time', () => {
    it('are served by the dev server and the test runner, and by an explicit development-mode build only', () => {
      expect(internalRoutesEnabled({ dev: true, mode: 'development' })).toBe(true);
      expect(internalRoutesEnabled({ dev: true, mode: 'test' })).toBe(true);
      expect(internalRoutesEnabled({ dev: false, mode: 'development' })).toBe(true);
    });

    it('are never served by a production, preview or staging build, where Vite still reports PROD as true', () => {
      for (const mode of ['production', 'preview', 'staging', 'test', '']) expect(internalRoutesEnabled({ dev: false, mode }), mode).toBe(false);
      expect(internalRoutesEnabled({ dev: undefined, mode: undefined })).toBe(false);
      expect(internalRoutesEnabled({})).toBe(false);
    });

    it('exist at run time exactly where the build emits their HTML', () => {
      for (const mode of ['production', 'preview', 'staging', 'development']) {
        const emitted = internalRoutes.every((route) => Object.keys(buildInputs({ production: isDeployableMode(mode) })).includes(route.key));
        // A build reports DEV as false whatever its mode; the dev server and tests report it as true.
        expect(internalRoutesEnabled({ dev: false, mode }), mode).toBe(emitted);
      }
    });
  });
});
