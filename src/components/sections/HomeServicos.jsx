import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy, getPractice } from "@/content/copy";
import { CORTE_GIF, CELESTE_GIF, GEO_GIF } from "@/lib/site";

/**
 * As tres verticais em cards creme sobre o grafite, cada um com um GIF
 * de fundo a 0.3 de opacidade fundido por mascara de gradiente — parte
 * do design, nao elemento colado. Metricas reais embaixo.
 */
const VERTICALS = [
  { slug: "systems", gif: CORTE_GIF },
  { slug: "design", gif: CELESTE_GIF },
  { slug: "business", gif: GEO_GIF },
];

export default function HomeServicos() {
  const { lang, path } = useLang();
  const t = copy[lang];

  return (
    <section className="mf-h">
      <div className="mf-h__inner">
        <Reveal>
          <p className="mf-label">{t.servicos.label}</p>
        </Reveal>
        <LineReveal className="mf-h__lead">{t.servicos.lead}</LineReveal>

        <div className="mf-cards">
          {VERTICALS.map(({ slug, gif }) => {
            const p = getPractice(lang, slug);
            if (!p) return null;
            return (
              <Link key={slug} to={path(slug)} className="mf-card" data-cursor="link">
                <img className="mf-card__gif" src={gif} alt="" loading="lazy" />
                <span className="mf-card__label">{p.label}</span>
                <p className="mf-card__lead">{t.servicos.cards?.[slug] ?? p.lead}</p>
                <span className="mf-card__go">{t.servicos.seeVertical} →</span>
              </Link>
            );
          })}
        </div>

        <div className="mf-cards__metrics">
          {t.servicos.metrics.map((m, i) => (
            <Reveal key={i} delay={i * 90} className="mf-metric">
              <span className="mf-metric__n">{m.n}</span>
              <span className="mf-metric__d">{m.d}</span>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
.mf-cards{display:grid;grid-template-columns:1fr;gap:1.6rem;margin-top:3.5rem}
@media(min-width:860px){.mf-cards{grid-template-columns:repeat(3,1fr);gap:clamp(1.2rem,2.5vw,2rem)}}
.mf-card{
  position:relative;overflow:hidden;background:var(--bone);
  padding:2.2rem 1.8rem;min-height:300px;
  display:flex;flex-direction:column;gap:0.9rem;
  text-decoration:none;color:var(--ink);
  transition:transform var(--duration-base) var(--ease-out-expo),
             box-shadow var(--duration-base) var(--ease-in-out);
}
.mf-card__gif{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;opacity:0.3;pointer-events:none;
  -webkit-mask-image:linear-gradient(180deg,transparent 0%,black 20%,black 80%,transparent 100%);
  mask-image:linear-gradient(180deg,transparent 0%,black 20%,black 80%,transparent 100%);
}
.mf-card__label{
  position:relative;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:rgba(38,38,38,0.66);
}
.mf-card__lead{
  position:relative;
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.2;
  color:var(--ink);margin:0;
}
.mf-card__go{
  position:relative;margin-top:auto;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta);
}
.mf-card:hover{
  transform:translateY(-8px);
  box-shadow:0 24px 56px rgba(0,0,0,0.45),0 0 0 1px rgba(179,122,96,0.35);
}
@media(prefers-reduced-motion:reduce){.mf-card:hover{transform:none;box-shadow:none}}
@media(hover:none){.mf-card:hover{transform:none;box-shadow:none}}

.mf-cards__metrics{
  display:grid;grid-template-columns:repeat(2,1fr);gap:1.8rem 2.5rem;
  margin-top:3.25rem;padding-top:2.25rem;margin-bottom:clamp(1.5rem,4vh,3rem);
  border-top:1px solid var(--mf-rule);
}
@media(min-width:860px){.mf-cards__metrics{grid-template-columns:repeat(4,1fr)}}
.mf-metric{display:flex;flex-direction:column;gap:0.8rem}
.mf-metric__n{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1;
  color:var(--color-text-primary);
}
.mf-metric__d{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
      `}</style>
    </section>
  );
}