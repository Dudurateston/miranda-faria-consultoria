import { useEffect, useRef } from "react";

/**
 * Hero viva — sedimentacao de particulas.
 *
 * O elemento autonomo que a direcao criativa pede: move-se sozinho, sem
 * depender de mouse nem de scroll. As particulas caem devagar, sao
 * desviadas por um campo de ruido e se acomodam em faixas horizontais de
 * densidade desigual — estratos se formando e se desfazendo sem parar.
 *
 * Decisoes que vem do historico do projeto (CLAUDE.md):
 * - NADA de imagem externa. A forma e gerada proceduralmente, entao nao
 *   ha textura para ler, nao ha CORS, nao ha sequencia de quadros. Foram
 *   essas duas dependencias que derrubaram as tentativas anteriores.
 * - Canvas 2D em vez de WebGL. Para campo de particulas em duas
 *   dimensoes o ganho do WebGL nao paga o custo: compilar shader, perder
 *   o fallback e carregar three.js inteiro na primeira tela. Com o teto
 *   de particulas abaixo, o 2D sustenta 60fps.
 * - Um unico requestAnimationFrame, pausado fora da viewport.
 * - `prefers-reduced-motion` desenha um quadro so, parado.
 */

// Teto por area de tela: telas pequenas ganham menos particula, e o
// custo por quadro fica proporcional ao que o aparelho aguenta.
const DENSITY = 0.0017;
const MAX_PARTICLES = 2600;
const MIN_PARTICLES = 900;

const INK = [26, 26, 24];
const COPPER = [181, 80, 46];

/** Ruido de valor com interpolacao suave — barato e suficiente aqui. */
function makeNoise(seed = 1) {
  const p = new Uint8Array(512);
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (h, x, y) => ((h & 1) === 0 ? x : -x) + ((h & 2) === 0 ? y : -y);

  return (x, y) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];
    const lerp = (a, b, t) => a + t * (b - a);
    return lerp(
      lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
      lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
      v
    );
  };
}

export default function LivingHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noise = makeNoise(7);

    let w = 0, h = 0, dpr = 1;
    let particles = [];
    let raf = 0;
    let running = false;
    let t = 0;

    /**
     * Onde cada faixa de estrato repousa, e com que peso.
     *
     * Concentradas na metade de baixo e mais densas conforme descem —
     * sedimento se acumula na base, nao se espalha pela tela. A
     * primeira versao distribuia por igual em toda a altura e o
     * resultado lia como poeira, nao como estrato.
     */
    const BANDS = [
      { y: 0.50, weight: 1 },
      { y: 0.60, weight: 2 },
      { y: 0.67, weight: 2 },
      { y: 0.73, weight: 3 },
      { y: 0.785, weight: 4 },
      { y: 0.835, weight: 5 },
      { y: 0.88, weight: 6 },
      { y: 0.925, weight: 7 },
    ];
    const BAND_POOL = BANDS.flatMap((b) => Array(b.weight).fill(b.y));

    const seed = () => {
      const target = Math.round(w * h * DENSITY);
      const count = Math.max(MIN_PARTICLES, Math.min(MAX_PARTICLES, target));
      particles = Array.from({ length: count }, () => {
        const band = BAND_POOL[(Math.random() * BAND_POOL.length) | 0];
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          band,
          // Espalhamento dentro da faixa: soma de tres aleatorios da
          // uma curva de sino, entao as bordas ficam ralas e o meio
          // denso — que e como sedimento assenta de verdade.
          spread: (Math.random() + Math.random() + Math.random()) / 3 - 0.5,
          vx: 0,
          vy: 0,
          size: Math.random() < 0.16 ? 2.1 : 1.1,
          // O cobre e acento: menos de 2% das particulas.
          copper: Math.random() < 0.018,
          alpha: 0.16 + Math.random() * 0.34,
          drift: 0.4 + Math.random() * 0.8,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const step = (dt) => {
      t += dt;
      for (const p of particles) {
        // Campo de ruido: dois octaves, um lento e largo, outro rapido e
        // fino. E o que da a sensacao de correnteza em vez de queda.
        const n1 = noise(p.x * 0.0016, p.y * 0.0016 + t * 0.06);
        const n2 = noise(p.x * 0.0065 + 40, p.y * 0.0065 - t * 0.11);
        const flow = n1 * 0.75 + n2 * 0.25;

        p.vx += flow * 0.05 * p.drift;

        // A atracao para a faixa precisa DOMINAR a queda, senao a
        // particula so chove e o estrato nunca se forma. Foi esse o
        // desequilibrio da primeira versao.
        const targetY = (p.band + p.spread * 0.022) * h;
        p.vy += (targetY - p.y) * 0.0075 + 0.004 * p.drift;

        p.vx *= 0.94;
        p.vy *= 0.90;
        p.x += p.vx;
        p.y += p.vy;

        // Reentrada pelas bordas: o campo nunca esvazia.
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        // Reciclagem so para quem escapa por baixo; a faixa segura o
        // resto, entao o campo permanece estratificado.
        if (p.y > h + 14) {
          p.y = -14;
          p.vy = 0;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const [r, g, b] = p.copper ? COPPER : INK;
        ctx.fillStyle = `rgba(${r},${g},${b},${p.copper ? p.alpha * 1.5 : p.alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    };

    let last = 0;
    const loop = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05); // limita salto apos aba oculta
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    if (reduced) {
      // Um quadro so: deixa o campo assentar sem animar nada na tela.
      for (let i = 0; i < 260; i++) step(1 / 60);
      draw();
    } else {
      // Pre-assenta antes de aparecer, para o visitante nao pegar a
      // nuvem crua no primeiro quadro.
      for (let i = 0; i < 200; i++) step(1 / 60);
    }

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0.01 }
    );
    io.observe(canvas);

    // Aba oculta tambem para o loop: rAF ja e suspenso pelo navegador,
    // mas parar explicitamente evita o salto de tempo ao voltar.
    let wasVisible = true;
    const onVisibility = () => {
      if (document.hidden) {
        wasVisible = running;
        stop();
      } else if (wasVisible) {
        start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="mf-living" aria-hidden="true" />
      <style>{`
.mf-living{
  position:absolute;inset:0;width:100%;height:100%;
  display:block;pointer-events:none;
}
      `}</style>
    </>
  );
}
