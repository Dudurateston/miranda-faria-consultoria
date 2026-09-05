import React, { useEffect, useRef } from "react";

/**
 * LedgerFlow — a assinatura visual da vertical de Gestao.
 *
 * A tese da pagina animada: "Planilha e memoria. Sistema e decisao."
 * Uma grade de celulas guarda pontos de dados anotados (a planilha,
 * o passado). De tempos em tempos — e ao toque do visitante — uma
 * decisao nasce numa celula e se propaga sozinha pela estrutura, ate
 * acumular na coluna da direita: o painel que o dono le.
 *
 * Canvas 2D puro, zero dependencias, pausa fora da viewport.
 */
export default function LedgerFlow({ label, hint, alt }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const COPPER = "166, 72, 31";
    const INK = "26, 26, 24";

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), raf = 0, alive = true, running = false;
    let cw = 34, cols = 0, rows = 0, cells = [], cascades = [], panel = 0, lastAuto = 0, lastPtr = 0;
    const ptr = { c: -1, r: -1 };

    // pseudo-aleatorio deterministico: a mesma celula sempre "tem" ou
    // "nao tem" dado, mesmo depois de resize — a planilha nao reescreve
    // o passado quando voce muda de janela.
    const rnd = (c, r) => {
      const x = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cw = Math.max(28, Math.min(46, Math.round(W / 26)));
      cols = Math.floor((W - cw * 2.4) / cw);
      rows = Math.floor(H / cw);
      const padX = Math.max(cw, (W - cw * 2.4 - cols * cw) / 2); // painel reserva a direita
      cells = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          cells.push({ c, r, x: padX + c * cw, y: r * cw + cw / 2, data: rnd(c, r) < 0.3, heat: 0, resid: 0 });
      panel = Math.min(1, panel);
    };

    // A decisao percorre a estrutura: para cada celula alcancada,
    // guarda em quantos "hops" ela acorda. A onda e a planilha
    // deixando de ser passado.
    const ignite = (src) => {
      const wave = new Map();
      const q = [[src.c, src.r, 0]];
      const seen = new Set([src.r * cols + src.c]);
      while (q.length) {
        const [c, r, d] = q.shift();
        wave.set(r * cols + c, d);
        if (d >= 7) continue;
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nc = c + dc, nr = r + dr, k = nr * cols + nc;
          if (nc < 0 || nr < 0 || nc >= cols || nr >= rows || seen.has(k)) continue;
          seen.add(k); q.push([nc, nr, d + 1]);
        }
      }
      cascades.push({ wave, t0: performance.now(), hops: 8, done: false });
    };

    const auto = (t) => {
      if (t - lastAuto < 4200) return;
      const pool = cells.filter((c) => c.data);
      if (!pool.length) return;
      lastAuto = t; ignite(pool[Math.floor(Math.random() * pool.length)]);
    };

    const step = (t) => {
      // propaga cada cascata conforme os hops
      for (const ca of cascades) {
        const el = t - ca.t0;
        for (const [k, d] of ca.wave) {
          const at = d * 46;
          if (el >= at && el < at + 90) {
            const cell = cells[k];
            if (cell) { cell.heat = Math.max(cell.heat, cell.data ? 1 : 0.45); cell.resid = Math.max(cell.resid, cell.data ? 1 : 0.25); }
          }
        }
        if (!ca.done && el > 8 * 46 + 120) { ca.done = true; panel = Math.min(1, panel + 0.16); if (panel >= 0.999) panel = 0; }
      }
      cascades = cascades.filter((c) => t - c.t0 < 2000);
      for (const cell of cells) { cell.heat *= 0.94; cell.resid *= 0.996; }
      if (!reduced) auto(t);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // grade — o caderno
      ctx.strokeStyle = `rgba(${INK},0.05)`; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let r = 1; r < rows; r++) { const y = r * cw; ctx.moveTo(cells[0]?.x ?? 0, y); ctx.lineTo(W, y); }
      const first = cells[0]?.x ?? 0;
      for (let c = 0; c <= cols; c++) { const x = first + c * cw; ctx.moveTo(x, 0); ctx.lineTo(x, rows * cw); }
      ctx.stroke();
      // painel — a coluna que o dono le (a direita: dado acumula em decisao)
      const px = first + cols * cw + cw * 0.55;
      ctx.strokeStyle = `rgba(${COPPER},0.35)`; ctx.beginPath(); ctx.moveTo(px + cw * 0.5, cw * 0.6); ctx.lineTo(px + cw * 0.5, H - cw * 0.6); ctx.stroke();
      ctx.fillStyle = `rgba(${COPPER},${0.12 + panel * 0.06})`;
      const bh = (H - cw * 1.2) * panel;
      ctx.fillRect(px, H - cw * 0.6 - bh, cw * 0.9, bh);
      ctx.fillStyle = `rgba(${COPPER},${panel > 0.99 ? 0.9 : 0.5})`;
      ctx.fillRect(px, H - cw * 0.6 - bh - 1.5, cw * 0.9, 1.5);
      // celulas — dados anotados e decisoes
      for (const cell of cells) {
        if (cell.resid > 0.02) { ctx.fillStyle = `rgba(${COPPER},${0.1 * cell.resid})`; ctx.beginPath(); ctx.arc(cell.x, cell.y, 3.4, 0, 7); ctx.fill(); }
        if (cell.data) { ctx.fillStyle = `rgba(${INK},0.17)`; ctx.beginPath(); ctx.arc(cell.x, cell.y, 1.7, 0, 7); ctx.fill(); }
        if (cell.heat > 0.02) {
          ctx.fillStyle = `rgba(${COPPER},${Math.min(1, cell.heat)})`;
          ctx.beginPath(); ctx.arc(cell.x, cell.y, 1.7 + cell.heat * 3.6, 0, 7); ctx.fill();
          if (cell.heat > 0.5) { ctx.fillStyle = `rgba(${COPPER},${(cell.heat - 0.5) * 0.5})`; ctx.beginPath(); ctx.arc(cell.x, cell.y, 6 + cell.heat * 7, 0, 7); ctx.fill(); }
        }
      }
    };

    const frame = (t) => {
      if (!alive) return;
      if (running) { step(t); draw(); }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const first = cells[0]?.x ?? 0;
      const c = Math.floor((x - first) / cw), r = Math.floor(y / cw);
      const t = performance.now();
      if (c >= 0 && c < cols && r >= 0 && r < rows && t - lastPtr > 750) {
        const cell = cells[r * cols + c];
        if (cell && cell.data) { lastPtr = t; ignite(cell); }
      }
    };
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const first = cells[0]?.x ?? 0;
      const c = Math.floor((x - first) / cw), r = Math.floor(y / cw);
      let cell = (c >= 0 && c < cols && r >= 0 && r < rows) ? cells[r * cols + c] : null;
      if (!cell) cell = cells[Math.floor(Math.random() * cells.length)];
      if (cell) ignite(cell);
    };

    const ro = new ResizeObserver(() => { build(); draw(); });
    ro.observe(wrap);
    const io = new IntersectionObserver(
      (es) => { es.forEach((en) => { running = en.isIntersecting; if (running && reduced) draw(); }); },
      { threshold: 0.05 }
    );
    io.observe(wrap);
    build();
    if (reduced) { ignite(cells[Math.floor(cells.length / 2)]); draw(); } else { running = true; lastAuto = performance.now() + 1200; raf = requestAnimationFrame(frame); }
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onClick);

    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, []);

  return (
    <figure ref={wrapRef} className="mf-sig" aria-label={alt || label} role="img">
      <canvas ref={canvasRef} className="mf-sig__canvas" />
      <figcaption className="mf-sig__cap">
        <span className="mf-sig__label">{label}</span>
        <span className="mf-sig__hint">{hint}</span>
      </figcaption>
    </figure>
  );
}
