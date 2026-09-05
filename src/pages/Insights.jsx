import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL_BARE } from "@/lib/site";

/**
 * Diagnóstico — o instrumento que substituiu a página de insights.
 *
 * A metodologia que Eduardo usa em vendas, virada ferramenta: quantificar
 * o custo da dor ANTES de falar de preço. Três perguntas — dor, porte,
 * urgência — e uma estimativa do vazamento mensal, com a solução
 * mapeada e o lead chegando no WhatsApp já qualificado. Tudo client-side,
 * sem formulário, sem fricção: cada resposta avança sozinha.
 */

/** Faixas de faturamento (mesma ordem de copy.diag.revenues). */
const REVENUE = { pt: [8_000, 20_000, 60_000, 180_000], en: [8_000, 20_000, 60_000, 180_000] };

/** Modelo por dor: função(receita) -> vazamento mensal estimado. */
const LEAK_MODEL = {
  marketplace: (r) => r * 0.2, // comissão média de 15–30% fica no meio
  excel: (r) => 1600 + r * 0.02, // horas de operação manual + erro de digitação
  curiosos: (r) => 2400 + r * 0.01, // ~10h/semana com quem não compra
  pessoa: (r) => r * 0.12, // carteira e processo que saem junto com a pessoa
  cego: (r) => r * 0.04, // margem na mesa: decisão de preço e estoque no chute
};

/** Dor -> solução que resolve, e para onde ela aponta. */
const SOLUTION = {
  pt: {
    marketplace: {
      practice: "gestao",
      t: "Casa própria digital",
      d: "Catálogo e pedido direto, sem comissão no meio. O dinheiro cai na sua conta e o cliente fica no seu banco.",
    },
    excel: {
      practice: "gestao",
      t: "Painel que atualiza sozinho",
      d: "A planilha manual vira sistema — e o processo para de depender da memória de alguém.",
    },
    curiosos: {
      practice: "desenvolvimento",
      t: "Sistema que filtra",
      d: "FAQ, qualificação e orçamento automático: o lead chega pronto e o curioso se atende sozinho.",
    },
    pessoa: {
      practice: "gestao",
      t: "CRM próprio",
      d: "O histórico do cliente fica no sistema, não na cabeça de quem pode sair amanhã.",
    },
    cego: {
      practice: "gestao",
      t: "Dashboards de decisão",
      d: "Venda, margem e estoque numa tela só: o padrão aparece e a decisão deixa de ser chute.",
    },
  },
  en: {
    marketplace: {
      practice: "gestao",
      t: "Your own digital storefront",
      d: "Catalogue and ordering direct, no commission in the middle. The money lands in your account and the customer stays in your database.",
    },
    excel: {
      practice: "gestao",
      t: "A panel that updates itself",
      d: "The manual spreadsheet becomes a system — the process stops depending on someone's memory.",
    },
    curiosos: {
      practice: "desenvolvimento",
      t: "A system that filters",
      d: "FAQ, qualification and automatic quoting: the lead arrives ready and the tire-kicker self-serves.",
    },
    pessoa: {
      practice: "gestao",
      t: "Your own CRM",
      d: "The customer history lives in the system, not in the head of whoever might leave tomorrow.",
    },
    cego: {
      practice: "gestao",
      t: "Decision dashboards",
      d: "Sales, margin and stock on one screen: the pattern shows up and the decision stops being a guess.",
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

export default function Insights() {
  const { lang, path } = useLang();
  const t = copy[lang].diag;
  usePageTitle(t.label, "insights");

  const [pain, setPain] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [urgency, setUrgency] = useState(null);
  const [phase, setPhase] = useState(0); // 0 dor · 1 porte · 2 urgencia · 3 resultado
  const timer = useRef(0);

  const pick = (setter, nextPhase) => (v) => {
    setter(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase(nextPhase), 260);
  };

  const leak = useMemo(() => {
    if (phase !== 3 || pain == null || revenue == null) return 0;
    const r = REVENUE[lang][revenue];
    return LEAK_MODEL[pain](r);
  }, [phase, pain, revenue, lang]);

  const shown = useCountUp(leak, phase === 3);
  const result = t.result;

  // desdobramentos do vazamento: dia util e faixa recuperavel
  const bare = (n) => round100(n).toLocaleString(lang === "pt" ? "pt-BR" : "en-US");
  const cur = lang === "pt" ? "R$ " : "$";
  const daily = leak / 22; // ~22 dias uteis
  const recLo = leak * 0.35,
    recHi = leak * 0.6;
  const [copied, setCopied] = useState(false);

  const painLabel = pain != null ? t.pains.find((p) => p.id === pain)?.t : "";
  const revLabel = revenue != null ? t.revenues[revenue] : "";
  const urgLabel = urgency != null ? t.urgencies.find((u) => u.id === urgency)?.t : "";
  const sol = pain != null ? SOLUTION[lang][pain] : null;

  const waText = encodeURIComponent(
    lang === "pt"
      ? `Olá Eduardo. Fiz o diagnóstico no site:\n• Dor: ${painLabel}\n• Faturamento: ${revLabel}\n• Urgência: ${urgLabel}\n• Vazamento estimado: ${fmt("pt", leak)}/mês (${fmt("pt", daily)} por dia útil)\n• Recuperável: ${cur}${bare(recLo)}–${bare(recHi)}/mês\nQuero conversar sobre a solução — ${sol?.t}.`
      : `Hi Eduardo. I ran the diagnosis on your site:\n• Pain: ${painLabel}\n• Revenue: ${revLabel}\n• Urgency: ${urgLabel}\n• Estimated leak: ${fmt("en", leak)}/mo (${fmt("en", daily)} per business day)\n• Recoverable: ${cur}${bare(recLo)}–${bare(recHi)}/mo\nI'd like to talk about the fix — ${sol?.t}.`
  );

  const stepNames = [t.steps.pain, t.steps.revenue, t.steps.urgency];

  const copyResult = async () => {
    const plain =
      lang === "pt"
        ? `Diagnóstico — Miranda Faria\n• Dor: ${painLabel}\n• Faturamento: ${revLabel}\n• Urgência: ${urgLabel}\n• Vazamento estimado: ${fmt("pt", leak)}/mês (${fmt("pt", daily)} por dia útil)\n• Recuperável: ${cur}${bare(recLo)}–${bare(recHi)}/mês\n• Solução apontada: ${sol?.t}`
        : `Diagnosis — Miranda Faria\n• Pain: ${painLabel}\n• Revenue: ${revLabel}\n• Urgency: ${urgLabel}\n• Estimated leak: ${fmt("en", leak)}/mo (${fmt("en", daily)} per business day)\n• Recoverable: ${cur}${bare(recLo)}–${bare(recHi)}/mo\n• Suggested fix: ${sol?.t}`;
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard indisponivel: o botao simplesmente nao marca */
    }
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
                  {i < 2 && <span className="mf-dg__steprule" aria-hidden="true" />}
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

            {/* PASSO 1 — o porte */}
            {phase === 1 && (
              <div className="mf-dg__panel" key="p1">
                <button type="button" className="mf-dg__back" onClick={() => setPhase(0)}>
                  ← {result.back}
                </button>
                <h2 className="mf-dg__q">{t.revenueQ}</h2>
                <p className="mf-dg__hint">{t.revenueHint}</p>
                <div className="mf-dg__opts mf-dg__opts--rev">
                  {t.revenues.map((r, i) => (
                    <button
                      key={r}
                      type="button"
                      className="mf-dg__opt mf-dg__opt--rev"
                      data-on={revenue === i ? "true" : "false"}
                      onClick={() => pick(setRevenue, 2)(i)}
                    >
                      <span className="mf-dg__optt">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASSO 2 — a urgencia */}
            {phase === 2 && (
              <div className="mf-dg__panel" key="p2">
                <button type="button" className="mf-dg__back" onClick={() => setPhase(1)}>
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
                      onClick={() => {
                        setUrgency(u.id);
                        clearTimeout(timer.current);
                        timer.current = setTimeout(() => setPhase(3), 260);
                      }}
                    >
                      <span className="mf-dg__optt">{u.t}</span>
                      <span className="mf-dg__optd">{u.d}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RESULTADO */}
            {phase === 3 && sol && (
              <div className="mf-dg__panel mf-dg__panel--result" key="p3">
                <p className="mf-label">{result.label}</p>
                <p className="mf-dg__num">{fmt(lang, shown)}</p>
                <p className="mf-dg__per">
                  {result.perMonth}
                  <span className="mf-dg__sep">·</span>
                  {fmt(lang, leak * 12)} {result.perYear}
                  <span className="mf-dg__sep">·</span>
                  {fmt(lang, daily)} {result.perDay}
                </p>
                <p className="mf-dg__reading">{result.reading}</p>
                {urgency === "now" && (
                  <p className="mf-dg__delay">
                    {result.delayCost} <strong>{fmt(lang, leak)}</strong>.
                  </p>
                )}

                <div className="mf-dg__recovery">
                  <p className="mf-label">
                    {result.recoveryLabel} <strong className="mf-dg__recrange">{cur}{bare(recLo)}–{bare(recHi)}</strong> {result.perMonth}
                  </p>
                  <p className="mf-dg__recnote">{result.recoveryNote}</p>
                </div>

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
                      setPain(null);
                      setRevenue(null);
                      setUrgency(null);
                      setPhase(0);
                    }}
                  >
                    {result.restart}
                  </button>
                </div>

                <details className="mf-dg__how">
                  <summary>{result.howLabel}</summary>
                  <p>{result.how}</p>
                </details>
                <p className="mf-dg__meta">{t.meta}</p>
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
  .mf-dg__opts--rev{grid-template-columns:repeat(4,1fr)}
  .mf-dg__opts--urg{grid-template-columns:repeat(3,1fr)}
}
.mf-dg__opt{
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
.mf-dg__per{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);margin:0.9rem 0 0;
}
.mf-dg__sep{margin:0 0.6rem;opacity:0.5}
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
.mf-dg__recrange{color:var(--mf-terracotta);font-weight:400;letter-spacing:0}
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
  background:var(--mf-terracotta);color:#16130f;
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

.mf-dg__how{margin-top:2.5rem;border-top:1px solid var(--color-divider);padding-top:1.2rem}
.mf-dg__how summary{
  cursor:pointer;font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);list-style-position:inside;
}
.mf-dg__how summary:hover{color:var(--color-text-primary)}
.mf-dg__how p{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0.9rem 0 0;max-width:64ch;
}
.mf-dg__meta{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);color:var(--color-text-ghost);
  margin:2rem 0 0;
}
      `}</style>
    </>
  );
}
