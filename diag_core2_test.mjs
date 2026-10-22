/**
 * diag_core2_test.mjs — Testes DIRIGIDOS da 2ª revisão Codex (pós-38c2b08):
 * (1) EN comissão+tempo: todos os textos de comissão/custo e /month corretos
 *     no resultado e no resumo; resumo em inglês com desconhecidos incluídos.
 * (2) Rever respostas SEM apagar; recalcular pela revisão; foco anunciado.
 * (3) Teclado REAL (setas + roving tabindex nativo), zero mouse.
 * (4) estimate null + missingData vazio => complemento financeiro oculto.
 * SEM deploy; writes bloqueados; consentimento dispensado com Enter real.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4181';
let pass = 0, fail = 0;
const t = (name, ok, extra = '') => {
  if (ok) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};

const focusEl = (p) => p.evaluate(() => {
  const a = document.activeElement;
  return { tag: a ? a.tagName : '', text: ((a && a.textContent) || '').trim().slice(0, 60), type: a ? a.type : '', val: a ? a.value : '' };
});
const tabUntil = async (p, pred, max = 32) => {
  for (let i = 0; i < max; i++) {
    const el = await focusEl(p);
    if (pred(el)) return el;
    await p.keyboard.press('Tab');
    await p.waitForTimeout(80);
  }
  return null;
};
/* resposta por teclado: chega ao grupo de radios por Tab (de onde o foco
   estiver) e seleciona com setas/espaço — roving tabindex nativo */
const pick = async (p, arrows) => {
  const el = await tabUntil(p, (x) => x.tag === 'INPUT' && x.type === 'radio');
  if (!el) throw new Error('radio não alcançável por Tab: ' + JSON.stringify(await focusEl(p)));
  for (let i = 0; i < arrows; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(50); }
  if (arrows === 0) { await p.keyboard.press('Space'); await p.waitForTimeout(50); }
};
/* seleciona pelo texto da opção (indices variam por pergunta/idioma) */
const pickLabel = async (p, labelPart) => {
  await tabUntil(p, (x) => x.tag === 'INPUT' && x.type === 'radio');
  const idx = await p.evaluate((needle) => {
    const rs = [...document.querySelectorAll('input.mf-dg__radio[type=radio]')];
    const i = rs.findIndex((r) => ((r.closest('label') || {}).textContent || '').toLowerCase().includes(needle));
    return i;
  }, labelPart.toLowerCase());
  if (idx < 0) throw new Error('opção não encontrada: ' + labelPart);
  await pick(p, idx);
};
const go = async (p) => {
  const el = await tabUntil(p, (x) => x.tag === 'BUTTON' && /Continue|See the result/.test(x.text));
  if (!el) throw new Error('Continuar não alcançável por Tab: ' + JSON.stringify(await focusEl(p)));
  await p.keyboard.press('Enter');
  await p.waitForTimeout(450);
};
const consentKeyboard = async (p) => {
  try {
    const btn = p.getByRole('button', { name: 'Essential only' }).first();
    await btn.waitFor({ state: 'visible', timeout: 8000 });
    await btn.focus();
    await p.keyboard.press('Enter');
    await p.waitForTimeout(500);
  } catch { /* já decidido */ }
};

const b = await chromium.launch();
const jsErrs = [];

/* ═══ 1+2+3) EN comissão via teclado; resultado/revisão/recalcular ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/en/insights`, { waitUntil: 'networkidle' });
  let f = await focusEl(p);
  t('teclado: título da pergunta auto-focado ao entrar (antes do banner)', /What does the company do\?/.test(f.text), f.text);
  await consentKeyboard(p);

  await pick(p, 0); await go(p);          // Commerce or distribution (espaço)
  await pick(p, 5); await go(p);          // Commission from a channel or marketplace (5 setas)
  await pick(p, 1); await go(p);          // Spreadsheet
  await pick(p, 1);                       // banda de volume (2ª opção)
  await tabUntil(p, (x) => x.tag === 'SELECT'); // moeda
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(80); // BRL
  const selVal = await focusEl(p);
  t('teclado: moeda BRL selecionada por seta no select', selVal.val === 'BRL', selVal.val);
  await go(p);
  await pick(p, 1); await go(p);          // bottleneck
  await pickLabel(p, "I don't know"); await go(p); // horas: desconhecido
  await pick(p, 2); await go(p);          // dataAccess
  await pick(p, 2); await go(p);          // urgency
  await tabUntil(p, (x) => x.tag === 'INPUT' && x.type === 'number');
  await p.keyboard.type('20'); await go(p); // taxa
  await tabUntil(p, (x) => x.tag === 'INPUT' && x.type === 'number');
  await p.keyboard.type('30'); await go(p); // parcela

  f = await focusEl(p);
  t('teclado: revisão anunciada por foco no título', f.text === 'Review answers', f.text);
  const rows = p.locator('.mf-dg__revrow');
  t('revisão EN lista 10 respostas', (await rows.count()) === 10, String(await rows.count()));

  const seeEl = await tabUntil(p, (x) => x.tag === 'BUTTON' && /See the result/.test(x.text));
  t('teclado: "See the result" alcançável por Tab', !!seeEl);
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);

  f = await focusEl(p);
  t('teclado: resultado anunciado por foco no título "Your initial plan"', f.text === 'Your initial plan', f.text);
  const body = await p.textContent('body');
  const est = await p.locator('.mf-dg__estnum').first().textContent();
  t('EN: comissão em /month (sem "/mês", sem "comissão")', /\/month/.test(est) && !/\/mês/.test(body) && !/comissão/.test(body), est);
  t('EN: bruta "potentially avoidable commission — gross"', /potentially avoidable commission — gross/.test(body));
  const ta = await p.locator('textarea.mf-dg__ta').inputValue();
  t('resumo EN: gross avoidable commission + BRL/month (sem PT)', /gross avoidable commission/.test(ta) && /BRL\/month/.test(ta) && !/\/mês|comissão/.test(ta), ta);
  t('resumo EN: desconhecido de horas incluído ("I don\'t know")', /I don't know/.test(ta), ta);
  const gross1 = est;

  // Rever respostas SEM apagar: resultado -> revisão intacta
  const revEl = await tabUntil(p, (x) => x.tag === 'BUTTON' && /Review your answers/.test(x.text));
  t('teclado: "Review your answers" alcançável por Tab no resultado', !!revEl);
  await p.keyboard.press('Enter'); await p.waitForTimeout(450);
  f = await focusEl(p);
  t('Rever respostas: volta à revisão com foco anunciado e respostas intactas', f.text === 'Review answers' && (await rows.count()) === 10, `${f.text} | rows=${await rows.count()}`);

  // Editar volume pela revisão (4º botão Edit), recalcular por teclado
  let edits = 0;
  const editBtn = await tabUntil(p, (x) => { if (x.tag === 'BUTTON' && x.text === 'Edit') { edits++; return edits === 4; } return false; });
  t('teclado: botão Edit do volume alcançável por Tab', !!editBtn && edits === 4, String(edits));
  await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  f = await focusEl(p);
  t('teclado: edição do volume foca a pergunta', /routine|size/.test(f.text), f.text);
  await p.keyboard.press('Tab'); await p.waitForTimeout(60); // primeiro radio
  await tabUntil(p, (x) => x.tag === 'INPUT' && x.type === 'number'); // valor exato
  await p.keyboard.type('100000');
  await go(p); // Continuar
  f = await focusEl(p);
  t('pós-edição: revisão re-anunciada, 10 respostas preservadas', f.text === 'Review answers' && (await rows.count()) === 10, `${f.text} | rows=${await rows.count()}`);
  await tabUntil(p, (x) => x.tag === 'BUTTON' && /See the result/.test(x.text));
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const est2 = await p.locator('.mf-dg__estnum').first().textContent();
  t('recalcular: comissão muda com volume exato 100k (6,000 BRL/month)', /6,000/.test(est2) && est2 !== gross1, `${gross1} -> ${est2}`);
  const ta2 = await p.locator('textarea.mf-dg__ta').inputValue();
  t('resumo recalculado: 100,000 + 6,000 no texto em inglês', /100,000/.test(ta2) && /6,000 BRL\/month/.test(ta2), ta2);
  t('fluxo teclado EN: sem erros JS, sem NaN', jsErrs.length === 0 && !/NaN|Infinity/.test(await p.textContent('body')), jsErrs.join('|'));
  await p.screenshot({ path: 'diag_core2_en_comissao.png', fullPage: true });
  await ctx.close();
}

/* ═══ 4) estimate null + missingData vazio => complemento oculto (EN) ═══ */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  ctx.route('**/api/**', (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => jsErrs.push(e.message.slice(0, 60)));
  await p.goto(`${BASE}/en/insights`, { waitUntil: 'networkidle' });
  await consentKeyboard(p);
  await pick(p, 0); await go(p);   // Commerce
  await pick(p, 4); await go(p);   // Business continuity (5ª opção)
  await pick(p, 1); await go(p);   // Spreadsheet
  await pick(p, 1); await go(p);   // volume banda
  await pick(p, 1); await go(p);   // bottleneck: Searching (sem retrabalho)
  await pickLabel(p, "I don't know"); await go(p); // horas: desconhecido => estimate null
  await pick(p, 2); await go(p);   // dataAccess
  await pick(p, 2); await go(p);   // urgency
  await tabUntil(p, (x) => x.tag === 'BUTTON' && /See the result/.test(x.text));
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const f = await focusEl(p);
  t('continuidade: resultado foca "Your initial plan"', f.text === 'Your initial plan', f.text);
  t('estimate null + missingData vazio: complemento financeiro OCULTO', (await p.locator('.mf-dg__est').count()) === 0, String(await p.locator('.mf-dg__est').count()));
  t('continuidade: prioridades presentes, sem NaN, sem erros JS', (await p.locator('.mf-dg__prio').count()) >= 1 && !/NaN|Infinity/.test(await p.textContent('body')) && jsErrs.length === 0, jsErrs.join('|'));
  await p.screenshot({ path: 'diag_core2_en_continuidade.png', fullPage: true });
  await ctx.close();
}

await b.close();
console.log(`\n${pass} ok, ${fail} falha(s)`);
process.exit(fail ? 1 : 0);
