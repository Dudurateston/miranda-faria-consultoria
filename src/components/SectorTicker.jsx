import React from "react";

// Marquise infinita horizontal. Texto repetido, JetBrains Mono 10px,
// caixa alta, letter-spacing 0.34em, cor ghost, separador "·" em cobre.
// Faixa de 44px com linha de 1px em cima e embaixo, fundo transparente,
// loop linear de 40s. Pausa quando prefers-reduced-motion está ativo.
const items = [
  "AUTOPEÇAS",
  "TRANSPORTE",
  "LOGÍSTICA",
  "AGRONEGÓCIO",
  "ALIMENTOS",
  "SERVIÇOS PROFISSIONAIS",
  "RECURSOS HUMANOS",
  "ENERGIA",
];

function Group() {
  return (
    <span className="mf-ticker__group" aria-hidden="true">
      {items.map((w, i) => (
        <span className="mf-ticker__item" key={i}>
          <span className="mf-ticker__word">{w}</span>
          <span className="mf-ticker__dot">·</span>
        </span>
      ))}
    </span>
  );
}

export default function SectorTicker() {
  return (
    <>
      <div className="mf-ticker" aria-hidden="true">
        <div className="mf-ticker__track">
          <Group />
          <Group />
        </div>
      </div>
      <style>{`
.mf-ticker{height:44px;border-top:1px solid var(--color-divider);border-bottom:1px solid var(--color-divider);background:transparent;overflow:hidden;display:flex;align-items:center}
.mf-ticker__track{display:inline-flex;flex-wrap:nowrap;white-space:nowrap;will-change:transform;animation:mf-ticker 40s linear infinite}
.mf-ticker__group{display:inline-flex;flex-wrap:nowrap;align-items:center;flex-shrink:0}
.mf-ticker__item{display:inline-flex;align-items:center}
.mf-ticker__word{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:0.34em;color:var(--color-text-ghost)}
.mf-ticker__dot{color:var(--color-text-ghost);font-size:10px;margin:0 0.9rem}
@keyframes mf-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.mf-ticker__track{animation-play-state:paused}}
      `}</style>
    </>
  );
}