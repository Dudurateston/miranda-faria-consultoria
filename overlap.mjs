import { chromium } from 'playwright';
const b=await chromium.launch();
for (const rota of ['/pt','/pt/servicos']) {
  const pg=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await pg.goto('https://mirandafaria.com.br'+rota,{waitUntil:'domcontentloaded'});
  await pg.waitForTimeout(4500);
  // percorre a pagina inteira devagar
  await pg.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<h;y+=600){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,350));}});
  await pg.waitForTimeout(1500);
  const vids=await pg.evaluate(()=>{
    return performance.getEntriesByType('resource').filter(r=>r.name.includes('.mp4')&&r.transferSize>10000)
      .map(r=>r.name.split('/').pop());
  });
  console.log(rota,'| MP4s baixados:',JSON.stringify(vids));
  await pg.close();
}
await b.close();
