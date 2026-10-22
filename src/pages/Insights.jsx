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
 *    SEM backend/API paga: nada sai do navegador do visitante;
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

export default function Insights() {
  const { lang } = useLang();
  const ui = UI_TEXTS[lang];
  usePageTitle(ui.label, "insights");

  const [answers, setAnswers] = useState({});
  const [flow, setFlow] = useState([]); // ids mostrados, na ordem
  const [pos, setPos] = useState(0); // ponteiro dentro de flow
  const [screen, setScreen] = useState("flow"); // flow | review | result
  const [draft, setDraft] = useState({}); // rascunho de entrada corrente (não perde texto em erro)
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState("");
  const qRef = useRef(null);

  const qs = useMemo(() => getDiagnosisQuestions(answers, lang), [answers, lang]);
  const qById = useMemo(() => {
    const m = {};
    (QUESTIONS_V2[lang] || []).forEach((q) => (m[q.id] = q));
    return m;
  }, [lang]);

  /* próxima pergunta ainda não respondida: chave AUSENTE = não cometida;
     chave com null = respondida "não sei" (unknown ≠ não respondida). */
  const nextUnanswered = useMemo(() => qs.find((q) => answers[q.id] === undefined) || null, [qs, answers]);

  const currentId = screen !== "flow" || pos < flow.length ? flow[pos] : nextUnanswered?.id;
  const current = currentId ? qs.find((q) => q.id === currentId) || qById[currentId] : null;

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
        },
      }));
    } else if (current.type === "hours") {
      setDraft((d) => ({ ...d, [current.id]: { band: a?.band ?? null, value: a?.value != null ? String(a.value) : "" } }));
    } else if (current.type === "currency") {
      setDraft((d) => ({ ...d, [current.id]: { value: a?.value != null ? String(a.value) : "", currency: a?.currency ?? "" } }));
    } else if (current.type === "percent") {
      setDraft((d) => ({ ...d, [current.id]: { value: a != null ? String(a) : "" } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, screen]);

  /* foco na pergunta nova (teclado/leitor de tela) */
  useEffect(() => {
    if (screen === "flow" && qRef.current) qRef.current.focus({ preventScroll: false });
  }, [currentId, screen]);

  const result = useMemo(() => (screen === "result" ? evaluateDiagnosis(answers, lang) : null), [screen, answers, lang]);

  const answerLabel = (id) => {
    const a = answers[id];
    const q = qById[id];
    if (a == null) return "—";
    if (id === "volume") {
      const bands = q?.currency || (qs.find((x) => x.id === "volume")?.currency) ? VOLUME_BAND_LABELS[lang].currency : VOLUME_BAND_LABELS[lang].count;
      const bl = a.band ? bands[a.band] : null;
      const unit = (qs.find((x) => x.id === "volume")?.unit) || "";
      const per = (qs.find((x) => x.id === "volume")?.period) || "";
      const v = a.value != null ? `${nf(lang, a.value)}${a.currency ? ` ${a.currency}` : ""}` : bl;
      return `${v}${unit ? ` ${unit}` : ""}${per ? ` ${per}` : ""}`;
    }
    if (id === "hoursPerWeek") {
      if (a.value != null) return `${nf(lang, a.value)} ${ui.horasSemana}`;
      const bl = q?.options?.find((o) => o.id === a.band)?.label;
      return bl || "—";
    }
    if (id === "hourlyCost") return a.value != null ? `${nf(lang, a.value)}${a.currency ? ` ${a.currency}` : ""}` : "—";
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

  /** grava a resposta SÓ no Continuar; troca já dada invalida só os dependentes */
  const advance = (id, value) => {
    const wasEditing = pos < flow.length;
    setAnswers((prev) => {
      const changed = prev[id] != null && JSON.stringify(prev[id]) !== JSON.stringify(value);
      const next = changed ? pruneAnswers(prev, id) : prev;
      return { ...next, [id]: value };
    });
    setFlow((f) => (wasEditing ? f : [...f, id]));
    setPos(wasEditing ? pos + 1 : flow.length + 1);
  };

  useEffect(() => {
    /* após gravar, decide a próxima tela */
    if (screen !== "flow") return;
    if (pos < flow.length) return;
    if (nextUnanswered) return;
    setScreen("review");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, flow, pos]);

  const back = () => {
    setError("");
    if (pos > 0) setPos(pos - 1);
    else if (screen === "review") setScreen("flow");
  };

  const restart = () => {
    setAnswers({});
    setFlow([]);
    setPos(0);
    setDraft({});
    setError("");
    setCopied(false);
    setSummary("");
    setScreen("flow");
  };

  const editAt = (idx) => {
    setPos(idx);
    setScreen("flow");
  };

  /* ───────────────────────── resultado ───────────────────────── */

  useEffect(() => {
    if (screen !== "result") return;
    const L = UI_TEXTS[lang];
    const lines = [`${L.label} — Miranda Faria`];
    flow.forEach((id) => {
      const q = qById[id];
      const v = answers[id];
      if (q && v != null) lines.push(`• ${q.title}: ${answerLabel(id)}`);
    });
    if (result) {
      lines.push(`• ${L.prioridades}:`);
      result.priorities.forEach((p, i) => {
        const tx = p.id === "acao_do_objetivo" ? GOAL_ACTIONS[lang][p.goal] : PRIORITY_TEXTS[p.id]?.[lang];
        lines.push(`  ${i + 1}. ${p.id === "acao_do_objetivo" ? (qById.goal?.options?.find((o) => o.id === p.goal)?.label || "") + " — " : ""}${tx?.action || p.id}`);
      });
      const e = result.estimate;
      if (e?.kind === "tempo") {
        const h = e.hoursPerMonth;
        lines.push(`• ${L.estimativa}: ${nf(lang, h.lo)}${h.hi != null ? `–${nf(lang, h.hi)}` : "+"} ${L.horasMes} (${L.semanas})`);
        if (e.costPerMonth) lines.push(`  ${L.custoTempo}: ${nf(lang, e.costPerMonth.lo)}${e.costPerMonth.hi != null ? `–${nf(lang, e.costPerMonth.hi)}` : "+"} ${e.costPerMonth.currency}/mês`);
      } else if (e?.kind === "comissao_bruta") {
        const g = e.grossPerMonth;
        lines.push(`• ${L.estimativa}: comissão bruta evitável ${nf(lang, g.lo)}${g.hi != null ? `–${nf(lang, g.hi)}` : "+"} ${g.currency}/mês (bruta — não é economia líquida)`);
      }
    }
    setSummary(lines.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

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
  const stepNum = Math.min(pos + 1, flow.length + 1);

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
            {opts.map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={current.type === "hours" ? d.band === o.id : d.pick === o.id}
                className="mf-dg__opt"
                data-on={current.type === "hours" ? d.band === o.id : d.pick === o.id}
                onClick={() => {
                  setError("");
                  if (current.type === "hours") setDraft((x) => ({ ...x, [current.id]: { ...d, band: o.id, value: "" } }));
                  else setDraft((x) => ({ ...x, [current.id]: { pick: o.id } }));
                }}
              >
                <span className="mf-dg__optt">{o.label}</span>
              </button>
            ))}
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
              <button
                key={b.id}
                type="button"
                role="radio"
                aria-checked={d.band === b.id}
                className="mf-dg__opt"
                data-on={d.band === b.id}
                onClick={() => {
                  setError("");
                  setDraft((x) => ({ ...x, [current.id]: { ...d, band: b.id } }));
                }}
              >
                <span className="mf-dg__optt">{volBands[b.id]}</span>
                <span className="mf-dg__optd">{`${current.unit || ""} ${current.period || ""}`.trim()}</span>
              </button>
            ))}
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
                  setDraft((x) => ({ ...x, [current.id]: { ...d, value: e.target.value } }));
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
          <button type="button" className="mf-dg__back" onClick={back} disabled={pos === 0 && screen === "flow"}>
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
      <p className="mf-dg__q">{ui.revisar}</p>
      <p className="mf-dg__hint">{ui.revisaoHint}</p>
      <ul className="mf-dg__rev">
        {flow.map((id, i) => {
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
        <button type="button" className="mf-dg__back" onClick={() => { if (flow.length) setPos(flow.length - 1); setScreen("flow"); }}>
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
        <p className="mf-label">{ui.prioridades}</p>
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

        <div className="mf-dg__est">
          <p className="mf-label">{ui.estimativa}</p>
          {e?.kind === "tempo" && (
            <>
              <p className="mf-dg__estnum">
                {nf(lang, e.hoursPerMonth.lo)}
                {e.hoursPerMonth.hi != null ? ` – ${nf(lang, e.hoursPerMonth.hi)}` : "+"} <span className="mf-dg__teto">{ui.horasMes}</span>
              </p>
              <p className="mf-dg__per">{ui.semanas}{e.hoursPerWeek?.band || e.hoursPerWeek?.value != null ? "" : ""}</p>
              {e.costPerMonth && (
                <p className="mf-dg__estnum">
                  {nf(lang, e.costPerMonth.lo)}
                  {e.costPerMonth.hi != null ? ` – ${nf(lang, e.costPerMonth.hi)}` : "+"} <span className="mf-dg__teto">{e.costPerMonth.currency}/mês</span>
                </p>
              )}
              <p className="mf-dg__per">{e.costPerMonth ? ui.custoTempo : ""}</p>
              <p className="mf-dg__limit">{ui.avisoTempo}</p>
            </>
          )}
          {e?.kind === "comissao_bruta" && (
            <>
              <p className="mf-dg__estnum">
                {nf(lang, e.grossPerMonth.lo)}
                {e.grossPerMonth.hi != null ? ` – ${nf(lang, e.grossPerMonth.hi)}` : "+"} <span className="mf-dg__teto">{e.grossPerMonth.currency}/mês</span>
              </p>
              <p className="mf-dg__per">comissão potencialmente evitável — BRUTA</p>
              <p className="mf-dg__limit">{lang === "pt" ? "Custos novos do canal próprio não são conhecidos: não é economia líquida." : "New own-channel costs aren't known: this is not net savings."}</p>
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

        <div className="mf-dg__next">
          <p className="mf-label">{ui.proximoPasso}</p>
          <p className="mf-dg__nextbody">{NEXT_STEP_TEXTS[lang][result.nextStep.textId]}</p>
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
                  <span className="mf-dg__progfill" style={{ width: `${Math.min(100, (flow.length / Math.max(total, 1)) * 100)}%` }} />
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
.mf-dg__opt{min-height:44px;
  display:flex;flex-direction:column;gap:0.5rem;text-align:left;
  background:transparent;border:1px solid var(--color-divider);
  padding:1.15rem 1.25rem;cursor:pointer;
  transition:border-color var(--duration-fast) var(--ease-in-out),
             background-color var(--duration-fast) var(--ease-in-out),
             transform var(--duration-fast) var(--ease-in-out);
}
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
