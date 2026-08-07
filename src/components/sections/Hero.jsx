import React from "react";
import BrandAssembly from "@/components/BrandAssembly";

export default function Hero() {
  return (
    <>
      <section className="mf-hero" data-bg="#F5F1EA" id="topo">
        <BrandAssembly />
      </section>
      <style>{`.mf-hero{position:relative;background:transparent}`}</style>
    </>
  );
}