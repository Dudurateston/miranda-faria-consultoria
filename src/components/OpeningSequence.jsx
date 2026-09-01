import React from "react";
import Link from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import StrataField from "@/components/StrataField";

/**
 * A ABERTURA.
 *
 * O QUE MUDOU, e por que:
 *
 * A versao anterior media 480vh — 4,8 telas de monograma se montando,
 * numa home de 7,5 telas. Medido no primeiro quadro, antes de qualquer
 * scroll, a tela inteira continha UM elemento de texto legivel: a
 * palavra "Scroll", em 10px. O h1 existia no HTML mas em opacity 0 ate
 * 72% da animacao, e a nav so aparecia depois de 72% da altura da tela.
 * Um recrutador varrendo portfolios da a uma home algo entre 10 e 15
 * segundos de atencao real; essa abertura gastava a conta inteira sem
 * dizer o nome de quem assina o site.
 *
 * Agora a primeira tela traz, sem exigir um pixel de scroll: a pergunta,
 * o nome, o cargo, a localizacao e os dois caminhos. O scroll continua
 * tendo um gesto — a RESPOSTA da pergunta resolve conforme se desce —
 * mas ele revela o desenvolvimento, nunca a identidade.
 *
 * A ordem e deliberada: pergunta primeiro, assinatura depois. A pergunta
 * e o unico elemento que faz alguem parar; o nome sozinho nao faz. Mas
 * os dois cabem na mesma tela, entao nao ha por que escolher.
 *
 * O elemento vivo (StrataField) vive ABAIXO do texto, como o chao
 * abaixo de uma linha de horizonte — e nao atras dele. Duas razoes: a
 * legibilidade nunca depende do que o canvas esta pintando naquele
 * instante, e as duas tentativas anteriores de por a forma gerada como
 * protagonista foram rejeitadas. Aqui a tipografia e a protagonista.
 */
export default function OpeningSequence({ intensidade }) {
  const { lang, path } = useLang();
  const t = copy[lang].home;
  const o = t.opening;

  return (
    <>
      <section className="mf-open" id="topo" data-depth="0" aria-label={`${t.wordmark} — ${t.role}`}>
        <div className="mf-open__sticky">
          <div className="mf-open__type">
            <h1 className="mf-open__q">{o.question}</h1>

            {/* A resposta resolve com o scroll. Ela nasce visivel e o
                scroll so a acentua: sem suporte a linha do tempo de
                scroll, ou com movimento reduzido, ela simplesmente ja
                esta la. Nenhuma informacao depende do gesto. */}
            <p className="mf-open__a">{o.answer}</p>

            <div className="mf-open__sig">
              <span className="mf-open__name">{t.wordmark}</span>
              <span className="mf-open__role">{t.role}</span>
            </div>

            <div className="mf-open__cta">
              <Link to={path("work")} className="mf-open__btn" data-cursor="link">
                {o.primary} →
              </Link>
              <Link to={path("contact")} className="mf-open__btn is-quiet" data-cursor="link">
                {o.secondary}
              </Link>
            </div>
          </div>

          {/* O terreno: metade de baixo da tela, abaixo do texto. */}
          <div className="mf-open__ground">
            <StrataField intensidade={intensidade} />
          </div>

          <span className="mf-open__hint" aria-hidden="true">{t.scrollHint}</span>
        </div>
      </section>

      <style>{`
/* Duas telas, nao cinco. A primeira ja diz tudo; a segunda e o gesto. */
.mf-open{height:200vh;position:relative}
.mf-open__sticky{
  position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;
  display:flex;flex-direction:column;justify-content:flex-start;
}

.mf-open__type{
  position:relative;z-index:2;
  width:100%;max-width:var(--max-width-page);
  margin:0 auto;padding:calc(var(--nav-height) + 9vh) var(--gutter) 0;
}

.mf-open__q{
  font-family:var(--font-display);font-weight:400;margin:0;
  font-size:clamp(2.1rem,5.4vw,4.6rem);line-height:1.04;
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);
  max-width:19ch;
}

.mf-open__a{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);
  max-width:46ch;margin:1.75rem 0 0;
}

.mf-open__sig{
  display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem 1.15rem;
  margin:3rem 0 0;
  padding-top:1.15rem;border-top:1px solid var(--color-divider);
  max-width:46ch;
}
.mf-open__name{
  font-family:var(--font-display);font-weight:400;font-size:1rem;
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  color:var(--color-text-primary);
}
.mf-open__role{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);
}

.mf-open__cta{display:flex;flex-wrap:wrap;gap:1.5rem 2.25rem;margin:2.1rem 0 0}
.mf-open__btn{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;
  border-bottom:1px solid var(--copper);padding-bottom:4px;
  transition:opacity var(--duration-fast) var(--ease-in-out);
}
.mf-open__btn.is-quiet{border-bottom-color:var(--color-divider)}
.mf-open__btn:hover{opacity:0.65}

/* O chao. Fica embaixo do texto — nao atras — para a legibilidade nunca
   depender do que o canvas esta pintando naquele instante. */
.mf-open__ground{
  position:absolute;left:0;right:0;bottom:0;height:46vh;
  z-index:1;pointer-events:none;
}
/* A juncao entre o texto e o chao: uma linha de horizonte, nao um corte. */
.mf-open__ground::before{
  content:"";position:absolute;left:0;right:0;top:0;height:1px;
  background:var(--color-divider);
}

.mf-open__hint{
  position:absolute;bottom:1.6rem;left:50%;transform:translateX(-50%);
  z-index:2;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}

@media(max-width:640px){
  .mf-open__type{padding-top:calc(var(--nav-height) + 5vh)}
  .mf-open__q{max-width:none}
  .mf-open__ground{height:34vh}
}

/* ============================================================
   O GESTO DE SCROLL

   REGRA DURA: nenhum texto desta abertura anima OPACIDADE. Texto em
   opacidade parcial e a classe de falha que ja custou 1,02:1 de
   contraste neste projeto, e o npm run verify NAO a pega — ele le a
   cor calculada do elemento, nao a opacidade herdada, entao um
   paragrafo fantasma passa na auditoria e some para o leitor. Aqui o
   texto ou esta inteiro na tela ou saiu dela por transform, cortado
   pelo overflow do sticky. Nunca meio visivel.

   O gesto, entao, e do terreno: descer abre o chao ate a tela inteira,
   e as camadas que estavam sussurradas aparecem. A pergunta e engolida
   pela profundidade que ela mesma anuncia — depois o site comeca.
   ============================================================ */
@supports (animation-timeline: view()) and (animation-range: 0% 100%) {
  @media (prefers-reduced-motion: no-preference) {
    .mf-open{view-timeline:--mf-open block}

    .mf-open__type,.mf-open__ground,.mf-open__hint{
      animation-timeline:--mf-open;
      animation-fill-mode:both;
      animation-timing-function:linear;
      animation-range:contain 0% contain 100%;
    }

    /* So transform: sobe e sai de cena pelo corte do sticky. */
    @keyframes mf-type-out{
      0%,58%{transform:none}
      100%{transform:translateY(-58vh)}
    }
    .mf-open__type{animation-name:mf-type-out}

    /* O chao abre. */
    @keyframes mf-ground-open{
      0%{height:46vh}
      100%{height:100vh}
    }
    .mf-open__ground{animation-name:mf-ground-open}

    @keyframes mf-hint{0%{opacity:1}18%,100%{opacity:0}}
    .mf-open__hint{animation-name:mf-hint}
  }
}

@media(max-width:640px){
  @supports (animation-timeline: view()){
    @media (prefers-reduced-motion: no-preference){
      @keyframes mf-ground-open{0%{height:34vh}100%{height:100vh}}
    }
  }
}
      `}</style>
    </>
  );
}
