import React, { useRef } from "react";
import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import TerraformCanvas from "@/components/TerraformCanvas";
import MotionCurves from "@/components/MotionCurves";
import FrameTimeGraph from "@/components/FrameTimeGraph";
import { usePageTitle } from "@/lib/usePageTitle";
import { CORTE_GIF, TEXTURE_MACRO } from "@/lib/site";
import AutoVideo from "@/components/AutoVideo";

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
  usePageTitle(t.label, "how");

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
        <AutoVideo className="mf-hiw__stackbg" src={CORTE_GIF} />
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

      {/* Demo ao vivo — a prova da capacidade rodando no navegador do visitante. */}
      <section className="mf-hiw__demo" data-depth="0.80">
        {/* Textura macro gerada por IA — camada sutil de fundo, sem
            moldura: a secao respira por cima da arte. */}
        <img
          className="mf-hiw__texbg"
          src={TEXTURE_MACRO}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="1920"
          height="1080"
        />
        <div className="mf-hiw__demoinner">
          <Reveal>
            <p className="mf-label">{t.demo.label}</p>
          </Reveal>
          <LineReveal className="mf-hiw__demolead">{t.demo.lead}</LineReveal>
          <Reveal delay={140}>
            <p className="mf-hiw__demobody">{t.demo.body}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mf-hiw__demogrid">
              <div className="mf-hiw__democell mf-hiw__democell--wide">
                <TerraformCanvas />
                <div className="mf-hiw__democap">
                  <span className="mf-hiw__demotag">{t.demo.items[0].tag}</span>
                  <span className="mf-hiw__demoname">{t.demo.items[0].name}</span>
                  <span className="mf-hiw__democapd">{t.demo.items[0].caption}</span>
                  <span className="mf-hiw__demohint">{t.demo.items[0].hint}</span>
                </div>
              </div>
              <div className="mf-hiw__democell">
                <MotionCurves />
                <div className="mf-hiw__democap">
                  <span className="mf-hiw__demotag">{t.demo.items[1].tag}</span>
                  <span className="mf-hiw__demoname">{t.demo.items[1].name}</span>
                  <span className="mf-hiw__democapd">{t.demo.items[1].caption}</span>
                  <span className="mf-hiw__demohint">{t.demo.items[1].hint}</span>
                </div>
              </div>
              <div className="mf-hiw__democell">
                <FrameTimeGraph />
                <div className="mf-hiw__democap">
                  <span className="mf-hiw__demotag">{t.demo.items[2].tag}</span>
                  <span className="mf-hiw__demoname">{t.demo.items[2].name}</span>
                  <span className="mf-hiw__democapd">{t.demo.items[2].caption}</span>
                  <span className="mf-hiw__demohint">{t.demo.items[2].hint}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <MfRule />

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
/* Fundo generativo da seção demo — textura que some nas bordas. */
.mf-hiw__demo{position:relative}
.mf-hiw__texbg{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  opacity:0.12;pointer-events:none;
  -webkit-mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);
  mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);
}
.mf-hiw__demo .mf-hiw__inner{position:relative}

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

.mf-hiw__demo{padding:var(--section-gap) var(--gutter)}
.mf-hiw__demoinner{max-width:var(--max-width-page);margin:0 auto}
.mf-hiw__demolead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;max-width:16ch;text-wrap:balance;
}
.mf-hiw__demobody{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:58ch;margin:1.6rem 0 0;
}
.mf-hiw__demogrid{
  display:grid;grid-template-columns:1fr;gap:1.6rem;margin-top:1.8rem;
}
@media(min-width:860px){.mf-hiw__demogrid{grid-template-columns:1fr 1fr}}
.mf-hiw__democell{display:flex;flex-direction:column}
.mf-hiw__democell--wide{grid-column:1 / -1}
.mf-hiw__democap{
  display:flex;flex-wrap:wrap;align-items:baseline;gap:0.35rem 0.9rem;
  margin:0.85rem 0 0;padding:0 0.2rem;
}
.mf-hiw__demotag{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--mf-terracotta);
}
.mf-hiw__demoname{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);
}
.mf-hiw__democapd{
  flex-basis:100%;font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:58ch;
}
.mf-hiw__demohint{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta);flex-basis:100%;margin-top:0.15rem;
}
.mf-tf{
  position:relative;margin:0;height:clamp(280px,44vh,420px);
  border:1px solid var(--color-divider);background:#16130f;
  cursor:crosshair;
}
.mf-tf--half{height:clamp(200px,30vh,260px)}
.mf-tf canvas{display:block;width:100%;height:100%}
.mf-tf__hud{
  position:absolute;right:0.9rem;bottom:0.75rem;
  display:flex;gap:1.25rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
  pointer-events:none;
}
@media(max-width:767px){.mf-tf__hud span:nth-child(3){display:none}}

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
