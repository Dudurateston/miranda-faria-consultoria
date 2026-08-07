import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Régua que se desenha: scaleX 0 -> 1, duração 1.4s, ease expo.out.
export default function MfRule() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // neutraliza a transição CSS do .mf-rule para o GSAP controlar o transform
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
      <div ref={ref} className="mf-rule" aria-hidden="true" />
    </div>
  );
}