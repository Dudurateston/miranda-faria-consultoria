/**
 * A leitura do Raio-X — logica pura, sem React e sem DOM.
 *
 * Cada resposta carrega peso para uma ou mais das quatro camadas
 * (`surface`, `system`, `data`, `foundation`). Peso ALTO significa
 * camada FINA: a opcao "so eu sei o preco" pesa em `system` e `data`
 * porque e exatamente ali que falta estrutura.
 *
 * O resultado nao e nota. Nota e vaidade e nao gera conversa — nomear a
 * camada mais fina reusa o modelo que /how-i-work ja ensinou e da ao
 * CTA um assunto concreto.
 *
 * Fica em arquivo proprio para poder ser exercitado sem navegador.
 */

export const CAMADAS = ["surface", "system", "data", "foundation"];

/** Peso maximo que uma camada pode acumular, para normalizar a barra. */
export function tetoPorCamada(questions) {
  const teto = Object.fromEntries(CAMADAS.map((c) => [c, 0]));
  for (const q of questions) {
    for (const c of CAMADAS) {
      // O pior caso de cada pergunta: a opcao que mais pesa nesta camada.
      const pior = Math.max(0, ...q.options.map((o) => o.w?.[c] ?? 0));
      teto[c] += pior;
    }
  }
  return teto;
}

/**
 * @param {Array} questions  as perguntas do idioma corrente
 * @param {Array<number>} respostas  indice da opcao escolhida em cada pergunta
 * @returns {{pesos, solidez, maisFina: string|null, tudoSolido: boolean}}
 *   `solidez` vai de 0 (camada oca) a 1 (camada inteira) e e o que a
 *   barra desenha. `maisFina` e null quando ninguem acusou nada.
 */
export function lerRaioX(questions, respostas) {
  const pesos = Object.fromEntries(CAMADAS.map((c) => [c, 0]));

  respostas.forEach((idx, i) => {
    const opt = questions[i]?.options?.[idx];
    if (!opt) return;
    for (const [camada, peso] of Object.entries(opt.w ?? {})) {
      if (camada in pesos) pesos[camada] += peso;
    }
  });

  const teto = tetoPorCamada(questions);
  const solidez = Object.fromEntries(
    CAMADAS.map((c) => [c, teto[c] ? 1 - pesos[c] / teto[c] : 1])
  );

  if (CAMADAS.every((c) => pesos[c] === 0)) {
    return { pesos, solidez, maisFina: null, tudoSolido: true };
  }

  // A comparacao e PROPORCIONAL, nao pelo peso cru. Camadas aparecem em
  // numeros diferentes de perguntas, entao somar pontos direto premiaria
  // a camada mais perguntada: na primeira versao `surface` so vencia em
  // 22 de 4096 combinacoes, o que num site de designer e o instrumento
  // mentindo. Comparando quanto de cada teto foi atingido, uma camada
  // tocada por duas perguntas concorre de igual para igual com uma
  // tocada por quatro.
  const razao = (c) => (teto[c] ? pesos[c] / teto[c] : 0);
  const pior = Math.max(...CAMADAS.map(razao));

  // Empate resolve para a camada MAIS FUNDA. E o que o proprio site
  // argumenta: abaixo da linha do horizonte esta onde a maioria dos
  // projetos quebra em silencio, e um problema de fundacao custa mais
  // caro que um de superficie.
  const maisFina = [...CAMADAS].reverse().find((c) => razao(c) === pior);

  return { pesos, solidez, maisFina, tudoSolido: false };
}
