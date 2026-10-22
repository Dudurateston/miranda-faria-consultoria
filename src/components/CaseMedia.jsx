import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/lib/isMobile";

/**
 * Midia real de um case: capturas de tela e gravacao do sistema.
 *
 * Quando o case ainda nao tem midia, cai na moldura da marca em vez de
 * um retangulo vazio — mesma regra do ArtSlot. Nunca linka para o app
 * do cliente (DECISIONS.md): so imagem e video.
 *
 * O video roda mudo, em loop, e SO enquanto esta visivel. Um <video>
 * autoplay fora da viewport gasta bateria e banda de graca; o
 * IntersectionObserver aqui e a mesma regra de seguranca que vale para
 * qualquer elemento vivo do site.
 */
export default function CaseMedia({ media, name }) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [reduced, setReduced] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [media, isMobile]);

  const onTapVideo = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) vid.play().catch(() => {});
    else vid.pause();
  };

  // Sem midia: a moldura da marca segura o lugar de forma intencional.
  if (!media) {
    return (
      <>
        <figure className="mf-cm">
          <img
            className="mf-cm__img"
            src="/art/case-frame.webp"
            srcSet="/art/case-frame@800.webp 800w, /art/case-frame.webp 1600w"
            sizes="(max-width: 900px) 100vw, 1180px"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </figure>
        <style>{mediaCss}</style>
      </>
    );
  }

  const { dir, shots = 0, video = false, natural = false } = media;
  /* Piloto (3 cases): shots em proporcao intrinseca por ARQUIVO, sem cover 16:9.
     Verticais/quadradas ficam completas via contain, teto editorial 85vh, fundo osso.
     Roda 03 (512x917, original do Drive) renderiza no maximo na largura da fonte:
     sem upscale, sem detalhe inventado. Demais cases: comportamento 16:9 inalterado. */
  const SHOTS_DIMS = {
    "rota-forte/01": [1440, 900], "rota-forte/02": [1440, 900], "rota-forte/03": [1440, 900],
    "roda-agro-marca/01": [1600, 893], "roda-agro-marca/02": [892, 1600],
    "roda-agro-marca/03": [512, 917], "roda-agro-marca/04": [1600, 1600],
    "advogados-lco/01": [1440, 800], "advogados-lco/02": [1440, 800], "advogados-lco/03": [1600, 900],
  };
  const poster = `/work/${dir}/poster.webp`;

  return (
    <>
      <div className="mf-cm__set" ref={wrapRef}>
        {video && (
          <figure className="mf-cm mf-cm--blend">
            {/* Sem preferencia de movimento reduzida o video toca; com
                ela, fica so o quadro de poster. */}
            {reduced ? (
              <img className="mf-cm__img" src={poster} alt={`${name} — interface`} loading="lazy" />
            ) : (
              <video
                key={dir}
                ref={videoRef}
                className={`mf-cm__img${isMobile ? " mf-cm__img--tap" : ""}`}
                onClick={isMobile ? onTapVideo : undefined}
                poster={poster}
                muted
                loop
                playsInline
                preload="none"
                aria-label={`${name} — gravação da interface`}
              >
                <source src={`/work/${dir}/video.mp4`} type="video/mp4" />
              </video>
            )}
          </figure>
        )}

        {Array.from({ length: shots }, (_, i) => {
          const n = String(i + 1).padStart(2, "0");
          const dims = natural ? SHOTS_DIMS[`${dir}/${n}`] : null;
          const cap512 = natural && dir === "roda-agro-marca" && n === "03";
          return (
            <figure className={`mf-cm${natural ? " mf-cm--natural" : ""}`} key={n}>
              <img
                className={`mf-cm__img${cap512 ? " mf-cm__img--cap512" : ""}`}
                {...(dims ? { width: dims[0], height: dims[1], style: { aspectRatio: `${dims[0]} / ${dims[1]}` } } : {})}
                src={`/work/${dir}/${n}.webp`}
                {...(natural ? {} : {
                  srcSet: `/work/${dir}/${n}@800.webp 800w, /work/${dir}/${n}.webp 1600w`,
                  sizes: "(max-width: 900px) 100vw, 1180px",
                })}
                alt={`${name} — tela ${i + 1}`}
                loading="lazy"
                decoding="async"
              />
            </figure>
          );
        })}
      </div>
      <style>{mediaCss}</style>
    </>
  );
}

const mediaCss = `
.mf-cm__set{display:flex;flex-direction:column;gap:clamp(1rem,2.5vh,1.75rem)}
/* No mobile o video do case espera o toque — o cursor e o convite. */
.mf-cm__img--tap{cursor:pointer}
.mf-cm__img--tap:not(:playing){background-image:linear-gradient(transparent 96%, rgba(181,80,46,0.55) 96%)}
.mf-cm{margin:0;position:relative;background:var(--color-divider);overflow:hidden}
.mf-cm__img{
  display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;
  border:1px solid var(--color-divider);
}
/* Video do case: sem moldura — funde com a pagina. */
.mf-cm--blend{background:transparent;overflow:visible}
.mf-cm--blend .mf-cm__img{
  border:0;
  -webkit-mask-image:linear-gradient(180deg,transparent 0%,black 9%,black 91%,transparent 100%);
  mask-image:linear-gradient(180deg,transparent 0%,black 9%,black 91%,transparent 100%);
}
/* Piloto natural: sem cover, o arquivo manda na proporcao. Contain + teto 85vh
   mantem verticais/quadradas completas sobre fundo osso. O quadro (borda fina
   do divisor) e preservado igual. */
.mf-cm--natural{background:var(--bone)}
.mf-cm--natural .mf-cm__img{
  object-fit:contain;
  width:100%;height:auto;
  max-height:85vh;
}
.mf-cm--natural .mf-cm__img--cap512{max-width:512px;margin-inline:auto}
`;