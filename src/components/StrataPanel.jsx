import React, { useEffect, useRef } from "react";

/**
 * Strata — corte geologico interativo. Camadas horizontais que
 * respondem ao cursor: quem passa por cima desloca a seam de cobre e
 * as linhas cedem lugar, como um instrumento de medida lendo o solo.
 * Canvas 2D cru, pausa fora da viewport, estatico em reduced-motion.
 */
export default function StrataPanel() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // semente deterministica: as camadas nao mudam a cada resize
    const rand = (i, s) => {
      const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    // camadas: {y rel, alpha, espessura, cobre}
    const LAYERS = [];
    for (let i = 0; i < 16; i++) {
      const r = rand(i, 1);
      LAYERS.push({
        y: 0.06 + (i / 15) * 0.88 + (r - 0.5) * 0.012,
        a: 0.08 + rand(i, 2) * 0.2,
        w: r > 0.82 ? 2 : 1,
      });
    }
    const copper = { y: 0.42 + rand(3, 4) * 0.3 };

    let W = 0, H = 0, dpr = 1;
    let mouse = { x: -1, y: -1, on: false };
    let mx = 0, my = 0; // suavizados
    let raf = 0, visible = false, t = 0;

    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      draw(0, null);
    };

    const draw = (time, m) => {
      ctx.clearRect(0, 0, W, H);
      const bump = (ly) => {
        if (!m || !m.on) return 0;
        const d = Math.abs(ly * H - m.y);
        const f = Math.max(0, 1 - d / 130);
        return Math.sin(f * Math.PI) * f * 26; // deslocamento horizontal
      };
      // faixas de sedimento muito sutis
      for (let i = 0; i < 3; i++) {
        const yy = rand(i, 9) * H;
        const hh = 14 + rand(i, 10) * 30;
        ctx.fillStyle = "rgba(242,238,230,0.028)";
        ctx.fillRect(0, yy, W, hh);
      }
      // camadas
      LAYERS.forEach((l) => {
        const dx = bump(l.y);
        const y = l.y * H;
        ctx.fillStyle = `rgba(242,238,230,${l.a})`;
        ctx.fillRect(dx * 0.4, y, W * 0.06, l.w);
        ctx.fillRect(dx * 0.55 + W * 0.14, y, W * 0.1, l.w);
        ctx.fillRect(dx * 0.75 + W * 0.34, y, W * 0.22, l.w);
        ctx.fillRect(dx * 0.6 + W * 0.66, y, W * 0.2, l.w);
      });
      // seam de cobre — brilha perto do cursor
      const cy = copper.y * H;
      const cdx = bump(copper.y);
      let glow = 0;
      if (m && m.on) {
        const d = Math.abs(cy - m.y);
        glow = Math.max(0, 1 - d / 160);
      }
      ctx.fillStyle = `rgba(184,115,51,${0.5 + glow * 0.5})`;
      ctx.shadowColor = "rgba(184,115,51,0.55)";
      ctx.shadowBlur = 6 + glow * 18;
      ctx.fillRect(cdx * 0.5 + W * 0.08, cy, W * 0.84, 2);
      ctx.shadowBlur = 0;
      // varredura lenta (leitura do instrumento)
      if (time) {
        const p = ((time / 9000) % 1);
        const sx = p * W;
        const grad = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0);
        grad.addColorStop(0, "rgba(242,238,230,0)");
        grad.addColorStop(0.5, "rgba(242,238,230,0.05)");
        grad.addColorStop(1, "rgba(242,238,230,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(sx - 60, 0, 120, H);
      }
    };

    const tick = (ts) => {
      // lerp do cursor
      mx += ((mouse.on ? mouse.x : -1) - mx) * 0.12;
      my += ((mouse.on ? mouse.y : my) - my) * 0.14;
      t = ts;
      draw(t, { x: mx, y: my, on: mouse.on || my > 0 });
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const r = cv.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top, on: true };
    };
    const onLeave = () => { mouse.on = false; };

    resize();
    if (rm) {
      drawStatic();
    } else {
      const io = new IntersectionObserver(
        (es) => {
          es.forEach((en) => {
            visible = en.isIntersecting;
            if (visible && !raf) raf = requestAnimationFrame(tick);
            if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
          });
        },
        { threshold: 0.05 }
      );
      io.observe(cv);
      cv.addEventListener("pointermove", onMove);
      cv.addEventListener("pointerleave", onLeave);
    }
    const ro = new ResizeObserver(() => {
      resize();
      if (rm) drawStatic();
    });
    ro.observe(cv);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      if (io) io.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="mf-strata__cv" aria-hidden="true" />;
}
