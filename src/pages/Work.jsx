import React, { useEffect, useMemo, useState } from "react";
import Link from "@/components/TransitionLink";

import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import { scheduleStageMark } from "@/hooks/useStageFirstScreen";
import { useLang } from "@/lib/i18n";
import { copy, cases, PRACTICE_SLUGS } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * Indice do portfolio.
 *
 * O que esta pagina resolve, e /how-i-work nao: QUAL projeto ver. Ate
 * aqui as duas eram o mesmo molde — rotulo, titulo em Playfair,
 * paragrafo, regua com ponto, lista numerada — e nenhuma das duas fazia
 * nada que a outra nao fizesse. O indice agora filtra por frente, que e
 * a pergunta que um cliente traz ("voce faz o meu tipo de coisa?") e um
 * recrutador tambem ("ele e de design ou de dados?").
 *
 * O campo `practice` ja existia em todo case desde o inicio e nunca
 * tinha sido usado em lugar nenhum do site.
 */
export default function Work() {
  const { lang, path } = useLang();
  const t = copy[lang].work;
  const nav = copy[lang].nav;
  const all = cases[lang];
  usePageTitle(t.label);

  const [frente, setFrente] = useState("all");
  const list = useMemo(
    () => (frente === "all" ? all : all.filter((c) => c.practice === frente)),
    [all, frente]
  );

  // Filtrar troca o conjunto inteiro sem mexer na URL. Sem remarcar, os
  // itens novos que caem na primeira tela nascem desbotados pela
  // animacao de entrada — o mesmo texto fantasma de antes, por outra
  // porta.
  useEffect(() => scheduleStageMark(), [frente]);

  // A contagem sai dos dados, nunca escrita a mao: um case novo em
  // copy.js aparece no filtro certo sozinho.
  const contagem = useMemo(() => {
    const c = { all: all.length };
    for (const s of PRACTICE_SLUGS) c[s] = all.filter((x) => x.practice === s).length;
    return c;
  }, [all]);

  const frentes = [
    { id: "all", label: t.filterAll },
    ...PRACTICE_SLUGS.map((s) => ({ id: s, label: nav[s] })),
  ];

  return (
    <>
      <PageHeader label={t.label} lead={t.lead} intro={t.intro} />
      <MfRule />

      <section className="mf-work" data-depth="0.26">
        {/* Botao, nao link: filtrar nao muda de pagina. `aria-pressed`
            diz ao leitor de tela qual esta ativo — cor sozinha nao diz. */}
        <div className="mf-work__filter" role="group" aria-label={t.filterLabel}>
          {frentes.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`mf-work__fbtn${frente === f.id ? " is-on" : ""}`}
              data-cursor="link"
              aria-pressed={frente === f.id}
              onClick={() => setFrente(f.id)}
            >
              {f.label}
              <span className="mf-work__fnum">{contagem[f.id]}</span>
            </button>
          ))}
        </div>

        <div className="mf-work__list mf-stage">
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

        {!list.length && <p className="mf-work__empty">{t.empty}</p>}
      </section>

      <style>{`
.mf-work{padding:0 var(--gutter) var(--section-gap)}

.mf-work__filter{
  max-width:var(--max-width-page);margin:0 auto 0.5rem;
  display:flex;flex-wrap:wrap;gap:0 clamp(1.25rem,3vw,2.4rem);
}
.mf-work__fbtn{
  display:inline-flex;align-items:baseline;gap:0.45rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);
  background:none;border:0;padding:0 0 4px;cursor:pointer;
  border-bottom:1px solid transparent;
  transition:color var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out);
}
.mf-work__fbtn:hover{color:var(--color-text-primary)}
/* O ativo se marca por COR e por TRACO, nunca so por cor: quem nao
   distingue o cobre ainda ve a linha. E o cobre fica no traco, nunca no
   rotulo — como texto pequeno ele mede 4,49:1 e reprova AA. */
.mf-work__fbtn.is-on{color:var(--color-text-primary);border-bottom-color:var(--copper)}
.mf-work__fnum{
  font-size:0.68em;color:var(--color-text-ghost);
  font-variant-numeric:tabular-nums;
}
.mf-work__fbtn.is-on .mf-work__fnum{color:var(--color-text-secondary)}

.mf-work__empty{
  max-width:var(--max-width-page);margin:2.5rem auto 0;
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);color:var(--color-text-secondary);
}
.mf-work__list{max-width:var(--max-width-page);margin:1.5rem auto 0;border-top:1px solid var(--color-divider)}

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
/* Case ainda sem captura: reserva o espaco e nao desenha nada. Um traco solto na coluna da
   captura lia como linha perdida, anunciando a falta em vez de
   silenciar. */
.mf-work__thumb--none{aspect-ratio:16/9;border:0}
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
