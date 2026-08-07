import React, { useEffect, useRef } from "react";

// Régua horizontal que se desenha ao entrar na viewport.
// Usa a primitiva .mf-rule (tokens.css) e adiciona .is-in via IO.
export default function MfRule() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.classList.add("is-in");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ padding: "0 var(--gutter)" }}>
      <div ref={ref} className="mf-rule" aria-hidden="true" />
    </div>
  );
}