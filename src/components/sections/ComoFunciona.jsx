import React from "react";
import Reveal from "@/components/Reveal";
import Section, { Container } from "@/components/Section";
import SectionLabel from "@/components/SectionLabel";
import SectionTitle from "@/components/SectionTitle";

const passos = [
  { t: "Diagnóstico", d: "Uma conversa para entender onde o processo trava. Sem custo." },
  { t: "Escopo fechado", d: "Proposta com entrega, prazo e valor definidos. Sem surpresa depois." },
  { t: "Construção", d: "Você acompanha durante, não só no final." },
  { t: "Entrega e autonomia", d: "Sistema no ar, você treinado para operar. A infraestrutura fica no seu nome." },
];

export default function ComoFunciona() {
  return (
    <Section id="como-funciona">
      <Container>
        <Reveal><SectionLabel>Como funciona</SectionLabel></Reveal>
        <Reveal delay={60}><SectionTitle style={{ marginBottom: 48 }}>Quatro passos</SectionTitle></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {passos.map((p, i) => (
            <Reveal key={i} delay={(i % 2) * 80}>
              <div
                style={{
                  padding: "32px 0",
                  borderTop: "1px solid rgba(138,133,120,0.28)",
                  borderBottom: i === passos.length - 1 ? "1px solid rgba(138,133,120,0.28)" : "none",
                }}
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.3em", color: "#8A8578" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 400,
                    fontSize: "clamp(20px, 2.4vw, 26px)",
                    letterSpacing: "0.02em",
                    color: "#1A1A18",
                    margin: "14px 0 14px",
                  }}
                >
                  {p.t}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.8, color: "#8A8578", margin: 0 }}>
                  {p.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}