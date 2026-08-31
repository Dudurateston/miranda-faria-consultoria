import React from "react";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import LivingHero from "@/components/LivingHero";

/**
 * Hero estavel enquanto o elemento vivo/autonomo nao entra.
 *
 * A arte agora e servida do proprio dominio, em /public/art — nao mais
 * de um app Base44 externo, que foi o que quebrou o shader por CORS
 * (CLAUDE.md, historico tecnico 2). Como e imagem local, qualquer
 * efeito futuro que precise ler pixels dela ja esta liberado.
 *
 * Isto ainda nao e o elemento vivo/autonomo que a direcao criativa
 * pede — e uma abertura estatica forte enquanto o sistema de particulas
 * nao existe.
 */
export default function StaticHero() {
  const { lang } = useLang();
  const t = copy[lang].home;

  return (
    <>
      <section className="mf-hero" id="topo" aria-label={`${t.wordmark} — ${t.role}`}>
        <LivingHero />

        <div className="mf-hero__center">
          <img
            className="mf-hero__art"
            src="/art/hero.webp"
            srcSet="/art/hero@800.webp 800w, /art/hero.webp 1600w"
            sizes="(max-width: 900px) 92vw, 1100px"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <h1 className="mf-hero__mark">{t.wordmark}</h1>
          <p className="mf-hero__role">{t.role}</p>
        </div>
        <span className="mf-hero__scroll" aria-hidden="true">
          {t.scrollHint}
        </span>
      </section>

      <style>{`
.mf-hero{
  min-height:100vh;min-height:100svh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:transparent;position:relative;padding:0 var(--gutter);
}
.mf-hero__center{text-align:center;display:flex;flex-direction:column;align-items:center;
  width:100%;max-width:1100px;position:relative;z-index:1}
.mf-hero__art{
  display:block;width:100%;height:auto;max-height:52vh;object-fit:contain;
  margin-bottom:clamp(1.5rem,4vh,3rem);
  /* A arte entra sozinha na carga, sem depender de scroll: e o unico
     momento da pagina em que o visitante ainda nao rolou nada. */
  animation:mf-hero-settle 1400ms var(--ease-out-expo) both;
}
@keyframes mf-hero-settle{
  from{opacity:0;transform:translateY(18px) scale(0.985)}
  to{opacity:1;transform:none}
}
@media(prefers-reduced-motion:reduce){
  .mf-hero__art{animation:none}
}
.mf-hero__mark{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(1.75rem,5vw,3.5rem);
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  line-height:1;color:var(--color-text-primary);margin:0;
}
.mf-hero__role{
  font-family:var(--font-mono);font-weight:400;
  font-size:var(--text-label);letter-spacing:0.42em;text-transform:uppercase;
  color:var(--color-text-secondary);margin:1.25rem 0 0;
}
.mf-hero__scroll{
  position:absolute;bottom:2.25rem;left:50%;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
  animation:mf-hero-breathe 3.2s var(--ease-in-out) infinite;
}
@keyframes mf-hero-breathe{
  0%,100%{opacity:0.45;transform:translate(-50%,0)}
  50%{opacity:1;transform:translate(-50%,5px)}
}
@media(prefers-reduced-motion:reduce){
  .mf-hero__scroll{animation:none;opacity:0.7}
}
      `}</style>
    </>
  );
}
