import React, { useEffect, useRef, useState } from "react";

/**
 * TerraformCanvas — a demonstracao que roda na aba Tecnologia.
 *
 * Campo de fluxo (flow field) em Canvas 2D puro: zero Three.js, zero
 * GSAP, zero dependencia. As particulas seguem um campo vetorial
 * calculado por camadas de seno/cosseno; o cursor do visitante entra
 * como vortice local. Telemetria real no canto — FPS medido, nao
 * promessa de marketing.
 */
export default function TerraformCanvas() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [hud, setHud] = useState({ fps: 60, n: 0 });

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
    const mouse = { x: -9999, y: -9999, on: false };
    // cliques/toques viram ondas: empurrao radial que decai em ~0.9s
    const pulses = [];
    let parts = [];
    let fps = 60;
    let last = performance.now();
    let frames = 0;
    let acc = 0;

    const field = (x, y, t) => {
      const a =
        Math.sin(x * 0.004 + t * 0.28) +
        Math.cos(y * 0.0035 - t * 0.22) +
        Math.sin((x + y) * 0.0016 + t * 0.11) * 1.35;
      return a * 1.9;
    };

    const spawn = () => {
      const count = Math.min(760, Math.max(240, Math.floor(W / 2.1)));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        life: Math.random() * 240,
        hue: Math.random() < 0.055, // poucas particulas em cobre
        sp: 0.7 + Math.random() * 0.7,
      }));
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
      ctx.fillStyle = "#16130f";
      ctx.fillRect(0, 0, W, H);
      spawn();
      setHud((h) => ({ ...h, n: parts.length }));
    };

    const frame = (now) => {
      if (!alive) return;
      while (pulses.length && now - pulses[0].t > 950) pulses.shift();
      if (running) {
        acc += now - last;
        frames++;
        if (acc >= 500) {
          fps = Math.round((frames * 1000) / acc);
          acc = 0;
          frames = 0;
          setHud({ fps, n: parts.length });
        }
        const t = now * 0.001;
        // rastro: fill translucido escurece o quadro anterior
        ctx.fillStyle = "rgba(22,19,15,0.075)";
        ctx.fillRect(0, 0, W, H);
        for (const p of parts) {
          const a = field(p.x, p.y, t);
          let vx = Math.cos(a) * p.sp;
          let vy = Math.sin(a) * p.sp;
          for (const pu of pulses) {
            const pdx = p.x - pu.x;
            const pdy = p.y - pu.y;
            const pd = Math.sqrt(pdx * pdx + pdy * pdy) || 1;
            const age = (now - pu.t) / 900;
            if (age < 1) {
              const f = (1 - age) * 340 / (pd + 24);
              vx += (pdx / pd) * f;
              vy += (pdy / pd) * f;
            }
          }
          if (mouse.on) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 26244) {
              // vortice do cursor: empurra aorbitando, nao so pra fora
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / 162) * 1.9;
              vx += (-dy / d) * f + (dx / d) * f * 0.25;
              vy += (dx / d) * f + (dy / d) * f * 0.25;
            }
          }
          const nx = p.x + vx;
          const ny = p.y + vy;
          if (nx < 0 || nx > W || ny < 0 || ny > H || p.life <= 0) {
            p.x = Math.random() * W;
            p.y = Math.random() * H;
            p.life = 120 + Math.random() * 240;
            continue;
          }
          ctx.strokeStyle = p.hue
            ? "rgba(179,122,96,0.85)"
            : "rgba(242,238,230,0.30)";
          ctx.lineWidth = p.hue ? 1.4 : 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          p.x = nx;
          p.y = ny;
          p.life -= 1;
        }
      }
      last = now;
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? false;
        last = performance.now();
      },
      { threshold: 0.1 }
    );
    io.observe(wrap);

    const onDown = (e) => {
      const r = canvas.getBoundingClientRect();
      pulses.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
    };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
      mouse.x = mouse.y = -9999;
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerleave", onLeave);

    if (reduced) {
      // sem animacao: desenha um estatico honesto em vez de fingir 60fps
      const t = 12.3;
      ctx.fillStyle = "#16130f";
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const a = field(x, y, t);
        ctx.strokeStyle = "rgba(242,238,230,0.14)";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9);
        ctx.stroke();
      }
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <figure ref={wrapRef} className="mf-tf" aria-label="Interactive particle field, pure canvas">
      <canvas ref={canvasRef} />
      <figcaption className="mf-tf__hud" aria-hidden="true">
        <span>{hud.fps} FPS</span>
        <span>{hud.n} particles · click = wave</span>
        <span>Canvas 2D · 0 dependencies</span>
      </figcaption>
    </figure>
  );
}
