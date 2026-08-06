import React from "react";

export default function SectionTitle({ children, as: Tag = "h2", className = "", style }) {
  return (
    <Tag
      className={className}
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 400,
        fontSize: "clamp(24px, 4vw, 38px)",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        lineHeight: 1.2,
        color: "#1A1A18",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}