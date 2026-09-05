import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
await page.goto('http://localhost:4174/pt', { waitUntil: 'networkidle' });
for (const t of [500, 2000, 5000]) {
  await page.waitForTimeout(t === 500 ? 500 : t - 500 > 0 ? 1500 : 0);
  const s = await page.evaluate(() => {
    const nav = document.querySelector('.mf-nav');
    const cs = getComputedStyle(nav);
    const r = nav.getBoundingClientRect();
    return { transform: cs.transform, opacity: cs.opacity, transition: cs.transition?.slice(0,80), rect: {y: Math.round(r.y), h: Math.round(r.height)} };
  });
  console.log(new Date().toISOString().slice(17,23), JSON.stringify(s));
}
// CSS fonte do transform
const cssRule = await page.evaluate(() => {
  for (const sheet of document.styleSheets) {
    try { for (const r of sheet.cssRules) {
      if (r.selectorText?.includes('mf-nav') && r.style?.transform) return r.selectorText + ' { transform: ' + r.style.transform + ' }';
      if (r.media) for (const rr of r.cssRules) if (rr.selectorText?.includes('mf-nav') && rr.style?.transform) return '@media ' + r.media.mediaText + ' ' + rr.selectorText + ' { transform: ' + rr.style.transform + ' }';
    } } catch(e) {}
  }
  return 'não achou';
});
console.log('CSS:', cssRule);
await browser.close();
