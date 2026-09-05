import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: '+e.message.slice(0,140)));
page.on('console', m => { if (m.type()==='error') errs.push('CONSOLE: '+m.text().slice(0,140)); });
await page.goto('http://localhost:4174/pt', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const state = async (label) => {
  const s = await page.evaluate(() => ({
    len: document.body.innerText.length,
    scrollY: window.scrollY,
    docH: document.documentElement.scrollHeight,
    visTop: (() => { const el = document.elementFromPoint(innerWidth/2, innerHeight/2); return el ? (el.tagName+'.'+(el.className||'').toString().slice(0,30)) : 'null'; })()
  }));
  console.log(label, JSON.stringify(s));
};
await state('home início:');
// clicar SOBRE no header (visível)
await page.locator('header a:has-text("SOBRE"), nav a:has-text("SOBRE")').first().click();
await page.waitForTimeout(3000);
await state('após SOBRE:');
await page.screenshot({path:'../shots/nav_after_sobre.png'});
await page.locator('header a:has-text("SERVIÇOS"), nav a:has-text("SERVIÇOS")').first().click();
await page.waitForTimeout(3000);
await state('após SERVIÇOS:');
console.log('erros:', errs.length ? errs : 'nenhum');
await browser.close();
