import React, { useEffect, useMemo, useState } from "react";
import Link from "@/components/TransitionLink";
import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import XRayStrata from "@/components/XRayStrata";
import { CAMADAS, lerRaioX } from "@/lib/xray";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL, CALENDLY_URL } from "@/lib/site";

/**
 * RAIO-X DE SISTEMA — a ferramenta de engajamento que substitui o
 * formulario (DECISIONS.md: "SEM formulario de contato, em lugar nenhum
 * do site").
 *
 * Ela NAO e um formulario disfarcado. Nao ha campo para digitar, nao ha
 * envio, nao ha `fetch`, nao toca a entidade Contato: as respostas vivem
 * em memoria, o resultado e desenhado aqui e o CTA e um link direto. Se
 * o visitante recarregar a pagina, some tudo — e isso e a intencao, nao
 * um limite. Quem responde nao esta entregando dados, esta recebendo uma
 * leitura.
 *
 * O resultado nao e nota. Nota e vaidade e nao gera conversa. Ele nomeia
 * a CAMADA MAIS FINA da operacao, reusando as quatro camadas que
 * /how-i-work ja ensinou — os nomes e as descricoes vem de
 * `howIWork.layers`, nao sao redigitados. Assim o CTA chega com assunto:
 * "sua camada mais fina e Dados, e disso que eu quero falar".
 *
 * A logica de leitura mora em `src/lib/xray.js`, fora do React, para
 * poder ser exercitada sem navegador — as 4096 combinacoes de resposta
 * foram percorridas antes de esta pagina existir.
 */
export default function XRay() {
  const { lang, path } = useLang();
  const t = copy[lang].xray;
  const camadasCopy = copy[lang].howIWork.layers;
  usePageTitle(t.label);

  // -1 = ainda na abertura, antes da primeira pergunta.
  const [passo, setPasso] = useState(-1);
  const [respostas, setRespostas] = useState([]);

  const total = t.questions.length;
  const terminou = passo >= total;

  const leitura = useMemo(
    () => lerRaioX(t.questions, respostas),
    [t.questions, respostas]
  );

  // Trocar de pergunta troca o conteudo sem trocar de rota. A pagina nao
  // usa `.mf-stage` justamente por isso: a animacao de entrada e medida
  // pela ENTRADA do elemento na viewport, e conteudo trocado no lugar
  // nasceria no meio da faixa, em opacidade parcial — o texto fantasma
  // que ja custou 1,02:1 neste projeto. Aqui cada etapa entra inteira.
  // O scroll ao topo do bloco existe so para etapas longas no celular.
  useEffect(() => {
    if (passo <= -1) return;
    document.getElementById("mf-xray-vivo")?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [passo]);

  const responder = (indice) => {
    setRespostas((r) => {
      const novo = [...r];
      novo[passo] = indice;
      return novo;
    });
    setPasso((p) => p + 1);
  };

  const voltar = () => setPasso((p) => Math.max(0, p - 1));
  const recomecar = () => {
    setRespostas([]);
    setPasso(-1);
  };

  const camadaFina = leitura.maisFina;
  const indiceFina = camadaFina ? CAMADAS.indexOf(camadaFina) : -1;
  const nomeFina = indiceFina >= 0 ? camadasCopy[indiceFina].t : null;

  const grau = (s) =>
    s >= 0.75 ? t.grades.solid : s >= 0.4 ? t.grades.thinning : t.grades.thin;

  const ctaHref = lang === "pt" ? WHATSAPP_URL : CALENDLY_URL;

  return (
    <>
      <PageHeader label={t.label} lead={t.lead} intro={t.intro} />
      <MfRule />

      <section className="mf-xr" data-depth="0.22">
        <div className="mf-xr__inner" id="mf-xray-vivo">
          {/* ---------------- abertura ---------------- */}
          {passo === -1 && (
            <button type="button" className="mf-xr__start" onClick={() => setPasso(0)} data-cursor="link">
              {t.start} →
            </button>
          )}

          {/* ---------------- perguntas ---------------- */}
          {passo >= 0 && !terminou && (
            <div className="mf-xr__q">
              <p className="mf-label mf-xr__count">
                {passo + 1} {t.of} {total}
              </p>

              {/* Progresso desenhado, com o valor tambem em texto acima —
                  barra sozinha nao e lida por leitor de tela. */}
              <div
                className="mf-xr__bar"
                role="progressbar"
                aria-valuenow={passo + 1}
                aria-valuemin={1}
                aria-valuemax={total}
                aria-label={t.label}
              >
                <span style={{ width: `${((passo + 1) / total) * 100}%` }} />
              </div>

              <h2 className="mf-xr__ask">{t.questions[passo].q}</h2>

              <ul className="mf-xr__opts">
                {t.questions[passo].options.map((o, i) => (
                  <li key={o.t}>
                    <button
                      type="button"
                      className="mf-xr__opt"
                      data-cursor="link"
                      aria-pressed={respostas[passo] === i}
                      onClick={() => responder(i)}
                    >
                      {o.t}
                    </button>
                  </li>
                ))}
              </ul>

              {passo > 0 && (
                <button type="button" className="mf-xr__minor" onClick={voltar} data-cursor="link">
                  ← {t.back}
                </button>
              )}
            </div>
          )}

          {/* ---------------- leitura ---------------- */}
          {terminou && (
            <div className="mf-xr__res">
              <p className="mf-label">{t.resultLabel}</p>

              {leitura.tudoSolido ? (
                <>
                  <h2 className="mf-xr__verdict">{t.allGoodLead}</h2>
                  <p className="mf-xr__cost">{t.allGoodBody}</p>
                </>
              ) : (
                <>
                  <h2 className="mf-xr__verdict">
                    {t.resultLead} <em>{nomeFina}</em>
                  </h2>
                  <p className="mf-label mf-xr__costlabel">{t.costLabel}</p>
                  <p className="mf-xr__cost">{t.verdicts[camadaFina].thin}</p>
                </>
              )}

              <div className="mf-xr__read">
                <div className="mf-xr__canvas">
                  <XRayStrata solidez={leitura.solidez} maisFina={camadaFina} />
                </div>

                {/* A resposta de verdade e esta lista, nao o desenho: o
                    canvas e `aria-hidden`. */}
                <ul className="mf-xr__legend">
                  {CAMADAS.map((c, i) => (
                    <li key={c} className={c === camadaFina ? "is-thin" : undefined}>
                      <span className="mf-xr__lname">{camadasCopy[i].t}</span>
                      <span className="mf-xr__lgrade">{grau(leitura.solidez[c])}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mf-xr__end">
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mf-xr__cta"
                  data-cursor="link"
                >
                  {t.cta} →
                </a>
                <p className="mf-xr__note">{t.ctaNote}</p>
                <button type="button" className="mf-xr__minor" onClick={recomecar} data-cursor="link">
                  {t.restart}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <MfRule />

      <section className="mf-xr__foot" data-depth="0.30">
        <div className="mf-xr__inner">
          <Link to={path("how-i-work")} className="mf-xr__minor" data-cursor="link">
            {copy[lang].nav.howIWork} →
          </Link>
        </div>
      </section>

      <style>{`
.mf-xr{padding:0 var(--gutter) var(--section-gap)}
.mf-xr__foot{padding:0 var(--gutter) var(--section-gap)}
.mf-xr__inner{max-width:var(--max-width-page);margin:0 auto}

.mf-xr__start,.mf-xr__cta{
  display:inline-block;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  background:none;border:0;padding:0 0 5px;cursor:pointer;
  border-bottom:1px solid var(--copper);
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-xr__start:hover,.mf-xr__cta:hover{opacity:0.65}

.mf-xr__minor{
  display:inline-block;margin-top:2rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
  background:none;border:0;padding:0;cursor:pointer;
}
.mf-xr__minor:hover{color:var(--color-text-primary)}

/* ---- pergunta ---- */
.mf-xr__count{margin:0;color:var(--color-text-ghost)}
.mf-xr__bar{
  height:1px;background:var(--color-divider);margin:0.9rem 0 2.5rem;
  max-width:34rem;
}
.mf-xr__bar > span{
  display:block;height:100%;background:var(--copper);
  transition:width var(--duration-base) var(--ease-out-expo);
}
.mf-xr__ask{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.1;
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);margin:0;max-width:22ch;
}
.mf-xr__opts{list-style:none;margin:2.5rem 0 0;padding:0;max-width:46rem}
.mf-xr__opt{
  display:block;width:100%;text-align:left;
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:1.45;
  color:var(--color-text-primary);
  background:none;cursor:pointer;
  border:0;border-top:1px solid var(--color-divider);
  padding:1.15rem 0 1.15rem 1.1rem;
  position:relative;
  transition:padding-left var(--duration-base) var(--ease-out-expo),
             color var(--duration-fast) var(--ease-in-out);
}
.mf-xr__opts li:last-child .mf-xr__opt{border-bottom:1px solid var(--color-divider)}
/* O traco de cobre entra pela esquerda no hover e no foco. Marca por
   POSICAO e por traco — nunca so por cor, e nunca cobre no texto. */
.mf-xr__opt::before{
  content:"";position:absolute;left:0;top:50%;
  width:0;height:1px;background:var(--copper);
  transform:translateY(-50%);
  transition:width var(--duration-base) var(--ease-out-expo);
}
.mf-xr__opt:hover,.mf-xr__opt:focus-visible{padding-left:2rem}
.mf-xr__opt:hover::before,.mf-xr__opt:focus-visible::before{width:1.35rem}
.mf-xr__opt[aria-pressed="true"]::before{width:1.35rem}
@media(prefers-reduced-motion:reduce){
  .mf-xr__opt,.mf-xr__opt::before{transition:none}
}

/* ---- leitura ---- */
.mf-xr__verdict{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-lg);line-height:1.1;
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);margin:1rem 0 0;max-width:20ch;
}
.mf-xr__verdict em{font-style:normal;border-bottom:2px solid var(--copper)}
.mf-xr__costlabel{margin:2.5rem 0 0.7rem;color:var(--color-text-ghost)}
.mf-xr__cost{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:1.25rem 0 0;max-width:52ch;
}

.mf-xr__read{
  display:grid;grid-template-columns:1fr;gap:1.75rem;
  margin-top:3rem;max-width:52rem;
}
@media(min-width:760px){
  .mf-xr__read{grid-template-columns:1fr 15rem;gap:2.5rem;align-items:stretch}
}
.mf-xr__canvas{
  height:clamp(190px,30vh,300px);
  border:1px solid var(--color-divider);
}
.mf-xr__legend{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.mf-xr__legend li{
  display:flex;justify-content:space-between;align-items:baseline;
  flex-wrap:wrap;gap:0.15rem 1rem;
  flex:1;padding:0.6rem 0;border-top:1px solid var(--color-divider);
}
/* "PONTO FRACO" em versalete com 0.34em de entreletra e largo: em tela
   estreita ele encostava na borda. Quebrando para a linha de baixo em
   vez de espremer, o rotulo respira e nada e cortado. */
.mf-xr__lgrade{flex:0 0 auto}
.mf-xr__legend li:last-child{border-bottom:1px solid var(--color-divider)}
.mf-xr__legend li.is-thin{border-top-color:var(--copper)}
.mf-xr__lname{
  font-family:var(--font-display);font-size:1.05rem;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
}
.mf-xr__lgrade{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);
}
.mf-xr__legend li.is-thin .mf-xr__lgrade{color:var(--color-text-primary)}

.mf-xr__end{margin-top:3rem}
.mf-xr__note{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:1.1rem 0 0;max-width:42ch;
}
      `}</style>
    </>
  );
}
