import React, { useEffect, useRef, useState } from "react";

/**
 * FrameTimeGraph — terceira prova viva da aba Tecnologia.
 *
 * O tempo real de cada quadro desta página, medido no rAF e plotado
 * ao vivo — performance é medida, não prometida. A linha de 16,7 ms
 * é a meta de 60 fps; picos acima dela são o seu navegador dando
 * conta (ou não) da página inteira. Canvas 2D puro, zero dependências.
 *
 * Interação (3ª rodada, 21/10, revisão Codex):
 * - CARGA REAL: laço com deadline de relógio (performance.now() na
 *   condição — observável, sem calibração de iterações que o JIT possa
 *   torrar). Teto REAL de FRAME_BUDGET_MS por quadro; queima somente
 *   durante interação; ao soltar, a carga decai e o gráfico mostra a
 *   recuperação do aparelho.
 * - Teclado: range nativo escondido (semântica de slider); as setas
 *   mudam o valor e segurar a tecla mantém a queima.
 * - Limpeza por modalidade: blur/keyup limpam teclado; lostpointercapture
 *   limpa ponteiro; blur do input NÃO mata um drag ativo (o ponteiro não
 *   depende de foco). visibilitychange e saída da viewport limpam tudo —
 *   nada de continuar queimando após Alt-Tab ou soltura fora.
 * - reduced-motion: sem loop, controle desabilitado — estado estático,
 *   sem carga injetada.
 */

const N = 96; // quadros no grafico (1,6s de historia a 60fps)
const TARGET = 16.7;

export default function FrameTimeGraph() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const [hud, setHud] = useState({ ms: 0, fps: 0, verdict: "" });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const input = inputRef.current;
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
    let load = 0; // 0..1
    let drag = null; // {x0, load0} | null
    let keyHeld = false;
    let sink = 0; // resultado do burn consumido no draw (segurança)

    const Y_MAX = 40; // ms no topo do grafico
    const FRAME_BUDGET_MS = 22; // teto REAL de trabalho injetado por quadro

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

    /* CARGA REAL — laço com DEADLINE de relógio: o teto é o próprio
       performance.now(), leitura observável que não há como otimizar
       fora. Blocos pequenos (2048 iters) para check frequente do prazo. */
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
      // ao soltar: a carga cai e o grafico mostra a recuperacao real
      if (!drag && !keyHeld) load *= 0.94;
      if (input && document.activeElement !== input) {
        input.value = String(Math.round(load * 100));
      }
      // queima SOMENTE durante interacao — teto real por relógio
      if (running && (drag || keyHeld) && load > 0.005) {
        burnUntil(load * FRAME_BUDGET_MS);
      }
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
            : "A carga aumentou. Solte o arrasto.";
          setHud({ ms: Math.min(99, Math.round(avg * 10) / 10), fps, verdict });
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

    /* limpeza: interação por modalidade (o blur do input ao clicar no
       canvas NÃO pode matar um drag ativo — ponteiro não depende de
       foco); saídas de contexto (aba oculta, fora da viewport) limpam
       tudo — nada de queimar após Alt-Tab ou soltura fora do alvo. */
    const clearInteraction = () => { drag = null; keyHeld = false; load = 0; };
    const clearKey = () => { keyHeld = false; if (!drag) load = 0; };
    const clearPtr = () => { drag = null; if (!keyHeld) load = 0; };

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
    const onInput = () => {
      load = Math.min(1, Math.max(0, Number(input.value) / 100));
    };
    const onKeyDown = (e) => { if (e.key.startsWith("Arrow")) keyHeld = true; };
    const onKeyUp = () => { keyHeld = false; };
    const onVisibility = () => { if (document.hidden) clearInteraction(); };

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? false;
        last = performance.now();
        if (!running) clearInteraction(); // fora da viewport: nada queima
      },
      { threshold: 0.1 }
    );
    io.observe(wrap);

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("lostpointercapture", clearPtr);
    document.addEventListener("visibilitychange", onVisibility);
    if (input) {
      input.addEventListener("input", onInput);
      input.addEventListener("keydown", onKeyDown);
      input.addEventListener("keyup", onKeyUp);
      input.addEventListener("blur", clearKey);
    }
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
      canvas.removeEventListener("lostpointercapture", clearPtr);
      document.removeEventListener("visibilitychange", onVisibility);
      if (input) {
        input.removeEventListener("input", onInput);
        input.removeEventListener("keydown", onKeyDown);
        input.removeEventListener("keyup", onKeyUp);
        input.removeEventListener("blur", clearKey);
      }
    };
  }, []);

  /* Acessibilidade: o canvas é só o visual; o teclado vive num range
     nativo escondido (semântica real de slider, anel de foco na figure
     via :focus-within). reduced-motion: controle desabilitado. */
  const lang = (typeof document !== "undefined" && document.documentElement.lang || "pt").slice(0, 2).toLowerCase();
  const reducedRender = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const loadLabel = lang === "pt"
    ? "Controle de carga do grafico de tempo de quadro: as setas injetam trabalho real e derrubam os 60fps; ao soltar, o grafico mostra a recuperacao do aparelho."
    : "Load control for the frame-time graph: arrow keys inject real work and drop the app below 60fps; on release, the graph shows the device recovering.";

  return (
    <figure ref={wrapRef} className="mf-tf mf-tf--half" aria-label="Real frame time, live" style={{ cursor: "ew-resize" }}>
      <canvas ref={canvasRef} className="mf-tf__canvas" aria-hidden="true" />
      <input
        ref={inputRef}
        type="range"
        min="0"
        max="100"
        step="5"
        defaultValue="0"
        disabled={reducedRender}
        aria-label={loadLabel}
        className="mf-tf__load-input"
      />
      <figcaption className="mf-tf__hud" aria-hidden="true">
        <span>{hud.ms > 0 ? `${hud.ms} ms/frame` : "…"}</span>
        <span>{hud.fps > 0 ? `${hud.fps} fps` : "measuring"}</span>
        <span>{hud.verdict || "drag → load"}</span>
      </figcaption>
    </figure>
  );
}

