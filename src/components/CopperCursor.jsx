import React, { useEffect, useRef, useState } from "react";

// Cursor editorial: ponto de 8px em cobre que segue o mouse com lerp.
// Em [data-cursor="link"] vira ANEL de cobre (Eduardo, 17/09: só ponto
// ou anel, nunca a mãozinha nativa do navegador).
// FASE 1 AWWWARDS: magnetismo — links puxados sutilmente pro cursor.
// Não renderiza em telas de toque nem com prefers-reduced-motion.
export default function CopperCursor() {
  const dotRef = useRef(null);

  const [active] = useState(() => {
    if (typeof window === "undefined") return false;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    return fine.matches && !reduced.matches;
  });

  useEffect(() => {
    if (!active) return;

    /* A mãozinha nativa do navegador SAI: quando o cursor custom está
       ativo, nada de pointer — só o ponto ou o anel de cobre. */
    document.documentElement.classList.add("mf-nocursor");
    const dot = dotRef.current;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let hovered = false;
    let raf = 0;

    const render = () => {
      x += (mx - x) * 0.18;
      y += (my - y) * 0.18;
      const size = hovered ? 40 : 8;
      dot.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      if (hovered) {
        dot.style.background = "transparent";
        dot.style.borderWidth = "1px";
      } else {
        dot.style.background = "#B5502E";
        dot.style.borderWidth = "0px";
      }
      applyMagnets();
      raf = requestAnimationFrame(render);
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target;
      hovered = !!(t && t.closest && t.closest('[data-cursor="link"]'));
    };

    /* AWWWARDS FASE 1 (19/09): MAGNETISMO — os elementos [data-cursor]
       sao puxados sutilmente na direcao do mouse (max 10px, lerp proprio).
       Usa a propriedade CSS `translate` (separada do `transform`), então
       nao briga com as animacoes do GSAP nos mesmos elementos. Elementos
       gigantes (capitulos pinados) ficam de fora pelo limite de altura.
       UNIVERSAL (19/09 v2): a, button e summary entram automaticamente —
       o site inteiro fica magnetico sem precisar de data-cursor em cada
       elemento. */
    let magnets = [];
    const refreshMagnets = () => {
      magnets = [...document.querySelectorAll("a, button, summary, [data-cursor]")].filter(
        (el) => el.isConnected
      );
    };
    refreshMagnets();
    const magTimer = window.setInterval(refreshMagnets, 1600);

    const applyMagnets = () => {
      // leituras primeiro (batch), escritas depois
      for (const el of magnets) el._mr = el.getBoundingClientRect();
      for (const el of magnets) {
        const r = el._mr;
        if (!r || r.width === 0 || r.height > 300) continue;
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        let tx = 0;
        let ty = 0;
        if (dist < 120) {
          const m = Math.min(10, (1 - dist / 120) * 14);
          const ang = Math.atan2(dy, dx);
          tx = Math.cos(ang) * m;
          ty = Math.sin(ang) * m;
        }
        if (el._tx === undefined) { el._tx = 0; el._ty = 0; }
        el._tx += (tx - el._tx) * 0.16;
        el._ty += (ty - el._ty) * 0.16;
        if (Math.abs(el._tx) < 0.05 && Math.abs(el._ty) < 0.05) {
          if (el.style.translate) el.style.translate = "";
          el._tx = 0; el._ty = 0;
        } else {
          el.style.translate = el._tx.toFixed(2) + "px " + el._ty.toFixed(2) + "px";
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(magTimer);
      window.removeEventListener("mousemove", onMove);
      for (const el of magnets) { el.style.translate = ""; }
      document.documentElement.classList.remove("mf-nocursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        boxSizing: "border-box",
        borderRadius: "50%",
        background: "#B5502E",
        border: "0px solid #B5502E",
        pointerEvents: "none",
        zIndex: 9999,
        transition: "width 200ms ease, height 200ms ease, background 200ms ease, border-width 200ms ease",
        willChange: "transform",
      }}
    >
      <style>{`.mf-nocursor, .mf-nocursor *{cursor:none!important}`}</style>
    </div>
  );
}