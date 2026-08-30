import React from "react";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/**
 * Hero estavel enquanto o elemento vivo/autonomo nao entra.
 *
 * Deliberadamente sem imagem: a arte do M vive hoje num app Base44
 * diferente deste site, e foi exatamente essa dependencia externa que
 * quebrou o shader de metal liquido por CORS (CLAUDE.md, historico
 * tecnico 2). Enquanto os assets nao vierem para dentro do repositorio,
 * a abertura e tipografica.
 */
export default function StaticHero() {
  const { lang } = useLang();
  const t = copy[lang].home;

  return (
    <>
      <section className="mf-hero" id="topo" aria-label={`${t.wordmark} — ${t.role}`}>
        <div className="mf-hero__center">
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
  background:var(--bone);position:relative;padding:0 var(--gutter);
}
.mf-hero__center{text-align:center}
.mf-hero__mark{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(1.75rem,5vw,3.5rem);
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  line-height:1;color:var(--ink);margin:0;
}
.mf-hero__role{
  font-family:var(--font-mono);font-weight:400;
  font-size:var(--text-label);letter-spacing:0.42em;text-transform:uppercase;
  color:var(--stone);margin:1.25rem 0 0;
}
.mf-hero__scroll{
  position:absolute;bottom:2.25rem;left:50%;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--stone);
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
