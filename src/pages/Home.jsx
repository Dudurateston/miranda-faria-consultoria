import React from "react";
import BrandAssembly from "@/components/BrandAssembly";
import ScrollScrubHero from "@/components/ScrollScrubHero";
import StaticHero from "@/components/StaticHero";
import TopBar from "@/components/TopBar";
import MobileWhatsAppBar from "@/components/MobileWhatsAppBar";
import Footer from "@/components/Footer";
import Tese from "@/components/sections/Tese";
import OndeDoi from "@/components/sections/OndeDoi";
import Frentes from "@/components/sections/Frentes";
import Trabalhos from "@/components/sections/Trabalhos";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Sobre from "@/components/sections/Sobre";
import Conversar from "@/components/sections/Conversar";

// Para ativar o hero com scroll-scrub: suba os 65 quadros (frame_001.jpg …
// frame_065.jpg) no Base44 e cole abaixo a URL base. Ex.:
//   "https://cdn.base44.com/.../frame_"
// Enquanto vazio, o site usa um hero estático limpo.
const HERO_BASE_URL = "";

export default function Home() {
  const useScrub = Boolean(HERO_BASE_URL);
  return (
    <div id="topo">
      <BrandAssembly />
      <TopBar heroVh={useScrub ? 4 : 1} />
      {useScrub ? <ScrollScrubHero baseUrl={HERO_BASE_URL} /> : <StaticHero />}

      <Tese />
      <OndeDoi />
      <Frentes />
      <Trabalhos />
      <ComoFunciona />
      <Sobre />
      <Conversar />

      <Footer />
      <MobileWhatsAppBar />
      <div className="h-20 md:hidden" />
    </div>
  );
}