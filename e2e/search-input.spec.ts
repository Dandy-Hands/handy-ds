import { test, expect } from '@playwright/test';

const field = (page: import('@playwright/test').Page) => page.locator('.hds-search-input').first();

test('the clear button shows only when there is text and clears it', async ({ page }) => {
  await page.goto('search-input');
  const input = field(page).locator('input');
  const clear = field(page).getByRole('button', { name: 'Clear search' });
  await expect(input).toHaveValue('handy');
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(clear).toHaveCount(0);
  await input.fill('abc');
  await expect(clear).toBeVisible();
});

test('Escape clears the text and stays in the field', async ({ page }) => {
  await page.goto('search-input');
  const input = field(page).locator('input');
  await input.focus();
  await page.keyboard.press('Escape');
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
});

test('disabled and read-only fields have no clear button', async ({ page }) => {
  await page.goto('search-input');
  const locked = page.locator('.hds-search-input').filter({ has: page.locator('input:disabled, input[readonly]') });
  await expect(locked.getByRole('button', { name: 'Clear search' })).toHaveCount(0);
});
