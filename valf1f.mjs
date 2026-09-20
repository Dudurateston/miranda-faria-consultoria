import { chromium } from 'playwright';
const b=await chromium.launch();
const errs=[];
const d=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
d.on('pageerror',e=>errs.push(String(e).slice(0,70)));
await d.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
await d.waitForTimeout(5000);
// TRANSICAO: M maior + wordmark visiveis no pico
await d.evaluate(()=>{const a=document.querySelector('.mf-nav__links a[href*="insights"]')||document.querySelectorAll('.mf-nav__links a')[1];a?.click()});
await d.waitForTimeout(580);
await d.screenshot({path:'/tmp/curtain_v2.png'});
const st=await d.evaluate(()=>{const m=document.querySelector('.mf-curtain__m');const w=document.querySelector('.mf-curtain__word');return {mOpacity:m?getComputedStyle(m).opacity:'x',word:w?getComputedStyle(w).opacity:'x',wordTxt:w?.textContent,rota:d.location.pathname}});
console.log('PICO DA TRANSICAO:',JSON.stringify(st));
await d.waitForTimeout(1800);
console.log('rota final:',d.url().split('/').slice(-1)[0],'| curtain sumiu:',await d.evaluate(()=>getComputedStyle(document.querySelector('.mf-curtain')).display==='none'));
// BURGER: claro ink vs escuro osso-dim (mobile 390)
for (const theme of ['on-bone','dark']){
  const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
  await m.goto('http://localhost:4173/pt',{waitUntil:'domcontentloaded'});
  await m.waitForTimeout(4500);
  await m.evaluate((th)=>document.documentElement.setAttribute('data-theme',th==='on-bone'?'on-bone':th),theme);
  await m.waitForTimeout(600);
  const c=await m.evaluate(()=>{const s=document.querySelector('.mf-nav__burger span');return s?getComputedStyle(s).backgroundColor:'burger hidden'});
  console.log('burger',theme,':',c);
  await m.close();
}
console.log('erros JS:',errs.length?errs:'0');
await b.close();
