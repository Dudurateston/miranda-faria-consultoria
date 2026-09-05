import { chromium } from 'playwright';
const base = 'http://localhost:4173';
const routes = ['/pt', '/pt/servicos', '/pt/insights', '/pt/how-i-work', '/pt/about', '/pt/work', '/pt/contact'];
const browser = await chromium.launch();
const out = [];
for (const vp of [{ name: 'desk', width: 1440 }, { name: 'mob', width: 390 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: 900 } });
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const data = await page.evaluate(() => {
      const secs = [...document.querySelectorAll('section, footer')].filter(s => s.offsetHeight > 30);
      return secs.map(s => {
        const cs = getComputedStyle(s);
        const label = s.querySelector('.mf-label');
        let labelInfo = '';
        if (label) {
          const lcs = getComputedStyle(label);
          const next = label.nextElementSibling;
          let gap = null;
          if (next) gap = Math.round(next.getBoundingClientRect().top - label.getBoundingClientRect().bottom);
          labelInfo = ` label_fs=${lcs.fontSize} label_mb=${lcs.marginBottom} gap_label_next=${gap}`;
        }
        const lead = s.querySelector('h1, h2');
        let leadInfo = '';
        if (lead) {
          const body = lead.nextElementSibling;
          let gap = null;
          if (body && body.tagName === 'P') gap = Math.round(body.getBoundingClientRect().top - lead.getBoundingClientRect().bottom);
          leadInfo = ` lead_fs=${getComputedStyle(lead).fontSize} lead_mt=${getComputedStyle(lead).marginTop} gap_lead_body=${gap}`;
        }
        return `${s.className.split(' ')[0] || s.tagName} h=${Math.round(s.getBoundingClientRect().height)} pt=${cs.paddingTop} pb=${cs.paddingBottom}${labelInfo}${leadInfo}`;
      }).join('\n');
    });
    out.push(`===== [${vp.name}] ${r} =====\n${data}`);
  }
  await ctx.close();
}
console.log(out.join('\n'));
await browser.close();
