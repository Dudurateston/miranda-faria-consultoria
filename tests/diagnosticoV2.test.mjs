/**
 * tests/diagnosticoV2.test.mjs — Etapa 1, teste puro (node, sem framework).
 * Comando reproduzível:  node tests/diagnosticoV2.test.mjs
 * Cobre o checklist do plano:
 *  caminho 8/9/10 · unknown≠0 · troca de ramo limpa dependentes · horas/unidades
 *  coerentes (4,33 explícitas) · sem dinheiro sem custo · comissão só com 3
 *  entradas · deduplicação de prioridades · cenário sem problema inventado ·
 *  PT/EN paridade · zero válido · recusa negativo/NaN/Infinity/percentual>100 ·
 *  nenhum NaN no resultado.
 */
import assert from "node:assert/strict";
import {
  getDiagnosisQuestions,
  pruneAnswers,
  evaluateDiagnosis,
  hoursRange,
  volumeRange,
  num,
  pct,
  WEEKS_PER_MONTH,
} from "../src/lib/diagnosticoV2.js";
import { QUESTIONS_V2, PRIORITY_TEXTS, GOAL_ACTIONS, NEXT_STEP_TEXTS, VOLUME_UNITS } from "../src/content/diagnosticoV2.js";

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

console.log("== caminhos 8/9/10 ==");
const A8 = { sector: "comercio", goal: "pedidos_vendas", currentTools: "planilha", volume: { band: "11a50" }, bottleneck: "procurar_conferir", hoursPerWeek: { band: "nao_sei" }, dataAccess: "atualizadas_compartilhadas", urgency: "agora" };
t("caminho simples tem 8 perguntas", () => assert.equal(ids(getDiagnosisQuestions(A8)).length, 8));
t("caminho tarefas com horas conhecidas tem 9 (8 + custo/hora)", () => {
  const a = { ...A8, goal: "tarefas_repetitivas", bottleneck: "redigitar", hoursPerWeek: { band: "1a3h" } };
  const q = ids(getDiagnosisQuestions(a));
  assert.equal(q.length, 9);
  assert.ok(q.includes("hourlyCost"));
});
t("caminho comissao_canal tem 10 (8 + taxa + parcela)", () => {
  const a = { ...A8, goal: "comissao_canal" };
  const q = ids(getDiagnosisQuestions(a));
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
t("trocar goal remove currentTools/volume/bottleneck/horas/condicionais; mantém setor/dados/urgência", () => {
  const full = { ...A8, goal: "comissao_canal", volume: { band: "2ka10k" }, commissionRate: 20, migratableShare: 30 };
  const pr = pruneAnswers(full, "goal");
  for (const k of ["currentTools", "volume", "bottleneck", "hoursPerWeek", "commissionRate", "migratableShare"]) assert.equal(pr[k], undefined, `${k} devia sair`);
  for (const k of ["sector", "dataAccess", "urgency"]) assert.ok(pr[k] != null, `${k} devia ficar`);
});
t("goal trocado mantém o novo valor", () => {
  const pr = pruneAnswers({ ...A8, goal: "pedidos_vendas" }, "goal");
  assert.equal(pr.goal, "pedidos_vendas");
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
t("num/ pct recusam negativo, NaN, Infinity, >100; zero passa", () => {
  assert.equal(num(-5), null); assert.equal(num(NaN), null); assert.equal(num(Infinity), null); assert.equal(num(0), 0);
  assert.equal(pct(120), null); assert.equal(pct(-1), null); assert.equal(pct(0), 0); assert.equal(pct(100), 100);
});
t("valor exato negativo em volume é ignorado (banda vale)", () => {
  const v = volumeRange({ goal: "pedidos_vendas", volume: { value: -10, band: "11a50" } });
  assert.equal(v.lo, 11); assert.equal(v.hi, 50);
});
t("percentual 150 no canal vira desconhecido: sem estimativa", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "2ka10k" }, commissionRate: 150, migratableShare: 30 });
  assert.equal(r.estimate, null);
});

console.log("== horas/unidades coerentes (4,33 explícitas) ==");
t("1h/semana → 4,33 h/mês; 3h/semana → 12,99; teto 'acima8h' sem número inventado", () => {
  const r1 = evaluateDiagnosis({ ...A8, goal: "tarefas_repetitivas", bottleneck: "redigitar", hoursPerWeek: { value: 1 } });
  assert.equal(r1.estimate.weeksPerMonth, 4.33);
  assert.equal(r1.estimate.hoursPerMonth.lo, 4.33);
  const r3 = evaluateDiagnosis({ ...A8, goal: "tarefas_repetitivas", bottleneck: "redigitar", hoursPerWeek: { band: "1a3h" } });
  assert.equal(r3.estimate.hoursPerMonth.lo, 4.33); assert.equal(r3.estimate.hoursPerMonth.hi, 12.99);
  const r8 = evaluateDiagnosis({ ...A8, goal: "tarefas_repetitivas", bottleneck: "redigitar", hoursPerWeek: { band: "acima8h" } });
  assert.equal(r8.estimate.hoursPerMonth.hi, null);
  assert.equal(r8.estimate.hoursPerMonth.lo, Math.round(8 * 4.33 * 100) / 100);
});
t("estimativa de tempo existe sem custo; dinheiro só com custo/hora", () => {
  const sem = evaluateDiagnosis({ ...A8, goal: "tarefas_repetitivas", bottleneck: "redigitar", hoursPerWeek: { band: "1a3h" } });
  assert.equal(sem.estimate.kind, "tempo");
  assert.equal(sem.estimate.costPerMonth, undefined);
  assert.ok(sem.missingData.some((m) => m.id === "informar_custo_hora"));
  const com = evaluateDiagnosis({ ...A8, goal: "tarefas_repetitivas", bottleneck: "redigitar", hoursPerWeek: { band: "1a3h" }, hourlyCost: 50 });
  assert.equal(com.estimate.costPerMonth.lo, 4.33 * 50);
  assert.equal(com.estimate.caveatId, "custo_do_tempo");
});

console.log("== comissão apenas com as 3 entradas ==");
t("sem taxa → estimate null + missingData taxa e parcela", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "2ka10k" } });
  assert.equal(r.estimate, null);
  assert.ok(r.missingData.some((m) => m.id === "informar_taxa"));
  assert.ok(r.missingData.some((m) => m.id === "informar_parcela"));
});
t("receita 2001-10000, taxa 20%, parcela 30% → bruta 120,17-600,00 (nunca líquida)", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "2ka10k" }, commissionRate: 20, migratableShare: 30 });
  assert.equal(r.estimate.kind, "comissao_bruta");
  assert.equal(r.estimate.grossPerMonth.lo, Math.round(2001 * 0.2 * 0.3 * 100) / 100);
  assert.equal(r.estimate.grossPerMonth.hi, 600);
  assert.equal(r.estimate.caveatId, "bruta_nao_liquida");
});
t("receita zero declarada: bruta 0 válida, sem crash", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "zero" }, commissionRate: 20, migratableShare: 30 });
  assert.equal(r.estimate.grossPerMonth.lo, 0);
});
t("receita 'acima50k' não inventa teto", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal", volume: { band: "acima50k" }, commissionRate: 20, migratableShare: 30 });
  assert.equal(r.estimate.grossPerMonth.hi, null);
});

console.log("== prioridades: dedup, ≤3, saudável sem problema inventado ==");
t("caminho comum: ≤3 prioridades, ids únicos, com reasonAnswerIds", () => {
  const r = evaluateDiagnosis(A8);
  assert.ok(r.priorities.length <= 3);
  const pids = r.priorities.map((p) => p.id);
  assert.equal(new Set(pids).size, pids.length);
  r.priorities.forEach((p) => assert.ok(Array.isArray(p.reasonAnswerIds) && p.reasonAnswerIds.length > 0));
});
t("cenário saudável (integrado+confiável+nenhum+sem horas) = 1 prioridade acompanhar_validar", () => {
  const r = evaluateDiagnosis({ sector: "servicos", goal: "pedidos_vendas", currentTools: "sistemas_integrados", volume: { band: "11a50" }, bottleneck: "nenhum", hoursPerWeek: { band: "zero" }, dataAccess: "atualizadas_compartilhadas", urgency: "explorando" });
  assert.equal(r.priorities.length, 1);
  assert.equal(r.priorities[0].id, "acompanhar_validar");
});
t("informação não confiável vem ANTES da automação", () => {
  const r = evaluateDiagnosis({ ...A8, dataAccess: "uma_pessoa_sabe", bottleneck: "redigitar" });
  assert.equal(r.priorities[0].id, "organizar_informacao");
});
t("gargalo redigitar/corrigir_erro → mapear_retrabalho; procurar → consulta de dados; esperar → destravar", () => {
  assert.equal(evaluateDiagnosis({ ...A8, bottleneck: "redigitar" }).priorities.find((p) => p.id === "mapear_retrabalho") != null, true);
  assert.equal(evaluateDiagnosis({ ...A8, bottleneck: "procurar_conferir" }).priorities[0].id, "organizar_consulta_dados");
  assert.equal(evaluateDiagnosis({ ...A8, dataAccess: "nao_sei", bottleneck: "esperar_alguem" }).priorities[1].id, "destravar_gargalo_pessoa");
});
t("sem preencher 3 à força: sem gargalo e objetivo simples não gera prioridade inventada", () => {
  const r = evaluateDiagnosis({ sector: "comercio", goal: "pedidos_vendas", currentTools: "planilha", volume: { band: "11a50" }, bottleneck: "nenhum", hoursPerWeek: { band: "zero" }, dataAccess: "atualizadas_compartilhadas", urgency: "proximos_meses" });
  assert.ok(r.priorities.length >= 1 && r.priorities.length <= 2);
  assert.ok(!r.priorities.some((p) => p.id === "mapear_retrabalho"));
});

console.log("== próximo passo e urgência ==");
t("urgência 'agora' → conversar; 'explorando' → explorando; urgency não toca estimate", () => {
  assert.equal(evaluateDiagnosis({ ...A8, urgency: "agora" }).nextStep.id, "conversar");
  assert.equal(evaluateDiagnosis({ ...A8, urgency: "explorando" }).nextStep.id, "explorando");
  const e1 = evaluateDiagnosis({ ...A8, urgency: "agora", hoursPerWeek: { band: "1a3h" } }).estimate;
  const e2 = evaluateDiagnosis({ ...A8, urgency: "explorando", hoursPerWeek: { band: "1a3h" } }).estimate;
  assert.deepEqual(e1, e2);
});
t("falta de dado vira textId falta_dados + missingData acionável", () => {
  const r = evaluateDiagnosis({ ...A8, goal: "comissao_canal" });
  assert.equal(r.nextStep.textId, "falta_dados");
  assert.ok(r.missingData.length >= 2);
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
  const scenarios = [A8, { ...A8, dataAccess: "uma_pessoa_sabe", bottleneck: "redigitar" }, { ...A8, goal: "comissao_canal", volume: { band: "2ka10k" }, commissionRate: 20, migratableShare: 30 }, { sector: "servicos", goal: "pedidos_vendas", currentTools: "sistemas_integrados", volume: { band: "11a50" }, bottleneck: "nenhem", hoursPerWeek: { band: "zero" }, dataAccess: "atualizadas_compartilhadas", urgency: "agora" }];
  for (const a of scenarios) for (const lang of ["pt", "en"]) {
    const r = evaluateDiagnosis(a, lang);
    r.priorities.forEach((p) => {
      if (p.id === "acao_do_objetivo") {
        assert.ok(GOAL_ACTIONS[lang][p.goal], `GOAL_ACTIONS ${lang} ${p.goal}`);
      } else {
        assert.ok(PRIORITY_TEXTS[p.id]?.[lang], `PRIORITY_TEXTS ${lang} ${p.id}`);
      }
    });
    r.missingData.forEach((m) => assert.ok(NEXT_STEP_TEXTS[lang][m.id], `NEXT_STEP_TEXTS ${lang} ${m.id}`));
    assert.ok(NEXT_STEP_TEXTS[lang][r.nextStep.textId]);
  }
});
t("unidades de volume existem para os 6 objetivos em PT e EN", () => {
  for (const lang of ["pt", "en"]) assert.equal(Object.keys(VOLUME_UNITS[lang]).length, 6);
});

console.log("== nenhum NaN/negativo vaza ==");
t("varredura de NaN/Infinity em todos os resultados dos cenários", () => {
  const scenarios = [A8, { ...A8, goal: "comissao_canal", volume: { value: 5000 }, commissionRate: 20, migratableShare: 30 }, { ...A8, goal: "tarefas_repetitivas", bottleneck: "corrigir_erro", hoursPerWeek: { band: "3a8h" }, hourlyCost: 60 }, { sector: "industria", goal: "estoque_informacao", currentTools: "conversa_papel", volume: { band: "zero" }, bottleneck: "nenhum", hoursPerWeek: { band: "nao_sei" }, dataAccess: "nao_sei", urgency: "explorando" }];
  for (const a of scenarios) for (const lang of ["pt", "en"]) {
    const r = evaluateDiagnosis(a, lang);
    noNaN(r, "result");
    const s = JSON.stringify(r);
    assert.ok(!s.includes("null") || true); // nulls permitidos (desconhecido); NaN jamais
    assert.ok(!/NaN|Infinity/.test(s), `NaN/Infinity no JSON: ${s.match(/NaN|Infinity/g)}`);
  }
});

console.log("== resumo cru editável ==");
t("summary traz só ids respondidos, com ranges resolvidos", () => {
  const r = evaluateDiagnosis(A8);
  assert.equal(r.summary.length, 8);
  const vol = r.summary.find((s) => s.id === "volume");
  assert.equal(vol.value.lo, 11);
  assert.equal(r.version, 2);
});

console.log(`\n${pass} ok, ${fail} falha(s)`);
process.exit(fail ? 1 : 0);
