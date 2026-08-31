import React from "react";
import { useLang } from "@/lib/i18n";
import { STRATA, ZONES, TOTAL_DEPTH } from "@/content/coreSample";

/**
 * A marca, em duas vidas.
 *
 * VIDA 1 — a extração. Na abertura, a coluna se forma camada por camada
 * conforme o visitante rola: o testemunho sendo puxado do solo. Cada
 * faixa entra de baixo, na ordem em que sedimentou.
 *
 * VIDA 2 — o instrumento. Terminada a extração, a coluna NÃO some. Ela
 * encolhe e estaciona na borda esquerda, onde passa a marcar onde o
 * visitante está na profundidade da página. Deixa de ser enfeite e vira
 * ferramenta de orientação.
 *
 * Essa é a razão de a marca ficar: uma marca que desaparece é enfeite;
 * uma que permanece e serve é sistema. Também resolve o problema de a
 * abertura "sumir" — ela não sai, ela se transforma.
 *
 * Tudo é dirigido pelo scroll em CSS, no thread do compositor. Nenhum
 * laço de animação, nenhuma imagem.
 */
export default function CoreSample({ variant = "opening" }) {
  const { lang } = useLang();
  const zones = ZONES[lang] ?? ZONES.en;

  let y = 0;
  const bands = STRATA.map((b, i) => {
    const top = (y / TOTAL_DEPTH) * 100;
    y += b.h;
    return { ...b, i, top, height: (b.h / TOTAL_DEPTH) * 100 };
  });

  // Onde cada zona começa, para a régua de rótulos.
  const marks = [];
  const seen = new Set();
  for (const b of bands) {
    if (!seen.has(b.zone)) {
      seen.add(b.zone);
      marks.push({ zone: b.zone, top: b.top, label: zones[b.zone] });
    }
  }

  return (
    <div className={`mf-core mf-core--${variant}`} data-variant={variant}>
      <div className="mf-core__tube">
        {bands.map((b) => (
          <span
            key={b.i}
            className={`mf-core__band is-${b.fill}`}
            style={{
              "--top": `${b.top}%`,
              "--h": `${b.height}%`,
              "--tone": b.tone,
              "--i": b.i,
              "--n": bands.length,
            }}
          />
        ))}
        <span className="mf-core__marker" aria-hidden="true" />
      </div>

      <div className="mf-core__ruler" aria-hidden="true">
        {marks.map((m) => (
          <span key={m.zone} className="mf-core__mark" style={{ "--top": `${m.top}%` }}>
            <i />
            <em>{m.label}</em>
          </span>
        ))}
      </div>
    </div>
  );
}
