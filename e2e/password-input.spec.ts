import { test, expect } from '@playwright/test';

test('PasswordInput starts hidden and the button shows and hides the text', async ({ page }) => {
  await page.goto('password-input');
  const field = page.locator('.hds-text-input:has(.hds-password-input__toggle)').first();
  const input = field.locator('input');
  const toggle = field.getByRole('button', { name: 'Show password' });
  await expect(input).toHaveAttribute('type', 'password');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(input).toHaveAttribute('type', 'text');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(input).toHaveAttribute('type', 'password');
});

test('a pointer press on the button keeps focus in the input', async ({ page }) => {
  await page.goto('password-input');
  const field = page.locator('.hds-text-input:has(.hds-password-input__toggle)').first();
  await field.locator('input').focus();
  await field.getByRole('button', { name: 'Show password' }).click();
  await expect(field.locator('input')).toBeFocused();
});

test('a disabled PasswordInput disables the button', async ({ page }) => {
  await page.goto('password-input');
  const disabled = page.locator('.hds-text-input:has(.hds-password-input__toggle)').filter({ has: page.locator('input:disabled') });
  await expect(disabled.getByRole('button', { name: 'Show password' })).toBeDisabled();
});
