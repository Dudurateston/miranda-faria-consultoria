import React from "react";

export default function Section({ id, children, className = "", style }) {
  return (
    <section
      id={id}
      className={`px-6 md:px-10 ${className}`}
      style={{
        paddingTop: "clamp(90px, 15vh, 190px)",
        paddingBottom: "clamp(90px, 15vh, 190px)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export function Container({ children, className = "", style }) {
  return (
    <div className={`mx-auto ${className}`} style={{ maxWidth: 960, ...style }}>
      {children}
    </div>
  );
}