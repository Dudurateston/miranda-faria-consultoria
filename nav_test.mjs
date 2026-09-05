import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push(e.message.slice(0,120)));
page.on('console', m => { if (m.type()==='error') errs.push('console: '+m.text().slice(0,100)); });
await page.goto('http://localhost:4174/pt', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const hasContent = () => page.evaluate(() => document.body.innerText.length);
console.log('home text len:', await hasContent());
// clicar em SOBRE no nav
const sobre = page.locator('a:has-text("SOBRE")').first();
if (await sobre.count()) {
  await sobre.click();
  await page.waitForTimeout(2500);
  const txt = await hasContent();
  const url = page.url();
  const h1 = await page.locator('h1,h2').first().innerText().catch(()=> '(vazio)');
  console.log(`após clique SOBRE: url=${url} textlen=${txt} h1="${h1}"`);
  // voltar pro home clicando no logo
  await page.locator('a[class*=logo]').first().click().catch(async ()=> { await page.goto('http://localhost:4174/pt'); });
  await page.waitForTimeout(2000);
  console.log('após voltar home: url=', page.url(), 'textlen=', await hasContent());
  // clicar em TRABALHOS
  const trab = page.locator('a:has-text("TRABALHOS")').first();
  if (await trab.count()) { await trab.click(); await page.waitForTimeout(2500);
    console.log(`após clique TRABALHOS: url=${page.url()} textlen=${await hasContent()}`); }
}
// mobile também
const mp = await (await browser.newContext({viewport:{width:390,height:844}, isMobile:true, hasTouch:true})).newPage();
await mp.goto('http://localhost:4174/pt', { waitUntil:'networkidle' });
await mp.waitForTimeout(1000);
await mp.locator('a:has-text("SOBRE")').first().click();
await mp.waitForTimeout(2500);
console.log('mobile após SOBRE: url=', mp.url(), 'textlen=', await mp.evaluate(()=>document.body.innerText.length));
console.log('erros:', errs.length ? errs.slice(0,4) : 'nenhum');
await browser.close();
