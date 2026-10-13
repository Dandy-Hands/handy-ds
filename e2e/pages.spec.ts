import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';

// Every component doc page must render with no page error and no console error.
const slugs = readdirSync('docs/components')
  .filter((f) => f.endsWith('.mdx') && f !== 'index.mdx')
  .map((f) => f.replace(/\.mdx$/, ''));

for (const slug of slugs) {
  test(`${slug} page renders without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(slug);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}
