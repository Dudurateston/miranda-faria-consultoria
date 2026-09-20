import { chromium } from 'playwright';
const b=await chromium.launch();
const errs=[];
const d=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
d.on('pageerror',e=>errs.push(String(e).slice(0,70)));
// HOW-I-WORK PINADO
await d.goto('http://localhost:4173/pt/how-i-work',{waitUntil:'domcontentloaded'});
await d.waitForTimeout(5000);
const secY=await d.evaluate(()=>document.querySelector('.mf-hiw__stack')?.getBoundingClientRect().top+window.scrollY);
await d.mouse.wheel(0,Math.round(secY-30)); await d.waitForTimeout(2000);
let st=await d.evaluate(()=>({top:Math.round(document.querySelector('.mf-hiw__stack').getBoundingClientRect().top),ch:[...document.querySelectorAll('.mf-hiw__rail span')].findIndex(s=>s.classList.contains('is-on')),pin:!!document.querySelector('.mf-hiw__stack--pin')}));
console.log('HIW PIN INICIO:',JSON.stringify(st));
for (let k=0;k<3;k++){ await d.mouse.wheel(0,1000); await d.waitForTimeout(800); }
st=await d.evaluate(()=>({top:Math.round(document.querySelector('.mf-hiw__stack').getBoundingClientRect().top),ch:[...document.querySelectorAll('.mf-hiw__rail span')].findIndex(s=>s.classList.contains('is-on'))}));
console.log('HIW MEIO:',JSON.stringify(st));
await d.screenshot({path:'/tmp/hiw_pin.png'});
for (let k=0;k<4;k++){ await d.mouse.wheel(0,1000); await d.waitForTimeout(600); }
st=await d.evaluate(()=>({top:Math.round(document.querySelector('.mf-hiw__stack').getBoundingClientRect().top),resto:!!document.querySelector('.mf-hiw__stackwrap')}));
console.log('HIW FIM (soltou?):',JSON.stringify(st));
// WORK: reveals nos cards + magnetismo UNIVERSAL (chip sem data-cursor)
await d.goto('http://localhost:4173/pt/work',{waitUntil:'domcontentloaded'});
await d.waitForTimeout(4500);
const work=await d.evaluate(()=>({cards:document.querySelectorAll('.mf-work__item').length,reveals:document.querySelectorAll('.mf-work__list [class*="reveal"], .mf-work__list > div[style]').length}));
console.log('WORK cards:',work.cards,'| wrapped em reveal:',work.reveals);
const chip=await d.evaluate(()=>{const e=document.querySelector('.mf-work__chip');if(!e)return null;const r=e.getBoundingClientRect();return {x:Math.round(r.x-40),y:Math.round(r.y+r.height/2)}});
await d.mouse.move(chip.x,chip.y); await d.waitForTimeout(800);
const mag=await d.evaluate(()=>document.querySelector('.mf-work__chip')?.style.translate||'(vazio)');
await d.mouse.move(700,450); await d.waitForTimeout(800);
console.log('MAGNET chip SEM data-cursor:',mag,'(tem que ter valor != vazio perto)');
console.log('erros JS:',errs.length?errs:'0');
await d.close();
// MOBILE + REDUCED: sem pin no HIW
const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
await m.goto('http://localhost:4173/pt/how-i-work',{waitUntil:'domcontentloaded'});
await m.waitForTimeout(4000);
console.log('MOBILE HIW pin?',await m.evaluate(()=>!!document.querySelector('.mf-hiw__stack--pin')),'(false esperado) | overflow:',await m.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth));
const r=await (await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'})).newPage();
await r.goto('http://localhost:4173/pt/how-i-work',{waitUntil:'domcontentloaded'});
await r.waitForTimeout(3500);
console.log('REDUCED HIW pin?',await r.evaluate(()=>!!document.querySelector('.mf-hiw__stack--pin')),'(false esperado)');
await b.close();
