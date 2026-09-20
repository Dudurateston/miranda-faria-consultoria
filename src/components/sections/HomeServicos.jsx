import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy, getPractice } from "@/content/copy";
import {
  CORTE_GIF,
  CELESTE_GIF,
  LEAD_VIDEO,
  AUTOM_VIDEO,
  WHATSAPP_URL_BARE,
} from "@/lib/site";
import AutoVideo from "@/components/AutoVideo";

gsap.registerPlugin(ScrollTrigger);

/**
 * As quatro soluções em LINHAS estilo spence — scroll reveal em cascata,
 * hover que apaga as irmãs e ressalta a atual, preview em vídeo à direita.
 * A copy do card já entrega a dor e o resultado; o CTA direto de WhatsApp
 * embaixo tira o atrito de quem já se decidiu.
 */
const VERTICALS = [
  { slug: "gestao", gif: CORTE_GIF },
  { slug: "desenvolvimento", gif: LEAD_VIDEO },
  { slug: "design", gif: CELESTE_GIF },
  { slug: "automacao", gif: AUTOM_VIDEO },
];

export default function HomeServicos() {
  const { lang, path } = useLang();
  const t = copy[lang];

  /* AWWWARDS FASE 1 (19/09): as 4 solucoes viram CAPITULOS PINADOS no
     desktop — a secao prende na tela e cada solucao assume a tela inteira
     conforme o scroll, com numeral grande, video so do capitulo ATIVO
     (melhora ate o peso: 1 video por vez em vez de 4 no stream) e trilho
     de progresso em cobre. Mobile e prefers-reduced-motion: layout de
     linhas atual, intocado. */
  const [pinned] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 861px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [chapter, setChapter] = useState(() => (pinned ? 0 : -1));
  const rowsRef = useRef(null);

  useEffect(() => {
    if (!pinned) return undefined;
    const el = rowsRef.current;
    if (!el) return undefined;
    const rows = gsap.utils.toArray(".mf-srow", el);
    if (rows.length < 2) return undefined;
    const cur = { i: 0 };
    const ctx = gsap.context(() => {
      gsap.set(rows, { autoAlpha: 0, y: 90 });
      gsap.set(rows[0], { autoAlpha: 1, y: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=" + rows.length * 110 + "%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = Math.min(rows.length - 1, Math.floor(self.progress * rows.length));
            if (i !== cur.i) { cur.i = i; setChapter(i); }
          },
        },
      });
      rows.forEach((row, i) => {
        if (i === 0) return;
        tl.to(row, { autoAlpha: 1, y: 0, duration: 1 }, i)
          .to(rows[i - 1], { autoAlpha: 0, y: -90, duration: 1 }, i);
      });
      tl.to({}, { duration: 0.5 }); // respiro no fim antes de soltar o pin
    }, el);
    return () => { ctx.revert(); };
  }, [pinned]);

  return (
    <section className="mf-h">
      <div className="mf-h__inner">
        <Reveal>
          <p className="mf-label"><span className="mf-label__n">02</span>{t.servicos.label}</p>
        </Reveal>
        <LineReveal className="mf-h__lead" dot>{t.servicos.lead}</LineReveal>

        <div
          ref={rowsRef}
          className={pinned ? "mf-srows mf-srows--pin" : "mf-srows"}
          aria-live={pinned ? "polite" : undefined}
        >
          {pinned && (
            <div className="mf-srows__rail" aria-hidden="true">
              {VERTICALS.map((v, i) => (
                <span key={v.slug} className={i === chapter ? "is-on" : undefined} />
              ))}
            </div>
          )}
          {VERTICALS.map(({ slug, gif }, i) => {
            const p = getPractice(lang, slug);
            if (!p) return null;
            const row = (
              <Link to={path(slug)} className="mf-srow" data-cursor="link">
                <span className="mf-srow__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="mf-srow__body">
                  <span className="mf-srow__name">{p.label}</span>
                  <span className="mf-srow__desc">{t.servicos.cards?.[slug] ?? p.lead}</span>
                  <span className="mf-srow__go">{t.servicos.seeVertical} →</span>
                </span>
                <span className="mf-srow__media">
                  <AutoVideo
                    className="mf-srow__gif"
                    /* pinado: so o capitulo ativo carrega/roda o video */
                    src={pinned ? (chapter === i ? gif : undefined) : gif}
                  />
                </span>
              </Link>
            );
            return pinned ? (
              <div key={slug}>{row}</div>
            ) : (
              <Reveal key={slug} delay={i * 110}>{row}</Reveal>
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
.mf-srows:not(.mf-srows--pin):hover .mf-srow:not(:hover){opacity:0.32}
/* ===== MODO PINADO v2 (Eduardo 19/09: "o video podia ocupar a tela
   inteira com o texto DENTRO dele") — cada capitulo = video FULLBLEED
   com scrim de legibilidade, nome grande na base e numeral fantasma
   no alto. Cinema, nao catalogo ao lado. ===== */
.mf-srows--pin{
  position:relative;height:100svh;margin-top:2rem;
  border-top:none;overflow:visible;
}
.mf-srows--pin .mf-srow__wrap,.mf-srows--pin > div{height:100%}
.mf-srows--pin .mf-srow{
  position:absolute;inset:0;margin:0;height:100%;
  display:block;padding:0;border-bottom:none;
  opacity:0;visibility:hidden;
}
/* scrim: o texto mora DENTRO do video e continua legivel */
.mf-srows--pin .mf-srow::before{
  content:"";position:absolute;inset:0;z-index:1;
  background:linear-gradient(to top,
    rgba(16,12,9,0.82) 0%, rgba(16,12,9,0.34) 34%,
    rgba(16,12,9,0.05) 62%, transparent 100%);
}
/* "ocupar a tela INTEIRA" (Eduardo 19/09): o VIDEO escapa da coluna
   de conteudo ate as bordas da viewport (o pin-spacer do GSAP engole
   margem negativa no elemento pinado; no filho funciona). Texto e
   numeral ficam na grade editorial, sob o video com scrim. */
.mf-srows--pin .mf-srow__media{
  position:absolute;top:0;bottom:0;
  left:calc(50% - 50vw);width:100vw;
  aspect-ratio:auto;border:none;border-radius:0;
}
.mf-srows--pin .mf-srow__gif,.mf-srows--pin .mf-srow__media video{opacity:1}
.mf-srows--pin .mf-srow__num{
  position:absolute;z-index:2;top:clamp(1rem,3.5vh,2rem);left:0;
  font-size:clamp(4.5rem,12vw,10rem);line-height:0.8;
  color:rgba(244,241,233,0.14);
}
.mf-srows--pin .mf-srow__body{
  position:absolute;z-index:2;left:0;right:20%;bottom:clamp(1.6rem,6vh,3.2rem);
  display:flex;flex-direction:column;gap:0.7rem;color:#F4F1E9;
}
.mf-srows--pin .mf-srow__name{font-size:clamp(2.2rem,4.6vw,3.9rem);color:#F4F1E9}
.mf-srows--pin .mf-srow__desc{font-size:clamp(0.95rem,1.2vw,1.08rem);color:rgba(244,241,233,0.85);max-width:52ch}
.mf-srows--pin .mf-srow__go{opacity:1;transform:none;color:#F4F1E9}
.mf-srows--pin .mf-srow:hover{padding-left:0;padding-right:0}
.mf-srows--pin .mf-srow:hover .mf-srow__num{color:rgba(244,241,233,0.14);text-indent:0}
.mf-srows__rail{
  position:absolute;right:0;top:50%;transform:translateY(-50%);
  display:flex;flex-direction:column;gap:0.8rem;z-index:3;
}
.mf-srows__rail span{
  width:26px;height:2px;background:var(--mf-rule);
  transition:background 0.3s ease,width 0.3s ease;
}
.mf-srows__rail span.is-on{background:var(--copper,#B5502E);width:40px}
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
