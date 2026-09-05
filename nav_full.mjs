import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: '+e.message.slice(0,100)));
await page.goto('http://localhost:4199/pt', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(700);
const check = async (label) => {
  await page.waitForTimeout(1800);
  const s = await page.evaluate(() => ({
    len: document.body.innerText.length,
    h: document.querySelector('main h1, main h2, section h1, section h2')?.innerText?.slice(0,30) || '(vazio)',
    scrollY: Math.round(window.scrollY)
  }));
  console.log(label, JSON.stringify(s));
  return s.len > 50;
};
// cadeia completa de navegação por clique
await page.locator('.mf-nav a:has-text("Sobre")').click(); await check('Sobre:');
await page.locator('.mf-nav a:has-text("Serviços")').click(); await check('Serviços:');
await page.locator('.mf-nav a:has-text("Trabalhos"), .mf-nav a:has-text("Diagnóstico")').first().click(); await check('Interna:');
// trocar idioma
await page.locator('button:has-text("VIEW IN ENGLISH")').click().catch(async ()=>{});
await check('EN:');
// footer -> case
await page.locator('footer a').first().click(); await check('Footer→');
console.log('pageerrors:', errs.length ? errs.slice(0,3) : 'nenhum');
await browser.close();
