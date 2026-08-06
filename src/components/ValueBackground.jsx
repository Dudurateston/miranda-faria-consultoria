import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// Interpola o fundo do body entre as cores declaradas pelas seções
// (data-bg) conforme o centro da viewport transita de uma seção para
// outra. Contraste por valor, não por saturação — só #F5F1EA e #1A1A18.
export default function ValueBackground() {
  const sectionsRef = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const compute = () => {
      sectionsRef.current = Array.from(document.querySelectorAll("[data-bg]"))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            center: rect.top + window.scrollY + rect.height / 2,
            color: el.getAttribute("data-bg"),
          };
        })
        .sort((a, b) => a.center - b.center);
    };

    const snap = () => {
      const secs = sectionsRef.current;
      if (!secs.length) return;
      const vpCenter = window.scrollY + window.innerHeight / 2;
      let best = secs[0];
      let bestDist = Infinity;
      for (const s of secs) {
        const d = Math.abs(s.center - vpCenter);
        if (d < bestDist) {
          bestDist = d;
          best = s;
        }
      }
      gsap.set("body", { backgroundColor: best.color });
    };

    const interpolate = () => {
      const secs = sectionsRef.current;
      if (!secs.length) return;
      const vpCenter = window.scrollY + window.innerHeight / 2;

      let i = 0;
      while (i < secs.length - 1 && secs[i + 1].center <= vpCenter) i++;
      const prev = secs[i];
      const next = secs[Math.min(i + 1, secs.length - 1)];
      const span = next.center - prev.center;
      const progress = span > 0
        ? Math.min(1, Math.max(0, (vpCenter - prev.center) / span))
        : 0;

      const color = gsap.utils.interpolate(prev.color, next.color, progress);
      gsap.set("body", { backgroundColor: color });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (mq.matches) snap();
        else interpolate();
      });
    };

    const onResize = () => {
      compute();
      onScroll();
    };

    requestAnimationFrame(() => {
      compute();
      onScroll();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const interval = window.setInterval(compute, 1000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}