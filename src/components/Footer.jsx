import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const linkStyle = {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#8A8578",
    textDecoration: "none",
  };
  return (
    <footer
      className="px-6 md:px-10"
      style={{ paddingTop: 60, paddingBottom: 40, borderTop: "1px solid rgba(138,133,120,0.28)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p style={linkStyle}>
          Miranda Faria · Consultoria &amp; Tecnologia · Minas Gerais
        </p>
        <div className="flex gap-6">
          <Link to="/privacidade" style={linkStyle}>Política de Privacidade</Link>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}