import React, { useRef } from "react";
import Link from "@/components/TransitionLink";

import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy, cases } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

export default function Work() {
  const { lang, path } = useLang();
  const t = copy[lang].work;
  const list = cases[lang];
  const listRef = useRef(null);
  usePageTitle(t.label);

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
              {/* A captura fica SEMPRE visivel, nunca so no hover: num
                  indice de portfolio a imagem e a informacao, e metade
                  das visitas chega por toque, onde hover nao existe.
                  `01@800` e a unica captura que todo case com midia tem
                  — roda-agro nao grava video, entao nao tem poster. */}
              {c.media ? (
                <img
                  className="mf-work__thumb"
                  src={`/work/${c.media.dir}/01@800.webp`}
                  alt={`${c.name} — interface`}
                  width="800"
                  height="450"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="mf-work__thumb mf-work__thumb--none" aria-hidden="true" />
              )}
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
  display:grid;grid-template-columns:3rem 15rem 1fr auto;
  gap:0 clamp(1.25rem,3vw,2.5rem);align-items:start;
  padding:clamp(2rem,4vh,3.2rem) 0;
  border-bottom:1px solid var(--color-divider);
  text-decoration:none;color:inherit;
  transition:transform var(--duration-base) var(--ease-out-expo);
}
.mf-work__item:hover{transform:translateX(14px)}

.mf-work__thumb{
  display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;
  border:1px solid var(--color-divider);
  /* A captura entra dessaturada e resolve no hover/foco: a linha lida
     primeiro como tipografia, e a imagem confirma depois. Sem hover
     (toque), ela ja entra resolvida — ver a consulta abaixo. */
  filter:saturate(0.55);
  transition:filter var(--duration-base) var(--ease-in-out);
}
.mf-work__item:hover .mf-work__thumb,
.mf-work__item:focus-visible .mf-work__thumb{filter:saturate(1)}
/* Case ainda sem captura: o espaco fica reservado e silencioso, sem
   moldura desenhada anunciando o vazio. */
.mf-work__thumb--none{
  aspect-ratio:16/9;border:0;
  border-top:1px solid var(--color-divider);
  align-self:start;
}
@media(hover:none){
  .mf-work__thumb{filter:none}
}

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

/* Entre 768 e 1023 a coluna da captura estreita antes de sumir. */
@media(max-width:1023px) and (min-width:768px){
  .mf-work__item{grid-template-columns:2.5rem 10rem 1fr}
  .mf-work__meta{grid-column:2 / -1;flex-direction:row;gap:1rem;text-align:left;margin-top:0.6rem}
}
@media(max-width:767px){
  .mf-work__item{grid-template-columns:1fr;gap:0.75rem}
  .mf-work__item:hover{transform:none}
  .mf-work__meta{flex-direction:row;gap:1rem;text-align:left}
  /* No celular a captura vem inteira e primeiro: e ela que faz o
     visitante parar de rolar. O placeholder some de vez. */
  .mf-work__thumb{order:-1;margin-bottom:0.4rem}
  .mf-work__thumb--none{display:none}
}
/* O deslize lateral no hover e decorativo; sem ele o link continua igual. */
@media(prefers-reduced-motion:reduce){
  .mf-work__item,.mf-work__item:hover{transform:none;transition:none}
}
      `}</style>
    </>
  );
}
