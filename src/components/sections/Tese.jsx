import React from "react";
import Reveal from "@/components/Reveal";

// Layout: frase principal à esquerda, quase toda a largura.
export default function Tese() {
  return (
    <>
      <section className="mf-tese" data-bg="#F5F1EA" id="tese">
        <div className="mf-tese__inner">
          <Reveal>
            <p className="mf-label">O que eu faço</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mf-tese__lead">
              Estruturo a base que sustenta o negócio.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mf-tese__body">
              Catálogos, painéis e processos que funcionam sem depender de mim
              todo dia. A infraestrutura fica no seu nome — você opera, eu saio
              de cena.
            </p>
          </Reveal>
        </div>
      </section>
      <style>{`
.mf-tese{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-tese__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-tese__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 0;width:100%}
.mf-tese__body{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-lg);line-height:var(--leading-body);color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2.5rem 0 0}
      `}</style>
    </>
  );
}