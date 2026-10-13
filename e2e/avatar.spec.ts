import { test, expect } from '@playwright/test';

test('Avatar shows the fallback when there is no image', async ({ page }) => {
  await page.goto('avatar');
  await expect(page.locator('.hds-avatar').first()).toBeVisible();
  await expect(page.getByText('RL').first()).toBeVisible();
});
