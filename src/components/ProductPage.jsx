import React from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";

/**
 * Casca comum das paginas de produto (Apontador PT, Eightyfive EN).
 * Mesmo vocabulario visual do Contact: label mono, display, corpo leve,
 * CTA terracota. FAQ em <details> nativo: abre sem JS e o texto fica no
 * DOM para buscador e leitor de tela.
 */
export default function ProductPage({ c, primaryHref, secondaryHref, contactLine, extra }) {
  return (
    <>
      <section className="mf-prod" data-depth="0.90">
        <div className="mf-prod__inner">
          <Reveal>
            <p className="mf-label">{c.label}</p>
          </Reveal>
          <LineReveal as="h1" className="mf-prod__lead">
            {c.lead}
          </LineReveal>
          <Reveal delay={140}>
            <p className="mf-prod__body">{c.body}</p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mf-prod__actions">
              <a
                href={primaryHref}
                target={primaryHref.startsWith("http") ? "_blank" : undefined}
                rel={primaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mf-prod__primary"
                data-cursor="link"
              >
                {c.primary}
              </a>
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mf-prod__secondary"
                data-cursor="link"
              >
                {c.secondary} ↗
              </a>
            </div>
          </Reveal>
          {contactLine ? (
            <Reveal delay={240}>
              <p className="mf-label mf-prod__note">{contactLine}</p>
            </Reveal>
          ) : null}

          <Reveal>
            <h2 className="mf-prod__h2">{c.featuresTitle}</h2>
            <ul className="mf-prod__list">
              {c.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Reveal>

          {extra}

          <Reveal>
            <h2 className="mf-prod__h2">{c.faqTitle}</h2>
            <div className="mf-prod__faq">
              {c.faq.map(({ q, a }) => (
                <details key={q} className="mf-prod__faqitem">
                  <summary className="mf-prod__faqq">{q}</summary>
                  <p className="mf-prod__faqa">{a}</p>
                </details>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mf-prod__closing">
              <p className="mf-prod__closinglead">{c.closing}</p>
              <a
                href={primaryHref}
                target={primaryHref.startsWith("http") ? "_blank" : undefined}
                rel={primaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mf-prod__primary"
                data-cursor="link"
              >
                {c.primary}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-prod{min-height:calc(100vh - var(--nav-height));padding:var(--section-gap) var(--gutter)}
.mf-prod__inner{max-width:var(--max-width-page);margin:0 auto;width:100%}
.mf-prod__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-hero);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-prod__body,.mf-prod__list li,.mf-prod__faqa,.mf-prod__p{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);
}
.mf-prod__body{margin:2.25rem 0 0}
.mf-prod__actions{display:flex;flex-wrap:wrap;align-items:center;gap:1.5rem 2.5rem;margin:3rem 0 0}
.mf-prod__primary{
  display:inline-flex;align-items:center;gap:0.7rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--on-accent,#F5F1EA);background:var(--mf-terracotta);text-decoration:none;
  padding:1.1rem 2.2rem;border:1px solid var(--mf-terracotta);
  transition:background var(--duration-fast) var(--ease-in-out),border-color var(--duration-fast) var(--ease-in-out);
}
.mf-prod__primary:hover{background:var(--ink);border-color:var(--ink)}
.mf-prod__secondary{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
  border-bottom:1px solid var(--color-divider);padding-bottom:3px;
}
.mf-prod__secondary:hover{color:var(--color-accent);border-color:var(--color-accent)}
.mf-prod__note{margin:2rem 0 0}
.mf-prod__h2{
  font-family:var(--font-display);font-weight:400;font-size:var(--text-display-lg);
  line-height:var(--leading-display);color:var(--color-text-primary);
  margin:clamp(4rem,9vw,7rem) 0 0;padding-top:1.5rem;border-top:1px solid var(--color-divider);
}
.mf-prod__list{list-style:none;padding:0;margin:1.75rem 0 0;display:flex;flex-direction:column;gap:1rem}
.mf-prod__list li{padding-left:1.4rem;position:relative}
.mf-prod__list li::before{content:"";position:absolute;left:0;top:0.75em;width:0.6rem;height:1px;background:var(--copper)}
.mf-prod__ol{list-style:decimal;padding-left:1.4rem}
.mf-prod__ol li::before{display:none}
.mf-prod__p{margin:1.5rem 0 0}
.mf-prod__small{font-size:var(--text-body-md);color:var(--color-text-ghost)}
.mf-prod__faq{margin:1.5rem 0 0;max-width:var(--max-width-body)}
.mf-prod__faqitem{border-bottom:1px solid var(--color-divider);padding:1.1rem 0}
.mf-prod__faqq{
  cursor:pointer;font-family:var(--font-body);font-weight:400;
  font-size:var(--text-body-lg);color:var(--color-text-primary);
}
.mf-prod__faqitem[open] .mf-prod__faqq{color:var(--color-accent)}
.mf-prod__faqa{margin:0.8rem 0 0}
.mf-prod__closing{margin:clamp(4rem,9vw,7rem) 0 0;display:flex;flex-direction:column;align-items:flex-start;gap:1.5rem}
.mf-prod__closinglead{
  font-family:var(--font-display);font-weight:400;font-size:var(--text-display-lg);
  color:var(--color-text-primary);margin:0;
}
      `}</style>
    </>
  );
}
