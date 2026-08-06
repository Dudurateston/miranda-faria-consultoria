import React from "react";
import Reveal from "@/components/Reveal";
import Section, { Container } from "@/components/Section";
import SectionLabel from "@/components/SectionLabel";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";

export default function Conversar() {
  return (
    <Section id="conversar">
      <Container style={{ maxWidth: 760 }}>
        <Reveal><SectionLabel>Conversar</SectionLabel></Reveal>
        <Reveal delay={60}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(24px, 4vw, 38px)",
              letterSpacing: "0.02em",
              lineHeight: 1.3,
              color: "#1A1A18",
              margin: "0 0 14px",
            }}
          >
            Me conta onde está travando.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#8A8578", margin: "0 0 32px" }}>
            Respondo no mesmo dia.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div style={{ marginBottom: 40 }}>
            <WhatsAppButton>Chamar no WhatsApp</WhatsAppButton>
          </div>
        </Reveal>
        <Reveal delay={180}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8A8578",
              margin: "0 0 28px",
              paddingBottom: 28,
              borderBottom: "1px solid rgba(138,133,120,0.28)",
            }}
          >
            Prefere escrever? Deixe seu contato abaixo.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <ContactForm />
        </Reveal>
      </Container>
    </Section>
  );
}