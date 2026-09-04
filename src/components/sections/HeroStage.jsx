import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { WHATSAPP_URL, HERO_LOOP_MP4, M_LOGO_HERO } from "@/lib/site";

/**
 * Hero imersiva: fundo 3D em loop (MP4, autoplay/muted/loop/playsinline)
 * coberto por um scrim para leitura, o M transparente como watermark
 * grande e translúcido no centro, marca e CTA "Fale comigo" (WhatsApp)
 * na frente, particulas de cobre flutuando e indicador "ROLE" no pe.
 */
const MOTES = [
  { left: "12%", top: "22%", s: 3, d: 11, delay: 0 },
  { left: "78%", top: "18%", s: 2, d: 14, delay: 1.2 },
  { left: "66%", top: "62%", s: 4, d: 12, delay: 0.6 },
  { left: "22%", top: "70%", s: 2, d: 15, delay: 2 },
  { left: "88%", top: "48%", s: 3, d: 10, delay: 0.3 },
  { left: "8%", top: "52%", s: 2, d: 13, delay: 1.6 },
  { left: "45%", top: "12%", s: 3, d: 16, delay: 0.9 },
  { left: "34%", top: "82%", s: 2, d: 12, delay: 2.4 },
];

export default function HeroStage() {
  const { lang } = useLang();
  const t = copy[lang].home;
  const content = useRef(null);

  useEffect(() => {
    const el = content.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    const tw = gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: 0.25 }
    );
    return () => tw.kill();
  }, []);

  return (
    <section className="mf-hero" data-theme="dark" aria-label={t.wordmark}>
      <video
        className="mf-hero__bg"
        src={HERO_LOOP_MP4}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="mf-hero__scrim" aria-hidden="true" />
      <img className="mf-hero__wm" src={M_LOGO_HERO} alt="" aria-hidden="true" />
      <div className="mf-hero__motes" aria-hidden="true">
        {MOTES.map((m, i) => (
          <span
            key={i}
            style={{
              left: m.left,
              top: m.top,
              width: m.s,
              height: m.s,
              animationDuration: `${m.d}s`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>

      <div ref={content} className="mf-hero__content" style={{ opacity: 0 }}>
        <h1 className="mf-hero__title">{t.wordmark}</h1>
        <p className="mf-hero__role">{t.role}</p>
        <span className="mf-hero__rule" aria-hidden="true" />
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mf-hero__cta"
          data-cursor="link"
        >
          {t.heroCta}
        </a>
      </div>

      <div className="mf-hero__scroll" aria-hidden="true">
        <span className="mf-hero__scrolllabel">{t.scrollHint}</span>
        <svg
          className="mf-hero__chev"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 9l8 8 8-8" />
        </svg>
      </div>

      <style>{`
.mf-hero{
  position:relative;min-height:100svh;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;background:var(--mf-graphite);
}
.mf-hero__bg{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;display:block;
}
.mf-hero__scrim{
  position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(20,20,20,0.42) 0%,rgba(20,20,20,0.30) 45%,rgba(20,20,20,0.64) 100%);
}
.mf-hero__wm{
  position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);
  width:clamp(260px,42vw,560px);opacity:0.34;
  pointer-events:none;user-select:none;
  mix-blend-mode:screen;
  animation:mf-wm-breathe 9s var(--ease-in-out) infinite;
}
@keyframes mf-wm-breathe{
  0%,100%{opacity:0.30;transform:translate(-50%,-50%) scale(1)}
  50%{opacity:0.40;transform:translate(-50%,-50%) scale(1.02)}
}
@media(prefers-reduced-motion:reduce){.mf-hero__wm{animation:none;opacity:0.34}}
.mf-hero__motes{position:absolute;inset:0;pointer-events:none}
.mf-hero__motes span{
  position:absolute;border-radius:50%;
  background:var(--copper-light);opacity:0.45;
  animation:mf-float ease-in-out infinite;
}
.mf-hero__motes span:nth-child(even){background:rgba(245,241,234,0.85)}
@keyframes mf-float{
  0%,100%{transform:translateY(0);opacity:0.3}
  50%{transform:translateY(-28px);opacity:0.75}
}
.mf-hero__content{
  position:relative;z-index:2;
  display:flex;flex-direction:column;align-items:center;text-align:center;
  padding:0 var(--gutter);
}
.mf-hero__title{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(2.8rem,9vw,6.5rem);line-height:1.04;
  letter-spacing:0.06em;text-transform:uppercase;
  color:var(--bone);margin:0;
}
.mf-hero__role{
  font-family:var(--font-mono);
  font-size:clamp(0.7rem,1.4vw,0.85rem);
  letter-spacing:0.4em;text-transform:uppercase;
  color:rgba(245,241,234,0.75);margin:1.4rem 0 0;
}
.mf-hero__rule{
  display:block;width:64px;height:1px;
  background:var(--mf-terracotta);margin:2.4rem auto 0;
}
.mf-hero__cta{
  margin-top:2.4rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);border:1px solid var(--mf-terracotta);
  padding:1rem 2.4rem;text-decoration:none;
  transition:background var(--duration-fast) var(--ease-in-out),
             box-shadow var(--duration-base) var(--ease-in-out),
             transform var(--duration-base) var(--ease-out-expo);
}
.mf-hero__cta:hover{
  background:rgba(179,122,96,0.18);
  box-shadow:0 0 32px rgba(179,122,96,0.35);
  transform:translateY(-2px);
}
.mf-hero__scroll{
  position:absolute;left:50%;bottom:2rem;transform:translateX(-50%);z-index:2;
  display:flex;flex-direction:column;align-items:center;gap:0.5rem;
  color:rgba(245,241,234,0.6);
}
.mf-hero__scrolllabel{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
}
.mf-hero__chev{animation:mf-chev 1.8s var(--ease-in-out) infinite}
@keyframes mf-chev{
  0%,100%{transform:translateY(0);opacity:0.5}
  50%{transform:translateY(6px);opacity:1}
}
@media(prefers-reduced-motion:reduce){
  .mf-hero__motes span,.mf-hero__chev{animation:none}
}
      `}</style>
    </section>
  );
}