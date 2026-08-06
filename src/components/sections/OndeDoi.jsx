import React from "react";
import Reveal from "@/components/Reveal";
import Section, { Container } from "@/components/Section";
import SectionLabel from "@/components/SectionLabel";

const dores = [
  "Você sabe o preço de cabeça, mas ninguém mais sabe.",
  "O estoque está certo na sua memória e errado na planilha.",
  "O pedido chegou no WhatsApp e sumiu na conversa.",
  "O relatório existe, mas leva duas horas para montar todo mês.",
];

export default function OndeDoi() {
  return (
    <Section id="onde-doi">
      <Container style={{ maxWidth: 760 }}>
        <Reveal><SectionLabel>Onde isso dói</SectionLabel></Reveal>
        <div>
          {dores.map((d, i) => (
            <Reveal key={i} delay={i * 60}>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(19px, 2.6vw, 26px)",
                  lineHeight: 1.5,
                  color: "#1A1A18",
                  margin: 0,
                  padding: "26px 0",
                  borderTop: "1px solid rgba(138,133,120,0.28)",
                }}
              >
                {d}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={80}>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(20px, 2.8vw, 28px)",
              lineHeight: 1.5,
              color: "#B5502E",
              margin: "34px 0 0",
            }}
          >
            Nada disso se resolve com site bonito. Resolve com sistema.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}