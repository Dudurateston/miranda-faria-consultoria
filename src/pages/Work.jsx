import React, { useMemo, useRef, useState } from "react";
import Link from "@/components/TransitionLink";
import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { copy, cases, practices, PRACTICE_SLUGS } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * /work — a página de evidência.
 *
 * Era uma lista corrida de oito projetos: quem chegava procurando a
 * própria disciplina tinha que ler tudo para descobrir se havia algo
 * para ele. O filtro resolve isso e, de quebra, é a assinatura da
 * página — os números por disciplina são evidência antes de o visitante
 * ler uma única linha.
 *
 * O filtro é estado local de propósito, não rota. Trocar de recorte é um
 * gesto de leitura, não um destino: não merece entrada no histórico do
 * navegador nem um link que alguém compartilharia.
 *
 * Cada linha diz também se o case tem mídia real ou é escrito. Três dos
 * oito têm print e gravação; esconder essa diferença seria fingir que
 * todos provam a mesma coisa.
 */
export default function Work() {
  const { lang, path } = useLang();
  const t = copy[lang].work;
  const all = cases[lang];
  const listRef = useRef(null);
  const [filter, setFilter] = useState(null);

  usePageTitle(t.label);
  useScrollStagger(listRef, { selector: ".mf-work__item", stagger: 0.09, y: 34 });

  const counts = useMemo(() => {
    const c = {};
    for (const slug of PRACTICE_SLUGS) c[slug] = all.filter((x) => x.practice === slug).length;
    return c;
  }, [all]);

  const list = filter ? all.filter((c) => c.practice === filter) : all;

  return (
    <>
      <PageHeader label={t.label} lead={t.lead} intro={t.intro} />

      <section className="mf-work__filter">
        <div className="mf-work__inner">
          <p className="mf-label">{t.filterLabel}</p>
          <div className="mf-work__chips" role="group" aria-label={t.filterLabel}>
            <button
              type="button" data-cursor="link"
              className={`mf-work__chip${filter === null ? " is-on" : ""}`}
              aria-pressed={filter === null}
              onClick={() => setFilter(null)}
            >
              {t.filterAll}<i>{all.length}</i>
            </button>
            {PRACTICE_SLUGS.map((slug) => (
              <button
                key={slug} type="button" data-cursor="link"
                className={`mf-work__chip${filter === slug ? " is-on" : ""}`}
                aria-pressed={filter === slug}
                onClick={() => setFilter(filter === slug ? null : slug)}
              >
                {practices[lang][slug].label}<i>{counts[slug]}</i>
              </button>
            ))}
          </div>
        </div>
      </section>

      <MfRule />

      <section className="mf-work">
        {/* A chave força o React a remontar a lista ao trocar o filtro,
            então a entrada escalonada roda de novo em vez de as linhas
            simplesmente trocarem de conteúdo no lugar. */}
        <div ref={listRef} key={filter ?? "all"} className="mf-work__list mf-stage">
          {list.map((c, i) => (
            <Link key={c.slug} to={path(`work/${c.slug}`)} className="mf-work__item" data-cursor="link">
              <span className="mf-work__num">{String(i + 1).padStart(2, "0")}</span>
              <div className="mf-work__body">
                <h2 className="mf-work__name">{c.name}</h2>
                <p className="mf-work__summary">{c.summary}</p>
              </div>
              <div className="mf-work__meta">
                <span className="mf-label">{c.sector}</span>
                <span className="mf-label mf-work__year">{c.year}</span>
                <span className={`mf-work__media${c.media ? " has" : ""}`}>
                  {c.media ? t.hasMedia : t.noMedia}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
.mf-work__filter{padding:0 var(--gutter) clamp(1.5rem,4vh,2.5rem)}
.mf-work__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-work__chips{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}
.mf-work__chip{
  display:inline-flex;align-items:baseline;gap:.55rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);background:none;cursor:pointer;
  border:1px solid var(--color-divider);padding:.55rem 1rem;
  transition:color var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out);
}
.mf-work__chip i{font-style:normal;color:var(--color-text-ghost)}
.mf-work__chip:hover{color:var(--color-text-primary);border-color:var(--color-text-ghost)}
.mf-work__chip.is-on{
  color:var(--color-text-primary);border-color:var(--color-accent);
}
.mf-work__chip.is-on i{color:var(--color-accent)}

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
.mf-work__body{display:flex;flex-direction:column;gap:.9rem}
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
.mf-work__meta{display:flex;flex-direction:column;gap:.5rem;text-align:right;align-items:flex-end}
.mf-work__year{color:var(--color-text-ghost)}
/* Um traço curto marca o case que tem mídia real. Esconder a diferença
   seria fingir que todos provam a mesma coisa. */
.mf-work__media{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);display:inline-flex;align-items:center;gap:.5rem;
}
.mf-work__media::before{
  content:"";width:14px;height:1px;background:var(--color-divider);
}
.mf-work__media.has{color:var(--color-text-secondary)}
.mf-work__media.has::before{background:var(--color-accent)}

@media(max-width:767px){
  .mf-work__item{grid-template-columns:1fr;gap:.75rem}
  .mf-work__item:hover{transform:none}
  .mf-work__meta{flex-direction:row;flex-wrap:wrap;gap:.5rem 1rem;text-align:left;align-items:baseline}
}
@media(prefers-reduced-motion:reduce){
  .mf-work__item,.mf-work__item:hover{transform:none;transition:none}
}
      `}</style>
    </>
  );
}
