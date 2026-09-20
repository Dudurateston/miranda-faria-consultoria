import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { getPractice, PRACTICE_SLUGS } from "@/content/copy";

const MfTicker = memo(function MfTicker({ lang = "pt" }) {
  const items = PRACTICE_SLUGS
    .map((sg) => getPractice(lang, sg)?.label ?? "")
    .filter(Boolean)
    .map((x) => x.toUpperCase());
  const seq = [];
  for (let i = 0; i < items.length; i++) {
    seq.push(items[i], "M");
  }
  /* AWWWARDS FASE 1 (19/09): o ticker REAGE a velocidade do scroll —
     rolar rapido acelera o marquee (o site 'responde' ao visitante).
     reduced-motion: mantem a versao estatica do CSS. */
  const trackRef = useRef(null);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    el.classList.add("mf-ticker__track--js");
    const tween = gsap.to(el, { xPercent: -16.6667, ease: "none", duration: 26, repeat: -1 });
    let last = window.scrollY;
    let lastT = performance.now();
    let ts = 1;
    let raf;
    const tick = (now) => {
      const y = window.scrollY;
      const dt = Math.max(16, now - lastT);
      const v = Math.abs(y - last) / dt;
      last = y; lastT = now;
      const target = Math.min(3.4, 1 + v * 2.2);
      ts += (target - ts) * 0.12;
      tween.timeScale(ts);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const box = el.parentElement;
    const stop = () => tween.timeScale(0.001);
    const go = () => { ts = 1; };
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", go);
    return () => {
      cancelAnimationFrame(raf);
      tween.kill();
      box.removeEventListener("mouseenter", stop);
      box.removeEventListener("mouseleave", go);
    };
  }, []);
  const track = seq.map((x, i) =>
    x === "M" ? (
      <span key={i} className="mf-ticker__m" aria-hidden="true">M</span>
    ) : (
      <span key={i} className="mf-ticker__it">{x}</span>
    )
  );
  return (
    <div className="mf-ticker" aria-hidden="true">
      <div className="mf-ticker__track" ref={trackRef}>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <div className="mf-ticker__seq" key={n}>{track}</div>
        ))}
      </div>
      <style>{`
        .mf-ticker{
          overflow:hidden;border-top:1px solid var(--mf-rule);border-bottom:1px solid var(--mf-rule);
          padding:0.85rem 0;white-space:nowrap;user-select:none;
        }
        .mf-ticker__track{display:flex;width:max-content;will-change:transform;animation:mf-ticker 26s linear infinite}
.mf-ticker__track--js{animation:none}
        .mf-ticker__seq{display:flex;align-items:center;gap:2.6rem;padding-right:2.6rem}
        .mf-ticker__it{
          font-family:var(--font-mono);font-size:var(--text-label);
          letter-spacing:var(--tracking-label);color:var(--ink,#1A1A18);
        }
        .mf-ticker__m{
          font-family:var(--font-display);font-size:1.05rem;line-height:1;
          color:var(--mf-copper,#B5502E);
        }
        @keyframes mf-ticker{to{transform:translateX(-16.6667%)}}
        .mf-ticker:hover .mf-ticker__track{animation-play-state:paused}
        @media (prefers-reduced-motion: reduce){.mf-ticker__track{animation:none}
          .mf-ticker__seq ~ .mf-ticker__seq{display:none}}
      `}</style>
    </div>
  );
});
export default MfTicker;
