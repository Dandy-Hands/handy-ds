import { test, expect } from '@playwright/test';

test('Toast action runs its onClick and closes the toast', async ({ page }) => {
  await page.goto('toast');
  const status = page.getByTestId('toast-action-status');
  await page.getByRole('button', { name: 'Delete message' }).click();
  await expect(status).toHaveText('The message is deleted.');
  const toast = page.locator('.hds-toast', { hasText: 'Message deleted' });
  await expect(toast).toBeVisible();
  await toast.getByRole('button', { name: 'Undo' }).click();
  await expect(status).toHaveText('The message is restored.');
  await expect(toast).toHaveCount(0);
});
