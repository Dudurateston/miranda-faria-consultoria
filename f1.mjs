import { chromium } from 'playwright';
const b=await chromium.launch();
const errs=[];
const d=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
d.on('pageerror',e=>errs.push(String(e).slice(0,70)));
await d.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await d.waitForTimeout(5500);
// rola ate a secao Servicos com rodas reais (Lenis intercepta wheel)
const secY=await d.evaluate(()=>document.querySelector('.mf-srows')?.getBoundingClientRect().top+window.scrollY);
await d.mouse.wheel(0,Math.round(secY-40)); await d.waitForTimeout(2200);
// pin engajado?
const state=async()=>d.evaluate(()=>{
  const el=document.querySelector('.mf-srows');
  const on=[...document.querySelectorAll('.mf-srows__rail span')].findIndex(s=>s.classList.contains('is-on'));
  const vids=[...document.querySelectorAll('.mf-srows video')].map(v=>({has:!!(v.currentSrc&&v.currentSrc.length),playing:!v.paused}));
  return {top:Math.round(el.getBoundingClientRect().top),chapter:on,vids,scrollY:Math.round(window.scrollY)};
});
let s=await state();
console.log('PIN INICIO:',JSON.stringify(s));
// avanca 4 capitulos
for (let k=0;k<4;k++){ await d.mouse.wheel(0,900); await d.waitForTimeout(900); }
s=await state();
console.log('MEIO DOS CAPITULOS:',JSON.stringify(s));
await d.screenshot({path:'/tmp/f1_mid.png'});
for (let k=0;k<4;k++){ await d.mouse.wheel(0,900); await d.waitForTimeout(700); }
s=await state();
console.log('FIM DO PIN:',JSON.stringify(s));
// soltou o pin e o CTA/metricas aparecem?
const ctaVisible=await d.evaluate(()=>{const el=document.querySelector('.mf-srows__direct');if(!el)return false;const r=el.getBoundingClientRect();return r.top<window.innerHeight&&r.bottom>0});
console.log('CTA direto visivel pos-pin:',ctaVisible);
// clique no capitulo navega?
await d.mouse.wheel(0,-3600); await d.waitForTimeout(1500);
const ch=await d.evaluate(()=>[...document.querySelectorAll('.mf-srows__rail span')].findIndex(s=>s.classList.contains('is-on')));
await d.evaluate(()=>{const rows=[...document.querySelectorAll('.mf-srows--pin .mf-srow')];const r=rows[Math.max(0,ch)]?.getBoundingClientRect();if(r)return {x:Math.round(r.x+200),y:Math.round(r.y+250)}});
const pt=await d.evaluate(()=>{const rows=[...document.querySelectorAll('.mf-srows--pin .mf-srow')];const r=rows[1]?.getBoundingClientRect();return {x:Math.round(r.x+250),y:Math.round(r.y+300)}});
await d.mouse.click(pt.x,pt.y); await d.waitForTimeout(2500);
console.log('ROTA POS-CLIQUE:',d.url().split('/').slice(-1)[0]);
// magnetismo: perto e longe do link SOBRE
await d.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await d.waitForTimeout(4000);
await d.evaluate(()=>window.scrollTo(0,700));
await d.waitForTimeout(900);
const lk=await d.evaluate(()=>{const e=[...document.querySelectorAll('.mf-nav__links a')].find(a=>(a.textContent||'').trim().toUpperCase().startsWith('SOBRE')&&a.offsetHeight>0);const r=e.getBoundingClientRect();return {x:Math.round(r.x+r.width/2-60),y:Math.round(r.y+r.height/2)}});
await d.mouse.move(lk.x,lk.y); await d.waitForTimeout(700);
const near=await d.evaluate(()=>{const e=[...document.querySelectorAll('.mf-nav__links a')].find(a=>(a.textContent||'').trim().toUpperCase().startsWith('SOBRE'));return e.style.translate||'(vazio)'});
await d.mouse.move(700,450); await d.waitForTimeout(700);
const far=await d.evaluate(()=>{const e=[...document.querySelectorAll('.mf-nav__links a')].find(a=>(a.textContent||'').trim().toUpperCase().startsWith('SOBRE'));return e.style.translate||'(vazio)'});
console.log('MAGNETISMO perto:',near,'| longe:',far);
console.log('erros JS desktop:',errs.length?errs:'0');
await d.close();
// MOBILE 390: sem pin, linhas normais, sem overflow
const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
const merrs=[]; m.on('pageerror',e=>merrs.push(String(e).slice(0,60)));
await m.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await m.waitForTimeout(6000);
const mob=await m.evaluate(()=>({pin:!!document.querySelector('.mf-srows--pin'),rows:document.querySelectorAll('.mf-srow').length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}));
console.log('MOBILE:',JSON.stringify(mob),'| erros:',merrs.length?merrs:'0');
// REDUCED MOTION: sem pin
const rctx=await (await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'})).newPage();
await rctx.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await rctx.waitForTimeout(4000);
const rm=await rctx.evaluate(()=>!!document.querySelector('.mf-srows--pin'));
console.log('REDUCED-MOTION pin? ',rm,'(tem que ser false)');
await b.close();
