import { chromium } from 'playwright';
// VARREDURA PERCEPTUAL — desktop + mobile — o que o CLIENTE vê
const BASE='http://localhost:4173';
const ROUTES=['/pt','/pt/servicos','/pt/about','/pt/how-i-work','/pt/work','/pt/insights','/pt/design','/pt/gestao','/pt/desenvolvimento','/pt/automacao'];
const VPS=[{name:'mobile360',w:360,h:740},{name:'desktop1440',w:1440,h:900}];
const b=await chromium.launch();
const achados=[];
for (const vp of VPS) {
  const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h}});
  for (const r of ROUTES) {
    const pg=await ctx.newPage();
    const errs=[];
    pg.on('pageerror',e=>errs.push(String(e).slice(0,120)));
    try {
      await pg.goto(BASE+r,{waitUntil:'domcontentloaded',timeout:15000});
      await pg.waitForTimeout(2200);
      const issues=await pg.evaluate(()=>{
        const out=[];
        const doc=document.documentElement;
        if (doc.scrollWidth-doc.clientWidth>1) out.push({t:'overflow-x',v:doc.scrollWidth-doc.clientWidth+'px'});
        // texto cortado/clipped
        document.querySelectorAll('h1,h2,h3,p,span,a,button,figcaption').forEach(el=>{
          if (el.scrollWidth-el.clientWidth>3 && el.clientWidth>0) {
            const st=getComputedStyle(el);
            if (st.overflow!=='visible' && el.textContent.trim()) out.push({t:'texto-cortado',v:el.className||el.tagName,txt:el.textContent.trim().slice(0,40)});
          }
        });
        // elementos fora da viewport horizontal
        document.querySelectorAll('section,header,footer,figure').forEach(el=>{
          const r=el.getBoundingClientRect();
          if (r.width>0 && (r.left<-2 || r.right>doc.clientWidth+2)) out.push({t:'fora-da-tela',v:(el.className||el.tagName).toString().slice(0,40)});
        });
        // midia quebrada
        document.querySelectorAll('img,video').forEach(el=>{
          if (el.tagName==='IMG' && el.complete && el.naturalWidth===0) out.push({t:'img-quebrada',v:el.getAttribute('src')});
        });
        return out;
      });
      (errs.length?[{t:'js-erro',v:errs[0]}]:[]).concat(issues).forEach(i=>achados.push({vp:vp.name,rota:r,...i}));
    } catch(e){ achados.push({vp:vp.name,rota:r,t:'nav-falhou',v:String(e).slice(0,80)}); }
    await pg.close();
  }
  await ctx.close();
}
await b.close();
// agrupa e resume
const by={};
achados.forEach(a=>{const k=a.t; (by[k]=by[k]||[]).push(a)});
console.log('TOTAL ACHADOS:', achados.length);
for (const [t,list] of Object.entries(by)) {
  console.log(`\n== ${t} (${list.length})`);
  const seen=new Set();
  list.forEach(a=>{const k=a.v+'|'+(a.txt||''); if(!seen.has(k)){seen.add(k);console.log(`  [${a.vp}] ${a.rota}: ${a.v}${a.txt?' "'+a.txt+'"':''}`)}});
}
