import React from "react";
import Link from "@/components/TransitionLink";
import { Navigate, useParams } from "react-router-dom";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import CaseMedia from "@/components/CaseMedia";
import { useLang } from "@/lib/i18n";
import { copy, cases, getCase, getPractice } from "@/content/copy";
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
        <header className="mf-case__head" data-depth="0.08">
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
                {item.role && <span className="mf-label mf-case__role">{item.role}</span>}
              </div>
            </Reveal>
            <Reveal delay={200}>
              <p className="mf-case__summary">{item.summary}</p>
            </Reveal>
          </div>
        </header>

        {/* Capturas reais do sistema. Cases com dominio proprio
            (DECISIONS.md, regra revertida 16/09) ganham link ao vivo —
            aprovados no portao de qualidade 8.4. */}
        <div className="mf-case__inner mf-case__mediawrap">
          <Reveal delay={120}>
            <CaseMedia media={item.media} name={item.name} />
          </Reveal>
          <Reveal delay={200}>
            <ul className="mf-case__facts">
              <li>
                <span className="mf-case__factk">{t.factsSector}</span>
                <span className="mf-case__factv">{item.sector}</span>
              </li>
              <li>
                <span className="mf-case__factk">{t.factsYear}</span>
                <span className="mf-case__factv">{item.year}</span>
              </li>
              <li>
                <span className="mf-case__factk">{t.factsPractice}</span>
                <span className="mf-case__factv">{getPractice(lang, item.practice)?.label ?? item.practice}</span>
              </li>
              <li>
                <span className="mf-case__factk">{t.factsDelivery}</span>
                <span className="mf-case__factv">
                  {item.practice === "systems" ? t.factsDeliverySystems : t.factsDeliverySite}
                </span>
              </li>
            </ul>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                hrefLang="pt"
                className="mf-case__live"
                data-cursor="link"
              >
                ↗ {t.linkLabel}{lang === "en" ? " · in Portuguese" : ""}
              </a>
            )}
          </Reveal>
        </div>

        <MfRule />

        <div className="mf-case__body" data-depth="0.28">
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

        <nav className="mf-case__next" data-depth="0.88">
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
.mf-case__meta{display:flex;flex-wrap:wrap;gap:0.6rem 1.6rem;margin:1.6rem 0 0;min-width:0}
.mf-case__summary{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2rem 0 0;
}

.mf-case__mediawrap{padding:0 var(--gutter);margin-bottom:clamp(2rem,5vh,3.5rem)}
.mf-case__facts{
  list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;
  margin:1.4rem 0 0;padding:1.2rem 0 0;border-top:1px solid var(--color-divider);
}
@media(min-width:860px){.mf-case__facts{grid-template-columns:repeat(4,minmax(0,1fr))}}
.mf-case__facts li{display:flex;flex-direction:column;gap:0.35rem}
.mf-case__role{color:var(--color-text-ghost)}
.mf-case__live{
  display:inline-flex;align-items:center;gap:0.4rem;margin-top:1.2rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-accent);text-decoration:none;
  border-bottom:1px solid currentColor;padding-bottom:0.15rem;min-height:24px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-case__live:hover{opacity:0.72}
.mf-case__factk{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-case__factv{
  font-family:var(--font-body);font-size:var(--text-body-md);
  color:var(--color-text-primary);
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
