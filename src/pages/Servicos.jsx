import React, { useState } from "react";
import Link from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useLang } from "@/lib/i18n";
import { copy, getPractice } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL } from "@/lib/site";

/**
 * Servicos — visao geral das quatro solucoes, com numeros reais da
 * operacao (projetos entregues, stack inteiro numa pessoa, resposta
 * no mesmo dia) e a coluna geologica como metafora das camadas.
 * Cada solucao linka para a sua pagina propria.
 */
const SLUGS = ["gestao", "desenvolvimento", "design", "automacao"];

/* ===== Corte geológico vivo — o corte.mp4 não agradou (Eduardo 18/09);
   aqui a faixa é um DESENHO animado da tese "estrutura por baixo":
   4 camadas que se desenham na entrada, veio de cobre que pulsa,
   deriva lenta e contínua — gráfico, leve, sem vídeo. ===== */
function StrataCorte({ layers }) {
  const W = 1600, H = 900;
  const ys = [140, 330, 520, 710]; // limites das camadas
  const wave = (y, amp, lead) =>
    `M -80 ${y} C 200 ${y - amp}, 420 ${y + amp * 0.7}, 720 ${y}` +
    ` S 1150 ${y - amp * 0.8}, 1680 ${y - lead}`;
  const lines = [];
  // textura: 2 fios hairline entre cada limite
  for (let b = 0; b < 3; b++) {
    for (let k = 1; k <= 2; k++) {
      const y = ys[b] + ((ys[b + 1] - ys[b]) * k) / 3;
      lines.push({ d: wave(y + k * 6, 16 + k * 5, k * 4), w: 1, op: 0.10, i: b * 2 + k });
    }
  }
  return (
    <svg className="mf-corte" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img">
      <defs>
        <linearGradient id="cobre-veio" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B5502E" stopOpacity="0" />
          <stop offset="0.18" stopColor="#B5502E" stopOpacity="0.85" />
          <stop offset="0.82" stopColor="#B5502E" stopOpacity="0.85" />
          <stop offset="1" stopColor="#B5502E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="mf-corte__drift">
        {ys.map((y, i) => (
          <path key={`bound${i}`} className="mf-corte__bound" style={{ "--i": i }}
            d={wave(y, 22 + i * 6, (i % 2 ? 10 : -10))} fill="none"
            stroke="currentColor" strokeWidth={1.5} />
        ))}
        {lines.map((l, i) => (
          <path key={`tex${i}`} className="mf-corte__tex" style={{ "--i": l.i }}
            d={l.d} fill="none" stroke="currentColor" strokeWidth={l.w} opacity={l.op} />
        ))}
        <path className="mf-corte__veio"
          d={`M -80 640 C 260 600, 480 690, 720 650 S 1150 590, 1680 635`}
          fill="none" stroke="url(#cobre-veio)" strokeWidth={2.5} />
      </g>
      {layers.map((name, i) => (
        <g key={name} className="mf-corte__log" style={{ "--i": i }}>
          <line x1={72} y1={ys[i] + 34} x2={112} y2={ys[i] + 34} stroke="currentColor" strokeWidth={1} opacity={0.4} />
          <text x={128} y={ys[i] + 38} className="mf-corte__label">
            {`0${i + 1} · ${name}`}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Servicos() {
  const [open, setOpen] = useState(-1);
  const { lang, path } = useLang();
  const t = copy[lang].servicos;
  usePageTitle(t.label, "servicos");

  return (
    <>
      <section className="mf-srv" data-depth="0.08">
        <div className="mf-srv__inner">
          <Reveal>
            <p className="mf-label">{t.label}</p>
          </Reveal>
          <LineReveal as="h1" className="mf-srv__lead">{t.lead}</LineReveal>
          <Reveal delay={140}>
            <p className="mf-srv__intro">{t.intro}</p>
          </Reveal>

          <div className="mf-srv__metrics">
            {t.metrics.map((m, i) => (
              <Reveal key={i} delay={i * 90} className="mf-srv__metric">
                <span className="mf-srv__num">{m.n}</span>
                <span className="mf-srv__numd">{m.d}</span>
              </Reveal>
            ))}
          </div>

          {/* Eduardo 18/09: o vídeo da faixa saiu — no lugar, o corte
              geológico VIVO: camadas que se desenham, veio de cobre que
              pulsa, escala de profundidade com as quatro camadas da
              entrega. A tese da seção virou desenho: o que sustenta é o
              que está por baixo. */}
          <Reveal delay={200}>
            <figure className="mf-srv__band" aria-hidden="true">
              <StrataCorte layers={t.bandLayers} />
            </figure>
            <p className="mf-srv__stat">
              {t.bandStat}
              <span className="mf-srv__stat-src">{t.bandSource}</span>
            </p>
          </Reveal>
        </div>
      </section>

      <MfRule />

      <section className="mf-srv" data-depth="0.30">
        <div className="mf-srv__inner">
          <Reveal>
            <p className="mf-label">{t.verticalsLabel}</p>
          </Reveal>
          <div className="mf-srv__list">
            {SLUGS.map((slug, i) => {
              const p = getPractice(lang, slug);
              if (!p) return null;
              return (
                <Link key={slug} to={path(slug)} className="mf-srv__item" data-cursor="link">
                  <span className="mf-srv__idx">{String(i + 1).padStart(2, "0")}</span>
                  <div className="mf-srv__v">
                    <h2 className="mf-srv__name">{p.label}</h2>
                    <p className="mf-srv__plead">{p.lead}</p>
                  </div>
                  <span className="mf-srv__go">{t.seeVertical} →</span>
                </Link>
              );
            })}
          </div>
          <Reveal delay={160}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mf-srv__cta"
              data-cursor="link"
            >
              {t.cta}
            </a>
          </Reveal>
        </div>
      </section>

      <MfRule />

      <section className="mf-faq" data-depth="0.30">
        <div className="mf-faq__inner">
          <Reveal>
            <p className="mf-label">{t.faqLabel}</p>
          </Reveal>
          <div className="mf-faq__list">
            {t.faq.map((item, i) => (
              <Reveal
                key={i}
                delay={i * 100}
                className={`mf-faq__item${open === i ? " is-open" : ""}`}
              >
                <span className="mf-faq__idx">{String(i + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  className="mf-faq__body"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  <h3 className="mf-faq__q">{item.q}</h3>
                  <div className="mf-faq__answer">
                    <div className="mf-faq__pad">
                      <p className="mf-faq__a">{item.a}</p>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

<style>{`

.mf-srv{padding:var(--section-gap) var(--gutter)}
.mf-srv__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-srv__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-srv__intro{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2rem 0 0;
}
.mf-srv__metrics{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:2rem 3rem;margin-top:3.5rem;padding-top:2rem;
  border-top:1px solid var(--color-divider);
}
@media(min-width:860px){.mf-srv__metrics{grid-template-columns:repeat(4,1fr)}}
.mf-srv__metric{display:flex;flex-direction:column;gap:0.5rem}
.mf-srv__num{
  font-family:var(--font-mono);font-size:12px;
  letter-spacing:var(--tracking-label);
  color:var(--color-accent);
}
.mf-srv__numd{
  font-family:var(--font-body);font-weight:300;
  font-size:1.02rem;line-height:1.55;
  color:var(--color-text-secondary);
}
/* Eduardo 18/09: o corte.mp4 tem fundo osso — a faixa dissolve na página
   (simbiose, sem moldura), 16:9 sem crop, contraste pleno. */
.mf-srv__band{margin:3.5rem 0 0;aspect-ratio:21/9;max-height:520px;overflow:hidden;position:relative;color:var(--color-text-primary)}
.mf-srv__band .mf-corte{width:100%;height:100%;display:block;
  -webkit-mask-image:linear-gradient(90deg,transparent 0%,black 6%,black 94%,transparent 100%);
  mask-image:linear-gradient(90deg,transparent 0%,black 6%,black 94%,transparent 100%);
}
.mf-corte__bound{opacity:0.55;stroke-dasharray:2400;stroke-dashoffset:2400;animation:mf-corte-draw 1.6s var(--ease-out-expo) forwards;animation-delay:calc(0.14s * var(--i))}
.mf-corte__tex{stroke-dasharray:2400;stroke-dashoffset:2400;animation:mf-corte-draw 2.1s var(--ease-out-expo) forwards;animation-delay:calc(0.3s + 0.12s * var(--i))}
.mf-corte__veio{stroke-dasharray:2400;stroke-dashoffset:2400;animation:mf-corte-draw 1.8s var(--ease-out-expo) forwards, mf-corte-pulsa 5.5s ease-in-out 2.2s infinite}
.mf-corte__drift{animation:mf-corte-drift 16s ease-in-out infinite alternate}
.mf-corte__log line{stroke-dasharray:80;stroke-dashoffset:80;animation:mf-corte-draw 0.9s var(--ease-out-expo) forwards;animation-delay:calc(1s + 0.16s * var(--i))}
.mf-corte__log text{opacity:0;animation:mf-corte-fade 0.8s ease forwards;animation-delay:calc(1.15s + 0.16s * var(--i))}
.mf-corte__label{font-family:var(--font-mono);font-size:26px;letter-spacing:0.22em;text-transform:uppercase;fill:currentColor;opacity:0.55}
@keyframes mf-corte-draw{to{stroke-dashoffset:0}}
@keyframes mf-corte-fade{to{opacity:1}}
@keyframes mf-corte-pulsa{0%,100%{opacity:0.72}50%{opacity:1}}
@keyframes mf-corte-drift{from{transform:translateX(-18px)}to{transform:translateX(18px)}}
@media(max-width:700px){.mf-srv__band{aspect-ratio:16/10}.mf-corte__label{font-size:58px}}


.mf-srv__stat{
  margin:1.4rem 0 0;max-width:56ch;
  font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);
  line-height:var(--leading-body);color:var(--color-text-secondary);
}
.mf-srv__stat-src{
  display:block;margin-top:0.35rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}
.mf-srv__band img,
.mf-srv__band video{
  width:100%;height:100%;object-fit:cover;display:block;opacity:1;
}

.mf-srv__list{display:flex;flex-direction:column;margin-top:3rem}
.mf-srv__item{
  display:grid;grid-template-columns:4.5rem 1fr auto;
  gap:0 clamp(1.5rem,4vw,3rem);align-items:baseline;
  padding:clamp(1.6rem,3.5vh,2.4rem) 0;
  border-bottom:1px solid var(--color-divider);
  text-decoration:none;color:inherit;
}
.mf-srv__item:first-child{border-top:1px solid var(--color-divider)}
/* A solucao e um caminho, nao um titulo: hairline de cobre que nasce
   no hover e um chip de acao sempre visivel — impossivel nao perceber
   que e clicavel. */
.mf-srv__item{
  position:relative;
  transition:background var(--duration-base) var(--ease-in-out);
}
.mf-srv__item::before{
  content:"";position:absolute;left:calc(-1 * var(--gutter));top:0;bottom:0;
  width:2px;background:var(--color-accent);
  transform:scaleY(0);transform-origin:top;
  transition:transform var(--duration-base) var(--ease-out-expo);
}
.mf-srv__item:hover{background:rgba(166,72,31,0.045)}
.mf-srv__item:hover::before{transform:scaleY(1)}
.mf-srv__item:hover .mf-srv__name{color:var(--color-accent)}
.mf-srv__item:hover .mf-srv__go{
  background:var(--color-accent);color:var(--color-bg);
  border-color:var(--color-accent);
  transform:translateX(4px);
}
.mf-srv__idx{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-srv__name{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.12;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:0;
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-srv__plead{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0.5rem 0 0;
}
.mf-srv__go{
  align-self:center;
  font-family:var(--font-mono);font-size:12px;letter-spacing:var(--tracking-label);
  text-transform:uppercase;white-space:nowrap;
  color:var(--color-accent);border:1px solid rgba(166,72,31,0.45);
  padding:0.55rem 0.95rem;border-radius:999px;
  transition:background var(--duration-fast) var(--ease-in-out),
             color var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out),
             transform var(--duration-base) var(--ease-out-expo);
}
@media(max-width:767px){
  .mf-srv__item{grid-template-columns:1fr;gap:0.6rem}
  .mf-srv__go{justify-self:start;margin-top:0.2rem}
}
.mf-srv__cta{
  display:inline-block;margin-top:2.75rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--color-accent);padding-bottom:4px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-srv__cta:hover{opacity:0.65}
@media(max-width:767px){
  .mf-srv__item{grid-template-columns:1fr;gap:0.5rem}
  .mf-srv__go{opacity:1}
}
.mf-faq{padding:var(--section-gap) var(--gutter)}
.mf-faq__inner{max-width:var(--max-width-page);margin:0 auto}
.mf-faq__list{display:flex;flex-direction:column}
/* FAQ compacto: pergunta pequena, resposta escondida. No hover e
   no toque a resposta desliza e a pergunta acende — a secao apoia,
   nao domina. */
.mf-faq__item{
  display:grid;grid-template-columns:4.5rem 1fr;
  gap:0 clamp(1.5rem,4vw,3rem);
  padding:clamp(0.9rem,2vh,1.2rem) 0;
  border-bottom:1px solid var(--color-divider);
}
.mf-faq__body{
  display:flex;width:100%;padding:0;margin:0;text-align:inherit;align-items:center;min-height:44px;
  background:none;border:0;font:inherit;color:inherit;cursor:pointer;
}
.mf-faq__answer{
  display:grid;grid-template-rows:0fr;
  transition:grid-template-rows 0.45s var(--ease-out-expo);
}
.mf-faq__answer > .mf-faq__pad{overflow:hidden;min-height:0}
/* Eduardo 18/09: resposta estava COLADA no titulo (gap 0) — agora e FAQ
   editorial de duas colunas: pergunta em coluna fixa, resposta alinhada
   em toda a lista com respiro generoso. No mobile empilha. */
.mf-faq__q{flex:0 0 clamp(15rem,30vw,25rem)}
.mf-faq__answer{margin-left:clamp(1.5rem,4vw,3rem);max-width:54ch}
.mf-faq__a{padding:0.35rem 0 0.55rem}
@media(max-width:700px){
  .mf-faq__body{flex-direction:column;align-items:flex-start}
  .mf-faq__q{flex:0 0 auto}
  .mf-faq__answer{margin-left:0;max-width:100%}
  .mf-faq__a{padding:0.95rem 0 0.55rem}
}
.mf-faq__q{
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-faq__item:hover .mf-faq__q,
.mf-faq__item.is-open .mf-faq__q{color:var(--color-accent)}
.mf-faq__item:hover .mf-faq__idx,
.mf-faq__item.is-open .mf-faq__idx{color:var(--color-accent)}
@media (hover:hover) and (pointer:fine){
  .mf-faq__item:hover .mf-faq__answer{grid-template-rows:1fr}
}
.mf-faq__item.is-open .mf-faq__answer{grid-template-rows:1fr}
.mf-faq__item:first-child{border-top:1px solid var(--color-divider)}
.mf-faq__idx{
  font-family:var(--font-mono);font-size:11px;
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
  padding-top:0.35rem;
}
/* FAQ apoia, nao compete: pergunta em corpo maior, resposta discreta.
   O protagonismo da pagina e das solucoes acima. */
.mf-faq__q{
  font-family:var(--font-body);font-weight:400;
  font-size:1.22rem;line-height:1.3;
  color:var(--color-text-primary);
  margin:0 0 0.4rem;
}
.mf-faq__a{
  font-family:var(--font-body);font-weight:300;
  font-size:0.95rem;line-height:var(--leading-body);
  color:var(--color-text-tertiary);max-width:58ch;margin:0;
}
@media(max-width:767px){
  .mf-faq__item{grid-template-columns:1fr;gap:0.5rem}
}
      `}</style>
    </>
  );
}