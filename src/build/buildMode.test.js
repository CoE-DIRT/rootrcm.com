import { describe, expect, it } from 'vitest';
import { buildInputs, internalRoutes } from '../seo/routeRegistry.js';
import { buildRobots } from '../seo/sitemap.js';
import { defaultSiteEnvForMode, isDeployableMode, resolveBuildSiteEnv } from './buildMode.js';

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
});
