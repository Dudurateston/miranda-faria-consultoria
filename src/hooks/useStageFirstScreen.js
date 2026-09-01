import { useEffect } from "react";

/**
 * Desliga a animacao de entrada do que JA esta na primeira tela.
 *
 * O problema que isto resolve: `.mf-stage > *` anima com
 * `animation-range: entry 8% cover 34%`, uma faixa medida pela ENTRADA
 * do elemento na viewport. Um item que ja aparece pela metade no
 * carregamento cai no meio dessa faixa e nasce em opacidade parcial —
 * medido em /work, a segunda linha da lista ficava em 0,41 e lia como
 * item desabilitado, com o titulo do case em 52px pela metade.
 *
 * Pior: contraste medido em cima de `color` calculada NAO enxerga
 * opacidade herdada, entao esse texto passava na auditoria e sumia para
 * quem le. E a mesma familia de falha que ja levou o corpo da home a
 * 1,02:1 neste projeto.
 *
 * "Ja estava visivel quando a pagina carregou" nao e uma condicao que o
 * CSS saiba exprimir, entao a marcacao vem daqui: no primeiro quadro
 * depois de cada troca de rota, todo filho de `.mf-stage` que ja esta
 * dentro da viewport recebe `data-instant`, e o CSS o deixa em paz.
 *
 * Roda uma vez por rota e nao observa scroll: o que entra depois deve
 * mesmo animar — e esse o proposito do gesto.
 */
/** Marca agora quem esta na tela. Exportado a parte porque trocar a rota
 *  nao e o unico jeito de mudar o que esta visivel: filtrar uma lista
 *  troca o conjunto inteiro sem mexer na URL, e sem remarcar os itens
 *  novos que caem na primeira tela nascem desbotados de novo. */
export function markStageFirstScreen() {
  const vh = window.innerHeight;
  for (const el of document.querySelectorAll(".mf-stage > *")) {
    const r = el.getBoundingClientRect();
    // Qualquer parte visivel conta: e o pedaco visivel que aparece
    // desbotado, entao e ele que decide.
    if (r.top < vh && r.bottom > 0) el.setAttribute("data-instant", "");
    else el.removeAttribute("data-instant");
  }
}

/** Agenda a marcacao para depois do layout assentar. Devolve o cancelador. */
export function scheduleStageMark() {
  // Dois quadros: um para o React montar, outro para o layout assentar
  // com as fontes e as imagens ja medidas. Marcar cedo demais mediria
  // posicoes que ainda vao mudar.
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(markStageFirstScreen);
  });
  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
  };
}

export function useStageFirstScreen(key) {
  useEffect(() => scheduleStageMark(), [key]);
}
