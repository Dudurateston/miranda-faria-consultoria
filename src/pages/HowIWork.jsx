import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import MfRule from "@/components/MfRule";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * A pagina desce.
 *
 * O QUE MUDOU: /work e /how-i-work eram o MESMO molde — rotulo, titulo
 * em Playfair, paragrafo, regua com ponto, lista numerada com "01 Titulo
 * + descricao". Duas paginas com o mesmo ritmo e a mesma forma nao dao
 * ao visitante nenhuma razao para ler as duas. /work agora e um indice
 * que se filtra; esta aqui deixou de ser lista e virou percurso.
 *
 * As quatro camadas nao sao itens: sao patamares. Cada uma ocupa uma
 * faixa propria com a sua PROFUNDIDADE, e o fundo da pagina escurece de
 * verdade conforme se desce — a rampa que existe no site inteiro
 * finalmente serve para dizer alguma coisa em vez de so variar.
 *
 * A ESCOLHA DAS PROFUNDIDADES nao e estetica, e medida. A rampa tem uma
 * faixa cega entre 0,45 e 0,80 onde nenhuma das duas cores de texto
 * alcanca 4,5:1 (tokens.css), entao secoes so descansam em <= 0,35 ou
 * >= 0,85. Isso obriga o salto de tom a acontecer de uma vez — e o lugar
 * certo para ele acontecer e entre System e Data, que e exatamente onde
 * o projeto deixa de ser visivel para o cliente. A restricao tecnica
 * virou a linha do horizonte da pagina.
 */

// Superficie e Sistema ficam na luz; Dados e Fundacao, embaixo.
const PROFUNDIDADE = [0.08, 0.32, 0.86, 0.94];

export default function HowIWork() {
  const { lang } = useLang();
  const t = copy[lang].howIWork;
  usePageTitle(t.label);

  return (
    <>
      <PageHeader label={t.label} lead={t.lead} intro={t.intro} />
      <MfRule />

      {t.layers.map((l, i) => (
        <React.Fragment key={l.t}>
          {/* A linha do horizonte, entre o que se ve e o que fica embaixo. */}
          {i === 2 && (
            <div className="mf-hiw__horizon" data-depth={PROFUNDIDADE[1]}>
              <p className="mf-hiw__horizontext">{t.horizon}</p>
            </div>
          )}

          <section className="mf-hiw__layer" data-depth={PROFUNDIDADE[i]}>
            <div className="mf-hiw__inner">
              <p className="mf-label mf-hiw__num">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mf-hiw__name">{l.t}</h2>
              <p className="mf-hiw__desc">{l.d}</p>
            </div>
          </section>
        </React.Fragment>
      ))}

      <section className="mf-hiw__ai" data-depth="0.94">
        <div className="mf-hiw__inner">
          <Reveal>
            <p className="mf-label">{t.ai.label}</p>
          </Reveal>
          <LineReveal className="mf-hiw__ailead">{t.ai.lead}</LineReveal>
          <Reveal delay={140}>
            <p className="mf-hiw__aibody">{t.ai.body}</p>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-hiw__inner{max-width:var(--max-width-page);margin:0 auto}

/* Cada camada e uma FAIXA, nao uma linha de lista: tem ar em volta e
   ocupa uma parte real da tela, para a descida se sentir no corpo em vez
   de so se ler no numero. */
.mf-hiw__layer{
  padding:clamp(4.5rem,11vh,8rem) var(--gutter);
  border-top:1px solid var(--color-divider);
}
.mf-hiw__num{color:var(--color-text-ghost);margin:0}
.mf-hiw__name{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:1.04;
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);margin:0.9rem 0 0;
}
.mf-hiw__desc{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);
  max-width:52ch;margin:1.6rem 0 0;
}

/* O horizonte. Uma faixa estreita, sem titulo — ela nao e uma secao, e
   uma passagem. O cobre marca o corte porque aqui ele e traco, e o
   texto ao lado nunca e cobre: como texto pequeno o cobre mede 4,49:1 e
   reprova AA (tokens.css). */
.mf-hiw__horizon{
  padding:clamp(2rem,5vh,3.2rem) var(--gutter);
  border-top:1px solid var(--copper);
}
.mf-hiw__horizontext{
  max-width:var(--max-width-page);margin:0 auto;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  line-height:1.9;color:var(--color-text-secondary);
  max-width:62ch;
}

.mf-hiw__ai{
  padding:var(--section-gap) var(--gutter);
  border-top:1px solid var(--color-divider);
}
.mf-hiw__ailead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-xl);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
}
.mf-hiw__aibody{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2.25rem 0 0;
}
      `}</style>
    </>
  );
}
