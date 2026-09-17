import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTheme, hasThemeChoice } from "@/lib/theme";
import anime from "animejs";
import { useLang } from "@/lib/i18n";
import { copy, practices, PRACTICE_SLUGS } from "@/content/copy";
/* Rede 3D em chunk proprio: Three.js (~250KB gz) so entra na home,
   asincrono — as outras rotas e o primeiro paint nao pagam por ele. */
const Network3D = React.lazy(() => import("./HeroCanvas3D"));
import { WHATSAPP_URL, CALENDLY_URL, M_LOGO_BONE } from "@/lib/site";

/**
 * Portão de entrada — a animação que independe do usuário (referência
 * spenceltd): cortina grafite, M nasce, wordmark letra a letra, linha de
 * cobre desenha e a cortina sobe entregando a hero 3D em pleno movimento.
 * Uma vez por sessão (sessionStorage); reduced-motion pula direto.
 */
/**
 * Portão de entrada — a abertura que independe do usuário.
 * Tela cheia: o M nasce girando, o nome sobe letra a letra, o filete
 * de cobre desenha e as quatro soluções se anunciam antes de a cortina
 * subir. Uma vez por sessão; reduced-motion pula direto.
 */
export function IntroGate() {
  const ref = useRef(null);
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  /* Primeira visita de verdade: nunca escolheu tema. A escolha vive
     no portao de entrada e nao volta a aparecer (localStorage). */
  const [ask] = useState(() => (hasThemeChoice() ? false : true));
  const [paused, setPaused] = useState(false);   // painel visivel
  const [resolved, setResolved] = useState(true); // resolved ate pausar
  const [chosen, setChosen] = useState(0); // incremento reinicia a contagem
  const pendingLang = useRef(null);
  const tlRef = useRef(null);

  /* Auto-avanco: 2,5s contados do painel abrir; cada escolha recomeca. */
  useEffect(() => {
    if (!ask || !paused || resolved) return undefined;
    const t = setTimeout(() => setResolved(true), 2500);
    return () => clearTimeout(t);
  }, [ask, paused, resolved, chosen]);

  /* Resolver devolve o portao: cortina sobe, idioma pendente aplica. */
  useEffect(() => {
    if (!ask || !paused || !resolved) return;
    if (pendingLang.current && pendingLang.current !== lang) {
      const next = pendingLang.current;
      pendingLang.current = null;
      setLang(next);
    } else {
      tlRef.current?.play();
    }
  }, [ask, paused, resolved, lang, setLang]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    /* Portao em TODAS as telas (Eduardo, 17/09: "no meu eu quero o
       portao de entrada" — so nao pode estourar as bordas laterais). */
    if (mq.matches || sessionStorage.getItem("mf-intro") === "1") {
      el.remove();
      /* Sem intro nao ha seletor: assume claro e registra a escolha
         para o portao nunca travar uma segunda visita. */
      if (hasThemeChoice() === false) setTheme("light");
      return;
    }
    sessionStorage.setItem("mf-intro", "1");
    const wm = el.querySelector(".mf-intro__word");
    wm.innerHTML = wm.textContent
      .split("")
      .map((ch) => `<span class="mf-intro__ltr">${ch === " " ? "&nbsp;" : ch}</span>`)
      .join("");
    const tl = gsap.timeline({ onComplete: () => el.remove() });
    tlRef.current = tl;
    tl.fromTo(el.querySelector(".mf-intro__m"),
        { opacity: 0, scale: 0.55, rotate: -16 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "expo.out" }, 0)
      .fromTo(el.querySelectorAll(".mf-intro__ltr"),
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.75, ease: "expo.out", stagger: 0.045 }, 0.18)
      .fromTo(el.querySelector(".mf-intro__line"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.55, ease: "expo.inOut" }, 0.6)
      .fromTo(el.querySelector(".mf-intro__role"),
        { opacity: 0, letterSpacing: "0.9em" },
        { opacity: 0.8, letterSpacing: "0.5em", duration: 0.7, ease: "expo.out" }, 0.8)
      .to({}, { duration: 0.3 })
      /* Portao de escolha: primeira visita pausa a saida ate resolver
         (clique ou auto-avanco). Visitas seguintes nem sentem. */
      .call(() => {
        if (ask) {
          tl.pause();
          setResolved(false);
          setPaused(true);
        }
      })
      .to(el.querySelector(".mf-intro__m"), { y: -70, opacity: 0, duration: 0.55, ease: "power3.in" }, ">")
      .to(el, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "<0.12");
    document.documentElement.style.overflow = "hidden";
    const free = setTimeout(() => { document.documentElement.style.overflow = ""; }, 2300);
    return () => clearTimeout(free);
  }, []);

  const roles = PRACTICE_SLUGS.map((sg) => practices[lang]?.[sg]?.label).filter(Boolean).join(" · ");

  return (
    <div ref={ref} className="mf-intro" data-theme="dark" aria-hidden="true">
      <img className="mf-intro__m" src={M_LOGO_BONE} alt="" />
      <span className="mf-intro__word">MIRANDA FARIA</span>
      <span className="mf-intro__line" />
      <span className="mf-intro__role">{roles}</span>
      {ask && paused && (
        <div className="mf-intro__choice" key={chosen}>
          <div className="mf-intro__chgrp">
            <span className="mf-intro__chcap">{lang === "pt" ? "TEMA" : "THEME"}</span>
            <div className="mf-intro__chopts">
              <button type="button" className="mf-intro__chopt" data-active={theme === "light" ? "true" : undefined}
                onClick={() => { setTheme("light"); setChosen((c) => c + 1); }}>
                {lang === "pt" ? "CLARO" : "LIGHT"}
              </button>
              <button type="button" className="mf-intro__chopt" data-active={theme === "dark" ? "true" : undefined}
                onClick={() => { setTheme("dark"); setChosen((c) => c + 1); }}>
                {lang === "pt" ? "ESCURO" : "DARK"}
              </button>
            </div>
          </div>
          <div className="mf-intro__chgrp">
            <span className="mf-intro__chcap">{lang === "pt" ? "IDIOMA" : "LANGUAGE"}</span>
            <div className="mf-intro__chopts">
              <button type="button" className="mf-intro__chopt" data-active={lang === "pt" ? "true" : undefined}
                onClick={() => { pendingLang.current = "pt"; setChosen((c) => c + 1); }}>
                PT
              </button>
              <button type="button" className="mf-intro__chopt" data-active={lang === "en" ? "true" : undefined}
                onClick={() => { pendingLang.current = "en"; setChosen((c) => c + 1); }}>
                EN
              </button>
            </div>
          </div>
          <span className="mf-intro__chbar" aria-hidden="true" />
        </div>
      )}
      <style>{`
.mf-intro{
  position:fixed;inset:0;z-index:200;
  background:var(--mf-graphite, #141414);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:1.5rem;
}
.mf-intro::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 45% at 50% 48%, rgba(181,80,46,0.10), transparent 70%);
  pointer-events:none;
}
.mf-intro__m{
  width:clamp(44px,7vw,72px);
  filter:drop-shadow(0 0 18px rgba(181,80,46,0.35));
}
.mf-intro__word{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(1.5rem,4vw,2.5rem);letter-spacing:0.3em;
  text-transform:uppercase;color:var(--ink,#1A1A18);white-space:nowrap;
}
.mf-intro__ltr{display:inline-block}
.mf-intro__line{
  width:clamp(140px,26vw,380px);height:1px;
  background:var(--copper,#B5502E);transform-origin:left center;
}
.mf-intro__role{
  font-family:var(--font-mono);font-size:clamp(9px,1.3vw,11px);
  letter-spacing:0.5em;text-transform:uppercase;
  color:var(--mf-ink);opacity:0.72;white-space:nowrap;
}
.mf-intro__choice{
  position:absolute;bottom:clamp(24px,7vh,64px);left:50%;transform:translateX(-50%);
  display:flex;align-items:center;gap:clamp(18px,3vw,36px);
  animation:mf-intro-chfade 0.5s var(--ease-out-expo) both;
}
.mf-intro__chgrp{display:flex;align-items:baseline;gap:12px}
.mf-intro__chcap{
  font-family:var(--font-mono);font-size:9px;letter-spacing:0.34em;
  color:rgba(138,133,120,0.9);
}
.mf-intro__chopts{display:flex;gap:2px}
.mf-intro__chopt{
  font-family:var(--font-mono);font-size:10px;letter-spacing:0.18em;
  padding:8px 14px;border:0;background:none;cursor:pointer;
  color:var(--ink);opacity:0.55;transition:opacity var(--duration-fast);
}
.mf-intro__chopt:hover{opacity:1}
.mf-intro__chopt[data-active="true"]{opacity:1;color:var(--copper-text)}
.mf-intro__chbar{
  position:absolute;left:0;right:0;bottom:-14px;height:1px;
  background:var(--copper);transform-origin:left center;
  animation:mf-intro-chbar 2.5s linear forwards;
}
@keyframes mf-intro-chbar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes mf-intro-chfade{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}
@media(max-width:600px){
  .mf-intro__choice{flex-direction:column;gap:10px;bottom:20px}
  .mf-intro__chbar{bottom:-10px}
  .mf-intro{gap:1.05rem}
  .mf-intro__m{width:42px}
  .mf-intro__word{font-size:1.05rem;letter-spacing:0.18em}
  .mf-intro__line{width:110px}
  /* Roles no mobile: o GSAP deixa letter-spacing inline (0.5em) e a
     linha media 673px — estourava as bordas laterais (Eduardo, 17/09).
     !important vence o inline; quebra em 2 linhas centradas. */
  .mf-intro__role{
    font-size:8px;
    letter-spacing:0.28em !important;
    white-space:normal;
    max-width:300px;
    text-align:center;
    line-height:1.9;
  }
}
`}</style>
    </div>
  );
}

export default function HeroStage() {
  const { lang, path } = useLang();
  const t = copy[lang].home;
  const content = useRef(null);
  const [hintVisible, setHintVisible] = useState(false);

  // HUD de affordance: so no desktop, aparece depois de 2s parado e
  // some no primeiro movimento do mouse — quem ja mexeu nao precisa de dica
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || window.innerWidth < 860) return;
    const timer = setTimeout(() => setHintVisible(true), 2000);
    const onMove = () => { clearTimeout(timer); setHintVisible(false); };
    window.addEventListener("pointermove", onMove, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener("pointermove", onMove); };
  }, []);

  useEffect(() => {
    const el = content.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    const introOn = !!document.querySelector(".mf-intro");
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: introOn ? 1.15 : 0.25 }
    );
    gsap.set(".mf-hero__mark", { opacity: 0, scale: 0.82 });
    gsap.set(".mf-hero__ltr", { opacity: 0, y: 46 });
    gsap.set(".mf-hero__role", { opacity: 0 });
    gsap.set(".mf-hero__cta", { opacity: 0, y: 18 });
    const tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add({ targets: ".mf-hero__mark", opacity: [0, 0.92], scale: [0.82, 1], duration: 800 }, introOn ? 1650 : 650)
      .add(
        { targets: ".mf-hero__title .mf-hero__ltr", translateY: [46, 0], opacity: [0, 1], duration: 900, delay: anime.stagger(34) },
        "-=320"
      )
      .add({ targets: ".mf-hero__role", opacity: [0, 0.75], letterSpacing: ["0.62em", "0.4em"], duration: 800 }, "-=520")
      .add({ targets: ".mf-hero__cta", opacity: [0, 1], translateY: [18, 0], duration: 700 }, "-=460");
    return () => { tl.pause(); };
  }, []);

  return (
    <section className="mf-hero" data-theme="dark" aria-label={t.wordmark}>
      <React.Suspense fallback={<div className="mf-hero__net3d" />}>
        <Network3D lang={lang} path={path} />
      </React.Suspense>
      <div className="mf-hero__scrim" aria-hidden="true" />

      <div ref={content} className="mf-hero__content" style={{ opacity: 0 }}>
        <img className="mf-hero__mark" src={M_LOGO_BONE} alt="" aria-hidden="true" />
        <h1 className="mf-hero__title" aria-label={t.wordmark}>
          {t.wordmark.split("").map((ch, i) => (
            <span key={i} className="mf-hero__ltr" aria-hidden="true">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>
        <p className="mf-hero__role">{t.role}</p>
        <a
          href={lang === "en" ? CALENDLY_URL : WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mf-hero__cta"
          data-cursor="link"
        >
          {t.heroCta}
        </a>
      </div>

      <div
        className={`mf-hero__hud-hint ${hintVisible ? "is-visible" : ""}`}
        aria-hidden="true"
      >
        <span className="mf-hero__hud-dot" />
        {t.netHint}
      </div>

      <style>{`
.mf-hero{
  position:relative;min-height:100svh;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;background:var(--mf-graphite);
}
.mf-hero__net3d{position:absolute;inset:0}
.mf-hero__tip{
  position:absolute;z-index:3;pointer-events:none;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:rgba(12,12,12,0.72);
  border:1px solid rgba(26,26,24,0.18);
  padding:0.35rem 0.7rem;white-space:nowrap;
}
/* Conteudo da hero NAO bloqueia o drag da rede 3D: so o CTA e clicavel
   (o wordmark central era um dead zone de interacao — Eduardo, 17/09). */
.mf-hero__content{pointer-events:none}
.mf-hero__content a{pointer-events:auto}
.mf-hero__hint{
  position:absolute;left:50%;bottom:clamp(18px,4vh,44px);translate:-50% 0;z-index:2;
  pointer-events:none;white-space:nowrap;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-ink);opacity:0.68;
  animation:mf-hint-in .9s ease both;
}
.mf-hero__hint::after{
  content:"";display:block;width:26px;height:1px;margin:0.45rem auto 0;
  background:var(--copper,#B5502E);
  animation:mf-hint-line 2.2s ease-in-out infinite alternate;
}
@keyframes mf-hint-in{from{opacity:0;translate:-50% 6px}to{opacity:1;translate:-50% 0}}
@keyframes mf-hint-line{from{transform:translateX(-9px)}to{transform:translateX(9px)}}
@media (max-width:859px){.mf-hero__hint{display:none}}
html[data-skin="dark"] .mf-hero__scrim{
  background:linear-gradient(180deg,rgba(22,20,15,0.38) 0%,rgba(22,20,15,0.16) 45%,rgba(22,20,15,0.62) 100%);
}
.mf-hero__scrim{
  position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(245,241,234,0.38) 0%,rgba(245,241,234,0.16) 45%,rgba(245,241,234,0.62) 100%);
}
.mf-hero__content{
  position:relative;z-index:2;
  display:flex;flex-direction:column;align-items:center;text-align:center;
  padding:0 var(--gutter);
}
.mf-hero__mark{
  width:clamp(34px,4.6vw,52px);height:auto;
  margin:0 auto 1.8rem;display:block;
  mix-blend-mode:normal;filter:drop-shadow(0 0 12px rgba(26,26,24,0.10));
}
html:not([data-skin="dark"]) .mf-hero__mark{filter:brightness(0.88) saturate(0.85) drop-shadow(0 0 12px rgba(26,26,24,0.10))
  will-change:transform,opacity;
}
.mf-hero__title{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(2.8rem,9vw,6.5rem);line-height:1.04;
  letter-spacing:0.06em;text-transform:uppercase;
  color:var(--ink,#1A1A18);margin:0;
}
.mf-hero__ltr{display:inline-block;will-change:transform,opacity}
.mf-hero__role{
  /* KICKER (Eduardo 17/09: subtitulo quase nao se lia): mono maior,
     rastreio justo, opacidade cheia e filete de cobre flanqueando. */
  font-family:var(--font-mono);
  font-size:clamp(0.8rem,1.6vw,1rem);
  letter-spacing:0.28em;text-transform:uppercase;
  color:var(--mf-ink);opacity:0.92;margin:1.15rem 0 0;
  display:inline-flex;align-items:center;gap:1rem;
}
.mf-hero__role::before,
.mf-hero__role::after{
  content:"";display:block;width:clamp(1.2rem,3vw,2.4rem);height:1px;
  background:var(--mf-terracotta);
}
.mf-hero__cta{
  margin-top:3.2rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--on-accent,#F5F1EA);background:var(--mf-terracotta,#A6481F);border:1px solid var(--mf-terracotta,#A6481F);
  padding:1rem 2.4rem;text-decoration:none;
  transition:background var(--duration-fast) var(--ease-in-out),
             box-shadow var(--duration-base) var(--ease-in-out),
             transform var(--duration-base) var(--ease-out-expo);
}
.mf-hero__cta:hover{
  background:#8F3E1F;border-color:#8F3E1F;
  box-shadow:0 6px 24px rgba(166,72,31,0.28);
  transform:translateY(-2px);
}
.mf-hero__hud-hint{
  position:absolute;bottom:1.8rem;right:2rem;z-index:4;
  display:flex;align-items:center;gap:0.55rem;
  font-family:var(--font-mono);font-size:10px;
  letter-spacing:0.12em;text-transform:uppercase;
  color:var(--ink,#1A1A18);background:rgba(245,241,234,0.88);
  border:1px solid rgba(181,80,46,0.30);
  padding:0.45rem 0.85rem;border-radius:2px;
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  box-shadow:0 4px 16px rgba(26,26,24,0.08);
  pointer-events:none;
  opacity:0;transform:translateY(6px);
  transition:opacity 0.5s ease, transform 0.5s ease;
}
.mf-hero__hud-hint.is-visible{opacity:1;transform:translateY(0)}
.mf-hero__hud-dot{
  width:6px;height:6px;border-radius:50%;
  background:var(--copper,#B5502E);
  box-shadow:0 0 8px rgba(181,80,46,0.6);
}
@media (max-width:860px){.mf-hero__hud-hint{display:none}}
`}</style>
    </section>
  );
}
