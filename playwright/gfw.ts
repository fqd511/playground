import { chromium } from "playwright";

export const GFWCheckIn = async () => {
  const browser = await chromium.launch({
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

  const checkInLabel = await page.locator("#checkin-div").textContent();

  if (checkInLabel?.trim() === "每日签到") {
    await page.locator("#checkin-div").click();
    const resultLabel = await page.locator("#swal2-title").textContent();
    if (resultLabel?.trim() === "签到成功") {
      browser.close().then(() => {
        return "签到成功"
      });
    } else {
      throw new Error("gfw fail:resultLabel 不是 签到成功");
    }
  } else {
    throw new Error("gfw fail:不是 每日签到");
  }
};
