import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroStage — abertura editorial de alto impacto.
 *
 * Abre com a tese (não o logo): uma frase gigante em Playfair sobre o
 * papel texturizado. Conforme o visitante rola, a prancha de construção
 * se desenha (linhas + arco de compasso), o ponto de cobre pousa como
 * pontuação e a frase cede lugar ao lockup profissional da marca — o
 * "M" sólido ao lado do wordmark localizado. Tudo dirigido pelo scroll
 * via GSAP ScrollTrigger pin + scrub. Respeita prefers-reduced-motion.
 */

const PAPER =
  "https://media.base44.com/images/public/6a74f6e6fbaa381e21a2415b/d3fb11d81_TexturapapelgraintileableMirandaFaria.png";
const M_MARK =
  "https://media.base44.com/images/public/6a74f6e6fbaa381e21a2415b/e2b54763d_MsimplificadopontocentralMirandaFaria3.png";

export default function HeroStage() {
  const { lang } = useLang();
  const t = copy[lang].home;

  const root = useRef(null);
  const stage = useRef(null);
  const gridLines = useRef([]);
  const arc = useRef(null);
  const dot = useRef(null);
  const stmtMask = useRef(null);
  const stmtInner = useRef(null);
  const lockup = useRef(null);
  const hint = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = root.current;
    if (!el) return;

    if (mq.matches) {
      gsap.set(stmtInner.current, { y: 0 });
      gsap.set(gridLines.current, { strokeDashoffset: 0 });
      gsap.set(arc.current, { strokeDashoffset: 0 });
      gsap.set(dot.current, { scale: 1, opacity: 1 });
      gsap.set(lockup.current, { opacity: 1, y: 0 });
      gsap.set(hint.current, { opacity: 0.7 });
      el.style.height = "auto";
      return;
    }

    let tl = null;
    let intro = null;

    const build = () => {
      // Intro (carga): a frase sobe de dentro da máscara.
      gsap.set(stmtInner.current, { yPercent: 115 });
      intro = gsap.to(stmtInner.current, {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.2,
      });
      gsap.set(hint.current, { opacity: 0 });
      gsap.to(hint.current, { opacity: 0.7, duration: 0.6, delay: 1.3 });

      // Prancha pronta para ser desenhada.
      gridLines.current.forEach((l) =>
        gsap.set(l, { strokeDasharray: 1, strokeDashoffset: 1 })
      );
      gsap.set(arc.current, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(dot.current, { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(lockup.current, { opacity: 0, y: 40 });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%",
          pin: stage.current,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // 1 — a prancha se desenha (a frase ainda descansa, legível)
      tl.to(
        gridLines.current,
        { strokeDashoffset: 0, duration: 0.30, ease: "power2.out", stagger: 0.02 },
        0
      );
      tl.to(arc.current, { strokeDashoffset: 0, duration: 0.34, ease: "power2.out" }, 0.05);

      // 2 — o ponto de cobre pousa como pontuação
      tl.to(
        dot.current,
        { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2.6)" },
        0.26
      );

      // 3 — a frase cede lugar (depois de descansar)
      tl.to(
        [stmtMask.current, stmtInner.current],
        { opacity: 0, scale: 0.88, y: -70, duration: 0.24, ease: "power2.in" },
        0.52
      );

      // 4 — o lockup profissional resolve (M + wordmark)
      tl.to(
        lockup.current,
        { opacity: 1, y: 0, duration: 0.28, ease: "expo.out" },
        0.60
      );

      // 5 — segura e entrega para o conteúdo
      tl.to(hint.current, { opacity: 0, duration: 0.05 }, 0);
      tl.to({}, { duration: 0.18 });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      if (tl) {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      }
      if (intro) intro.kill();
    };
  }, []);

  return (
    <>
      <section className="mf-hs" ref={root} data-depth="0" id="topo" aria-label={`${t.wordmark} — ${t.role}`}>
        <div className="mf-hs__stage" ref={stage}>
          <div className="mf-hs__paper" aria-hidden="true" />

          <svg
            className="mf-hs__grid"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line ref={(n) => n && gridLines.current.push(n)} x1="14" y1="0" x2="14" y2="100" pathLength="1" />
            <line ref={(n) => n && gridLines.current.push(n)} x1="30" y1="0" x2="30" y2="100" pathLength="1" />
            <line ref={(n) => n && gridLines.current.push(n)} x1="70" y1="0" x2="70" y2="100" pathLength="1" />
            <line ref={(n) => n && gridLines.current.push(n)} x1="86" y1="0" x2="86" y2="100" pathLength="1" />
            <line ref={(n) => n && gridLines.current.push(n)} className="mf-hs__axis" x1="50" y1="0" x2="50" y2="100" pathLength="1" />
            <line ref={(n) => n && gridLines.current.push(n)} x1="0" y1="18" x2="100" y2="18" pathLength="1" />
            <line ref={(n) => n && gridLines.current.push(n)} x1="0" y1="50" x2="100" y2="50" pathLength="1" />
            <line ref={(n) => n && gridLines.current.push(n)} x1="0" y1="82" x2="100" y2="82" pathLength="1" />
            <line ref={(n) => n && gridLines.current.push(n)} x1="14" y1="82" x2="86" y2="18" pathLength="1" />
            <path
              ref={arc}
              d="M 14 30 A 44 44 0 0 1 86 30"
              pathLength="1"
              fill="none"
            />
          </svg>

          <span className="mf-hs__dot" ref={dot} aria-hidden="true" />

          <div className="mf-hs__center">
            <div className="mf-hs__stmt" ref={stmtMask}>
              <span className="mf-hs__stmt-inner" ref={stmtInner}>
                {t.thesis.lead}
              </span>
            </div>

            <div className="mf-hs__lockup" ref={lockup}>
              <img className="mf-hs__mark-img" src={M_MARK} alt="" />
              <span className="mf-hs__sep" aria-hidden="true" />
              <div className="mf-hs__mark-text">
                <h1 className="mf-hs__mark">{t.wordmark}</h1>
                <p className="mf-hs__role">{t.role}</p>
              </div>
            </div>
          </div>

          <span className="mf-hs__hint" ref={hint} aria-hidden="true">
            {t.scrollHint}
          </span>
        </div>
      </section>

      <style>{`
.mf-hs{position:relative;height:300vh;background:transparent}
.mf-hs__stage{
  position:sticky;top:0;height:100vh;height:100svh;
  overflow:hidden;
  background:var(--bone);
  display:grid;place-items:center;
}
.mf-hs__paper{
  position:absolute;inset:0;
  background-image:url(${PAPER});
  background-size:420px;background-repeat:repeat;
  opacity:0.5;pointer-events:none;mix-blend-mode:multiply;
}
.mf-hs__grid{
  position:absolute;inset:0;width:100%;height:100%;
  pointer-events:none;opacity:0.7;
}
.mf-hs__grid line{
  stroke:var(--stone);stroke-width:0.14;opacity:0.4;
}
.mf-hs__grid .mf-hs__axis{
  stroke:var(--copper);stroke-width:0.2;opacity:0.65;
}
.mf-hs__grid path{
  stroke:var(--stone);stroke-width:0.2;opacity:0.4;
}

.mf-hs__dot{
  position:absolute;left:14%;top:18%;
  width:13px;height:13px;margin:-6.5px 0 0 -6.5px;
  border-radius:50%;background:var(--copper);
  box-shadow:0 0 0 3px rgba(181,80,46,0.14);
  will-change:transform,opacity;z-index:3;
}

.mf-hs__center{position:relative;z-index:2;text-align:center;padding:0 var(--gutter);width:100%;max-width:var(--max-width-page)}

.mf-hs__stmt{
  position:relative;
  overflow:hidden;
  padding:0.12em 0;
}
.mf-hs__stmt-inner{
  display:block;
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-hero);
  line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);
  will-change:transform;
}

.mf-hs__lockup{
  position:absolute;left:50%;top:50%;
  transform:translate(-50%,-50%);
  display:flex;align-items:center;gap:clamp(1rem,2.4vw,2rem);
  justify-content:center;
  white-space:nowrap;z-index:2;will-change:transform,opacity;
}
.mf-hs__mark-img{
  height:clamp(52px,7vw,76px);width:auto;
  mix-blend-mode:multiply;
}
.mf-hs__sep{
  width:1px;height:clamp(40px,5vw,62px);
  background:var(--color-divider);flex-shrink:0;
}
.mf-hs__mark-text{text-align:left}
.mf-hs__mark{
  font-family:var(--font-display);font-weight:400;margin:0;
  font-size:clamp(1.3rem,4vw,2.6rem);
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  line-height:1;color:var(--color-text-primary);
}
.mf-hs__role{
  font-family:var(--font-mono);font-weight:400;
  font-size:var(--text-label);letter-spacing:0.42em;text-indent:0.42em;
  text-transform:uppercase;color:var(--color-text-secondary);
  margin:0.9rem 0 0;
}

.mf-hs__hint{
  position:absolute;bottom:2.4rem;left:50%;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);z-index:3;
}

@media(prefers-reduced-motion:reduce){
  .mf-hs{height:auto}
  .mf-hs__stage{position:relative;height:auto;min-height:100vh;min-height:100svh}
  .mf-hs__stmt-inner{transform:none}
  .mf-hs__grid line,.mf-hs__grid path{stroke-dashoffset:0!important}
}
@media(max-width:600px){
  .mf-hs__dot{left:14%;top:22%}
  .mf-hs__lockup{flex-direction:column;gap:1.1rem;white-space:normal}
  .mf-hs__sep{width:clamp(40px,14vw,80px);height:1px}
  .mf-hs__mark-text{text-align:center}
}
      `}</style>
    </>
  );
}