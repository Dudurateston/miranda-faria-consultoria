import React from "react";

/**
 * A assinatura de cada vertical — gerada em código, e específica.
 *
 * Substitui a rampa de cor como elemento de destaque. A rampa era a
 * mesma em toda página, e repetir o mesmo gesto sete vezes cansa. Aqui
 * cada aba ganha um objeto que só faz sentido nela:
 *
 * `systems`   um modelo de dados se desenhando — entidades e as
 *             relações entre elas. É a camada que o cliente não vê e
 *             onde a maioria dos projetos quebra.
 * `design`    planos translúcidos se compondo — o próprio vocabulário
 *             da identidade, aqui na página que fala de identidade.
 * `business`  barras de leitura enchendo até seu valor — um painel
 *             sendo lido, que é literalmente o que se entrega.
 *
 * Tudo SVG e CSS dirigidos pelo scroll. Nenhuma imagem, nenhuma
 * biblioteca, nenhum laço de animação.
 */

/* Entidades e relações do modelo — as posições são o desenho. */
const NODES = [
  { id: "prod", x: 18, y: 26, w: 26, h: 13, label: "produto" },
  { id: "lote", x: 56, y: 18, w: 24, h: 11, label: "lote" },
  { id: "mov", x: 60, y: 46, w: 26, h: 12, label: "movimento" },
  { id: "loc", x: 14, y: 58, w: 22, h: 11, label: "local" },
  { id: "user", x: 40, y: 76, w: 22, h: 10, label: "operador" },
];
const EDGES = [
  ["prod", "lote"], ["lote", "mov"], ["prod", "loc"],
  ["lote", "loc"], ["mov", "user"], ["prod", "mov"],
];
const center = (n) => ({ cx: n.x + n.w / 2, cy: n.y + n.h / 2 });

/* Leituras do painel — valores relativos, não números inventados. */
const READINGS = [0.82, 0.46, 0.93, 0.31, 0.68, 0.55, 0.74, 0.24];

/* Planos que se compõem, para a aba de design. */
const PLANES = [
  { x: 8, y: 22, w: 34, h: 44, r: 0, o: 0.11 },
  { x: 26, y: 34, w: 38, h: 40, r: -3, o: 0.13 },
  { x: 50, y: 16, w: 32, h: 50, r: 4, o: 0.09 },
  { x: 62, y: 40, w: 28, h: 42, r: -6, o: 0.12 },
  { x: 36, y: 52, w: 34, h: 32, r: 2, o: 0.08 },
];

export default function PracticeSignature({ variant, caption }) {
  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <>
      <figure className={`mf-sig mf-sig--${variant}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img" aria-label={caption}>
          {variant === "systems" && (
            <g className="mf-sig__schema">
              {EDGES.map(([a, b], i) => {
                const A = center(nodeById[a]);
                const B = center(nodeById[b]);
                return (
                  <line
                    key={i} className="mf-sig__edge" style={{ "--i": i }}
                    pathLength="1"
                    x1={A.cx} y1={A.cy} x2={B.cx} y2={B.cy}
                  />
                );
              })}
              {NODES.map((n, i) => (
                <g key={n.id} className="mf-sig__node" style={{ "--i": i }}>
                  <rect x={n.x} y={n.y} width={n.w} height={n.h} />
                  <text x={n.x + 2.5} y={n.y + n.h / 2 + 1.4}>{n.label}</text>
                </g>
              ))}
            </g>
          )}

          {variant === "design" && (
            <g className="mf-sig__planes">
              {PLANES.map((p, i) => (
                <rect
                  key={i} className="mf-sig__plane" style={{ "--i": i, "--o": p.o }}
                  x={p.x} y={p.y} width={p.w} height={p.h}
                  transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
                />
              ))}
              <rect
                className="mf-sig__planeAccent"
                x={50} y={16} width={32} height={50}
                transform="rotate(4 66 41)"
              />
            </g>
          )}

          {variant === "business" && (
            <g className="mf-sig__panel">
              {READINGS.map((v, i) => {
                const y = 14 + i * 10;
                return (
                  <g key={i} className="mf-sig__row" style={{ "--i": i, "--v": v }}>
                    <line className="mf-sig__track" x1="24" y1={y} x2="92" y2={y} />
                    <line className="mf-sig__fill" pathLength="1" x1="24" y1={y} x2={24 + v * 68} y2={y} />
                    <line className="mf-sig__tick" x1="18" y1={y} x2="22" y2={y} />
                  </g>
                );
              })}
            </g>
          )}
        </svg>
        {caption && <figcaption className="mf-label">{caption}</figcaption>}
      </figure>

      <style>{`
.mf-sig{margin:0;padding:0 var(--gutter);max-width:var(--max-width-page);
  margin:0 auto;width:100%}
.mf-sig svg{display:block;width:100%;height:auto;aspect-ratio:16/10}
.mf-sig figcaption{margin-top:1rem}

/* --- modelo de dados: as relacoes se desenham, depois as entidades --- */
.mf-sig__edge{
  stroke:var(--color-divider);stroke-width:.35;
  /* pathLength="1" e ATRIBUTO do <line>, nao propriedade CSS — com ele
     o traco fica normalizado e o desenho independe do comprimento real
     de cada linha. Estava no CSS e por isso nao funcionava. */
  stroke-dasharray:1;stroke-dashoffset:1;
}
.mf-sig__node rect{
  fill:none;stroke:var(--color-text-primary);stroke-width:.45;
  opacity:0;
}
.mf-sig__node text{
  font-family:var(--font-mono);font-size:2.6px;letter-spacing:.14em;
  text-transform:uppercase;fill:var(--color-text-ghost);opacity:0;
}

/* --- planos que se compoem --- */
.mf-sig__plane{fill:var(--color-text-primary);opacity:0}
.mf-sig__planeAccent{
  fill:none;stroke:var(--color-accent);stroke-width:.4;opacity:0;
}

/* --- painel: as barras enchem ate a leitura --- */
.mf-sig__track{stroke:var(--color-divider);stroke-width:.3}
.mf-sig__fill{
  stroke:var(--color-text-primary);stroke-width:1.1;
  stroke-dasharray:1;stroke-dashoffset:1;
}
.mf-sig__row:nth-child(3) .mf-sig__fill{stroke:var(--color-accent)}
.mf-sig__tick{stroke:var(--color-text-ghost);stroke-width:.3}

@supports (animation-timeline: view()) and (animation-range: 0% 100%){
  @media (prefers-reduced-motion: no-preference){
    @keyframes mf-sig-draw{to{stroke-dashoffset:0}}
    @keyframes mf-sig-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
    @keyframes mf-sig-plane{from{opacity:0}to{opacity:var(--o)}}
    @keyframes mf-sig-accent{from{opacity:0}to{opacity:.85}}

    .mf-sig__edge{
      animation:mf-sig-draw linear both;animation-timeline:view();
      animation-range:entry calc(6% + var(--i) * 4%) cover calc(30% + var(--i) * 4%);
    }
    .mf-sig__node rect,.mf-sig__node text{
      animation:mf-sig-in linear both;animation-timeline:view();
      animation-range:entry calc(14% + var(--i) * 5%) cover calc(38% + var(--i) * 5%);
    }
    .mf-sig__plane{
      animation:mf-sig-plane linear both;animation-timeline:view();
      animation-range:entry calc(8% + var(--i) * 6%) cover calc(34% + var(--i) * 6%);
    }
    .mf-sig__planeAccent{
      animation:mf-sig-accent linear both;animation-timeline:view();
      animation-range:entry 40% cover 62%;
    }
    .mf-sig__fill{
      animation:mf-sig-draw linear both;animation-timeline:view();
      animation-range:entry calc(8% + var(--i) * 5%) cover calc(36% + var(--i) * 5%);
    }
  }
}

/* Sem linha do tempo de scroll, ou com movimento reduzido: o desenho
   aparece completo. Ele e informacao, nao so gesto. */
@supports not ((animation-timeline: view()) and (animation-range: 0% 100%)){
  .mf-sig__edge,.mf-sig__fill{stroke-dashoffset:0}
  .mf-sig__node rect,.mf-sig__node text{opacity:1}
  .mf-sig__plane{opacity:var(--o)}
  .mf-sig__planeAccent{opacity:.85}
}
@media (prefers-reduced-motion: reduce){
  .mf-sig__edge,.mf-sig__fill{stroke-dashoffset:0;animation:none}
  .mf-sig__node rect,.mf-sig__node text{opacity:1;animation:none}
  .mf-sig__plane{opacity:var(--o);animation:none}
  .mf-sig__planeAccent{opacity:.85;animation:none}
}
      `}</style>
    </>
  );
}
