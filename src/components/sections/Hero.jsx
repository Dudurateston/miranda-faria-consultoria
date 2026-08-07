import React from "react";
import ScrollScrubHero from "@/components/ScrollScrubHero";

/**
 * Hero do site — usa o scroll-scrub com os 65 quadros da animação da marca.
 *
 * COMO LIGAR OS QUADROS:
 * 1. Suba os 65 arquivos frame_001.jpg ... frame_065.jpg no Base44
 *    (área de upload de assets do editor).
 * 2. Copie a URL pública de UM deles, por exemplo frame_001.jpg.
 * 3. Cole aqui em FRAMES_BASE_URL tudo ATÉ "frame_" (sem o número e sem .jpg).
 *    Exemplo: se a URL for
 *      https://xxxx.base44.app/assets/frame_001.jpg
 *    então FRAMES_BASE_URL = "https://xxxx.base44.app/assets/frame_"
 *
 * Enquanto FRAMES_BASE_URL estiver vazio, a hero mostra um fallback
 * simples com o nome da marca — o site não quebra.
 */
const FRAMES_BASE_URL = ""; // <-- cole a URL base aqui

export default function Hero() {
  return (
    <section className="mf-hero" data-bg="#F5F1EA" id="topo">
      <ScrollScrubHero
        baseUrl={FRAMES_BASE_URL}
        frameCount={65}
        ext="jpg"
        scrollHeight="400vh"
        showWordmark={true}
      />
      <style>{`.mf-hero{position:relative;background:transparent}`}</style>
    </section>
  );
}
