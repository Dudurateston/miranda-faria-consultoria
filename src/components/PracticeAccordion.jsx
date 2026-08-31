import React, { useState } from "react";
import Link from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";
import { copy, practices, PRACTICE_SLUGS, casesOfPractice } from "@/content/copy";

/**
 * As três frentes, abertas DENTRO da Home.
 *
 * Antes, clicar numa vertical mandava o visitante direto para a aba e ele
 * saía da Home sem ter lido o resumo. Quem chega por indicação costuma
 * querer entender o todo antes de escolher um recorte — mandar embora no
 * primeiro clique custa exatamente esse visitante.
 *
 * Aqui a frente se abre no lugar: mostra o que entrega e quais cases são
 * dela, e só então oferece o CTA para aprofundar. O clique passa a ser
 * uma escolha informada em vez de um desvio.
 *
 * Um painel aberto por vez, de propósito: dois abertos viram uma parede
 * de texto e a comparação se perde.
 */
export default function PracticeAccordion() {
  const { lang, path } = useLang();
  const t = copy[lang].home.practices;
  const [open, setOpen] = useState(PRACTICE_SLUGS[0]);

  return (
    <>
      <div className="mf-acc">
        {PRACTICE_SLUGS.map((slug, i) => {
          const p = practices[lang][slug];
          const isOpen = open === slug;
          const cases = casesOfPractice(lang, slug);

          return (
            <section className={`mf-acc__item${isOpen ? " is-open" : ""}`} key={slug}>
              <h3 className="mf-acc__h">
                <button
                  type="button"
                  className="mf-acc__trigger"
                  aria-expanded={isOpen}
                  aria-controls={`acc-${slug}`}
                  onClick={() => setOpen(isOpen ? null : slug)}
                  data-cursor="link"
                >
                  <span className="mf-acc__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mf-acc__name">{p.label}</span>
                  <span className="mf-acc__lead">{p.lead}</span>
                  <span className="mf-acc__sign" aria-hidden="true" />
                </button>
              </h3>

              <div id={`acc-${slug}`} className="mf-acc__panel" hidden={!isOpen}>
                <div className="mf-acc__inner">
                  <p className="mf-acc__intro">{p.intro}</p>

                  <ul className="mf-acc__list">
                    {p.deliverables.slice(0, 4).map((d) => (
                      <li key={d.t}>
                        <b>{d.t}</b>
                        <span>{d.d}</span>
                      </li>
                    ))}
                  </ul>

                  {cases.length > 0 && (
                    <p className="mf-acc__cases">
                      <span className="mf-label">{p.casesLabel}</span>
                      {cases.map((c) => c.name).join(" · ")}
                    </p>
                  )}

                  <Link to={path(slug)} className="mf-acc__cta" data-cursor="link">
                    {t.deepen} — {p.label} →
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <style>{`
.mf-acc{margin-top:3rem;border-top:1px solid var(--color-divider)}
.mf-acc__item{border-bottom:1px solid var(--color-divider)}
.mf-acc__h{margin:0}

.mf-acc__trigger{
  display:grid;grid-template-columns:3.5rem minmax(0,14rem) 1fr auto;
  align-items:baseline;gap:0 clamp(1rem,3vw,2.5rem);
  width:100%;padding:clamp(1.5rem,3.4vh,2.4rem) 0;
  background:none;border:0;cursor:pointer;text-align:left;
  font:inherit;color:inherit;
}
.mf-acc__num{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-acc__name{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.1;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
}
.mf-acc__lead{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:1.6;
  color:var(--color-text-secondary);
}
/* O sinal é um traço que vira cruz: mais discreto que uma seta e
   coerente com a régua de sondagem. */
.mf-acc__sign{
  position:relative;width:14px;height:14px;flex:0 0 auto;align-self:center;
}
.mf-acc__sign::before,.mf-acc__sign::after{
  content:"";position:absolute;inset:50% 0 auto 0;height:1px;
  background:var(--color-accent);
  transition:transform var(--duration-base) var(--ease-out-expo);
}
.mf-acc__sign::after{transform:rotate(90deg)}
.mf-acc__item.is-open .mf-acc__sign::after{transform:rotate(0deg)}

.mf-acc__panel{overflow:hidden}
.mf-acc__inner{
  display:grid;gap:1.75rem;
  padding:0 0 clamp(1.75rem,4vh,2.75rem) 3.5rem;
  max-width:var(--max-width-page);
}
@media(max-width:767px){.mf-acc__inner{padding-left:0}}

.mf-acc__intro{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-primary);max-width:var(--max-width-body);margin:0;
}
.mf-acc__list{
  list-style:none;margin:0;padding:0;
  display:grid;grid-template-columns:1fr;gap:1rem 2.5rem;
}
@media(min-width:820px){.mf-acc__list{grid-template-columns:1fr 1fr}}
.mf-acc__list li{display:flex;flex-direction:column;gap:.3rem}
.mf-acc__list b{
  font-family:var(--font-mono);font-weight:400;font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);
}
.mf-acc__list span{
  font-size:var(--text-body-md);line-height:1.7;
  color:var(--color-text-secondary);max-width:46ch;
}
.mf-acc__cases{
  display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:baseline;margin:0;
  font-size:var(--text-body-md);color:var(--color-text-secondary);
}
.mf-acc__cta{
  justify-self:start;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--color-accent);padding-bottom:4px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-acc__cta:hover{opacity:.65}

@media(max-width:899px){
  .mf-acc__trigger{grid-template-columns:2.5rem 1fr auto;row-gap:.5rem}
  .mf-acc__lead{grid-column:2 / -1}
}
      `}</style>
    </>
  );
}
