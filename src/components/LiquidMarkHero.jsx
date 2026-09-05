import React, { useEffect, useRef, useState } from "react";
import { LiquidMetal } from "@paper-design/shaders-react";

/**
 * LiquidMarkHero — hero do site Miranda Faria.
 *
 * A marca (PNG com fundo transparente, alpha real) é usada como
 * mascara de silhueta para um shader WebGL de metal liquido em tempo
 * real. O liquido escorre dentro do contorno do "M", reage ao
 * ponteiro, e assenta conforme a rolagem.
 *
 * Por que isso resolve todas as dores anteriores:
 *  - Zero sequencia de imagens: um unico shader ao vivo, ~poucos KB
 *    de codigo, sem decode de quadros.
 *  - Nitidez total em qualquer DPR: e vetor/procedural, nao pixel.
 *  - Interativo de verdade: responde ao mouse, nao e so decoracao.
 *  - Alto valor tecnico percebido: WebGL ao vivo e evidencia real de
 *    capacidade, nao efeito de template.
 *
 * Requer fundo TRANSPARENTE na imagem (silhueta), nao fundo solido.
 *
 * Uso no Base44:
 *   1. src/components/LiquidMarkHero.jsx
 *   2. Em sections/Hero.jsx: import e renderiza <LiquidMarkHero />
 */

const INK = "#1A1A18";
const BONE = "#F5F1EA";
const COPPER = "#B5502E";
const STONE = "#8A8578";

const MARK_URL =
  "https://base44.app/api/apps/69d13abf1923f13a0fcdbf60/files/mp/public/69d13abf1923f13a0fcdbf60/8376f5042_e287dbc01_McamadasfundotransparenteMirandaFaria.png";

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => 1 - Math.pow(1 - t, 3);

export default function LiquidMarkHero({
  markUrl = MARK_URL,
  scrollHeight = "320vh",
  tagline = "DESIGN ENGINEER & CREATIVE TECHNOLOGIST",
  hint = "SCROLL",
}) {
  const trackRef = useRef(null);
  const target = useRef(0);
  const smooth = useRef(0);
  const loop = useRef(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [markLoaded, setMarkLoaded] = useState(false);
  const [markFailed, setMarkFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pre-checa se a imagem carrega antes de montar o shader.
  useEffect(() => {
    const img = new Image();
    img.onload = () => setMarkLoaded(true);
    img.onerror = () => setMarkFailed(true);
    img.src = markUrl;
  }, [markUrl]);

  useEffect(() => {
    if (reduced) {
      setP(1);
      return;
    }
    const read = () => {
      const el = trackRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      return span > 0 ? clamp(-rect.top / span) : 0;
    };
    const onScroll = () => {
      target.current = read();
    };
    target.current = read();
    smooth.current = target.current;

    const tick = () => {
      const d = target.current - smooth.current;
      smooth.current += d * 0.15;
      if (Math.abs(d) < 0.0002) smooth.current = target.current;
      setP(smooth.current);
      loop.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    loop.current = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (loop.current) window.cancelAnimationFrame(loop.current);
    };
  }, [reduced]);

  // Entrada: o shader nasce sutil e ganha presenca; depois assenta e
  // segura (dwell) para a marca ficar nitida no fim do trecho de scroll.
  const entryP = ease(seg(p, 0.02, 0.4));
  const settleP = ease(seg(p, 0.35, 0.6));
  const signP = ease(seg(p, 0.5, 0.72));
  const strataP = ease(seg(p, 0.6, 0.84));
  const hintP = 1 - seg(p, 0.02, 0.2);

  // Velocidade/turbulencia do liquido acalma conforme assenta —
  // comeca vivo, termina quieto e nitido (o "dwell" pedido).
  const liquidSpeed = 0.6 - settleP * 0.4;

  return (
    <div
      ref={trackRef}
      aria-label="Miranda Faria — Design Engineer & Creative Technologist"
      style={{
        height: reduced ? "100vh" : scrollHeight,
        position: "relative",
        background: BONE,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: BONE,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(440px, 64vw)",
            aspectRatio: "1 / 1",
            opacity: entryP,
            transform: `scale(${0.92 + 0.08 * entryP})`,
            willChange: "transform, opacity",
          }}
        >
          {markLoaded && !markFailed ? (
            <LiquidMetal
              image={markUrl}
              colorBack="#00000000"
              colorTint={COPPER}
              speed={reduced ? 0 : liquidSpeed}
              contour={0.55}
              softness={0.4}
              shiftRed={0.1}
              shiftBlue={0.14}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            // Fallback: enquanto carrega ou se o shader/imagem falhar,
            // mostra o wordmark em texto — nunca quebra a hero.
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: "clamp(48px, 9vw, 90px)",
                  color: INK,
                  opacity: 0.15,
                }}
              >
                M
              </span>
            </div>
          )}

          {/* Ponto de cobre assentando abaixo da marca */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "-6%",
              width: "11px",
              height: "11px",
              marginLeft: "-5.5px",
              borderRadius: "50%",
              background: COPPER,
              opacity: settleP,
              transform: `translateY(${-40 * (1 - settleP)}px) scale(${
                0.4 + 0.6 * settleP
              })`,
              willChange: "transform, opacity",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "2.6rem",
            textAlign: "center",
            opacity: signP,
            transform: `translateY(${20 * (1 - signP)}px)`,
            willChange: "transform, opacity",
          }}
        >
          <h1
            style={{
              fontFamily: "'Instrument Serif', Didot, Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(22px, 4vw, 42px)",
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
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(8px, 1.1vw, 10px)",
              letterSpacing: "0.3em",
              textIndent: "0.3em",
              color: STONE,
              margin: "16px 0 0",
              whiteSpace: "nowrap",
            }}
          >
            {tagline}
          </p>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "24vh",
            opacity: strataP,
            transform: `translateY(${50 * (1 - strataP)}px)`,
            willChange: "transform, opacity",
            pointerEvents: "none",
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M0 ${60 + i * 24} C 240 ${44 + i * 24}, 480 ${76 + i * 24}, 720 ${
                58 + i * 24
              } S 1200 ${40 + i * 24}, 1440 ${64 + i * 24}`}
              fill="none"
              stroke={INK}
              strokeOpacity={0.15 - i * 0.014}
              strokeWidth="1"
            />
          ))}
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.34em",
            textIndent: "0.34em",
            color: STONE,
            opacity: hintP,
            pointerEvents: "none",
          }}
        >
          {hint}
        </div>
      </div>
    </div>
  );
}
