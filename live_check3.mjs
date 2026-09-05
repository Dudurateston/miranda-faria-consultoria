import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push(e.message.slice(0,90)));
await page.goto('https://mirandafaria.base44.app/pt', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(6000);
console.log('url final:', page.url().replace('https://mirandafaria.base44.app','') || '/');
const hero = await page.evaluate(() => {
  const v = document.querySelector('.mf-hero__bg');
  return v ? { file: (v.currentSrc||v.src).split('/').pop(), w: v.videoWidth } : null;
});
console.log('hero:', JSON.stringify(hero));
await page.locator('.mf-nav a:has-text("Sobre")').first().click({timeout:10000});
await page.waitForTimeout(2000);
const len = await page.evaluate(() => document.body.innerText.length);
console.log('Sobre sem reload: len =', len, len>500 ? 'OK ✓' : '*** BRANCO ***');
console.log('pageerrors:', errs.length?errs:'0 ✓');
await browser.close();
