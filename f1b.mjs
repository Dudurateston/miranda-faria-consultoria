import { chromium } from 'playwright';
const b=await chromium.launch();
const errs=[];
const d=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
d.on('pageerror',e=>errs.push(String(e).slice(0,70)));
await d.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await d.waitForTimeout(5500);
const secY=await d.evaluate(()=>document.querySelector('.mf-srows')?.getBoundingClientRect().top+window.scrollY);
await d.mouse.wheel(0,Math.round(secY-40)); await d.waitForTimeout(2200);
// avanca 1 capitulo e CLICA no capitulo Desenvolvimento (index 1)
await d.mouse.wheel(0,1100); await d.waitForTimeout(1200);
const ch=await d.evaluate(()=>[...document.querySelectorAll('.mf-srows__rail span')].findIndex(s=>s.classList.contains('is-on')));
console.log('capitulo ativo:',ch);
const pt=await d.evaluate(()=>{const rows=[...document.querySelectorAll('.mf-srows--pin .mf-srow')];const r=rows[1]?.getBoundingClientRect();return {x:Math.round(r.x+250),y:Math.round(r.y+300)}});
await d.mouse.click(pt.x,pt.y); await d.waitForTimeout(2500);
console.log('ROTA POS-CLIQUE:',d.url().split('/').slice(-1)[0]);
// magnetismo
await d.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await d.waitForTimeout(4500);
await d.evaluate(()=>window.scrollTo(0,700));
await d.waitForTimeout(900);
const lk=await d.evaluate(()=>{const e=[...document.querySelectorAll('.mf-nav__links a')].find(a=>(a.textContent||'').trim().toUpperCase().startsWith('SOBRE')&&a.offsetHeight>0);const r=e.getBoundingClientRect();return {x:Math.round(r.x+r.width/2-70),y:Math.round(r.y+r.height/2)}});
await d.mouse.move(lk.x,lk.y); await d.waitForTimeout(800);
const near=await d.evaluate(()=>{const e=[...document.querySelectorAll('.mf-nav__links a')].find(a=>(a.textContent||'').trim().toUpperCase().startsWith('SOBRE'));return e.style.translate||'(vazio)'});
await d.mouse.move(700,450); await d.waitForTimeout(800);
const far=await d.evaluate(()=>{const e=[...document.querySelectorAll('.mf-nav__links a')].find(a=>(a.textContent||'').trim().toUpperCase().startsWith('SOBRE'));return e.style.translate||'(vazio)'});
console.log('MAGNETISMO perto:',near,'| longe:',far);
console.log('erros JS desktop:',errs.length?errs:'0');
await d.close();
// MOBILE 390
const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
const merrs=[]; m.on('pageerror',e=>merrs.push(String(e).slice(0,60)));
const mc=await m.newCDPSession(m); await mc.send('Network.enable');
await mc.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:204800,uploadThroughput:96000});
await m.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await m.waitForTimeout(9000);
const mob=await m.evaluate(()=>{const rs=performance.getEntriesByType('resource');let t=0;rs.forEach(x=>t+=x.transferSize);return {kb:Math.round(t/1024),pin:!!document.querySelector('.mf-srows--pin'),rows:document.querySelectorAll('.mf-srow').length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}});
console.log('MOBILE:',JSON.stringify(mob),'| erros:',merrs.length?merrs:'0');
// REDUCED MOTION
const rctx=await (await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'})).newPage();
await rctx.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await rctx.waitForTimeout(4000);
console.log('REDUCED-MOTION pin?',await rctx.evaluate(()=>!!document.querySelector('.mf-srows--pin')),'(false esperado)');
await b.close();
