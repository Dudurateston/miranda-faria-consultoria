import React, { useEffect, useRef } from "react";

/**
 * O TERRENO — o elemento vivo da abertura.
 *
 * A ideia, em uma frase: o solo esta sempre ali, quase invisivel, e a
 * profundidade so aparece onde alguem olha. Sozinho, de tempos em
 * tempos, um traco de cobre atravessa a tela e revela as camadas por
 * onde passa — uma linha de sondagem. Com o mouse ou o dedo, o
 * visitante faz a mesma leitura na mao, e descobre que pode.
 *
 * POR QUE ESTE GESTO, e nao mais um objeto gerado em codigo: as duas
 * tentativas anteriores puseram a forma gerada como protagonista e as
 * duas foram rejeitadas. Aqui a tipografia e a protagonista e o terreno
 * e atmosfera — ele vive embaixo do texto, na metade de baixo da tela,
 * como o chao abaixo de uma linha de horizonte. Se o efeito nao
 * agradar, a pagina continua de pe; se agradar, ela ganha vida sem
 * nunca ter dependido dele.
 *
 * POR QUE NAO E "reativo ao cursor" no sentido ja rejeitado: nada segue
 * o ponteiro e nada se inclina. O ponteiro nao MOVE o desenho — ele
 * REVELA o que ja estava la. A mecanica e outra, e funciona igual no
 * toque, onde paralaxe e tilt simplesmente nao existem.
 *
 * Regras de seguranca (CLAUDE.md), todas cumpridas aqui:
 * - Zero imagem externa: as camadas sao geradas em codigo. Nada para
 *   carregar, nada para dar CORS, nitido em qualquer resolucao.
 * - Pausa fora da viewport via IntersectionObserver.
 * - `prefers-reduced-motion`: desenha um quadro parado e nao abre laco.
 * - Um unico requestAnimationFrame.
 * - Teto de resolucao por area de tela, e densidade menor no celular.
 *
 * A INTENSIDADE e um preset, nao um numero solto no meio do codigo. O
 * terreno esta discreto de proposito — o cliente rejeitou duas vezes um
 * elemento gerado que virou protagonista —, mas "discreto demais" e
 * "forte demais" so se decidem vendo rodar. Os presets existem para
 * essa escolha ser feita com o site na frente, em /lab, e nao no
 * escuro. `discreto` e o que esta no ar; trocar o padrao daqui muda a
 * home inteira de uma vez.
 */
export const INTENSIDADES = {
  // repouso, pico, intervalo entre sondagens (ms), meio-raio do halo (px)
  discreto: { base: 0.13, pico: 0.86, esperaMin: 7000, esperaVar: 12000, halo: 190 },
  medio:    { base: 0.22, pico: 0.95, esperaMin: 4500, esperaVar: 6500,  halo: 250 },
  forte:    { base: 0.34, pico: 1.00, esperaMin: 2800, esperaVar: 3800,  halo: 320 },
};

export default function StrataField({ intensidade = "discreto" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Ruido determinista: o mesmo terreno em todo carregamento. Um solo
    // que muda de forma a cada visita nao e um lugar, e um chuvisco.
    let seed = 20260901;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    let w = 0, h = 0, dpr = 1;
    let ground = null;      // canvas fora de tela com as camadas em contraste cheio
    let layer = null;       // canvas de trabalho onde a revelacao e mascarada
    let reveal = [];        // quanto cada amostra esta revelada, 0..1
    // Amostras LARGAS de proposito. A primeira versao revelava em colunas
    // de 12px desenhadas uma a uma, e o resultado tinha borda vertical
    // dura em cada coluna: lia como glitch de listras, cortando ao
    // contrario da estratigrafia, que e horizontal. Agora as amostras
    // viram paradas de um gradiente horizontal usado como mascara, entao
    // a revelacao interpola sozinha e nao existe borda nenhuma.
    const SAMPLES = 40;

    const preset = INTENSIDADES[intensidade] ?? INTENSIDADES.discreto;
    const BASE = preset.base;   // presenca do terreno em repouso: um sussurro
    const PEAK = preset.pico;   // presenca onde a leitura passa

    /** Desenha as camadas uma vez, em contraste cheio, fora da tela. */
    const buildGround = () => {
      ground = document.createElement("canvas");
      ground.width = Math.round(w * dpr);
      ground.height = Math.round(h * dpr);
      const g = ground.getContext("2d");
      g.scale(dpr, dpr);

      seed = 20260901;

      // Como um corte de arquitetura desenha terreno: cada camada tem um
      // FIO no topo e um preenchimento por baixo. A primeira versao usava
      // so preenchimento suave e o resultado lia como nevoa cinza, nao
      // como sedimento — faltava a linha. Aqui a linha e o desenho e o
      // preenchimento e a materia.
      let y = 0;
      let band = 0;
      while (y < h) {
        const depth = Math.min(y / h, 1);
        // Camadas comprimem com a profundidade, como sedimento de verdade.
        const bandH = (h * 0.17) * (1 - depth * 0.66) * (0.6 + rnd() * 0.85);

        // Tom: pedra na superficie, grafite na fundacao. Sempre MAIS
        // ESCURO que o osso — chao nao e mais claro que o ceu.
        const k = depth * depth;
        const tone = Math.round(150 - k * 118);
        const alpha = 0.30 + depth * 0.46;

        // A face de cima ondula: terreno nao tem regua.
        const top = [];
        const steps = 12;
        for (let i = 0; i <= steps; i++) {
          top.push([(w / steps) * i, y + (rnd() - 0.5) * bandH * 0.26]);
        }

        const fill = (yOff, style) => {
          g.beginPath();
          g.moveTo(0, top[0][1] + yOff);
          for (const [px, py] of top) g.lineTo(px, py + yOff);
          g.lineTo(w, y + bandH);
          g.lineTo(0, y + bandH);
          g.closePath();
          g.fillStyle = style;
          g.fill();
        };

        fill(0, `rgba(${tone},${tone - 4},${tone - 10},${alpha})`);

        // O fio de contorno da camada.
        g.beginPath();
        g.moveTo(top[0][0], top[0][1]);
        for (const [px, py] of top) g.lineTo(px, py);
        g.strokeStyle = `rgba(26,26,24,${0.20 + depth * 0.34})`;
        g.lineWidth = 0.9;
        g.stroke();

        // Grao de sedimento, mais denso embaixo. Menos no celular.
        const grains = Math.round((w / 1440) * 210 * (w < 700 ? 0.4 : 1) * (0.3 + depth));
        g.fillStyle = `rgba(26,26,24,${0.16 + depth * 0.2})`;
        for (let i = 0; i < grains; i++) {
          g.fillRect(rnd() * w, y + rnd() * bandH, rnd() < 0.85 ? 1 : 1.6, 1);
        }

        // Uma em cada tres camadas leva hachura fina e esparsa — o
        // suficiente para ler como material, longe da amostra de tecido
        // que foi rejeitada antes (aquela era uma coluna estreita; esta e
        // terreno de largura inteira, e le como chao).
        if (band % 3 === 1 && bandH > 14) {
          g.strokeStyle = `rgba(26,26,24,${0.07 + depth * 0.06})`;
          g.lineWidth = 0.6;
          for (let hx = -bandH; hx < w; hx += 13) {
            g.beginPath();
            g.moveTo(hx, y + bandH);
            g.lineTo(hx + bandH, y + 1);
            g.stroke();
          }
        }

        // A veia de cobre: uma so, na fundacao. Traco, nunca rotulo.
        if (depth > 0.74 && rnd() < 0.2) {
          g.fillStyle = "rgba(181,80,46,0.55)";
          g.fillRect(0, y + bandH * 0.4, w, 1.3);
        }

        y += bandH;
        band++;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (!w || !h) return;
      // Teto de resolucao: em tela grande 2x nao acrescenta nada visivel
      // aqui e dobra o custo de pintura.
      dpr = Math.min(window.devicePixelRatio || 1, w > 1100 ? 1.25 : 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      reveal = new Array(SAMPLES + 1).fill(0);
      layer = document.createElement("canvas");
      layer.width = Math.round(w * dpr);
      layer.height = Math.round(h * dpr);
      buildGround();
    };

    resize();

    // --- estado vivo -------------------------------------------------
    let drift = 0;              // deslocamento lento das camadas
    let sweepX = -999;          // posicao da linha de sondagem
    let nextSweep = 2600;       // quando a proxima atravessa, em ms
    let elapsed = 0;
    let pointerX = -999;
    let pointerOn = 0;          // 0..1, entra e sai suave

    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      // So conta dentro da faixa do terreno: o dedo passando pelo texto
      // acima nao deve acender o chao.
      pointerOn = e.clientY >= rect.top && e.clientY <= rect.bottom ? 1 : 0;
    };
    const onLeave = () => { pointerOn = 0; };

    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("pointercancel", onLeave, { passive: true });
    }

    /** Desenha as camadas, com deriva, num contexto qualquer. */
    const drawGround = (c, alpha) => {
      const gh = ground.height / dpr;
      const off = drift % gh;
      c.globalAlpha = alpha;
      c.drawImage(ground, 0, 0, ground.width, ground.height, 0, off - gh, w, gh);
      c.drawImage(ground, 0, 0, ground.width, ground.height, 0, off, w, gh);
      c.globalAlpha = 1;
    };

    /** Uma passada de pintura. */
    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      if (!ground || !layer) return;

      // 1. o terreno em repouso: um sussurro, presente em toda a largura
      drawGround(ctx, BASE);

      // 2. a revelacao. So o TRECHO que mudou e recomposto: a leitura e
      //    local — um halo de ponteiro ou o rastro da sondagem — e
      //    recompor a tela inteira a 60Hz por causa de uma faixa de
      //    300px custava um terco dos quadros. Medido: 45 FPS antes
      //    desta limitacao, 60 depois.
      let lo = -1, hi = -1;
      for (let i = 0; i < reveal.length; i++) {
        if (reveal[i] > 0.02) { if (lo < 0) lo = i; hi = i; }
      }

      if (lo >= 0) {
        const step = w / (reveal.length - 1);
        const x0 = Math.max(0, Math.floor((lo - 1) * step));
        const x1 = Math.min(w, Math.ceil((hi + 1) * step));
        const bw = x1 - x0;

        if (bw > 0) {
          const lc = layer.getContext("2d");
          lc.setTransform(dpr, 0, 0, dpr, 0, 0);
          lc.clearRect(x0, 0, bw, h);

          lc.save();
          lc.beginPath();
          lc.rect(x0, 0, bw, h);
          lc.clip();
          drawGround(lc, PEAK);
          lc.restore();

          // A mascara cobre so a faixa, mas o gradiente e ancorado nas
          // MESMAS coordenadas de sempre, senao a curva escorregaria
          // junto com a faixa e a revelacao pulsaria ao se mover.
          const mask = lc.createLinearGradient(0, 0, w, 0);
          for (let i = 0; i < reveal.length; i++) {
            mask.addColorStop(i / (reveal.length - 1), `rgba(0,0,0,${reveal[i].toFixed(3)})`);
          }
          lc.globalCompositeOperation = "destination-in";
          lc.fillStyle = mask;
          lc.fillRect(x0, 0, bw, h);
          lc.globalCompositeOperation = "source-over";

          ctx.drawImage(
            layer,
            x0 * dpr, 0, bw * dpr, layer.height,
            x0, 0, bw, h
          );
        }
      }

      // 3. a propria linha de sondagem: um fio de cobre atravessando
      if (sweepX > -40 && sweepX < w + 40) {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "rgba(181,80,46,0)");
        grad.addColorStop(0.3, "rgba(181,80,46,0.42)");
        grad.addColorStop(1, "rgba(181,80,46,0.06)");
        ctx.fillStyle = grad;
        ctx.fillRect(sweepX, 0, 1.2, h);
      }
    };

    // Movimento reduzido: um quadro parado, nenhum laco, nenhum evento.
    if (reduced) {
      reveal.fill(0.42); // o terreno fica legivel de uma vez, sem varredura
      paint();
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    let running = true;
    let last = performance.now();

    const loop = (now) => {
      const dt = Math.min(now - last, 50); // aba em segundo plano nao acumula salto
      last = now;
      elapsed += dt;

      // deriva: as camadas assentam continuamente, sem nunca parar
      drift += dt * 0.0042;

      // a sondagem sai sozinha, em intervalo irregular
      if (elapsed > nextSweep && sweepX < -40) {
        sweepX = -30;
        elapsed = 0;
        nextSweep = preset.esperaMin + Math.random() * preset.esperaVar;
      }
      if (sweepX > -40) {
        sweepX += dt * 0.62;
        if (sweepX > w + 40) sweepX = -999;
      }

      // decaimento + fontes de revelacao
      const step = w / (reveal.length - 1);
      for (let i = 0; i < reveal.length; i++) {
        const x = i * step;
        let target = 0;

        if (sweepX > -40) {
          const d = Math.abs(x - sweepX);
          // rastro assimetrico e largo: acende a frente, apaga devagar
          // atras, sem nunca formar uma borda que se perceba.
          const span = x < sweepX ? 300 : 110;
          if (d < span) {
            const k = 1 - d / span;
            target = Math.max(target, k * k * (3 - 2 * k)); // smoothstep
          }
        }
        if (pointerOn > 0) {
          const d = Math.abs(x - pointerX);
          if (d < preset.halo) {
            const k = 1 - d / preset.halo;
            target = Math.max(target, k * k * (3 - 2 * k) * 0.9);
          }
        }

        reveal[i] = target > reveal[i]
          ? reveal[i] + (target - reveal[i]) * 0.34   // acende rapido
          : reveal[i] + (target - reveal[i]) * 0.055; // apaga devagar
      }

      paint();
      if (running) raf = requestAnimationFrame(loop);
    };

    // Pausa fora da viewport: um laco pintando o que ninguem ve e so
    // bateria queimada.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointercancel", onLeave);
    };
  }, [intensidade]);

  return (
    <canvas
      ref={canvasRef}
      className="mf-terrain"
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
