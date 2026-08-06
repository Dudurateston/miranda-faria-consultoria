import React from "react";

export default function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: 10,
        letterSpacing: "0.34em",
        textTransform: "uppercase",
        color: "#8A8578",
        margin: 0,
        marginBottom: 28,
      }}
    >
      {children}
    </p>
  );
}