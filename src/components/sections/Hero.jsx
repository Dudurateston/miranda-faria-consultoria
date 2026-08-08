import React from "react";
import LiquidMarkHero from "@/components/LiquidMarkHero";

export default function Hero() {
  return (
    <section className="mf-hero" data-bg="#F5F1EA" id="topo">
      <LiquidMarkHero />
      <style>{`.mf-hero{position:relative;background:transparent}`}</style>
    </section>
  );
}
