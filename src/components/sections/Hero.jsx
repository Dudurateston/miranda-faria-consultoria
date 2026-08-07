import React from "react";
import ScrollScrubHero from "@/components/ScrollScrubHero";
import { HERO_FRAMES } from "@/lib/hero-frames";

export default function Hero() {
  return (
    <section className="mf-hero" data-bg="#F5F1EA" id="topo">
      <ScrollScrubHero
        frames={HERO_FRAMES}
        scrollHeight="400vh"
        showWordmark={true}
      />
      <style>{`.mf-hero{position:relative;background:transparent}`}</style>
    </section>
  );
}