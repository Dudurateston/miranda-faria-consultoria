import React, { useRef } from "react";
import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * As quatro camadas sao o motivo de estratos aplicado ao conteudo, nao
 * so a decoracao: cada camada desce um nivel de profundidade
 * (superficie -> sistema -> dados -> fundacao) e o tom do fundo
 * acompanha a descida.
 */
export default function HowIWork() {
  const { lang } = useLang();
  const t = copy[lang].howIWork;
  const layersRef = useRef(null);
  const handRef = useRef(null);
  usePageTitle(t.label);

  useScrollStagger(layersRef, { selector: ".mf-hiw__layer", stagger: 0.12, y: 36 });
  useScrollStagger(handRef, { selector: ".mf-hiw__hitem", stagger: 0.1, y: 28 });

  return (
    <>
      <PageHeader label={t.label} lead={t.lead} intro={t.intro} />
      <MfRule />

      <section className="mf-hiw" data-depth="0.22">
        <div ref={layersRef} className="mf-hiw__stack mf-stage">
          {t.layers.map((l, i) => (
            <article
              className="mf-hiw__layer"
              key={l.t}
              style={{ "--depth": i }}
            >
              <span className="mf-hiw__num">{String(i + 1).padStart(2, "0")}</span>
              <div className="mf-hiw__text">
                <h2 className="mf-hiw__name">{l.t}</h2>
                <p className="mf-hiw__desc">{l.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <MfRule />

      {/* A pergunta que de fato trava a contratacao de quem trabalha
          sozinho. Merece resposta estrutural, nao tranquilizacao.
          Fica ANTES do bloco sobre IA e no patamar claro: e argumento
          de confianca, e confianca se le melhor sem drama de cor. */}
      <section className="mf-hiw__hand" data-depth="0.30">
        <div className="mf-hiw__aiinner">
          <Reveal><p className="mf-label">{t.handover.label}</p></Reveal>
          <LineReveal className="mf-hiw__ailead">{t.handover.lead}</LineReveal>
          <Reveal delay={140}>
            <p className="mf-hiw__aibody">{t.handover.body}</p>
          </Reveal>
          <div ref={handRef} className="mf-hiw__hlist mf-stage">
            {t.handover.items.map((it, i) => (
              <article className="mf-hiw__hitem" key={it.t}>
                <span className="mf-hiw__hnum">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mf-hiw__hname">{it.t}</h3>
                <p className="mf-hiw__hdesc">{it.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mf-hiw__ai" data-depth="0.96">
        <div className="mf-hiw__aiinner">
          <Reveal>
            <p className="mf-label">{t.ai.label}</p>
          </Reveal>
          <LineReveal className="mf-hiw__ailead">{t.ai.lead}</LineReveal>
          <Reveal delay={140}>
            <p className="mf-hiw__aibody">{t.ai.body}</p>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-hiw{padding:0 var(--gutter) var(--section-gap)}
.mf-hiw__stack{max-width:var(--max-width-page);margin:0 auto}

.mf-hiw__layer{
  display:grid;grid-template-columns:4.5rem 1fr;
  gap:0 clamp(1.5rem,4vw,3rem);align-items:baseline;
  padding:clamp(2rem,4.5vh,3.4rem) 0;
  border-bottom:1px solid var(--color-divider);
  /* cada camada assenta um pouco mais escura que a anterior */
  background:linear-gradient(
    to right,
    rgba(26,26,24,calc(0.014 * var(--depth))) 0%,
    transparent 62%
  );
}
.mf-hiw__layer:first-child{border-top:1px solid var(--color-divider)}
.mf-hiw__num{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-hiw__text{display:flex;flex-direction:column;gap:0.9rem}
.mf-hiw__name{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.08;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
}
.mf-hiw__desc{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:56ch;
}
@media(max-width:767px){
  .mf-hiw__layer{grid-template-columns:1fr;gap:0.6rem}
}

.mf-hiw__ai{padding:var(--section-gap) var(--gutter)}
.mf-hiw__hand{padding:var(--section-gap) var(--gutter)}
.mf-hiw__hlist{
  display:grid;grid-template-columns:1fr;gap:0;margin-top:2.75rem;
  border-top:1px solid var(--color-divider);
}
@media(min-width:860px){.mf-hiw__hlist{grid-template-columns:1fr 1fr;gap:0 clamp(2rem,5vw,4rem)}}
.mf-hiw__hitem{
  display:flex;flex-direction:column;gap:.8rem;
  padding:clamp(1.7rem,3.5vh,2.5rem) 0;border-bottom:1px solid var(--color-divider);
}
.mf-hiw__hnum{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-hiw__hname{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.12;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
}
.mf-hiw__hdesc{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:48ch;
}
.mf-hiw__aiinner{max-width:var(--max-width-page);margin:0 auto}
.mf-hiw__ailead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-hiw__aibody{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2.25rem 0 0;
}
      `}</style>
    </>
  );
}
