import { useEffect, useState } from "react";

/**
 * Mobile de verdade, nao aproximacao de desktop.
 *
 * Regra da rodada mobile (Eduardo, 17/09): no celular o site e a
 * referencia do spenceltd.co.uk — IMAGEM, nao video. Video 74x41px
 * baixando 600KB e inviavel em 4G. Todo autoplay de video vira
 * poster no mobile; quem quer o video completo esta no desktop.
 */

export const MOBILE_QUERY = "(max-width: 768px)";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

/** Poster derivado por convencao: /art/nv_dev.mp4 -> /art/nv_dev_p.webp */
export function posterFor(src) {
  if (!src || typeof src !== "string" || !src.endsWith(".mp4")) return undefined;
  return src.replace(/\.mp4$/, "_p.webp");
}
