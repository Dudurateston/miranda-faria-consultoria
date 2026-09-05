import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push(e.message.slice(0,90)));
await page.goto('https://mirandafaria.base44.app/pt', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(6000);
const url1 = page.url();
const hero = await page.evaluate(() => {
  const v = document.querySelector('.mf-hero__bg');
  return v ? { file: (v.currentSrc||v.src).split('/').pop(), w: v.videoWidth, ready: v.readyState } : null;
});
console.log('url:', url1.replace('https://mirandafaria.base44.app','') || '/');
console.log('hero:', JSON.stringify(hero));
// navegação SEM reload
await page.locator('.mf-nav a:has-text("Sobre")').first().click({timeout:10000});
await page.waitForTimeout(2000);
const about = await page.evaluate(() => document.body.innerText.length);
console.log('Sobre sem reload: len =', about, about>500 ? 'OK ✓' : '*** BRANCO ***');
// Design — vídeos do Supabase e banda acima do texto
await page.locator('.mf-nav a:has-text("Design"), .mf-nav a:has-text("Servi")').first().click({timeout:10000}).catch(()=>console.log('nav design não achada (ok se label diferente)'));
await page.waitForTimeout(3000);
const des = await page.evaluate(() => {
  const vids = [...document.querySelectorAll('video')].map(v=>v.src.includes('supabase'));
  const band = document.querySelector('.mf-pr__genband'), inner = document.querySelector('.mf-pr__geninner');
  return { vidsSupabase: vids, bandFirst: band && inner ? band.getBoundingClientRect().top < inner.getBoundingClientRect().top : null, len: document.body.innerText.length };
});
console.log('design:', JSON.stringify(des));
console.log('pageerrors:', errs.length?errs:'0 ✓');
await browser.close();
