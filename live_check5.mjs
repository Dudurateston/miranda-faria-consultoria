import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push(e.message.slice(0,90)));
await page.goto('https://mirandafaria.base44.app/pt/design', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(5000);
const des = await page.evaluate(async () => {
  const vids = [...document.querySelectorAll('video')].map(v=>({sb: (v.src||'').includes('supabase'), w: v.videoWidth}));
  return { rota: location.pathname, vids, len: document.body.innerText.length };
});
console.log('design:', JSON.stringify(des));
// scroll até os vídeos
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight/2));
await page.waitForTimeout(2500);
const vids2 = await page.evaluate(() => [...document.querySelectorAll('video')].map(v=>({sb:(v.src||'').includes('supabase'), w:v.videoWidth, r:v.readyState})));
console.log('após scroll:', JSON.stringify(vids2));
console.log('pageerrors:', errs.length?errs:'0 ✓');
await browser.close();
