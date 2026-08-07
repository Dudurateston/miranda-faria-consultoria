import React from "react";
import Reveal from "@/components/Reveal";

// Layout: lista com régua — cada dor numa linha separada por linha de cabelo.
const dores = [
  "Você sabe o preço de cabeça, mas ninguém mais sabe.",
  "O estoque está certo na sua memória e errado na planilha.",
  "O pedido chegou no WhatsApp e sumiu na conversa.",
  "O relatório existe, mas leva duas horas para montar todo mês.",
];

export default function OndeDoi() {
  return (
    <>
      <section
        className="mf-doi"
        data-bg="#1A1A18"
        data-theme="dark"
        id="onde-doi"
      >
        <div className="mf-doi__inner">
          <Reveal>
            <p className="mf-label">Onde isso dói</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mf-doi__lead">
              O sistema começa onde a planilha trava.
            </h2>
          </Reveal>
          <ul className="mf-doi__list">
            {dores.map((d, i) => (
              <li className="mf-doi__item" key={i}>
                <span className="mf-doi__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mf-doi__pain">{d}</p>
              </li>
            ))}
          </ul>
          <Reveal delay={80}>
            <p className="mf-doi__punch">
              Nada disso se resolve com site bonito. Resolve com sistema.
            </p>
          </Reveal>
        </div>
      </section>
      <style>{`
.mf-doi{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-doi__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-doi__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 3rem;width:100%}
.mf-doi__list{list-style:none;margin:0;padding:0}
.mf-doi__item{display:grid;grid-template-columns:3rem 1fr;gap:1.5rem;align-items:baseline;padding:1.6rem 0;border-top:1px solid var(--color-divider)}
.mf-doi__item:last-child{border-bottom:1px solid var(--color-divider)}
.mf-doi__num{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-text-ghost)}
.mf-doi__pain{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-lg);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0}
.mf-doi__punch{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-md);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--copper);margin:3rem 0 0;max-width:var(--max-width-body)}
      `}</style>
    </>
  );
}