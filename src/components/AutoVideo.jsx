import React from "react";

/**
 * Video em loop automatico, mudo e sem controles — o substituto moderno
 * dos GIFs pesados da arte de fundo. `aria-hidden` por padrao: e decoracao.
 */
export default function AutoVideo({ src, className, label, poster }) {
  return (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
    />
  );
}
