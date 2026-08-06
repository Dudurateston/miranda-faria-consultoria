import React from "react";
import Reveal from "@/components/Reveal";
import Section, { Container } from "@/components/Section";
import SectionLabel from "@/components/SectionLabel";

export default function Sobre() {
  return (
    <Section id="sobre">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <Reveal>
            <div
              style={{
                width: "100%",
                aspectRatio: "4 / 5",
                background: "#EDE8DF",
                border: "1px solid rgba(138,133,120,0.28)",
                display: "flex",
                alignItems: "flex-end",
                padding: 18,
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#8A8578",
                }}
              >
                Eduardo Miranda Faria
              </span>
            </div>
          </Reveal>
          <div>
            <Reveal><SectionLabel>Quem faz</SectionLabel></Reveal>
            <Reveal delay={80}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.8, color: "#1A1A18", margin: "0 0 22px" }}>
                Sou Eduardo Miranda Faria. Trabalho com tecnologia aplicada a negócio real — o tipo que tem estoque, cliente ligando e prazo apertado.
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.8, color: "#8A8578", margin: "0 0 22px" }}>
                Atendo principalmente empresas do interior de Minas: distribuidoras, oficinas, transportadoras, produtores e prestadores de serviço. Gente que já faturou o suficiente para saber que planilha solta não escala mais.
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.8, color: "#8A8578", margin: 0 }}>
                Uso IA como ferramenta central do trabalho, tanto na construção dos sistemas quanto na criação visual. Isso encurta prazo e derruba custo.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}