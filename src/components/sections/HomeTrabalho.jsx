import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy, cases } from "@/content/copy";

/**
 * Trabalho selecionado na Home — a lista de cases no padrão spence:
 * linha editorial com número, nome em didone, setor em mono e um
 * "leia o caso" que só aparece no hover. As linhas irmãs apagam quando
 * uma está em foco — o resto da página desaparece, o caso aparece.
 */
const FEATURED = [
  "rota-forte",
  "1000-pecas",
  "motormoura",
  "uaiso-travel",
  "sevalho-controladoria",
  "vaf-global",
];

export default function HomeTrabalho() {
  const { lang, path } = useLang();
  const t = copy[lang];

  const list = FEATURED
    .map((slug) => cases[lang].find((c) => c.slug === slug))
    .filter(Boolean)
    .slice(0, 6);
  const shown = list.length ? list : cases[lang].slice(0, 6);

  return (
    <section className="mf-h">
      <div className="mf-h__inner">
        <Reveal>
          <p className="mf-label"><span className="mf-label__n">03</span>{t.work.label}</p>
        </Reveal>
        <LineReveal className="mf-h__lead">{t.work.lead}</LineReveal>

        <div className="mf-trows">
          {shown.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <Link
                to={path(`work/${c.slug}`)}
                className="mf-trow"
                data-cursor="link"
              >
                <span className="mf-trow__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="mf-trow__body">
                  <span className="mf-trow__name">{c.name}</span>
                  <span className="mf-trow__desc">{c.summary}</span>
                </span>
                <span className="mf-trow__meta">
                  <span className="mf-label">{c.sector}</span>
                  <span className="mf-label mf-trow__year">{c.year}</span>
                </span>
                <span className="mf-trow__go">{t.work.viewCase} →</span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} className="mf-trows__all">
          <Link to={path("work")} data-cursor="link">
            {t.home.trabalhoPreview.cta} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>

      <style>{`
.mf-trows{margin-top:3.5rem;border-top:1px solid var(--mf-rule)}
.mf-trow{
  display:grid;grid-template-columns:3.2rem 1fr auto auto;
  gap:clamp(1rem,3vw,2.4rem);align-items:baseline;
  padding:1.5rem 0;border-bottom:1px solid var(--mf-rule);
  transition:opacity 0.45s ease, padding 0.45s cubic-bezier(0.22,1,0.36,1);
}
.mf-trows:hover .mf-trow:not(:hover){opacity:0.28}
.mf-trow:hover{padding-left:0.9rem}
.mf-trow:hover .mf-trow__num{color:var(--copper,#B5502E)}
.mf-trow__num{
  font-family:var(--font-mono);font-size:var(--text-label);
  color:var(--color-text-ghost);letter-spacing:var(--tracking-label);
  transition:color 0.3s ease;
}
.mf-trow__body{display:flex;flex-direction:column;gap:0.35rem;min-width:0}
.mf-trow__name{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(1.3rem,2.4vw,1.9rem);line-height:1.15;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
}
.mf-trow__desc{
  font-size:clamp(0.82rem,1vw,0.9rem);line-height:1.5;
  color:var(--color-text-ghost);max-width:56ch;
  display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;
}
.mf-trow__meta{display:flex;gap:1.2rem;align-items:baseline}
.mf-trow__year{color:var(--color-text-ghost)}
.mf-trow__go{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--copper,#B5502E);white-space:nowrap;
  opacity:0;transform:translateX(-8px);
  transition:opacity 0.35s ease, transform 0.35s ease;
}
.mf-trow:hover .mf-trow__go{opacity:1;transform:translateX(0)}
.mf-trows__all{margin-top:1.6rem}
.mf-trows__all a{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--copper,#B5502E);padding-bottom:0.35rem;
  transition:color 0.3s ease;
}
.mf-trows__all a:hover{color:var(--copper,#B5502E)}
@media(max-width:860px){
  .mf-trow{grid-template-columns:2.2rem 1fr;grid-template-areas:"n b" "m m" "g g"}
  .mf-trow__num{grid-area:n}.mf-trow__body{grid-area:b}
  .mf-trow__meta{grid-area:m;justify-content:flex-start;margin-top:0.4rem}
  .mf-trow__go{grid-area:g;opacity:1;transform:none;margin-top:0.5rem}
  .mf-trow:hover{padding-left:0}
}
`}</style>
    </section>
  );
}
