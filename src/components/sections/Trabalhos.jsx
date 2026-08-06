import React from "react";
import Reveal from "@/components/Reveal";
import Section, { Container } from "@/components/Section";
import SectionLabel from "@/components/SectionLabel";
import SectionTitle from "@/components/SectionTitle";

const cases = [
  {
    nome: "MotorMoura",
    setor: "Distribuidora de autopeças",
    d: "Catálogo B2B com banco de dados completo e painel administrativo. O cliente cadastra produto, categoria, marca e imagem sem depender de mim.",
  },
  {
    nome: "1000 Peças Truck Center",
    setor: "Peças para caminhão",
    d: "Presença digital e estrutura de catálogo para operação de peças pesadas.",
  },
  {
    nome: "Rota Forte Logística",
    setor: "Transporte",
    d: "Site e estrutura digital para operação de logística.",
  },
  {
    nome: "DJ Jotavê",
    setor: "Artista",
    d: "Site de apresentação completo: identidade, agenda e material de divulgação.",
  },
];

function Case({ nome, setor, d, last }) {
  return (
    <div
      style={{
        padding: "32px 0",
        borderTop: "1px solid rgba(138,133,120,0.28)",
        borderBottom: last ? "1px solid rgba(138,133,120,0.28)" : "none",
      }}
    >
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 400,
          fontSize: "clamp(20px, 2.4vw, 26px)",
          letterSpacing: "0.02em",
          color: "#1A1A18",
          margin: 0,
        }}
      >
        {nome}
      </h3>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#8A8578",
          margin: "10px 0 14px",
        }}
      >
        {setor}
      </p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.8, color: "#8A8578", margin: 0 }}>
        {d}
      </p>
    </div>
  );
}

export default function Trabalhos() {
  return (
    <Section id="trabalhos">
      <Container>
        <Reveal><SectionLabel>Trabalhos</SectionLabel></Reveal>
        <Reveal delay={60}><SectionTitle style={{ marginBottom: 48 }}>Projetos em campo</SectionTitle></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {cases.map((c, i) => (
            <Reveal key={i} delay={(i % 2) * 80}>
              <Case {...c} last={i === cases.length - 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}