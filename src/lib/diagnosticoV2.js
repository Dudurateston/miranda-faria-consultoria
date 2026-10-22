/**
 * diagnosticoV2.js (motor) — Etapa 1: funções PURAS, determinísticas e sem UI.
 * Contrato (plano 2026-10-22, aprovado):
 *   getDiagnosisQuestions(answers, lang) → lista ordenada {id,type,required,dependsOn,unit?,options?}
 *   pruneAnswers(answers, changedId)    → remove SOMENTE respostas condicionadas ao que mudou
 *   evaluateDiagnosis(answers, lang)   → {version,summary,priorities,estimate,missingData,nextStep}
 *
 * Regras mínimas:
 *  - informação inacessível/inconsistente vem antes de automação dependente dela;
 *  - retrabalho manual recorrente leva a mapeamento e organização da rotina;
 *  - objetivo define ação específica posterior;
 *  - rotina integrada + dados confiáveis + sem retrabalho relevante → uma única
 *    prioridade de acompanhamento/validação, sem inventar problema;
 *  - urgência ajusta plano/próximo passo, nunca valor;
 *  - unknown é null, nunca 0; zero informado é 0 válido;
 *  - recusa NaN/Infinity/negativo/percentual fora de 0–100 (vira null = desconhecido);
 *  - sem estimativa sem dados; sem benchmark individual; 4,33 semanas/mês explícitas;
 *  - comissão: receita × taxa × parcela = BRUTA; custos novos desconhecidos impedem
 *    afirmar economia líquida; sem soma de perdas sobrepostas (um cálculo por caminho).
 *
 * NÃO importa nada de diagnostico.js (legado intocado). NÃO grava dados, NÃO toca RLS.
 * Import relativo (não "@/"): o teste puro roda direto em node, sem Vite.
 */

import {
  VERSION,
  QUESTIONS_V2,
  VOLUME_BANDS,
  VOLUME_BANDS_CURRENCY,
  HOURS_BANDS,
  VOLUME_UNITS,
  PRIORITY_TEXTS,
  GOAL_ACTIONS,
} from "../content/diagnosticoV2.js";

export { VERSION };

/* ───────────────────────── saneamento (unknown ≠ 0) ───────────────────────── */

const isNum = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;

/** número válido ≥ 0, senão null (desconhecido). Zero é válido. */
export const num = (v) => (isNum(v) ? v : null);

/** percentual 0–100 válido, senão null. */
export const pct = (v) => (isNum(v) && v <= 100 ? v : null);

const bandById = (bands, id) => bands.find((b) => b.id === id) || null;

/** hoursPerWeek vira {lo,hi} numérico; 'nao_sei' ou ausente = null (desconhecido). */
export function hoursRange(answers) {
  const h = answers.hoursPerWeek;
  if (!h) return null;
  if (isNum(h.value)) return { lo: h.value, hi: h.value };
  if (h.band == null || h.band === "nao_sei") return null;
  const b = bandById(HOURS_BANDS, h.band);
  return b ? { ...b } : null;
}

/** volume vira {lo,hi,unit,period,currency?}; valor exato > banda; sem ambos = null. */
export function volumeRange(answers, lang = "pt") {
  const goal = answers.goal;
  if (!goal) return null;
  const unitCfg = (VOLUME_UNITS[lang] || VOLUME_UNITS.pt)[goal];
  if (!unitCfg) return null;
  const v = answers.volume;
  if (!v) return null;
  if (isNum(v.value)) return { lo: v.value, hi: v.value, unit: unitCfg.unit, period: unitCfg.period, ...(unitCfg.currency ? { currency: true } : {}) };
  const b = bandById(unitCfg.currency ? VOLUME_BANDS_CURRENCY : VOLUME_BANDS, v.band);
  if (!b) return null;
  return { lo: b.lo, hi: b.hi, unit: unitCfg.unit, period: unitCfg.period, ...(unitCfg.currency ? { currency: true } : {}) };
}

/* ───────────────────────── grafo de dependência ───────────────────────── */

const MAIN_IDS = ["sector", "goal", "currentTools", "volume", "bottleneck", "hoursPerWeek", "dataAccess", "urgency"];
const CONDITIONAL_IDS = ["hourlyCost", "commissionRate", "migratableShare"];
export const ANSWER_IDS = [...MAIN_IDS, ...CONDITIONAL_IDS];

const DEPENDS = {
  sector: [],
  goal: [],
  currentTools: ["goal"],
  volume: ["goal"],
  bottleneck: ["goal"],
  hoursPerWeek: ["bottleneck"],
  dataAccess: [],
  urgency: [],
  hourlyCost: ["hoursPerWeek"],
  commissionRate: ["goal"],
  migratableShare: ["commissionRate"],
};

/** A complementar se aplica? (condições declarativas + regra de tempo conhecido) */
function applies(q, answers) {
  if (!q.applyIf) return true;
  const { goal = null, hoursKnown = null } = q.applyIf;
  if (goal && !goal.includes(answers.goal)) return false;
  if (hoursKnown !== null && (hoursRange(answers) != null) !== hoursKnown) return false;
  return true;
}

/**
 * Lista ordenada de perguntas para o estado atual (8 principais + complementares
 * aplicáveis). Unidade do volume derivada do objetivo, quando existir. Progresso
 * e fase derivam desta lista; nenhum timer, avanço só por confirmação (Etapa 2).
 */
export function getDiagnosisQuestions(answers = {}, lang = "pt") {
  const all = QUESTIONS_V2[lang] || QUESTIONS_V2.pt;
  const order = [...MAIN_IDS, "hourlyCost", "commissionRate", "migratableShare"];
  return all
    .filter((q) => applies(q, answers))
    .map((q) => {
      const out = { id: q.id, type: q.type, required: q.required, dependsOn: q.dependsOn };
      if (q.title) out.title = q.title;
      if (q.hint) out.hint = q.hint;
      if (q.unit) out.unit = q.unit;
      if (q.options) out.options = q.options;
      if (q.applyIf) out.applyIf = q.applyIf;
      if (q.id === "volume" || q.id === "hoursPerWeek") out.approximate = true;
      if (q.id === "volume" && answers.goal) {
        const u = (VOLUME_UNITS[lang] || VOLUME_UNITS.pt)[answers.goal];
        if (u) {
          out.unit = u.unit;
          out.period = u.period;
          out.currency = !!u.currency;
        }
      }
      return out;
    })
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

/**
 * Mudou setor/objetivo/outra resposta: invalida SOMENTE o que depende dela
 * (cadeia transitiva) e as complementares que deixaram de se aplicar.
 * dataAccess, urgency, sector e goal sobrevivem a troca de goal, por exemplo.
 */
export function pruneAnswers(answers, changedId) {
  const out = { ...answers };
  if (!DEPENDS[changedId]) return out;
  const doomed = new Set([changedId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const id of ANSWER_IDS) {
      if (!doomed.has(id) && DEPENDS[id].some((d) => doomed.has(d))) {
        doomed.add(id);
        grew = true;
      }
    }
  }
  for (const id of doomed) if (id !== changedId) delete out[id];
  for (const id of CONDITIONAL_IDS) {
    if (out[id] == null) continue;
    const q = QUESTIONS_V2.pt.find((x) => x.id === id);
    if (!q || !applies(q, out)) delete out[id];
  }
  return out;
}

/* ───────────────────────── prioridades (≤ 3, únicas) ───────────────────────── */

const P = (id, reasonAnswerIds, extra = {}) => ({ id, reasonAnswerIds, ...extra });

/**
 * Ordem explícita: (1) organizar informação quando ela bloqueia a solução;
 * (2) a etapa elegível do gargalo declarado, ou a ação específica do objetivo;
 * (3) acompanhar indicadores. Cenário saudável = 1 prioridade de validação.
 */
function buildPriorities(a, est) {
  const unreliable = ["precisam_conferencia", "uma_pessoa_sabe", "nao_sei"].includes(a.dataAccess);
  const hrs = hoursRange(a);
  const rework = ["redigitar", "corrigir_erro"].includes(a.bottleneck);
  const search = a.bottleneck === "procurar_conferir";
  const waiting = a.bottleneck === "esperar_alguem";

  /* rotina integrada + dados confiáveis + sem retrabalho/tempo relevante:
     acompanhamento/validação — NÃO inventamos problema. */
  if (a.currentTools === "sistemas_integrados" && !unreliable && a.bottleneck === "nenhum" && (!hrs || hrs.lo === 0)) {
    return [P("acompanhar_validar", ["currentTools", "dataAccess", "bottleneck"])];
  }

  const ps = [];
  if (unreliable) ps.push(P("organizar_informacao", ["dataAccess"]));
  if (rework) ps.push(P("mapear_retrabalho", ["bottleneck", "currentTools", ...(hrs ? ["hoursPerWeek"] : [])]));
  if (search) ps.push(P("organizar_consulta_dados", ["bottleneck", "dataAccess"]));
  if (waiting) ps.push(P("destravar_gargalo_pessoa", ["bottleneck", "dataAccess"]));
  if (a.goal === "comissao_canal" && est && est.kind === "comissao_bruta") {
    ps.push(P("avaliar_migracao_canal", ["goal", "volume", "commissionRate", "migratableShare"]));
  }
  if (!rework && !search && !waiting && a.goal) {
    ps.push(P("acao_do_objetivo", ["goal", "currentTools"], { goal: a.goal }));
  }
  ps.push(P("acompanhar_indicadores", ["volume", "hoursPerWeek"]));

  const seen = new Set();
  return ps.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true))).slice(0, 3);
}

/* ───────────────────────── estimativa (null quando falta dado) ───────────────────────── */

export const WEEKS_PER_MONTH = 4.33; /* explícito no resultado, nunca implícito */
const round2 = (v) => Math.round(v * 100) / 100;

function estimate(a, lang) {
  const hrs = hoursRange(a);
  const cost = num(a.hourlyCost);

  /* tempo declarado: horas/mês com 4,33 semanas; dinheiro SÓ com custo informado */
  if (hrs && (hrs.lo > 0 || hrs.hi > 0)) {
    const hoursPerMonth = { lo: round2(hrs.lo * WEEKS_PER_MONTH), hi: hrs.hi == null ? null : round2(hrs.hi * WEEKS_PER_MONTH) };
    const out = {
      kind: "tempo",
      weeksPerMonth: WEEKS_PER_MONTH,
      hoursPerWeek: hrs,
      hoursPerMonth,
      formulaId: cost != null && cost > 0 ? "horas_custo" : "horas_mes",
      inputs: [{ id: "hoursPerWeek", value: hrs }],
      caveatId: cost != null && cost > 0 ? "custo_do_tempo" : "so_tempo",
    };
    if (cost != null && cost > 0) {
      out.costPerMonth = { lo: round2(hoursPerMonth.lo * cost), hi: hoursPerMonth.hi == null ? null : round2(hoursPerMonth.hi * cost) };
      out.inputs.push({ id: "hourlyCost", value: cost, currency: true });
    }
    return out;
  }

  /* canal com comissão: BRUTA = receita mensal × taxa × parcela; NADA sem as 3 entradas */
  if (a.goal === "comissao_canal") {
    const vol = volumeRange(a, lang);
    const rate = pct(a.commissionRate);
    const share = pct(a.migratableShare);
    if (vol && rate != null && share != null) {
      return {
        kind: "comissao_bruta",
        grossPerMonth: {
          lo: round2(vol.lo * (rate / 100) * (share / 100)),
          hi: vol.hi == null ? null : round2(vol.hi * (rate / 100) * (share / 100)),
        },
        formulaId: "comissao_bruta",
        inputs: [
          { id: "volume", value: vol },
          { id: "commissionRate", value: rate, unit: "%" },
          { id: "migratableShare", value: share, unit: "%" },
        ],
        caveatId: "bruta_nao_liquida",
      };
    }
    return null;
  }

  return null;
}

/* ───────────────────────── avaliação completa ───────────────────────── */

/**
 * evaluateDiagnosis(answers, lang):
 *  - summary: contexto informado, cru, editável (UI localiza por id);
 *  - priorities: ≤ 3 {id, reasonAnswerIds, goal?}; textos resolvíveis por
 *    PRIORITY_TEXTS[id][lang] ou GOAL_ACTIONS[goal][lang] quando id=acao_do_objetivo;
 *  - estimate: null quando faltam dados (nunca inventa);
 *  - missingData: o que medir (textos em NEXT_STEP_TEXTS por id);
 *  - nextStep: {id, textId, relatedServiceId} — urgência ajusta plano, não valor.
 */
export function evaluateDiagnosis(answers = {}, lang = "pt") {
  const a = { ...answers };
  const summary = ANSWER_IDS.filter((id) => a[id] != null && a[id] !== "").map((id) => ({
    id,
    value:
      id === "volume"
        ? volumeRange(a, lang)
        : id === "hoursPerWeek"
          ? hoursRange(a)
          : id === "hourlyCost" || id === "commissionRate" || id === "migratableShare"
            ? num(a[id])
            : a[id],
  }));

  const est = estimate(a, lang);
  const priorities = buildPriorities(a, est);

  const missingData = [];
  const hrs = hoursRange(a);
  const hasRework = ["redigitar", "corrigir_erro"].includes(a.bottleneck) || a.goal === "tarefas_repetitivas";
  if (hasRework && !hrs) missingData.push({ id: "medir_horas", why: "hoursPerWeek" });
  if (hasRework && hrs && num(a.hourlyCost) == null) missingData.push({ id: "informar_custo_hora", why: "hourlyCost" });
  if (a.goal === "comissao_canal") {
    if (pct(a.commissionRate) == null) missingData.push({ id: "informar_taxa", why: "commissionRate" });
    if (pct(a.migratableShare) == null) missingData.push({ id: "informar_parcela", why: "migratableShare" });
  }

  const nextId = a.urgency === "agora" ? "conversar" : a.urgency === "explorando" ? "explorando" : "planejar";

  return {
    version: VERSION,
    summary,
    priorities,
    estimate: est,
    missingData,
    nextStep: { id: nextId, textId: missingData.length ? "falta_dados" : nextId, relatedServiceId: a.goal || null },
  };
}
