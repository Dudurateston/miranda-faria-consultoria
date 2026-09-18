import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { M_LOGO_CURTAIN } from "@/lib/site";

/**
 * Cortina de rota — o PONTO que abre e fecha (Eduardo, 17/09).
 *
 * Clique em link interno: um ponto de cobre nasce no centro, ABRE até
 * cobrir a tela; o M prata oficial assenta por cima; a rota troca por
 * baixo; o ponto FECHA encolhendo de volta e revela a página nova.
 * Back/forward não é interceptável: ganha só a revelação.
 * Reduced-motion: navegação seca, sem cortina.
 */
const VARIANTS = ["copper"]; // sempre o ponto de cobre

export default function TransitionCurtain() {
  const loc = useLocation();
  const navigate = useNavigate();
  const curtain = useRef(null);
  const busy = useRef(false);
  const navN = useRef(0);
  const [mOn, setMOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = curtain.current;

    const isInternal = (a) =>
      a && !a.target && !a.hasAttribute("download") &&
      a.getAttribute("href") && a.getAttribute("href").startsWith("/") &&
      !a.getAttribute("href").startsWith("//");

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a");
      if (!isInternal(a)) return;
      const href = a.getAttribute("href");
      if (href === loc.pathname) return;
      if (busy.current) { e.preventDefault(); return; }
      if (mq.matches) return; // deixa o router agir sozinho
      e.preventDefault();
      busy.current = true;
      const v = VARIANTS[navN.current++ % VARIANTS.length];
      el.dataset.v = v;
      setMOn(true);
      document.documentElement.style.overflow = "hidden";
      const circle = el.querySelector(".mf-curtain__circle");
      const m = el.querySelector(".mf-curtain__m");

      /* O ponto ABRE: do tamanho de um ponto até cobrir a tela. */
      const cover = gsap.timeline({
        onComplete: () => navigate(href),
      });
      cover.set(el, { display: "block" })
        .set(circle, { scale: 0 })
        .to(circle, { scale: 1, duration: 0.55, ease: "power3.inOut" }, 0)
        .fromTo(m, { opacity: 0, scale: 0.86 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0.28);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  // rota trocou: o ponto FECHA e revela a página nova por baixo
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = curtain.current;
    if (mq.matches) { el.style.display = "none"; busy.current = false; return; }
    if (getComputedStyle(el).display === "none") return;
    busy.current = true;
    const circle = el.querySelector(".mf-curtain__circle");
    const m = el.querySelector(".mf-curtain__m");
    const t = gsap.timeline({
      onComplete: () => {
        el.style.display = "none";
        document.documentElement.style.overflow = "";
        busy.current = false;
      },
    });
    /* O M segura 150ms em opacity 1 antes de desvanecer — nunca
       translúcido no meio da coreografia (regra da casa). */
    t.set(m, { opacity: 1 }, 0)
      .to(m, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.15)
      .to(circle, { scale: 0, duration: 0.6, ease: "expo.inOut" }, 0.04);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  return (
    <div ref={curtain} className="mf-curtain" data-theme="dark" data-v="copper" style={{ display: "none" }} aria-hidden="true">
      <div className="mf-curtain__circle" />
      <img className="mf-curtain__m" src={M_LOGO_CURTAIN} alt="" aria-hidden="true" style={{ opacity: mOn ? 1 : 0 }} />
      <style>{`
.mf-curtain{
  position:fixed;inset:0;z-index:150;
  background:transparent;
  display:flex;align-items:center;justify-content:center;
  pointer-events:all;
}
/* O ponto que abre/fecha: círculo de cobre centrado, grande o
   bastante para cobrir qualquer viewport quando scale = 1. */
.mf-curtain__circle{
  position:absolute;left:50%;top:50%;
  width:200vmax;height:200vmax;
  translate:-50% -50%;
  border-radius:50%;
  background:var(--copper, #B5502E);
  transform:scale(0);
  will-change:transform;
}
.mf-curtain__m{
  width:clamp(96px,12vw,176px);opacity:1;position:absolute;z-index:1;
  left:50%;top:50%;translate:-50% -50%;
  /* sem drop-shadow: sombra escura sobre o cobre chapado virava mancha */
  will-change:transform,opacity;
}
`}</style>
    </div>
  );
}
