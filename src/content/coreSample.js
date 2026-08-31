/**
 * O TESTEMUNHO — a marca gerada em código.
 *
 * Não é uma letra. É o instrumento: a coluna que se extrai do solo para
 * ler as camadas na ordem em que assentaram. Escolhido no lugar do
 * monograma por três razões.
 *
 * 1. É a metáfora da marca virada objeto. "Profundidade revelada —
 *    superfície, sistema, dados, fundação" deixa de ser uma frase no
 *    documento e passa a ser a coisa que o visitante vê.
 * 2. Diz o que o Eduardo faz sem precisar de texto: ele abre um negócio
 *    e lê o que está embaixo, camada por camada.
 * 3. É código nativo. Banda, densidade, marca de profundidade — tudo
 *    número. Não há imagem para carregar, para vazar de domínio ou para
 *    perder resolução.
 *
 * As camadas abaixo NÃO são decorativas: são as quatro camadas do
 * método, subdivididas. Quem conhece a história lê a coluna; quem não
 * conhece vê um instrumento. As duas leituras funcionam.
 */

/**
 * Cada faixa é uma camada de sedimento.
 * - `h`    espessura relativa
 * - `fill` densidade visual: solid | hatch | dot | sparse | void
 * - `tone` peso do grafite, 0 a 1
 * - `tick` se ganha marca de profundidade na régua lateral
 * - `zone` a qual das quatro camadas do método pertence
 */
export const STRATA = [
  { h: 3.0, fill: "sparse", tone: 0.10, tick: true,  zone: "surface" },
  { h: 1.6, fill: "solid",  tone: 0.22, tick: false, zone: "surface" },
  { h: 2.4, fill: "hatch",  tone: 0.18, tick: false, zone: "surface" },
  { h: 1.1, fill: "void",   tone: 0.00, tick: false, zone: "surface" },

  { h: 4.2, fill: "solid",  tone: 0.42, tick: true,  zone: "system" },
  { h: 1.4, fill: "dot",    tone: 0.24, tick: false, zone: "system" },
  { h: 2.8, fill: "hatch",  tone: 0.34, tick: false, zone: "system" },
  { h: 1.0, fill: "void",   tone: 0.00, tick: false, zone: "system" },

  { h: 2.0, fill: "dot",    tone: 0.30, tick: true,  zone: "data" },
  { h: 3.6, fill: "solid",  tone: 0.58, tick: false, zone: "data" },
  { h: 1.3, fill: "hatch",  tone: 0.40, tick: false, zone: "data" },
  { h: 2.2, fill: "dot",    tone: 0.34, tick: false, zone: "data" },
  { h: 0.9, fill: "void",   tone: 0.00, tick: false, zone: "data" },

  // A veia de cobre: o único acento, e o mais fundo. Marca a fundação.
  { h: 1.2, fill: "copper", tone: 1.00, tick: true,  zone: "foundation" },
  { h: 5.4, fill: "solid",  tone: 0.78, tick: false, zone: "foundation" },
  { h: 2.6, fill: "hatch",  tone: 0.62, tick: false, zone: "foundation" },
  { h: 3.8, fill: "solid",  tone: 0.88, tick: false, zone: "foundation" },
];

/** Rótulo de cada zona, por idioma — usado na régua ao lado da coluna. */
export const ZONES = {
  en: { surface: "Surface", system: "System", data: "Data", foundation: "Foundation" },
  pt: { surface: "Superfície", system: "Sistema", data: "Dados", foundation: "Fundação" },
};

export const TOTAL_DEPTH = STRATA.reduce((s, b) => s + b.h, 0);

/** Onde cada zona começa e termina, em fração da coluna. */
export function zoneRanges() {
  const out = {};
  let y = 0;
  for (const b of STRATA) {
    if (!out[b.zone]) out[b.zone] = { from: y / TOTAL_DEPTH, to: 0 };
    y += b.h;
    out[b.zone].to = y / TOTAL_DEPTH;
  }
  return out;
}
