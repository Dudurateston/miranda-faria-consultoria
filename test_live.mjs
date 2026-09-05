import { chromium } from "playwright";
const base = "https://app.base44.com/apps/6a74f6e6fbaa381e21a2415b/preview";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

let r = await page.goto(base + "/pt", { waitUntil: "domcontentloaded", timeout: 30000 });
console.log("home status:", r.status());
await page.waitForTimeout(2500);
console.log("hero rule count:", await page.locator(".mf-hero__rule").count(), "(esperado 0)");
const title = await page.locator(".mf-hero__title").innerText().catch(() => "?");
console.log("hero title:", title);

r = await page.goto(base + "/pt/how-i-work", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
console.log("how demos:", await page.locator(".mf-tf").count(), "(esperado 3)");
const names = await page.locator(".mf-hiw__demoname").allTextContents();
console.log("demos:", names.join(" | "));
const lead = await page.locator(".mf-hiw__demolead").innerText();
console.log("lead:", lead);

r = await page.goto(base + "/pt/insights", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);
await page.locator(".mf-dg__opt", { hasText: "Dependo de marketplace" }).first().click();
await page.waitForTimeout(600);
await page.locator(".mf-dg__opt--rev").nth(1).click();
await page.waitForTimeout(600);
await page.locator(".mf-dg__opt--urg", { hasText: "sangrando" }).first().click();
await page.waitForTimeout(2200);
console.log("per:", (await page.locator(".mf-dg__per").innerText()).replace(/\n/g, " "));
console.log("recovery:", (await page.locator(".mf-dg__recovery").innerText()).replace(/\n/g, " ").slice(0, 90));
console.log("copiar btn:", await page.getByRole("button", { name: "Copiar resultado" }).count());
await browser.close();
