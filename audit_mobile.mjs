import { chromium } from 'playwright';
const browser = await chromium.launch();
const mp = await (await browser.newContext({viewport:{width:390,height:844}, isMobile:true, hasTouch:true})).newPage();
await mp.goto('http://localhost:4174/pt', { waitUntil: 'networkidle' });
await mp.waitForTimeout(1000);
// todos elementos clicáveis do header
const hdr = await mp.evaluate(() => {
  const els = [...document.querySelectorAll('header *, nav *')].filter(e => e.offsetParent && (e.tagName === 'A' || e.tagName === 'BUTTON' || e.getAttribute('role') === 'button'));
  return els.map(e => ({tag: e.tagName, txt:(e.innerText||e.getAttribute('aria-label')||'').slice(0,24), w: e.offsetWidth, h: e.offsetHeight}));
});
console.log('HEADER (mobile):', JSON.stringify(hdr, null, 0));
// se existe hamburger, clicar
const ham = mp.locator('[aria-label*="enu"], [class*=burger], [class*=hamburg], button:has(svg)').first();
if (await ham.count()) {
  await ham.click({force:true}).catch(()=>{});
  await mp.waitForTimeout(600);
  const menu = await mp.evaluate(() => {
    const els = [...document.querySelectorAll('a')].filter(e => e.offsetParent && e.closest('nav, header, [class*=menu], [class*=drawer], [class*=sheet]'));
    return els.map(e => ({txt:(e.innerText||'').slice(0,18), h: e.offsetHeight}));
  });
  console.log('MENU ABERTO:', JSON.stringify(menu));
}
await mp.screenshot({path:'/app/conversations/69d13ac16e1663b653537e91/shots/mobile-pt.png'});
await mp.goto('http://localhost:4174/pt', { waitUntil: 'networkidle' });
await mp.waitForTimeout(800);
await mp.screenshot({path:'/app/conversations/69d13ac16e1663b653537e91/shots/mobile-pt-hero.png'});
// desktop hero + work
const dp = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
await dp.goto('http://localhost:4174/pt', { waitUntil: 'networkidle' });
await dp.waitForTimeout(1000);
await dp.screenshot({path:'/app/conversations/69d13ac16e1663b653537e91/shots/desktop-pt-hero.png'});
await dp.goto('http://localhost:4174/pt/work', { waitUntil: 'networkidle' });
await dp.waitForTimeout(800);
await dp.screenshot({path:'/app/conversations/69d13ac16e1663b653537e91/shots/desktop-work.png'});
console.log('screenshots ok');
await browser.close();
