import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { CELESTE_GIF } from "@/lib/site";

/**
 * Preview do Diagnóstico — a home vende a ferramenta, não a lista.
 * Pergunta-lead, tres dores como chips e o CTA. A carta celeste fica
 * de contraponto visual, no peso da home.
 */
export default function HomeInsights() {
  const { lang, path } = useLang();
  const t = copy[lang];
  const d = t.diag;
  const tp = t.home.insightsPreview;

  return (
    <section className="mf-h">
      <div className="mf-h__inner mf-dgprev">
        <div>
          <Reveal>
            <p className="mf-label">{tp.label}</p>
          </Reveal>
          <LineReveal className="mf-h__lead">{tp.lead}</LineReveal>
          <Reveal delay={120}>
            <p className="mf-dgprev__intro">{tp.intro}</p>
          </Reveal>
          <div className="mf-dgprev__chips">
            {d.pains.slice(0, 3).map((p) => (
              <span key={p.id} className="mf-dgprev__chip">{p.t}</span>
            ))}
          </div>
          <Reveal delay={200}>
            <Link to={path("insights")} className="mf-h__cta" data-cursor="link">
              {tp.cta} →
            </Link>
          </Reveal>
        </div>
        <Reveal delay={180} className="mf-dgprev__artwrap">
          <figure className="mf-dgprev__art">
            <img src={CELESTE_GIF} alt="" loading="lazy" />
          </figure>
        </Reveal>
      </div>

      <style>{`
.mf-dgprev{display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:end}
@media(min-width:860px){.mf-dgprev{grid-template-columns:7fr 5fr;gap:clamp(2.5rem,6vw,5rem)}}
.mf-dgprev__intro{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:44ch;margin:1.75rem 0 0;
}
.mf-dgprev__chips{display:flex;flex-wrap:wrap;gap:0.6rem;margin-top:1.75rem}
.mf-dgprev__chip{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);
  border:1px solid var(--color-divider);padding:0.55rem 0.9rem;
}
.mf-dgprev__artwrap{display:none}
@media(min-width:860px){.mf-dgprev__artwrap{display:block}}
.mf-dgprev__art{margin:0;aspect-ratio:4/3;overflow:hidden;border:1px solid var(--color-divider)}
.mf-dgprev__art img{width:100%;height:100%;object-fit:cover;display:block}
      `}</style>
    </section>
  );
}
