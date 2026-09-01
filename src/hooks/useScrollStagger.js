import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Entrada com stagger dos itens de lista/grade.
// y 30 -> 0, opacidade 0 -> 1, stagger 0.1, ease expo.out.
//
// REGRA: o que ja esta na primeira tela NAO entra com animacao.
// Antes, todos os itens comecavam em opacity 0 e subiam em cascata,
// inclusive os que o visitante ja tinha na frente no primeiro quadro —
// medido em /work, a segunda linha ficava em opacidade 0,41 no
// carregamento, lendo como item desabilitado. Animacao de entrada serve
// para recompensar quem rola ate o conteudo; aplicada ao que ja esta
// visivel, ela so atrasa a leitura e produz texto fantasma.
export function useScrollStagger(ref, {
  selector,
  stagger = 0.1,
  y = 30,
  duration = 0.8,
  delay = 0,
  start = "top 75%",
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const items = selector
      ? Array.from(el.querySelectorAll(selector))
      : Array.from(el.children);
    if (!items.length) return;

    // Quem ja aparece na primeira tela fica como esta, cheio, desde o
    // primeiro quadro. So o que esta abaixo da dobra ganha a entrada.
    const abaixoDaDobra = items.filter(
      (i) => i.getBoundingClientRect().top > window.innerHeight
    );
    if (!abaixoDaDobra.length) return;

    gsap.set(abaixoDaDobra, { y, opacity: 0 });
    const tween = gsap.to(abaixoDaDobra, {
      y: 0,
      opacity: 1,
      duration,
      ease: "expo.out",
      stagger,
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    });

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [ref, selector, stagger, y, duration, delay, start]);
}