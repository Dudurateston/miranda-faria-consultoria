import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { M_LOGO_CURTAIN } from "@/lib/site";

/**
 * Cortina de rota — transições variadas no padrão spenceltd.
 *
 * Três variações que se alternam em sequência (para nunca enjoar e
 * ainda assim parecerem um sistema, não um sortear):
 *   1. COBRE — wipe sólido de cobre com o M em osso.
 *   2. CORTINA — grafite com filete de cobre (a original).
 *   3. COLUNAS — seis colunas grafite que sobem escalonadas.
 *
 * Clique em link interno: a variante cobre a tela, a rota troca por
 * baixo, e a variante sai revelando a página nova. Back/forward não é
 * interceptável: ganha só a revelação se a cortina estiver ativa.
 * Reduced-motion: navegação seca, sem cortina.
 */
const VARIANTS = ["copper"]; // Eduardo, 17/09: sempre a de cobre

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
      const cols = [...el.querySelectorAll(".mf-curtain__col")];
      const m = el.querySelector(".mf-curtain__m");

      const cover = gsap.timeline({
        onComplete: () => navigate(href),
      });
      cover.set(el, { display: "block" });
      if (v === "copper") {
        cover.fromTo(el, { transformOrigin: "top center", scaleY: 0 },
          { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 0)
          .fromTo(m, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" }, 0.15)
          .fromTo(el.querySelector(".mf-curtain__dot"), { opacity: 0, scale: 0.4, y: 6 },
            { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: "back.out(2.2)" }, 0.38);
      } else if (v === "curtain") {
        cover.fromTo(el, { transformOrigin: "top center", scaleY: 0 },
          { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 0)
          .fromTo(m, { opacity: 0, scale: 0.8 }, { opacity: 0.92, scale: 1, duration: 0.3, ease: "power2.out" }, 0.16);
      } else {
        cover.fromTo(cols, { transformOrigin: "top center", scaleY: 0 },
          { scaleY: 1, duration: 0.42, ease: "power3.inOut", stagger: 0.05 }, 0)
          .fromTo(m, { opacity: 0, scale: 0.8 }, { opacity: 0.92, scale: 1, duration: 0.28, ease: "power2.out" }, 0.22);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  // rota trocou: revela a nova página por baixo da variante
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = curtain.current;
    if (mq.matches) { el.style.display = "none"; busy.current = false; return; }
    if (getComputedStyle(el).display === "none") return;
    busy.current = true;
    const v = el.dataset.v || "curtain";
    const cols = [...el.querySelectorAll(".mf-curtain__col")];
    const m = el.querySelector(".mf-curtain__m");
    const t = gsap.timeline({
      onComplete: () => {
        el.style.display = "none";
        document.documentElement.style.overflow = "";
        busy.current = false;
      },
    });
    /* Transparencia do M (Eduardo, 17/09): ele agora chega a opacity 1
       no cover e SEGURA 150ms na revelacao antes de desvanecer — antes o
       fade-out disparava com o fade-in inacabado e o M vivia translucido. */
    const dot = el.querySelector(".mf-curtain__dot");
    t.set(m, { opacity: 1 }, 0)
      .set(dot, { opacity: 1 }, 0)
      .to([m, dot], { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.15);
    if (v === "copper") {
      t.set(el, { transformOrigin: "bottom center" }, 0.04)
        .to(el, { scaleY: 0, duration: 0.55, ease: "expo.inOut" }, 0.04);
    } else if (v === "curtain") {
      t.set(el, { transformOrigin: "bottom center" }, 0.05)
        .to(el, { scaleY: 0, duration: 0.55, ease: "expo.inOut" }, 0.05);
    } else {
      t.set(cols, { transformOrigin: "bottom center" }, 0.05)
        .to(cols, { scaleY: 0, duration: 0.5, ease: "expo.inOut", stagger: 0.04 }, 0.05);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  return (
    <div ref={curtain} className="mf-curtain" data-theme="dark" data-v="curtain" style={{ display: "none" }} aria-hidden="true">
      <div className="mf-curtain__cols">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="mf-curtain__col" />
        ))}
      </div>
      <div className="mf-curtain__mark" aria-hidden="true">
        <img className="mf-curtain__m" src={M_LOGO_CURTAIN} alt="" style={{ opacity: mOn ? 1 : 0 }} />
        <span className="mf-curtain__dot" />
      </div>
      <style>{`
.mf-curtain{
  position:fixed;inset:0;z-index:150;
  background:var(--mf-graphite, #141414);
  display:flex;align-items:center;justify-content:center;
  pointer-events:all;transform:scaleY(0);
}
.mf-curtain[data-v="copper"]{background:var(--copper, #B5502E)}
.mf-curtain[data-v="copper"]::after{
  content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;
  background:var(--bone, #F5F1EA);
}
.mf-curtain[data-v="curtain"]::after{
  content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;
  background:var(--copper, #B5502E);
}
.mf-curtain__cols{display:none;position:absolute;inset:0;pointer-events:none}
.mf-curtain[data-v="cols"]{background:transparent}
.mf-curtain[data-v="cols"] .mf-curtain__cols{display:flex}
.mf-curtain__col{
  flex:1;background:var(--mf-graphite, #141414);
  border-bottom:1px solid rgba(181,80,46,0.55);
  transform:scaleY(0);
}
.mf-curtain__mark{
  position:absolute;z-index:1;left:50%;top:50%;translate:-50% -50%;
  display:flex;align-items:flex-end;gap:0.09em;
}
.mf-curtain__m{
  width:clamp(96px,12vw,176px);opacity:1;
  will-change:transform,opacity;
}
/* Ponto final do M. na transicao — osso sobre cobre (Eduardo, 17/09). */
.mf-curtain__dot{
  display:block;width:clamp(15px,1.9vw,27px);height:clamp(15px,1.9vw,27px);
  border-radius:50%;background:var(--bone, #F5F1EA);opacity:0;
  margin-bottom:0.06em;will-change:transform,opacity;
}
.mf-curtain[data-v="copper"] .mf-curtain__m{filter:drop-shadow(0 0 12px rgba(20,20,20,0.4))}
`}</style>
    </div>
  );
}
