/**
 * diagnosticoV2.js (motor) — Etapa 1: funções PURAS, determinísticas e sem UI.
 * Contrato (plano 2026-10-22, aprovado + revisão Codex 22/10):
 *   getDiagnosisQuestions(answers, lang) → lista ordenada {id,type,required,dependsOn,unit?,options?}
 *   pruneAnswers(answers, changedId)    → remove SOMENTE respostas condicionadas ao que mudou
 *   evaluateDiagnosis(answers, lang)   → {version,summary,priorities,estimate,missingData,nextStep}
 *
 * Regras (plano + revisão):
 *  - unknown é null, nunca 0; zero informado é 0 válido (inclusive custo/hora 0);
 *  - recusa NaN/Infinity/negativo/pct fora 0–100 (vira null = desconhecido);
 *  - dinheiro exige moeda EXPLÍCITA em BRL/EUR/GBP/USD; sem moeda não calcula;
 *  - cálculo do RAMO tem prioridade (comissao_canal calcula comissão, nunca tempo);
 *  - nenhum resultado não-finito: qualquer estouro vira estimate null;
 *  - 'nao_sei' em dataAccess NÃO afirma desorganização → recomenda verificar;
 *    cenário saudável exige valor confiável EXPLÍCITO;
 *  - a ação específica do objetivo SEMPRE aparece dentro das ≤ 3 prioridades;
 *  - prioridades por dependência: informação antes de automação; retrabalho →
 *    mapeamento; urgência ajusta plano/próximo passo, nunca valor;
 *  - comissão: receita × taxa × parcela = BRUTA; custos novos desconhecidos
 *    impedem afirmar economia líquida; um cálculo por caminho, sem somar;
 *  - horas/mês com 4,33 semanas explícitas; sem estimativa sem dados.
 *
 * NÃO importa nada de diagnostico.js (legado intocado). NÃO grava dados, NÃO toca RLS.
 * Import relativo com extensão: teste puro roda direto em node, sem Vite.
 */

import {
  VERSION,
  QUESTIONS_V2,
  VOLUME_BANDS,
  VOLUME_BANDS_CURRENCY,
  HOURS_BANDS,
  VOLUME_UNITS,
  CURRENCIES,
} from "../content/diagnosticoV2.js";

export { VERSION };

/* ───────────────────────── saneamento (unknown ≠ 0) ───────────────────────── */

const isNum = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;

/** número válido ≥ 0, senão null (desconhecido). Zero é válido. */
export const num = (v) => (isNum(v) ? v : null);

/** percentual 0–100 válido, senão null. */
export const pct = (v) => (isNum(v) && v <= 100 ? v : null);

/** moeda explícita e suportada, senão null. */
export const currencyOf = (v) => (typeof v === "string" && CURRENCIES.includes(v) ? v : null);

/** true se TODOS os números do objeto são finitos (impede Infinity vazar como null no JSON). */
export const allFinite = (v) => {
  if (typeof v === "number") return Number.isFinite(v);
  if (Array.isArray(v)) return v.every(allFinite);
  if (v && typeof v === "object") return Object.values(v).every(allFinite);
  return true;
};

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

/**
 * volume vira {lo,hi,unit,period,currency?,currencyCode?}; valor exato > banda;
 * sem ambos = null. No canal com comissão, currencyCode só existe com moeda
 * explícita válida — dinheiro sem moeda não é calculado.
 */
export function volumeRange(answers, lang = "pt") {
  const goal = answers.goal;
  if (!goal) return null;
  const unitCfg = (VOLUME_UNITS[lang] || VOLUME_UNITS.pt)[goal];
  if (!unitCfg) return null;
  const v = answers.volume;
  if (!v) return null;
  const base = unitCfg.currency
    ? { unit: unitCfg.unit, period: unitCfg.period, currency: true }
    : { unit: unitCfg.unit, period: unitCfg.period };
  const range =
    isNum(v.value)
      ? { lo: v.value, hi: v.value }
      : (() => {
          const b = bandById(unitCfg.currency ? VOLUME_BANDS_CURRENCY : VOLUME_BANDS, v.band);
          return b ? { lo: b.lo, hi: b.hi } : null;
        })();
  if (!range) return null;
  const out = { ...range, ...base };
  if (unitCfg.currency) {
    const code = currencyOf(v.currency);
    if (code) out.currencyCode = code;
  }
  return out;
}

/** custo/hora: {value, currency} com value ≥ 0 válido (0 = zero legítimo). */
export function costOf(answers) {
  const h = answers.hourlyCost;
  if (h == null) return { value: null, currency: null };
  const value = num(typeof h === "object" ? h.value : h);
  const currency = currencyOf(typeof h === "object" ? h.currency : null);
  return { value, currency };
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
 * Mudou uma resposta: invalida SOMENTE o que depende dela (cadeia transitiva)
 * e as complementares que deixaram de se aplicar. dataAccess, urgency, sector e
 * goal sobrevivem a troca de goal, por exemplo.
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
 * Ordem explícita: (1) camada de informação — CONFIRMADA problemática →
 * organizar; 'nao_sei' → VERIFICAR, sem afirmar desorganização;
 * (2) etapa elegível do gargalo declarado;
 * (3) ação específica do objetivo — SEMPRE presente quando há objetivo;
 * (4) acompanhar indicadores, se couber.
 * Cenário saudável exige valor confiável EXPLÍCITO
 * (atualizadas_compartilhadas) e nenhum retrabalho/tempo relevante →
 * 1 prioridade de validação. Nada inventado, nada preenchido à força.
 */
function buildPriorities(a, est) {
  const hrs = hoursRange(a);
  const rework = ["redigitar", "corrigir_erro"].includes(a.bottleneck);
  const search = a.bottleneck === "procurar_conferir";
  const waiting = a.bottleneck === "esperar_alguem";

  /* saudável: só com dado confiável explícito; 'nao_sei'/ausente não é saudável.
     Exceção NÃO apaga objetivo de comissão: escolher canal com taxa é um objetivo
     legítimo mesmo com rotina integrada e sem retrabalho (revisão Codex). */
  if (a.dataAccess === "atualizadas_compartilhadas" && a.currentTools === "sistemas_integrados" && a.bottleneck === "nenhum" && (!hrs || hrs.lo === 0) && a.goal !== "comissao_canal") {
    return [P("acompanhar_validar", ["currentTools", "dataAccess", "bottleneck"])];
  }

  const ps = [];
  if (a.dataAccess === "nao_sei") ps.push(P("verificar_informacao", ["dataAccess"]));
  else if (["precisam_conferencia", "uma_pessoa_sabe"].includes(a.dataAccess)) ps.push(P("organizar_informacao", ["dataAccess"]));

  if (rework) ps.push(P("mapear_retrabalho", ["bottleneck", "currentTools", ...(hrs ? ["hoursPerWeek"] : []), ...(a.goal ? ["goal"] : [])], a.goal ? { goal: a.goal } : {}));
  if (search) ps.push(P("organizar_consulta_dados", ["bottleneck", "dataAccess"]));
  if (waiting) ps.push(P("destravar_gargalo_pessoa", ["bottleneck", "dataAccess"]));

  if (a.goal === "comissao_canal" && est && est.kind === "comissao_bruta") {
    ps.push(P("avaliar_migracao_canal", ["goal", "volume", "commissionRate", "migratableShare"]));
  }

  /* ação específica do objetivo: SEMPRE dentro das ≤ 3 (não some com retrabalho) */
  if (a.goal) ps.push(P("acao_do_objetivo", ["goal", "currentTools"], { goal: a.goal }));

  ps.push(P("acompanhar_indicadores", ["volume", "hoursPerWeek"]));

  const seen = new Set();
  return ps.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true))).slice(0, 3);
}

/* ───────────────────────── estimativa (null quando falta dado) ───────────────────────── */

export const WEEKS_PER_MONTH = 4.33; /* explícito no resultado, nunca implícito */
const round2 = (v) => Math.round(v * 100) / 100;

function estimate(a, lang) {
  /* RAMO PRIMEIRO: canal com comissão calcula comissão, nunca tempo, sem somar */
  if (a.goal === "comissao_canal") {
    const vol = volumeRange(a, lang);
    const rate = pct(a.commissionRate);
    const share = pct(a.migratableShare);
    if (vol && vol.currencyCode && rate != null && share != null) {
      const out = {
        kind: "comissao_bruta",
        grossPerMonth: {
          lo: round2(vol.lo * (rate / 100) * (share / 100)),
          hi: vol.hi == null ? null : round2(vol.hi * (rate / 100) * (share / 100)),
          currency: vol.currencyCode,
        },
        formulaId: "comissao_bruta",
        inputs: [
          { id: "volume", value: { lo: vol.lo, hi: vol.hi }, currency: vol.currencyCode },
          { id: "commissionRate", value: rate, unit: "%" },
          { id: "migratableShare", value: share, unit: "%" },
        ],
        caveatId: "bruta_nao_liquida",
      };
      return allFinite(out) ? out : null; /* 1e308×4 nunca vira Infinity silencioso */
    }
    return null;
  }

  /* tempo declarado: horas/mês com 4,33 semanas; dinheiro SÓ com custo E moeda */
  const hrs = hoursRange(a);
  if (hrs && (hrs.lo > 0 || hrs.hi > 0)) {
    const { value: cost, currency } = costOf(a);
    const hoursPerMonth = { lo: round2(hrs.lo * WEEKS_PER_MONTH), hi: hrs.hi == null ? null : round2(hrs.hi * WEEKS_PER_MONTH) };
    const out = {
      kind: "tempo",
      weeksPerMonth: WEEKS_PER_MONTH,
      hoursPerWeek: hrs,
      hoursPerMonth,
      formulaId: "horas_mes",
      inputs: [{ id: "hoursPerWeek", value: hrs }],
      caveatId: "so_tempo",
    };
    if (cost != null && currency) {
      /* custo/hora 0 é zero legítimo, não desconhecido */
      out.costPerMonth = {
        lo: round2(hoursPerMonth.lo * cost),
        hi: hoursPerMonth.hi == null ? null : round2(hoursPerMonth.hi * cost),
        currency,
      };
      out.formulaId = "horas_custo";
      out.caveatId = "custo_do_tempo";
      out.inputs.push({ id: "hourlyCost", value: cost, currency });
    }
    return allFinite(out) ? out : null;
  }

  return null;
}

/* ───────────────────────── avaliação completa ───────────────────────── */

/**
 * evaluateDiagnosis(answers, lang):
 *  - summary: contexto informado, cru, editável (UI localiza por id; percentuais
 *    e moedas saneados — 150% não entra como valor válido);
 *  - priorities: ≤ 3 {id, reasonAnswerIds, goal?}; textos resolvíveis por
 *    PRIORITY_TEXTS[id][lang] ou GOAL_ACTIONS[goal][lang] quando id=acao_do_objetivo;
 *  - estimate: null quando faltam dados (nunca inventa; nunca não-finito);
 *  - missingData: o que medir (textos em NEXT_STEP_TEXTS por id);
 *  - nextStep: {id, textId, relatedServiceId} — ids de texto EXISTENTES em PT/EN.
 */
export function evaluateDiagnosis(answers = {}, lang = "pt") {
  const a = { ...answers };
  const summary = ANSWER_IDS.filter((id) => a[id] != null && a[id] !== "").map((id) => {
    if (id === "volume") return { id, value: volumeRange(a, lang) };
    if (id === "hoursPerWeek") return { id, value: hoursRange(a) };
    if (id === "hourlyCost") {
      const c = costOf(a);
      return { id, value: c.value == null ? null : { value: c.value, ...(c.currency ? { currency: c.currency } : {}) } };
    }
    if (id === "commissionRate" || id === "migratableShare") return { id, value: pct(a[id]) };
    return { id, value: a[id] };
  });

  const est = estimate(a, lang);
  const priorities = buildPriorities(a, est);

  const missingData = [];
  const hrs = hoursRange(a);
  const hasRework = ["redigitar", "corrigir_erro"].includes(a.bottleneck) || a.goal === "tarefas_repetitivas";
  /* faltantes de TEMPO só fora do ramo de comissão: o cálculo do ramo é a
     comissão; não misturamos custo/hora do ramo de tarefas (revisão Codex). */
  if (a.goal !== "comissao_canal") {
    if (hasRework && !hrs) missingData.push({ id: "medir_horas", why: "hoursPerWeek" });
    if (hasRework && hrs) {
      const { value: cost, currency } = costOf(a);
      if (cost == null) missingData.push({ id: "informar_custo_hora", why: "hourlyCost" });
      else if (!currency) missingData.push({ id: "informar_moeda", why: "hourlyCost" });
    }
  }
  if (a.goal === "comissao_canal") {
    const vol = volumeRange(a, lang);
    if (!vol) missingData.push({ id: "informar_receita", why: "volume" });
    else if (!vol.currencyCode) missingData.push({ id: "informar_moeda", why: "volume" });
    if (pct(a.commissionRate) == null) missingData.push({ id: "informar_taxa", why: "commissionRate" });
    if (pct(a.migratableShare) == null) missingData.push({ id: "informar_parcela", why: "migratableShare" });
  }

  const nextId = a.urgency === "agora" ? "conversar" : a.urgency === "explorando" ? "explorar" : "planejar";

  return {
    version: VERSION,
    summary,
    priorities,
    estimate: est,
    missingData,
    nextStep: { id: nextId, textId: missingData.length ? "falta_dados" : nextId, relatedServiceId: a.goal || null },
  };
}
