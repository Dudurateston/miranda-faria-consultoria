import React, { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL_BARE, EMAIL, CALENDLY_URL } from "@/lib/site";
import {
  QUESTIONS_V2,
  PRIORITY_TEXTS,
  GOAL_ACTIONS,
  NEXT_STEP_TEXTS,
  UI_TEXTS,
  VOLUME_BAND_LABELS,
  VOLUME_BANDS,
  VOLUME_BANDS_CURRENCY,
  CURRENCIES,
} from "@/content/diagnosticoV2";
import { getDiagnosisQuestions, pruneAnswers, evaluateDiagnosis } from "@/lib/diagnosticoV2";

/**
 * Diagnóstico v2 — Etapa 2 (plano aprovado 22/10 + revisões Codex).
 *
 * Um questionário ramificado: 8–10 perguntas conforme o caminho, uma por
 * tela, com Continuar explícito, Voltar, revisão das respostas e reinício.
 * O resultado PRINCIPAL são até três prioridades com o que fazer, por quê,
 * pré-requisito e como medir; a estimativa é complemento — nunca a manchete.
 *
 * LOCAL/PRÉVIA por definição desta etapa:
 *  - SEM SDK, SEM gravação em DiagnosticoLead, SEM analytics de produção,
 *    SEM backend/API paga: ESTE componente não faz nenhum write próprio
 *    (o shell do app mantém o analytics/consentimento usual dele);
 *  - diagnostico.js (legado) permanece no repositório, não importado;
 *  - contato OPCIONAL pós-resultado: PT WhatsApp / EN Calendly + email
 *    exato. São links — nada é enviado automaticamente.
 *
 * unknown ≠ 0: "Não sei"/campo vazio é desconhecido (null), nunca zero;
 * zero informado é zero válido. Dinheiro exige moeda explícita.
 */

const isNum = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;
const nf = (lang, v) =>
  v == null ? "" : v.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 2 });
/* intervalo sem travessão: PT "12 a 52", EN "12 to 52" (preferência do Eduardo) */
const jr = (lang, lo, hi) => (hi === lo ? nf(lang, lo) : hi == null ? `${nf(lang, lo)}+` : `${nf(lang, lo)} ${lang === "pt" ? "a" : "to"} ${nf(lang, hi)}`);

export default function Insights() {
  const { lang } = useLang();
  const ui = UI_TEXTS[lang];
  usePageTitle(ui.label, "insights");

  const [answers, setAnswers] = useState({});
  const [editIdx, setEditIdx] = useState(null); // índice em answeredIds ao editar/voltar
  const [screen, setScreen] = useState("flow"); // flow | review | result
  const [draft, setDraft] = useState({}); // rascunho de entrada corrente (não perde texto em erro)
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState("");
  const qRef = useRef(null);
  const revTitleRef = useRef(null);
  const resTitleRef = useRef(null);

  const qs = useMemo(() => getDiagnosisQuestions(answers, lang), [answers, lang]);
  const qById = useMemo(() => {
    const m = {};
    (QUESTIONS_V2[lang] || []).forEach((q) => (m[q.id] = q));
    return m;
  }, [lang]);

  /* próxima pergunta ainda não respondida: chave AUSENTE = não cometida;
     chave com null = respondida "não sei" (unknown ≠ não respondida). */
  const nextUnanswered = useMemo(() => qs.find((q) => answers[q.id] === undefined) || null, [qs, answers]);

  /* perguntas respondidas da LISTA ATIVA, na ordem do qs — fonte única de
     navegação, revisão, resumo e progresso. Sem ids duplicados/inativos. */
  const answeredIds = useMemo(() => qs.filter((q) => answers[q.id] !== undefined).map((q) => q.id), [qs, answers]);
  const currentId = screen === "flow" ? (editIdx != null ? answeredIds[editIdx] : nextUnanswered?.id) : null;
  const current = currentId ? qs.find((q) => q.id === currentId) || null : null;

  /* rascunho da pergunta corrente: inicializado da resposta existente */
  useEffect(() => {
    setError("");
    if (!current) return;
    const a = answers[current.id];
    if (current.type === "volume") {
      setDraft((d) => ({
        ...d,
        [current.id]: {
          band: a?.band ?? null,
          value: a?.value != null ? String(a.value) : "",
          currency: a?.currency ?? "",
          unknown: a === null,
        },
      }));
    } else if (current.type === "hours") {
      setDraft((d) => ({ ...d, [current.id]: { band: a?.band ?? (a === null ? "nao_sei" : null), value: a?.value != null ? String(a.value) : "" } }));
    } else if (current.type === "choice") {
      /* rascunho SEMPRE inicializa da resposta válida: pick antigo não sobrevive
         a Voltar/Editar após prune */
      setDraft((d) => ({ ...d, [current.id]: { pick: a != null ? a : null } }));
    } else if (current.type === "currency") {
      setDraft((d) => ({ ...d, [current.id]: { value: a?.value != null ? String(a.value) : "", currency: a?.currency ?? "" } }));
    } else if (current.type === "percent") {
      setDraft((d) => ({ ...d, [current.id]: { value: a != null ? String(a) : "" } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, screen]);

  /* foco na pergunta nova; entrada em revisão e resultado também anuncia
     o título (leitor de tela sabe que a tela mudou) */
  useEffect(() => {
    if (screen === "flow" && qRef.current) qRef.current.focus({ preventScroll: false });
    if (screen === "review" && revTitleRef.current) revTitleRef.current.focus({ preventScroll: false });
    if (screen === "result" && resTitleRef.current) resTitleRef.current.focus({ preventScroll: false });
  }, [currentId, screen]);

  const result = useMemo(() => (screen === "result" ? evaluateDiagnosis(answers, lang) : null), [screen, answers, lang]);

  /* serviço relacionado SÓ quando há gargalo declarado (cenário saudável
     não empurra compra). Rotas reais: gestao, desenvolvimento, automacao. */
  const GARGALOS = ["redigitar", "procurar_conferir", "corrigir_erro", "esperar_alguem"];
  const SVC_BY_GOAL = {
    pedidos_vendas: "gestao",
    estoque_informacao: "gestao",
    continuidade_operacao: "gestao",
    comissao_canal: "gestao",
    atendimento_presenca: "desenvolvimento",
    tarefas_repetitivas: "automacao",
  };
  const svcSlug = GARGALOS.includes(answers.bottleneck) ? SVC_BY_GOAL[answers.goal] || null : null;

  const answerLabel = (id) => {
    const a = answers[id];
    const q = qById[id];
    if (a == null) return a === null ? ui.naoSeiVol : "";
    if (id === "volume") {
      const bands = q?.currency || (qs.find((x) => x.id === "volume")?.currency) ? VOLUME_BAND_LABELS[lang].currency : VOLUME_BAND_LABELS[lang].count;
      const bl = a.band ? bands[a.band] : null;
      const unit = (qs.find((x) => x.id === "volume")?.unit) || "";
      const per = (qs.find((x) => x.id === "volume")?.period) || "";
      const v = a.value != null ? `${nf(lang, a.value)}${a.currency ? ` ${a.currency}` : ""}` : bl != null ? `${bl}${a.currency ? ` ${a.currency}` : ""}` : ui.naoSeiVol;
      return `${v}${unit ? ` ${unit}` : ""}${per ? ` ${per}` : ""}`;
    }
    if (id === "hoursPerWeek") {
      if (a.value != null) return `${nf(lang, a.value)} ${ui.horasSemana}`;
      const bl = q?.options?.find((o) => o.id === a.band)?.label;
      return bl || "";
    }
    if (id === "hourlyCost") return a.value != null ? `${nf(lang, a.value)}${a.currency ? ` ${a.currency}` : ""}` : "";
    if (id === "commissionRate" || id === "migratableShare") return `${nf(lang, a)}%`;
    return q?.options?.find((o) => o.id === a)?.label || String(a);
  };

  /* ───────────────────────── validação e avanço ───────────────────────── */

  const commit = () => {
    if (!current) return;
    const id = current.id;
    const d = draft[id] || {};
    const parsed = d.value === "" ? null : Number(d.value);

    if (current.type === "choice") {
      const picked = d.pick != null ? d.pick : answers[id];
      if (current.required && picked == null) {
        setError(ui.erroObrigatorio);
        return;
      }
      advance(id, picked);
      return;
    }
    if (current.type === "volume") {
      if (d.unknown) {
        advance(id, null); // desconhecido explícito, nunca zero
        return;
      }
      const hasBand = d.band != null;
      if (!hasBand && parsed == null) {
        setError(current.required ? ui.erroObrigatorio : "");
        if (current.required) return;
        advance(id, null);
        return;
      }
      if (parsed != null && !isNum(parsed)) {
        setError(ui.erroNumero);
        return;
      }
      const currencyField = current.currency;
      if (currencyField && parsed != null && !d.currency) {
        setError(ui.erroMoeda);
        return;
      }
      const val = { ...(hasBand ? { band: d.band } : {}), ...(parsed != null ? { value: parsed } : {}), ...(currencyField && d.currency ? { currency: d.currency } : {}) };
      advance(id, val);
      return;
    }
    if (current.type === "hours") {
      const band = d.band === "nao_sei" ? null : d.band; // 'nao_sei' = desconhecido, nunca zero
      if (band == null && parsed == null) {
        advance(id, null); // opcional: desconhecido, nunca zero
        return;
      }
      if (parsed != null && !isNum(parsed)) {
        setError(ui.erroNumero);
        return;
      }
      advance(id, parsed != null ? { value: parsed } : { band });
      return;
    }
    if (current.type === "currency") {
      if (parsed == null && !d.currency) {
        advance(id, null); // opcional
        return;
      }
      if (parsed != null && !isNum(parsed)) {
        setError(ui.erroNumero);
        return;
      }
      if (parsed != null && !d.currency) {
        setError(ui.erroMoeda);
        return;
      }
      advance(id, parsed == null ? null : { value: parsed, currency: d.currency });
      return;
    }
    if (current.type === "percent") {
      if (parsed == null) {
        advance(id, null); // opcional
        return;
      }
      if (!isNum(parsed) || parsed > 100) {
        setError(ui.erroPercent);
        return;
      }
      advance(id, parsed);
      return;
    }
  };

  /** grava a resposta SÓ no Continuar; troca já dada invalida só os dependentes.
      Não há histórico paralelo: navegado, revisão, resumo e progresso derivam
      da lista ativa (qs × answers) — nunca de ids já podados. */
  const advance = (id, value) => {
    const changed = answers[id] != null && JSON.stringify(answers[id]) !== JSON.stringify(value);
    const pruned = changed ? pruneAnswers(answers, id) : answers;
    const newAnswers = { ...pruned, [id]: value };
    /* rascunhos dos dependentes podados saem junto com a resposta */
    const prunedIds = Object.keys(answers).filter((k) => !(k in pruned) && k !== id);
    setAnswers(newAnswers);
    if (prunedIds.length > 0) {
      setDraft((dr) => {
        const c = { ...dr };
        prunedIds.forEach((k) => delete c[k]);
        return c;
      });
    }
    setEditIdx(null); // segue para a próxima pergunta em aberto (ou revisão)
  };

  useEffect(() => {
    /* após gravar, decide a próxima tela */
    if (screen !== "flow") return;
    if (editIdx != null) return;
    if (nextUnanswered) return;
    setScreen("review");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, editIdx, nextUnanswered]);

  const back = () => {
    setError("");
    if (screen === "review") {
      setScreen("flow");
      setEditIdx(answeredIds.length > 0 ? answeredIds.length - 1 : null);
      return;
    }
    if (editIdx != null) {
      if (editIdx > 0) setEditIdx(editIdx - 1);
      return;
    }
    if (answeredIds.length > 0) setEditIdx(answeredIds.length - 1);
  };

  const restart = () => {
    setAnswers({});
    setEditIdx(null);
    setDraft({});
    setError("");
    setCopied(false);
    setSummary("");
    setScreen("flow");
  };

  const editAt = (idx) => {
    setEditIdx(idx);
    setScreen("flow");
  };

  /* ───────────────────────── resultado ───────────────────────── */

  useEffect(() => {
    if (screen !== "result") return;
    const L = UI_TEXTS[lang];
    const lines = [`${L.label} · Miranda Faria`];
    /* TODAS as respondidas da lista ativa entram — inclusive "Não sei"
       (desconhecido é contexto, não buraco) */
    answeredIds.forEach((id) => {
      const q = qById[id];
      if (q) lines.push(`• ${q.title}: ${answerLabel(id)}`);
    });
    if (result) {
      lines.push(`• ${L.prioridades}:`);
      result.priorities.forEach((p, i) => {
        const tx = p.id === "acao_do_objetivo" ? GOAL_ACTIONS[lang][p.goal] : PRIORITY_TEXTS[p.id]?.[lang];
        lines.push(`  ${i + 1}. ${p.id === "acao_do_objetivo" ? (qById.goal?.options?.find((o) => o.id === p.goal)?.label || "") + ": " : ""}${tx?.action || p.id}`);
      });
      const e = result.estimate;
      if (e?.kind === "tempo") {
        const h = e.hoursPerMonth;
        lines.push(`• ${L.estimativa}: ${jr(lang, h.lo, h.hi)} ${L.horasMes} (${L.semanas})`);
        if (e.costPerMonth) lines.push(`  ${L.custoTempo}: ${jr(lang, e.costPerMonth.lo, e.costPerMonth.hi)} ${e.costPerMonth.currency}${L.porMes}`);
      } else if (e?.kind === "comissao_bruta") {
        const g = e.grossPerMonth;
        lines.push(`• ${L.estimativa}: ${L.brutaResumo} ${jr(lang, g.lo, g.hi)} ${g.currency}${L.porMes} (${L.brutaNaoLiquida})`);
      }
    }
    setSummary(lines.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, lang, answers]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard indisponível: sem marcação */
    }
  };

  const waHref = `${WHATSAPP_URL_BARE}?text=${encodeURIComponent(lang === "pt" ? "Olá Eduardo. Fiz o diagnóstico no site e quero conversar sobre o plano." : "Hi Eduardo. I ran the diagnosis on the site and would like to talk about the plan.")}`;

  /* ───────────────────────── render ───────────────────────── */

  const total = qs.length;
  /* progresso honesto: posição da pergunta corrente NA LISTA ATIVA — nunca
     um número maior que o total por causa de histórico antigo */
  const stepNum = current ? Math.max(1, qs.findIndex((q) => q.id === current.id) + 1) : total;

  const renderQuestion = () => {
    if (!current) return null;
    const d = draft[current.id] || {};
    const opts = current.options || [];
    const volBands = current.currency ? VOLUME_BAND_LABELS[lang].currency : VOLUME_BAND_LABELS[lang].count;
    const bandSource = current.currency ? VOLUME_BANDS_CURRENCY : VOLUME_BANDS;

    return (
      <div className="mf-dg__panel" key={current.id}>
        <div className="mf-dg__qq" ref={qRef} tabIndex={-1}>
          <p className="mf-dg__q">{current.title}</p>
          {current.hint && <p className="mf-dg__hint">{current.hint}</p>}
        </div>

        {(current.type === "choice" || current.type === "hours") && (
          <div className="mf-dg__opts" role="radiogroup" aria-label={current.title}>
            {opts.map((o) => {
              const on = current.type === "hours" ? d.band === o.id : d.pick === o.id;
              return (
                <label key={o.id} className="mf-dg__opt" data-on={on}>
                  <input
                    type="radio"
                    name={`dg-${current.id}`}
                    className="mf-dg__radio"
                    checked={on}
                    value={o.id}
                    onChange={() => {
                      setError("");
                      if (current.type === "hours") setDraft((x) => ({ ...x, [current.id]: { ...d, band: o.id, value: "" } }));
                      else setDraft((x) => ({ ...x, [current.id]: { pick: o.id } }));
                    }}
                  />
                  <span className="mf-dg__optt">{o.label}</span>
                </label>
              );
            })}
            {current.type === "hours" && (
              <label className="mf-dg__field">
                <span className="mf-dg__flabel">{ui.valorExato}</span>
                <input
                  className="mf-dg__input"
                  type="number"
                  min="0"
                  step="0.5"
                  inputMode="decimal"
                  value={d.value || ""}
                  onChange={(e) => {
                    setError("");
                    setDraft((x) => ({ ...x, [current.id]: { ...d, value: e.target.value, band: null } }));
                  }}
                />
              </label>
            )}
          </div>
        )}

        {current.type === "volume" && (
          <div className="mf-dg__opts" role="radiogroup" aria-label={current.title}>
            {bandSource.map((b) => (
              <label key={b.id} className="mf-dg__opt" data-on={d.band === b.id}>
                <input
                  type="radio"
                  name={`dg-${current.id}`}
                  className="mf-dg__radio"
                  checked={d.band === b.id}
                  value={b.id}
                  onChange={() => {
                    setError("");
                    setDraft((x) => ({ ...x, [current.id]: { ...d, band: b.id, value: "", unknown: false } }));
                  }}
                />
                <span className="mf-dg__optt">{volBands[b.id]}</span>
                <span className="mf-dg__optd">{`${current.unit || ""} ${current.period || ""}`.trim()}</span>
              </label>
            ))}
            <label className="mf-dg__opt" data-on={d.unknown === true}>
              <input
                type="radio"
                name={`dg-${current.id}`}
                className="mf-dg__radio"
                checked={d.unknown === true}
                value="nao_sei_vol"
                onChange={() => {
                  setError("");
                  setDraft((x) => ({ ...x, [current.id]: { ...d, unknown: true, band: null, value: "" } }));
                }}
              />
              <span className="mf-dg__optt">{ui.naoSeiVol}</span>
            </label>
            <label className="mf-dg__field">
              <span className="mf-dg__flabel">{ui.valorExato}</span>
              <input
                className="mf-dg__input"
                type="number"
                min="0"
                inputMode="decimal"
                value={d.value || ""}
                onChange={(e) => {
                  setError("");
                  setDraft((x) => ({ ...x, [current.id]: { ...d, value: e.target.value, band: null, unknown: false } }));
                }}
              />
            </label>
            {current.currency && (
              <label className="mf-dg__field mf-dg__field--cur">
                <span className="mf-dg__flabel">{ui.moeda}</span>
                <select
                  className="mf-dg__input mf-dg__select"
                  value={d.currency || ""}
                  onChange={(e) => {
                    setError("");
                    setDraft((x) => ({ ...x, [current.id]: { ...d, currency: e.target.value } }));
                  }}
                >
                  <option value="">—</option>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        {current.type === "currency" && (
          <div className="mf-dg__opts mf-dg__opts--field">
            <label className="mf-dg__field">
              <span className="mf-dg__flabel">{current.title}</span>
              <input
                className="mf-dg__input"
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={d.value || ""}
                onChange={(e) => {
                  setError("");
                  setDraft((x) => ({ ...x, [current.id]: { ...d, value: e.target.value } }));
                }}
              />
            </label>
            <label className="mf-dg__field mf-dg__field--cur">
              <span className="mf-dg__flabel">{ui.moeda}</span>
              <select
                className="mf-dg__input mf-dg__select"
                value={d.currency || ""}
                onChange={(e) => {
                  setError("");
                  setDraft((x) => ({ ...x, [current.id]: { ...d, currency: e.target.value } }));
                }}
              >
                <option value="">—</option>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {current.type === "percent" && (
          <div className="mf-dg__opts mf-dg__opts--field">
            <label className="mf-dg__field">
              <span className="mf-dg__flabel">{current.title} ({current.unit})</span>
              <input
                className="mf-dg__input"
                type="number"
                min="0"
                max="100"
                step="0.5"
                inputMode="decimal"
                value={d.value || ""}
                onChange={(e) => {
                  setError("");
                  setDraft((x) => ({ ...x, [current.id]: { value: e.target.value } }));
                }}
              />
            </label>
          </div>
        )}

        {error && (
          <p className="mf-dg__error" role="alert">
            {error}
          </p>
        )}

        <div className="mf-dg__nav">
          <button type="button" className="mf-dg__back" onClick={back} disabled={screen === "flow" && editIdx == null && answeredIds.length === 0}>
            {ui.voltar}
          </button>
          <button type="button" className="mf-dg__go" onClick={commit}>
            {ui.continuar}
          </button>
        </div>
      </div>
    );
  };

  const renderReview = () => (
    <div className="mf-dg__panel">
      <p className="mf-dg__q" ref={revTitleRef} tabIndex={-1}>{ui.revisar}</p>
      <p className="mf-dg__hint">{ui.revisaoHint}</p>
      <ul className="mf-dg__rev">
        {answeredIds.map((id, i) => {
          const q = qById[id];
          if (!q) return null;
          return (
            <li key={id} className="mf-dg__revrow">
              <span className="mf-dg__revq">{q.title}</span>
              <span className="mf-dg__reva">{answerLabel(id)}</span>
              <button type="button" className="mf-dg__revedit" onClick={() => editAt(i)}>
                {ui.editar}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mf-dg__nav">
        <button type="button" className="mf-dg__back" onClick={back}>
          {ui.voltar}
        </button>
        <button type="button" className="mf-dg__go" onClick={() => setScreen("result")}>
          {ui.verResultado}
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    const e = result.estimate;
    return (
      <div className="mf-dg__panel mf-dg__panel--result">
        <h2 className="mf-dg__q" ref={resTitleRef} tabIndex={-1}>{ui.planoInicial}</h2>
        <p className="mf-dg__hint">{ui.planoIntro}</p>
        <ol className="mf-dg__prios">
          {result.priorities.map((p, i) => {
            const tx = p.id === "acao_do_objetivo" ? null : PRIORITY_TEXTS[p.id]?.[lang];
            const goalTx = p.id === "acao_do_objetivo" ? GOAL_ACTIONS[lang]?.[p.goal] : null;
            const title =
              p.id === "acao_do_objetivo"
                ? qById.goal?.options?.find((o) => o.id === p.goal)?.label || ""
                : tx?.title || "";
            const action = goalTx?.action || tx?.action || "";
            const prerequisite = p.id === "acao_do_objetivo" ? ui.acaoPrereq : tx?.prerequisite || "";
            const measure = goalTx?.measure || tx?.measure || "";
            return (
              <li key={p.id} className="mf-dg__prio">
                <span className="mf-dg__prion">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="mf-dg__priot">{title}</h3>
                  <p className="mf-dg__priolabel">{ui.prioridadeOque}</p>
                  <p className="mf-dg__priobody">{action}</p>
                  <p className="mf-dg__priolabel">{ui.prioridadePorque}</p>
                  <ul className="mf-dg__whys">
                    {p.reasonAnswerIds.filter((rid) => answers[rid] != null).map((rid) => (
                      <li key={rid}>
                        <span className="mf-dg__whyq">{qById[rid]?.title}</span>
                        <span className="mf-dg__whya">{answerLabel(rid)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mf-dg__priolabel">{ui.prioridadePrereq}</p>
                  <p className="mf-dg__priobody">{prerequisite}</p>
                  <p className="mf-dg__priolabel">{ui.prioridadeMedida}</p>
                  <p className="mf-dg__priobody">{measure}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {(e != null || (result.missingData || []).length > 0) && (
        <div className="mf-dg__est">
          <p className="mf-label">{ui.estimativa}</p>
          {e?.kind === "tempo" && (
            <>
              <p className="mf-dg__estnum">
                {jr(lang, e.hoursPerMonth.lo, e.hoursPerMonth.hi)} <span className="mf-dg__teto">{ui.horasMes}</span>
              </p>
              <p className="mf-dg__per">{ui.semanas}{e.hoursPerWeek?.band || e.hoursPerWeek?.value != null ? "" : ""}</p>
              <p className="mf-dg__formula">
                <span className="mf-label">{ui.fFormula}</span>
                {`${jr(lang, e.hoursPerWeek.lo, e.hoursPerWeek.hi)} ${ui.fHorasSem} × ${nf(lang, e.weeksPerMonth)} ${ui.fSemanas} = ${jr(lang, e.hoursPerMonth.lo, e.hoursPerMonth.hi)} ${ui.horasMes}`}
              </p>
              {e.costPerMonth && (
                <>
                  <p className="mf-dg__estnum">
                    {jr(lang, e.costPerMonth.lo, e.costPerMonth.hi)} <span className="mf-dg__teto">{e.costPerMonth.currency}{ui.porMes}</span>
                  </p>
                  <p className="mf-dg__formula">
                    {`${jr(lang, e.hoursPerMonth.lo, e.hoursPerMonth.hi)} ${ui.horasMes} × ${nf(lang, e.inputs?.find((x) => x.id === "hourlyCost")?.value)} ${e.costPerMonth.currency} ${ui.fCustoHora} = ${jr(lang, e.costPerMonth.lo, e.costPerMonth.hi)} ${e.costPerMonth.currency}${ui.porMes}`}
                  </p>
                </>
              )}
              <p className="mf-dg__per">{e.costPerMonth ? ui.custoTempo : ""}</p>
              <p className="mf-dg__limit">{ui.avisoTempo}</p>
            </>
          )}
          {e?.kind === "comissao_bruta" && (
            <>
              <p className="mf-dg__estnum">
                {jr(lang, e.grossPerMonth.lo, e.grossPerMonth.hi)} <span className="mf-dg__teto">{e.grossPerMonth.currency}{ui.porMes}</span>
              </p>
              <p className="mf-dg__formula">
                <span className="mf-label">{ui.fFormula}</span>
                {`${ui.fFaturamento} ${jr(lang, e.inputs?.[0]?.value?.lo, e.inputs?.[0]?.value?.hi)} ${e.grossPerMonth.currency} × ${ui.fTaxa} ${nf(lang, e.inputs?.[1]?.value)}% × ${ui.fParcela} ${nf(lang, e.inputs?.[2]?.value)}%`}
              </p>
              <p className="mf-dg__per">{ui.brutaHint}</p>
              <p className="mf-dg__limit">{ui.brutaLimit}</p>
            </>
          )}
          {e == null && (
            <>
              <p className="mf-dg__estnum mf-dg__estnum--muted">{ui.faltamDados}</p>
              <ul className="mf-dg__whys mf-dg__whys--miss">
                {result.missingData.map((m) => (
                  <li key={m.id}>
                    <span className="mf-dg__whya">— {NEXT_STEP_TEXTS[lang][m.id]}</span>
                  </li>
                ))}
              </ul>
              <p className="mf-dg__limit">{ui.faltamHint}</p>
            </>
          )}
        </div>
        )}

        <div className="mf-dg__next">
          <p className="mf-label">{ui.proximoPasso}</p>
          <p className="mf-dg__nextbody">{NEXT_STEP_TEXTS[lang][result.nextStep.textId]}</p>
          {svcSlug && (
            /* nova aba de propósito: visitar a solução NÃO pode perder o plano
               (estado do wizard vive em memória; sem storage extra) */
            <a className="mf-dg__svc" href={`/${lang}/${svcSlug}`} target="_blank" rel="noopener noreferrer">
              {`${ui.svcLabel}: ${ui.svc[svcSlug]} ${ui.svcNewTab}`}
            </a>
          )}
        </div>

        <div className="mf-dg__sum">
          <p className="mf-label">{ui.resumo}</p>
          <p className="mf-dg__hint">{ui.resumoHint}</p>
          <textarea className="mf-dg__ta" value={summary} onChange={(ev) => setSummary(ev.target.value)} rows={Math.min(14, Math.max(6, summary.split("\n").length))} />
          <button type="button" className="mf-dg__copy" onClick={copySummary}>
            {copied ? ui.copiado : ui.copiar}
          </button>
        </div>

        <div className="mf-dg__contact">
          <p className="mf-label">{ui.contato}</p>
          <p className="mf-dg__hint">{ui.contatoHint}</p>
          <div className="mf-dg__ctas">
            {lang === "pt" ? (
              <a className="mf-dg__wa" href={waHref} target="_blank" rel="noreferrer">
                {ui.whatsapp}
              </a>
            ) : (
              <a className="mf-dg__wa" href={CALENDLY_URL} target="_blank" rel="noreferrer">
                {ui.calendly}
              </a>
            )}
            <a className="mf-dg__mailto" href={`mailto:${EMAIL}`}>
              {ui.email}
            </a>
            <button type="button" className="mf-dg__again" onClick={() => setScreen("review")}>
              {ui.rever}
            </button>
            <button type="button" className="mf-dg__again" onClick={restart}>
              {ui.reiniciar}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="mf-dg" data-depth="0.08">
        <div className="mf-dg__inner">
          <div className="mf-dg__head">
            <div>
              <Reveal>
                <p className="mf-label">{ui.label}</p>
              </Reveal>
              <LineReveal as="h1" className="mf-dg__lead">{ui.lead}</LineReveal>
              <Reveal delay={140}>
                <p className="mf-dg__intro">{ui.intro}</p>
              </Reveal>
            </div>
          </div>

          <div className="mf-dg__stage">
            {screen === "flow" && (
              <div className="mf-dg__prog" aria-live="polite">
                <span className="mf-dg__proglabel">
                  {ui.progress} {stepNum} {ui.de} {total}
                </span>
                <span className="mf-dg__progbar">
                  <span className="mf-dg__progfill" style={{ width: `${Math.min(100, (answeredIds.length / Math.max(total, 1)) * 100)}%` }} />
                </span>
              </div>
            )}
            {screen === "flow" && (current ? renderQuestion() : nextUnanswered == null ? renderReview() : null)}
            {screen === "review" && renderReview()}
            {screen === "result" && renderResult()}
          </div>
        </div>
        <MfRule />
      </section>

      <style>{`
.mf-dg{padding:var(--section-gap) var(--gutter)}
.mf-dg__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-dg__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;max-width:16ch;text-wrap:balance;
}
.mf-dg__intro{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:56ch;margin:2rem 0 0;
}
.mf-dg__stage{margin-top:3.5rem;border-top:1px solid var(--color-divider);padding-top:2rem}
.mf-dg__prog{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.mf-dg__proglabel{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-dg__progbar{flex:1;min-width:120px;height:1px;background:var(--color-divider);display:block;position:relative}
.mf-dg__progfill{position:absolute;left:0;top:0;height:1px;background:var(--mf-terracotta);display:block;transition:width .4s var(--ease-out-expo)}
@media(prefers-reduced-motion:reduce){.mf-dg__progfill{transition:none}}
.mf-dg__panel{margin-top:2.25rem;animation:mf-dg-in 0.5s var(--ease-out-expo) both}
@keyframes mf-dg-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.mf-dg__panel{animation:none}}
.mf-dg__qq{outline:none}
.mf-dg__qq:focus-visible{outline:2px solid var(--mf-terracotta);outline-offset:4px}
.mf-dg__q{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.16;
  color:var(--color-text-primary);margin:0;max-width:26ch;text-wrap:balance;
}
.mf-dg__hint{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);margin:0.6rem 0 0;max-width:60ch;
}
.mf-dg__opts{display:grid;grid-template-columns:1fr;gap:0.8rem;margin-top:1.75rem}
@media(min-width:860px){
  .mf-dg__opts{grid-template-columns:1fr 1fr}
  .mf-dg__opts--field{grid-template-columns:1fr 1fr;max-width:640px}
}
.mf-dg__opt{position:relative;min-height:44px;
  display:flex;flex-direction:column;gap:0.5rem;text-align:left;
  background:transparent;border:1px solid var(--color-divider);
  padding:1.15rem 1.25rem;cursor:pointer;
  transition:border-color var(--duration-fast) var(--ease-in-out),
             background-color var(--duration-fast) var(--ease-in-out),
             transform var(--duration-fast) var(--ease-in-out);
}
.mf-dg__radio{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
.mf-dg__formula{margin:.4rem 0 0;font-size:.8rem;color:var(--mf-ink,#1f1a15);opacity:.8;letter-spacing:.02em}
.mf-dg__formula .mf-label{display:block;margin-bottom:.15rem}
.mf-dg__svc{display:inline-block;margin-top:.7rem;font-size:.85rem;text-decoration:underline;text-underline-offset:3px;padding:.35rem .15rem}
.mf-dg__opt:focus-within{outline:2px solid var(--mf-ink,#1f1a15);outline-offset:2px}
.mf-dg__opt:hover{border-color:rgba(242,238,230,0.4);transform:translateY(-2px)}
.mf-dg__opt[data-on="true"]{border-color:var(--mf-terracotta);background:rgba(179,122,96,0.08)}
.mf-dg__optt{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-body-lg);line-height:1.25;color:var(--color-text-primary);
}
.mf-dg__optd{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);
}
.mf-dg__field{display:flex;flex-direction:column;gap:0.5rem;padding:0.25rem 0}
.mf-dg__flabel{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);
}
.mf-dg__input{
  background:transparent;border:1px solid var(--color-divider);
  color:var(--color-text-primary);
  font-family:var(--font-body);font-size:var(--text-body-lg);
  padding:0.85rem 1rem;min-height:44px;width:100%;max-width:320px;
}
.mf-dg__input:focus-visible{outline:2px solid var(--mf-terracotta);outline-offset:2px}
.mf-dg__select{max-width:160px}
.mf-dg__error{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta-deep);margin:1.2rem 0 0;
}
.mf-dg__nav{display:flex;align-items:center;gap:1.5rem;margin-top:2rem;flex-wrap:wrap}
.mf-dg__back{
  background:none;border:0;cursor:pointer;padding:0;min-height:44px;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-dg__back:hover:not(:disabled){color:var(--color-text-primary)}
.mf-dg__back:disabled{cursor:default;opacity:0.35}
.mf-dg__go{
  background:var(--mf-terracotta);color:var(--on-accent);border:0;cursor:pointer;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  padding:1rem 1.75rem;min-height:44px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-dg__go:hover{opacity:0.82}
.mf-dg__rev{list-style:none;margin:1.5rem 0 0;padding:0}
.mf-dg__revrow{
  display:grid;grid-template-columns:1fr;gap:0.35rem;
  padding:0.9rem 0;border-top:1px solid var(--color-divider);
}
@media(min-width:860px){.mf-dg__revrow{grid-template-columns:1.2fr 1fr auto;align-items:center;gap:1rem}}
.mf-dg__revq{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-dg__reva{
  font-family:var(--font-body);font-size:var(--text-body-md);
  color:var(--color-text-primary);
}
.mf-dg__revedit{
  background:none;border:0;cursor:pointer;padding:0;justify-self:start;min-height:44px;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta);
}
.mf-dg__revedit:hover{opacity:0.7}
.mf-dg__panel--result{max-width:var(--max-width-body)}
.mf-dg__prios{list-style:none;margin:1.5rem 0 0;padding:0}
.mf-dg__prio{
  display:grid;grid-template-columns:1fr;gap:0.35rem;
  padding:1.6rem 0;border-top:1px solid var(--color-divider);
}
@media(min-width:860px){.mf-dg__prio{grid-template-columns:auto 1fr;gap:2rem}.mf-dg__prio{padding:1.8rem 0}}
.mf-dg__prion{
  font-family:var(--font-display);font-size:var(--text-display-md);
  color:var(--mf-terracotta);line-height:1;
}
.mf-dg__priot{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-sm);line-height:1.2;
  color:var(--color-text-primary);margin:0;max-width:26ch;text-wrap:balance;
}
.mf-dg__priolabel{
  font-family:var(--font-mono);font-size:11px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);margin:1rem 0 0;
}
.mf-dg__priobody{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0.35rem 0 0;max-width:58ch;
}
.mf-dg__whys{list-style:none;margin:0.35rem 0 0;padding:0;display:flex;flex-direction:column;gap:0.3rem}
.mf-dg__whys li{display:flex;flex-wrap:wrap;gap:0.5rem}
.mf-dg__whyq{
  font-family:var(--font-mono);font-size:11px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-dg__whya{font-family:var(--font-body);font-size:var(--text-body-md);color:var(--color-text-primary)}
.mf-dg__est{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid var(--color-divider)}
.mf-dg__estnum{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(2rem,5vw,3.2rem);line-height:1;letter-spacing:-0.01em;
  color:var(--color-text-primary);margin:0.9rem 0 0;
  font-variant-numeric:tabular-nums;
}
.mf-dg__estnum--muted{font-size:clamp(1.3rem,3vw,1.8rem);color:var(--color-text-secondary);max-width:40ch;text-wrap:balance}
.mf-dg__teto{font-size:clamp(1rem,2vw,1.4rem);color:var(--color-text-secondary)}
.mf-dg__per{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);margin:0.7rem 0 0;
}
.mf-dg__limit{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:1rem 0 0;max-width:56ch;
}
.mf-dg__next{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid var(--color-divider)}
.mf-dg__nextbody{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0.8rem 0 0;max-width:56ch;
}
.mf-dg__sum{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid var(--color-divider)}
.mf-dg__ta{
  width:100%;margin-top:1rem;background:transparent;
  border:1px solid var(--color-divider);color:var(--color-text-primary);
  font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);
  line-height:1.7;padding:1rem;resize:vertical;
}
.mf-dg__ta:focus-visible{outline:2px solid var(--mf-terracotta);outline-offset:2px}
.mf-dg__copy{
  background:none;border:1px solid var(--color-divider);cursor:pointer;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);padding:0.9rem 1.4rem;margin-top:0.9rem;min-height:44px;
}
.mf-dg__copy:hover{border-color:var(--mf-terracotta)}
.mf-dg__contact{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid var(--color-divider)}
.mf-dg__ctas{display:flex;flex-wrap:wrap;align-items:center;gap:1.25rem;margin-top:1.5rem}
.mf-dg__wa{
  display:inline-block;
  background:var(--mf-terracotta);color:var(--on-accent);
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  padding:1rem 1.5rem;text-decoration:none;min-height:44px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-dg__wa:hover{opacity:0.82}
.mf-dg__mailto{
  display:inline-flex;align-items:center;min-height:44px;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta);text-decoration:none;
}
.mf-dg__mailto:hover{opacity:0.65}
.mf-dg__again{
  background:none;border:0;cursor:pointer;padding:0;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);min-height:44px;
}
.mf-dg__again:hover{color:var(--color-text-primary)}
@media(max-width:420px){
  .mf-dg__go,.mf-dg__wa{width:100%;text-align:center}
  .mf-dg__nav{gap:0.9rem}
}
      `}</style>
    </>
  );
}
