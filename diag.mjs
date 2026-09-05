import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: ' + e.message.slice(0,300)));
page.on('console', m => { if (m.type()==='error') errs.push('CONSOLE: ' + m.text().slice(0,300)); });
await page.goto('http://localhost:4199/pt', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(700);
await page.locator('.mf-nav a:has-text("Sobre")').click();
await page.waitForTimeout(2500);
const rootState = await page.evaluate(() => ({
  rootChildren: document.getElementById('root')?.children.length,
  rootHtml: document.getElementById('root')?.innerHTML?.slice(0,120),
  len: document.body.innerText.length
}));
console.log('root:', JSON.stringify(rootState, null, 1));
console.log('--- erros (todos) ---');
errs.forEach(e => console.log(e, '\n'));
await browser.close();
