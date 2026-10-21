import { test, expect } from '@playwright/test';

test('steppers change the value and stop at the limits', async ({ page }) => {
  await page.goto('number-input');
  const input = page.getByLabel('Steppers 1000');
  await expect(input).toHaveValue('2');
  const group = page.getByRole('group').filter({ has: input });
  await group.getByRole('button', { name: 'Increase' }).click();
  await expect(input).toHaveValue('3');
  await input.fill('5');
  await input.blur();
  await expect(group.getByRole('button', { name: 'Increase' })).toBeDisabled();
  await group.getByRole('button', { name: 'Decrease' }).click();
  await expect(input).toHaveValue('4');
});

test('a field without steppers has no buttons and the arrow keys step', async ({ page }) => {
  await page.goto('number-input');
  const input = page.getByLabel('Size 1000');
  const group = page.getByRole('group').filter({ has: input });
  await expect(group.getByRole('button')).toHaveCount(0);
  await input.focus();
  await input.press('ArrowUp');
  await expect(input).toHaveValue('1,001');
});

test('a stepper is a square inside the frame', async ({ page }) => {
  await page.goto('number-input');
  const group = page.getByRole('group').filter({ has: page.getByLabel('Steppers 1000') });
  const box = await group.getByRole('button', { name: 'Increase' }).boundingBox();
  const frame = await group.boundingBox();
  expect(Math.abs(box!.width - box!.height)).toBeLessThan(1);
  expect(box!.height).toBeLessThan(frame!.height);
});

test('format writes the symbol as text', async ({ page }) => {
  await page.goto('number-input');
  await expect(page.getByLabel('Currency', { exact: true })).toHaveValue('$1,250.50');
  await expect(page.getByLabel('Currency in German')).toHaveValue('1.250,50\u00a0€');
});

test('allowOutOfRange keeps the typed number and shows the invalid state', async ({ page }) => {
  await page.goto('number-input');
  const input = page.getByLabel('Discount (0 to 50)');
  await input.fill('80');
  await input.blur();
  await expect(input).toHaveValue('80');
  await expect(input).toHaveAttribute('data-invalid', '');
});
