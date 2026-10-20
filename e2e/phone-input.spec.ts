import { test, expect } from '@playwright/test';

const input = (page: import('@playwright/test').Page) => page.getByLabel('Masked phone');

test('typing masks the text and strips symbols', async ({ page }) => {
  await page.goto('phone-input');
  const el = input(page);
  await el.fill('');
  await el.pressSequentially('2025550123');
  await expect(el).toHaveValue('(202) 555-0123');
  await el.fill('');
  await el.pressSequentially('202-5');
  await expect(el).toHaveValue('(202) 5');
});

test('Backspace removes digits and does not stop on a symbol', async ({ page }) => {
  await page.goto('phone-input');
  const el = input(page);
  await el.fill('');
  await el.pressSequentially('2025');
  await expect(el).toHaveValue('(202) 5');
  await page.keyboard.press('Backspace');
  await expect(el).toHaveValue('(202');
  await page.keyboard.press('Backspace');
  await expect(el).toHaveValue('(20');
});

test('an edit in the middle keeps the caret on the same digit', async ({ page }) => {
  await page.goto('phone-input');
  const el = input(page);
  await el.fill('');
  await el.pressSequentially('2025550123');
  // Caret after the 5th digit (index 8 is after "(202) 55"), then delete that digit.
  await el.evaluate((n: HTMLInputElement) => n.setSelectionRange(8, 8));
  await page.keyboard.press('Backspace');
  await expect(el).toHaveValue('(202) 550-123');
  expect(await el.evaluate((n: HTMLInputElement) => n.selectionStart)).toBe(7);
});

test('the hidden input posts digits, and an incomplete number fails the pattern', async ({ page }) => {
  await page.goto('phone-input');
  const el = input(page);
  await el.fill('');
  await el.pressSequentially('202555');
  expect(await el.evaluate((n: HTMLInputElement) => n.validity.patternMismatch)).toBe(true);
  await el.pressSequentially('0123');
  expect(await el.evaluate((n: HTMLInputElement) => n.validity.patternMismatch)).toBe(false);
});
