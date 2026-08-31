import React, { useEffect, useRef, useState } from "react";

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
  }, [media]);

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

  const { dir, shots = 0, video = false } = media;
  const poster = `/work/${dir}/poster.webp`;

  return (
    <>
      <div className="mf-cm__set" ref={wrapRef}>
        {video && (
          <figure className="mf-cm">
            {/* Sem preferencia de movimento reduzida o video toca; com
                ela, fica so o quadro de poster. */}
            {reduced ? (
              <img className="mf-cm__img" src={poster} alt={`${name} — interface`} loading="lazy" />
            ) : (
              <video
                ref={videoRef}
                className="mf-cm__img"
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
          return (
            <figure className="mf-cm" key={n}>
              <img
                className="mf-cm__img"
                src={`/work/${dir}/${n}.webp`}
                srcSet={`/work/${dir}/${n}@800.webp 800w, /work/${dir}/${n}.webp 1600w`}
                sizes="(max-width: 900px) 100vw, 1180px"
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
.mf-cm{margin:0;position:relative;background:var(--color-divider);overflow:hidden}
.mf-cm__img{
  display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;
  border:1px solid var(--color-divider);
}
`;
