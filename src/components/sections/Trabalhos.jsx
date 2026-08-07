import React, { useRef } from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useScrollStagger } from "@/hooks/useScrollStagger";

// Índice tipográfico — o sumário de um livro. Cada cliente é uma
// linha em display-xl ocupando quase toda a largura, com o número em
// mono à esquerda. Ao passar o mouse a linha desliza 24px à direita e
// a descrição aparece por baixo. Sem cards.
const cases = [
  {
    nome: "MotorMoura",
    setor: "Distribuidora de autopeças",
    d: "Catálogo B2B com banco de dados completo e painel administrativo. O cliente cadastra produto, categoria, marca e imagem sem depender de mim.",
  },
  {
    nome: "1000 Peças Truck Center",
    setor: "Peças para caminhão",
    d: "Presença digital e estrutura de catálogo para operação de peças pesadas.",
  },
  {
    nome: "Rota Forte Logística",
    setor: "Transporte",
    d: "Site e estrutura digital para operação de logística.",
  },
  {
    nome: "DJ Jotavê",
    setor: "Artista",
    d: "Site de apresentação completo: identidade, agenda e material de divulgação.",
  },
];

export default function Trabalhos() {
  const listRef = useRef(null);
  useScrollStagger(listRef, { selector: ".mf-trab__item", stagger: 0.1, y: 30 });

  return (
    <>
      <section
        className="mf-trab"
        data-bg="#1A1A18"
        data-theme="dark"
        id="trabalhos"
      >
        <div className="mf-trab__inner">
          <Reveal>
            <p className="mf-label">Trabalhos</p>
          </Reveal>
          <LineReveal className="mf-trab__lead">Projetos em campo.</LineReveal>
          <div ref={listRef} className="mf-trab__list">
            {cases.map((c, i) => (
              <div className="mf-trab__item" key={i}>
                <div className="mf-trab__row">
                  <span className="mf-trab__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mf-trab__name">{c.nome}</h3>
                </div>
                <div className="mf-trab__detail">
                  <span className="mf-label mf-trab__setor">{c.setor}</span>
                  <p className="mf-trab__desc">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
.mf-trab{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-trab__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-trab__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 3.5rem;width:100%}
.mf-trab__list{display:flex;flex-direction:column}
.mf-trab__item{padding:2rem 0;border-top:1px solid var(--color-divider)}
.mf-trab__item:last-child{border-bottom:1px solid var(--color-divider)}
.mf-trab__row{display:flex;align-items:baseline;gap:2rem;transition:transform 450ms var(--ease-out-expo)}
.mf-trab__num{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-text-ghost);flex-shrink:0;width:3rem}
.mf-trab__name{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:1.06;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0}
.mf-trab__detail{display:flex;flex-direction:column;gap:0.6rem;padding:0 0 0 5rem;max-height:0;opacity:0;overflow:hidden;transition:max-height 450ms var(--ease-out-expo),opacity 350ms var(--ease-out-expo),padding 450ms var(--ease-out-expo)}
.mf-trab__setor{display:inline-block}
.mf-trab__desc{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0;max-width:60ch}
@media(hover:hover){
  .mf-trab__item:hover .mf-trab__row{transform:translateX(24px)}
  .mf-trab__item:hover .mf-trab__detail{max-height:260px;opacity:1;padding:1.2rem 0 0 5rem}
}
@media(hover:none){
  .mf-trab__detail{max-height:260px;opacity:1;padding:1.2rem 0 0 5rem}
}
      `}</style>
    </>
  );
}