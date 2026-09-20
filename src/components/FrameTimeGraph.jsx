import React, { useEffect, useRef, useState } from "react";

/**
 * FrameTimeGraph → "REEL DE QUADROS" (Eduardo 19/09: contador de FPS
 * fora, algo disruptivo no lugar). A performance da página vira uma
 * TIRA DE FILME que avança um quadro por frame REAL renderizado:
 * a 60fps a tira corre lisa; puxe o drag pra injetar carga e ela
 * ENGAJA de verdade na sua frente — cada salto é um frame perdido,
 * medido, não encenado. Quadros que estouram a meta ganham marca de
 * cobre. Canvas 2D puro, zero dependências.
 */
const TARGET = 16.7;

export default function FrameTimeGraph() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [hud, setHud] = useState({ ms: 0, fps: 0, verdict: "" });

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
    let last = performance.now();
    let statAcc = 0,
      statFrames = 0;
    // injetor de carga: pressionar e arrastar soma trabalho real por quadro
    let load = 0; // 0..1
    let drag = null; // {x0, load0} | null

    /* REEL: a tira avança 1 célula por frame RENDERIZADO — 60fps =
       60 células/s (liso); frame lento = a tira desacelera na sua
       frente. Frames perdidos (>1.4x a meta) levam marca de cobre. */
    const CELL = 46;
    const STRIP_H = 72;
    let scrollX = 0;
    let frameIdx = 0;
    const lost = new Set();
    const hudRef = { ms: 0, fps: 0 };

    const cellArt = (i, x, yTop) => {
      // padrao unico por quadro: barras deterministicas (xorshift)
      let s = (i * 2654435761 + 1) >>> 0;
      for (let b = 0; b < 6; b++) {
        s ^= s << 13; s >>>= 0;
        s ^= s >>> 17; s ^= s << 5; s >>>= 0;
        const bx = x + 5 + ((s >>> 7) % (CELL - 10));
        const by = yTop + 14 + (s % 22);
        const bh = 7 + (s % 22);
        ctx.fillStyle = b === 0 ? "rgba(224,138,95,0.55)" : "rgba(242,238,230,0.16)";
        ctx.fillRect(bx, by, 2.5, bh);
      }
    };

    const draw = () => {
      ctx.fillStyle = "#16130f";
      ctx.fillRect(0, 0, W, H);
      const yTop = Math.max(12, Math.round((H - STRIP_H) / 2));
      const yB = yTop + STRIP_H;

      // HUD: meta a esquerda, medido a direita
      ctx.font = "10px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(224,138,95,0.75)";
      ctx.fillText("META 16,7MS · 60FPS", 12, yTop - 8);
      ctx.textAlign = "right";
      ctx.fillStyle = hudRef.ms ? "rgba(242,238,230,0.8)" : "rgba(242,238,230,0.35)";
      ctx.fillText(hudRef.ms ? hudRef.ms + " MS · " + hudRef.fps + " FPS" : "MEDINDO", W - 12, yTop - 8);

      // tira de filme: fundo e trilhos
      ctx.fillStyle = "rgba(242,238,230,0.045)";
      ctx.fillRect(0, yTop, W, STRIP_H);
      ctx.fillStyle = "rgba(242,238,230,0.4)";
      ctx.fillRect(0, yTop, W, 1);
      ctx.fillRect(0, yB - 1, W, 1);

      const first = Math.floor(scrollX / CELL) - 1;
      const count = Math.ceil(W / CELL) + 2;
      for (let k = 0; k < count; k++) {
        const idx = first + k;
        if (idx < 0) continue;
        const x = idx * CELL - scrollX;
        // separador de quadro
        ctx.fillStyle = "rgba(242,238,230,0.16)";
        ctx.fillRect(x, yTop + 1, 1, STRIP_H - 2);
        // perfuracoes (sprockets) do filme
        ctx.fillStyle = "#16130f";
        ctx.fillRect(x + 12, yTop + 3, 10, 6);
        ctx.fillRect(x + 12, yB - 9, 10, 6);
        ctx.strokeStyle = "rgba(242,238,230,0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 12.5, yTop + 3.5, 9, 5);
        ctx.strokeRect(x + 12.5, yB - 8.5, 9, 5);
        // conteudo do quadro (identidade unica)
        if (idx <= frameIdx) cellArt(idx, x, yTop);
        // frame PERDIDO: o gap que a tira deu, marcado em cobre
        if (lost.has(idx)) {
          ctx.fillStyle = "rgba(224,138,95,0.85)";
          ctx.fillRect(x + CELL - 3, yTop + 1, 2, STRIP_H - 2);
        }
      }

      // playhead: onde o proximo quadro entra
      ctx.fillStyle = "rgba(224,138,95,0.9)";
      ctx.fillRect(W - 2, yTop, 2, STRIP_H);

      // barra de carga injetada (canto inferior direito)
      if (load > 0.005) {
        const bw = 64;
        const bx = W - bw - 12;
        const by = H - 14;
        ctx.strokeStyle = "rgba(242,238,230,0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, 6);
        ctx.fillStyle = "rgba(224,138,95,0.9)";
        ctx.fillRect(bx + 1, by + 1, (bw - 2) * load, 4);
        ctx.fillStyle = "rgba(224,138,95,0.8)";
        ctx.font = "9px ui-monospace, monospace";
        ctx.textAlign = "left";
        ctx.fillText(Math.round(load * 100) + "% CARGA", bx, by - 3);
      }
    };

    const burn = (ms) => {
      // ~1ms de trabalho por unidade: soma, multiplica e descarta
      const iters = Math.floor(ms * 9000);
      let acc = 0;
      for (let i = 0; i < iters; i++) acc += Math.sqrt(i);
      return acc;
    };

    const frame = (now) => {
      if (!alive) return;
      // decai devagar quando nao esta sendo arrastado
      if (!drag) load *= 0.985;
      if (running && load > 0.005) burn(load * 18);
      const dt = now - last;
      last = now;
      if (running && dt > 0 && dt < 400) {
        // quadro RENDERIZADO: a tira avanca uma celula
        if (dt > TARGET * 1.4) lost.add(frameIdx);
        frameIdx++;
        scrollX += CELL;
        if (lost.size > 240) lost.delete(frameIdx - 300);
        statAcc += dt;
        statFrames++;
        if (statAcc >= 400) {
          const avg = statAcc / statFrames;
          const fps = Math.round(1000 / avg);
          const verdict =
            fps >= 55 ? "✓ liso a 60fps"
            : fps >= 40 ? "segura bem"
            : "a tira esta engasgando — solte o drag";
          hudRef.ms = Math.min(99, Math.round(avg * 10) / 10);
          hudRef.fps = fps;
          setHud({ ms: hudRef.ms, fps, verdict });
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

    const onDown = (e) => {
      canvas.setPointerCapture?.(e.pointerId);
      drag = { x0: e.clientX, load0: load };
    };
    const onMove = (e) => {
      if (!drag) return;
      const dx = (e.clientX - drag.x0) / 180; // 180px = carga cheia
      load = Math.min(1, Math.max(0, drag.load0 + dx));
    };
    const onUp = () => { drag = null; };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.style.touchAction = "none"; // o drag e do painel, nao da pagina

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <figure ref={wrapRef} className="mf-tf mf-tf--half" aria-label="Real frame time, live" style={{ cursor: "ew-resize" }}>
      <canvas ref={canvasRef} />
      <figcaption className="mf-tf__hud" aria-hidden="true">
        <span>{hud.ms > 0 ? `${hud.ms} ms/frame` : "—"}</span>
        <span>{hud.fps > 0 ? `${hud.fps} fps` : "medindo"}</span>
        <span>{hud.verdict || "puxe o drag → injeta carga"}</span>
      </figcaption>
    </figure>
  );
}
