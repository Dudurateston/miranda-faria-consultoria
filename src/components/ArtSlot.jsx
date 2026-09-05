import React, { useEffect, useState } from "react";

/**
 * Espaco de assinatura visual de uma pagina.
 *
 * A regra da arquitetura e que nao pode existir moldura vazia: uma
 * moldura prometendo imagem que nao chegou e pior do que uma pagina que
 * nunca prometeu. Entao este componente NAO renderiza um <img> torto
 * enquanto o arquivo nao existe — ele pre-carrega, e so troca o
 * desenho procedural pela arte quando a imagem confirma que carregou.
 *
 * Enquanto a arte da Lovart nao entra em /public/art/, o fallback e uma
 * faixa de estratos gerada em SVG, propria de cada vertical. Nao e
 * placeholder: e o motivo da marca desenhado com codigo, e continua
 * valendo se a arte nunca vier.
 */

const VARIANTS = {
  // Prancha virando estrutura: linhas finas a esquerda, planos solidos a direita.
  systems: (id) => (
    <>
      {[...Array(9)].map((_, i) => (
        <line
          key={`l${i}`}
          x1="2"
          y1={8 + i * 9}
          x2={30 + i * 1.5}
          y2={8 + i * 9}
          stroke="var(--color-divider)"
          strokeWidth="0.4"
        />
      ))}
      {[...Array(4)].map((_, i) => (
        <rect
          key={`r${i}`}
          x={44 + i * 11}
          y={14 + i * 6}
          width={20}
          height={54 - i * 8}
          fill="var(--color-text-primary)"
          opacity={0.06 + i * 0.045}
        />
      ))}
      <line x1="40" y1="4" x2="40" y2="92" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.7" />
    </>
  ),

  // Planos se compondo: alguns alinhados, outros ainda fora de eixo.
  design: (id) => (
    <>
      {[
        { x: 10, y: 18, w: 30, h: 40, r: 0, o: 0.1 },
        { x: 26, y: 30, w: 34, h: 36, r: 0, o: 0.13 },
        { x: 48, y: 12, w: 28, h: 46, r: -4, o: 0.09 },
        { x: 62, y: 34, w: 26, h: 38, r: 6, o: 0.12 },
        { x: 36, y: 46, w: 32, h: 30, r: -2, o: 0.08 },
      ].map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={p.w}
          height={p.h}
          transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
          fill="var(--color-text-primary)"
          opacity={p.o}
        />
      ))}
      <rect
        x="48"
        y="12"
        width="28"
        height="46"
        transform="rotate(-4 62 35)"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="0.5"
        opacity="0.8"
      />
    </>
  ),

  // Testemunho de sondagem: coluna de camadas com densidades diferentes.
  business: (id) => (
    <>
      {[
        6, 3, 9, 4, 7, 2, 11, 5, 8, 3, 6, 4,
      ].reduce(
        (acc, h, i) => {
          const y = acc.y;
          acc.nodes.push(
            <rect
              key={i}
              x="34"
              y={y}
              width="32"
              height={h}
              fill={i === 7 ? "var(--color-accent)" : "var(--color-text-primary)"}
              opacity={i === 7 ? 0.75 : 0.05 + (i % 4) * 0.05}
            />
          );
          acc.nodes.push(
            <line
              key={`t${i}`}
              x1="28"
              y1={y + h / 2}
              x2="32"
              y2={y + h / 2}
              stroke="var(--color-divider)"
              strokeWidth="0.4"
            />
          );
          acc.y = y + h + 1.2;
          return acc;
        },
        { y: 8, nodes: [] }
      ).nodes}
    </>
  ),
};

/**
 * `name` e o nome base em /public/art, sem extensao. O componente monta
 * o srcset de duas larguras a partir dele: nome.webp e nome@800.webp.
 */
export default function ArtSlot({ variant = "systems", name, alt = "" }) {
  const [art, setArt] = useState(null);
  const src = name ? `/art/${name}.webp` : null;

  useEffect(() => {
    if (!src) return;
    let alive = true;
    const img = new Image();
    img.onload = () => alive && setArt(src);
    img.onerror = () => alive && setArt(null); // segue com o desenho procedural
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);

  // Taxonomia nova de servicos reaproveita as assinaturas visuais: a
  // gestao herda o traco de planta (systems), o desenvolvimento herda
  // o testemunho geologico (business), o design fica com os planos.
  const VARIANT_ALIAS = { gestao: "systems", desenvolvimento: "business", design: "design" };
  const key = VARIANT_ALIAS[variant] ?? variant;
  const draw = VARIANTS[key] ?? VARIANTS.systems;

  return (
    <>
      <figure className="mf-art">
        {art ? (
          <img
            className="mf-art__img"
            src={art}
            srcSet={`/art/${name}@800.webp 800w, /art/${name}.webp 1600w`}
            sizes="(max-width: 900px) 100vw, 1180px"
            alt={alt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <svg
            className="mf-art__svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={alt}
          >
            {draw(variant)}
          </svg>
        )}
      </figure>

      <style>{`
.mf-art{
  margin:0;padding:0 var(--gutter);
  max-width:var(--max-width-page);margin:0 auto;
  width:100%;
}
.mf-art__img,.mf-art__svg{
  display:block;width:100%;height:auto;
  aspect-ratio:16/9;object-fit:contain;
}
      `}</style>
    </>
  );
}
