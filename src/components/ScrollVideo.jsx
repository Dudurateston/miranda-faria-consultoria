import React, { useEffect, useRef, useState } from "react";

/**
 * Um sistema real, em movimento, que COMECA A TOCAR quando o visitante
 * chega nele.
 *
 * Por que na home: o trecho de trabalhos era tres nomes de case em
 * texto. Um portfolio que descreve sistemas em palavras esta pedindo
 * confianca; um que MOSTRA um rodando esta dando prova. E o momento em
 * que ele parte sozinho — nao num play que alguem precisa clicar — e o
 * que transforma uma imagem parada em algo vivo.
 *
 * Como se comporta, e por que cada regra existe:
 *
 * - `preload="none"`: nada e baixado ate o video se aproximar. Sem isso
 *   um MP4 de 1 MB entra no custo da primeira tela de todo visitante,
 *   inclusive de quem nunca rola ate aqui.
 * - Toca so DENTRO da viewport, e pausa ao sair. Video rodando fora da
 *   tela gasta bateria e banda sem ninguem ver — a mesma regra de
 *   seguranca que vale para qualquer elemento vivo do site.
 * - Mudo, em laco, `playsInline`. Som que parte sozinho e motivo para
 *   fechar a aba, e sem `playsInline` o iOS abre o video em tela cheia
 *   por conta propria, sequestrando a pagina.
 * - `prefers-reduced-motion`: fica o quadro de poster, parado. A imagem
 *   continua provando a mesma coisa.
 * - O `play()` pode ser recusado pelo navegador (economia de bateria,
 *   politica de midia). O `catch` deixa o poster no lugar em vez de
 *   estourar — a secao nunca depende do video para fazer sentido.
 */
export default function ScrollVideo({ src, poster, label, caption }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const vid = videoRef.current;
    if (!wrap || !vid) return;

    // Dois limiares diferentes de proposito: entra quando ja esta bem
    // visivel (parece que comecou porque o visitante chegou, nao porque
    // a borda tocou a tela) e sai assim que some de vez.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.4) vid.play().catch(() => {});
          else if (e.intersectionRatio === 0) vid.pause();
        }
      },
      { threshold: [0, 0.4] }
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, [reduced, src]);

  return (
    <figure className="mf-sv" ref={wrapRef}>
      <div className="mf-sv__frame">
        {reduced ? (
          <img className="mf-sv__media" src={poster} alt={label} loading="lazy" decoding="async" />
        ) : (
          <video
            ref={videoRef}
            className="mf-sv__media"
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={label}
          >
            <source src={src} type="video/mp4" />
          </video>
        )}
      </div>
      {caption && <figcaption className="mf-label mf-sv__cap">{caption}</figcaption>}

      <style>{`
.mf-sv{margin:0}
.mf-sv__frame{
  position:relative;overflow:hidden;
  background:var(--color-divider);
  border:1px solid var(--color-divider);
}
.mf-sv__media{
  display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;
}
/* Legenda em secundario, nao no tom fantasma dos rotulos: ela nomeia o
   sistema que esta rodando, entao e informacao, nao enfeite — e ainda
   fica na tela enquanto a rampa de fundo atravessa. */
.mf-sv__cap{
  display:block;margin-top:0.85rem;
  color:var(--color-text-secondary);
}
      `}</style>
    </figure>
  );
}
