import React, { useRef, useEffect, useState } from "react";

/**
 * Video em loop automatico, mudo e sem controles — o substituto moderno
 * dos GIFs pesados da arte de fundo. LAZY: so recebe src quando entra na
 * viewport (rootMargin 300px), entao nada de video pesado baixando fora
 * da tela. `aria-hidden` por padrao: e decoracao.
 */
export default function AutoVideo({ src, className, label, poster, preloadOffset = "300px" }) {
  const ref = useRef(null);
  const [live, setLive] = useState(false);
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
      src={live ? src : undefined}
      poster={poster}
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
