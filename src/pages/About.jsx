import React from "react";
import Link from "@/components/TransitionLink";

import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { CELESTE_GIF, WHATSAPP_URL_SELLER, SELLERS_APP_URL } from "@/lib/site";
import AutoVideo from "@/components/AutoVideo";

export default function About() {
  const { lang, path } = useLang();
  const t = copy[lang].about;
  const s = copy[lang].sellers;
  const nav = copy[lang].nav;
  usePageTitle(t.label, "about");

  return (
    <>
      <section className="mf-about" data-depth="0.08">
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

      {/* Banda em simbiose — carta celeste integrada ao fundo, sem
          moldura de video repetido: o mesmo reel do card da home nao
          aparece de novo aqui. */}
      <section className="mf-about__band" data-depth="0.20" aria-hidden="true">
        <AutoVideo className="mf-about__bandimg" src={CELESTE_GIF} />
      </section>

      <MfRule />

      <section className="mf-about__traj" data-depth="0.26">
        <div className="mf-about__inner">
          <Reveal>
            <p className="mf-label">{t.trajectoryLabel}</p>
          </Reveal>
          <Reveal delay={140}>
            <p className="mf-about__trajtext">{t.trajectory}</p>
          </Reveal>
          <ul className="mf-about__trajlist">
            {(t.trajItems || []).map((item, i) => (
              <li key={item} className="mf-about__trajitem">
                <Reveal delay={200 + i * 50}>{item}</Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MfRule />

      <section className="mf-about__princ" data-depth="0.30">
        <div className="mf-about__inner">
          <Reveal>
            <p className="mf-label">{t.principlesLabel}</p>
          </Reveal>
          <div className="mf-about__princgrid">
            {t.principles.map((p, i) => (
              <Reveal key={p.t} delay={i * 110} className="mf-about__princitem">
                <h2 className="mf-about__princt">{p.t}</h2>
                <p className="mf-about__princd">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mf-about__sellers" data-depth="0.32">
        <div className="mf-about__inner">
          <Reveal>
            <p className="mf-label">{s.label}</p>
          </Reveal>
          <LineReveal as="h2" className="mf-about__sellerslead">
            {s.lead}
          </LineReveal>
          <Reveal delay={120}>
            <p className="mf-about__sellersbody">{s.body}</p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mf-about__sellersctas">
              <a href={WHATSAPP_URL_SELLER} target="_blank" rel="noopener noreferrer" className="mf-about__sellerswa" data-cursor="link">
                {s.wa} →
              </a>
              <a href={SELLERS_APP_URL} target="_blank" rel="noopener noreferrer" className="mf-about__sellersapp" data-cursor="link">
                {s.app} ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <MfRule />

      <section className="mf-about__cta" data-depth="0.34">
        <div className="mf-about__inner">
          <Link to={path("contact")} className="mf-about__ctalink" data-cursor="link">
            {nav.contact} →
          </Link>
        </div>
      </section>

      <style>{`
/* Trajetória: texto + arte generativa de marca lado a lado. */
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

.mf-about__band{position:relative;height:clamp(180px,30vh,300px);overflow:hidden}
.mf-about__bandimg{
  width:100%;height:100%;object-fit:cover;display:block;opacity:0.22;
  -webkit-mask-image:linear-gradient(90deg,transparent 0%,black 18%,black 82%,transparent 100%);
  mask-image:linear-gradient(90deg,transparent 0%,black 18%,black 82%,transparent 100%);
}

.mf-about__traj{padding:var(--section-gap) var(--gutter)}
.mf-about__trajtext{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:1.5rem 0 0;
}
.mf-about__trajlist{list-style:none;margin:2.4rem 0 0;padding:0;max-width:var(--max-width-body)}
.mf-about__trajitem{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);
  padding:0.85rem 0;border-bottom:1px solid var(--mf-rule);
}
.mf-about__trajitem:first-child{border-top:1px solid var(--mf-rule)}

.mf-about__princ{padding:0 var(--gutter) var(--section-gap)}
.mf-about__princgrid{display:grid;grid-template-columns:1fr;gap:2.2rem;margin-top:2.2rem}
@media(min-width:860px){.mf-about__princgrid{grid-template-columns:repeat(3,1fr);gap:clamp(1.6rem,3vw,2.8rem)}}
.mf-about__princt{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.15;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0 0 0.8rem;
}
.mf-about__princd{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;
}

.mf-about__sellers{padding:0 var(--gutter) var(--section-gap)}
.mf-about__sellerslead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1rem 0 0;max-width:24ch;text-wrap:balance;
}
.mf-about__sellersbody{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:58ch;margin:1.1rem 0 0;
}
.mf-about__sellersctas{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 2rem;margin-top:1.6rem}
.mf-about__sellerswa{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta-deep);text-decoration:none;
}
.mf-about__sellerswa:hover{opacity:0.7}
.mf-about__sellersapp{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
}
.mf-about__sellersapp:hover{color:var(--color-text-primary)}
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