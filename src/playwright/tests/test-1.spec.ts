import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  // Go to https://136900.xyz/auth/login
  await page.goto('https://136900.xyz/auth/login');

  // Fill input[name="email"]
  await page.locator('input[name="email"]').fill('lp9640@126.com');

  // Click input[name="password"]
  await page.locator('input[name="password"]').click();

  // Fill input[name="password"]
  await page.locator('input[name="password"]').fill('3guFwmJBWo91');

  // Click button:has-text("登录")
  await page.locator('button:has-text("登录")').click();
  await expect(page).toHaveURL('https://136900.xyz/user');

  // Click text=Read
  await page.locator('text=Read').click();

  // Click #checkin-div
  await page.locator('#checkin-div').click();

});