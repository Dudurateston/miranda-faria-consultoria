import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";

gsap.registerPlugin(ScrollTrigger);

// Cada dor ocupa uma linha inteira em display-lg. Conforme a seção
// entra, uma linha fina em cobre risca cada frase de cima para baixo,
// com stagger de 0.15s — a metáfora dos problemas sendo resolvidos.
const dores = [
  "Você sabe o preço de cabeça, mas ninguém mais sabe.",
  "O estoque está certo na sua memória e errado na planilha.",
  "O pedido chegou no WhatsApp e sumiu na conversa.",
  "O relatório existe, mas leva duas horas para montar todo mês.",
];

export default function OndeDoi() {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pains = el.querySelectorAll(".mf-doi__pain");
    const strikes = el.querySelectorAll(".mf-doi__strike");

    if (mq.matches) {
      gsap.set(pains, { opacity: 1, y: 0 });
      gsap.set(strikes, { scaleY: 1 });
      return;
    }

    gsap.set(pains, { opacity: 0, y: 24 });
    gsap.set(strikes, { scaleY: 0, transformOrigin: "top center" });

    const tween = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 72%", once: true },
    });
    tween
      .to(pains, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.15 }, 0)
      .to(strikes, { scaleY: 1, duration: 0.9, ease: "power3.out", stagger: 0.15 }, 0.25);

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <>
      <section className="mf-doi" data-bg="#F5F1EA" id="onde-doi">
        <div className="mf-doi__inner">
          <Reveal>
            <p className="mf-label">Onde isso dói</p>
          </Reveal>
          <LineReveal className="mf-doi__lead">
            O sistema começa onde a planilha trava.
          </LineReveal>
          <div ref={listRef} className="mf-doi__list">
            {dores.map((d, i) => (
              <div className="mf-doi__item" key={i}>
                <p className="mf-doi__pain">{d}</p>
                <span className="mf-doi__strike" aria-hidden="true" />
              </div>
            ))}
          </div>
          <Reveal delay={80}>
            <p className="mf-doi__punch">
              Nada disso se resolve com site bonito. Resolve com sistema.
            </p>
          </Reveal>
        </div>
      </section>
      <style>{`
.mf-doi{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-doi__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-doi__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 3.5rem;width:100%}
.mf-doi__list{display:flex;flex-direction:column}
.mf-doi__item{position:relative;padding:1.4rem 0 1.4rem 1.5rem}
.mf-doi__pain{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-lg);line-height:1.1;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;max-width:100%}
.mf-doi__strike{position:absolute;left:0;top:0;width:1px;height:100%;background:var(--color-accent);transform:scaleY(0);transform-origin:top center}
.mf-doi__punch{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-md);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-accent);margin:3.5rem 0 0;max-width:var(--max-width-body)}
      `}</style>
    </>
  );
}