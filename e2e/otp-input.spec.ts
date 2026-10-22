import { test, expect } from '@playwright/test';

const row = (page, label: string) => page.getByRole('group', { name: label });

test('groups render the boxes and one separator between groups', async ({ page }) => {
  await page.goto('otp-input');
  const group = row(page, 'Three and three');
  await expect(group.getByRole('textbox')).toHaveCount(6);
  await expect(group.getByRole('separator')).toHaveCount(1);
  await expect(row(page, 'Six boxes').getByRole('separator')).toHaveCount(0);
  await expect(row(page, 'Four groups of two').getByRole('separator')).toHaveCount(3);
});

test('the boxes after the first have character labels', async ({ page }) => {
  await page.goto('otp-input');
  const group = row(page, 'Six boxes');
  await expect(group.getByLabel('Character 2 of 6')).toBeVisible();
  await expect(group.getByLabel('Character 6 of 6')).toBeVisible();
});

test('each box is a square of the size step', async ({ page }) => {
  await page.goto('otp-input');
  for (const [label, px] of [['Size 800', 32], ['Size 1000', 40], ['Size 1200', 48]] as const) {
    const box = await row(page, label).getByRole('textbox').first().boundingBox();
    expect(box?.width).toBeCloseTo(px, 0);
    expect(box?.height).toBeCloseTo(px, 0);
  }
});

test('a paste into the first box fills every box', async ({ page }) => {
  await page.goto('otp-input');
  const group = row(page, 'Three and three');
  const first = group.getByRole('textbox').first();
  await first.focus();
  await first.evaluate((el) => {
    const data = new DataTransfer();
    data.setData('text/plain', '12 34 56');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
  });
  await expect(group.getByRole('textbox').last()).toHaveValue('6');
});
