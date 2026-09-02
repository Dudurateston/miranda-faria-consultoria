import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/** Preview dos Insights — tres notas em regua editorial, link para a pagina. */
export default function HomeInsights() {
  const { lang, path } = useLang();
  const t = copy[lang];

  return (
    <section className="mf-h">
      <div className="mf-h__inner">
        <Reveal>
          <p className="mf-label">{t.insights.label}</p>
        </Reveal>
        <LineReveal className="mf-h__lead">{t.insights.lead}</LineReveal>

        <div className="mf-insprev">
          {t.insights.items.slice(0, 3).map((it, i) => (
            <Link
              key={i}
              to={path("insights")}
              className="mf-insprev__item"
              data-cursor="link"
            >
              <span className="mf-label">{it.tag}</span>
              <h3 className="mf-insprev__t">{it.t}</h3>
            </Link>
          ))}
        </div>

        <Reveal delay={140}>
          <Link to={path("insights")} className="mf-h__cta" data-cursor="link">
            {t.home.insightsPreview.cta} →
          </Link>
        </Reveal>
      </div>

      <style>{`
.mf-insprev{margin-top:3rem}
.mf-insprev__item{
  display:grid;grid-template-columns:8rem 1fr;gap:0 2rem;align-items:baseline;
  padding:1.6rem 0;border-top:1px solid var(--mf-rule);
  text-decoration:none;
}
.mf-insprev__item:last-child{border-bottom:1px solid var(--mf-rule)}
.mf-insprev__t{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.18;
  color:var(--color-text-primary);margin:0;
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-insprev__item:hover .mf-insprev__t{color:var(--color-accent)}
@media(max-width:767px){.mf-insprev__item{grid-template-columns:1fr;gap:0.5rem}}
      `}</style>
    </section>
  );
}