import React, { useEffect, useRef, useState } from "react";

// Cursor editorial: ponto de 8px em cobre que segue o mouse com lerp.
// Em [data-cursor="link"] vira ANEL de cobre (Eduardo, 17/09: só ponto
// ou anel, nunca a mãozinha nativa do navegador).
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
      raf = requestAnimationFrame(render);
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target;
      hovered = !!(t && t.closest && t.closest('[data-cursor="link"]'));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
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