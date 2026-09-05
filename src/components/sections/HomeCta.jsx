import React from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { WHATSAPP_URL_SITE, WATERMARK_GIF } from "@/lib/site";

/** CTA final — watermark M animado no fundo, "Vamos conversar" + WhatsApp. */
export default function HomeCta() {
  const { lang } = useLang();
  const t = copy[lang].home.finalCta;

  return (
    <section className="mf-h mf-cta">
      <img className="mf-cta__wm" src={WATERMARK_GIF} alt="" loading="lazy" width="640" height="360" aria-hidden="true" />
      <div className="mf-h__inner mf-cta__inner">
        <LineReveal className="mf-cta__lead">{t.lead}</LineReveal>
        <Reveal delay={180}>
          <a
            href={WHATSAPP_URL_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="mf-cta__btn"
            data-cursor="link"
          >
            {t.cta}
          </a>
        </Reveal>
      </div>

      <style>{`
.mf-h.mf-cta{
  text-align:center;overflow:hidden;
  padding-block:clamp(8.5rem,20vh,14rem);
}
.mf-cta__wm{
  position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);
  width:clamp(280px,46vw,560px);height:auto;aspect-ratio:16/9;opacity:0.28;pointer-events:none;user-select:none;
  -webkit-mask-image:radial-gradient(closest-side,black 54%,transparent 86%);
  mask-image:radial-gradient(closest-side,black 54%,transparent 86%);
}
.mf-cta__inner{
  position:relative;display:flex;flex-direction:column;align-items:center;gap:2.2rem;
}
.mf-cta__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:0;text-align:center;
}
.mf-cta__btn{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:var(--mf-terracotta);
  border:1px solid var(--mf-terracotta);
  padding:1.1rem 2.6rem;text-decoration:none;
  transition:box-shadow var(--duration-base) var(--ease-in-out),
             transform var(--duration-base) var(--ease-out-expo);
}
.mf-cta__btn:hover{
  box-shadow:0 0 36px rgba(179,122,96,0.45);
  transform:translateY(-2px);
}
@media(prefers-reduced-motion:reduce){.mf-cta__btn:hover{transform:none}}
      `}</style>
    </section>
  );
}