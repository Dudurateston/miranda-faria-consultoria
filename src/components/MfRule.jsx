import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * MfRule — divisor de secao, motivo de estrato de terreno.
 *
 * Substitui a linha lisa por faixas horizontais finas que evocam
 * camadas de solo/rocha — o mesmo vocabulario da marca (profundidade,
 * estruturas reveladas), validado como reconhecivel e de conotacao
 * positiva (fundacao/solidez), sem risco de leitura ambigua.
 *
 * Anima como a regua original: se desenha da esquerda para a direita
 * ao entrar na viewport, scaleX 0 -> 1, expo.out, 1.4s.
 */
export default function MfRule() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "none";

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      gsap.set(el, { scaleX: 1 });
      return;
    }

    gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
    const tween = gsap.to(el, {
      scaleX: 1,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <div style={{ padding: "0 var(--gutter)" }}>
      <svg
        ref={ref}
        aria-hidden="true"
        viewBox="0 0 100 6"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "6px", display: "block" }}
      >
        <line x1="0" y1="0.8" x2="100" y2="0.8" stroke="var(--color-divider)" strokeWidth="0.4" />
        <line x1="0" y1="2.6" x2="100" y2="2.6" stroke="var(--color-divider)" strokeWidth="0.6" opacity="0.7" />
        <line x1="0" y1="4.6" x2="100" y2="4.6" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.55" />
        <line x1="0" y1="5.5" x2="100" y2="5.5" stroke="var(--color-divider)" strokeWidth="0.4" opacity="0.5" />
      </svg>
    </div>
  );
}
