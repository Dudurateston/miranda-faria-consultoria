import React from "react";
import { CALENDLY_URL } from "@/lib/site";

/* A4 (relatório): PT tem barra WhatsApp fixa no mobile; EN — o mercado-alvo —
   não tinha CTA nenhum. Barra equivalente com Calendly ("PT=WhatsApp, EN=Calendly"). */
export default function MobileCalendlyBar() {
  return (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "12px 16px",
        background: "rgba(245,241,234,0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(138,133,120,0.28)",
      }}
    >
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        style={{
          display: "flex",
          width: "100%",
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          background: "#B5502E",
          color: "#F5F1EA",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "var(--tracking-label)",
          textTransform: "uppercase",
          borderRadius: 2,
          textDecoration: "none",
        }}
      >
        Book a call →
      </a>
    </div>
  );
}
