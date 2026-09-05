import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
const errs = [];
page.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,100)); });
await page.goto('http://localhost:4199/pt/design', { waitUntil:'networkidle' });
await page.waitForTimeout(2500);
const st = await page.evaluate(() => {
  const vids = [...document.querySelectorAll('video')];
  return {
    len: document.body.innerText.length,
    nVideos: vids.length,
    srcs: vids.map(v => v.currentSrc || v.src).map(u => u.replace(/^https?:\/\//,'').slice(0,60)),
    playing: vids.map(v => v.readyState >= 2)
  };
});
console.log(JSON.stringify(st, null, 1));
console.log('ordem do video:', await page.evaluate(() => {
  const band = document.querySelector('.mf-pr__genband');
  const inner = document.querySelector('.mf-pr__geninner');
  return band && inner ? (band.getBoundingClientRect().top < inner.getBoundingClientRect().top ? 'banda ACIMA do texto ✓' : 'banda abaixo') : '?';
}));
console.log('erros:', errs.length ? errs : 'nenhum');
await browser.close();
