import { test, expect } from '@playwright/test';

// These are isolated browser contract tests; they do not submit to the real FormSubmit service.
test.use({ reducedMotion: 'reduce' });

test('contact: first-touch campaign labels survive, PII in ad parameters does not', async ({ page }) => {
  let submitted: Record<string, unknown> | undefined;
  await page.route('https://formsubmit.co/**', async (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: 'true' }) });
  });
  await page.goto('/contact/?utm_source=Google&utm_medium=CPC&utm_campaign=patient%40example.com&utm_content=secret&gclid=not-for-form');
  await page.getByLabel('Name', { exact: true }).fill('Synthetic Campaign QA');
  await page.getByLabel('Work email', { exact: true }).fill('campaign-qa@example.test');
  await page.getByLabel('Practice / organization', { exact: true }).fill('Synthetic Organization');
  await page.getByLabel('How can we help?', { exact: true }).fill('Discuss medical billing workflows, no PHI.');
  await page.getByLabel(/will not submit Protected Health Information/).check();
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page.getByText("We've received your inquiry.", { exact: true })).toBeVisible();
  expect(submitted?.utm_source).toBe('google');
  expect(submitted?.utm_medium).toBe('cpc');
  expect(submitted?.utm_campaign).toBeUndefined();
  expect(submitted?.utm_content).toBeUndefined();
  expect(JSON.stringify(submitted)).not.toContain('not-for-form');
  expect(submitted?._url).toBe(new URL('/contact/', page.url()).toString());
});

test('Diagnostic: only delivery-acknowledged submission converts to confirmation', async ({ page }) => {
  let submissions = 0;
  await page.route('https://formsubmit.co/**', async (route) => {
    submissions += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: 'true' }) });
  });
  await page.goto('/diagnostic/');
  await page.getByLabel('Name', { exact: true }).fill('Synthetic Diagnostic QA');
  await page.getByLabel('Work email', { exact: true }).fill('diagnostic-qa@example.test');
  await page.getByLabel('Practice / organization', { exact: true }).fill('Synthetic Diagnostic Organization');
  await page.getByLabel('Number of providers', { exact: true }).selectOption({ label: '6-10' });
  await page.getByLabel('Biggest current challenge', { exact: true }).selectOption({ label: 'Denials and rejections' });
  await page.getByLabel(/will not submit Protected Health Information/).check();
  await page.getByRole('button', { name: 'Request Diagnostic' }).click();
  await expect(page.getByText("We've received your Diagnostic inquiry.", { exact: true })).toBeVisible();
  expect(submissions).toBe(1);
});
