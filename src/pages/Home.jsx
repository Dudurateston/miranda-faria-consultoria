import React from "react";
import HeroStage, { IntroGate } from "@/components/sections/HeroStage";
import HomeSobre from "@/components/sections/HomeSobre";
import HomeServicos from "@/components/sections/HomeServicos";
import HomeTrabalho from "@/components/sections/HomeTrabalho";
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
    <div className="mf-home">
      <IntroGate />
      <HeroStage />
      <HomeSobre />
      <HomeServicos />
      <HomeTrabalho />
      <HomeTecnologia />
      <HomeInsights />
      <HomeCta />

      <style>{`
.mf-label__n{color:var(--copper,#B5502E);margin-right:0.55rem;font-size:0.9em}

body{-webkit-tap-highlight-color:transparent}
.mf-hero__mark,.mf-mnav__wm,.mf-nav__brand,.mf-egg,.mf-srow,.mf-trow{user-select:none;-webkit-user-select:none}
.mf-home{
  background-color:var(--mf-graphite);
  background-image:
    repeating-linear-gradient(115deg, transparent 0 90px, rgba(26,26,24,0.05) 90px 91px),
    repeating-linear-gradient(-115deg, transparent 0 140px, rgba(181,80,46,0.05) 140px 141px);
  animation:meshdrift 46s linear infinite;
}
@keyframes meshdrift{to{background-position:640px 320px, -560px -280px}}

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