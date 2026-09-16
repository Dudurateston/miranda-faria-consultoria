import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import StrataPanel from "@/components/StrataPanel";

/** Preview da Tecnologia — stack real em regua editorial + M animado. */
export default function HomeTecnologia() {
  const { lang, path } = useLang();
  const t = copy[lang];

  return (
    <section className="mf-h">
      <div className="mf-h__inner mf-tech">
        <div>
          <Reveal>
            <p className="mf-label"><span className="mf-label__n">04</span>{t.home.techPreview.label}</p>
          </Reveal>
          <LineReveal className="mf-h__lead">{t.home.techPreview.lead}</LineReveal>
          <ul className="mf-tech__stack">
            {t.home.techPreview.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Reveal delay={200}>
            <Link to={path("how-i-work")} className="mf-h__cta" data-cursor="link">
              {t.home.techPreview.cta} →
            </Link>
          </Reveal>
        </div>
        <figure className="mf-tech__art" aria-hidden="true">
          <StrataPanel />
        </figure>
      </div>

      <style>{`
.mf-tech{display:grid;grid-template-columns:1fr;gap:3rem;align-items:center}
@media(min-width:860px){.mf-tech{grid-template-columns:7fr 5fr;gap:clamp(2.5rem,6vw,5rem);align-items:stretch}}
.mf-tech__stack{list-style:none;margin:2.25rem 0 0;padding:0}
.mf-tech__stack li{
  padding:0.9rem 0;border-bottom:1px solid var(--mf-rule);
  font-family:var(--font-mono);font-size:var(--text-body-md);
  letter-spacing:0.08em;color:var(--color-text-secondary);
}
.mf-tech__stack li:first-child{border-top:1px solid var(--mf-rule)}
.mf-tech__art{
  /* O corte fica do tamanho da grade de informacoes ao lado — a
     altura da linha vem do texto, o canvas apenas preenche. O canvas
     em absolute nao contribui com altura (evita o loop de
     realimentacao do ResizeObserver). */
  margin:0;position:relative;overflow:hidden;
  min-height:clamp(240px,32vh,360px);
}
@media(min-width:860px){.mf-tech__art{align-self:stretch;height:auto;min-height:0}}
.mf-strata__cv{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y}
.mf-strata__cv{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y}
@media(max-width:859px){.mf-tech__art{display:none}}
      `}</style>
    </section>
  );
}