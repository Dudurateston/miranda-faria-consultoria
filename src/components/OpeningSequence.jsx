import React from "react";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import CoreSample from "@/components/CoreSample";

/**
 * A ABERTURA — a extração do testemunho.
 *
 * O visitante rola e a coluna se forma camada por camada, de baixo para
 * cima, na ordem em que o sedimento assentou. Ao lado, a régua nomeia as
 * quatro camadas do método: superfície, sistema, dados, fundação.
 *
 * Trocou o monograma que se montava em 3D. O monograma tinha dois
 * problemas: ficava feio montado em planos recortados, e não dizia
 * nada — era uma letra chegando. A coluna diz o que o Eduardo faz antes
 * de qualquer texto: abre um negócio e lê o que está embaixo.
 *
 * A marca NÃO some ao fim da abertura. Ela encolhe e estaciona no trilho
 * esquerdo, onde passa a marcar a profundidade da página — de enfeite a
 * instrumento. Ver `src/styles/core.css`.
 *
 * Sem imagem, sem vídeo, sem sequência de quadros: tudo geometria e
 * gradiente, dirigido pelo scroll em CSS.
 */
export default function OpeningSequence() {
  const { lang } = useLang();
  const t = copy[lang].home;

  return (
    <>
      <section className="mf-open" id="topo" aria-label={`${t.wordmark} — ${t.role}`}>
        <div className="mf-open__sticky">
          <div className="mf-open__stack">
            <div className="mf-open__core">
              <CoreSample variant="opening" />
            </div>

            <div className="mf-open__word">
              <h1>{t.wordmark}</h1>
              <p>{t.role}</p>
            </div>
          </div>

          <span className="mf-open__hint" aria-hidden="true">{t.scrollHint}</span>
        </div>
      </section>

      <style>{`
.mf-open{height:340vh;position:relative}
.mf-open__sticky{
  position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;
  display:grid;place-items:center;padding:0 var(--gutter);
}
.mf-open__stack{
  display:flex;align-items:center;gap:clamp(2rem,7vw,6rem);
  width:100%;max-width:var(--max-width-page);
}
.mf-open__core{flex:0 0 auto}

.mf-open__word{flex:1 1 auto;min-width:0}
.mf-open__word h1{
  font-family:var(--font-display);font-weight:400;margin:0;
  font-size:clamp(1.75rem,5.5vw,4rem);letter-spacing:var(--tracking-wordmark);
  text-transform:uppercase;line-height:1.02;color:var(--color-text-primary);
}
.mf-open__word p{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:0.34em;text-transform:uppercase;
  color:var(--color-text-secondary);margin:1.4rem 0 0;max-width:34ch;
}

.mf-open__hint{
  position:absolute;bottom:2.25rem;left:50%;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}

/* A regua de zonas some abaixo de 900px: nao cabe ao lado do nome. */
@media(max-width:899px){
  .mf-open__stack{flex-direction:column;align-items:flex-start;gap:2.5rem}
  .mf-open .mf-core__ruler{display:none}
  .mf-open .mf-core--opening{height:min(38vh,300px)}
}

@supports (animation-timeline: view()) and (animation-range: 0% 100%){
  @media (prefers-reduced-motion: no-preference){
    .mf-open{view-timeline:--mf-open block}

    /* O nome resolve depois de a coluna estar formada: o instrumento
       primeiro, a assinatura depois. */
    @keyframes mf-open-word{
      0%,52%{opacity:0;transform:translateY(20px)}
      82%,100%{opacity:1;transform:none}
    }
    .mf-open__word{
      animation:mf-open-word linear both;
      animation-timeline:--mf-open;
      animation-range:contain 0% contain 100%;
    }

    @keyframes mf-open-hint{0%{opacity:1}100%{opacity:0}}
    .mf-open__hint{
      animation:mf-open-hint linear both;
      animation-timeline:--mf-open;
      animation-range:contain 0% contain 20%;
    }
  }
}

@supports not ((animation-timeline: view()) and (animation-range: 0% 100%)){
  .mf-open{height:100vh;height:100svh}
  .mf-open__word{opacity:1}
}
@media (prefers-reduced-motion: reduce){
  .mf-open{height:100vh;height:100svh}
  .mf-open__word{opacity:1;animation:none}
  .mf-open__hint{display:none}
}
      `}</style>
    </>
  );
}
