import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Entrada com stagger dos itens de lista/grade.
// y 30 -> 0, opacidade 0 -> 1, stagger 0.1, ease expo.out.
export function useScrollStagger(ref, {
  selector,
  stagger = 0.1,
  y = 30,
  duration = 0.8,
  delay = 0,
  start = "top 75%",
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const items = selector
      ? Array.from(el.querySelectorAll(selector))
      : Array.from(el.children);
    if (!items.length) return;

    gsap.set(items, { y, opacity: 0 });
    const tween = gsap.to(items, {
      y: 0,
      opacity: 1,
      duration,
      ease: "expo.out",
      stagger,
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    });

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [ref, selector, stagger, y, duration, delay, start]);
}