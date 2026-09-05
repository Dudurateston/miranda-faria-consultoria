import React, { useEffect, useRef, useState } from "react";

/**
 * BrandAssembly — hero de abertura, Miranda Faria.
 *
 * Os planos geometricos do M entram do espaco 3D e assentam no lugar
 * conforme a pagina rola. Depois vem a linha de eixo, o ponto de cobre
 * e o nome.
 *
 * Cada plano e um SVG proprio dentro de uma div. A div recebe o
 * transform 3D (confiavel em todos os navegadores) e o SVG carrega o
 * poligono com contorno. Transformar <g> de SVG em 3D falha no Safari.
 *
 * Uso no Base44:
 *   1. src/components/BrandAssembly.jsx
 *   2. import BrandAssembly from "@/components/BrandAssembly";
 *   3. <BrandAssembly /> como primeiro elemento da Home.
 *
 * Sem Tailwind, sem dependencia externa.
 */

const INK = "#1A1A18";
const BONE = "#F5F1EA";
const COPPER = "#B5502E";
const STONE = "#8A8578";

const VIEW = "0 0 400 420";

/** Ordem de chegada: planos externos, depois os triangulos. */
const SHAPES = [
  { pts: "72,158 112,150 112,347 72,355", op: 0.13, at: 0.00 },
  { pts: "288,150 328,158 328,355 288,347", op: 0.13, at: 0.04 },
  { pts: "128,150 168,158 168,355 128,347", op: 0.13, at: 0.09 },
  { pts: "232,158 272,150 272,347 232,355", op: 0.13, at: 0.13 },
  { pts: "100,60 230,360 170,360", op: 0.10, at: 0.20 },
  { pts: "300,60 170,360 230,360", op: 0.10, at: 0.25 },
];

/** Posicao inicial estavel por indice. */
function scatterFor(i) {
  const r = (n) => {
    const v = Math.sin((i + 1) * n) * 43758.5453;
    return v - Math.floor(v);
  };
  const a = r(12.9898);
  const b = r(78.233);
  const c = r(39.425);
  return {
    tx: (a - 0.5) * 780,
    ty: (b - 0.5) * 460,
    tz: (c - 0.5) * 1600,
    rx: (b - 0.5) * 120,
    ry: (a - 0.5) * 170,
    rz: (c - 0.5) * 90,
  };
}

const SCATTER = SHAPES.map((_, i) => scatterFor(i));

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => 1 - Math.pow(1 - t, 3);

export default function BrandAssembly() {
  const trackRef = useRef(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setP(1);
      return;
    }
    let ticking = false;
    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setP(total > 0 ? clamp(-rect.top / total) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  const axisP = ease(seg(p, 0.52, 0.68));
  const dotP = ease(seg(p, 0.62, 0.80));
  const wordP = ease(seg(p, 0.74, 0.96));
  const liftP = ease(seg(p, 0.80, 1));
  const hintP = 1 - seg(p, 0.02, 0.24);

  const layerStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    willChange: "transform, opacity",
  };

  return (
    <div
      ref={trackRef}
      style={{
        height: reduced ? "100vh" : "460vh",
        position: "relative",
        background: BONE,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1600px",
          perspectiveOrigin: "50% 45%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(400px, 78vw)",
            height: "min(420px, 52vh)",
            transformStyle: "preserve-3d",
            transform: `translateY(${-24 * liftP}px)`,
          }}
        >
          {SHAPES.map((shape, i) => {
            const t = ease(seg(p, shape.at, shape.at + 0.46));
            const inv = 1 - t;
            const s = SCATTER[i];
            return (
              <div
                key={i}
                style={{
                  ...layerStyle,
                  opacity: Math.min(1, t * 1.6),
                  transform: `translate3d(${s.tx * inv}px, ${s.ty * inv}px, ${
                    s.tz * inv
                  }px) rotateX(${s.rx * inv}deg) rotateY(${s.ry * inv}deg) rotateZ(${
                    s.rz * inv
                  }deg)`,
                }}
              >
                <svg width="100%" height="100%" viewBox={VIEW} aria-hidden="true">
                  <polygon
                    points={shape.pts}
                    fill={INK}
                    fillOpacity={shape.op}
                    stroke={INK}
                    strokeOpacity="0.58"
                    strokeWidth="0.6"
                  />
                </svg>
              </div>
            );
          })}

          <div style={{ ...layerStyle, opacity: axisP }}>
            <svg width="100%" height="100%" viewBox={VIEW} aria-hidden="true">
              <line
                x1="200"
                y1="150"
                x2="200"
                y2={150 + 212 * axisP}
                stroke={INK}
                strokeOpacity="0.4"
                strokeWidth="0.6"
              />
            </svg>
          </div>

          <div
            style={{
              ...layerStyle,
              opacity: dotP,
              transform: `translate3d(0, ${-120 * (1 - dotP)}px, 0)`,
            }}
          >
            <svg width="100%" height="100%" viewBox={VIEW} aria-hidden="true">
              <circle cx="200" cy="300" r={11 * (0.45 + 0.55 * dotP)} fill={COPPER} />
            </svg>
          </div>
        </div>

        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
            opacity: wordP,
            transform: `translate3d(0, ${30 * (1 - wordP)}px, 0)`,
            willChange: "transform, opacity",
          }}
        >
          <h1
            style={{
              fontFamily: "'Instrument Serif', Didot, Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(26px, 5.2vw, 56px)",
              letterSpacing: "0.2em",
              textIndent: "0.2em",
              lineHeight: 1,
              color: INK,
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            MIRANDA FARIA
          </h1>
          <p
            style={{
              fontSize: "clamp(9px, 1.3vw, 12px)",
              letterSpacing: "0.42em",
              textIndent: "0.42em",
              color: STONE,
              margin: "18px 0 0",
              whiteSpace: "nowrap",
            }}
          >
            CONSULTORIA &amp; TECNOLOGIA
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
            letterSpacing: "0.34em",
            textIndent: "0.34em",
            color: STONE,
            opacity: hintP,
            pointerEvents: "none",
          }}
        >
          ROLE PARA MONTAR
        </div>
      </div>
    </div>
  );
}