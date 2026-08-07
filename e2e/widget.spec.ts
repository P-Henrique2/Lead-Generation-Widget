import { expect, test } from '@playwright/test';

test('sends a message and shows an assistant response on the widget page', async ({ page }) => {
  await page.goto('http://localhost:3000/widget');

  await page.getByLabel('Message').fill('Tell me about the best fit for my team');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByText(/assistant|help|fit/i)).toBeVisible({ timeout: 20000 });
});
