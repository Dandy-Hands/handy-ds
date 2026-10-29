import { test, expect } from '@playwright/test';

test('view: a child out of view waits, then animates in when it scrolls into view', async ({ page }) => {
  await page.goto('animate');
  const card = page.getByTestId('animate-view').locator('.hds-card').first();
  await expect(card).toHaveAttribute('data-pending', '');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-visible', '');
  await expect(card).not.toHaveAttribute('data-pending');
  await expect(card).toHaveCSS('animation-name', 'hds-animate-fade-up');
  await expect(card).toHaveCSS('opacity', '1');
});

test('view: a child in view at load shows at once, with no animation', async ({ page }) => {
  await page.goto('animate');
  // Make the viewport taller than the distance to the cards, then load again.
  const top = await page.getByTestId('animate-view').evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.setViewportSize({ width: 1280, height: Math.ceil(top) + 400 });
  await page.reload();
  const card = page.getByTestId('animate-view').locator('.hds-card').first();
  await expect(card).toBeVisible();
  await expect(card).not.toHaveAttribute('data-pending');
  await expect(card).toHaveCSS('animation-name', 'none');
});

test('mount: added children animate, one after another with stagger', async ({ page }) => {
  await page.goto('animate');
  await page.getByRole('button', { name: 'Load reviews' }).click();
  const cards = page.getByTestId('animate-mount').locator('.hds-card');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toHaveCSS('animation-name', 'hds-animate-fade-up');
  await expect(cards.nth(0)).toHaveCSS('animation-delay', '0s');
  await expect(cards.nth(2)).toHaveCSS('animation-delay', '0.2s');
});

test('reduced motion: durations are 0ms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('animate');
  await page.getByRole('button', { name: 'Load reviews' }).click();
  const card = page.getByTestId('animate-mount').locator('.hds-card').first();
  await expect(card).toHaveCSS('animation-duration', '0s');
  await expect(card).toHaveCSS('opacity', '1');
});
