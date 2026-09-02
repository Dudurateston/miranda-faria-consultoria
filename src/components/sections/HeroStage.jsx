import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/**
 * HeroStage — abertura centralizada, no registro da marca.
 *
 * Composição (topo -> base), tudo centrado: o "M" se desenha sozinho
 * em linhas finas, o ponto de cobre pousa com um pulso, o wordmark e o
 * papel assumem, a frase-tese aparece linha a linha, um filete separa,
 * o corpo explica e o CTA conduz. Ao fundo, no rodapé, camadas de
 * contorno derivam devagar — paper grain / curva de nível —, o
 * movimento sutil que chama a atenção sem competir com o tipo.
 *
 * Tudo entra por uma timeline GSAP de carga (sem scroll), e os
 * contornos derivam por CSS. Respeita prefers-reduced-motion.
 */

const PAPER =
  "https://media.base44.com/images/public/6a74f6e6fbaa381e21a2415b/d3fb11d81_TexturapapelgraintileableMirandaFaria.png";

/** Gera uma onda senoidal que fecha em copo inteiro de periodos —
 *  tileable, para o marquee derivar sem emenda. */
const genWave = (periods, amp, midY, samples = 140) => {
  let d = `M 0 ${midY.toFixed(2)}`;
  for (let i = 1; i <= samples; i++) {
    const x = (i / samples) * 100;
    const y = midY + Math.sin((i / samples) * periods * Math.PI * 2) * amp;
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
};

const DUNES = [
  { midY: 6, amp: 1.5, op: 0.10, dur: 36, rev: false, copper: false },
  { midY: 9, amp: 1.9, op: 0.16, dur: 26, rev: true, copper: false },
  { midY: 13, amp: 2.3, op: 0.22, dur: 40, rev: false, copper: false },
  { midY: 17, amp: 1.8, op: 0.32, dur: 30, rev: true, copper: true },
];

export default function HeroStage() {
  const { lang, path } = useLang();
  const t = copy[lang].home;

  const root = useRef(null);
  const mLines = useRef([]);
  const dot = useRef(null);
  const ring = useRef(null);
  const brand = useRef(null);
  const headMask = useRef(null);
  const headInner = useRef(null);
  const rule = useRef(null);
  const body = useRef(null);
  const cta = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = root.current;
    if (!el) return;

    if (mq.matches) {
      // Tudo no repouso, visível.
      mLines.current.forEach((l) => gsap.set(l, { strokeDashoffset: 0 }));
      gsap.set(dot.current, { scale: 1, opacity: 1 });
      gsap.set([brand.current, body.current, cta.current, headInner.current], { opacity: 1, y: 0, yPercent: 0 });
      gsap.set(rule.current, { scaleX: 1 });
      return;
    }

    let tl = null;
    const build = () => {
      // Linhas do M prontas para desenhar.
      mLines.current.forEach((l) =>
        gsap.set(l, { strokeDasharray: 1, strokeDashoffset: 1 })
      );
      gsap.set(dot.current, { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(ring.current, { scale: 0.4, opacity: 0, transformOrigin: "center" });
      gsap.set(brand.current, { opacity: 0, y: 16 });
      gsap.set(headInner.current, { yPercent: 118 });
      gsap.set(rule.current, { scaleX: 0, transformOrigin: "center" });
      gsap.set(body.current, { opacity: 0, y: 16 });
      gsap.set(cta.current, { opacity: 0, y: 16 });

      tl = gsap.timeline({ delay: 0.15 });
      // 1 — o M se desenha
      tl.to(
        mLines.current,
        { strokeDashoffset: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        0
      );
      // 2 — o ponto de cobre pousa
      tl.to(dot.current, { scale: 1, opacity: 1, duration: 0.14, ease: "back.out(2.6)" }, 0.55);
      // 3 — um pulso irradia do ponto
      tl.to(ring.current, { scale: 4.5, opacity: 0.5, duration: 0.7, ease: "power2.out" }, 0.62);
      tl.to(ring.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.95);
      // 4 — wordmark + papel
      tl.to(brand.current, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.7);
      // 5 — a frase-tese sobe da máscara
      tl.to(headInner.current, { yPercent: 0, duration: 0.9, ease: "expo.out" }, 0.85);
      // 6 — filete separador
      tl.to(rule.current, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 1.15);
      // 7 — corpo
      tl.to(body.current, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 1.25);
      // 8 — CTA
      tl.to(cta.current, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 1.35);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  return (
    <>
      <section className="mf-hero" ref={root} data-depth="0" id="topo" aria-label={`${t.wordmark} — ${t.role}`}>
        <div className="mf-hero__paper" aria-hidden="true" />

        <div className="mf-hero__dunes" aria-hidden="true">
          {DUNES.map((d, i) => (
            <div
              key={i}
              className="mf-hero__dune"
              style={{
                animationDuration: `${d.dur}s`,
                animationDirection: d.rev ? "reverse" : "normal",
                opacity: d.op,
              }}
            >
              {[0, 1].map((copy2) => (
                <svg key={copy2} viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d={genWave(3, d.amp, d.midY)}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    style={{ stroke: d.copper ? "var(--copper)" : "var(--stone)", strokeWidth: d.copper ? 1.1 : 1 }}
                  />
                </svg>
              ))}
            </div>
          ))}
        </div>

        <div className="mf-hero__inner">
          <div className="mf-hero__mark" aria-hidden="true">
            <svg viewBox="0 0 100 110" className="mf-hero__m">
              <line ref={(n) => n && mLines.current.push(n)} x1="30" y1="14" x2="30" y2="96" pathLength="1" vectorEffect="non-scaling-stroke" />
              <line ref={(n) => n && mLines.current.push(n)} x1="70" y1="14" x2="70" y2="96" pathLength="1" vectorEffect="non-scaling-stroke" />
              <line ref={(n) => n && mLines.current.push(n)} x1="30" y1="14" x2="50" y2="88" pathLength="1" vectorEffect="non-scaling-stroke" />
              <line ref={(n) => n && mLines.current.push(n)} x1="70" y1="14" x2="50" y2="88" pathLength="1" vectorEffect="non-scaling-stroke" />
              <circle ref={ring} className="mf-hero__ring" cx="50" cy="88" r="3.5" />
              <circle ref={dot} className="mf-hero__dot" cx="50" cy="88" r="3.5" />
            </svg>
          </div>

          <div className="mf-hero__brand" ref={brand}>
            <span className="mf-hero__wordmark">{t.wordmark}</span>
            <span className="mf-hero__role">{t.role}</span>
          </div>

          <div className="mf-hero__head" ref={headMask}>
            <h1 className="mf-hero__head-inner" ref={headInner}>{t.thesis.lead}</h1>
          </div>

          <span className="mf-hero__rule" ref={rule} />

          <p className="mf-hero__body" ref={body}>{t.thesis.body}</p>

          <Link to={path("contact")} className="mf-hero__cta" ref={cta} data-cursor="link">
            {t.contactTeaser.cta}
          </Link>
        </div>

        <span className="mf-hero__hint" aria-hidden="true">{t.scrollHint}</span>
      </section>

      <style>{`
.mf-hero{
  position:relative;min-height:100vh;min-height:100svh;
  display:flex;align-items:center;justify-content:center;
  padding:clamp(5rem,12vh,8rem) var(--gutter) clamp(4rem,8vh,6rem);
  background:var(--bone);overflow:hidden;
}
.mf-hero__paper{
  position:absolute;inset:0;
  background-image:url(${PAPER});
  background-size:420px;background-repeat:repeat;
  opacity:0.5;pointer-events:none;mix-blend-mode:multiply;
}

/* Contornos que derivam no rodapé */
.mf-hero__dunes{
  position:absolute;left:0;right:0;bottom:0;height:34vh;
  pointer-events:none;overflow:hidden;
}
.mf-hero__dune{
  position:absolute;left:0;right:0;top:0;height:100%;
  display:flex;width:200%;will-change:transform;
  animation-name:mf-dune-drift;animation-timing-function:linear;animation-iteration-count:infinite;
}
.mf-hero__dune svg{width:50%;height:100%;flex-shrink:0;display:block}
@keyframes mf-dune-drift{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* Marca */
.mf-hero__inner{
  position:relative;z-index:2;text-align:center;
  display:flex;flex-direction:column;align-items:center;
  max-width:var(--max-width-page);
}
.mf-hero__mark{
  width:clamp(54px,7vw,76px);height:auto;margin-bottom:1.4rem;
  animation:mf-float 7s ease-in-out infinite;
}
.mf-hero__m{width:100%;height:auto;display:block;overflow:visible}
.mf-hero__m line{stroke:var(--ink);stroke-width:1.6;stroke-linecap:square;opacity:0.9}
.mf-hero__dot{fill:var(--copper)}
.mf-hero__ring{fill:none;stroke:var(--copper);stroke-width:1;opacity:0}
@keyframes mf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

.mf-hero__brand{display:flex;flex-direction:column;align-items:center;gap:0.5rem;margin-bottom:clamp(1.8rem,4vh,2.6rem)}
.mf-hero__wordmark{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(0.95rem,1.6vw,1.15rem);
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  color:var(--color-text-primary);
}
.mf-hero__role{
  font-family:var(--font-mono);font-weight:400;
  font-size:var(--text-label);letter-spacing:0.42em;text-indent:0.42em;
  text-transform:uppercase;color:var(--color-text-secondary);
}

.mf-hero__head{overflow:hidden;padding:0.08em 0;margin-bottom:1.5rem}
.mf-hero__head-inner{
  margin:0;
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(1.7rem,4.8vw,3.1rem);
  line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);
  max-width:18ch;margin-inline:auto;
}

.mf-hero__rule{
  width:48px;height:1px;background:var(--copper);
  display:block;margin:0 0 1.5rem;
}

.mf-hero__body{
  margin:0 0 2.4rem;
  font-family:var(--font-body);font-weight:300;
  font-size:clamp(0.95rem,1.5vw,1.05rem);
  line-height:var(--leading-body);
  color:var(--color-text-secondary);
  max-width:46ch;
}

.mf-hero__cta{
  display:inline-block;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:var(--copper);
  padding:0.95rem 2.2rem;text-decoration:none;
  border:1px solid var(--copper);
  transition:transform var(--duration-base) var(--ease-out-expo),
             background var(--duration-fast) var(--ease-in-out),
             color var(--duration-fast) var(--ease-in-out);
}
.mf-hero__cta:hover{transform:translateY(-2px);background:transparent;color:var(--copper)}

.mf-hero__hint{
  position:absolute;bottom:1.8rem;left:50%;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);z-index:2;
}

@media(prefers-reduced-motion:reduce){
  .mf-hero__dune,.mf-hero__mark{animation:none}
  .mf-hero__m line{stroke-dashoffset:0!important}
}
@media(max-width:600px){
  .mf-hero__dunes{height:26vh}
  .mf-hero__head-inner{max-width:14ch}
}
      `}</style>
    </>
  );
}