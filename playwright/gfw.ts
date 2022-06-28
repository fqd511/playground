import { chromium } from "playwright";
import { Page } from "@playwright/test";

export const GFWCheckIn = async () => {
  const browser = await chromium.launch({
    // headless: false,
    timeout: 0,
    logger: {
      isEnabled: (name) => name === "browser",
      log: (name, severity, message) => console.log(`${name} ${message}`),
    },
  });

  const page = await browser.newPage();
  await page.goto("https://136900.xyz/auth/login", { timeout: 0 });

  // login
  await page.locator("input#email").fill("lp9640@126.com");
  await page.locator("input#password").fill("3guFwmJBWo91");
  await page.locator('button:has-text("登录")').click({ timeout: 0 });

  await page.locator("text=Read").click({ timeout: 0 });

  const isCheckedIn = await checkStatus(page);
  if (isCheckedIn) {
    browser.close();
  } else {
    throw new Error("gfw fail");
  }
};

// is successfully checked in
async function checkStatus(page: Page): Promise<boolean> {
  const label = await page.locator("#checkin-div").textContent();

  if (label?.trim() !== "明日再来") {
    await page.locator("#checkin-div").click();
    return checkStatus(page);
  } else {
    return true;
  }
}
