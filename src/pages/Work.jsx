import React, { useMemo, useRef, useState } from "react";
import Link from "@/components/TransitionLink";

import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { copy, cases, PRACTICE_SLUGS, practices as practiceCopy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

/* Filtro do índice de cases — setor e solução.
   Estado na URL (?setor=...&solucao=...), sem JS de rota:
   o visitante compartilha o link filtrado e o Google indexa. */
function useWorkFilter(lang) {
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search));
  const setor = params.get("setor") || "todos";
  const solucao = params.get("solucao") || "todas";
  const set = (key, value) => {
    const next = new URLSearchParams(window.location.search);
    if (value === "todos" || value === "todas") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    );
    setParams(new URLSearchParams(qs));
  };
  return { setor, solucao, set, params };
}

export default function Work() {
  const { lang, path } = useLang();
  const t = copy[lang].work;
  const all = cases[lang];
  const listRef = useRef(null);
  usePageTitle(t.label, "work");

  const { setor, solucao, set } = useWorkFilter(lang);

  const sectors = useMemo(
    () => [...new Set(all.map((c) => c.sector))].sort((a, b) => a.localeCompare(b)),
    [all]
  );
  const practices = useMemo(
    () =>
      PRACTICE_SLUGS.filter((s) => all.some((c) => c.practice === s)).map((s) => ({
        id: s,
        label: practiceCopy[lang][s]?.label || s,
      })),
    [all, lang]
  );

  const list = useMemo(
    () =>
      all.filter(
        (c) => (setor === "todos" || c.sector === setor) && (solucao === "todas" || c.practice === solucao)
      ),
    [all, setor, solucao]
  );

  useScrollStagger(listRef, { selector: ".mf-work__item", stagger: 0.09, y: 34 });

  const chip = (active) =>
    `mf-work__chip${active ? " is-active" : ""}`;

  return (
    <>
      <PageHeader label={t.label} lead={t.lead} intro={t.intro} />
      <MfRule />

      <section className="mf-work" data-depth="0.26">
        <div className="mf-work__filters mf-stage" aria-label={t.filterLabel}>
          <div className="mf-work__filter-row">
            <span className="mf-work__filter-title">{t.filterSector}</span>
            <button type="button" className={chip(setor === "todos")} aria-pressed={setor === "todos"}
              onClick={() => set("setor", "todos")}>{t.filterAll}</button>
            {sectors.map((s) => (
              <button key={s} type="button" className={chip(setor === s)} aria-pressed={setor === s}
                onClick={() => set("setor", s)}>{s}</button>
            ))}
          </div>
          <div className="mf-work__filter-row">
            <span className="mf-work__filter-title">{t.filterSolution}</span>
            <button type="button" className={chip(solucao === "todas")} aria-pressed={solucao === "todas"}
              onClick={() => set("solucao", "todas")}>{t.filterAll}</button>
            {practices.map((p) => (
              <button key={p.id} type="button" className={chip(solucao === p.id)} aria-pressed={solucao === p.id}
                onClick={() => set("solucao", p.id)}>{p.label}</button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mf-work__empty mf-stage" role="status">
            <p className="mf-work__empty-text">{t.emptyFilter}</p>
            <button type="button" className="mf-work__empty-clear"
              onClick={() => { set("setor", "todos"); set("solucao", "todas"); }}>
              {t.clearFilter}
            </button>
          </div>
        ) : (
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
        )}
      </section>

      <style>{`
.mf-work{padding:0 var(--gutter) var(--section-gap)}
.mf-work__filters{max-width:var(--max-width-page);margin:0 auto 1.2rem;display:flex;flex-direction:column;gap:0.9rem}
.mf-work__filter-row{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem}
.mf-work__filter-title{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-text-ghost);margin-right:0.6rem}
.mf-work__chip{
  font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);
  color:var(--color-text-secondary);background:none;border:1px solid var(--color-divider);
  border-radius:999px;padding:0.4rem 0.9rem;min-height:24px;cursor:pointer;
  transition:color var(--duration-fast) var(--ease-in-out),border-color var(--duration-fast) var(--ease-in-out);
}
.mf-work__chip:hover{color:var(--color-text-primary);border-color:var(--color-text-secondary)}
.mf-work__chip.is-active{color:var(--color-bg);background:var(--color-text-primary);border-color:var(--color-text-primary)}
.mf-work__list{max-width:var(--max-width-page);margin:0 auto;border-top:1px solid var(--color-divider)}
.mf-work__empty{max-width:var(--max-width-page);margin:0 auto;padding:3rem 0;display:flex;flex-direction:column;gap:1.2rem;align-items:flex-start}
.mf-work__empty-text{font-family:var(--font-body);font-size:var(--text-body-md);color:var(--color-text-secondary);margin:0;max-width:52ch}
.mf-work__empty-clear{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-accent);background:none;border:none;border-bottom:1px solid currentColor;padding:0.2rem 0;cursor:pointer;min-height:24px}

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
.mf-work__live{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-accent)}

@media (max-width:820px){
  .mf-work__item{grid-template-columns:1fr;gap:0.8rem}
  .mf-work__item,.mf-work__filters .mf-work__chip{min-height:44px}
  .mf-work__meta{flex-direction:row;text-align:left;gap:1rem}
}
`}</style>
    </>
  );
}
