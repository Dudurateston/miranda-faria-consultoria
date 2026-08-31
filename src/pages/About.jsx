import React from "react";
import Link from "@/components/TransitionLink";

import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

export default function About() {
  const { lang, path } = useLang();
  const t = copy[lang].about;
  const nav = copy[lang].nav;
  usePageTitle(t.label);

  return (
    <>
      <section className="mf-about">
        <div className="mf-about__inner">
          <div className="mf-about__grid">
            <Reveal>
              {/* Retrato real ainda pendente (RECAP.md). Ate la, o
                  fallback tipografico com as iniciais — nunca uma foto
                  de banco de imagem. */}
              <figure className="mf-about__portrait">
                <span className="mf-about__initials" aria-hidden="true">
                  {t.portraitFallback}
                </span>
                <figcaption className="mf-label mf-about__caption">{t.name}</figcaption>
              </figure>
            </Reveal>

            <div className="mf-about__text">
              <Reveal>
                <p className="mf-label">{t.label}</p>
              </Reveal>
              <LineReveal as="h1" className="mf-about__lead">
                {t.lead}
              </LineReveal>
              <Reveal delay={140}>
                <div className="mf-about__body">
                  {t.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={200}>
                <p className="mf-label mf-about__loc">{t.location}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <MfRule />

      <section className="mf-about__cta">
        <div className="mf-about__inner">
          <Link to={path("contact")} className="mf-about__ctalink" data-cursor="link">
            {nav.contact} →
          </Link>
        </div>
      </section>

      <style>{`
.mf-about{padding:clamp(3rem,9vh,6rem) var(--gutter) clamp(3rem,7vh,5rem)}
.mf-about__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-about__grid{display:grid;grid-template-columns:1fr;gap:3rem;align-items:start}
@media(min-width:768px){
  .mf-about__grid{grid-template-columns:5fr 7fr;gap:clamp(2.5rem,6vw,5rem)}
}

.mf-about__portrait{
  margin:0;position:relative;width:100%;aspect-ratio:4/5;
  background:var(--paper);border:1px solid var(--color-divider);
  display:flex;align-items:flex-end;padding:1.25rem;
}
.mf-about__initials{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(3rem,9vw,5.5rem);letter-spacing:var(--tracking-wordmark);
  color:var(--color-text-ghost);
}
.mf-about__caption{position:relative;color:var(--color-text-ghost)}

.mf-about__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 2rem;
}
.mf-about__body p{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0 0 1.4rem;max-width:var(--max-width-body);
}
.mf-about__body p:first-child{color:var(--color-text-primary)}
.mf-about__body p:last-child{margin-bottom:0}
.mf-about__loc{margin:2rem 0 0}

.mf-about__cta{padding:clamp(2.5rem,6vh,4rem) var(--gutter) var(--section-gap)}
.mf-about__ctalink{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.08;
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);text-decoration:none;
  transition:color var(--duration-fast) var(--ease-in-out),
             transform var(--duration-base) var(--ease-out-expo);
  display:inline-block;
}
.mf-about__ctalink:hover{color:var(--color-accent);transform:translateX(14px)}
@media(prefers-reduced-motion:reduce){
  .mf-about__ctalink:hover{transform:none}
}
      `}</style>
    </>
  );
}
