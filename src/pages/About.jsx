import React, { useRef } from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import HandoffDiagram from "@/components/HandoffDiagram";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * /about — a página de confiança.
 *
 * Antes eram três parágrafos e uma linha de localização, o que é pouco
 * para uma página inteira e não respondia nenhuma das perguntas que os
 * dois públicos realmente fazem.
 *
 * Agora responde quatro, na ordem em que aparecem na cabeça de quem lê:
 * quem é (retrato e texto), por que uma pessoa só (o diagrama de
 * passagem de bastão — o argumento mostrado, não afirmado), o que ele
 * cobre de fato (alcance), e onde ele para (limites).
 *
 * O bloco de limites é deliberado: nomear o que não se faz constrói mais
 * confiança do que esconder. Recrutador e cliente leem os dois como
 * sinal de que o resto é verdade.
 */
export default function About() {
  const { lang, path } = useLang();
  const t = copy[lang].about;
  const nav = copy[lang].nav;
  usePageTitle(t.label);

  const rangeRef = useRef(null);
  const limitsRef = useRef(null);
  useScrollStagger(rangeRef, { selector: ".mf-about__r", stagger: 0.1, y: 28 });
  useScrollStagger(limitsRef, { selector: "li", stagger: 0.09, y: 22 });

  return (
    <>
      {/* 1. Quem é */}
      <section className="mf-about">
        <div className="mf-about__inner">
          <div className="mf-about__grid">
            <Reveal>
              {/* Retrato real ainda pendente. Até lá, as iniciais na
                  moldura da marca — nunca foto de banco de imagem. */}
              <figure className="mf-about__portrait">
                <span className="mf-about__initials" aria-hidden="true">{t.portraitFallback}</span>
                <figcaption className="mf-label mf-about__caption">{t.name}</figcaption>
              </figure>
            </Reveal>

            <div>
              <Reveal><p className="mf-label">{t.label}</p></Reveal>
              <LineReveal as="h1" className="mf-about__lead">{t.lead}</LineReveal>
              <Reveal delay={140}>
                <div className="mf-about__body">
                  {t.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </Reveal>
              <Reveal delay={200}>
                <p className="mf-label mf-about__loc">{t.location}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <MfRule />

      {/* 2. Por que uma pessoa só — o argumento, desenhado */}
      <section className="mf-about__sec">
        <div className="mf-about__inner">
          <Reveal><p className="mf-label">{t.spanLabel}</p></Reveal>
          <LineReveal className="mf-about__h2">{t.spanLead}</LineReveal>
          <Reveal delay={140}>
            <p className="mf-about__p">{t.spanBody}</p>
          </Reveal>
          <div className="mf-about__diagram">
            <HandoffDiagram split={t.spanSplit} whole={t.spanWhole} seam={t.spanSeam} />
          </div>
        </div>
      </section>

      <MfRule />

      {/* 3. O que cobre */}
      <section className="mf-about__sec">
        <div className="mf-about__inner">
          <Reveal><p className="mf-label">{t.rangeLabel}</p></Reveal>
          <div ref={rangeRef} className="mf-about__range mf-stage">
            {t.range.map((r, i) => (
              <article className="mf-about__r" key={r.t}>
                <span className="mf-about__rnum">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mf-about__rname">{r.t}</h2>
                <p className="mf-about__rdesc">{r.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MfRule />

      {/* 4. Onde para */}
      <section className="mf-about__sec">
        <div className="mf-about__inner">
          <Reveal><p className="mf-label">{t.limitsLabel}</p></Reveal>
          <ul ref={limitsRef} className="mf-about__limits">
            {t.limits.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <Reveal delay={140}>
            <Link to={path("contact")} className="mf-about__cta" data-cursor="link">
              {nav.contact} →
            </Link>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-about{padding:clamp(3rem,9vh,6rem) var(--gutter) clamp(2.5rem,6vh,4rem)}
.mf-about__sec{padding:var(--section-gap) var(--gutter)}
.mf-about__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-about__grid{display:grid;grid-template-columns:1fr;gap:3rem;align-items:start}
@media(min-width:768px){
  .mf-about__grid{grid-template-columns:5fr 7fr;gap:clamp(2.5rem,6vw,5rem)}
}

.mf-about__portrait{
  margin:0;position:relative;width:100%;aspect-ratio:4/5;
  background:var(--paper);border:1px solid var(--color-divider);
  display:flex;align-items:flex-end;padding:1.25rem;
}
.mf-about__initials{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(3rem,9vw,5.5rem);letter-spacing:var(--tracking-wordmark);
  color:var(--color-text-ghost);
}
.mf-about__caption{position:relative;color:var(--color-text-ghost)}

.mf-about__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 2rem;
}
.mf-about__h2{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.1;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-about__body p,.mf-about__p{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0 0 1.4rem;max-width:var(--max-width-body);
}
.mf-about__p{font-size:var(--text-body-lg);margin:2rem 0 0}
.mf-about__body p:first-child{color:var(--color-text-primary)}
.mf-about__body p:last-child{margin-bottom:0}
.mf-about__loc{margin:2rem 0 0}

.mf-about__diagram{margin:clamp(2.5rem,6vh,4rem) 0 0;max-width:60rem}

.mf-about__range{
  display:grid;grid-template-columns:1fr;gap:0;margin-top:2.5rem;
  border-top:1px solid var(--color-divider);
}
@media(min-width:860px){.mf-about__range{grid-template-columns:1fr 1fr;gap:0 clamp(2rem,5vw,4rem)}}
.mf-about__r{
  display:flex;flex-direction:column;gap:.8rem;
  padding:clamp(1.6rem,3.4vh,2.4rem) 0;border-bottom:1px solid var(--color-divider);
}
.mf-about__rnum{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-about__rname{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.12;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
}
.mf-about__rdesc{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:46ch;
}

.mf-about__limits{
  list-style:none;margin:2.5rem 0 0;padding:0;
  border-top:1px solid var(--color-divider);
}
.mf-about__limits li{
  padding:1.4rem 0 1.4rem 2.5rem;position:relative;
  border-bottom:1px solid var(--color-divider);
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:62ch;
}
/* Um traço, não um X: é limite, não erro. */
.mf-about__limits li::before{
  content:"";position:absolute;left:0;top:2.05rem;
  width:14px;height:1px;background:var(--color-accent);
}

.mf-about__cta{
  display:inline-block;margin-top:2.75rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--color-accent);padding-bottom:4px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-about__cta:hover{opacity:.65}
      `}</style>
    </>
  );
}
