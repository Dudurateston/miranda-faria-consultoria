import React, { useRef, useEffect, useState } from "react";
import { posterFor } from "@/lib/isMobile";

/**
 * Video em loop automatico, mudo e sem controles — o substituto moderno
 * dos GIFs pesados da arte de fundo. LAZY: so recebe src quando entra na
 * viewport (rootMargin 300px), entao nada de video pesado baixando fora
 * da tela. `aria-hidden` por padrao: e decoracao.
 */
export default function AutoVideo({ src, className, label, poster, preloadOffset = "300px", eager = false }) {
  const ref = useRef(null);
  const [live, setLive] = useState(eager);
  const still = poster ?? posterFor(src);
  useEffect(() => {
    /* eager: paineis do nav — o elemento so existe com o painel aberto;
       comeca live: sem latencia de IO o poster pinta na hora da troca. */
    if (eager) return;
    if (typeof IntersectionObserver === "undefined") { setLive(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } },
      { rootMargin: preloadOffset }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  /* 19/09 v3 (Eduardo: "os videos antigos ainda aparecem brevemente"):
     remontagem por KEY — trocar src cria um elemento <video> NOVO, que
     nao guarda frame nenhum do anterior. O bug do Chromium de pintar o
     ultimo frame do video velho durante a carga fica impossivel por
     construcao, em vez de mitigado por aborto. */
  const finalSrc = live ? src : undefined;
  useEffect(() => {
    const video = ref.current;
    if (!video || !finalSrc) return;
    let visible = false;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (!visible || document.hidden || motion.matches) video.pause();
      else video.play().catch(() => {});
    };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0 });
    if (observer) observer.observe(video);
    else { visible = true; sync(); }
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
      video.pause();
    };
  }, [finalSrc]);
  return (
    <video
      key={finalSrc ?? "off"}
      ref={ref}
      className={className}
      src={finalSrc}
      poster={live ? still : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
    />
  );
}
