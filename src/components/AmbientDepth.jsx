import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

/**
 * AmbientDepth — substitui o ValueBackground.
 *
 * Metáfora de estratos: a página inteira é uma única descida contínua
 * de valor, da superfície cor-de-osso até a camada mais funda. Nunca
 * alterna, nunca corta seco — é uma rampa só, do topo ao fim da página.
 * A descida é NEUTRA: o cobre é o único acento da marca e não vira
 * campo de fundo.
 *
 * Cada seção declara sua profundidade via `data-depth` (0 a 1). O
 * fundo do body interpola continuamente entre as duas cores conforme
 * o centro da viewport avança pelas seções.
 *
 * Contraste: acima de FLIP_AT os neutros invertem — texto vira --bone e
 * o acento passa para --copper-light. Entre 0,45 e 0,80 existe uma faixa
 * cega em que nenhuma das duas cores alcanca 4,5:1; por isso as secoes
 * so descansam em <= 0,35 ou >= 0,85 e a travessia do meio e acelerada.
 * A medicao esta documentada no tokens.css.
 */

// As duas pontas da rampa vivem no tokens.css (--depth-top /
// --depth-bottom), para a descida inteira mudar num lugar so.
const readToken = (name, fallback) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

// A virada fica no meio da faixa cega documentada no tokens.css.
const FLIP_AT = 0.62;

// Expoente da travessia. Mantem a cor perto das pontas na maior parte do
// percurso e cruza o tom medio depressa, porque e la que o texto some.
const CROSS = 11;

export default function AmbientDepth() {
  const sectionsRef = useRef([]);
  const rafRef = useRef(0);
  const flippedRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const compute = () => {
      sectionsRef.current = Array.from(document.querySelectorAll("[data-depth]"))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            center: rect.top + window.scrollY + rect.height / 2,
            height: rect.height,
            depth: parseFloat(el.getAttribute("data-depth")) || 0,
          };
        })
        .sort((a, b) => a.center - b.center);
    };

    const applyTheme = (depth) => {
      const shouldFlip = depth >= FLIP_AT;
      if (shouldFlip !== flippedRef.current) {
        flippedRef.current = shouldFlip;
        document.documentElement.setAttribute(
          "data-theme",
          shouldFlip ? "on-deep" : "on-bone"
        );
      }
    };

    const easeInOut = (t) =>
      t < 0.5
        ? 0.5 * Math.pow(2 * t, CROSS)
        : 1 - 0.5 * Math.pow(2 * (1 - t), CROSS);

    const top = readToken("--depth-top", "#F5F1EA");
    const bottom = readToken("--depth-bottom", "#2A2621");

    const paint = (depth) => {
      const color = gsap.utils.interpolate(top, bottom, depth);
      gsap.set("body", { backgroundColor: color });
      applyTheme(depth);
    };

    const interpolate = () => {
      const secs = sectionsRef.current;
      // Pagina sem marcacao de profundidade volta a superficie em vez
      // de manter a cor herdada da rota anterior.
      if (!secs.length) return paint(0);
      const vpCenter = window.scrollY + window.innerHeight / 2;

      if (vpCenter <= secs[0].center) return paint(secs[0].depth);
      if (vpCenter >= secs[secs.length - 1].center) {
        return paint(secs[secs.length - 1].depth);
      }

      let i = 0;
      while (i < secs.length - 1 && secs[i + 1].center <= vpCenter) i++;
      const prev = secs[i];
      const next = secs[i + 1];

      const span = next.center - prev.center;
      const t = span > 0 ? (vpCenter - prev.center) / span : 1;
      const e = easeInOut(clamp01(t));
      paint(prev.depth + (next.depth - prev.depth) * e);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (mq.matches) {
          // Sem preferência de movimento: aplica direto, sem easing.
          const secs = sectionsRef.current;
          if (!secs.length) return paint(0);
          const vpCenter = window.scrollY + window.innerHeight / 2;
          let best = secs[0];
          let dist = Infinity;
          for (const s of secs) {
            const d = Math.abs(s.center - vpCenter);
            if (d < dist) {
              dist = d;
              best = s;
            }
          }
          paint(best.depth);
        } else {
          interpolate();
        }
      });
    };

    const onResize = () => {
      compute();
      onScroll();
    };

    requestAnimationFrame(() => {
      compute();
      onScroll();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const interval = window.setInterval(compute, 1000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearInterval(interval);
    };
  }, [pathname]);

  return null;
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
