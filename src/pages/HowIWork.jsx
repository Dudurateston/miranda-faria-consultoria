import React, { useRef } from "react";
import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { CORTE_GIF } from "@/lib/site";

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
  usePageTitle(t.label);

  useScrollStagger(layersRef, { selector: ".mf-hiw__layer", stagger: 0.12, y: 36 });

  return (
    <>
      <PageHeader label={t.label} lead={t.lead} intro={t.intro} />
      <MfRule />

      <section className="mf-hiw" data-depth="0.30">
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

      {/* Stack — GIF integrado em simbiose com o fundo: mascara suave,
          opacidade baixa, sem moldura de quadrado. */}
      <section className="mf-hiw__stackwrap" data-depth="0.60">
        <img className="mf-hiw__stackbg" src={CORTE_GIF} alt="" aria-hidden="true" loading="lazy" />
        <div className="mf-hiw__stackinner">
          <Reveal>
            <p className="mf-label">{t.stack.label}</p>
          </Reveal>
          <LineReveal className="mf-hiw__stacklead">{t.stack.lead}</LineReveal>
          <ul className="mf-hiw__stacklist">
            {t.stack.items.map((s, i) => (
              <Reveal key={s} delay={i * 70}>
                <li>{s}</li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mf-hiw__ai" data-depth="0.90">
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
  padding:clamp(1.4rem,3vh,2.2rem) 0;
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
.mf-hiw__text{display:flex;flex-direction:column;gap:0.6rem}
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
.mf-hiw__stackwrap{position:relative;padding:var(--section-gap) var(--gutter);overflow:hidden}
.mf-hiw__stackbg{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  opacity:0.14;pointer-events:none;
  -webkit-mask-image:linear-gradient(180deg,transparent 0%,black 25%,black 75%,transparent 100%);
  mask-image:linear-gradient(180deg,transparent 0%,black 25%,black 75%,transparent 100%);
}
.mf-hiw__stackinner{position:relative;max-width:var(--max-width-page);margin:0 auto}
.mf-hiw__stacklead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-hiw__stacklist{list-style:none;margin:2.25rem 0 0;padding:0;
  display:grid;grid-template-columns:1fr;gap:0}
@media(min-width:768px){.mf-hiw__stacklist{grid-template-columns:1fr 1fr;gap:0 2.5rem}}
.mf-hiw__stacklist li{
  padding:0.85rem 0;border-bottom:1px solid var(--mf-rule);
  font-family:var(--font-mono);font-size:var(--text-body-md);
  letter-spacing:0.04em;color:var(--color-text-secondary);
}
      `}</style>
    </>
  );
}
