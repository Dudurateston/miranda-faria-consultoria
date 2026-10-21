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
    let samples = new Array(N).fill(TARGET);
    let last = performance.now();
    let statAcc = 0,
      statFrames = 0;
    // injetor de carga: pressionar e arrastar soma trabalho real por quadro
    let load = 0; // 0..1
    let drag = null; // {x0, load0} | null

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

      // barra de carga injetada (canto inferior direito) com leitura
      if (load > 0.005) {
        const bw = 64;
        const bx = W - bw - 12;
        const by = H - 20;
        ctx.strokeStyle = "rgba(242,238,230,0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, 6);
        ctx.fillStyle = "rgba(224,138,95,0.9)";
        ctx.fillRect(bx + 1, by + 1, (bw - 2) * load, 4);
        ctx.fillStyle = "rgba(224,138,95,0.8)";
        ctx.font = "9px ui-monospace, monospace";
        ctx.textAlign = "left";
        ctx.fillText(Math.round(load * 100) + "%", bx, by - 3);
      }
      // rotulo do eixo
      ctx.fillStyle = "rgba(242,238,230,0.35)";
      ctx.fillText("now →", W - 46, H - 8);
      ctx.fillText("frame time (ms)", 12, H - 8);
      if (sink < 0) samples[0] = sink; // guarda: sink depende do burn real
    };

    /* CARGA REAL (21/10, Eduardo: "quebre os 60fps" inoperante):
       o multiplicador fixo de 9000 iteracoes custava ~0,03ms por unidade —
       arrastar a 100% somava menos de 1ms por quadro em qualquer aparelho
       moderno e o grafico nunca saia de 60fps. Agora o aparelho e MEDIDO no
       montar (uma amostra de sqrt, ~2-4ms, uma unica vez) e o burn injeta
       milissegundos REAIS, com orcamento por quadro (BUDGET_MS) para nunca
       travar a pagina. A queima so acontece DURANTE a interacao (drag ou
       tecla segurada); ao soltar, a carga decai e o grafico mostra a
       recuperacao do aparelho. */
    /* CARGA REAL v2 (21/10, revisão Codex): laço com DEADLINE de relógio.
       A versão anterior convertia ms→iterações numa calibração de amostra
       única; JIT pode distorir essa medida e o teto ficava teórico (BUDGET_MS
       limitava iters, não tempo decorrido). Aqui o teto é o PRÓPRIO RELÓGIO:
       performance.now() na condição do laço é leitura observável — não há
       calibração a enganar nem contagem de iters a se fiar. Blocos pequenos
       (2048 iters) checam o relógio; no máx. FRAME_BUDGET_MS reais por quadro,
       e a queima só acontece durante interação. (Hipótese aberta, sem prova:
       a versão com iters poderia estar sendo eliminada por dead-code.) */
    const FRAME_BUDGET_MS = 22; // teto REAL de trabalho injetado por quadro
    let sink = 0;
    const burnUntil = (msBudget) => {
      const deadline = performance.now() + Math.min(msBudget, FRAME_BUDGET_MS);
      let acc = 0;
      let i = 0;
      while (performance.now() < deadline) {
        for (let k = 0; k < 2048; k++, i++) acc += Math.sqrt(i);
      }
      sink = (sink + acc) % 1e9; // consumido no draw — sobra de segurança
    };

    const frame = (now) => {
      if (!alive) return;
      const t0 = performance.now();
      // ao soltar: a carga cai e o grafico mostra a recuperacao real
      if (!drag && !keyHeld) load *= 0.94;
      // queima SOMENTE durante interacao — teto real por relógio
      if (running && (drag || keyHeld) && load > 0.005) burnUntil(load * FRAME_BUDGET_MS);
      const dt = now - last;
      last = now;
      if (running && dt > 0 && dt < 400) {
        samples.push(dt);
        if (samples.length > N) samples.shift();
        statAcc += dt;
        statFrames++;
        if (statAcc >= 400) {
          const avg = statAcc / statFrames;
          const fps = Math.round(1000 / avg);
          const verdict =
            fps >= 55 ? "✓ seu aparelho segura 60fps"
            : fps >= 40 ? "seu aparelho segura bem"
            : "seu aparelho sofre — solte o drag";
          setHud({ ms: Math.min(99, Math.round(avg * 10) / 10), fps, verdict });
          statAcc = 0;
          statFrames = 0;
        }
        void t0;
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
        if (!running) clearInteraction(); // fora da viewport: nada queima
      },
      { threshold: 0.1 }
    );
    io.observe(wrap);

    let keyHeld = false;
    /* Limpeza completa: qualquer saída da interação (blur do canvas,
       aba oculta, captura de ponteiro perdida, painel fora da viewport)
       zera drag/keyHeld/load — nada de continuar queimando após Alt-Tab
       ou soltura fora do alvo. */
    const clearInteraction = () => { drag = null; keyHeld = false; load = 0; };
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
    const onKey = (e) => {
      const step = e.key === "ArrowUp" || e.key === "ArrowRight" ? 0.07
        : e.key === "ArrowDown" || e.key === "ArrowLeft" ? -0.07 : 0;
      if (step === 0) return;
      if (reduced) return; // reduced-motion: estado estático, sem carga injetada
      e.preventDefault();
      keyHeld = true;
      load = Math.min(1, Math.max(0, load + step));
    };
    const onKeyUp = () => { keyHeld = false; };
    const onVisibility = () => { if (document.hidden) clearInteraction(); };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("keydown", onKey);
    canvas.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("blur", clearInteraction);
    canvas.addEventListener("lostpointercapture", clearInteraction);
    document.addEventListener("visibilitychange", onVisibility);
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
      canvas.removeEventListener("keydown", onKey);
      canvas.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("blur", clearInteraction);
      canvas.removeEventListener("lostpointercapture", clearInteraction);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <figure ref={wrapRef} className="mf-tf mf-tf--half" aria-label="Real frame time, live" style={{ cursor: "ew-resize" }}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="img"
        aria-label="Grafico do tempo de cada quadro. Pressione e arraste, ou use as setas do teclado, para injetar carga real e quebrar os 60fps."
        className="mf-tf__canvas"
      />
      <figcaption className="mf-tf__hud" aria-hidden="true">
        <span>{hud.ms > 0 ? `${hud.ms} ms/frame` : "—"}</span>
        <span>{hud.fps > 0 ? `${hud.fps} fps` : "measuring"}</span>
        <span>{hud.verdict || "drag → load"}</span>
      </figcaption>
    </figure>
  );
}
