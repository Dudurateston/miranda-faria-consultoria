import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { trackDiagnosis } from "@/lib/siteAnalytics";
import { WHATSAPP_URL_BARE } from "@/lib/site";
import { base44 } from "@/api/base44Client";
import { calcularDiagnostico, FONTES } from "@/lib/diagnostico";

/**
 * Diagnóstico — o instrumento que substituiu a página de insights.
 *
 * Rebuild v3.27 (spec final 17/09): motor [piso, teto] com fontes
 * A/B/C por dor, pergunta de driver condicional, linha da conta
 * visível, recuperação específica por dor (a faixa genérica 35–60%
 * saiu) e gravação em DiagnosticoLead (mesma RLS do SiteEvent:
 * create aberto, leitura só admin). A manchete é SEMPRE o piso —
 * conservador por construção: se errar, erra para baixo.
 *
 * Fluxo: dor → driver (condicional) → porte/base (condicional) →
 * urgência → resultado. Tudo client-side, sem fricção: cada resposta
 * avança sozinha.
 */

/** Dor -> solução que resolve, e para onde ela aponta. */
const SOLUTION = {
  pt: {
    marketplace: {
      practice: "gestao",
      t: "Casa própria digital",
      d: "Catálogo e pedido direto, sem comissão no meio. O dinheiro cai na sua conta e o cliente fica no seu banco. A economia é a comissão sobre a fatia que migrar — não o total.",
    },
    excel: {
      practice: "gestao",
      t: "Painel que atualiza sozinho",
      d: "A planilha manual vira sistema: o erro cai de ~6% para ~0,3% no que for automatizado. O que continuar manual continua errando — a solução não promete o que não entrega.",
    },
    curiosos: {
      practice: "desenvolvimento",
      t: "Sistema que filtra",
      d: "FAQ, qualificação e orçamento automático: o lead chega pronto e o curioso se atende sozinho. A triagem resolve a pergunta repetida; a decisão humana continua humana.",
    },
    pessoa: {
      practice: "gestao",
      t: "Processo no nome da empresa",
      d: "A rotina e o histórico do cliente passam a viver no sistema da empresa. Se a pessoa sair, o processo não sai junto — e a reposição, quando precisar, é mais curta.",
    },
    cego: {
      practice: "gestao",
      t: "Dashboards de decisão",
      d: "Venda, margem e estoque numa tela só: o painel habilita o ganho de 3% a 8% de margem que a precificação granular traz. Habilita — não garante.",
    },
  },
  en: {
    marketplace: {
      practice: "gestao",
      t: "Your own digital storefront",
      d: "Catalogue and ordering direct, no commission in the middle. The savings are the commission on the share that migrates — not the whole volume.",
    },
    excel: {
      practice: "gestao",
      t: "A panel that updates itself",
      d: "The manual spreadsheet becomes a system: error drops from ~6% to ~0.3% on whatever gets automated. What stays manual keeps erring — the fix doesn't promise what it can't deliver.",
    },
    curiosos: {
      practice: "desenvolvimento",
      t: "A system that filters",
      d: "FAQ, qualification and automatic quoting: the lead arrives ready and the tire-kicker self-serves. Triage kills the repeated question; human judgement stays human.",
    },
    pessoa: {
      practice: "gestao",
      t: "Process in the company's name",
      d: "Routines and client history live in the company's system. If the person leaves, the process doesn't leave with them — and replacement, if needed, is shorter.",
    },
    cego: {
      practice: "gestao",
      t: "Decision dashboards",
      d: "Sales, margin and stock on one screen: the panel enables the 3–8% margin gain that granular pricing brings. Enables — does not guarantee.",
    },
  },
};

const round100 = (n) => Math.round(n / 100) * 100;
const fmt = (lang, n) =>
  lang === "pt"
    ? "R$ " + round100(n).toLocaleString("pt-BR")
    : "$" + round100(n).toLocaleString("en-US");

/** Contador que sobe do zero ate o alvo — o numero do vazamento. */
function useCountUp(target, active, ms = 1100) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active, ms]);
  return v;
}

/** Perguntas condicionais: driver + base numerica, por dor. */
const num = (v) => Number(v);

export default function Insights() {
  const { lang, path } = useLang();
  const t = copy[lang].diag;
  usePageTitle(t.label, "insights");

  const [pain, setPain] = useState(null);
  const [driver, setDriver] = useState(null);
  const [base, setBase] = useState(null);
  const [urgency, setUrgency] = useState(null);
  const [phase, setPhase] = useState(0); // 0 dor · 1 driver · 2 base · 3 urgencia · 4 resultado
  const trackedResult = useRef(false);
  const savedLead = useRef(false);
  const timer = useRef(0);

  useEffect(() => {
    if (phase === 4 && !trackedResult.current) {
      trackedResult.current = true;
      // medicao propria (LGPD): so as escolhas, nada pessoal
      trackDiagnosis(JSON.stringify({ pain, driver, base, urgency }));
    }
  }, [phase]);

  const pick = (setter, nextPhase) => (v) => {
    setter(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase(nextPhase), 260);
  };

  const driverCfg = pain != null ? t.driverQ[pain] : null;
  const baseCfg = pain != null ? t.baseQ[pain] : null;

  /** Inputs do motor a partir das escolhas — valores ja em escala mensal. */
  const inputs = useMemo(() => {
    if (pain == null || driver == null || base == null) return null;
    const d = num(driver);
    const b = num(base);
    switch (pain) {
      case "marketplace":
        return { receita: b, fatiaCanal: d };
      case "excel":
        return { lancamentosMes: Math.round(d * 4.33), custoErro: b };
      case "curiosos":
        return { conversasMes: Math.round(d * 4.33), minutosPorConversa: 15, custoHora: b };
      case "pessoa":
        return { salario: b, oQuePara: driver };
      case "cego":
        return { margemMes: Math.round(b * 0.2), frequencia: driver, isAverageMargin: true };
      default:
        return null;
    }
  }, [pain, driver, base]);

  const diag = useMemo(
    () => (phase === 4 && inputs ? calcularDiagnostico({ dor: pain, inputs, lang }) : null),
    [phase, inputs, pain, lang]
  );

  const shown = useCountUp(diag?.piso || 0, phase === 4);

  /** ICP: classifica so para o banco — o visitante nao ve rotulo de "desqualificado". */
  const icp = useMemo(() => {
    if (!diag) return "";
    const limQ = lang === "pt" ? 3000 : 600;
    const limD = lang === "pt" ? 500 : 100;
    if (diag.piso < limD) return "desqualificar";
    if (urgency === "now" || diag.piso >= limQ) return "qualificado";
    return "marginal";
  }, [diag, urgency, lang]);

  useEffect(() => {
    if (phase !== 4 || !diag || savedLead.current) return;
    savedLead.current = true;
    try {
      const rec = {
        dor: pain,
        driver_valor: String(driver),
        porte: String(base),
        urgencia: { now: "alta", months: "media", later: "baixa" }[urgency] || "",
        vazamento_piso: Math.round(diag.piso),
        vazamento_teto: Math.round(diag.teto),
        classificacao_icp: icp,
        vertical_recomendada: SOLUTION[lang][pain]?.practice || "",
        lang,
        contato: "",
        session_id: "",
      };
      base44.entities.DiagnosticoLead.create(rec).catch(() => {});
    } catch {
      /* gravacao nunca bloqueia o resultado */
    }
  }, [phase, diag]);

  const rec = diag?.recuperacao?.[lang] || null;
  const fonte = diag?.fonte || FONTES[pain] || null;
  const sol = pain != null ? SOLUTION[lang][pain] : null;
  const result = t.result;

  const painLabel = pain != null ? t.pains.find((p) => p.id === pain)?.t : "";
  const urgLabel = urgency != null ? t.urgencies.find((u) => u.id === urgency)?.t : "";
  const driverLabel =
    pain != null && driver != null
      ? (driverCfg?.opts.find((o) => String(num(o[0])) === String(num(driver))) || [])[1] || ""
      : "";
  const baseLabel =
    pain != null && base != null
      ? (baseCfg?.opts.find((o) => String(num(o[0])) === String(num(base))) || [])[1] || ""
      : "";

  const waText = encodeURIComponent(
    lang === "pt"
      ? `Olá Eduardo. Fiz o diagnóstico no site:\n• Dor: ${painLabel}\n• Driver: ${driverLabel}\n• Porte: ${baseLabel}\n• Urgência: ${urgLabel}\n• Vazamento estimado: ${fmt("pt", diag?.piso || 0)} a ${fmt("pt", diag?.teto || 0)}/mês (piso conservador)\nQuero conversar sobre a solução — ${sol?.t}.`
      : `Hi Eduardo. I ran the diagnosis on your site:\n• Pain: ${painLabel}\n• Driver: ${driverLabel}\n• Size: ${baseLabel}\n• Urgency: ${urgLabel}\n• Estimated leak: ${fmt("en", diag?.piso || 0)} to ${fmt("en", diag?.teto || 0)}/mo (conservative floor)\nI'd like to talk about the fix — ${sol?.t}.`
  );

  const stepNames = [t.steps.pain, t.steps.driver, t.steps.base, t.steps.urgency];
  const [copied, setCopied] = useState(false);

  const copyResult = async () => {
    const plain =
      lang === "pt"
        ? `Diagnóstico — Miranda Faria\n• Dor: ${painLabel}\n• Driver: ${driverLabel}\n• Porte: ${baseLabel}\n• Urgência: ${urgLabel}\n• Vazamento estimado: ${fmt("pt", diag?.piso || 0)} a ${fmt("pt", diag?.teto || 0)}/mês (piso conservador)\n• A conta: ${diag?.linhaConta || ""}\n• Fonte: ${fonte?.origem?.pt || ""}\n• Solução apontada: ${sol?.t}`
        : `Diagnosis — Miranda Faria\n• Pain: ${painLabel}\n• Driver: ${driverLabel}\n• Size: ${baseLabel}\n• Urgency: ${urgLabel}\n• Estimated leak: ${fmt("en", diag?.piso || 0)} to ${fmt("en", diag?.teto || 0)}/mo (conservative floor)\n• The math: ${diag?.linhaConta || ""}\n• Source: ${fonte?.origem?.en || ""}\n• Suggested fix: ${sol?.t}`;
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard indisponivel: o botao simplesmente nao marca */
    }
  };

  const restart = () => {
    setPain(null);
    setDriver(null);
    setBase(null);
    setUrgency(null);
    trackedResult.current = false;
    savedLead.current = false;
    setPhase(0);
  };

  return (
    <>
      <section className="mf-dg" data-depth="0.08">
        <div className="mf-dg__inner">
          <div className="mf-dg__head">
            <div>
              <Reveal>
                <p className="mf-label">{t.label}</p>
              </Reveal>
              <LineReveal as="h1" className="mf-dg__lead">{t.lead}</LineReveal>
              <Reveal delay={140}>
                <p className="mf-dg__intro">{t.intro}</p>
              </Reveal>
              <Reveal delay={220}>
                <p className="mf-dg__evidence">{t.evidence}</p>
              </Reveal>
            </div>
          </div>

          <div className="mf-dg__stage">
            {/* indicador de passos */}
            <div className="mf-dg__steps" role="group" aria-label="steps">
              {stepNames.map((s, i) => (
                <React.Fragment key={s}>
                  <button
                    type="button"
                    className="mf-dg__step"
                    data-state={phase === i ? "now" : phase > i ? "done" : "todo"}
                    onClick={() => phase > i && setPhase(i)}
                    disabled={phase < i}
                  >
                    <span className="mf-dg__stepn">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mf-dg__stepl">{s}</span>
                  </button>
                  {i < 3 && <span className="mf-dg__steprule" aria-hidden="true" />}
                </React.Fragment>
              ))}
            </div>

            {/* PASSO 0 — a dor */}
            {phase === 0 && (
              <div className="mf-dg__panel" key="p0">
                <h2 className="mf-dg__q">{t.painQ}</h2>
                <p className="mf-dg__hint">{t.painHint}</p>
                <div className="mf-dg__opts mf-dg__opts--pain">
                  {t.pains.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="mf-dg__opt"
                      data-on={pain === p.id ? "true" : "false"}
                      onClick={() => pick(setPain, 1)(p.id)}
                    >
                      <span className="mf-dg__optt">{p.t}</span>
                      <span className="mf-dg__optd">{p.d}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASSO 1 — o driver da dor (condicional) */}
            {phase === 1 && driverCfg && (
              <div className="mf-dg__panel" key="p1">
                <button type="button" className="mf-dg__back" onClick={() => setPhase(0)}>
                  ← {result.back}
                </button>
                <h2 className="mf-dg__q">{driverCfg.q}</h2>
                <div className="mf-dg__opts mf-dg__opts--driver">
                  {driverCfg.opts.map((o) => (
                    <button
                      key={o[0]}
                      type="button"
                      className="mf-dg__opt mf-dg__opt--drv"
                      data-on={String(num(driver)) === String(num(o[0])) ? "true" : "false"}
                      onClick={() => pick(setDriver, 2)(o[0])}
                    >
                      <span className="mf-dg__optt">{o[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASSO 2 — a base numerica (condicional) */}
            {phase === 2 && baseCfg && (
              <div className="mf-dg__panel" key="p2">
                <button type="button" className="mf-dg__back" onClick={() => setPhase(1)}>
                  ← {result.back}
                </button>
                <h2 className="mf-dg__q">{baseCfg.q}</h2>
                {baseCfg.hint && <p className="mf-dg__hint">{baseCfg.hint}</p>}
                <div className="mf-dg__opts mf-dg__opts--base">
                  {baseCfg.opts.map((o) => (
                    <button
                      key={o[0]}
                      type="button"
                      className="mf-dg__opt mf-dg__opt--base"
                      data-on={String(num(base)) === String(num(o[0])) ? "true" : "false"}
                      onClick={() => pick(setBase, 3)(o[0])}
                    >
                      <span className="mf-dg__optt">{o[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASSO 3 — a urgencia */}
            {phase === 3 && (
              <div className="mf-dg__panel" key="p3">
                <button type="button" className="mf-dg__back" onClick={() => setPhase(2)}>
                  ← {result.back}
                </button>
                <h2 className="mf-dg__q">{t.urgencyQ}</h2>
                <div className="mf-dg__opts mf-dg__opts--urg">
                  {t.urgencies.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      className="mf-dg__opt mf-dg__opt--urg"
                      data-on={urgency === u.id ? "true" : "false"}
                      onClick={() => pick(setUrgency, 4)(u.id)}
                    >
                      <span className="mf-dg__optt">{u.t}</span>
                      <span className="mf-dg__optd">{u.d}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RESULTADO */}
            {phase === 4 && diag && sol && (
              <div className="mf-dg__panel mf-dg__panel--result" key="p4">
                <p className="mf-label">{result.label}</p>
                <p className="mf-dg__num">
                  {fmt(lang, shown)}
                  <span className="mf-dg__teto">
                    {" "}{result.to} {fmt(lang, diag.teto)}
                  </span>
                </p>
                <p className="mf-dg__per">
                  {result.perMonth} · {result.range}
                  <span className="mf-dg__sep">·</span>
                  {fmt(lang, (diag.piso || 0) * 12)} {result.perYear}
                </p>

                <p className="mf-dg__nature">{result.natureLabel}</p>

                <div className="mf-dg__account">
                  <p className="mf-label">{result.accountLabel}</p>
                  <p className="mf-dg__linha">{diag.linhaConta}</p>
                  <p className="mf-dg__fonte">
                    {result.sourceLabel}: {fonte?.origem?.[lang]} · {lang === "pt" ? "Nível de evidência" : "Evidence level"} {fonte?.nivel}
                  </p>
                </div>

                <p className="mf-dg__reading">{result.reading}</p>
                {urgency === "now" && (
                  <p className="mf-dg__delay">
                    {result.delayCost} <strong>{fmt(lang, diag.piso)}</strong>.
                  </p>
                )}

                {rec && (
                  <div className="mf-dg__recovery">
                    <p className="mf-label">{result.recoveryLabel}</p>
                    <p className="mf-dg__solt2">{rec.titulo}</p>
                    <p className="mf-dg__recnote">{rec.descricao}</p>
                  </div>
                )}

                <p className="mf-dg__limit">{result.limitNote}</p>

                <div className="mf-dg__sol">
                  <p className="mf-label">{result.solutionLabel}</p>
                  <h3 className="mf-dg__solt">{sol.t}</h3>
                  <p className="mf-dg__sold">{sol.d}</p>
                  <Link to={path(sol.practice)} className="mf-dg__sollink" data-cursor="link">
                    {result.solutionSee} →
                  </Link>
                </div>

                <div className="mf-dg__ctas">
                  <a
                    className="mf-dg__wa"
                    href={`${WHATSAPP_URL_BARE}?text=${waText}`}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                  >
                    {result.cta} →
                  </a>
                  <button type="button" className="mf-dg__again" onClick={copyResult}>
                    {copied ? result.copied : result.copyCta}
                  </button>
                  <button
                    type="button"
                    className="mf-dg__again"
                    onClick={() => {
                      setDriver(null);
                      setBase(null);
                      setUrgency(null);
                      trackedResult.current = false;
                      savedLead.current = false;
                      setPhase(1);
                    }}
                  >
                    {result.restart2}
                  </button>
                  <button type="button" className="mf-dg__again" onClick={restart}>
                    {result.restart}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <MfRule />

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

.mf-dg__stage{
  margin-top:3.5rem;border-top:1px solid var(--color-divider);
  padding-top:2rem;
}
/* indicador de passos */
.mf-dg__steps{display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap}
.mf-dg__step{
  display:inline-flex;align-items:center;gap:0.6rem;
  background:none;border:0;padding:0.25rem 0;cursor:default;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-dg__step[data-state="now"]{color:var(--color-text-primary)}
.mf-dg__step[data-state="done"]{color:var(--mf-terracotta);cursor:pointer}
.mf-dg__step:disabled{cursor:default}
.mf-dg__stepn{opacity:0.7}
.mf-dg__steprule{width:clamp(1.2rem,4vw,3rem);height:1px;background:var(--color-divider)}

/* paineis */
.mf-dg__panel{margin-top:2.25rem;animation:mf-dg-in 0.5s var(--ease-out-expo) both}
@keyframes mf-dg-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.mf-dg__panel{animation:none}}
.mf-dg__q{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.16;
  color:var(--color-text-primary);margin:0;max-width:24ch;text-wrap:balance;
}
.mf-dg__hint{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);margin:0.6rem 0 0;
}

/* opcoes */
.mf-dg__opts{display:grid;grid-template-columns:1fr;gap:0.8rem;margin-top:1.75rem}
@media(min-width:860px){
  .mf-dg__opts--pain{grid-template-columns:1fr 1fr}
  .mf-dg__opts--driver{grid-template-columns:repeat(4,1fr)}
  .mf-dg__opts--base{grid-template-columns:repeat(4,1fr)}
  .mf-dg__opts--urg{grid-template-columns:repeat(3,1fr)}
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
.mf-dg__opt[data-on="true"]{
  border-color:var(--mf-terracotta);
  background:rgba(179,122,96,0.08);
}
.mf-dg__optt{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-body-lg);line-height:1.25;color:var(--color-text-primary);
}
.mf-dg__optd{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);
}

/* resultado */
.mf-dg__panel--result{max-width:var(--max-width-body)}
.mf-dg__num{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(3rem,8vw,5.5rem);line-height:1;letter-spacing:-0.01em;
  color:var(--color-text-primary);margin:0.9rem 0 0;
  font-variant-numeric:tabular-nums;
}
.mf-dg__teto{
  font-size:clamp(1.1rem,2.2vw,1.6rem);color:var(--color-text-secondary);
}
.mf-dg__per{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);margin:0.9rem 0 0;
}
.mf-dg__sep{margin:0 0.6rem;opacity:0.5}
.mf-dg__nature{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);margin:1.1rem 0 0;
}
.mf-dg__account{
  margin-top:1.5rem;padding:1.25rem 1.4rem;
  border:1px solid var(--color-divider);
}
.mf-dg__account .mf-label{margin:0}
.mf-dg__linha{
  font-family:var(--font-mono);font-size:13px;line-height:1.7;
  color:var(--color-text-primary);margin:0.8rem 0 0;
}
.mf-dg__fonte{
  font-family:var(--font-mono);font-size:12px;line-height:1.7;
  color:var(--color-text-secondary);margin:0.6rem 0 0;
}
.mf-dg__delay{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);color:var(--color-text-secondary);
  margin:1.4rem 0 0;
}
.mf-dg__delay strong{color:var(--mf-terracotta);font-weight:400}
.mf-dg__reading{
  font-family:var(--font-display);font-weight:400;font-style:italic;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:1.1rem 0 0;max-width:46ch;
}
.mf-dg__recovery{
  margin-top:2rem;padding:1.25rem 1.4rem;
  border:1px solid var(--color-divider);
}
.mf-dg__recovery .mf-label{margin:0}
.mf-dg__solt2{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-body-lg);line-height:1.3;
  color:var(--color-text-primary);margin:0.8rem 0 0;
}
.mf-dg__evidence{font-family:var(--font-mono);font-size:12px;line-height:1.7;color:var(--color-text-secondary);max-width:62ch;margin-top:1.1rem;border-left:2px solid var(--color-accent);padding-left:1rem}
.mf-dg__limit{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:1.5rem 0 0;max-width:58ch;
}
.mf-dg__recnote{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0.6rem 0 0;max-width:52ch;
}
.mf-dg__back{
  background:none;border:0;cursor:pointer;padding:0;margin-bottom:0.9rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-dg__back:hover{color:var(--color-text-primary)}

.mf-dg__sol{
  margin-top:2.5rem;padding:1.6rem 0 0;border-top:1px solid var(--color-divider);
}
.mf-dg__solt{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.16;
  color:var(--color-text-primary);margin:0.9rem 0 0;max-width:24ch;text-wrap:balance;
}
.mf-dg__sold{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0.8rem 0 0;max-width:56ch;
}
.mf-dg__sollink{
  display:inline-block;margin-top:1.1rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta);text-decoration:none;
}
.mf-dg__sollink:hover{opacity:0.65}

.mf-dg__ctas{display:flex;flex-wrap:wrap;align-items:center;gap:1.25rem;margin-top:2.5rem}
.mf-dg__wa{
  display:inline-block;
  background:var(--mf-terracotta);color:var(--on-accent);
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  padding:1rem 1.5rem;text-decoration:none;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-dg__wa:hover{opacity:0.82}
.mf-dg__again{
  background:none;border:0;cursor:pointer;padding:0;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-dg__again:hover{color:var(--color-text-primary)}

.mf-dg__meta{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);color:var(--color-text-ghost);
  margin:2rem 0 0;
}
      `}</style>
    </>
  );
}
