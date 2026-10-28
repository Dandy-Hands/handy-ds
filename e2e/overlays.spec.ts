import { test, expect, type Page } from '@playwright/test';

// pages.spec.ts loads each page with every overlay closed, so an error inside an open popup
// slips through. This opens each overlay demo and fails on any page or console error.
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return errors;
}

for (const slug of ['dialog', 'alert-dialog', 'drawer', 'popover']) {
  test(`${slug} demos open without errors`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(slug);
    const buttons = page.locator('main button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      if (!(await button.isVisible())) continue;
      await button.click();
      await page.waitForTimeout(250);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(250);
    }
    expect(errors).toEqual([]);
  });
}

for (const [slug, selector] of [['tooltip', 'main button'], ['preview-card', 'main a']] as const) {
  test(`${slug} demos open without errors`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(slug);
    const triggers = page.locator(selector);
    const count = await triggers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const trigger = triggers.nth(i);
      if (!(await trigger.isVisible())) continue;
      await trigger.hover();
      await page.waitForTimeout(800);
      await page.mouse.move(0, 0);
      await page.waitForTimeout(400);
    }
    expect(errors).toEqual([]);
  });
}
