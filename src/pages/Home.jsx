import React from "react";
import HeroStage from "@/components/sections/HeroStage";
import HomeSobre from "@/components/sections/HomeSobre";
import HomeServicos from "@/components/sections/HomeServicos";
import HomeTecnologia from "@/components/sections/HomeTecnologia";
import HomeInsights from "@/components/sections/HomeInsights";
import HomeCta from "@/components/sections/HomeCta";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * Home completa — seis secoes sobre o grafite (#141414), separadas por
 * regras editoriais de 1px. A hero cobre a viewport; as demais contam
 * a historia inteira (sobre, servicos, tecnologia, insights, contato)
 * para quem so visita a pagina principal.
 */
export default function Home() {
  usePageTitle(null, "home");

  return (
    <div className="mf-home" data-theme="dark">
      <HeroStage />
      <HomeSobre />
      <HomeServicos />
      <HomeTecnologia />
      <HomeInsights />
      <HomeCta />

      <style>{`
.mf-home{background:var(--mf-graphite)}
.mf-h{
  position:relative;
  padding:var(--section-gap) var(--gutter);
  border-top:1px solid var(--mf-rule);
}
.mf-h__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-h__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-h__cta{
  display:inline-block;margin-top:2.5rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--color-accent);padding-bottom:4px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-h__cta:hover{opacity:0.65}
      `}</style>
    </div>
  );
}