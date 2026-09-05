import React, { useEffect, useRef, useState } from "react";

/**
 * MotionCurves — segunda prova viva da aba Tecnologia.
 *
 * As curvas de easing que regem o movimento do site inteiro, plotadas
 * e animadas ao vivo: linear, outExpo e elástica. Cada curva é uma
 * função de interpolação escrita à mão — não uma linha de timeline de
 * biblioteca. Canvas 2D puro, zero dependências.
 */

// as mesmas curvas usadas pelo design system do site
const CURVES = [
  {
    name: "linear",
    f: (x) => x,
  },
  {
    name: "outExpo",
    f: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  },
  {
    name: "elástica",
    f: (x) =>
      x === 0 || x === 1
        ? x
        : Math.pow(2, -9 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  },
];

const LOOP_MS = 2600;

export default function MotionCurves() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let W = 0,
      H = 0,
      dpr = Math.min(window.devicePixelRatio || 1, 2),
      raf = 0,
      running = false,
      alive = true;

    const PAD_L = 14,
      PAD_R = 14,
      LANE_GAP = 10;

    const laneY = (i, n) => {
      const inner = H - 16;
      const laneH = (inner - LANE_GAP * (n - 1)) / n;
      return 8 + laneH / 2 + i * (laneH + LANE_GAP);
    };

    // curva estatica: traçados + pontos no fim do percurso
    const drawStatic = () => {
      drawFrame(1);
    };

    const drawFrame = (prog) => {
      ctx.fillStyle = "#16130f";
      ctx.fillRect(0, 0, W, H);
      const x0 = PAD_L,
        x1 = W - PAD_R,
        span = x1 - x0;

      CURVES.forEach((c, i) => {
        const cy = laneY(i, CURVES.length);
        const amp = Math.min(26, (H / CURVES.length - LANE_GAP) / 2.1);

        // linha-guia do percurso
        ctx.strokeStyle = "rgba(242,238,230,0.10)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, cy);
        ctx.lineTo(x1, cy);
        ctx.stroke();

        // a curva em si: y = cy - f(x)*amp
        ctx.strokeStyle = "rgba(242,238,230,0.34)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let x = 0; x <= span; x += 2) {
          const t = x / span;
          const y = cy - c.f(t) * amp;
          if (x === 0) ctx.moveTo(x0 + x, y);
          else ctx.lineTo(x0 + x, y);
        }
        ctx.stroke();

        // rotulo mono da curva
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillStyle = "rgba(242,238,230,0.45)";
        ctx.textAlign = "left";
        ctx.fillText(c.name, x0 + 2, cy + amp + 4);

        // o ponto viajando: posicao horizontal = progresso linear,
        // altura = valor interpolado pela curva
        const px = x0 + prog * span;
        const py = cy - c.f(prog) * amp;
        ctx.fillStyle = i === 1 ? "rgba(224,138,95,0.95)" : "rgba(242,238,230,0.85)";
        ctx.beginPath();
        ctx.arc(px, py, i === 1 ? 3.4 : 2.6, 0, Math.PI * 2);
        ctx.fill();
        // rastro do avanco sobre a linha-guia
        ctx.strokeStyle = "rgba(224,138,95,0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, cy);
        ctx.lineTo(px, cy);
        ctx.stroke();
      });
    };

    const frame = (now) => {
      if (!alive) return;
      if (running) {
        const prog = (now % LOOP_MS) / LOOP_MS;
        drawFrame(prog);
      }
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) drawStatic();
    };

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.1 }
    );
    io.observe(wrap);

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <figure ref={wrapRef} className="mf-tf mf-tf--half" aria-label="Easing curves, live">
      <canvas ref={canvasRef} />
      <figcaption className="mf-tf__hud" aria-hidden="true">
        <span>easing · 0 libs</span>
        <span>hand-written math</span>
      </figcaption>
    </figure>
  );
}
