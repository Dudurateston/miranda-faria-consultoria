import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/** Preview da Tecnologia — stack real em regua editorial + M animado. */
export default function HomeTecnologia() {
  const { lang, path } = useLang();
  const t = copy[lang];

  return (
    <section className="mf-h">
      <div className="mf-h__inner mf-tech">
        <div>
          <Reveal>
            <p className="mf-label">{t.home.techPreview.label}</p>
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
          <span className="mf-strata">
            {[...Array(7)].map((_, i) => (
              <span
                key={i}
                className="mf-strata__l"
                style={{ width: `${100 - i * 11}%`, animationDelay: `${0.35 + i * 0.4}s` }}
              />
            ))}
            <span className="mf-strata__l mf-strata__l--copper" style={{ width: "55%", animationDelay: "2.9s" }} />
          </span>
        </figure>
      </div>

      <style>{`
.mf-tech{display:grid;grid-template-columns:1fr;gap:3rem;align-items:center}
@media(min-width:860px){.mf-tech{grid-template-columns:7fr 5fr;gap:clamp(2.5rem,6vw,5rem)}}
.mf-tech__stack{list-style:none;margin:2.25rem 0 0;padding:0}
.mf-tech__stack li{
  padding:0.9rem 0;border-bottom:1px solid var(--mf-rule);
  font-family:var(--font-mono);font-size:var(--text-body-md);
  letter-spacing:0.08em;color:var(--color-text-secondary);
}
.mf-tech__stack li:first-child{border-top:1px solid var(--mf-rule)}
.mf-tech__art{
  margin:0;display:flex;justify-content:center;align-items:stretch;
  min-height:clamp(240px,32vh,360px);
}
@media(min-width:860px){.mf-tech__art{align-self:stretch;min-height:100%}}
.mf-strata{
  display:flex;flex-direction:column-reverse;justify-content:space-between;
  width:100%;height:100%;max-width:none;padding:clamp(10px,2vh,20px) 0;
}
.mf-strata__l{
  display:block;height:1px;background:rgba(242,238,230,0.55);
  opacity:0;
  animation:mf-strata-cycle 10s var(--ease-in-out) infinite;
}
.mf-strata__l--copper{height:2px;background:var(--copper)}
@keyframes mf-strata-cycle{
  0%{opacity:0;transform:translateY(clamp(20px,4vh,40px))}
  8%{opacity:1;transform:translateY(0)}
  82%{opacity:1;transform:translateY(0)}
  94%,100%{opacity:0;transform:translateY(0)}
}
@media(prefers-reduced-motion:reduce){.mf-strata__l{animation:none;opacity:1;transform:none}}
      `}</style>
    </section>
  );
}