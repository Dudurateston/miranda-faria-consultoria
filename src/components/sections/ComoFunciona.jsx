import React from "react";
import Reveal from "@/components/Reveal";

// Layout: quatro passos em linha, separados por linha vertical.
const passos = [
  { t: "Diagnóstico", d: "Uma conversa para entender onde o processo trava. Sem custo." },
  { t: "Escopo fechado", d: "Proposta com entrega, prazo e valor definidos. Sem surpresa depois." },
  { t: "Construção", d: "Você acompanha durante, não só no final." },
  { t: "Entrega e autonomia", d: "Sistema no ar, você treinado para operar. A infraestrutura fica no seu nome." },
];

export default function ComoFunciona() {
  return (
    <>
      <section className="mf-como" data-bg="#F5F1EA" id="como-funciona">
        <div className="mf-como__inner">
          <Reveal>
            <p className="mf-label">Como funciona</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mf-como__lead">Quatro passos.</h2>
          </Reveal>
          <ol className="mf-como__steps">
            {passos.map((p, i) => (
              <li className="mf-como__step" key={i}>
                <span className="mf-como__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mf-como__title">{p.t}</h3>
                <p className="mf-como__desc">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <style>{`
.mf-como{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-como__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-como__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 3rem;width:100%}
.mf-como__steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0}
.mf-como__step{padding:1.8rem 0;border-top:1px solid var(--color-divider)}
.mf-como__step:last-child{border-bottom:1px solid var(--color-divider)}
@media(min-width:768px){
  .mf-como__steps{grid-template-columns:repeat(4,1fr);border-top:1px solid var(--color-divider);border-bottom:1px solid var(--color-divider)}
  .mf-como__step{padding:2.4rem 1.5rem;border-top:none;border-bottom:none}
  .mf-como__step:not(:first-child){border-left:1px solid var(--color-divider)}
  .mf-como__step:first-child{padding-left:0}
  .mf-como__step:last-child{padding-right:0}
}
.mf-como__num{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-text-ghost)}
.mf-como__title{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-md);line-height:1.1;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1rem 0 0.7rem}
.mf-como__desc{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0}
      `}</style>
    </>
  );
}