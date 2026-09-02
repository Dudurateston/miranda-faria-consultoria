import React from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { CELESTE_GIF } from "@/lib/site";

/**
 * Insights — notas tecnicas curtas, escritas do campo. Cada nota e
 * conteudo completo na propria pagina (titulo + corpo), com a carta
 * celeste animada como contraponto visual do cabecalho.
 */
export default function Insights() {
  const { lang } = useLang();
  const t = copy[lang].insights;
  usePageTitle(t.label);

  return (
    <>
      <section className="mf-ins" data-depth="0.08">
        <div className="mf-ins__inner">
          <div className="mf-ins__head">
            <div>
              <Reveal>
                <p className="mf-label">{t.label}</p>
              </Reveal>
              <LineReveal as="h1" className="mf-ins__lead">{t.lead}</LineReveal>
              <Reveal delay={140}>
                <p className="mf-ins__intro">{t.intro}</p>
              </Reveal>
            </div>
            <Reveal delay={200} className="mf-ins__artwrap">
              <figure className="mf-ins__art">
                <img src={CELESTE_GIF} alt="" loading="lazy" />
              </figure>
            </Reveal>
          </div>

          <div className="mf-ins__list">
            {t.items.map((it, i) => (
              <Reveal key={i} delay={i * 90} className="mf-ins__item">
                <span className="mf-label mf-ins__tag">{it.tag}</span>
                <h2 className="mf-ins__t">{it.t}</h2>
                <p className="mf-ins__d">{it.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MfRule />

      <style>{`
.mf-ins{padding:var(--section-gap) var(--gutter)}
.mf-ins__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-ins__head{display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:end}
@media(min-width:860px){.mf-ins__head{grid-template-columns:7fr 5fr;gap:clamp(2.5rem,6vw,5rem)}}
.mf-ins__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-ins__intro{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2rem 0 0;
}
.mf-ins__art{margin:0;aspect-ratio:4/3;overflow:hidden;border:1px solid var(--color-divider)}
.mf-ins__art img{width:100%;height:100%;object-fit:cover;display:block}

.mf-ins__list{display:flex;flex-direction:column;margin-top:3.5rem}
.mf-ins__item{
  padding:clamp(1.8rem,4vh,2.6rem) 0;
  border-top:1px solid var(--color-divider);
  display:grid;grid-template-columns:10rem 1fr;gap:0.8rem clamp(1.5rem,4vw,3rem);
}
.mf-ins__item:last-child{border-bottom:1px solid var(--color-divider)}
.mf-ins__tag{align-self:start;color:var(--color-text-ghost)}
.mf-ins__t{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.14;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
}
.mf-ins__d{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:1rem 0 0;max-width:70ch;
}
@media(max-width:767px){
  .mf-ins__item{grid-template-columns:1fr;gap:0.5rem}
  .mf-ins__d{max-width:100%}
}
      `}</style>
    </>
  );
}