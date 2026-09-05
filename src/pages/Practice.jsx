import React, { useRef } from "react";
import Link from "@/components/TransitionLink";
import { Navigate, useParams } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { usePageTitle } from "@/lib/usePageTitle";
import { copy, getPractice, casesOfPractice, processSteps, designSteps } from "@/content/copy";
import AutoVideo from "@/components/AutoVideo";
import { DESIGN_SIGN, DESIGN_POSTER, DESIGN_LAYERS, DESIGN_SEAM } from "@/lib/site";
import LedgerFlow from "@/components/LedgerFlow";
import VisitorFlow from "@/components/VisitorFlow";

/**
 * As tres verticais — /systems, /design, /business — compartilham
 * estrutura e variam em conteudo e assinatura visual. Uma pagina so,
 * dirigida pelo slug, em vez de tres arquivos quase identicos.
 *
 * A aba Design tem abertura propria: a entrada do escritorio — o
 * principal asset da pagina — abre o filme em tela cheia com o lead
 * sobreposto; a vitrine generativa vira a tese "Qualquer um gera.
 * Escolher e o trabalho."; e o fecho e um discurso proprio, nao o lead
 * generico do contato.
 *
 * Sem divisorias internas: o ritmo vem do espacamento e dos numeros,
 * nao de linhas entre os itens — tudo continuo.
 */
export default function Practice({ slug: slugProp }) {
  // Rotas estaticas passam o slug por prop; o param cobre o caso de a
  // rota virar dinamica depois. Estatico vence para /systems, /design e
  // /business nao competirem com /work e /about no ranking do router.
  const { practice: slugParam } = useParams();
  const slug = slugProp ?? slugParam;
  const { lang, path } = useLang();

  const p = getPractice(lang, slug);
  const t = copy[lang];

  // Antes do return antecipado: hook nao pode ficar atras de condicional.
  usePageTitle(p ? p.label : t.nav.work, "practice");

  const deliverRef = useRef(null);
  const stepsRef = useRef(null);
  useScrollStagger(deliverRef, { selector: ".mf-pr__item", stagger: 0.1, y: 32 });
  useScrollStagger(stepsRef, { selector: ".mf-pr__step", stagger: 0.1, y: 26 });

  if (!p) return <Navigate to={path()} replace />;

  const isDesign = slug === "design";
  const list = casesOfPractice(lang, slug);
  const steps = isDesign ? designSteps[lang] : processSteps[lang];

  return (
    <>
      {isDesign ? (
        <>
          {/* ABERTURA — a entrada do escritorio em tela cheia, o lead
              sobreposto. O video e o principal asset da pagina: nao e
              mais um quadro no fim da vitrine, e o filme que abre. */}
          <section className="mf-dsg-open" data-theme="dark" aria-labelledby="dsg-lead">
            <AutoVideo
              className="mf-dsg-open__video"
              src={DESIGN_SIGN}
              poster={DESIGN_POSTER}
              label={p.gen.capB}
            />
            <div className="mf-dsg-open__veil" aria-hidden="true" />
            <div className="mf-dsg-open__overlay">
              <Reveal>
                <p className="mf-label">{p.label}</p>
              </Reveal>
              <LineReveal as="h1" id="dsg-lead" className="mf-dsg-open__lead">
                {p.lead}
              </LineReveal>
            </div>
            <Reveal delay={340} className="mf-dsg-open__capwrap">
              <span className="mf-label mf-dsg-open__cap">{p.gen.capB}</span>
            </Reveal>
          </section>

          {/* INTRO — continua o filme em texto, na pagina clara. */}
          <section className="mf-pr mf-dsg-intro" data-depth="0.08">
            <div className="mf-pr__inner">
              <Reveal>
                <p className="mf-dsg-intro__p">{p.intro}</p>
              </Reveal>
            </div>
          </section>

          {/* TESE — o argumento da aba inteira em uma frase. */}
          <section className="mf-pr" data-depth="0.16">
            <div className="mf-pr__inner">
              <Reveal>
                <p className="mf-label">{p.gen.label}</p>
              </Reveal>
              <LineReveal as="h2" className="mf-dsg-thesis">{p.gen.title}</LineReveal>
              <Reveal delay={120}>
                <p className="mf-dsg-thesis__d">{p.gen.desc}</p>
              </Reveal>
            </div>
          </section>
        </>
      ) : (
        <>
          <PageHeader label={p.label} lead={p.lead} intro={p.intro} />

          {/* ASSINATURA VIVA — a tese da vertical em canvas, tocavel:
              a planilha que decide (Gestao) e os visitantes que viram
              conversa (Desenvolvimento). */}
          <section className="mf-pr__artband" data-depth="0.14">
            {slug === "gestao" ? (
              <LedgerFlow label={p.artLabel} hint={p.artHint} alt={p.artAlt} />
            ) : (
              <VisitorFlow label={p.artLabel} hint={p.artHint} alt={p.artAlt} />
            )}
          </section>

          {/* TESE — cada vertical com o seu argumento em uma frase,
              no mesmo padrao da aba Design. */}
          <section className="mf-pr mf-dsg-intro" data-depth="0.16">
            <div className="mf-pr__inner">
              <Reveal>
                <p className="mf-label">{p.thesis.label}</p>
              </Reveal>
              <LineReveal as="h2" className="mf-dsg-thesis">{p.thesis.title}</LineReveal>
              <Reveal delay={120}>
                <p className="mf-dsg-thesis__d">{p.thesis.desc}</p>
              </Reveal>
            </div>
          </section>
        </>
      )}

      <MfRule />

      {/* O que entrego */}
      <section className="mf-pr" data-depth="0.22">
        <div className="mf-pr__inner">
          <Reveal>
            <p className="mf-label">{p.deliverablesLabel}</p>
          </Reveal>
          <div ref={deliverRef} className="mf-pr__grid mf-stage">
            {p.deliverables.map((d, i) => (
              <article className="mf-pr__item" key={d.t}>
                <span className="mf-pr__num">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mf-pr__name">{d.t}</h2>
                <p className="mf-pr__desc">{d.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Processo — igual nas tres verticais, e esse e o argumento */}
      <section className="mf-pr" data-depth="0.34">
        <div className="mf-pr__inner">
          <Reveal>
            <p className="mf-label">{steps.label}</p>
          </Reveal>
          <div ref={stepsRef} className="mf-pr__steps mf-stage">
            {steps.steps.map((st, i) => (
              <div className="mf-pr__step" key={st.t}>
                <span className="mf-pr__stepnum">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="mf-pr__steptitle">{st.t}</h3>
                  <p className="mf-pr__stepdesc">{st.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANDA — a arte generativa em movimento entre o processo e os
          cases: a prova do metodo em tela cheia. */}
      {isDesign && (
        <section
          className="mf-dsg-band"
          aria-label={p.gen.capLayers ?? p.gen.capA}
        >
          <figure className="mf-dsg-band__fig">
            <AutoVideo
              className="mf-dsg-band__video"
              src={DESIGN_LAYERS}
              label={p.gen.capLayers ?? p.gen.capA}
            />
          </figure>
          <Reveal delay={120} className="mf-dsg-band__capwrap">
            <span className="mf-label mf-dsg-band__cap">
              {p.gen.capLayers ?? p.gen.capA}
            </span>
          </Reveal>
        </section>
      )}

      {/* PROVAS — escritas no copy desde o comeco e nunca renderizadas. */}
      {p.proofs && p.proofs.length > 0 && (
        <section className="mf-pr" data-depth="0.46">
          <div className="mf-pr__inner">
            <Reveal>
              <p className="mf-label">{p.proofLabel}</p>
            </Reveal>
            <div className="mf-pr__proofs mf-stage">
              {p.proofs.map((pr, i) => (
                <Reveal key={i} delay={i * 90} className="mf-pr__proof">
                  <span className="mf-pr__num">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mf-pr__prooftext">{pr}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Os cases desta vertical */}
      {list.length > 0 && (
        <>
          <MfRule />
          <section className="mf-pr" data-depth="0.88">
            <div className="mf-pr__inner">
              <Reveal>
                <p className="mf-label">{p.casesLabel}</p>
              </Reveal>
              <div className="mf-pr__cases">
                {list.map((c) => (
                  <Link
                    key={c.slug}
                    to={path(`work/${c.slug}`)}
                    className="mf-pr__case"
                    data-cursor="link"
                  >
                    <span className="mf-pr__casehead">
                      <h3 className="mf-pr__casename">{c.name}</h3>
                      <span className="mf-label">{c.sector}</span>
                    </span>
                    <p className="mf-pr__casehook">{c.summary}</p>
                  </Link>
                ))}
              </div>
              <Reveal delay={120}>
                <Link to={path("work")} className="mf-pr__cta" data-cursor="link">
                  {t.home.workTeaser.cta} →
                </Link>
              </Reveal>
            </div>
          </section>
        </>
      )}

      {!isDesign && <MfRule />}

      <section
        className={`mf-pr ${isDesign ? "mf-dsg-close" : ""}`}
        data-depth="0.94"
        data-theme={isDesign ? "dark" : undefined}
      >
        {isDesign && (
          <>
            <AutoVideo
              className="mf-dsg-close__video"
              src={DESIGN_SEAM}
              label={p.gen.capSeam ?? ""}
            />
            <div className="mf-dsg-close__veil" aria-hidden="true" />
          </>
        )}
        <div className="mf-pr__inner">
          <LineReveal className="mf-pr__closing">
            {p.closingLine ?? t.contact.lead}
          </LineReveal>
          <Reveal delay={140}>
            <Link
              to={path("contact")}
              className="mf-pr__cta mf-pr__cta--main"
              data-cursor="link"
            >
              {p.closingCtaLabel ?? p.cta} →
            </Link>
            {p.closingCta && (
              <Link
                to={path(p.closingCta.to)}
                className="mf-pr__cta mf-pr__cta--ghost"
                data-cursor="link"
              >
                {p.closingCta.label} →
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      <style>{`
/* ==== ABERTURA (Design) — entrada do escritorio em tela cheia ==== */
.mf-dsg-open{position:relative;height:min(92vh,820px);min-height:560px;overflow:hidden}
.mf-dsg-open__video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mf-dsg-open__veil{position:absolute;inset:0;
  background:linear-gradient(180deg,
    rgba(20,19,18,0.34) 0%,
    rgba(20,19,18,0.02) 38%,
    rgba(20,19,18,0.18) 62%,
    rgba(20,19,18,0.72) 100%)}
.mf-dsg-open__overlay{position:absolute;left:var(--gutter);right:var(--gutter);
  bottom:clamp(4.5rem,14vh,8rem);max-width:var(--max-width-page);margin:0 auto}
.mf-dsg-open__lead{font-family:var(--font-display);font-weight:400;
  font-size:clamp(2.4rem,6.5vw,var(--text-display-xl));line-height:1.06;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:0.9rem 0 0;max-width:14ch;text-wrap:balance}
.mf-dsg-open__capwrap{position:absolute;right:var(--gutter);bottom:1.2rem}
.mf-dsg-open__cap{color:rgba(245,241,234,0.55)}
@media(max-width:760px){
  .mf-dsg-open{height:78vh;min-height:480px}
  .mf-dsg-open__lead{font-size:clamp(2rem,9vw,3rem);max-width:12ch}
}

/* ==== INTRO + TESE (Design) ==== */
.mf-dsg-intro{padding-top:clamp(3.5rem,8vh,6rem)}
.mf-dsg-intro__p{font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:56ch;margin:0}
.mf-dsg-thesis{font-family:var(--font-display);font-weight:400;
  font-size:clamp(2.2rem,5.6vw,var(--text-display-xl));line-height:1.04;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1rem 0 1.3rem;max-width:20ch;text-wrap:balance}
.mf-dsg-thesis__d{max-width:60ch;color:var(--color-text-secondary);
  font-size:var(--text-body-md);line-height:1.65;margin:0}

/* ==== BANDA — particulas full-bleed entre processo e cases ==== */
.mf-dsg-band{position:relative;margin:0}
.mf-dsg-band__fig{margin:0}
.mf-dsg-band__video{width:100%;display:block;aspect-ratio:21/9;object-fit:cover}
.mf-dsg-band__capwrap{position:absolute;left:var(--gutter);bottom:1.2rem}
.mf-dsg-band__cap{color:rgba(245,241,234,0.6)}
@media(max-width:900px){.mf-dsg-band__video{aspect-ratio:16/9}}

/* ==== FECHAMENTO (Design) — o veio de cobre atras do convite ====
   O video nao decora: o veio incandescente que corre no eixo do canion e a
   mesma linha de cobre que atravessa o site. O veu escuro garante contraste
   de texto (AA) sobre qualquer quadro do loop. */
.mf-dsg-close{position:relative;overflow:hidden;isolation:isolate}
.mf-dsg-close__video{position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;z-index:0}
.mf-dsg-close__veil{position:absolute;inset:0;z-index:1;
  background:
    radial-gradient(120% 90% at 50% 55%, rgba(20,19,18,0.28) 0%, rgba(20,19,18,0.82) 68%, rgba(20,19,18,0.94) 100%),
    linear-gradient(180deg, rgba(20,19,18,0.9) 0%, rgba(20,19,18,0.4) 22%, rgba(20,19,18,0.5) 70%, rgba(20,19,18,0.92) 100%)}
.mf-dsg-close .mf-pr__inner{position:relative;z-index:2;
  padding-top:clamp(6rem,16vh,10rem);padding-bottom:clamp(6rem,16vh,10rem)}
.mf-dsg-close .mf-pr__closing{color:var(--mf-bone,#F5F1EA)}
.mf-dsg-close .mf-pr__cta{color:var(--mf-bone,#F5F1EA);
  border-color:rgba(245,241,234,0.28)}
.mf-dsg-close .mf-pr__cta--main{color:var(--mf-bone,#F5F1EA)}
.mf-dsg-close .mf-pr__cta--ghost{color:rgba(245,241,234,0.62)}
.mf-dsg-close .mf-pr__cta:hover{color:#fff;border-color:rgba(245,241,234,0.55)}
@media(prefers-reduced-motion:reduce){
  .mf-dsg-close__video{display:none}
  .mf-dsg-close{background:var(--mf-graphite,#141414)}
}

.mf-pr{padding:var(--section-gap) var(--gutter)}
.mf-pr__inner{max-width:var(--max-width-page);margin:0 auto}

/* Grid continuo — o ritmo vem do numero e do espaco, nao de linhas. */
.mf-pr__grid{display:grid;grid-template-columns:1fr;gap:clamp(1.8rem,4vh,2.8rem);margin-top:2.5rem}
@media(min-width:860px){
  .mf-pr__grid{grid-template-columns:1fr 1fr;gap:clamp(2rem,5vh,3.5rem) clamp(2rem,5vw,4rem)}
}
.mf-pr__item{display:flex;flex-direction:column;gap:0.8rem;padding:0}
.mf-pr__num{font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost)}
.mf-pr__name{font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.12;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0}
.mf-pr__desc{font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:48ch}

.mf-pr__steps{margin-top:2.5rem;display:flex;flex-direction:column;gap:clamp(1.8rem,4.5vh,3rem)}
.mf-pr__artband{padding:0;margin:0}
.mf-sig{position:relative;margin:0;height:clamp(360px,56vh,580px);overflow:hidden;background:var(--color-bg)}
.mf-sig__canvas{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:crosshair}
.mf-sig__cap{position:absolute;left:clamp(1.1rem,4vw,3.2rem);bottom:1.1rem;display:flex;flex-direction:column;gap:.25rem;padding:.7rem .95rem;background:var(--color-bg);opacity:.92;pointer-events:none;max-width:min(78vw,34ch)}
.mf-sig__label{font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--color-accent)}
.mf-sig__hint{font-size:13px;line-height:1.5;color:var(--color-text-secondary)}
.mf-sig__count{font-family:var(--font-mono);color:var(--color-accent)}
@media (max-width:640px){.mf-sig{height:clamp(300px,46vh,420px)}.mf-sig__hint{font-size:12px}}
.mf-pr__proofs{margin-top:2.5rem;display:grid;grid-template-columns:1fr;gap:clamp(1.6rem,4vh,2.6rem)}
@media(min-width:860px){.mf-pr__proofs{grid-template-columns:1fr 1fr;gap:clamp(2rem,5vh,3.5rem) clamp(2rem,5vw,4rem)}}
.mf-pr__proof{display:flex;gap:1rem;align-items:baseline}
.mf-pr__prooftext{margin:0;font-size:var(--text-body-md);line-height:1.65;color:var(--color-text-secondary)}
.mf-pr__step{display:grid;grid-template-columns:3.5rem 1fr;gap:0 clamp(1rem,3vw,2.5rem);
  align-items:baseline;padding:0}
.mf-pr__stepnum{font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost)}
.mf-pr__steptitle{font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.14;margin:0 0 0.5rem;
  color:var(--color-text-primary)}
.mf-pr__stepdesc{font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:52ch}
@media(max-width:767px){
  .mf-pr__step{grid-template-columns:1fr;gap:0.4rem}
}

.mf-pr__cases{margin-top:2.5rem;display:flex;flex-direction:column}
.mf-pr__case{display:flex;flex-direction:column;gap:0.7rem;
  padding:clamp(1.6rem,3.5vh,2.4rem) 0;
  text-decoration:none;color:inherit;
  transition:transform var(--duration-base) var(--ease-out-expo)}
.mf-pr__case:hover{transform:translateX(14px)}
.mf-pr__casehead{display:flex;flex-wrap:wrap;align-items:baseline;
  justify-content:space-between;gap:0.4rem 1.5rem}
.mf-pr__casename{font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.12;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
  transition:color var(--duration-fast) var(--ease-in-out)}
.mf-pr__case:hover .mf-pr__casename{color:var(--color-accent)}
.mf-pr__casehook{font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:64ch}

.mf-pr__closing{font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0}

.mf-pr__cta{display:inline-block;margin-top:2.5rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--color-accent);padding-bottom:4px;
  transition:opacity var(--duration-fast) var(--ease-in-out)}
.mf-pr__cta:hover{opacity:0.65}
.mf-pr__cta--ghost{margin-left:2.5rem;border-bottom-color:transparent;
  color:var(--color-text-secondary)}
@media(max-width:767px){
  .mf-pr__cta--ghost{display:block;margin:1.2rem 0 0}
}

@media(prefers-reduced-motion:reduce){
  .mf-pr__case,.mf-pr__case:hover{transform:none;transition:none}
}
      `}</style>
    </>
  );
}
