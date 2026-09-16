import React, { useEffect, useRef, useState } from "react";
import { LOGO_ANIM_GIF } from "@/lib/site";

/**
 * Easter egg da marca — três cliques rápidos no M abrem a animação
 * do logo em tela cheia (a mesma do rodapé, agora grande).
 *
 * Onde funciona: M da hero, M do rodapé, M do menu mobile.
 * O M do nav fica de fora de propósito: lá, clique é "ir pra Home".
 */
export default function LogoEasterEgg() {
  const [open, setOpen] = useState(false);
  const clicks = useRef([]);

  useEffect(() => {
    const SEL = 'img.mf-hero__mark, img.mf-mnav__wm'; // rodapé tem egg próprio
    const onClick = (e) => {
      const img = e.target.closest && e.target.closest(SEL);
      if (!img) return;
      const now = performance.now();
      clicks.current = clicks.current.filter((t) => now - t < 1300);
      clicks.current.push(now);
      if (clicks.current.length >= 3) {
        clicks.current = [];
        setOpen(true);
      }
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="mf-egg"
      role="dialog"
      aria-label="Miranda Faria"
      onClick={() => setOpen(false)}
    >
      <img className="mf-egg__anim" src={LOGO_ANIM_GIF} alt="Miranda Faria — assinatura animada" />
      <span className="mf-egg__hint">clique para fechar · esc</span>
      <style>{`
.mf-egg{
  position:fixed;inset:0;z-index:220;
  background:rgba(20,20,20,0.96);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:2rem;cursor:pointer;
  animation:mf-egg-in 0.35s var(--ease-out-expo, ease-out) both;
}
@keyframes mf-egg-in{from{opacity:0}to{opacity:1}}
.mf-egg__anim{
  width:min(56vmin,420px);height:auto;
  filter:drop-shadow(0 0 40px rgba(181,80,46,0.25));
}
.mf-egg__hint{
  font-family:var(--font-mono);font-size:10px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:rgba(245,241,234,0.4);
}
`}</style>
    </div>
  );
}
