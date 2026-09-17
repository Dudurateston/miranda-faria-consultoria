import React, { useRef, useEffect, useState } from "react";
import { useIsMobile, posterFor } from "@/lib/isMobile";

/**
 * Video em loop automatico, mudo e sem controles — o substituto moderno
 * dos GIFs pesados da arte de fundo. LAZY: so recebe src quando entra na
 * viewport (rootMargin 300px), entao nada de video pesado baixando fora
 * da tela. `aria-hidden` por padrao: e decoracao.
 */
export default function AutoVideo({ src, className, label, poster, preloadOffset = "300px" }) {
  const ref = useRef(null);
  const [live, setLive] = useState(false);
  /* MOBILE: video vira poster estatico (regra spence). O IO continua
     valendo para o desktop; no celular o src nunca chega no elemento. */
  const isMobile = useIsMobile();
  const still = poster ?? posterFor(src);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setLive(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } },
      { rootMargin: preloadOffset }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      src={live && !isMobile ? src : undefined}
      poster={still}
      autoPlay={live}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
    />
  );
}
