import { test, expect } from '@playwright/test';

test('Section video is paused under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('section');
  const video = page.locator('video.hds-section__media').first();
  await expect(video).toBeAttached();
  await expect(video).toHaveJSProperty('paused', true);
  await expect(video).toHaveJSProperty('muted', true);
});
