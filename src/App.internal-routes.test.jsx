import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// `import.meta.env.PROD` is true for every `vite build`, whatever its --mode, so the route table cannot use it: it has to
// agree with the build, which emits the internal pages only for a development-mode build. These tests load a fresh App for
// each simulated build.
async function renderAt(path, { mode, dev }) {
  vi.resetModules();
  vi.stubEnv('MODE', mode);
  vi.stubEnv('DEV', dev);
  vi.stubEnv('PROD', !dev);
  window.history.pushState({}, '', path);
  const { default: App } = await import('./App.jsx');
  return render(<App />);
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.resetModules();
  window.history.pushState({}, '', '/');
});

const lab = () => screen.queryByRole('heading', { name: /V4 component gallery/i });
const notFound = () => screen.queryByRole('heading', { name: /This route does not go to revenue/i });

describe('internal routes follow the build mode', () => {
  it.each([
    ['a production build', 'production'],
    ['a preview-mode build', 'preview'],
    ['a staging-mode build', 'staging'],
  ])('%s does not serve the component lab or the unpublished case study', async (_label, mode) => {
    await renderAt('/__v4-lab/', { mode, dev: false });
    expect(lab()).toBeNull();
    expect(notFound()).toBeTruthy();
    cleanup();
    await renderAt('/case-studies/dirt-poc-01/', { mode, dev: false });
    expect(notFound()).toBeTruthy();
  });

  it('an explicit development-mode build serves them, matching the HTML it emits', async () => {
    await renderAt('/__v4-lab/', { mode: 'development', dev: false });
    expect(lab()).toBeTruthy();
    expect(notFound()).toBeNull();
  });

  it('the dev server serves them', async () => {
    await renderAt('/__v4-lab/', { mode: 'development', dev: true });
    expect(lab()).toBeTruthy();
  });
});
