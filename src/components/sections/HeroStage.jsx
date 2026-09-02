import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import Link from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/**
 * HeroStage — abertura centralizada, com ambiente 3D e cursor.
 *
 * O fundo é o GIF 3D arquitetônico da marca (planos em profundidade),
 * que reage ao cursor em parallax — o "ambiente" que o visitante
 * atravessa. Sobre ele, grão de papel, motes de cobre à deriva, e a
 * composição central: o M real da marca revelado da esquerda para a
 * direita (como se fosse desenhado), wordmark, frase-tese, filete,
 * corpo e CTA magnético (atrai o cursor). Contornos derivam no rodapé.
 *
 * Tudo entra por uma timeline de carga; parallax, magnético e motes
 * rodam por ponteiro. Respeita prefers-reduced-motion e touch.
 */

const PAPER =
  "https://media.base44.com/images/public/6a74f6e6fbaa381e21a2415b/d3fb11d81_TexturapapelgraintileableMirandaFaria.png";
const FUND_3D =
  "https://media.base44.com/images/public/6a74f6e6fbaa381e21a2415b/b507ca297_fundo_3d_animacao_miranda_faria1.gif";
const M_MARK =
  "https://media.base44.com/images/public/6a74f6e6fbaa381e21a2415b/e2b54763d_MsimplificadopontocentralMirandaFaria3.png";

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
  const gifRef = useRef(null);
  const markParallax = useRef(null);
  const dot = useRef(null);
  const brand = useRef(null);
  const headMask = useRef(null);
  const headInner = useRef(null);
  const rule = useRef(null);
  const body = useRef(null);
  const cta = useRef(null);

  const [drawn, setDrawn] = useState(false);

  const motes = useMemo(
    () =>
      Array.from({ length: 11 }, () => ({
        left: Math.random() * 100,
        top: 10 + Math.random() * 65,
        size: 2 + Math.random() * 3,
        dur: 7 + Math.random() * 9,
        delay: Math.random() * 8,
        op: 0.12 + Math.random() * 0.18,
      })),
    []
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const el = root.current;
    if (!el) return;

    // M revelado da esquerda p/ direita.
    if (mq.matches) {
      setDrawn(true);
      gsap.set([brand.current, body.current, cta.current, headInner.current], { opacity: 1, y: 0, yPercent: 0 });
      gsap.set(rule.current, { scaleX: 1 });
      return;
    }
    setDrawn(true);

    // Timeline de carga.
    let tl = null;
    const build = () => {
      gsap.set(dot.current, { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(brand.current, { opacity: 0, y: 16 });
      gsap.set(headInner.current, { yPercent: 118 });
      gsap.set(rule.current, { scaleX: 0, transformOrigin: "center" });
      gsap.set(body.current, { opacity: 0, y: 16 });
      gsap.set(cta.current, { opacity: 0, y: 16 });

      tl = gsap.timeline({ delay: 0.25 });
      // M já revela por CSS (clip). Ponto de cobre pulsa.
      tl.to(dot.current, { scale: 1, opacity: 1, duration: 0.16, ease: "back.out(2.6)" }, 0.95);
      tl.to(brand.current, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.7);
      tl.to(headInner.current, { yPercent: 0, duration: 0.9, ease: "expo.out" }, 0.85);
      tl.to(rule.current, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 1.15);
      tl.to(body.current, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 1.25);
      tl.to(cta.current, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 1.35);
    };

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    else build();

    // Parallax do ambiente + M (apenas ponteiro fino).
    if (fine) {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf;
      const onMove = (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      const loop = () => {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        if (gifRef.current) gifRef.current.style.transform = `translate3d(${cx * -16}px, ${cy * -16}px, 0) scale(1.08)`;
        if (markParallax.current) markParallax.current.style.transform = `translate3d(${cx * 10}px, ${cy * 10}px, 0)`;
        raf = requestAnimationFrame(loop);
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
      // Magnético no CTA.
      const btn = cta.current;
      const onBtnMove = (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const radius = 140;
        if (dist < radius) {
          const f = (1 - dist / radius) * 0.4;
          btn.style.transform = `translate3d(${dx * f}px, ${dy * f}px, 0)`;
        } else {
          btn.style.transform = "translate3d(0,0,0)";
        }
      };
      const onBtnLeave = () => (btn.style.transform = "translate3d(0,0,0)");
      window.addEventListener("mousemove", onBtnMove, { passive: true });
      btn.addEventListener("mouseleave", onBtnLeave);

      return () => {
        if (tl) tl.kill();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mousemove", onBtnMove);
        btn.removeEventListener("mouseleave", onBtnLeave);
        cancelAnimationFrame(raf);
      };
    }

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  return (
    <>
      <section className="mf-hero" ref={root} data-depth="0" id="topo" aria-label={`${t.wordmark} — ${t.role}`}>
        {/* Ambiente 3D (GIF) — reage ao cursor */}
        <div className="mf-hero__env" aria-hidden="true">
          <img ref={gifRef} src={FUND_3D} alt="" className="mf-hero__gif" />
          <div className="mf-hero__scrim" />
        </div>
        <div className="mf-hero__paper" aria-hidden="true" />

        {/* Motes de cobre à deriva */}
        <div className="mf-hero__motes" aria-hidden="true">
          {motes.map((m, i) => (
            <span
              key={i}
              className="mf-hero__mote"
              style={{
                left: `${m.left}%`,
                top: `${m.top}%`,
                width: m.size,
                height: m.size,
                opacity: m.op,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Contornos no rodapé */}
        <div className="mf-hero__dunes" aria-hidden="true">
          {DUNES.map((d, i) => (
            <div
              key={i}
              className="mf-hero__dune"
              style={{ animationDuration: `${d.dur}s`, animationDirection: d.rev ? "reverse" : "normal", opacity: d.op }}
            >
              {[0, 1].map((c) => (
                <svg key={c} viewBox="0 0 100 20" preserveAspectRatio="none">
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
          <div className="mf-hero__mark" ref={markParallax}>
            <div className="mf-hero__mark-float">
              <div
                className="mf-hero__mark-clip"
                style={{ clipPath: drawn ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
              >
                <img src={M_MARK} alt="" className="mf-hero__mark-img" />
                <span ref={dot} className="mf-hero__pulse" />
              </div>
            </div>
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
.mf-hero__env{position:absolute;inset:-6%;pointer-events:none;z-index:0}
.mf-hero__gif{width:100%;height:100%;object-fit:cover;opacity:0.42;will-change:transform}
.mf-hero__scrim{position:absolute;inset:0;background:
  radial-gradient(120% 80% at 50% 45%, rgba(245,241,234,0.78) 0%, rgba(245,241,234,0.5) 45%, rgba(245,241,234,0.3) 100%)}
.mf-hero__paper{
  position:absolute;inset:0;z-index:1;
  background-image:url(${PAPER});
  background-size:420px;background-repeat:repeat;
  opacity:0.45;pointer-events:none;mix-blend-mode:multiply;
}

/* Motes */
.mf-hero__motes{position:absolute;inset:0;z-index:1;pointer-events:none}
.mf-hero__mote{
  position:absolute;border-radius:50%;background:var(--copper);
  animation-name:mf-mote;animation-timing-function:ease-in-out;animation-iteration-count:infinite;
}
@keyframes mf-mote{
  0%{transform:translateY(0);opacity:0}
  20%{opacity:var(--op,0.2)}
  80%{opacity:var(--op,0.2)}
  100%{transform:translateY(-26px);opacity:0}
}

/* Contornos */
.mf-hero__dunes{position:absolute;left:0;right:0;bottom:0;height:34vh;pointer-events:none;overflow:hidden;z-index:1}
.mf-hero__dune{position:absolute;left:0;right:0;top:0;height:100%;display:flex;width:200%;will-change:transform;animation-name:mf-dune-drift;animation-timing-function:linear;animation-iteration-count:infinite}
.mf-hero__dune svg{width:50%;height:100%;flex-shrink:0;display:block}
@keyframes mf-dune-drift{from{transform:translateX(0)}to{transform:translateX(-50%)}}

.mf-hero__inner{position:relative;z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center;max-width:var(--max-width-page)}

.mf-hero__mark{width:clamp(56px,7vw,80px);margin-bottom:1.4rem;will-change:transform}
.mf-hero__mark-float{animation:mf-float 7s ease-in-out infinite}
.mf-hero__mark-clip{position:relative;transition:clip-path 1.1s cubic-bezier(.77,0,.18,1)}
.mf-hero__mark-img{width:100%;height:auto;display:block;mix-blend-mode:multiply}
.mf-hero__pulse{
  position:absolute;left:50%;bottom:14%;width:7px;height:7px;margin-left:-3.5px;
  border-radius:50%;background:var(--copper);box-shadow:0 0 0 0 rgba(181,80,46,0.5);
  animation:mf-pulse 2.4s ease-out infinite;
}
@keyframes mf-pulse{
  0%{box-shadow:0 0 0 0 rgba(181,80,46,0.45)}
  70%{box-shadow:0 0 0 14px rgba(181,80,46,0)}
  100%{box-shadow:0 0 0 0 rgba(181,80,46,0)}
}
@keyframes mf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

.mf-hero__brand{display:flex;flex-direction:column;align-items:center;gap:0.5rem;margin-bottom:clamp(1.8rem,4vh,2.6rem)}
.mf-hero__wordmark{font-family:var(--font-display);font-weight:400;font-size:clamp(0.95rem,1.6vw,1.15rem);letter-spacing:var(--tracking-wordmark);text-transform:uppercase;color:var(--color-text-primary)}
.mf-hero__role{font-family:var(--font-mono);font-weight:400;font-size:var(--text-label);letter-spacing:0.42em;text-indent:0.42em;text-transform:uppercase;color:var(--color-text-secondary)}

.mf-hero__head{overflow:hidden;padding:0.08em 0;margin-bottom:1.5rem}
.mf-hero__head-inner{margin:0;font-family:var(--font-display);font-weight:400;font-size:clamp(1.7rem,4.8vw,3.1rem);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);max-width:18ch;margin-inline:auto}

.mf-hero__rule{width:48px;height:1px;background:var(--copper);display:block;margin:0 0 1.5rem}

.mf-hero__body{margin:0 0 2.4rem;font-family:var(--font-body);font-weight:300;font-size:clamp(0.95rem,1.5vw,1.05rem);line-height:var(--leading-body);color:var(--color-text-secondary);max-width:46ch}

.mf-hero__cta{
  display:inline-block;font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:var(--copper);
  padding:0.95rem 2.2rem;text-decoration:none;border:1px solid var(--copper);
  will-change:transform;
  transition:background var(--duration-fast) var(--ease-in-out),color var(--duration-fast) var(--ease-in-out);
}
.mf-hero__cta:hover{background:transparent;color:var(--copper)}

.mf-hero__hint{position:absolute;bottom:1.8rem;left:50%;transform:translateX(-50%);font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--color-text-ghost);z-index:2}

@media(prefers-reduced-motion:reduce){
  .mf-hero__dune,.mf-hero__mark-float,.mf-hero__mote,.mf-hero__pulse{animation:none}
  .mf-hero__mark-clip{clip-path:inset(0 0 0 0)!important;transition:none}
}
@media(max-width:600px){
  .mf-hero__gif{opacity:0.3}
  .mf-hero__dunes{height:26vh}
  .mf-hero__head-inner{max-width:14ch}
}
      `}</style>
    </>
  );
}