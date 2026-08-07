import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";

gsap.registerPlugin(ScrollTrigger);

// Uma linha vertical de 1px que se desenha de cima para baixo conforme
// a rolagem, com quatro nós. Cada nó tem um ponto em cobre e o texto
// ao lado, alternando lados. Sem caixas, sem números grandes.
const passos = [
  { t: "Diagnóstico", d: "Uma conversa para entender onde o processo trava. Sem custo." },
  { t: "Escopo fechado", d: "Proposta com entrega, prazo e valor definidos. Sem surpresa depois." },
  { t: "Construção", d: "Você acompanha durante, não só no final." },
  { t: "Entrega e autonomia", d: "Sistema no ar, você treinado para operar. A infraestrutura fica no seu nome." },
];

export default function ComoFunciona() {
  const tlRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tl = tlRef.current;
    const line = lineRef.current;
    if (!tl || !line) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      gsap.set(line, { scaleY: 1 });
      return;
    }
    gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
    const tween = gsap.to(line, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: tl, start: "top 72%", end: "bottom 72%", scrub: true },
    });
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <>
      <section className="mf-como" data-bg="#F5F1EA" id="como-funciona">
        <div className="mf-como__inner">
          <Reveal>
            <p className="mf-label">Como funciona</p>
          </Reveal>
          <LineReveal className="mf-como__lead">Quatro passos.</LineReveal>
          <div ref={tlRef} className="mf-como__timeline">
            <span ref={lineRef} className="mf-como__line" aria-hidden="true" />
            {passos.map((p, i) => (
              <div
                className="mf-como__node"
                data-side={i % 2 === 0 ? "right" : "left"}
                key={i}
              >
                <span className="mf-como__dot" />
                <div className="mf-como__text">
                  <h3 className="mf-como__title">{p.t}</h3>
                  <p className="mf-como__desc">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
.mf-como{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-como__inner{width:100%;max-width:var(--max-width-page);margin:0 auto}
.mf-como__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 4rem;width:100%}
.mf-como__timeline{position:relative;padding:1rem 0}
.mf-como__line{position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--color-divider);transform-origin:top center;z-index:1}
.mf-como__node{position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:150px}
.mf-como__dot{position:absolute;left:50%;top:50%;width:9px;height:9px;border-radius:50%;background:var(--color-accent);transform:translate(-50%,-50%);z-index:2}
.mf-como__text{display:flex;flex-direction:column;gap:0.5rem}
.mf-como__node[data-side="right"] .mf-como__text{grid-column:2;padding-left:3rem;text-align:left}
.mf-como__node[data-side="left"] .mf-como__text{grid-column:1;padding-right:3rem;text-align:right}
.mf-como__title{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-md);line-height:1.1;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0}
.mf-como__desc{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0;max-width:38ch}
.mf-como__node[data-side="right"] .mf-como__desc{margin-left:0}
.mf-como__node[data-side="left"] .mf-como__desc{margin-left:auto}
@media(max-width:767px){
  .mf-como__line{left:18px}
  .mf-como__dot{left:18px}
  .mf-como__node{grid-template-columns:1fr;min-height:auto;padding:1.4rem 0 1.4rem 3.5rem}
  .mf-como__node[data-side="right"] .mf-como__text,
  .mf-como__node[data-side="left"] .mf-como__text{grid-column:1;padding:0;text-align:left}
  .mf-como__node[data-side="left"] .mf-como__desc{margin-left:0}
}
      `}</style>
    </>
  );
}