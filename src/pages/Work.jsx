import React, { useRef } from "react";
import Link from "@/components/TransitionLink";

import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { copy, cases } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

export default function Work() {
  const { lang, path } = useLang();
  const t = copy[lang].work;
  const list = cases[lang];
  const listRef = useRef(null);
  usePageTitle(t.label, "work");

  useScrollStagger(listRef, { selector: ".mf-work__item", stagger: 0.09, y: 34 });

  return (
    <>
      <PageHeader label={t.label} lead={t.lead} intro={t.intro} />
      <MfRule />

      <section className="mf-work" data-depth="0.26">
        <div ref={listRef} className="mf-work__list mf-stage">
          {list.map((c, i) => (
            <Link
              key={c.slug}
              to={path(`work/${c.slug}`)}
              className="mf-work__item"
              data-cursor="link"
            >
              <span className="mf-work__num">{String(i + 1).padStart(2, "0")}</span>
              <div className="mf-work__body">
                <h2 className="mf-work__name">{c.name}</h2>
                <p className="mf-work__summary">{c.summary}</p>
              </div>
              <div className="mf-work__meta">
                <span className="mf-label">{c.sector}</span>
                <span className="mf-label mf-work__year">{c.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
.mf-work{padding:0 var(--gutter) var(--section-gap)}
.mf-work__list{max-width:var(--max-width-page);margin:0 auto;border-top:1px solid var(--color-divider)}

.mf-work__item{
  display:grid;grid-template-columns:4.5rem 1fr auto;
  gap:0 clamp(1.5rem,4vw,3rem);align-items:baseline;
  padding:clamp(2rem,4vh,3.2rem) 0;
  border-bottom:1px solid var(--color-divider);
  text-decoration:none;color:inherit;
  transition:transform var(--duration-base) var(--ease-out-expo);
}
.mf-work__item:hover{transform:translateX(14px)}

.mf-work__num{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-work__body{display:flex;flex-direction:column;gap:0.9rem}
.mf-work__name{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.08;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:0;transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-work__item:hover .mf-work__name{color:var(--color-accent)}
.mf-work__summary{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:52ch;
}
.mf-work__meta{display:flex;flex-direction:column;gap:0.5rem;text-align:right}
.mf-work__year{color:var(--color-text-ghost)}

@media(max-width:767px){
  .mf-work__item{grid-template-columns:1fr;gap:0.75rem}
  .mf-work__item:hover{transform:none}
  .mf-work__meta{flex-direction:row;gap:1rem;text-align:left}
}
/* O deslize lateral no hover e decorativo; sem ele o link continua igual. */
@media(prefers-reduced-motion:reduce){
  .mf-work__item,.mf-work__item:hover{transform:none;transition:none}
}
      `}</style>
    </>
  );
}
