import React from "react";
import Reveal from "@/components/Reveal";

// Layout: duas colunas — retrato à esquerda, texto à direita.
export default function Sobre() {
  return (
    <>
      <section className="mf-sobre" data-bg="#F5F1EA" id="sobre">
        <div className="mf-sobre__inner">
          <div className="mf-sobre__grid">
            <Reveal>
              <figure className="mf-sobre__portrait">
                <figcaption className="mf-label mf-sobre__caption">
                  Eduardo Miranda Faria
                </figcaption>
              </figure>
            </Reveal>
            <div className="mf-sobre__text">
              <Reveal>
                <p className="mf-label">Quem faz</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mf-sobre__lead">Tecnologia aplicada a negócio real.</h2>
              </Reveal>
              <Reveal delay={140}>
                <div className="mf-sobre__body">
                  <p>
                    Sou Eduardo Miranda Faria. Trabalho com tecnologia aplicada a
                    negócio real — o tipo que tem estoque, cliente ligando e prazo
                    apertado.
                  </p>
                  <p>
                    Atendo principalmente empresas do interior de Minas:
                    distribuidoras, oficinas, transportadoras, produtores e
                    prestadores de serviço. Gente que já faturou o suficiente para
                    saber que planilha solta não escala mais.
                  </p>
                  <p>
                    Uso IA como ferramenta central do trabalho, tanto na
                    construção dos sistemas quanto na criação visual. Isso
                    encurta prazo e derruba custo.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <style>{`
.mf-sobre{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-sobre__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-sobre__grid{display:grid;grid-template-columns:1fr;gap:3rem;align-items:start}
@media(min-width:768px){.mf-sobre__grid{grid-template-columns:5fr 7fr;gap:5rem}}
.mf-sobre__portrait{margin:0;position:relative;width:100%;aspect-ratio:4/5;background:var(--paper);display:flex;align-items:flex-end;padding:1.25rem}
.mf-sobre__caption{color:var(--color-text-ghost)}
.mf-sobre__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 2rem;width:100%}
.mf-sobre__body p{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0 0 1.4rem;max-width:var(--max-width-body)}
.mf-sobre__body p:first-child{color:var(--color-text-primary)}
.mf-sobre__body p:last-child{margin-bottom:0}
      `}</style>
    </>
  );
}