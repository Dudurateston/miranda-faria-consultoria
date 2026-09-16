import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { M_LOGO } from "@/lib/site";

/**
 * Cortina de rota — transição de página no padrão spenceltd.
 *
 * Clique em link interno: cortina grafite sobe cobrindo a tela (com o M
 * e um filete de cobre na borda), a rota troca por baixo, e a cortina
 * sai por baixo revelando a página nova. Navegação por back/forward
 * ganha só a revelação. Reduced-motion: navegação seca, sem cortina.
 */
export default function TransitionCurtain() {
  const loc = useLocation();
  const navigate = useNavigate();
  const curtain = useRef(null);
  const busy = useRef(false);
  const pending = useRef(null); // href aguardando a cortina fechar
  const [withM, setWithM] = useState(false);

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
      pending.current = href;
      document.documentElement.style.overflow = "hidden";
      setWithM(true);
      gsap.timeline({
        onComplete: () => {
          navigate(pending.current);
          pending.current = null;
        },
      })
        .set(el, { display: "block", transformOrigin: "top center", scaleY: 0 })
        .to(el, { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 0)
        .fromTo(el.querySelector(".mf-curtain__m"),
          { opacity: 0, scale: 0.8 },
          { opacity: 0.92, scale: 1, duration: 0.3, ease: "power2.out" }, 0.16);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  // rota trocou: revela a nova página por baixo da cortina
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = curtain.current;
    if (mq.matches) { el.style.display = "none"; busy.current = false; return; }
    if (getComputedStyle(el).display === "none") return;
    busy.current = true;
    const t = gsap.timeline({
      onComplete: () => {
        el.style.display = "none";
        document.documentElement.style.overflow = "";
        busy.current = false;
      },
    });
    t.to(el.querySelector(".mf-curtain__m"), { opacity: 0, duration: 0.22, ease: "power2.in" }, 0)
      .set(el, { transformOrigin: "bottom center" }, 0.05)
      .to(el, { scaleY: 0, duration: 0.55, ease: "expo.inOut" }, 0.05);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  return (
    <div ref={curtain} className="mf-curtain" style={{ display: "none" }} aria-hidden="true">
      <img className="mf-curtain__m" src={M_LOGO} alt="" style={{ opacity: withM ? 0.92 : 0 }} />
      <style>{`
.mf-curtain{
  position:fixed;inset:0;z-index:150;
  background:var(--mf-graphite, #141414);
  display:flex;align-items:center;justify-content:center;
  pointer-events:all;transform:scaleY(0);
}
.mf-curtain::after{
  content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;
  background:var(--copper, #B5502E);
}
.mf-curtain__m{
  width:clamp(30px,4vw,48px);opacity:0.92;
  will-change:transform,opacity;
}
`}</style>
    </div>
  );
}
