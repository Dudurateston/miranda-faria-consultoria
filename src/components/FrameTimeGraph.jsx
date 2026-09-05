import React, { useEffect, useRef, useState } from "react";

/**
 * FrameTimeGraph — terceira prova viva da aba Tecnologia.
 *
 * O tempo real de cada quadro desta página, medido no rAF e plotado
 * ao vivo — performance é medida, não prometida. A linha de 16,7 ms
 * é a meta de 60 fps; picos acima dela são o seu navegador dando
 * conta (ou não) da página inteira. Canvas 2D puro, zero dependências.
 */

const N = 96; // quadros no grafico (1,6s de historia a 60fps)
const TARGET = 16.7;

export default function FrameTimeGraph() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [hud, setHud] = useState({ ms: 0, fps: 0 });

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
    let samples = new Array(N).fill(TARGET);
    let last = performance.now();
    let statAcc = 0,
      statFrames = 0;

    const Y_MAX = 40; // ms no topo do grafico

    const draw = () => {
      ctx.fillStyle = "#16130f";
      ctx.fillRect(0, 0, W, H);
      const padT = 10,
        padB = 22;
      const yOf = (ms) => padT + (1 - Math.min(ms, Y_MAX) / Y_MAX) * (H - padT - padB);

      // faixa de meta (60 fps): linha em 16,7ms
      const yT = yOf(TARGET);
      ctx.strokeStyle = "rgba(179,122,96,0.55)";
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, yT);
      ctx.lineTo(W - 10, yT);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillStyle = "rgba(224,138,95,0.75)";
      ctx.textAlign = "left";
      ctx.fillText("16,7ms · 60fps", 12, yT - 5);

      // a serie temporal: cada amostra vira um ponto conectado
      ctx.strokeStyle = "rgba(242,238,230,0.55)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      samples.forEach((ms, i) => {
        const x = 10 + (i / (N - 1)) * (W - 20);
        const y = yOf(ms);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // pontos que estouram a meta ganham cobre
      samples.forEach((ms, i) => {
        if (ms > TARGET * 1.35) {
          const x = 10 + (i / (N - 1)) * (W - 20);
          const y = yOf(ms);
          ctx.fillStyle = "rgba(224,138,95,0.9)";
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // rotulo do eixo
      ctx.fillStyle = "rgba(242,238,230,0.35)";
      ctx.fillText("now →", W - 46, H - 8);
      ctx.fillText("frame time (ms)", 12, H - 8);
    };

    const frame = (now) => {
      if (!alive) return;
      const dt = now - last;
      last = now;
      if (running && dt > 0 && dt < 400) {
        samples.push(dt);
        if (samples.length > N) samples.shift();
        statAcc += dt;
        statFrames++;
        if (statAcc >= 400) {
          const avg = statAcc / statFrames;
          setHud({ ms: Math.min(99, Math.round(avg * 10) / 10), fps: Math.round(1000 / avg) });
          statAcc = 0;
          statFrames = 0;
        }
        draw();
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
      draw();
    };

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? false;
        last = performance.now();
      },
      { threshold: 0.1 }
    );
    io.observe(wrap);

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <figure ref={wrapRef} className="mf-tf mf-tf--half" aria-label="Real frame time, live">
      <canvas ref={canvasRef} />
      <figcaption className="mf-tf__hud" aria-hidden="true">
        <span>{hud.ms > 0 ? `${hud.ms} ms/frame` : "—"}</span>
        <span>{hud.fps > 0 ? `${hud.fps} fps` : "measuring"}</span>
        <span>measured live</span>
      </figcaption>
    </figure>
  );
}
