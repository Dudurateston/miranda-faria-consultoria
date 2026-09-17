import React, { useEffect, useRef, useState } from "react";

/**
 * AutomationFlow — a assinatura visual da vertical de Automação.
 *
 * A tese da página animada: "Toda cópia manual é um erro esperando
 * acontecer." Uma mensagem chega, o gatilho dispara e o mesmo dado
 * vira três coisas sozinho: resposta pro cliente, cadastro no sistema
 * e rotina noturna. Nada de mão no meio do caminho.
 *
 * Interativo: clicar dispara um evento na hora. Canvas 2D puro, pausa
 * fora da viewport, respeita reduced-motion.
 */
export default function AutomationFlow({ label, hint, alt }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [fired, setFired] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const COPPER = "#B5502E";
    const INK = "rgba(26,26,24,";
    const MONO = "10px var(--font-mono, monospace)";

    let W = 0, H = 0, raf = 0, alive = true, running = false;
    let pulses = [], events = 0, lastAuto = 0, t0 = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const trig = () => ({ x: W * 0.42, y: H * 0.5 });
    const outs = () => [
      { x: W * 0.76, y: H * 0.30, cap: "RESPOSTA" },
      { x: W * 0.76, y: H * 0.50, cap: "CADASTRO" },
      { x: W * 0.76, y: H * 0.70, cap: "ROTINA" },
    ];
    const counts = [0, 0, 0];
    const flash = [0, 0, 0];
    let trigFlash = 0;

    const fire = () => {
      events += 1; setFired(events);
      const T = trig();
      const y = T.y + (Math.random() - 0.5) * H * 0.34;
      pulses.push({ kind: "in", x: -8, y, t: 0 });
      for (let i = 0; i < 3; i++) {
        pulses.push({ kind: "out", idx: i, t: -0.22 * i, x0: 0, y0: 0 });
      }
    };

    const bez = (x0, y0, x1, y1, k) => {
      const mx = (x0 + x1) / 2;
      const a = 1 - k;
      return {
        x: a * a * x0 + 2 * a * k * mx + k * k * x1,
        y: a * a * y0 + 2 * a * k * (y0 + (k < 0.5 ? -14 : 14)) + k * k * y1,
      };
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      drawFrame(0);
    };

    const drawFrame = (dt) => {
      const T = trig(); const O = outs();
      const dur = W < 640 ? 1.5 : 1.15;
      ctx.clearRect(0, 0, W, H);
      ctx.font = MONO;
      // trilhos
      ctx.strokeStyle = INK + "0.14)"; ctx.lineWidth = 1;
      for (const o of O) {
        ctx.beginPath(); ctx.moveTo(T.x + 18, T.y); ctx.lineTo(o.x, o.y); ctx.stroke();
      }
      // gatilho
      trigFlash = Math.max(0, trigFlash - dt * 2.4);
      ctx.beginPath(); ctx.arc(T.x, T.y, 13 + trigFlash * 7, 0, Math.PI * 2);
      ctx.strokeStyle = INK + (0.5 + trigFlash * 0.4).toFixed(2) + ")"; ctx.stroke();
      if (trigFlash > 0) {
        ctx.beginPath(); ctx.arc(T.x, T.y, 13 + trigFlash * 7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(181,80,46,${(trigFlash * 0.5).toFixed(2)})`; ctx.stroke();
      }
      ctx.fillStyle = INK + "0.75)"; ctx.textAlign = "center";
      ctx.fillText("GATILHO", T.x, T.y + 34);
      // saidas
      for (let i = 0; i < 3; i++) {
        const o = O[i];
        flash[i] = Math.max(0, flash[i] - dt * 2.2);
        ctx.beginPath(); ctx.arc(o.x, o.y, 9 + flash[i] * 5, 0, Math.PI * 2);
        ctx.fillStyle = flash[i] > 0 ? COPPER : INK + "0.55)";
        ctx.fill();
        ctx.textAlign = "left";
        ctx.fillStyle = INK + "0.75)";
        ctx.fillText(o.cap, o.x + 20, o.y + 3);
        ctx.fillStyle = COPPER;
        ctx.fillText(String(counts[i]).padStart(3, "0"), o.x + 20, o.y + 17);
      }
      // pulsos
      for (const p of pulses) {
        if (p.kind === "in") {
          p.t += dt / dur;
          if (p.t >= 1) { p.done = true; trigFlash = 1; continue; }
          const q = bez(-8, p.y, T.x, T.y, p.t);
          ctx.beginPath(); ctx.arc(q.x, q.y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = INK + "0.8)"; ctx.fill();
        } else {
          p.t += dt / dur;
          if (p.t < 0) continue;
          if (p.t >= 1) { p.done = true; counts[p.idx] += 1; flash[p.idx] = 1; continue; }
          const o = O[p.idx];
          const q = bez(T.x, T.y, o.x, o.y, p.t);
          ctx.beginPath(); ctx.arc(q.x, q.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = COPPER; ctx.fill();
        }
      }
      pulses = pulses.filter((p) => !p.done);
      if (pulses.length === 0) {
        ctx.fillStyle = INK + "0.35)"; ctx.textAlign = "left";
        ctx.fillText("23:04 — cliente pergunta preço", 12, 24);
      }
    };

    const loop = (ts) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (!running) return;
      const dt = Math.min((ts - t0) / 1000, 0.05); t0 = ts;
      lastAuto += dt;
      if (lastAuto > 2.6) { lastAuto = 0; fire(); }
      drawFrame(dt);
    };

    resize();
    if (reduced) { drawStatic(); }
    else {
      const ro = new ResizeObserver(resize); ro.observe(wrap);
      const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; }, { rootMargin: "120px" });
      io.observe(wrap);
      const onClick = () => { if (running) { lastAuto = 0; fire(); } };
      canvas.addEventListener("pointerdown", onClick);
      t0 = performance.now(); raf = requestAnimationFrame(loop);
      return () => {
        alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        canvas.removeEventListener("pointerdown", onClick);
      };
    }
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);

  return (
    <figure ref={wrapRef} className="mf-sig" aria-label={alt || label} role="img">
      <canvas ref={canvasRef} className="mf-sig__canvas" />
      <figcaption className="mf-sig__cap">
        <span className="mf-sig__label">{label}</span>
        <span className="mf-sig__hint">
          {hint} <span className="mf-sig__count">{fired}</span>
        </span>
      </figcaption>
    </figure>
  );
}
