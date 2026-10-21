import { test, expect } from '@playwright/test';

const height = (el: import('@playwright/test').Locator) => el.evaluate((n) => n.getBoundingClientRect().height);

test('auto grow follows the text and shrinks back', async ({ page }) => {
  await page.goto('text-area');
  const el = page.getByLabel('Auto grow', { exact: true });
  const start = await height(el);
  await el.fill('1\n2\n3\n4\n5\n6');
  expect(await height(el)).toBeGreaterThan(start);
  await el.fill('');
  expect(await height(el)).toBe(start);
});

test('maxRows stops the growth and the field scrolls', async ({ page }) => {
  await page.goto('text-area');
  const el = page.getByLabel('Auto grow with limit');
  await el.fill('1\n2\n3');
  const three = await height(el);
  await el.fill('1\n2\n3\n4\n5\n6\n7\n8');
  const many = await height(el);
  expect(many).toBeGreaterThan(three);
  await el.fill('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
  expect(await height(el)).toBe(many);
  expect(await el.evaluate((n) => n.scrollHeight > n.clientHeight)).toBe(true);
});

test('a field without autoGrow keeps its height and can be resized', async ({ page }) => {
  await page.goto('text-area');
  const el = page.getByLabel('Six rows');
  const start = await height(el);
  await el.fill('1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
  expect(await height(el)).toBe(start);
  expect(await el.evaluate((n) => getComputedStyle(n).resize)).toBe('vertical');
});
