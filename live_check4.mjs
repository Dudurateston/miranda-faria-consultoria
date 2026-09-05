import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push(e.message.slice(0,90)));
await page.goto('https://mirandafaria.base44.app/pt', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(5000);
// clicar via evaluate (navegação SPA real, sem reload)
await page.evaluate(() => { const a=[...document.querySelectorAll('a[href="/pt/about"]')].find(x=>x.offsetParent); a.click(); });
await page.waitForTimeout(2500);
const aboutLen = await page.evaluate(() => document.body.innerText.length);
console.log('Sobre: len =', aboutLen, aboutLen>500 ? 'OK ✓' : '*** BRANCO ***');
await page.evaluate(() => { const a=[...document.querySelectorAll('a[href="/pt/design"],a[href*="design"]')].find(x=>x.offsetParent); if(a) a.click(); });
await page.waitForTimeout(3000);
const des = await page.evaluate(() => {
  const vids = [...document.querySelectorAll('video')].map(v=>v.src.includes('supabase'));
  return { rota: location.pathname, supabase: vids, len: document.body.innerText.length };
});
console.log('design:', JSON.stringify(des));
console.log('pageerrors:', errs.length?errs:'0 ✓');
await browser.close();
