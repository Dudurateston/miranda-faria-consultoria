import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy, getPractice } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL, GEO_GIF } from "@/lib/site";

/**
 * Servicos — visao geral das tres verticais, com numeros reais da
 * operacao (projetos entregues, stack inteiro numa pessoa, resposta
 * no mesmo dia) e a coluna geologica como metafora das camadas.
 * Cada vertical linka para a sua pagina propria.
 */
const SLUGS = ["systems", "design", "business"];

export default function Servicos() {
  const { lang, path } = useLang();
  const t = copy[lang].servicos;
  usePageTitle(t.label);

  return (
    <>
      <section className="mf-srv" data-depth="0.08">
        <div className="mf-srv__inner">
          <Reveal>
            <p className="mf-label">{t.label}</p>
          </Reveal>
          <LineReveal as="h1" className="mf-srv__lead">{t.lead}</LineReveal>
          <Reveal delay={140}>
            <p className="mf-srv__intro">{t.intro}</p>
          </Reveal>

          <div className="mf-srv__metrics">
            {t.metrics.map((m, i) => (
              <Reveal key={i} delay={i * 90} className="mf-srv__metric">
                <span className="mf-srv__num">{m.n}</span>
                <span className="mf-srv__numd">{m.d}</span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <figure className="mf-srv__band">
              <img src={GEO_GIF} alt="" loading="lazy" />
            </figure>
          </Reveal>
        </div>
      </section>

      <MfRule />

      <section className="mf-srv" data-depth="0.30">
        <div className="mf-srv__inner">
          <Reveal>
            <p className="mf-label">{t.verticalsLabel}</p>
          </Reveal>
          <div className="mf-srv__list">
            {SLUGS.map((slug, i) => {
              const p = getPractice(lang, slug);
              if (!p) return null;
              return (
                <Link key={slug} to={path(slug)} className="mf-srv__item" data-cursor="link">
                  <span className="mf-srv__idx">{String(i + 1).padStart(2, "0")}</span>
                  <div className="mf-srv__v">
                    <h2 className="mf-srv__name">{p.label}</h2>
                    <p className="mf-srv__plead">{p.lead}</p>
                  </div>
                  <span className="mf-srv__go">{t.seeVertical} →</span>
                </Link>
              );
            })}
          </div>
          <Reveal delay={160}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mf-srv__cta"
              data-cursor="link"
            >
              {t.cta}
            </a>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-srv{padding:var(--section-gap) var(--gutter)}
.mf-srv__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-srv__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-srv__intro{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2rem 0 0;
}
.mf-srv__metrics{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:2rem 3rem;margin-top:3.5rem;padding-top:2rem;
  border-top:1px solid var(--color-divider);
}
@media(min-width:860px){.mf-srv__metrics{grid-template-columns:repeat(4,1fr)}}
.mf-srv__metric{display:flex;flex-direction:column;gap:0.5rem}
.mf-srv__num{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1;
  color:var(--color-text-primary);
}
.mf-srv__numd{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-srv__band{margin:3.5rem 0 0;aspect-ratio:16/9;overflow:hidden;border:1px solid var(--color-divider)}
.mf-srv__band img{width:100%;height:100%;object-fit:cover;display:block}

.mf-srv__list{display:flex;flex-direction:column;margin-top:3rem}
.mf-srv__item{
  display:grid;grid-template-columns:4.5rem 1fr auto;
  gap:0 clamp(1.5rem,4vw,3rem);align-items:baseline;
  padding:clamp(1.6rem,3.5vh,2.4rem) 0;
  border-bottom:1px solid var(--color-divider);
  text-decoration:none;color:inherit;
}
.mf-srv__item:first-child{border-top:1px solid var(--color-divider)}
.mf-srv__item:hover .mf-srv__name{color:var(--color-accent)}
.mf-srv__item:hover .mf-srv__go{opacity:1;transform:translateX(6px)}
.mf-srv__idx{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-srv__name{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.12;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-srv__plead{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0.5rem 0 0;
}
.mf-srv__go{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);opacity:0.6;
  transition:opacity var(--duration-fast) var(--ease-in-out),
             transform var(--duration-base) var(--ease-out-expo);
}
.mf-srv__cta{
  display:inline-block;margin-top:2.75rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--color-accent);padding-bottom:4px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-srv__cta:hover{opacity:0.65}
@media(max-width:767px){
  .mf-srv__item{grid-template-columns:1fr;gap:0.5rem}
  .mf-srv__go{opacity:1}
}
      `}</style>
    </>
  );
}