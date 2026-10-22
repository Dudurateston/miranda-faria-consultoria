/**
 * diag_core_test.mjs — Testes DIRIGIDOS da revisão Codex do núcleo do wizard (pós-4f3f3ab).
 * Sem deploy; writes bloqueados; banner dispensado por CLIQUE REAL.
 * A) 10→9 (canal→tarefas): flow só da lista ativa, drafts limpos, sem pergunta inaplicável.
 * B) 8/9→10 (tarefas→canal): condicionais aparecem, hourlyCost some, sem duplicados.
 * C) volume: banda↔exato mutuamente exclusivos; moeda no resumo também para faixas; Não sei.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4181';
let pass = 0, fail = 0;
const t = (name, ok, extra = '') => {
  if (ok) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};

const noConsent = async (p) => {
  const btn = p.getByRole('button', { name: 'Só o necessário' }).first();
  try { await btn.waitFor({ state: 'visible', timeout: 8000 }); await btn.click(); await p.waitForTimeout(500); }
  catch { /* já decidido */ }
};

/* clique robusto em .mf-dg__go (Continuar / Ver o resultado): scroll INSTANTÂNEO
   (sem animação de Lenis/parallax — o elemento nunca fica "estável" para o
   locator.click), box recalculado após o salto e conferido dentro do viewport. */
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
        lastErr = 'box fora do viewport ' + JSON.stringify({ y: box.y, h: vp.height });
      } else lastErr = 'sem boundingBox';
      await p.waitForTimeout(250);
    } catch (e) {
      lastErr = String(e.message).split('\n')[0];
      await p.waitForTimeout(300);
    }
  }
  throw new Error('goClick falhou apos 14 tentativas: ' + lastErr);
};



const radio = (p, label) => p.getByRole('radio', { name: label });
const qTitle = (p) => p.locator('.mf-dg__q').first().textContent().catch(() => '');
const onCount = (p) => p.locator('.mf-dg__opt[data-on="true"]').count();
const jsErrs = [];

const b = await chromium.launch();

/* ═══ A) 10 → 9: canal completo → edita objetivo p/ tarefas → resultado ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p);

  await radio(p, 'Comércio ou distribuição').click(); await goClick(p);
  await radio(p, 'Comissão de canal ou marketplace').click(); await goClick(p);
  await radio(p, 'Planilha').click(); await goClick(p);
  await radio(p, '2 a 10 mil').click();
  await p.locator('select').selectOption('BRL'); await goClick(p);
  await radio(p, 'Procurar ou conferir informação').click(); await goClick(p);
  await goClick(p); // horas: sem resposta (desconhecido)
  await radio(p, 'Precisam de conferência').click(); await goClick(p);
  await radio(p, 'Agora').click(); await goClick(p);
  await p.locator('input[type=number]').first().fill('20'); await goClick(p);
  await p.locator('input[type=number]').first().fill('30'); await goClick(p);
  const rows = p.locator('.mf-dg__revrow');
  t('A: revisão do canal lista 10 respostas', (await rows.count()) === 10, String(await rows.count()));

  await rows.nth(1).getByRole('button', { name: 'Editar' }).click();
  await radio(p, 'Tarefas repetitivas').click(); await goClick(p);
  t('A: após trocar objetivo, currentTools re-perguntado', (await qTitle(p)) === 'Como essa rotina funciona hoje?', await qTitle(p));
  t('A: rascunhos limpos — nenhuma opção pré-marcada no currentTools', (await onCount(p)) === 0, String(await onCount(p)));

  const seen = [];
  const walk = ['Planilha', null, 'Redigitar a mesma informação', 'De 1 a 3 horas'];
  for (const pick of walk) {
    seen.push(await qTitle(p));
    if (pick) await radio(p, pick).click();
    if (seen.at(-1) === 'Qual é o tamanho da rotina?') {
      t('A: volume sem banda pré-marcada e SEM select de moeda (tarefas)', (await onCount(p)) === 0 && (await p.locator('.mf-dg__field--cur').count()) === 0);
      await p.locator('input[type=number]').first().fill('12');
      t('A: valor exato limpa banda (nenhuma marcada)', (await onCount(p)) === 0);
    }
    if (seen.at(-1) === 'Quanto tempo isso ocupa?') {
      const prog = await p.locator('.mf-dg__proglabel').textContent();
      t('A: progresso pela lista ativa no ramo tarefas ("6 de 8")', /Pergunta 6 de 8/.test(prog), prog);
    }
    await goClick(p);
  }
  seen.push(await qTitle(p)); // hourlyCost (dataAccess/urgency sobreviveram ao prune de goal)
  t('A: horas conhecidas trazem custo/hora (9ª pergunta), dataAccess/urgency NÃO re-perguntadas', seen.at(-1) === 'Quanto custa a hora dessa rotina?' && !seen.includes('Quão confiáveis e acessíveis são as informações?') && !seen.includes('Quando faz sentido começar?'), seen.join(' | '));
  const progHC = await p.locator('.mf-dg__proglabel').textContent();
  t('A: progresso na condicional ("9 de 9", nunca "9 de 8")', /Pergunta 9 de 9/.test(progHC), progHC);
  await p.locator('input[type=number]').first().fill('30');
  await p.locator('select').first().selectOption('BRL'); await goClick(p);
  t('A: perguntas de comissão NUNCA aparecem no ramo tarefas', !seen.includes('Qual taxa o canal cobra de fato?') && !seen.includes('Qual parcela seria viável migrar?'), seen.join(' | '));
  t('A: revisão final lista 9 respostas (sem taxa/parcela)', (await rows.count()) === 9, String(await rows.count()));
  await goClick(p); // Ver o resultado
  await p.waitForTimeout(400);
  const body = await p.textContent('body');
  t('A: resultado com prioridades, sem NaN, sem erros JS', (await p.locator('.mf-dg__prio').count()) >= 1 && !/NaN|Infinity/.test(body) && jsErrs.length === 0, jsErrs.join('|'));
  await p.screenshot({ path: 'diag_core_a_10to9.png', fullPage: true });
  await ctx.close();
}

/* ═══ B) 8/9 → 10: tarefas completo → edita objetivo p/ canal → resultado ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p);

  await radio(p, 'Serviços').click(); await goClick(p);
  await radio(p, 'Tarefas repetitivas').click(); await goClick(p);
  await radio(p, 'Planilha').click(); await goClick(p);
  await p.locator('input[type=number]').first().fill('12'); await goClick(p);
  await radio(p, 'Redigitar a mesma informação').click(); await goClick(p);
  await radio(p, 'De 1 a 3 horas').click(); await goClick(p);
  await radio(p, 'Precisam de conferência').click(); await goClick(p);
  await radio(p, 'Agora').click(); await goClick(p);
  await p.locator('input[type=number]').first().fill('30');
  await p.locator('select').first().selectOption('BRL'); await goClick(p);
  const rows = p.locator('.mf-dg__revrow');
  t('B: revisão do tarefas lista 9 respostas', (await rows.count()) === 9, String(await rows.count()));

  await rows.nth(1).getByRole('button', { name: 'Editar' }).click();
  await radio(p, 'Comissão de canal ou marketplace').click(); await goClick(p);
  t('B: após trocar objetivo, currentTools re-perguntado sem pré-marcado', (await qTitle(p)) === 'Como essa rotina funciona hoje?' && (await onCount(p)) === 0, `${await qTitle(p)} | on=${await onCount(p)}`);

  const seen = [];
  await radio(p, 'Planilha').click(); seen.push(await qTitle(p)); await goClick(p);
  seen.push(await qTitle(p)); // volume
  t('B: volume do canal TEM select de moeda', (await p.locator('.mf-dg__field--cur').count()) === 1);
  await p.locator('input[type=number]').first().fill('100');
  t('B: exato digitado não marca banda', (await onCount(p)) === 0);
  await p.locator('.mf-dg__field--cur select').selectOption('BRL'); await goClick(p);
  seen.push(await qTitle(p)); // bottleneck
  await radio(p, 'Procurar ou conferir informação').click(); await goClick(p);
  seen.push(await qTitle(p)); // horas
  await goClick(p); // desconhecido
  seen.push(await qTitle(p)); // dataAccess/urgency sobreviveram: próxima é a taxa
  t('B: taxa do canal aparece após a troca (dataAccess/urgency não re-perguntadas)', seen.at(-1) === 'Qual taxa o canal cobra de fato?' && !seen.includes('Quão confiáveis e acessíveis são as informações?') && !seen.includes('Quando faz sentido começar?'), seen.join(' | '));
  await p.locator('input[type=number]').first().fill('20'); await goClick(p);
  seen.push(await qTitle(p)); // parcela
  await p.locator('input[type=number]').first().fill('30'); await goClick(p);
  seen.push(await qTitle(p)); // review
  t('B: custo/hora NUNCA aparece no ramo canal', !seen.includes('Quanto custa a hora dessa rotina?'), seen.join(' | '));
  t('B: taxa e parcela aparecem 1x cada', seen.filter((x) => x === 'Qual taxa o canal cobra de fato?').length === 1 && seen.filter((x) => x === 'Qual parcela seria viável migrar?').length === 1);
  t('B: revisão final lista 10 respostas', (await rows.count()) === 10, String(await rows.count()));
  await goClick(p); // Ver o resultado
  await p.waitForTimeout(400);
  const body = await p.textContent('body');
  t('B: resultado com prioridades, sem NaN, sem erros JS', (await p.locator('.mf-dg__prio').count()) >= 1 && !/NaN|Infinity/.test(body) && jsErrs.length === 0, jsErrs.join('|'));
  await p.screenshot({ path: 'diag_core_b_9to10.png', fullPage: true });
  await ctx.close();
}

/* ═══ C) volume: banda↔exato exclusivos; moeda no resumo p/ faixas; Não sei ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/pt/insights`, { waitUntil: 'networkidle' }); await noConsent(p);

  await radio(p, 'Comércio ou distribuição').click(); await goClick(p);
  await radio(p, 'Comissão de canal ou marketplace').click(); await goClick(p);
  await radio(p, 'Planilha').click(); await goClick(p);
  // digita exato 100 e então escolhe banda: exato é LIMPO
  await p.locator('input[type=number]').first().fill('100');
  await radio(p, '2 a 10 mil').click();
  t('C: banda limpa o valor exato (input vazio)', (await p.locator('input[type=number]').first().inputValue()) === '');
  await p.locator('.mf-dg__field--cur select').selectOption('BRL'); await goClick(p);
  await radio(p, 'Procurar ou conferir informação').click(); await goClick(p);
  await goClick(p); // horas desconhecido
  await radio(p, 'Precisam de conferência').click(); await goClick(p);
  await radio(p, 'Agora').click(); await goClick(p);
  await p.locator('input[type=number]').first().fill('20'); await goClick(p);
  await p.locator('input[type=number]').first().fill('30'); await goClick(p);
  const rows = p.locator('.mf-dg__revrow');
  const volRow = await rows.nth(3).textContent();
  t('C: resumo mostra FAIXA com moeda ("2 a 10 mil" + "BRL")', volRow.includes('2 a 10 mil') && volRow.includes('BRL'), volRow);

  await rows.nth(3).getByRole('button', { name: 'Editar' }).click();
  t('C: editando volume, banda pré-marcada', (await onCount(p)) === 1, String(await onCount(p)));
  await p.locator('input[type=number]').first().fill('100');
  t('C: digitar exato LIMPA a banda (nenhuma marcada)', (await onCount(p)) === 0, String(await onCount(p)));
  await goClick(p);
  const volRow2 = await rows.nth(3).textContent();
  t('C: resumo mostra exato com moeda ("100" + "BRL")', volRow2.includes('100') && volRow2.includes('BRL'), volRow2);
  t('C: edição do volume NÃO apaga taxa/parcela (sem dependentes)', (await rows.count()) === 10, String(await rows.count()));

  await rows.nth(3).getByRole('button', { name: 'Editar' }).click();
  await radio(p, 'Não sei').click();
  t('C: "Não sei" do volume seleciona visualmente', (await p.locator('.mf-dg__opt[data-on="true"]').count()) === 1);
  await goClick(p);
  const volRow3 = await rows.nth(3).textContent();
  t('C: resumo rotula volume como "Não sei"', volRow3.includes('Não sei'), volRow3);
  await goClick(p); // Ver o resultado
  await p.waitForTimeout(400);
  const body = await p.textContent('body');
  t('C: resultado com prioridades, sem NaN, sem erros JS', (await p.locator('.mf-dg__prio').count()) >= 1 && !/NaN|Infinity/.test(body) && jsErrs.length === 0, jsErrs.join('|'));
  await p.screenshot({ path: 'diag_core_c_volume.png', fullPage: true });
  await ctx.close();
}

await b.close();
console.log(`\n${pass} ok, ${fail} falha(s)`);
process.exit(fail ? 1 : 0);
