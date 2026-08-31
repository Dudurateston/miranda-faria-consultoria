import React from "react";

/**
 * O argumento central da página /about, mostrado em vez de afirmado.
 *
 * "Não há perda de passagem de bastão" é fácil de escrever e barato de
 * acreditar. O diagrama torna verificável: em cima, três caixas com duas
 * emendas entre elas, e a intenção vazando em cada uma; embaixo, uma
 * faixa contínua sem emenda nenhuma.
 *
 * É a assinatura desta página — o lugar da rampa de cor, que saiu por
 * ser igual em toda parte. Aqui o elemento só faz sentido nesta aba,
 * porque é o argumento dela.
 */
export default function HandoffDiagram({ split, whole, seam }) {
  return (
    <>
      <figure className="mf-hand">
        <svg viewBox="0 0 100 42" preserveAspectRatio="xMidYMid meet" role="img"
             aria-label={`${split.join(", ")} — ${whole}`}>
          {/* Em cima: o caminho partido */}
          <g className="mf-hand__split">
            {split.map((label, i) => {
              const x = 2 + i * 33.5;
              return (
                <g key={label} style={{ "--i": i }}>
                  <rect className="mf-hand__box" x={x} y={4} width={29} height={11} />
                  <text className="mf-hand__t" x={x + 14.5} y={11}>{label}</text>
                </g>
              );
            })}
            {/* As emendas: onde a intenção vaza */}
            {[0, 1].map((i) => {
              const x = 31 + i * 33.5;
              return (
                <g key={i} className="mf-hand__seam" style={{ "--i": i }}>
                  <line x1={x} y1={9.5} x2={x + 4.5} y2={9.5} strokeDasharray="1.2 1.2" />
                  <text className="mf-hand__leak" x={x + 2.2} y={20.5}>{seam}</text>
                </g>
              );
            })}
          </g>

          {/* Embaixo: a faixa contínua */}
          <g className="mf-hand__whole">
            <rect className="mf-hand__bar" x={2} y={28} width={96} height={11} />
            <text className="mf-hand__t is-inv" x={50} y={35}>{whole}</text>
          </g>
        </svg>
      </figure>

      <style>{`
.mf-hand{margin:0;width:100%}
.mf-hand svg{display:block;width:100%;height:auto}

.mf-hand__box{fill:none;stroke:var(--color-text-primary);stroke-width:.35;opacity:0}
.mf-hand__t{
  font-family:var(--font-mono);font-size:3.1px;letter-spacing:.16em;
  text-transform:uppercase;text-anchor:middle;
  fill:var(--color-text-primary);opacity:0;
}
.mf-hand__t.is-inv{fill:var(--bone)}
.mf-hand__seam line{stroke:var(--color-accent);stroke-width:.45;opacity:0}
.mf-hand__leak{
  font-family:var(--font-mono);font-size:2.4px;letter-spacing:.12em;
  text-transform:uppercase;text-anchor:middle;
  fill:var(--color-accent);opacity:0;
}
.mf-hand__bar{fill:var(--color-text-primary);opacity:0}

@supports (animation-timeline: view()) and (animation-range: 0% 100%){
  @media (prefers-reduced-motion: no-preference){
    @keyframes mf-hand-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
    @keyframes mf-hand-leak{from{opacity:0}to{opacity:.9}}

    .mf-hand__box,.mf-hand__t{
      animation:mf-hand-in linear both;animation-timeline:view();
      animation-range:entry calc(10% + var(--i,0) * 6%) cover calc(32% + var(--i,0) * 6%);
    }
    /* As emendas entram DEPOIS das caixas: primeiro a estrutura, depois
       o problema dela. */
    .mf-hand__seam line,.mf-hand__leak{
      animation:mf-hand-leak linear both;animation-timeline:view();
      animation-range:entry calc(34% + var(--i) * 5%) cover calc(52% + var(--i) * 5%);
    }
    /* E a faixa contínua fecha o argumento, por último. */
    .mf-hand__bar{
      animation:mf-hand-in linear both;animation-timeline:view();
      animation-range:entry 56% cover 74%;
    }
    .mf-hand__whole .mf-hand__t{
      animation:mf-hand-in linear both;animation-timeline:view();
      animation-range:entry 62% cover 80%;
    }
  }
}

@supports not ((animation-timeline: view()) and (animation-range: 0% 100%)){
  .mf-hand__box,.mf-hand__t,.mf-hand__bar{opacity:1}
  .mf-hand__seam line,.mf-hand__leak{opacity:.9}
}
@media (prefers-reduced-motion: reduce){
  .mf-hand__box,.mf-hand__t,.mf-hand__bar{opacity:1;animation:none}
  .mf-hand__seam line,.mf-hand__leak{opacity:.9;animation:none}
}
      `}</style>
    </>
  );
}
