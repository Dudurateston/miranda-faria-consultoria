import React from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";

/**
 * Abertura padrao das paginas internas. Ocupa boa parte da primeira
 * tela de proposito: e o gesto que faz cada aba parecer uma experiencia
 * propria e nao a continuacao rolada da Home (CLAUDE.md).
 */
export default function PageHeader({ label, lead, intro }) {
  return (
    <>
      <header className="mf-ph">
        <div className="mf-ph__inner">
          <Reveal>
            <p className="mf-label">{label}</p>
          </Reveal>
          <LineReveal as="h1" className="mf-ph__lead">
            {lead}
          </LineReveal>
          {intro && (
            <Reveal delay={160}>
              <p className="mf-ph__intro">{intro}</p>
            </Reveal>
          )}
        </div>
      </header>

      <style>{`
.mf-ph{padding:clamp(3.5rem,11vh,7rem) var(--gutter) clamp(2.5rem,7vh,4.5rem)}
.mf-ph__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-ph__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-ph__intro{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);
  margin:2.25rem 0 0;
}
      `}</style>
    </>
  );
}
