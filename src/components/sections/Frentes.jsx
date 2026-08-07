import React, { useRef } from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useScrollStagger } from "@/hooks/useScrollStagger";

// Layout: grade de duas colunas, separação por linha horizontal.
const frentes = [
  {
    t: "Sistemas sob medida",
    d: "Catálogo, estoque, cadastro e pedidos. Banco de dados de verdade e painel que o dono opera sozinho.",
  },
  {
    t: "BI e planilhas",
    d: "Seus números saindo do Excel manual e virando painel que atualiza sozinho. Venda, estoque, margem e produtividade em uma tela.",
  },
  {
    t: "Automação",
    d: "Fluxos que rodam sem ninguém apertar botão: atendimento na API do WhatsApp, qualificação de lead, agendamento, relatório pronto no e-mail.",
  },
  {
    t: "Marca e design com IA",
    d: "Identidade visual, site e material de aplicação — construídos com IA e refinados à mão.",
  },
];

export default function Frentes() {
  const gridRef = useRef(null);
  useScrollStagger(gridRef, { selector: ".mf-frentes__cell", stagger: 0.1, y: 30 });

  return (
    <>
      <section className="mf-frentes" data-bg="#F5F1EA" id="frentes">
        <div className="mf-frentes__inner">
          <Reveal>
            <p className="mf-label">Frentes</p>
          </Reveal>
          <LineReveal className="mf-frentes__lead">O que entrego.</LineReveal>
          <div ref={gridRef} className="mf-frentes__grid">
            {frentes.map((f, i) => (
              <article className="mf-frentes__cell" key={i}>
                <span className="mf-frentes__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mf-frentes__title">{f.t}</h3>
                <p className="mf-frentes__desc">{f.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <style>{`
.mf-frentes{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-frentes__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-frentes__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 3rem;width:100%}
.mf-frentes__grid{display:grid;grid-template-columns:1fr;gap:0;border-bottom:1px solid var(--color-divider)}
@media(min-width:768px){.mf-frentes__grid{grid-template-columns:1fr 1fr;column-gap:4rem}}
.mf-frentes__cell{padding:2rem 0;border-top:1px solid var(--color-divider)}
.mf-frentes__num{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-text-ghost)}
.mf-frentes__title{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-md);line-height:1.15;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1rem 0 0.8rem}
.mf-frentes__desc{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0;max-width:38ch}
      `}</style>
    </>
  );
}