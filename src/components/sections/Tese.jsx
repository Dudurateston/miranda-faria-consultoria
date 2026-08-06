import React from "react";
import Reveal from "@/components/Reveal";
import Section, { Container } from "@/components/Section";
import SectionLabel from "@/components/SectionLabel";

export default function Tese() {
  return (
    <Section id="tese">
      <Container style={{ maxWidth: 760 }}>
        <Reveal>
          <SectionLabel>O que eu faço</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(22px, 3.4vw, 34px)",
              lineHeight: 1.45,
              letterSpacing: "0.01em",
              color: "#1A1A18",
              margin: 0,
            }}
          >
            Estruturo a base que sustenta o negócio — catálogos, painéis e processos que funcionam sem depender de mim todo dia.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}