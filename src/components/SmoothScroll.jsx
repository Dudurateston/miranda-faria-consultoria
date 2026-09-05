import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll suave (Lenis) — com recálculo de altura e trava de segurança.
 *
 * O bug que travou a home: o Lenis cancela o wheel do navegador e passa a
 * mover a página ele mesmo. Ele nasce junto com o React, quando a árvore
 * ainda não pintou nada — então mede a página com altura zero e guarda
 * `limit = 0`, ou seja, "não há nada para rolar". Depois o conteúdo aparece
 * (5.200px), mas o limite continua zero: todo scroll é grampeado em 0 e o
 * site fica congelado. O navegador não rola porque o evento foi cancelado;
 * o Lenis não rola porque acha que a página caberia na tela.
 *
 * Correção em três camadas:
 *   1. `autoRaf: true` — o Lenis avança no próprio requestAnimationFrame,
 *      sem depender do ticker do GSAP.
 *   2. Recálculo (`resize`) depois da pintura, no load, a cada mudança de
 *      altura do documento (ResizeObserver) e na troca de rota.
 *   3. Trava: se ainda assim o limite ficar zero numa página que rola, o
 *      Lenis é destruído e o scroll nativo volta. Rolagem que funciona vale
 *      mais que rolagem bonita.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
      autoRaf: true,
    });
    lenisRef.current = lenis;
    if (import.meta.env.DEV) window.__mfLenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    gsap.ticker.lagSmoothing(0);

    const scrollable = () =>
      document.documentElement.scrollHeight - window.innerHeight > 8;

    const recalc = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    // 1) o conteúdo entra depois do primeiro quadro: medir de novo
    const t1 = window.setTimeout(recalc, 60);
    const t2 = window.setTimeout(recalc, 400);
    const t3 = window.setTimeout(recalc, 1200);
    window.addEventListener("load", recalc);

    // 2) qualquer mudança de altura (fontes, vídeos, imagens) remede
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => lenis.resize());
      ro.observe(document.documentElement);
      ro.observe(document.body);
    }

    // 3) trava de segurança: página que rola com limite zero = travada
    const guard = window.setInterval(() => {
      if (!lenisRef.current) return;
      if (scrollable() && lenis.limit <= 0) {
        lenis.resize();
        if (lenis.limit <= 0) {
          // devolve o scroll nativo em vez de deixar o visitante preso
          lenis.destroy();
          lenisRef.current = null;
          document.documentElement.classList.remove(
            "lenis",
            "lenis-smooth",
            "lenis-scrolling",
            "lenis-stopped"
          );
          window.clearInterval(guard);
          ScrollTrigger.refresh();
        }
      }
    }, 500);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearInterval(guard);
      window.removeEventListener("load", recalc);
      if (ro) ro.disconnect();
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return children;
}
