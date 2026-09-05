import { chromium } from 'playwright';
const BASE = 'http://localhost:4174';
const routes = ['/pt','/en','/pt/work','/pt/design','/pt/gestao','/pt/desenvolvimento','/pt/servicos','/pt/insights','/pt/how-i-work','/pt/about','/pt/contact','/en/about','/pt/work/dj-jotave','/pt/work/roda-agro-marca','/pt/work/motormoura-marca','/pt/work/1000-pecas-marca','/pt/work/roda-agro','/pt/work/rota-forte','/pt/work/queijos-serra','/pt/work/miranda-faria'];
const browser = await chromium.launch();
const links = new Set(), wa = new Set(), hub = new Set(), issues = [];
let videoCount = 0, vidPlaying = 0;
for (const r of routes) {
  const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0,80)));
  try {
    await page.goto(BASE + r, { waitUntil: 'networkidle', timeout: 25000 });
    await page.waitForTimeout(1200);
    if (errs.length) issues.push(`JS ${r}: ${errs[0]}`);
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) issues.push(`OVERFLOW ${r} (desktop)`);
    const data = await page.evaluate(() => {
      const out = { links: [], vids: [] };
      document.querySelectorAll('a[href]').forEach(a => out.links.push(a.href));
      document.querySelectorAll('video').forEach(v => out.vids.push({paused: v.paused, src: (v.currentSrc||v.src||'').slice(-40)}));
      return out;
    });
    data.links.forEach(h => {
      if (h.includes('wa.me')) wa.add(h.split('?')[0].replace('https://wa.me/',''));
      if (h.includes('vendas-uai') || h.toLowerCase().includes('hub')) hub.add(r + ' -> ' + h);
    });
    data.vids.forEach(v => { videoCount++; if (!v.paused) vidPlaying++; });
  } catch (e) { issues.push(`FALHA ${r}: ${e.message.slice(0,60)}`); }
  await page.close();
}
// MOBILE: home + nav alvos de toque
const mp = await (await browser.newContext({viewport:{width:390,height:844}, isMobile:true, hasTouch:true})).newPage();
const merrs = [];
mp.on('pageerror', e => merrs.push(e.message.slice(0,80)));
await mp.goto(BASE + '/pt', { waitUntil: 'networkidle' });
await mp.waitForTimeout(1500);
if (await mp.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) issues.push('OVERFLOW /pt (mobile)');
if (merrs.length) issues.push('JS mobile: ' + merrs[0]);
// abrir menu mobile e medir alvos
await mp.locator('button[aria-label], [class*=menu] button, button').first();
const navInfo = await mp.evaluate(() => {
  const hdr = document.querySelector('header, nav');
  const hdrH = hdr ? hdr.getBoundingClientRect().height : 0;
  // procura botao de menu
  const btns = [...document.querySelectorAll('button')].map(b => ({t: (b.innerText||b.getAttribute('aria-label')||'').slice(0,20), w: b.offsetWidth, h: b.offsetHeight}));
  return { hdrH, btns: btns.filter(b => b.w > 0).slice(0,8) };
});
console.log('== ISSUES =='); issues.forEach(i => console.log(i)); if (!issues.length) console.log('nenhum');
console.log('== WHATSAPP ==', wa.size ? [...wa].join(', ') : 'NENHUM LINK wa.me ENCONTRADO');
console.log('== HUB U.AI ==', hub.size ? [...hub].join('\n  ') : 'NENHUM LINK DO HUB ENCONTRADO');
console.log('== VÍDEOS ==', `${vidPlaying}/${videoCount} rodando`);
console.log('== MOBILE NAV ==', JSON.stringify(navInfo));
await browser.close();
