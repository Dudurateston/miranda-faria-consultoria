import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
await page.goto('http://localhost:4174/pt', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const info = await page.evaluate(() => {
  const nav = document.querySelector('.mf-nav__link');
  const hdr = nav?.closest('header, nav, [class*=nav]');
  const r = nav?.getBoundingClientRect();
  const hr = hdr?.getBoundingClientRect();
  const cs = nav ? getComputedStyle(nav) : null;
  const hcs = hdr ? getComputedStyle(hdr) : null;
  // ancestors com transform
  let el = nav, transforms = [];
  while (el && el !== document.body) {
    const t = getComputedStyle(el).transform;
    if (t && t !== 'none') transforms.push(el.className?.toString().slice(0,40) || el.tagName);
    el = el.parentElement;
  }
  return {
    navRect: r ? {x:r.x,y:r.y,w:r.width,h:r.height} : null,
    hdrClass: hdr?.className?.toString().slice(0,60),
    hdrRect: hr ? {x:hr.x,y:hr.y,w:hr.width,h:hr.height,position:hcs?.position} : null,
    navTransform: cs?.transform,
    transformedAncestors: transforms
  };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
