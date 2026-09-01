import React from "react";
import Link from "@/components/TransitionLink";
import { Navigate, useParams } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import ArtSlot from "@/components/ArtSlot";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { usePageTitle } from "@/lib/usePageTitle";
import { copy, getPractice, casesOfPractice, processSteps } from "@/content/copy";

/**
 * As tres verticais — /systems, /design, /business — compartilham
 * estrutura e variam em conteudo e assinatura visual. Uma pagina so,
 * dirigida pelo slug, em vez de tres arquivos quase identicos.
 *
 * Cada aba e uma experiencia completa (DECISIONS.md): abre com a
 * assinatura propria, mostra o que entrega, o processo, e fecha com os
 * cases daquela disciplina. Os cases sao transversais — /work continua
 * listando todos.
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
  usePageTitle(p ? p.label : t.nav.work);

  if (!p) return <Navigate to={path()} replace />;

  const list = casesOfPractice(lang, slug);
  const steps = processSteps[lang];

  return (
    <>
      <PageHeader label={p.label} lead={p.lead} intro={p.intro} />

      <ArtSlot variant={slug} name={slug} alt={p.artAlt} />

      <MfRule />

      {/* O que entrego */}
      <section className="mf-pr" data-depth="0.22">
        <div className="mf-pr__inner">
          <Reveal>
            <p className="mf-label">{p.deliverablesLabel}</p>
          </Reveal>
          <div className="mf-pr__grid mf-stage">
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

      <MfRule />

      {/* Processo — igual nas tres verticais, e esse e o argumento */}
      <section className="mf-pr" data-depth="0.34">
        <div className="mf-pr__inner">
          <Reveal>
            <p className="mf-label">{steps.label}</p>
          </Reveal>
          <div className="mf-pr__steps mf-stage">
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
                    <h3 className="mf-pr__casename">{c.name}</h3>
                    <span className="mf-label">{c.sector}</span>
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

      <MfRule />

      <section className="mf-pr" data-depth="0.94">
        <div className="mf-pr__inner">
          <LineReveal className="mf-pr__closing">{t.contact.lead}</LineReveal>
          <Reveal delay={140}>
            <Link to={path("contact")} className="mf-pr__cta" data-cursor="link">
              {p.cta} →
            </Link>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-pr{padding:var(--section-gap) var(--gutter)}
.mf-pr__inner{max-width:var(--max-width-page);margin:0 auto}

.mf-pr__grid{display:grid;grid-template-columns:1fr;gap:0;margin-top:2.5rem;
  border-top:1px solid var(--color-divider)}
@media(min-width:860px){
  .mf-pr__grid{grid-template-columns:1fr 1fr;gap:0 clamp(2rem,5vw,4rem)}
}
.mf-pr__item{display:flex;flex-direction:column;gap:0.8rem;
  padding:clamp(1.8rem,3.5vh,2.6rem) 0;border-bottom:1px solid var(--color-divider)}
.mf-pr__num{font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost)}
.mf-pr__name{font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.12;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0}
.mf-pr__desc{font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:48ch}

.mf-pr__steps{margin-top:2.5rem;border-top:1px solid var(--color-divider)}
.mf-pr__step{display:grid;grid-template-columns:3.5rem 1fr;gap:0 clamp(1rem,3vw,2.5rem);
  align-items:baseline;padding:1.6rem 0;border-bottom:1px solid var(--color-divider)}
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

.mf-pr__cases{margin-top:2.5rem;border-top:1px solid var(--color-divider)}
.mf-pr__case{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
  gap:0.5rem 1.5rem;padding:clamp(1.4rem,3vh,2rem) 0;
  border-bottom:1px solid var(--color-divider);
  text-decoration:none;color:inherit;
  transition:transform var(--duration-base) var(--ease-out-expo)}
.mf-pr__case:hover{transform:translateX(14px)}
.mf-pr__casename{font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.08;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
  transition:color var(--duration-fast) var(--ease-in-out)}
.mf-pr__case:hover .mf-pr__casename{color:var(--color-accent)}

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

@media(prefers-reduced-motion:reduce){
  .mf-pr__case,.mf-pr__case:hover{transform:none;transition:none}
}
      `}</style>
    </>
  );
}
