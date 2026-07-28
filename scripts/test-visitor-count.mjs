import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5173/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const logs = [];
page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));
page.on("response", (res) => {
  if (res.url().includes("counterapi")) {
    logs.push(`[response] ${res.status()} ${res.url()}`);
  }
});
page.on("requestfailed", (req) => {
  if (req.url().includes("counterapi")) {
    logs.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`);
  }
});

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(5000);

const footer = await page.locator("footer").innerText().catch(() => "(no footer)");
const visitors = await page.locator(".footer-visitors").count();
const visitorsText = visitors
  ? await page.locator(".footer-visitors").innerText()
  : "(missing .footer-visitors)";

console.log(JSON.stringify({ url, visitors, visitorsText, footer, logs }, null, 2));
await browser.close();
