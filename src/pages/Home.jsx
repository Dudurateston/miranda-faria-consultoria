import React from "react";
import TopBar from "@/components/TopBar";
import MobileWhatsAppBar from "@/components/MobileWhatsAppBar";
import Footer from "@/components/Footer";
import MfRule from "@/components/MfRule";
import Hero from "@/components/sections/Hero";
import Tese from "@/components/sections/Tese";
import OndeDoi from "@/components/sections/OndeDoi";
import Frentes from "@/components/sections/Frentes";
import Trabalhos from "@/components/sections/Trabalhos";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Sobre from "@/components/sections/Sobre";
import Conversar from "@/components/sections/Conversar";
import SectorTicker from "@/components/SectorTicker";

export default function Home() {
  return (
    <>
      <TopBar heroVh={5} />
      <main>
        <Hero />
        <MfRule />
        <Tese />
        <MfRule />
        <OndeDoi />
        <MfRule />
        <Frentes />
        <SectorTicker />
        <Trabalhos />
        <MfRule />
        <ComoFunciona />
        <MfRule />
        <Sobre />
        <MfRule />
        <Conversar />
      </main>
      <Footer />
      <MobileWhatsAppBar />
      <div className="h-20 md:hidden" />
    </>
  );
}