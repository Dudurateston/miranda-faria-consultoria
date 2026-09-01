import React from "react";
import Link from "@/components/TransitionLink";

import OpeningSequence from "@/components/OpeningSequence";
import MfRule from "@/components/MfRule";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import SectorTicker from "@/components/SectorTicker";
import ScrollVideo from "@/components/ScrollVideo";
import { useLang } from "@/lib/i18n";
import { copy, cases } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * Home-resumo. Ela apresenta o suficiente para quem so visita uma
 * pagina e manda para a aba certa quem quer profundidade — a
 * profundidade mora em /work, /how-i-work e /about, nao aqui
 * (DECISIONS.md: "NAO scroll unico, NAO hub raso").
 */
export default function Home() {
  const { lang, path } = useLang();
  const t = copy[lang].home;
  const featured = cases[lang].slice(0, 3);
  usePageTitle(null); // Home usa o titulo institucional inteiro

  return (
    <>
      <OpeningSequence />
      <MfRule />

      {/* Tese */}
      <section className="mf-home__sec" data-depth="0.08">
        <div className="mf-home__inner">
          <Reveal>
            <p className="mf-label">{t.thesis.label}</p>
          </Reveal>
          <LineReveal className="mf-home__lead">{t.thesis.lead}</LineReveal>
          <Reveal delay={160}>
            <p className="mf-home__body">{t.thesis.body}</p>
          </Reveal>
        </div>
      </section>

      <MfRule />

      {/* Argumento — tres blocos */}
      <section className="mf-home__sec" data-depth="0.22">
        <div className="mf-home__inner">
          <Reveal>
            <p className="mf-label">{t.pitch.label}</p>
          </Reveal>
          <LineReveal className="mf-home__lead">{t.pitch.lead}</LineReveal>
          <div className="mf-pitch mf-stage">
            {t.pitch.items.map((item, i) => (
              <article className="mf-pitch__item" key={item.t}>
                <span className="mf-pitch__num">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mf-pitch__name">{item.t}</h2>
                <p className="mf-pitch__desc">{item.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectorTicker />

      {/* Um sistema real rodando, que parte sozinho ao ser alcancado.
          Vem ANTES da lista de proposito: a lista nomeia os projetos, a
          gravacao prova que existem.

          SECAO PROPRIA, e nao um bloco dentro dos trabalhos, por um
          motivo medido: a rampa de fundo interpola entre os CENTROS das
          secoes, e ela precisa atravessar depressa a faixa cega entre
          0,45 e 0,80, onde nenhuma cor de texto alcanca 4,5:1
          (tokens.css). Com o video dentro da secao de trabalhos, o
          centro dela desceu ~300px, a travessia dobrou de comprimento e
          o ticker e o rotulo "Trabalhos" passaram a ficar parados no meio
          da faixa — medidos em 4,43:1. Com ancora propria a travessia
          volta a ser curta, e o que fica na tela durante ela e a imagem,
          nao texto pequeno. */}
      <section className="mf-home__sec mf-home__reelsec" data-depth="0.88">
        <div className="mf-home__inner">
          <div className="mf-home__reel">
            <ScrollVideo
              src={`/work/${t.workTeaser.reelCase}/video.mp4`}
              poster={`/work/${t.workTeaser.reelCase}/poster.webp`}
              label={t.workTeaser.reelLabel}
              caption={t.workTeaser.reelCaption}
            />
          </div>
        </div>
      </section>

      {/* Trabalhos em destaque — a lista completa vive em /work */}
      <section className="mf-home__sec" data-depth="0.88">
        <div className="mf-home__inner">
          <Reveal>
            <p className="mf-label">{t.workTeaser.label}</p>
          </Reveal>
          <LineReveal className="mf-home__lead">{t.workTeaser.lead}</LineReveal>
          <div className="mf-teaser mf-stage">
            {featured.map((c, i) => (
              <Link
                key={c.slug}
                to={path(`work/${c.slug}`)}
                className="mf-teaser__item"
                data-cursor="link"
              >
                <span className="mf-teaser__num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mf-teaser__name">{c.name}</h3>
                <span className="mf-label mf-teaser__sector">{c.sector}</span>
              </Link>
            ))}
          </div>
          <Reveal delay={140}>
            <Link to={path("work")} className="mf-home__cta" data-cursor="link">
              {t.workTeaser.cta} →
            </Link>
          </Reveal>
        </div>
      </section>

      <MfRule />

      {/* Contato — link direto, nunca formulario */}
      <section className="mf-home__sec" data-depth="0.94">
        <div className="mf-home__inner">
          <Reveal>
            <p className="mf-label">{t.contactTeaser.label}</p>
          </Reveal>
          <LineReveal className="mf-home__lead">{t.contactTeaser.lead}</LineReveal>
          <Reveal delay={140}>
            <Link to={path("contact")} className="mf-home__cta" data-cursor="link">
              {t.contactTeaser.cta} →
            </Link>
          </Reveal>

          {/* Segundo caminho, de menor compromisso, para quem ainda nao
              sabe o que pedir. */}
          <Reveal delay={200}>
            <p className="mf-home__xray">
              <span>{copy[lang].xray.entryLead}</span>
              <Link to={path("x-ray")} className="mf-home__xraylink" data-cursor="link">
                {copy[lang].xray.entryCta} →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-home__xray{
  display:flex;flex-wrap:wrap;align-items:baseline;gap:0.35rem 0.9rem;
  margin:3rem 0 0;padding-top:1.5rem;
  border-top:1px solid var(--color-divider);max-width:44rem;
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);color:var(--color-text-secondary);
}
.mf-home__xraylink{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--copper);padding-bottom:3px;
}
.mf-home__xraylink:hover{opacity:0.65}
.mf-home__sec{padding:var(--section-gap) var(--gutter)}
.mf-home__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-home__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-home__body{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2.5rem 0 0;
}
.mf-home__cta{
  display:inline-block;margin-top:2.75rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--color-accent);padding-bottom:4px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-home__cta:hover{opacity:0.65}

.mf-pitch{display:grid;grid-template-columns:1fr;gap:0;margin-top:3.5rem}
@media(min-width:860px){.mf-pitch{grid-template-columns:repeat(3,1fr);gap:0 clamp(1.5rem,3vw,3rem)}}
.mf-pitch__item{
  display:flex;flex-direction:column;gap:0.9rem;
  padding:2.2rem 0;border-top:1px solid var(--color-divider);
}
@media(max-width:859px){.mf-pitch__item:last-child{border-bottom:1px solid var(--color-divider)}}
.mf-pitch__num{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-pitch__name{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.12;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
}
.mf-pitch__desc{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;
}

/* Inserida dentro da largura de pagina, nao ate a borda: o video e
   prova, nao espetaculo, e um bloco sangrado brigaria com a coluna de
   texto em volta. */
.mf-home__reel{max-width:62rem}
.mf-home__reelsec{padding-bottom:0}

.mf-teaser{margin-top:3.5rem;border-top:1px solid var(--color-divider)}
.mf-teaser__item{
  display:grid;grid-template-columns:4.5rem 1fr auto;
  gap:0 clamp(1.5rem,4vw,3rem);align-items:baseline;
  padding:clamp(1.6rem,3.5vh,2.4rem) 0;
  border-bottom:1px solid var(--color-divider);
  text-decoration:none;color:inherit;
  transition:transform var(--duration-base) var(--ease-out-expo);
}
.mf-teaser__item:hover{transform:translateX(14px)}
.mf-teaser__num{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-teaser__name{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.08;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-teaser__item:hover .mf-teaser__name{color:var(--color-accent)}
.mf-teaser__sector{text-align:right}
@media(max-width:767px){
  .mf-teaser__item{grid-template-columns:1fr;gap:0.5rem}
  .mf-teaser__item:hover{transform:none}
  .mf-teaser__sector{text-align:left}
}
@media(prefers-reduced-motion:reduce){
  .mf-teaser__item,.mf-teaser__item:hover{transform:none;transition:none}
}
      `}</style>
    </>
  );
}
