import { chromium } from 'playwright';
const BASE = 'http://localhost:4174';
const routes = ['/pt','/en','/pt/work','/en/work','/pt/design','/pt/gestao','/pt/desenvolvimento','/pt/servicos','/pt/insights','/pt/how-i-work','/pt/about','/pt/contact','/en/about','/pt/work/dj-jotave','/pt/work/roda-agro-marca','/pt/work/motormoura-marca','/pt/work/1000-pecas-marca','/pt/work/roda-agro','/pt/work/rota-forte','/pt/work/queijos-serra','/pt/work/miranda-faria'];
const browser = await chromium.launch();
const report = { errors: [], overflow: [], brokenImgs: [], badLinks: [], seo: [], a11y: [], links: new Set(), whatsapp: new Set(), videos: [] };
for (const r of routes) {
  const page = await (await browser.newContext({ viewport: r.startsWith('/pt') && ['mobile'].includes('') ? {} : {width:1440,height:900} })).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0,90)));
  page.on('response', res => { if (res.status() >= 400) report.badLinks.push(`${r} -> ${res.status()} ${res.url().slice(0,90)}`); });
  try {
    await page.goto(BASE + r, { waitUntil: 'networkidle', timeout: 25000 });
    await page.waitForTimeout(1500);
    if (errs.length) report.errors.push(`${r}: ${errs.join(' | ')}`);
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) report.overflow.push(r);
    // broken images
    const bad = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(-60)));
    if (bad.length) report.brokenImgs.push(`${r}: ${bad.join(', ')}`);
    // no-alt images (content imgs)
    const noAlt = await page.evaluate(() => [...document.images].filter(i => !i.alt && !i.src.includes('data:')).length);
    if (noAlt > 0) report.a11y.push(`${r}: ${noAlt} img sem alt`);
    // SEO tags
    const seo = await page.evaluate(() => ({
      title: document.title, desc: document.querySelector('meta[name=description]')?.content?.slice(0,60),
      canon: document.querySelector('link[rel=canonical]')?.href,
      hl: document.querySelectorAll('link[rel=alternate][hreflang]').length,
      og: document.querySelector('meta[property="og:title"]')?.content?.slice(0,40),
      ogimg: document.querySelector('meta[property="og:image"]')?.content?.slice(0,50),
      jsonld: !!document.querySelector('script[type="application/ld+json"]')
    }));
    report.seo.push(`${r} | t:"${seo.title?.slice(0,38)}" | canon:${seo.canon? 'Y':'N'} hl:${seo.hl} og:${seo.og?'Y':'N'} ogimg:${seo.ogimg? 'Y':'N'} ld:${seo.jsonld?'Y':'N'}`);
    // links + wa
    const ls = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href));
    ls.forEach(h => { if (h.includes('wa.me') || h.includes('whatsapp')) report.whatsapp.add(h.split('?')[0]); if (h.startsWith(location.origin)) report.links.add(h.replace(BASE,'')); });
    // videos
    const vids = await page.evaluate(() => [...document.querySelectorAll('video')].map(v => ({src: (v.currentSrc||v.src||'').slice(-50), playing: !v.paused})));
    vids.forEach(v => report.videos.push(`${r}: ${v.src} ${v.playing?'▶':'paused'}`));
  } catch (e) { report.errors.push(`${r}: FALHA ${e.message.slice(0,70)}`); }
  await page.close();
}
// rotas linkadas que não existem (404 check real)
const notFound = [];
for (const l of [...report.links]) {
  if (!l || l.startsWith('#')) continue;
  const res = await fetch(BASE + l.split('#')[0]).catch(()=>null);
  if (!res || res.status !== 200) notFound.push(l);
}
console.log('== ERROS JS =='); report.errors.forEach(e => console.log(e));
console.log('== OVERFLOW =='); report.overflow.forEach(e => console.log(e));
console.log('== IMGS QUEBRADAS =='); report.brokenImgs.forEach(e => console.log(e));
console.log('== REQS 4xx/5xx =='); report.badLinks.slice(0,10).forEach(e => console.log(e));
console.log('== A11Y =='); report.a11y.forEach(e => console.log(e));
console.log('== LINKS 404 =='); notFound.forEach(e => console.log(e));
console.log('== WHATSAPP =='); [...report.whatsapp].forEach(e => console.log(e));
console.log('== SEO =='); report.seo.forEach(e => console.log(e));
console.log('== VÍDEOS =='); report.videos.slice(0,12).forEach(e => console.log(e));
await browser.close();
