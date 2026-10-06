import { test, expect } from '@playwright/test';

async function completeInquiry(page) {
  await page.goto('/contact/');
  await page.getByLabel('Name', { exact: true }).fill('Synthetic Website QA');
  await page.getByLabel('Work email', { exact: true }).fill('website-qa@example.test');
  await page.getByLabel('Practice / organization', { exact: true }).fill('Synthetic QA Organization');
  await page.getByLabel('How can we help?', { exact: true }).fill('Synthetic website delivery check. No patient data.');
  await page.getByLabel(/will not submit Protected Health Information/).check();
}

test('acknowledged asynchronous delivery reaches confirmation', async ({ page }) => {
  // Intercept before filling: no message is sent to an external service.
  await page.route('https://formsubmit.co/**', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ success: 'true' }),
  }));
  await completeInquiry(page);
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page).toHaveURL(/\/thank-you\/\?delivery=form/);
});

for (const [name, status, body] of [
  ['HTTP failure', 503, { success: false }],
  ['application rejection', 200, { success: 'false' }],
  ['unacknowledged response', 200, {}],
] as const) {
  test(`${name} preserves inquiry and shows email fallback`, async ({ page }) => {
    await page.route('https://formsubmit.co/**', route => route.fulfill({
      status, contentType: 'application/json', body: JSON.stringify(body),
    }));
    await completeInquiry(page);
    await page.getByRole('button', { name: 'Start the Conversation' }).click();
    await expect(page.getByText('We could not confirm delivery.', { exact: false })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Email info@rootrcm.com' })).toHaveAttribute('href', /Synthetic%20QA%20Organization/);
    await page.getByRole('button', { name: 'Edit inquiry' }).click();
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Synthetic Website QA');
  });
}
