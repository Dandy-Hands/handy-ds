import { test, expect } from '@playwright/test';

const input = (page: import('@playwright/test').Page) => page.locator('input[aria-label="Website"]');

test('blur adds https:// when the text has no scheme', async ({ page }) => {
  await page.goto('url-input');
  const el = input(page);
  await el.fill('example.com');
  await el.blur();
  await expect(el).toHaveValue('https://example.com');
});

test('blur keeps a scheme and an empty field as they are', async ({ page }) => {
  await page.goto('url-input');
  const el = input(page);
  await el.fill('http://example.com');
  await el.blur();
  await expect(el).toHaveValue('http://example.com');
  await el.fill('');
  await el.blur();
  await expect(el).toHaveValue('');
});

test('javascript: fails the default pattern', async ({ page }) => {
  await page.goto('url-input');
  const el = input(page);
  await el.fill('javascript:alert(1)');
  await el.blur();
  await expect(el).toHaveValue('javascript:alert(1)');
  expect(await el.evaluate((n: HTMLInputElement) => n.validity.patternMismatch)).toBe(true);
});
