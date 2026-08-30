import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy, cases, getCase } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

export default function WorkCase() {
  const { slug } = useParams();
  const { lang, path } = useLang();
  const t = copy[lang].work;

  const item = getCase(lang, slug);

  // Antes do return antecipado: hook nao pode ficar atras de condicional.
  usePageTitle(item ? item.name : t.label);

  if (!item) return <Navigate to={path("work")} replace />;

  const list = cases[lang];
  const index = list.findIndex((c) => c.slug === slug);
  const next = list[(index + 1) % list.length];

  const blocks = [
    { k: "problem", label: t.sections.problem, body: item.problem },
    { k: "process", label: t.sections.process, body: item.process },
    { k: "decisions", label: t.sections.decisions, body: item.decisions },
    { k: "impact", label: t.sections.impact, body: item.impact },
  ];

  return (
    <>
      <article className="mf-case">
        <header className="mf-case__head">
          <div className="mf-case__inner">
            <Reveal>
              <Link to={path("work")} className="mf-label mf-case__back" data-cursor="link">
                ← {t.backToIndex}
              </Link>
            </Reveal>
            <LineReveal as="h1" className="mf-case__title">
              {item.name}
            </LineReveal>
            <Reveal delay={140}>
              <div className="mf-case__meta">
                <span className="mf-label">{item.sector}</span>
                <span className="mf-label">{item.year}</span>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <p className="mf-case__summary">{item.summary}</p>
            </Reveal>
          </div>
        </header>

        {/* Espaco reservado para print ou video do sistema. Nunca link
            para o app do cliente (DECISIONS.md). */}
        <div className="mf-case__inner">
          <Reveal delay={120}>
            <figure className="mf-case__media" aria-hidden="true">
              <span className="mf-label">{item.name}</span>
            </figure>
          </Reveal>
        </div>

        <MfRule />

        <div className="mf-case__body">
          <div className="mf-case__inner">
            {blocks.map((b, i) => (
              <Reveal key={b.k} delay={i * 60}>
                <section className="mf-case__block">
                  <p className="mf-label mf-case__blocklabel">{b.label}</p>
                  <p className="mf-case__text">{b.body}</p>
                </section>
              </Reveal>
            ))}
          </div>
        </div>

        <MfRule />

        <nav className="mf-case__next">
          <div className="mf-case__inner">
            <p className="mf-label">{t.nextCase}</p>
            <Link to={path(`work/${next.slug}`)} className="mf-case__nextlink" data-cursor="link">
              {next.name}
            </Link>
          </div>
        </nav>
      </article>

      <style>{`
.mf-case__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-case__head{padding:clamp(3rem,9vh,6rem) var(--gutter) clamp(2rem,5vh,3rem)}
.mf-case__back{display:inline-block;text-decoration:none;margin-bottom:2rem;transition:color var(--duration-fast) var(--ease-in-out)}
.mf-case__back:hover{color:var(--color-accent)}
.mf-case__title{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-hero);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
}
.mf-case__meta{display:flex;gap:1.6rem;margin:1.6rem 0 0}
.mf-case__summary{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2rem 0 0;
}

.mf-case__media{
  margin:0 var(--gutter) clamp(2rem,5vh,3.5rem);
  aspect-ratio:16/9;background:var(--paper);
  border:1px solid var(--color-divider);
  display:flex;align-items:flex-end;padding:1.25rem;
}

.mf-case__body{padding:clamp(2.5rem,6vh,4.5rem) var(--gutter)}
.mf-case__block{
  display:grid;grid-template-columns:1fr;gap:0.9rem;
  padding:clamp(1.6rem,3.5vh,2.6rem) 0;
  border-bottom:1px solid var(--color-divider);
}
.mf-case__block:last-child{border-bottom:0}
@media(min-width:768px){
  .mf-case__block{grid-template-columns:11rem 1fr;gap:0 clamp(2rem,5vw,4rem);align-items:baseline}
}
.mf-case__blocklabel{margin:0}
.mf-case__text{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-primary);margin:0;max-width:62ch;
}

.mf-case__next{padding:clamp(2.5rem,6vh,4rem) var(--gutter) var(--section-gap)}
.mf-case__nextlink{
  display:inline-block;margin-top:1rem;
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.08;
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);text-decoration:none;
  transition:color var(--duration-fast) var(--ease-in-out),
             transform var(--duration-base) var(--ease-out-expo);
}
.mf-case__nextlink:hover{color:var(--color-accent);transform:translateX(14px)}
@media(prefers-reduced-motion:reduce){
  .mf-case__nextlink:hover{transform:none}
}
      `}</style>
    </>
  );
}
