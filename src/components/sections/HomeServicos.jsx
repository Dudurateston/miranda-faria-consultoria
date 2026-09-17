import React from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy, getPractice } from "@/content/copy";
import {
  NAV_MEDIA,
  WHATSAPP_URL_BARE,
} from "@/lib/site";
import AutoVideo from "@/components/AutoVideo";

/**
 * As quatro soluções em LINHAS estilo spence — scroll reveal em cascata,
 * hover que apaga as irmãs e ressalta a atual, preview em vídeo à direita.
 * A copy do card já entrega a dor e o resultado; o CTA direto de WhatsApp
 * embaixo tira o atrito de quem já se decidiu.
 */
const VERTICALS = [
  { slug: "gestao", gif: NAV_MEDIA.solutions.gestao },
  { slug: "desenvolvimento", gif: NAV_MEDIA.solutions.desenvolvimento },
  { slug: "design", gif: NAV_MEDIA.solutions.design },
  { slug: "automacao", gif: NAV_MEDIA.solutions.automacao },
];

export default function HomeServicos() {
  const { lang, path } = useLang();
  const t = copy[lang];

  return (
    <section className="mf-h">
      <div className="mf-h__inner">
        <Reveal>
          <p className="mf-label"><span className="mf-label__n">02</span>{t.servicos.label}</p>
        </Reveal>
        <LineReveal className="mf-h__lead">{t.servicos.lead}</LineReveal>

        <div className="mf-srows">
          {VERTICALS.map(({ slug, gif }, i) => {
            const p = getPractice(lang, slug);
            if (!p) return null;
            return (
              <Reveal key={slug} delay={i * 110}>
                <Link to={path(slug)} className="mf-srow" data-cursor="link">
                  <span className="mf-srow__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mf-srow__body">
                    <span className="mf-srow__name">{p.label}</span>
                    <span className="mf-srow__desc">{t.servicos.cards?.[slug] ?? p.lead}</span>
                    <span className="mf-srow__go">{t.servicos.seeVertical} →</span>
                  </span>
                  <span className="mf-srow__media">
                    <AutoVideo className="mf-srow__gif" src={gif} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={140} className="mf-srows__direct">
          <a href={WHATSAPP_URL_BARE} target="_blank" rel="noopener noreferrer" data-cursor="link">
            {t.servicos.cta} <span aria-hidden="true">→</span>
          </a>
        </Reveal>

        <div className="mf-metrics">
          {t.servicos.metrics.map((m, i) => (
            <Reveal key={i} delay={i * 90} className="mf-metric">
              <span className="mf-metric__n">{m.n}</span>
              <span className="mf-metric__d">{m.d}</span>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
.mf-srows{margin-top:3.5rem;border-top:1px solid var(--mf-rule)}
.mf-srow{
  display:grid;grid-template-columns:3.2rem 1fr 150px;
  gap:clamp(1rem,3vw,2.4rem);align-items:center;
  padding:clamp(1.3rem,2.6vw,2rem) 0;
  border-bottom:1px solid var(--mf-rule);
  transition:opacity 0.45s ease, padding 0.45s cubic-bezier(0.22,1,0.36,1);
}
.mf-srows:hover .mf-srow:not(:hover){opacity:0.32}
.mf-srow:hover{padding-left:0.9rem;padding-right:0.35rem}
.mf-srow:hover .mf-srow__num{color:var(--mf-copper-text,#A6481F);text-indent:0.25rem}
.mf-srow__num{
  font-family:var(--font-mono);font-size:var(--text-label);
  color:var(--color-text-ghost);letter-spacing:var(--tracking-label);
  transition:color 0.3s ease;
}
.mf-srow__body{display:flex;flex-direction:column;gap:0.4rem;min-width:0}
.mf-srow__name{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(1.35rem,2.6vw,2.1rem);line-height:1.1;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
}
.mf-srow__desc{
  font-size:clamp(0.86rem,1.1vw,0.95rem);line-height:1.5;
  color:var(--color-text-ghost);max-width:52ch;
}
.mf-srow__go{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-copper-text,#A6481F);margin-top:0.35rem;
  opacity:0;transform:translateX(-6px);
  transition:opacity 0.35s ease, transform 0.35s ease;
}
.mf-srow:hover .mf-srow__go{opacity:1;transform:translateX(0)}
.mf-srow__media{
  width:150px;aspect-ratio:4/3;overflow:hidden;border-radius:2px;
  border:1px solid var(--mf-rule);position:relative;
}
.mf-srow__gif,.mf-srow__media video{width:100%;height:100%;object-fit:cover;opacity:0.35;transition:opacity 0.4s ease}
.mf-srow:hover .mf-srow__gif,.mf-srow:hover .mf-srow__media video{opacity:0.9}
.mf-srows__direct{margin-top:1.6rem}
.mf-srows__direct a{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--copper,#B5502E);padding-bottom:0.35rem;
  transition:color 0.3s ease;
}
.mf-srows__direct a:hover{color:var(--mf-copper-text,#A6481F)}
.mf-metrics{
  display:grid;grid-template-columns:repeat(3,1fr);
  margin-top:4rem;border-top:1px solid var(--mf-rule);
}
.mf-metric{display:flex;flex-direction:column;gap:0.5rem;padding:1.6rem 1.4rem 0;text-align:center;align-items:center}
.mf-metric + .mf-metric{border-left:1px solid var(--mf-rule)}
.mf-metric__n{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(2rem,3.6vw,3.1rem);line-height:1;letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);
}
.mf-metric__d{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);max-width:22ch;
}
@media(max-width:860px){
  .mf-srow{grid-template-columns:2.2rem 1fr;grid-template-areas:"n b" "m m"}
  .mf-srow__num{grid-area:n}.mf-srow__body{grid-area:b}
  .mf-srow__media{grid-area:m;width:100%;aspect-ratio:16/8}
  .mf-srow:hover{padding-left:0;padding-right:0}
  .mf-srow__go{opacity:1;transform:none}
  .mf-metrics{grid-template-columns:1fr}
  .mf-metric{padding:1.3rem 0 0;border-left:none !important}
  .mf-metric + .mf-metric{border-left:none;border-top:1px solid var(--mf-rule)}
}
.mf-srow__go{display:inline-block;transition:transform 0.35s var(--ease-out-expo)}
.mf-srow:hover .mf-srow__go{transform:translateX(6px)}
@media(max-width:860px){.mf-srows__direct a{min-height:44px;display:inline-flex;align-items:center}}
`}</style>
    </section>
  );
}
