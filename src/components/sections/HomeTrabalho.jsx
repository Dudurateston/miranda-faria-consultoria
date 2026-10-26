import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy, cases } from "@/content/copy";
import { getPortfolioProducts } from "@/content/produtos";
import { getCasePresentation } from "@/content/casePresentation";

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
  const products = getPortfolioProducts(lang); // leads fiéis por idioma
  const featured = shown.slice(0, 3).map(c => {
    const presentation = getCasePresentation(c.slug, lang);
    const image = presentation?.media.find(m => m.id === presentation.leadMedia && m.type === 'image');
    return { ...c, image };
  });

  return (
    <section className="mf-h">
      <div className="mf-h__inner">
        <Reveal>
          <p className="mf-label"><span className="mf-label__n">03</span>{t.work.label}</p>
        </Reveal>
        <LineReveal className="mf-h__lead" dot>{t.work.lead}</LineReveal>

        <div className="mf-work-gallery">
          {featured.map((c, i) => (
            <Link key={c.slug} to={path(`work/${c.slug}`)} className="mf-work-card" data-cursor="link">
              {c.image && <figure className="mf-work-card__media">
                <img src={c.image.src} alt={c.image.alt || c.image.caption || c.name}
                  width={c.image.width} height={c.image.height} loading="lazy" decoding="async" />
              </figure>}
              <div className="mf-work-card__copy">
                <p className="mf-label">{String(i + 1).padStart(2, '0')} · {c.sector}</p>
                <h3>{c.name}</h3>
                <p className="mf-work-card__summary">{c.summary}</p>
                <span className="mf-work-card__cta">{t.work.viewCase} <span aria-hidden="true">↗</span></span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mf-trows">
          {shown.slice(3).map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <Link
                to={path(`work/${c.slug}`)}
                className="mf-trow"
                data-cursor="link"
              >
                <span className="mf-trow__num">{String(i + 4).padStart(2, "0")}</span>
                <span className="mf-trow__body">
                  <span className="mf-trow__name">{c.name}</span>
                  <span className="mf-trow__desc">{c.summary}</span>
                </span>
                <span className="mf-trow__meta">
                  <span className="mf-label">{c.sector}</span>
                </span>
                <span className="mf-trow__go">{t.work.viewCase} →</span>
              </Link>
            </Reveal>
          ))}
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(6 + i) * 80}>
              <a href={p.to} className="mf-trow mf-trow--product" data-cursor="link">
                <span className="mf-trow__num">P{String(i + 1).padStart(2, "0")}</span>
                <span className="mf-trow__body">
                  <span className="mf-trow__name">{p.name}</span>
                  <span className="mf-trow__desc">{p.lead}</span>
                </span>
                <span className="mf-trow__meta">
                  <span className="mf-label">{p.tag}</span>
                </span>
                <span className="mf-trow__go">{t.work.viewProduct} →</span>
              </a>
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
.mf-work-gallery{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1rem,2.5vw,2rem);margin-top:3rem}
.mf-work-card{display:flex;flex-direction:column;min-width:0;color:var(--color-text-primary);text-decoration:none;border-bottom:1px solid var(--mf-rule);padding-bottom:1.6rem}
.mf-work-card:first-child{grid-column:1/-1;display:grid;grid-template-columns:7fr 5fr;gap:clamp(1.5rem,4vw,3rem);align-items:center}
.mf-work-card__media{margin:0;overflow:hidden;background:var(--bg-light);border:1px solid var(--mf-rule);aspect-ratio:16/10}
.mf-work-card:first-child .mf-work-card__copy{padding-top:0}
.mf-work-card__media img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:contain;transition:transform 400ms ease}
.mf-work-card__copy{padding-top:1.2rem}
.mf-work-card__copy .mf-label{margin:0 0 .7rem;color:var(--color-text-secondary);letter-spacing:.12em;line-height:1.7}
.mf-work-card h3{font-family:var(--font-display);font-weight:400;font-size:clamp(1.8rem,3vw,2.7rem);line-height:1.15;margin:0}
.mf-work-card__summary{font-size:1rem;line-height:1.65;color:var(--color-text-secondary);margin:.7rem 0 1rem;max-width:48ch}
.mf-work-card__cta{display:inline-flex;align-items:center;gap:1rem;color:var(--mf-copper-text,#A6481F);font-family:var(--font-mono);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;min-height:44px}
.mf-work-card:focus-visible{outline:2px solid var(--mf-copper-text,#A6481F);outline-offset:6px}
@media(hover:hover) and (prefers-reduced-motion:no-preference){.mf-work-card:hover img{transform:scale(1.025)}}
@media(max-width:860px){.mf-work-gallery{grid-template-columns:1fr}.mf-work-card:first-child{grid-column:auto;display:flex;gap:0}.mf-work-card:first-child .mf-work-card__copy{padding-top:1.2rem}}
.mf-trows{margin-top:3.5rem;border-top:1px solid var(--mf-rule)}
.mf-trow{
  display:grid;grid-template-columns:3.2rem 1fr auto auto;
  gap:clamp(1rem,3vw,2.4rem);align-items:baseline;
  padding:1.5rem 0;border-bottom:1px solid var(--mf-rule);
  transition:opacity 0.45s ease, padding 0.45s cubic-bezier(0.22,1,0.36,1);
}
@media(hover:hover){.mf-trows:hover .mf-trow:not(:hover){opacity:0.65}}
.mf-trow:hover{padding-left:0.9rem}
.mf-trow:hover .mf-trow__num{color:var(--mf-copper-text,#A6481F)}
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
  color:var(--color-text-secondary);max-width:56ch;
  display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;
}
.mf-trow__meta{display:flex;gap:1.2rem;align-items:baseline}
.mf-trow__year{color:var(--color-text-ghost)}
.mf-trow__go{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-copper-text,#A6481F);white-space:nowrap;
  opacity:0;transform:translateX(-8px);
  transition:opacity 0.35s ease, transform 0.35s ease;
}
.mf-trow:hover .mf-trow__go,.mf-trow:focus-visible .mf-trow__go{opacity:1;transform:translateX(0)}
.mf-trows__all{margin-top:1.6rem}
.mf-trows__all a{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--copper,#B5502E);padding-bottom:0.35rem;
  transition:color 0.3s ease;
}
.mf-trows__all a:hover{color:var(--mf-copper-text,#A6481F)}
@media(max-width:860px){
  .mf-trow{grid-template-columns:2.2rem 1fr;grid-template-areas:"n b" "m m" "g g"}
  .mf-trow__num{grid-area:n}.mf-trow__body{grid-area:b}
  .mf-trow__meta{grid-area:m;justify-content:flex-start;margin-top:0.4rem}
  .mf-trow__go{grid-area:g;opacity:1;transform:none;margin-top:0.5rem}
  .mf-trow:hover{padding-left:0}
}
.mf-trow__go{display:inline-block;transition:transform 0.35s var(--ease-out-expo)}
.mf-trow:hover .mf-trow__go{transform:translateX(6px)}
@media(max-width:860px){
.mf-trows__all a{min-height:44px;display:inline-flex;align-items:center}
}
`}</style>
    </section>
  );
}
