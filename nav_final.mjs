import { chromium } from 'playwright';
async function run(label, reduced) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1440,height:900}, reducedMotion: reduced});
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0,80)));
  await page.goto('http://localhost:4199/pt', { waitUntil:'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(700);
  const results = [];
  const go = async (sel, name) => {
    try { await page.locator(sel).first().click({timeout:8000}); } catch(e) { results.push(name+': LINK NÃO ACHADO'); return; }
    await page.waitForTimeout(1800);
    const len = await page.evaluate(() => document.body.innerText.length);
    results.push(`${name}: len=${len} ${len > 100 ? 'OK' : '*** BRANCO ***'}`);
  };
  await go('.mf-nav a:has-text("Sobre")', 'Home→Sobre');
  await go('.mf-nav a:has-text("Serviços")', 'Sobre→Serviços');
  await go('.mf-nav a:has-text("Como")', 'Serviços→ComoTrabalho');
  await go('.mf-nav a:has-text("Diagnóstico"), .mf-nav a:has-text("Insights")', '→Insights');
  await go('footer a', 'Footer→case');
  console.log(label, '|', results.join(' | '), '| pageerrors:', errs.length ? errs : '0');
  await browser.close();
}
await run('reduced-motion=ON ', 'reduce');
await run('reduced-motion=OFF', 'no-preference');
