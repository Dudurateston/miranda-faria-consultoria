import React from "react";

/**
 * 404 DA CASA (Eduardo 17/09): o boilerplate slate do Base44 em ingles
 * era um erro de percepcao — quem caia numa URL morta via um template
 * generico. Agora: osso, mono, display, filete de cobre, PT/EN pela URL.
 */
const COPY = {
  pt: {
    label: "Erro 404",
    title: "Essa página não existe",
    body: "O endereço mudou de lugar ou nunca existiu. O caminho de volta está logo abaixo.",
    cta: "Voltar ao início",
    alt: "Ver os trabalhos",
  },
  en: {
    label: "Error 404",
    title: "This page does not exist",
    body: "The address moved or never existed. The way back is right below.",
    cta: "Back to the start",
    alt: "See the work",
  },
};

export default function PageNotFound() {
  const lang = window.location.pathname.startsWith("/en") ? "en" : "pt";
  const t = COPY[lang];
  const home = lang === "en" ? "/en" : "/pt";
  const work = lang === "en" ? "/en/work" : "/pt/work";

  return (
    <div className="mf-404" data-theme="on-bone">
      <style>{`
.mf-404{
  min-height:100vh;background:var(--color-bg);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:0 var(--gutter,24px);text-align:center;
}
.mf-404__label{
  font-family:var(--font-mono,monospace);font-size:11px;
  letter-spacing:var(--tracking-label,0.18em);text-transform:uppercase;
  color:var(--color-text-ghost);margin:0;
}
.mf-404__title{
  font-family:var(--font-display,serif);font-weight:400;
  font-size:clamp(2.2rem,6vw,3.6rem);line-height:1.08;
  letter-spacing:0.01em;color:var(--color-text-primary);
  margin:0.9rem 0 0;
}
.mf-404__rule{
  width:clamp(2.5rem,6vw,4rem);height:1px;
  background:var(--copper,#B5502E);margin:1.6rem auto;
}
.mf-404__body{
  font-family:var(--font-body,sans-serif);font-weight:300;
  font-size:1rem;line-height:1.7;
  color:var(--color-text-secondary);margin:0;max-width:34ch;
}
.mf-404__ctas{display:flex;gap:0.9rem;margin-top:2.4rem;flex-wrap:wrap;justify-content:center}
.mf-404__cta{
  font-family:var(--font-mono,monospace);font-size:var(--text-label,11px);
  letter-spacing:var(--tracking-label,0.18em);text-transform:uppercase;
  text-decoration:none;padding:1rem 1.9rem;min-height:44px;
  display:inline-flex;align-items:center;justify-content:center;
  transition:transform 0.3s var(--ease-out-expo,cubic-bezier(0.16,1,0.3,1));
}
.mf-404__cta:hover{transform:translateY(-2px)}
.mf-404__cta--pri{
  color:#F5F1EA;background:var(--copper,#B5502E);border:1px solid var(--copper,#B5502E);
}
.mf-404__cta--pri:hover{background:#8F3E1F;border-color:#8F3E1F}
.mf-404__cta--sec{
  color:var(--color-text-primary);background:transparent;
  border:1px solid var(--color-divider,rgba(26,26,24,0.18));
}
.mf-404__cta--sec:hover{border-color:var(--color-text-primary)}
      `}</style>
      <p className="mf-404__label">{t.label}</p>
      <h1 className="mf-404__title">{t.title}</h1>
      <div className="mf-404__rule" aria-hidden="true" />
      <p className="mf-404__body">{t.body}</p>
      <div className="mf-404__ctas">
        <a className="mf-404__cta mf-404__cta--pri" href={home} data-cursor="link">{t.cta}</a>
        <a className="mf-404__cta mf-404__cta--sec" href={work} data-cursor="link">{t.alt}</a>
      </div>
    </div>
  );
}
