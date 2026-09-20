import React, { useRef, useEffect, useState } from "react";
import { posterFor } from "@/lib/isMobile";

/**
 * Video em loop automatico, mudo e sem controles — o substituto moderno
 * dos GIFs pesados da arte de fundo. LAZY: so recebe src quando entra na
 * viewport (rootMargin 300px), entao nada de video pesado baixando fora
 * da tela. `aria-hidden` por padrao: e decoracao.
 */
export default function AutoVideo({ src, className, label, poster, preloadOffset = "300px" }) {
  const ref = useRef(null);
  const [live, setLive] = useState(false);
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
  /* 19/09 v3 (Eduardo: "os videos antigos ainda aparecem brevemente"):
     remontagem por KEY — trocar src cria um elemento <video> NOVO, que
     nao guarda frame nenhum do anterior. O bug do Chromium de pintar o
     ultimo frame do video velho durante a carga fica impossivel por
     construcao, em vez de mitigado por aborto. */
  const finalSrc = live ? src : undefined;
  return (
    <video
      key={finalSrc ?? "off"}
      ref={ref}
      className={className}
      src={finalSrc}
      poster={live ? still : undefined}
      autoPlay={live}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
    />
  );
}
