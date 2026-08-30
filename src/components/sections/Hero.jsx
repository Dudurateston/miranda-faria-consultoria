import React from "react";
import StaticHero from "@/components/StaticHero";

// Hero temporária e estável enquanto a versão de alto impacto é
// desenhada no Claude Design. Revelação por máscara sobre a imagem
// real do M — funciona, é fiel à marca, não quebra.
export default function Hero() {
  return (
    <section className="mf-hero" data-bg="#F5F1EA" id="topo">
      <StaticHero />
      <style>{`.mf-hero{position:relative;background:transparent}`}</style>
    </section>
  );
}