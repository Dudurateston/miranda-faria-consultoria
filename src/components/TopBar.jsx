import React, { useEffect, useState } from "react";

export default function TopBar({ heroVh = 1 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const vh = mq.matches ? 1 : heroVh;
    const threshold = (vh - 1) * window.innerHeight * 0.9;

    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [heroVh]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "rgba(245,241,234,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(138,133,120,0.28)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(-100%)",
        transition: "opacity 300ms ease, transform 300ms ease",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <a
        href="#topo"
        data-cursor="link"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 400,
          fontSize: 13,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#1A1A18",
          textDecoration: "none",
        }}
      >
        Miranda Faria
      </a>
      <a
        href="#conversar"
        data-cursor="link"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#B5502E",
          textDecoration: "none",
        }}
      >
        Conversar
      </a>
    </header>
  );
}