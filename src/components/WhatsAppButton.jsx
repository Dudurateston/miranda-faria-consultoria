import React from "react";
import { WHATSAPP_URL } from "@/lib/site";

export default function WhatsAppButton({
  children = "Chamar no WhatsApp",
  variant = "solid",
  className = "",
  style,
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    padding: "16px 28px",
    minHeight: 44,
    textDecoration: "none",
    borderRadius: 2,
    transition: "opacity 200ms ease",
    cursor: "pointer",
  };
  const look =
    variant === "solid"
      ? { background: "#B5502E", color: "#F5F1EA" }
      : { background: "transparent", color: "#1A1A18", border: "1px solid rgba(138,133,120,0.28)" };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      className={className}
      style={{ ...base, ...look, ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </a>
  );
}