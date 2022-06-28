import { chromium } from 'playwright';

(async () => {
	const browser = await chromium.launch({ headless: false, timeout: 0 });

	const page = await browser.newPage();
	await page.goto('https://136900.xyz/auth/login', { timeout: 0 });

	// login
	await page.locator('input#email').fill('lp9640@126.com');
	await page.locator('input#password').fill('3guFwmJBWo91');

	await page.locator('button:has-text("登录")').click({ timeout: 0 });

	// check in
	await page.locator('text=Read').click({ timeout: 0 });
	await page.locator('#checkin-div').click();

	await browser.close();
})();