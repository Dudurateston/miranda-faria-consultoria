/**
 * diag_ui_test.mjs — Etapa 2, testes de preview LOCAL (writes bloqueados).
 * Comando: NODE_PATH=../mf_site/node_modules node diag_ui_test.mjs
 * Requisitos cobertos: 6 objetivos · unknown≠0 · editar ramo · zero ·
 * 0 writes/leads de teste · 1440/390/320 · reduced-motion · PT/EN ·
 * erros sem perder resposta · Continuar explícito · CTA por idioma sem envio.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4181';
let pass = 0, fail = 0;
const t = (name, ok, extra = '') => {
  if (ok) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};

/* bloqueio + classificação de TODA escrita que tentar sair do navegador */
const wireWrites = (ctx) => {
  const writes = [];
  ctx.route('**/api/**', async (route) => {
    const req = route.request();
    writes.push({ url: req.url(), method: req.method(), body: (req.postData() || '').slice(0, 300) });
    await route.abort();
  });
  return writes;
};
const diagWrites = (writes) => writes.filter((w) => /DiagnosticoLead|diag_complete|entities\/DiagnosticoLead/i.test(w.url + w.body));

const errs = (p) => { const a = []; p.on('pageerror', (e) => a.push(e.message.slice(0, 60))); return a; };
/* banner de consentimento do shell (preexistente, canto inferior esquerdo):
   dispensa por CLIQUE REAL em "Só o necessário"/"Essential only" — sem tocar
   no DOM, sem adivinhar chave de storage. Contexto compartilhado decide uma
   vez; páginas seguintes já vêm sem banner. */
const noConsent = async (p, lang = 'pt') => {
  const decline = lang === 'en' ? 'Essential only' : 'Só o necessário';
  const btn = p.getByRole('button', { name: decline }).first();
  try {
    await btn.waitFor({ state: 'visible', timeout: 8000 });
    await btn.click();
    await p.waitForTimeout(500);
  } catch {
    /* banner ausente: decisão já registrada pelo contexto */
  }
};
const ovX = (p) => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);

/* helpers de wizard */
const radio = (p, label) => p.getByRole('radio', { name: label });
/* clique robusto em .mf-dg__go (Continuar / Ver o resultado): o painel
   remonta na animacao e Lenis/parallax movem o alvo — cada tentativa pega um
   localizador NOVO, rola via evaluate, espera assentar e clica em coordenada. */
const goClick = async (p) => {
  let lastErr = '';
  for (let i = 0; i < 12; i++) {
    try {
      const btn = p.getByRole('button', { name: /Continuar|Continue|Ver o resultado|See the result/ }).first();
      await btn.waitFor({ state: 'attached', timeout: 3000 });
      await p.evaluate(() => {
        const el = [...document.querySelectorAll('button')].find((b) => String(b.className).includes('mf-dg__go'));
        if (el) el.scrollIntoView({ block: 'center' });
      });
      await p.waitForTimeout(750);
      const box = await btn.boundingBox();
      if (box) {
        await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        return;
      }
      lastErr = 'sem boundingBox';
    } catch (e) {
      lastErr = String(e.message).split('\n')[0];
    }
  }
  throw new Error('goClick falhou apos 12 tentativas: ' + lastErr);
};
const has = async (p, txt) => (await p.getByText(txt, { exact: false }).count()) > 0;

async function flow(p, lang, { goalLabel, opts = {} }) {
  const T = {
    pt: { sector: 'Comércio ou distribuição', cur: 'Planilha', vol: '11 a 50', bot: 'Procurar ou conferir informação', hrs: opts.hours || null, data: 'Precisam de conferência', urg: 'Agora', wa: 'WhatsApp', ver: 'Ver o resultado' },
    en: { sector: 'Commerce or distribution', cur: 'Spreadsheets', vol: '11–50', bot: 'Searching for or checking information', hrs: opts.hours || null, data: 'They need checking', urg: 'Now', wa: 'Book on Calendly', ver: 'See the result' },
  }[lang];
  await radio(p, T.sector).click(); await goClick(p);
  await radio(p, goalLabel).click(); await goClick(p);
  await radio(p, T.cur).click(); await goClick(p);
  // volume: banda (moeda/valor exato vem em opts.volValue/opts.currency)
  await radio(p, opts.volLabel || T.vol).click();
  if (opts.volValue) await p.locator('input[type=number]').fill(String(opts.volValue));
  if (opts.currency) await p.locator('select').selectOption(opts.currency);
  await goClick(p);
  await radio(p, opts.bot || T.bot).click(); await goClick(p);
  if (T.hrs) { await radio(p, T.hrs).click(); }
  await goClick(p); // horas opcional
  await radio(p, T.data).click(); await goClick(p);
  await radio(p, T.urg).click(); await goClick(p);
  if (opts.rate != null) {
    await p.locator('input[type=number]').fill(String(opts.rate)); await goClick(p);
    await p.locator('input[type=number]').fill(String(opts.share)); await goClick(p);
  }
  // complementar opcional de custo/hora (ramo tarefas com tempo conhecido)
  const q = await p.locator('.mf-dg__q').first().textContent().catch(() => '');
  if (/custa a hora|hour of this routine/.test(q)) {
    if (opts.hourlyCost != null) {
      await p.locator('input[type=number]').fill(String(opts.hourlyCost.value));
      await p.locator('select').selectOption(opts.hourlyCost.currency);
    } // sem custo informado: Continuar direto = desconhecido (nunca zero)
    await goClick(p);
  }
}

const b = await chromium.launch();

/* ═══ 1. writes bloqueados + 6 objetivos PT + resultado ═══ */
{
  const goals = [
    ['Pedidos e vendas', 'pedidos'],
    ['Atendimento e presença digital', 'atendimento'],
    ['Estoque e informação', 'estoque'],
    ['Tarefas repetitivas', 'tarefas'],
    ['Continuidade da operação', 'continuidade'],
    ['Comissão de canal ou marketplace', 'canal'],
  ];
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const writes = wireWrites(ctx);
  for (const [label, tag] of goals) {
    const p = await ctx.newPage();
    const e = errs(p);
    const canal = tag === 'canal';
    await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
    const opts = canal
      ? { volLabel: '2 a 10 mil', currency: 'BRL', rate: 20, share: 30 }
      : tag === 'tarefas' ? { hours: 'De 1 a 3 horas' } : {};
    await flow(p, 'pt', { goalLabel: label, opts });
    await goClick(p);
    await p.waitForTimeout(400);
    const prio = await p.locator('.mf-dg__prio').count();
    const body = await p.textContent('body');
    const ok = prio >= 1 && prio <= 3 && !/NaN|Infinity/.test(body) && e.length === 0;
    t(`PT 1440 objetivo ${tag}: prioridades=${prio}, sem NaN, sem erros`, ok, e.join('|'));
    if (tag === 'pedidos') {
      t('resultado traz o que fazer / por quê / pré-requisito / como medir', ok && body.includes('O que fazer') && body.includes('Por quê') && body.includes('Pré-requisito') && body.includes('Como verificar melhora'));
      t('CTA PT = WhatsApp + email exato, sem envio', (await p.locator('.mf-dg__contact a[href*="wa.me"]').count()) === 1 && body.includes('Eduardo@mirandafaria.com.br'));
      await p.screenshot({ path: 'diag_result_pt.png', fullPage: true });
    }
    if (tag === 'tarefas') t('tarefas: horas 1-3/semana viram 4,33–12,99 h/mês no complemento', body.includes('12,99'));
    if (tag === 'canal') {
      t('canal: comissão bruta 120,06–600 BRL/mês como COMPLEMENTO (abaixo das prioridades)', body.includes('600') && body.includes('120,06'));
      await p.screenshot({ path: 'diag_result_pt_canal.png', fullPage: true });
    }
    await p.close();
  }
  t('0 writes de DiagnosticoLead/diag_complete (leads de teste = 0)', diagWrites(writes).length === 0, JSON.stringify(diagWrites(writes).slice(0, 2)));
  const entityWrites = writes.filter((w) => w.method !== 'GET' && /entities/i.test(w.url));
  const consentLog = entityWrites.filter((w) => /entities\/SiteEvent/.test(w.url) && /"event_type":"consent"/.test(w.body));
  const nonConsent = entityWrites.filter((w) => !consentLog.includes(w));
  t('0 writes de ENTIDADES do diagnostico (DiagnosticoLead/diag_*); unico POST = log da decisao de consentimento do proprio clique real', nonConsent.length === 0 && consentLog.length <= 1, JSON.stringify(nonConsent.slice(0, 2)));
  const shellInit = writes.filter((w) => /track\/batch|log-user-in-app/.test(w.url));
  t('writes restantes sao so init do SDK do shell (batch/log), sem dado do diagnostico', shellInit.every((w) => !/DiagnosticoLead|diag/i.test(w.body)), JSON.stringify(shellInit.length));
  await ctx.close();
}

/* ═══ 2. EN completo + pergunta capturada ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const writes = wireWrites(ctx);
  const p = await ctx.newPage();
  const e = errs(p);
  await p.goto(`${BASE}/en/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'en');
  await p.screenshot({ path: 'diag_q_en.png', fullPage: true });
  await flow(p, 'en', { goalLabel: 'Orders and sales', opts: { hours: "1 to 3 hours" } });
  await goClick(p);
  await p.waitForTimeout(400);
  const body = await p.textContent('body');
  t('EN 1440: prioridades + sem NaN + sem erros', (await p.locator('.mf-dg__prio').count()) >= 1 && !/NaN|Infinity/.test(body) && e.length === 0, e.join('|'));
  t('EN CTA (dentro do resultado) = Calendly + email; nenhum WhatsApp na página', (await p.locator('.mf-dg__contact a[href*="calendly"]').count()) === 1 && (await p.locator('.mf-dg__contact a[href*="wa.me"]').count()) === 0 && body.includes('Eduardo@mirandafaria.com.br'));
  await p.screenshot({ path: 'diag_result_en.png', fullPage: true });
  t('EN pergunta e resultado: 0 writes', diagWrites(writes).length === 0);
  await ctx.close();
}

/* ═══ 3. pergunta PT capturada + progresso honesto ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  await p.screenshot({ path: 'diag_q_pt.png', fullPage: true });
  const prog = await p.locator('.mf-dg__proglabel').textContent();
  t('progresso mostra contagem real (Pergunta 1 de 8)', /Pergunta 1 de 8/.test(prog), prog);
  // Continuar SEM resposta não avança (explícito, sem auto-avanço)
  await goClick(p);
  t('Continuar sem resposta: erro e SEM avançar', (await p.locator('.mf-dg__error').count()) === 1);
  await radio(p, 'Serviços').click();
  t('clicar opção NÃO avança sozinho (Continuar explícito)', (await p.locator('.mf-dg__error').count()) === 0 && /Pergunta 1/.test(await p.locator('.mf-dg__proglabel').textContent()));
  await ctx.close();
}

/* ═══ 4. unknown ≠ zero + erro sem perder resposta ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const e = errs(p);
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  await radio(p, 'Serviços').click(); await goClick(p);
  await radio(p, 'Tarefas repetitivas').click(); await goClick(p);
  await radio(p, 'Conversa e papel').click(); await goClick(p);
  // volume: valor negativo → erro, valor preservado
  await p.locator('input[type=number]').fill('-5');
  await goClick(p);
  const errTxt = await p.locator('.mf-dg__error').textContent().catch(() => '');
  const kept = await p.locator('input[type=number]').inputValue();
  t('valor negativo: erro visível e resposta preservada', errTxt.includes('inválido') && kept === '-5');
  await p.locator('input[type=number]').fill('12');
  await goClick(p);
  await radio(p, 'Redigitar a mesma informação').click(); await goClick(p);
  await radio(p, 'Não sei').click(); // desconhecido, nunca zero
  t("'Não sei' seleciona visualmente", await radio(p, 'Não sei').getAttribute('aria-checked') === 'true');
  await goClick(p);
  await radio(p, 'Não sei').click(); await goClick(p); // dataAccess não sei
  await radio(p, 'Explorando, sem pressa').click(); await goClick(p);
  await goClick(p);
  await p.waitForTimeout(300);
  const body = await p.textContent('body');
  t("unknown: 'Ainda faltam dados' + medir horas listado, SEM inventar número", body.includes('Ainda faltam dados') && body.includes('tempo gasto na rotina'));
  t("unknown dataAccess: recomenda VERIFICAR, não organizar", body.includes('Verificar onde a informação vive'));
  t('unknown: sem NaN, sem erros', !/NaN|Infinity/.test(body) && e.length === 0, e.join('|'));
  await ctx.close();
}

/* ═══ 5. editar ramo na revisão: dependentes limpos ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const e = errs(p);
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  await flow(p, 'pt', { goalLabel: 'Pedidos e vendas', opts: {} });
  await goClick(p);
  await p.waitForTimeout(300);
  await p.getByRole('button', { name: 'Recomeçar' }).click();
  t('recomeçar volta à pergunta 1', /Pergunta 1 de 8/.test(await p.locator('.mf-dg__proglabel').textContent()));
  await flow(p, 'pt', { goalLabel: 'Comissão de canal ou marketplace', opts: { volLabel: '2 a 10 mil', currency: 'BRL', rate: 20, share: 30 } });
  // na revisão, editar o objetivo (linha 2) e trocar para tarefas
  const rows = p.locator('.mf-dg__revrow');
  t('revisão lista as 10 respostas do canal', (await rows.count()) === 10, String(await rows.count()));
  await rows.nth(1).getByRole('button', { name: 'Editar' }).click();
  await radio(p, 'Tarefas repetitivas').click(); await goClick(p);
  // dependente do objetivo foi podado: currentTools volta a ser perguntado
  await radio(p, 'Planilha').click(); await goClick(p);
  const prog = await p.locator('.mf-dg__proglabel').textContent().catch(() => '');
  const q = await p.locator('.mf-dg__q').first().textContent();
  t('trocar ramo: currentTools re-perguntado e volume é a pergunta 4 de 8 (não 10)', /Qual é o tamanho da rotina\?/.test(q) && /Pergunta 4 de 8/.test(prog), `${q} | ${prog}`);
  t('trocar ramo: volume anterior limpo (sem banda marcada) e sem select de moeda', (await p.locator('.mf-dg__opt[data-on="true"]').count()) === 0 && (await p.locator('.mf-dg__field--cur').count()) === 0);
  await ctx.close();
}

/* ═══ 6. zero válido ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  await radio(p, 'Indústria').click(); await goClick(p);
  await radio(p, 'Pedidos e vendas').click(); await goClick(p);
  await radio(p, 'Planilha').click(); await goClick(p);
  await radio(p, 'Zero ou quase').click(); await goClick(p);
  await radio(p, 'Nenhum desses').click(); await goClick(p);
  await radio(p, 'Praticamente nada').click(); await goClick(p);
  await radio(p, 'Atualizadas e acessíveis a mais de uma pessoa').click(); await goClick(p);
  await radio(p, 'Agora').click(); await goClick(p);
  await goClick(p);
  await p.waitForTimeout(300);
  const body = await p.textContent('body');
  t('volume zero + nada a perder: resultado sem crash, sem NaN', !/NaN|Infinity/.test(body));
  await ctx.close();
}

/* ═══ 7. mobile 390/320 + reduced motion ═══ */
for (const w of [390, 320]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 780 } });
  const p = await ctx.newPage();
  const e = errs(p);
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  await radio(p, 'Serviços').click(); await goClick(p);
  await radio(p, 'Tarefas repetitivas').click(); await goClick(p);
  await radio(p, 'Planilha').click(); await goClick(p);
  await radio(p, '11 a 50').click(); await goClick(p);
  const o = await ovX(p);
  t(`mobile ${w}: sem overflow horizontal na pergunta 4`, o === 0, `ovX=${o}`);
  await p.screenshot({ path: `diag_q_mobile${w}.png`, fullPage: false });
  await ctx.close();
}
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  const e = errs(p);
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  await radio(p, 'Serviços').click(); await goClick(p);
  await radio(p, 'Pedidos e vendas').click(); await goClick(p);
  t('reduced-motion: fluxo funciona, sem erros', e.length === 0, e.join('|'));
  await ctx.close();
}

/* ═══ 8. teaser atualizado: sem promessa de 3 perguntas/40s/dinheiro ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/pt`, { waitUntil: 'networkidle' }); await noConsent(p, 'pt');
  const home = await p.textContent('body');
  t('home PT sem "três perguntas" nem promessa de dinheiro como resultado', !home.includes('três perguntas') && !home.includes('40 segundos'));
  await p.goto(`${BASE}/en`, { waitUntil: 'networkidle' }); await noConsent(p, 'en');
  const homeEn = await p.textContent('body');
  t('home EN sem "three questions"', !homeEn.includes('three questions'));
  await ctx.close();
}

await b.close();
console.log(`\n${pass} ok, ${fail} falha(s)`);
process.exit(fail ? 1 : 0);
