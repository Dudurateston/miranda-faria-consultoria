import React from "react";

const BONE = "#F5F1EA";
const INK = "#1A1A18";
const STONE = "#8A8578";

export default function StaticHero() {
  return (
    <section
      aria-label="Miranda Faria — Consultoria e Tecnologia"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: BONE,
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', Didot, Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(24px, 5vw, 56px)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            lineHeight: 1,
            color: INK,
            margin: 0,
          }}
        >
          Miranda Faria
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(8px, 1.2vw, 11px)",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: STONE,
            margin: "18px 0 0",
          }}
        >
          Consultoria &amp; Tecnologia
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: STONE,
        }}
      >
        Role
      </div>
    </section>
  );
}