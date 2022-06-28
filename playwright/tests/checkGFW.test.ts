import { test, expect } from '@playwright/test';

test('GFW daily check in', async ({ page }) => {
    await page.goto('https://136900.xyz/auth/login');


    // login
    await page.locator('input#email').fill('lp9640@126.com');
    await page.locator('input#password').fill('3guFwmJBWo91');
    await page.locator('button:has-text("登录")').click();

    // check in
    await page.locator('#checkin-div').click();
})