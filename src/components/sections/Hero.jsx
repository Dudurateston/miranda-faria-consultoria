import React from "react";
import ScrollScrubHero from "@/components/ScrollScrubHero";
import { HERO_FRAMES } from "@/lib/hero-frames";

// Hero com animação da marca por scroll: sequência de 65 quadros
// pintada em canvas, determinada pela posição do scroll.
export default function Hero() {
  return (
    <section className="mf-hero" data-bg="#F5F1EA" id="topo">
      <ScrollScrubHero frames={HERO_FRAMES} />
      <style>{`.mf-hero{position:relative;background:transparent}`}</style>
    </section>
  );
}