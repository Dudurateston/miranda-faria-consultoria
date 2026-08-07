import React from "react";
import Reveal from "@/components/Reveal";

// Layout: lista em coluna única, nome em destaque + setor à direita.
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
          <Reveal delay={80}>
            <h2 className="mf-trab__lead">Projetos em campo.</h2>
          </Reveal>
          <ul className="mf-trab__list">
            {cases.map((c, i) => (
              <li className="mf-trab__item" key={i}>
                <div className="mf-trab__head">
                  <h3 className="mf-trab__name">{c.nome}</h3>
                  <span className="mf-label mf-trab__setor">{c.setor}</span>
                </div>
                <p className="mf-trab__desc">{c.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <style>{`
.mf-trab{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-trab__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-trab__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 3rem;width:100%}
.mf-trab__list{list-style:none;margin:0;padding:0}
.mf-trab__item{padding:2.2rem 0;border-top:1px solid var(--color-divider)}
.mf-trab__item:last-child{border-bottom:1px solid var(--color-divider)}
.mf-trab__head{display:flex;align-items:baseline;justify-content:space-between;gap:2rem;flex-wrap:wrap}
.mf-trab__name{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-md);line-height:1.1;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0}
.mf-trab__setor{text-transform:uppercase}
.mf-trab__desc{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:1rem 0 0;max-width:60ch}
      `}</style>
    </>
  );
}