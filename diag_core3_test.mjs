/**
 * diag_core3_test.mjs — Testes DIRIGIDOS da etapa 4 (revisão Codex do a920113):
 * (1) mobile 390/320 PT/EN resultado completo + reduced-motion; barra global
 *     de CTA OCULTA nas rotas insights (presente no resto do site); botões
 *     tocáveis ≥44px; foco visível nos temas claro/escuro.
 * (2) fórmula e entradas da estimativa: horas/semana ×4,33; custo/hora;
 *     comissão = faturamento × taxa × parcela (bruta, sem soma).
 * (3) link de serviço relacionado SÓ com gargalo; mapeamento para rotas
 *     reais; cenário saudável sem link.
 * (4) ZERO travessões (– —) em qualquer texto visível, inclusive resumo.
 * CTA do resultado: PT wa.me/5531997731250, EN calendly.com/edumirandamf,
 * email Eduardo@mirandafaria.com.br. 0 writes (DiagnosticoLead/diag_complete).
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4181';
let pass = 0, fail = 0;
const t = (name, ok, extra = '') => {
  if (ok) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${extra ? ' — ' + String(extra).slice(0, 300) : ''}`); }
};

/* clique robusto (scroll instantâneo + box no viewport — parallax do site
   nunca estabiliza para locator.click) */
const goClick = async (p) => {
  let lastErr = '';
  for (let i = 0; i < 14; i++) {
    try {
      const btn = p.getByRole('button', { name: /Continuar|Continue|Ver o resultado|See the result/ }).first();
      await btn.waitFor({ state: 'attached', timeout: 2500 });
      await p.evaluate(() => {
        const el = [...document.querySelectorAll('button')].find((b) => String(b.className).includes('mf-dg__go'));
        if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
      });
      await p.waitForTimeout(350);
      const box = await btn.boundingBox();
      if (box) {
        const vp = p.viewportSize();
        if (box.y >= 0 && box.y + box.height <= vp.height && box.x >= 0) {
          await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
          return;
        }
        lastErr = 'box fora do viewport';
      } else lastErr = 'sem boundingBox';
      await p.waitForTimeout(250);
    } catch (e) {
      lastErr = String(e.message).split('\n')[0];
      await p.waitForTimeout(300);
    }
  }
  throw new Error('goClick falhou: ' + lastErr);
};
const radio = (p, l) => p.getByRole('radio', { name: l });
const radioClick = async (p, l) => {
  let lastErr = '';
  for (let i = 0; i < 10; i++) {
    try {
      const r = p.getByRole('radio', { name: l });
      await r.waitFor({ state: 'visible', timeout: 2500 });
      const lab = r.locator('xpath=ancestor::label[1]');
      await lab.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await p.waitForTimeout(250);
      const box = await lab.boundingBox();
      const vp = p.viewportSize();
      if (box && box.y >= 0 && box.y + box.height <= vp.height) {
        await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        return;
      }
      lastErr = 'box fora do viewport';
    } catch (e) { lastErr = String(e.message).split('\n')[0]; await p.waitForTimeout(250); }
  }
  throw new Error('radioClick falhou: ' + l + ' — ' + lastErr);
};
const noConsent = async (p, lang) => {
  try {
    const b = p.getByRole('button', { name: lang === 'pt' ? 'Só o necessário' : 'Essential only' }).first();
    await b.waitFor({ state: 'visible', timeout: 8000 });
    await b.click();
    await p.waitForTimeout(400);
  } catch { /* já decidido */ }
};
const settle = async (p) => {
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);
};

/* fluxos completos por mouse, guardando URLs requisitadas (0 writes) */
async function runFlow(p, steps, writes) {
  for (const st of steps) {
    if (st.radio) { await radioClick(p, st.radio); }
    if (st.fill) { await p.locator('input[type=number]').first().fill(String(st.fill)); }
    if (st.select) { await p.locator('.mf-dg__field--cur select, select').first().selectOption(st.select); }
    await goClick(p);
    await p.waitForTimeout(250);
  }
}

const b = await chromium.launch();
const jsErrs = [];

/* ═══ A) PT desktop: fórmula tempo+custo, serviço automacao, sem traços, CTA, 0 writes ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const writes = [];
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  p.on('request', (r) => { const u = r.url(); if (/DiagnosticoLead|diag_complete|answers/i.test(u)) writes.push(u); });
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');

  await runFlow(p, [
    { radio: 'Serviços' },
    { radio: 'Tarefas repetitivas' },
    { radio: 'Planilha' },
    { fill: 12 },
    { radio: 'Redigitar a mesma informação' },
    { radio: 'De 1 a 3 horas' },
    { radio: 'Precisam de conferência' }, // dataAccess
    { radio: 'Agora' },                  // urgency
    { fill: 30, select: 'BRL' },         // hourlyCost = 9ª pergunta
  ]);
  // revisão -> resultado
  await goClick(p); await settle(p);

  const formulas = await p.locator('.mf-dg__formula').allTextContents();
  const fAll = formulas.join(' | ');
  t('A: fórmula horas (1 a 3 h/sem × 4,33 = 4,33 a 12,99 h/mês)', /1 a 3 horas por semana × 4,33 semanas por mês = 4,33 a 12,99 horas por mês/.test(fAll), fAll);
  t('A: fórmula custo (× 30 BRL custo por hora = 129,9 a 389,7 BRL/mês)', /4,33 a 12,99 horas por mês × 30 BRL custo por hora = 129,9 a 389,7 BRL\/mês/.test(fAll), fAll);
  const svc = p.locator('.mf-dg__svc');
  t('A: serviço relacionado automacao (gargalo redigitar)', (await svc.count()) === 1 && (await svc.getAttribute('href')) === '/pt/automacao' && /Automação/.test(await svc.textContent()), await svc.textContent());
  t('A: link da solução abre em NOVA ABA (target/rel seguros) e indica isso', (await svc.getAttribute('target')) === '_blank' && (await svc.getAttribute('rel')) === 'noopener noreferrer' && /abre em nova aba/.test(await svc.textContent()), await svc.textContent());

  const ta = await p.locator('textarea.mf-dg__ta').inputValue();
  t('A: resumo sem travessões (– —) e com intervalo "a"', !/[–—]/.test(ta) && /4,33 a 12,99/.test(ta), ta.slice(0, 120));
  t('A: CTA PT = wa.me/5531997731250', (await p.locator('.mf-dg__wa').getAttribute('href')).startsWith('https://wa.me/5531997731250'));
  t('A: email exato Eduardo@mirandafaria.com.br', (await p.locator('.mf-dg__mailto').getAttribute('href')) === 'mailto:Eduardo@mirandafaria.com.br');
  t('A: 0 writes (DiagnosticoLead/diag_complete/answers)', writes.length === 0, writes.join(','));

  /* popup: solução em aba nova; plano/respostas intactos na original */
  const [pop] = await Promise.all([p.waitForEvent('popup'), svc.click()]);
  await pop.waitForLoadState('domcontentloaded');
  t('A: popup abre a solução /pt/automacao', new URL(pop.url()).pathname === '/pt/automacao', pop.url());
  await p.waitForTimeout(500);
  t('A: plano PRESERVADO na aba original (prioridades + resumo + fórmula)', (await p.locator('.mf-dg__prio').count()) >= 1 && (await p.locator('textarea.mf-dg__ta').count()) === 1 && (await p.locator('.mf-dg__formula').count()) >= 1, new URL(p.url()).pathname);
  await pop.close(); await ctx.close();
}

/* ═══ B) PT: cenário saudável (nenhum gargalo) NÃO empurra serviço ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  await runFlow(p, [
    { radio: 'Comércio ou distribuição' },
    { radio: 'Pedidos e vendas' },
    { radio: 'Planilha' },
    { fill: 12 },
    { radio: 'Nenhum desses' },
    { radio: 'De 1 a 3 horas' },
    { radio: 'Precisam de conferência' },
    { radio: 'Agora' },
  ]);
  await goClick(p); await settle(p);
  t('B: sem gargalo => SEM link de serviço relacionado', (await p.locator('.mf-dg__svc').count()) === 0);
  t('B: resultado saudável renderiza prioridades sem NaN', (await p.locator('.mf-dg__prio').count()) >= 1 && !/NaN|Infinity/.test(await p.textContent('body')));
  await ctx.close();
}

/* ═══ C) PT: fórmula comissão + serviço gestao ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  await runFlow(p, [
    { radio: 'Comércio ou distribuição' },
    { radio: 'Comissão de canal ou marketplace' },
    { radio: 'Planilha' },
    { radio: '2 a 10 mil', select: 'BRL' },
    { radio: 'Procurar ou conferir informação' },
    { radio: 'Não sei' },
    { radio: 'Precisam de conferência' },
    { radio: 'Agora' },
    { fill: 20 },
    { fill: 30 },
  ]);
  await goClick(p); await settle(p);
  const f = (await p.locator('.mf-dg__formula').allTextContents()).join(' | ');
  t('C: fórmula comissão (faturamento × taxa 20% × parcela viável 30%)', /faturamento mensal .+ BRL × taxa 20% × parcela viável 30%/.test(f), f);
  const est = await p.locator('.mf-dg__estnum').first().textContent();
  t('C: bruta exibida com intervalo "a" e /mês (sem travessão)', /a .+ BRL\/mês/.test(est) && !/–|—/.test(est), est);
  const svc = p.locator('.mf-dg__svc');
  t('C: serviço relacionado gestao (comissão)', (await svc.count()) === 1 && (await svc.getAttribute('href')) === '/pt/gestao');
  await ctx.close();
}

/* ═══ D) EN 390: barra global OCULTA no insights (e viva na home), CTA EN, toque ≥44 ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/en/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'en');
  t('D: barra global de CTA OCULTA no insights mobile', (await p.getByText('Book a call').count()) === 0);
  await runFlow(p, [
    { radio: 'Commerce or distribution' },
    { radio: 'Marketplace or channel commission' },
    { radio: 'Spreadsheet' },
    { radio: '2k to 10k', select: 'BRL' },
    { radio: 'Searching for or checking information' },
    { radio: "I don't know" },
    { radio: 'They need checking' },
    { radio: 'Just exploring' },
    { fill: 20 },
    { fill: 30 },
  ]);
  await goClick(p); await settle(p);
  t('D: CTA EN = calendly.com/edumirandamf', (await p.locator('.mf-dg__wa').getAttribute('href')) === 'https://calendly.com/edumirandamf');
  t('D: email exato no resultado EN', (await p.locator('.mf-dg__mailto').getAttribute('href')) === 'mailto:Eduardo@mirandafaria.com.br');
  const hts = [];
  for (const sel of ['.mf-dg__wa', '.mf-dg__mailto', '.mf-dg__again']) {
    const box = await p.locator(sel).first().boundingBox();
    hts.push([sel, box ? box.height : 0]);
  }
  t('D: botões do resultado tocáveis ≥44px (390)', hts.every(([, h]) => h >= 44), JSON.stringify(hts));
  const body = await p.textContent('.mf-dg').catch(() => '');
  t('D: EN sem travessões no diagnóstico (escopo .mf-dg)', !/[–—]/.test(body));
  const ta = await p.locator('textarea.mf-dg__ta').inputValue();
  t('D: resumo EN sem travessões e com intervalo "to"', !/[–—]/.test(ta) && /to /.test(ta), ta.slice(0, 120));
  await p.screenshot({ path: 'diag_core3_en_390_result.png', fullPage: true });

  // barra viva FORA do insights
  await p.goto(`${BASE}/en`, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  t('D: barra global de CTA continua na home (fora do insights)', (await p.getByText('Book a call').count()) >= 1);
  await ctx.close();
}

/* ═══ E) Mobile 320 PT + EN: resultado completo renderiza e captura ═══ */
{
  for (const lang of ['pt', 'en']) {
    const ctx = await b.newContext({ viewport: { width: 320, height: 568 } });
    ctx.route('**/api/**', (r) => r.abort());
    const p = await ctx.newPage();
    p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
    await p.goto(`${BASE}/${lang}/insights`, { waitUntil: 'networkidle' }); await noConsent(p, lang);
    const L = lang === 'pt'
      ? ['Comércio ou distribuição', 'Comissão de canal ou marketplace', 'Planilha', '2 a 10 mil', 'Procurar ou conferir informação', 'Não sei', 'Precisam de conferência', 'Agora']
      : ['Commerce or distribution', 'Marketplace or channel commission', 'Spreadsheet', '2k to 10k', 'Searching for or checking information', "I don't know", 'They need checking', 'Just exploring'];
    const steps = L.map((r, i) => (i === 3 ? { radio: r, select: 'BRL' } : { radio: r }));
    await runFlow(p, steps.concat([{ fill: 20 }, { fill: 30 }]));
    await goClick(p); await settle(p);
    const ovX = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    t(`E ${lang} 320: resultado completo, 0 overflow-x (${ovX}px)`, (await p.locator('.mf-dg__prio').count()) >= 1 && ovX <= 0 && (await p.locator('.mf-dg__svc').count()) === 1);
    await p.screenshot({ path: `diag_core3_${lang}_320_result.png`, fullPage: true });
    await ctx.close();
  }
}

/* ═══ F) reduced-motion EN 390: fluxo até o resultado sem erros ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/en/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'en');
  await runFlow(p, [
    { radio: 'Services' },
    { radio: 'Repetitive tasks' },
    { radio: 'Spreadsheets' },
    { fill: 12 },
    { radio: 'Retyping the same information' },
    { radio: '1 to 3 hours' },
    { radio: 'They need checking' },
    { radio: 'Just exploring' },
  ]);
  await goClick(p);            // commita/omnia a 9ª pergunta (custo por hora)
  await goClick(p);            // revisão -> Ver o resultado
  await settle(p);
  const fF = await p.locator('.mf-dg__formula').first().textContent().catch(() => '(sem fórmula)');
  t('F: reduced-motion: resultado ok, fórmula horas em inglês (× 4.33)', (await p.locator('.mf-dg__prio').count()) >= 1 && /× 4\.33 weeks per month/.test(fF), fF);
  await p.screenshot({ path: 'diag_core3_reduced_en_390.png', fullPage: true });
  await ctx.close();
}

/* ═══ G) foco visível nos temas claro e escuro (radios + botões) ═══ */
{
  for (const theme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript((th) => localStorage.setItem('mf-theme', th), theme);
    ctx.route('**/api/**', (r) => r.abort());
    const p = await ctx.newPage();
    p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
    await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
    await radio(p, 'Comércio ou distribuição').focus();
    await p.waitForTimeout(200);
    const out = await p.evaluate(() => {
      const inp = document.querySelector('.mf-dg__radio');
      const lab = inp.closest('label');
      const cs = getComputedStyle(lab);
      return { style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor };
    });
    t(`G ${theme}: foco do radio visível (outline ${out.style} ${out.width})`, out.style !== 'none' && parseFloat(out.width) > 0, JSON.stringify(out));
    await p.screenshot({ path: `diag_core3_focus_${theme}_390.png` });
    if (theme === 'dark') {
      // resultado no escuro para evidência
      await runFlow(p, [
        { radio: 'Comércio ou distribuição' },
        { radio: 'Comissão de canal ou marketplace' },
        { radio: 'Planilha' },
        { radio: '2 a 10 mil', select: 'BRL' },
        { radio: 'Procurar ou conferir informação' },
        { radio: 'Não sei' },
        { radio: 'Precisam de conferência' },
        { radio: 'Agora' },
        { fill: 20 },
        { fill: 30 },
      ]);
      await goClick(p); await settle(p);
      t('G dark: resultado no tema escuro sem NaN', (await p.locator('.mf-dg__prio').count()) >= 1 && !/NaN|Infinity/.test(await p.textContent('body')));
      await p.screenshot({ path: 'diag_core3_dark_390_result.png', fullPage: true });
    }
    await ctx.close();
  }
}

await b.close();
console.log(`\n${pass} ok, ${fail} falha(s)`);
process.exit(fail ? 1 : 0);
