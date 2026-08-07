import React, { useRef } from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useScrollStagger } from "@/hooks/useScrollStagger";

// Layout assimétrico e escalonado: cada frente é uma faixa horizontal
// com número (01–04) em mono à esquerda, nome em display-lg e a
// descrição numa coluna estreita deslocada — ímpares à direita, pares
// à esquerda. Régua de 1px separa cada faixa.
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
  useScrollStagger(gridRef, { selector: ".mf-frentes__band", stagger: 0.12, y: 30 });

  return (
    <>
      <section className="mf-frentes" data-bg="#F5F1EA" id="frentes">
        <div className="mf-frentes__inner">
          <Reveal>
            <p className="mf-label">Frentes</p>
          </Reveal>
          <LineReveal className="mf-frentes__lead">O que entrego.</LineReveal>
          <div ref={gridRef} className="mf-frentes__bands">
            {frentes.map((f, i) => (
              <div
                className="mf-frentes__band"
                data-side={i % 2 === 0 ? "right" : "left"}
                key={i}
              >
                <span className="mf-frentes__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mf-frentes__body">
                  <h3 className="mf-frentes__name">{f.t}</h3>
                  <p className="mf-frentes__desc">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
.mf-frentes{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-frentes__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-frentes__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 3.5rem;width:100%}
.mf-frentes__bands{display:flex;flex-direction:column}
.mf-frentes__band{display:grid;grid-template-columns:4.5rem 1fr;gap:0 2rem;align-items:baseline;padding:2.6rem 0;border-top:1px solid var(--color-divider)}
.mf-frentes__band:last-child{border-bottom:1px solid var(--color-divider)}
.mf-frentes__num{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-text-ghost)}
.mf-frentes__body{display:flex;flex-direction:column;gap:1rem}
.mf-frentes__name{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-lg);line-height:1.08;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0}
.mf-frentes__desc{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0;max-width:34ch}
.mf-frentes__band[data-side="right"] .mf-frentes__desc{margin-left:auto;text-align:right}
.mf-frentes__band[data-side="left"] .mf-frentes__desc{margin-right:auto;text-align:left}
@media(max-width:767px){
  .mf-frentes__band{grid-template-columns:3rem 1fr;gap:0 1.25rem;padding:2rem 0}
  .mf-frentes__band[data-side="right"] .mf-frentes__desc,
  .mf-frentes__band[data-side="left"] .mf-frentes__desc{margin:0;text-align:left}
}
      `}</style>
    </>
  );
}