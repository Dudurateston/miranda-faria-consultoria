import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: '+e.message.slice(0,130)));
page.on('console', m => { if (m.type()==='error') errs.push('CONSOLE: '+m.text().slice(0,110)); });
await page.goto('http://localhost:4199/pt', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, 2000));   // revela nav
await page.waitForTimeout(800);
const navVisible = await page.evaluate(() => document.querySelector('.mf-nav').dataset.show);
console.log('nav data-show após scroll:', navVisible);
await page.locator('.mf-nav a:has-text("Sobre")').click();
await page.waitForTimeout(3000);
const st = await page.evaluate(() => ({
  url: location.pathname,
  len: document.body.innerText.length,
  scrollY: Math.round(window.scrollY),
  docH: document.documentElement.scrollHeight,
  firstH: document.querySelector('main h1, main h2, section h2')?.innerText?.slice(0,40) || '(nada)',
  mainOp: (() => { const m = document.querySelector('main'); return m ? getComputedStyle(m).opacity : 'sem main'; })(),
  centerEl: (() => { const el = document.elementFromPoint(innerWidth/2, innerHeight/2); return el ? el.tagName+'.'+(el.className||'').toString().slice(0,35) : 'null'; })()
}));
console.log('APÓS CLIQUE:', JSON.stringify(st, null, 1));
await page.screenshot({path:'../shots/nav_after_sobre3.png'});
console.log('erros:', errs.length ? errs.slice(0,5) : 'nenhum');
await browser.close();
