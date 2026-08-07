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
          <div className="mf-como__list">
            {passos.map((p, i) => (
              <div className="mf-como__row" key={i}>
                <span className="mf-como__num">{String(i + 1).padStart(2, "0")}</span>
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
.mf-como__list{margin-top:3rem;border-top:1px solid var(--color-divider)}
.mf-como__row{display:grid;grid-template-columns:auto 1fr;gap:clamp(1.5rem,5vw,4.5rem);align-items:baseline;padding:2.2rem 0;border-bottom:1px solid var(--color-divider)}
.mf-como__num{font-family:var(--font-mono);font-size:var(--text-body-md);color:var(--color-accent);letter-spacing:0.1em;padding-top:0.4rem}
.mf-como__text{display:flex;flex-direction:column;gap:0.6rem}
.mf-como__title{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-md);line-height:1.1;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0}
.mf-como__desc{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0;max-width:46ch}
@media(max-width:767px){
  .mf-como__row{grid-template-columns:1fr;gap:0.5rem;padding:1.7rem 0}
  .mf-como__num{padding-top:0}
}
      `}</style>
    </>
  );
}