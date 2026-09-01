import React, { useEffect, useRef } from "react";
import { CAMADAS } from "@/lib/xray";

/**
 * O RESULTADO DO RAIO-X, desenhado.
 *
 * Quatro faixas empilhadas na ordem da marca — superficie, sistema,
 * dados, fundacao. Cada uma ocupa a mesma altura de espaco, e o quanto
 * ela PREENCHE esse espaco e a solidez daquela camada. A mais fina fica
 * visivelmente fina, e e a unica que leva a veia de cobre.
 *
 * Por que desenhar em vez de escrever a nota: o site inteiro fala de
 * profundidade em camadas, e este e o unico lugar onde o visitante ve as
 * SUAS proprias camadas. Uma barra de progresso diria o mesmo numero e
 * nao diria nada da marca.
 *
 * O canvas e decoracao: `aria-hidden`. O resultado de verdade — o nome
 * da camada e o que ela custa — e texto no DOM, ao lado. Leitor de tela
 * recebe a resposta inteira sem depender de pixel, e a auditoria de
 * contraste consegue medir.
 *
 * Regras de seguranca, as mesmas do StrataField: nada de imagem externa,
 * pausa fora da viewport, `prefers-reduced-motion` desenha o estado
 * final sem laco, um unico requestAnimationFrame, teto de resolucao.
 */
export default function XRayStrata({ solidez, maisFina }) {
  const canvasRef = useRef(null);
  // O alvo entra por ref para o laco ler sempre o valor corrente sem
  // precisar reiniciar a cada resposta nova.
  const alvoRef = useRef(solidez);
  alvoRef.current = solidez;
  const finaRef = useRef(maisFina);
  finaRef.current = maisFina;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let seed = 20260901;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    let w = 0, h = 0, dpr = 1;
    // Estado desenhado: persegue o alvo, para a barra crescer em vez de
    // pular a cada resposta.
    const atual = Object.fromEntries(CAMADAS.map((c) => [c, 0]));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      seed = 20260901;

      const slot = h / CAMADAS.length;
      const fina = finaRef.current;

      CAMADAS.forEach((camada, i) => {
        const topo = i * slot;
        const s = Math.max(0, Math.min(1, atual[camada]));
        // Piso visivel: uma camada oca ainda precisa deixar rastro, senao
        // o desenho perde a faixa e vira tres camadas. Acima dele a
        // amplitude e larga de proposito — com faixa estreita demais a
        // diferenca entre "firme" e "ponto fraco" nao se lia, e o desenho
        // deixava de dizer o que a legenda dizia.
        const alturaFaixa = slot * (0.08 + s * 0.88);
        const y = topo + (slot - alturaFaixa);
        const profundidade = i / (CAMADAS.length - 1);
        const ehFina = camada === fina;

        // Tom: pedra em cima, grafite embaixo — igual ao terreno da
        // abertura, para as duas leituras serem do mesmo mundo.
        const tom = Math.round(150 - profundidade * profundidade * 118);
        ctx.fillStyle = `rgba(${tom},${tom - 4},${tom - 10},${0.34 + profundidade * 0.4})`;
        ctx.fillRect(0, y, w, alturaFaixa);

        // Grao de sedimento.
        ctx.fillStyle = `rgba(26,26,24,${0.14 + profundidade * 0.16})`;
        const graos = Math.round((w / 900) * 150 * (0.4 + profundidade));
        for (let g = 0; g < graos; g++) {
          ctx.fillRect(rnd() * w, y + rnd() * alturaFaixa, rnd() < 0.85 ? 1 : 1.6, 1);
        }

        // O fio de contorno no topo da faixa.
        ctx.fillStyle = `rgba(26,26,24,${0.24 + profundidade * 0.3})`;
        ctx.fillRect(0, y, w, 1);

        // O vazio acima da faixa e o que falta na camada: fica marcado
        // por uma hachura rala, para "fino" se ler como falta e nao como
        // espaco em branco de layout.
        if (s < 0.94) {
          ctx.strokeStyle = `rgba(26,26,24,${ehFina ? 0.16 : 0.08})`;
          ctx.lineWidth = 0.6;
          const alturaVazio = slot - alturaFaixa;
          for (let hx = -alturaVazio; hx < w; hx += 14) {
            ctx.beginPath();
            ctx.moveTo(hx, topo + alturaVazio);
            ctx.lineTo(hx + alturaVazio, topo);
            ctx.stroke();
          }
        }

        // A camada mais fina leva a veia de cobre. Uma so no desenho
        // inteiro — o acento e traco, nunca preenchimento.
        if (ehFina) {
          ctx.fillStyle = "rgba(181,80,46,0.9)";
          ctx.fillRect(0, y - 2, w, 2.4);
        }
      });

      // A linha do horizonte, entre sistema e dados: o mesmo corte que
      // /how-i-work desenha.
      const meio = slot * 2;
      ctx.fillStyle = "rgba(26,26,24,0.30)";
      for (let x = 0; x < w; x += 8) ctx.fillRect(x, meio, 4, 1);
    };

    const passo = (k) => {
      let mexeu = false;
      for (const c of CAMADAS) {
        const alvo = Math.max(0, Math.min(1, alvoRef.current?.[c] ?? 0));
        const d = alvo - atual[c];
        if (Math.abs(d) > 0.002) { atual[c] += d * k; mexeu = true; }
        else atual[c] = alvo;
      }
      return mexeu;
    };

    if (reduced) {
      passo(1);
      paint();
      window.addEventListener("resize", () => { resize(); paint(); });
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    let rodando = true;
    const loop = () => {
      passo(0.09);
      paint();
      if (rodando) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !rodando) { rodando = true; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting && rodando) { rodando = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 });
    io.observe(canvas);

    raf = requestAnimationFrame(loop);
    const onResize = () => { resize(); paint(); };
    window.addEventListener("resize", onResize);

    return () => {
      rodando = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
