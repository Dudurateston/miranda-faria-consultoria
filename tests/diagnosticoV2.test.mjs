/**
 * tests/diagnosticoV2.test.mjs — Etapa 1 rev.2, teste puro (node, sem framework).
 * Comando reproduzível:  node tests/diagnosticoV2.test.mjs
 * Cobre o checklist do plano + os 8 pontos da revisão Codex:
 *  1) textId explorar existe PT/EN · 2) moeda explícita BRL/EUR/GBP/USD, sem
 *  moeda não calcula dinheiro, código propagado · 3) ramo comissão tem
 *  prioridade sobre tempo, sem somar · 4) 1e308 não vira Infinity/JSON-null
 *  silencioso · 5) 'nao_sei' em dataAccess → verificar, não afirmar; saudável
 *  exige confiável explícito · 6) piso da banda até1h é 0; custo/hora 0 é
 *  válido · 7) ação do objetivo sempre dentro das ≤3 · 8) hints sem detalhes
 *  internos nem promessas; EN sem WhatsApp · + 150% no summary e volume
 *  ausente em missingData.
 */
import assert from "node:assert/strict";
import {
  getDiagnosisQuestions,
  pruneAnswers,
  evaluateDiagnosis,
  hoursRange,
  volumeRange,
  costOf,
  num,
  pct,
  currencyOf,
  allFinite,
} from "../src/lib/diagnosticoV2.js";
import { QUESTIONS_V2, PRIORITY_TEXTS, GOAL_ACTIONS, NEXT_STEP_TEXTS, VOLUME_UNITS, HOURS_BANDS } from "../src/content/diagnosticoV2.js";

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log(`  ok  ${name}`); }
  catch (e) { fail++; console.log(`FAIL  ${name}\n      ${e.message}`); }
};
const ids = (list) => list.map((q) => q.id);
const noNaN = (v, path = "") => {
  if (typeof v === "number") assert.ok(Number.isFinite(v), `NaN/Infinity em ${path}`);
  else if (Array.isArray(v)) v.forEach((x, i) => noNaN(x, `${path}[${i}]`));
  else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => noNaN(x, `${path}.${k}`));
};

const A8 = { sector: "comercio", goal: "pedidos_vendas", currentTools: "planilha", volume: { band: "11a50" }, bottleneck: "procurar_conferir", hoursPerWeek: { band: "nao_sei" }, dataAccess: "atualizadas_compartilhadas", urgency: "agora" };
const TAREFAS = { ...A8, goal: "tarefas_repetitivas", bottleneck: "redigitar", hoursPerWeek: { band: "1a3h" } };
const CANAL = { ...A8, goal: "comissao_canal", volume: { band: "2ka10k", currency: "BRL" }, commissionRate: 20, migratableShare: 30 };

console.log("== caminhos 8/9/10 ==");
t("caminho simples tem 8 perguntas", () => assert.equal(ids(getDiagnosisQuestions(A8)).length, 8));
t("caminho tarefas com horas conhecidas tem 9 (8 + custo/hora)", () => {
  const q = ids(getDiagnosisQuestions(TAREFAS));
  assert.equal(q.length, 9);
  assert.ok(q.includes("hourlyCost"));
});
t("caminho comissao_canal tem 10 (8 + taxa + parcela)", () => {
  const q = ids(getDiagnosisQuestions({ ...A8, goal: "comissao_canal" }));
  assert.equal(q.length, 10);
  assert.ok(q.includes("commissionRate") && q.includes("migratableShare"));
});
t("custo/hora NAO aparece com horas desconhecidas", () => {
  const q = ids(getDiagnosisQuestions({ ...A8, goal: "tarefas_repetitivas", hoursPerWeek: { band: "nao_sei" } }));
  assert.ok(!q.includes("hourlyCost"));
});
t("volume deriva unidade do objetivo (moeda no canal)", () => {
  assert.equal(getDiagnosisQuestions(A8).find((q) => q.id === "volume").unit, "pedidos");
  const canal = getDiagnosisQuestions({ ...A8, goal: "comissao_canal" }, "pt").find((q) => q.id === "volume");
  assert.equal(canal.unit, "receita do canal");
  assert.equal(canal.currency, true);
  assert.equal(getDiagnosisQuestions(A8, "en").find((q) => q.id === "volume").unit, "orders");
});

console.log("== prune: troca de ramo limpa só os dependentes ==");
t("trocar goal remove condicionais; mantém setor/dados/urgência", () => {
  const pr = pruneAnswers(CANAL, "goal");
  for (const k of ["currentTools", "volume", "bottleneck", "hoursPerWeek", "commissionRate", "migratableShare"]) assert.equal(pr[k], undefined, `${k} devia sair`);
  for (const k of ["sector", "dataAccess", "urgency"]) assert.ok(pr[k] != null, `${k} devia ficar`);
});
t("mudar urgency não apaga nada", () => {
  const pr = pruneAnswers({ ...A8 }, "urgency");
  assert.equal(Object.keys(pr).length, 8);
});

console.log("== unknown ≠ 0 / zero válido / recusas ==");
t("'nao_sei' em horas = null, nunca 0", () => assert.equal(hoursRange({ hoursPerWeek: { band: "nao_sei" } }), null));
t("banda zero de horas = {0,0} válida", () => {
  const h = hoursRange({ hoursPerWeek: { band: "zero" } });
  assert.equal(h.lo, 0); assert.equal(h.hi, 0);
});
t("rev.6: banda 'até 1h' tem piso 0 (sem 0,5h inventado)", () => {
  const b = HOURS_BANDS.find((x) => x.id === "ate1h");
  assert.equal(b.lo, 0); assert.equal(b.hi, 1);
  const h = hoursRange({ hoursPerWeek: { band: "ate1h" } });
  assert.equal(h.lo, 0);
});
t("num/pct recusam negativo, NaN, Infinity, >100; zero passa", () => {
  assert.equal(num(-5), null); assert.equal(num(NaN), null); assert.equal(num(Infinity), null); assert.equal(num(0), 0);
  assert.equal(pct(120), null); assert.equal(pct(-1), null); assert.equal(pct(0), 0); assert.equal(pct(100), 100);
});
t("rev.2: moeda aceita BRL/EUR/GBP/USD; outra coisa é null", () => {
  for (const c of ["BRL", "EUR", "GBP", "USD"]) assert.equal(currencyOf(c), c);
  assert.equal(currencyOf("XYZ"), null); assert.equal(currencyOf(null), null); assert.equal(currencyOf("brl"), null);
});
t("rev.2: 150% no commissionRate NÃO entra no summary como valor válido", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "2ka10k", currency: "BRL" }, commissionRate: 150, migratableShare: 30 });
  const s = r.summary.find((x) => x.id === "commissionRate");
  assert.equal(s.value, null);
  assert.equal(r.estimate, null);
});

console.log("== moeda explícita: sem moeda não calcula dinheiro (rev.2) ==");
t("custo/hora SEM moeda: horas sim, dinheiro não + missingData informar_moeda", () => {
  const r = evaluateDiagnosis({ ...TAREFAS, hourlyCost: { value: 50 } });
  assert.equal(r.estimate.kind, "tempo");
  assert.equal(r.estimate.costPerMonth, undefined);
  assert.ok(r.missingData.some((m) => m.id === "informar_moeda"));
});
t("custo/hora COM moeda BRL: costPerMonth propaga a moeda", () => {
  const r = evaluateDiagnosis({ ...TAREFAS, hourlyCost: { value: 50, currency: "BRL" } });
  assert.equal(r.estimate.costPerMonth.currency, "BRL");
  assert.equal(r.estimate.costPerMonth.lo, Math.round(4.33 * 100) / 100 * 50);
});
t("custo/hora 0 COM moeda: zero válido, é dinheiro, não desconhecido (rev.6)", () => {
  const r = evaluateDiagnosis({ ...TAREFAS, hoursPerWeek: { value: 2 }, hourlyCost: { value: 0, currency: "BRL" } });
  assert.equal(r.estimate.costPerMonth.lo, 0);
  assert.equal(r.estimate.costPerMonth.currency, "BRL");
  assert.ok(!r.missingData.some((m) => m.id === "informar_custo_hora" || m.id === "informar_moeda"));
});
t("custo/hora 0 SEM moeda: não é dinheiro válido", () => {
  const r = evaluateDiagnosis({ ...TAREFAS, hoursPerWeek: { value: 2 }, hourlyCost: { value: 0 } });
  assert.equal(r.estimate.costPerMonth, undefined);
  assert.ok(r.missingData.some((m) => m.id === "informar_moeda"));
});
t("comissão SEM moeda na receita: estimate null + informar_moeda", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "2ka10k" }, commissionRate: 20, migratableShare: 30 });
  assert.equal(r.estimate, null);
  assert.ok(r.missingData.some((m) => m.id === "informar_moeda"));
});
t("comissão COM moeda EUR: gross propaga EUR", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "2ka10k", currency: "EUR" }, commissionRate: 20, migratableShare: 30 });
  assert.equal(r.estimate.grossPerMonth.currency, "EUR");
});

console.log("== horas/unidades coerentes (4,33 explícitas) ==");
t("1h/semana → 4,33 h/mês; 1-3h → 4,33-12,99; 'acima8h' sem teto inventado", () => {
  const r1 = evaluateDiagnosis({ ...TAREFAS, hoursPerWeek: { value: 1 } });
  assert.equal(r1.estimate.weeksPerMonth, 4.33);
  assert.equal(r1.estimate.hoursPerMonth.lo, 4.33);
  const r3 = evaluateDiagnosis(TAREFAS);
  assert.equal(r3.estimate.hoursPerMonth.lo, 4.33); assert.equal(r3.estimate.hoursPerMonth.hi, 12.99);
  const r8 = evaluateDiagnosis({ ...TAREFAS, hoursPerWeek: { band: "acima8h" } });
  assert.equal(r8.estimate.hoursPerMonth.hi, null);
});

console.log("== comissão: ramo primeiro, 3 entradas + moeda (rev.3) ==");
t("rev.3: comissao_canal com horas>0 calcula COMISSÃO, não tempo, sem somar", () => {
  const r = evaluateDiagnosis({ ...CANAL, bottleneck: "redigitar", hoursPerWeek: { band: "3a8h" } });
  assert.equal(r.estimate.kind, "comissao_bruta");
  assert.ok(!r.estimate.hoursPerMonth);
  assert.equal(r.estimate.grossPerMonth.currency, "BRL");
});
t("sem taxa → null + missingData taxa e parcela", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "2ka10k", currency: "BRL" } });
  assert.equal(r.estimate, null);
  assert.ok(r.missingData.some((m) => m.id === "informar_taxa"));
  assert.ok(r.missingData.some((m) => m.id === "informar_parcela"));
});
t("rev.: volume AUSENTE em comissao → missingData informar_receita", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", commissionRate: 20, migratableShare: 30 });
  assert.equal(r.estimate, null);
  assert.ok(r.missingData.some((m) => m.id === "informar_receita"));
});
t("receita 2001-10000, taxa 20%, parcela 30% → bruta 120,06-600 BRL (nunca líquida)", () => {
  const r = evaluateDiagnosis(CANAL);
  assert.equal(r.estimate.kind, "comissao_bruta");
  assert.equal(r.estimate.grossPerMonth.lo, Math.round(2001 * 0.2 * 0.3 * 100) / 100);
  assert.equal(r.estimate.grossPerMonth.hi, 600);
  assert.equal(r.estimate.grossPerMonth.currency, "BRL");
});
t("receita zero declarada: bruta 0 válida, sem crash", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "zero", currency: "BRL" }, commissionRate: 20, migratableShare: 30 });
  assert.equal(r.estimate.grossPerMonth.lo, 0);
});

console.log("== rev.4: estouro 1e308 nunca vira Infinity/JSON null silencioso ==");
t("volume 1e308 × taxa 100 × parcela 100 → estimate null, sem Infinity", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { value: 1e308, currency: "BRL" }, commissionRate: 100, migratableShare: 100 });
  assert.equal(r.estimate, null);
  const s = JSON.stringify(r);
  assert.ok(!/NaN|Infinity/.test(s), "Infinity/NaN no JSON");
  assert.ok(allFinite(r.summary));
});
t("horas 1e308/semana → estimate null (multiplicação estoura)", () => {
  const r = evaluateDiagnosis({ ...TAREFAS, hoursPerWeek: { value: 1e308 } });
  assert.equal(r.estimate, null);
  assert.ok(!/NaN|Infinity/.test(JSON.stringify(r)));
});
t("JSON round-trip do resultado não perde informação por não-finito", () => {
  const r = evaluateDiagnosis(CANAL);
  const rt = JSON.parse(JSON.stringify(r));
  assert.deepEqual(rt.estimate.grossPerMonth, r.estimate.grossPerMonth);
});

console.log("== prioridades: rev.5/rev.7 + dedup + saudável explícito ==");
t("rev.5: dataAccess 'nao_sei' → VERIFICAR informação, não organizar nem validar", () => {
  const r = evaluateDiagnosis({ sector: "servicos", goal: "pedidos_vendas", currentTools: "sistemas_integrados", volume: { band: "11a50" }, bottleneck: "nenhum", hoursPerWeek: { band: "zero" }, dataAccess: "nao_sei", urgency: "explorando" });
  assert.equal(r.priorities[0].id, "verificar_informacao");
  assert.ok(!r.priorities.some((p) => p.id === "organizar_informacao"));
  assert.ok(!r.priorities.some((p) => p.id === "acompanhar_validar"));
});
t("rev.5: saudável exige confiável EXPLÍCITO (atualizadas_compartilhadas)", () => {
  const saudavel = evaluateDiagnosis({ sector: "servicos", goal: "pedidos_vendas", currentTools: "sistemas_integrados", volume: { band: "11a50" }, bottleneck: "nenhum", hoursPerWeek: { band: "zero" }, dataAccess: "atualizadas_compartilhadas", urgency: "agora" });
  assert.equal(saudavel.priorities.length, 1);
  assert.equal(saudavel.priorities[0].id, "acompanhar_validar");
});
t("informação confirmada problemática vem ANTES da automação", () => {
  const r = evaluateDiagnosis({ ...A8, dataAccess: "uma_pessoa_sabe", bottleneck: "redigitar" });
  assert.equal(r.priorities[0].id, "organizar_informacao");
});
t("gargalos mapeiam: redigir→retrabalho, procurar→consulta, esperar→destravar", () => {
  assert.equal(evaluateDiagnosis({ ...A8, bottleneck: "redigitar" }).priorities.find((p) => p.id === "mapear_retrabalho") != null, true);
  assert.equal(evaluateDiagnosis({ ...A8, bottleneck: "procurar_conferir" }).priorities[0].id, "organizar_consulta_dados");
  assert.equal(evaluateDiagnosis({ ...A8, dataAccess: "nao_sei", bottleneck: "esperar_alguem" }).priorities[1].id, "destravar_gargalo_pessoa");
});
t("rev.7: ação do objetivo SEMPRE presente, mesmo com retrabalho, ≤3 no total", () => {
  const r = evaluateDiagnosis({ ...A8, dataAccess: "precisam_conferencia", bottleneck: "redigitar", hoursPerWeek: { band: "1a3h" } });
  assert.equal(r.priorities.length, 3);
  const acao = r.priorities.find((p) => p.id === "acao_do_objetivo");
  assert.ok(acao, "acao_do_objetivo devia estar presente");
  assert.equal(acao.goal, "pedidos_vendas");
  const pids = r.priorities.map((p) => p.id);
  assert.equal(new Set(pids).size, pids.length);
});
t("comissão completa: avaliar_migracao + ação do objetivo dentro das ≤3", () => {
  const r = evaluateDiagnosis(CANAL);
  assert.ok(r.priorities.some((p) => p.id === "avaliar_migracao_canal"));
  assert.ok(r.priorities.some((p) => p.id === "acao_do_objetivo"));
  assert.ok(r.priorities.length <= 3);
});
t("sem preencher 3 à força", () => {
  const r = evaluateDiagnosis({ sector: "comercio", goal: "pedidos_vendas", currentTools: "planilha", volume: { band: "11a50" }, bottleneck: "nenhum", hoursPerWeek: { band: "zero" }, dataAccess: "atualizadas_compartilhadas", urgency: "proximos_meses" });
  assert.ok(r.priorities.length >= 1 && r.priorities.length <= 2);
});

console.log("== próximo passo e urgência (rev.1: ids existem em PT e EN) ==");
t("rev.1: textId 'explorar' existe em PT e EN (era 'explorando' inexistente)", () => {
  const r = evaluateDiagnosis({ ...A8, urgency: "explorando" });
  assert.equal(r.nextStep.id, "explorar");
  assert.ok(NEXT_STEP_TEXTS.pt.explorar, "pt.explorar ausente");
  assert.ok(NEXT_STEP_TEXTS.en.explorar, "en.explorar ausente");
});
t("todos os nextStep.textId existem em PT e EN em todos os cenários", () => {
  const scen = [A8, TAREFAS, CANAL, { ...A8, urgency: "explorando" }, { ...A8, urgency: "proximos_meses" }, { ...A8, goal: "comissao_canal" }, { ...TAREFAS, hourlyCost: { value: 10 } }];
  for (const a of scen) for (const lang of ["pt", "en"]) {
    const r = evaluateDiagnosis(a, lang);
    assert.ok(NEXT_STEP_TEXTS[lang][r.nextStep.textId], `${lang} ${r.nextStep.textId}`);
    r.missingData.forEach((m) => assert.ok(NEXT_STEP_TEXTS[lang][m.id], `${lang} ${m.id}`));
  }
});
t("urgência não toca estimate", () => {
  const e1 = evaluateDiagnosis({ ...A8, urgency: "agora", hoursPerWeek: { band: "1a3h" } }).estimate;
  const e2 = evaluateDiagnosis({ ...A8, urgency: "explorando", hoursPerWeek: { band: "1a3h" } }).estimate;
  assert.deepEqual(e1, e2);
});

console.log("== rev.8: hints sem detalhes internos nem promessas; EN sem WhatsApp ==");
t("hints PT/EN sem 'define o ramo', 'cita esta resposta', margem interna", () => {
  for (const lang of ["pt", "en"]) for (const q of QUESTIONS_V2[lang]) {
    const h = (q.hint || "") + " " + (q.title || "");
    assert.ok(!/define o ramo|cita esta resposta|presum|margem|prioridade sugerida/i.test(h), `${lang} ${q.id}: "${h}"`);
  }
});
t("textos sem promessa de duração (30 minutos / primeira hora) e EN sem WhatsApp", () => {
  for (const lang of ["pt", "en"]) for (const [k, v] of Object.entries(NEXT_STEP_TEXTS[lang])) {
    assert.ok(!/30 min|trinta minutos|primeira hora|30 minutes|first hour/i.test(v), `${lang} ${k}: "${v}"`);
    if (lang === "en") assert.ok(!/whatsapp/i.test(v), `en ${k} menciona WhatsApp`);
  }
});
t("PT conversa cita WhatsApp; EN conversa cita Calendly (decisão do dono)", () => {
  assert.ok(/whatsapp/i.test(NEXT_STEP_TEXTS.pt.conversar));
  assert.ok(/calendly/i.test(NEXT_STEP_TEXTS.en.conversar));
});

console.log("== PT/EN paridade e textos completos ==");
t("mesmos ids de pergunta/opção em PT e EN", () => {
  const [pt, en] = [QUESTIONS_V2.pt, QUESTIONS_V2.en];
  assert.deepEqual(ids(pt), ids(en));
  for (let i = 0; i < pt.length; i++) {
    assert.deepEqual(pt[i].options?.map((o) => o.id), en[i].options?.map((o) => o.id));
    assert.equal(pt[i].dependsOn.join(), en[i].dependsOn.join());
    assert.equal(pt[i].required, en[i].required);
  }
});
t("todo id de prioridade emitido tem texto PT e EN (acao_do_objetivo via GOAL_ACTIONS)", () => {
  const scen = [A8, TAREFAS, CANAL, { ...A8, dataAccess: "nao_sei" }, { ...A8, dataAccess: "uma_pessoa_sabe", bottleneck: "redigitar" }, { sector: "servicos", goal: "pedidos_vendas", currentTools: "sistemas_integrados", volume: { band: "11a50" }, bottleneck: "nenhum", hoursPerWeek: { band: "zero" }, dataAccess: "atualizadas_compartilhadas", urgency: "agora" }];
  for (const a of scen) for (const lang of ["pt", "en"]) {
    const r = evaluateDiagnosis(a, lang);
    r.priorities.forEach((p) => {
      if (p.id === "acao_do_objetivo") assert.ok(GOAL_ACTIONS[lang][p.goal], `GOAL_ACTIONS ${lang} ${p.goal}`);
      else assert.ok(PRIORITY_TEXTS[p.id]?.[lang], `PRIORITY_TEXTS ${lang} ${p.id}`);
    });
  }
});
t("verificar_informacao tem texto PT e EN (rev.5)", () => {
  assert.ok(PRIORITY_TEXTS.verificar_informacao.pt && PRIORITY_TEXTS.verificar_informacao.en);
});
t("unidades de volume existem para os 6 objetivos em PT e EN", () => {
  for (const lang of ["pt", "en"]) assert.equal(Object.keys(VOLUME_UNITS[lang]).length, 6);
});

console.log("== nenhum NaN/negativo vaza ==");
t("varredura de NaN/Infinity em todos os resultados dos cenários", () => {
  const scen = [A8, TAREFAS, CANAL, { ...TAREFAS, hourlyCost: { value: 60, currency: "USD" } }, { sector: "industria", goal: "estoque_informacao", currentTools: "conversa_papel", volume: { band: "zero" }, bottleneck: "nenhum", hoursPerWeek: { band: "nao_sei" }, dataAccess: "nao_sei", urgency: "explorando" }];
  for (const a of scen) for (const lang of ["pt", "en"]) {
    const r = evaluateDiagnosis(a, lang);
    noNaN(r, "result");
    assert.ok(!/NaN|Infinity/.test(JSON.stringify(r)));
  }
});

console.log("== resumo cru editável ==");
t("summary traz só ids respondidos, com ranges e moedas saneados", () => {
  const r = evaluateDiagnosis(CANAL);
  assert.equal(r.summary.length, 10); /* 8 principais + taxa + parcela */
  const vol = r.summary.find((s) => s.id === "volume");
  assert.equal(vol.value.lo, 2001);
  assert.equal(vol.value.currencyCode, "BRL");
  assert.equal(r.version, 2);
});
t("custo/hora no summary propaga {value, currency} e aceita 0", () => {
  const r = evaluateDiagnosis({ ...TAREFAS, hourlyCost: { value: 0, currency: "BRL" } });
  const c = r.summary.find((s) => s.id === "hourlyCost");
  assert.deepEqual(c.value, { value: 0, currency: "BRL" });
  assert.ok(costOf({ hourlyCost: { value: 0, currency: "BRL" } }).value === 0);
});

console.log(`\n${pass} ok, ${fail} falha(s)`);
process.exit(fail ? 1 : 0);
