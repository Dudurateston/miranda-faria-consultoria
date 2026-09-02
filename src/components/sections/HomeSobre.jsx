import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { REELS_URL } from "@/lib/site";

/** Preview do Sobre — reel "quem somos" + primeira linha da bio. */
export default function HomeSobre() {
  const { lang, path } = useLang();
  const t = copy[lang];

  return (
    <section className="mf-h">
      <div className="mf-h__inner mf-sobre">
        <figure className="mf-sobre__media">
          <video src={REELS_URL} autoPlay muted loop playsInline preload="metadata" />
        </figure>
        <div className="mf-sobre__text">
          <Reveal>
            <p className="mf-label">{t.home.sobrePreview.label}</p>
          </Reveal>
          <LineReveal className="mf-h__lead">{t.about.lead}</LineReveal>
          <Reveal delay={140}>
            <p className="mf-sobre__body">{t.about.body[0]}</p>
          </Reveal>
          <Reveal delay={200}>
            <Link to={path("about")} className="mf-h__cta" data-cursor="link">
              {t.home.sobrePreview.cta} →
            </Link>
          </Reveal>
        </div>
      </div>

      <style>{`
.mf-sobre{display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:center}
@media(min-width:860px){.mf-sobre{grid-template-columns:5fr 7fr;gap:clamp(2.5rem,6vw,5rem)}}
.mf-sobre__media{
  margin:0;max-width:380px;aspect-ratio:9/16;overflow:hidden;
  width:100%;justify-self:center;
}
.mf-sobre__media video{width:100%;height:100%;object-fit:cover;display:block}
.mf-sobre__body{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2rem 0 0;
}
      `}</style>
    </section>
  );
}