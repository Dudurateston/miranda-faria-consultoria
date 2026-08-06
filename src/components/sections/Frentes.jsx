import React from "react";
import Reveal from "@/components/Reveal";
import Section, { Container } from "@/components/Section";
import SectionLabel from "@/components/SectionLabel";
import SectionTitle from "@/components/SectionTitle";

const frentes = [
  {
    t: "Sistemas sob medida",
    d: "Catálogo, estoque, cadastro e pedidos. Banco de dados de verdade e painel que o dono opera sozinho.",
  },
  {
    t: "BI e planilhas",
    d: "Seus números saindo do Excel manual e virando painel que atualiza sozinho. Venda, estoque, margem e produtividade em uma tela.",
  },
  {
    t: "Automação",
    d: "Fluxos que rodam sem ninguém apertar botão: atendimento no WhatsApp pela API oficial, qualificação de lead, agendamento, relatório pronto no e-mail.",
  },
  {
    t: "Marca e design com IA",
    d: "Identidade visual, site e material de aplicação — construídos com IA e refinados à mão.",
  },
];

function Frente({ n, t, d, last }) {
  return (
    <div
      className="md:col-span-1"
      style={{
        padding: "32px 0",
        borderTop: "1px solid rgba(138,133,120,0.28)",
        borderBottom: last ? "1px solid rgba(138,133,120,0.28)" : "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "#8A8578",
        }}
      >
        {String(n).padStart(2, "0")}
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
        {t}
      </h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.8, color: "#8A8578", margin: 0 }}>
        {d}
      </p>
    </div>
  );
}

export default function Frentes() {
  return (
    <Section id="frentes">
      <Container>
        <Reveal><SectionLabel>Frentes</SectionLabel></Reveal>
        <Reveal delay={60}><SectionTitle style={{ marginBottom: 48 }}>O que entrego</SectionTitle></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {frentes.map((f, i) => (
            <Reveal key={i} delay={(i % 2) * 80}>
              <Frente n={i + 1} t={f.t} d={f.d} last={i === frentes.length - 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}