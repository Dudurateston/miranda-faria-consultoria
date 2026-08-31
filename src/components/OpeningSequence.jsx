import React from "react";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import LivingHero from "@/components/LivingHero";

/**
 * Abertura — o monograma se monta em 3D conforme o visitante rola.
 *
 * Por que NÃO é vídeo nem sequência de quadros, apesar de o gesto ser
 * parecido: essa foi a primeira tentativa deste projeto e ela morreu
 * (RECAP.md) — 65 quadros travaram, pixelaram, pesaram e dependiam de
 * hospedagem externa. Aqui os planos são elementos de verdade em
 * espaço 3D: zero imagem, zero decode, zero CORS, e a resolução é a do
 * dispositivo em vez de a do arquivo.
 *
 * É também mais fiel à marca do que um vídeo seria: o logotipo JÁ é
 * planos translúcidos sobrepostos. Montá-los em profundidade é mostrar
 * o objeto que o desenho sempre foi.
 *
 * A coreografia inteira é dirigida pelo scroll em CSS
 * (`animation-timeline`), no thread do compositor — presa ao gesto, sem
 * laço de animação próprio, sem dessincronizar do scroll suave.
 */
export default function OpeningSequence() {
  const { lang } = useLang();
  const t = copy[lang].home;

  return (
    <>
      <section className="mf-open" id="topo" data-depth="0" aria-label={`${t.wordmark} — ${t.role}`}>
        <div className="mf-open__sticky">
          <div className="mf-open__wrap">
            {/* Campo de partículas por trás: dá matéria ao espaço em
                que os planos se montam. */}
            <div className="mf-open__field" aria-hidden="true">
              <LivingHero />
            </div>

            <div className="mf-open__assembly" aria-hidden="true">
              {/* A prancha: linhas de construção que aparecem antes dos
                  planos e se retiram quando a marca fecha. O desenho
                  virando objeto. */}
              <svg className="mf-open__bp" viewBox="0 0 100 100">
                <line x1="12" y1="0" x2="12" y2="100" />
                <line x1="88" y1="0" x2="88" y2="100" />
                <line x1="26" y1="0" x2="26" y2="100" />
                <line x1="74" y1="0" x2="74" y2="100" />
                <line x1="0" y1="16" x2="100" y2="16" />
                <line x1="0" y1="84" x2="100" y2="84" />
                <line x1="0" y1="62" x2="100" y2="62" />
                <line x1="12" y1="16" x2="50" y2="62" />
                <line x1="88" y1="16" x2="50" y2="62" />
                <line className="ac" x1="50" y1="0" x2="50" y2="100" />
              </svg>

              <div className="mf-pl a" />
              <div className="mf-pl b" />
              <div className="mf-pl c" />
              <div className="mf-pl l" />
              <div className="mf-pl r" />
              <div className="mf-pl dl" />
              <div className="mf-pl dr" />
              <span className="mf-open__dot" />
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
.mf-open{height:480vh;position:relative}
.mf-open__sticky{
  position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;
  display:grid;place-items:center;
  perspective:1400px;perspective-origin:50% 45%;
}
.mf-open__wrap{position:relative;display:grid;place-items:center;
  transform-style:preserve-3d}
.mf-open__field{position:absolute;inset:-40vh -50vw;pointer-events:none;opacity:.85}

.mf-open__assembly{
  position:relative;width:min(56vmin,400px);height:min(56vmin,400px);
  transform-style:preserve-3d;
}

.mf-open__bp{position:absolute;inset:-18%;opacity:0;transform:translateZ(-160px)}
.mf-open__bp line{stroke:var(--stone);stroke-width:.5;opacity:.5}
.mf-open__bp .ac{stroke:var(--copper);stroke-width:.7;opacity:.75}

/* Os planos do monograma. Recortados por clip-path: são faces chapadas
   em espaço 3D, não geometria — o navegador compõe na GPU. */
.mf-pl{position:absolute;inset:0;background:var(--ink);opacity:0;
  transform-style:preserve-3d;will-change:transform,opacity}
.mf-pl.l  {clip-path:polygon(12% 16%, 26% 16%, 26% 84%, 12% 84%)}
.mf-pl.r  {clip-path:polygon(74% 16%, 88% 16%, 88% 84%, 74% 84%)}
.mf-pl.dl {clip-path:polygon(24% 16%, 38% 16%, 54% 62%, 46% 62%)}
.mf-pl.dr {clip-path:polygon(62% 16%, 76% 16%, 54% 62%, 46% 62%)}
.mf-pl.a  {clip-path:polygon(18% 30%, 82% 30%, 82% 46%, 18% 46%)}
.mf-pl.b  {clip-path:polygon(28% 52%, 72% 52%, 72% 66%, 28% 66%)}
.mf-pl.c  {clip-path:polygon(10% 70%, 90% 70%, 90% 80%, 10% 80%)}

.mf-open__dot{
  position:absolute;left:50%;top:58%;width:11px;height:11px;
  margin:-5.5px 0 0 -5.5px;border-radius:50%;background:var(--copper);
  opacity:0;transform:translateZ(90px) scale(0);will-change:transform,opacity;
}

.mf-open__word{
  position:absolute;left:50%;top:calc(50% + min(33vmin,236px));
  transform:translate(-50%,0);text-align:center;white-space:nowrap;opacity:0;
}
.mf-open__word h1{
  font-family:var(--font-display);font-weight:400;margin:0;
  font-size:clamp(1.4rem,4.2vw,2.9rem);letter-spacing:var(--tracking-wordmark);
  text-transform:uppercase;line-height:1;color:var(--color-text-primary);
}
.mf-open__word p{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:0.42em;text-transform:uppercase;
  color:var(--color-text-secondary);margin:1rem 0 0;
}

.mf-open__hint{
  position:absolute;bottom:2.25rem;left:50%;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}

/* ============================================================
   A MONTAGEM, dirigida pelo scroll
   ============================================================ */
@supports (animation-timeline: view()) and (animation-range: 0% 100%) {
  @media (prefers-reduced-motion: no-preference) {
    .mf-open{view-timeline:--mf-open block}

    .mf-open__bp,.mf-pl,.mf-open__dot,.mf-open__word,.mf-open__wrap{
      animation-timeline:--mf-open;
      animation-fill-mode:both;
      animation-timing-function:linear;
      animation-range:contain 0% contain 100%;
    }

    @keyframes mf-bp{
      0%{opacity:0;transform:translateZ(-260px) scale(1.15)}
      14%{opacity:.9;transform:translateZ(-160px) scale(1)}
      44%{opacity:.55}
      62%{opacity:0;transform:translateZ(-120px) scale(.96)}
      100%{opacity:0}
    }
    .mf-open__bp{animation-name:mf-bp}

    /* Cada plano vem de uma profundidade, um giro e um tempo próprios.
       É o escalonamento que faz parecer montagem em vez de um bloco só
       surgindo. */
    @keyframes mf-fly{
      0%{opacity:0;transform:translate3d(var(--x),var(--y),var(--z))
                              rotateX(var(--rx)) rotateY(var(--ry)) scale(var(--s))}
      18%{opacity:var(--o)}
      100%{opacity:var(--o);transform:none}
    }
    .mf-pl{animation-name:mf-fly}
    .mf-pl.l {--x:-46vw;--y:-8vh;--z:-620px;--rx:-24deg;--ry:52deg;--s:1.5;--o:.13;
              animation-range:contain 2% contain 52%}
    .mf-pl.r {--x:48vw;--y:10vh;--z:-520px;--rx:18deg;--ry:-58deg;--s:1.4;--o:.13;
              animation-range:contain 6% contain 58%}
    .mf-pl.dl{--x:-22vw;--y:30vh;--z:-760px;--rx:34deg;--ry:26deg;--s:1.6;--o:.16;
              animation-range:contain 12% contain 64%}
    .mf-pl.dr{--x:26vw;--y:-28vh;--z:-700px;--rx:-30deg;--ry:-22deg;--s:1.6;--o:.16;
              animation-range:contain 16% contain 68%}
    .mf-pl.a {--x:0vw;--y:-42vh;--z:-420px;--rx:62deg;--ry:0deg;--s:1.3;--o:.07;
              animation-range:contain 22% contain 72%}
    .mf-pl.b {--x:-30vw;--y:18vh;--z:-340px;--rx:0deg;--ry:44deg;--s:1.25;--o:.06;
              animation-range:contain 26% contain 76%}
    .mf-pl.c {--x:34vw;--y:34vh;--z:-280px;--rx:-16deg;--ry:-34deg;--s:1.2;--o:.05;
              animation-range:contain 30% contain 80%}

    /* O ponto de cobre fecha a marca — último a chegar, e sozinho. */
    @keyframes mf-dot{
      0%,58%{opacity:0;transform:translateZ(90px) scale(0)}
      76%{opacity:1;transform:translateZ(90px) scale(1.5)}
      86%,100%{opacity:1;transform:translateZ(90px) scale(1)}
    }
    .mf-open__dot{animation-name:mf-dot}

    /* A assinatura vem depois do objeto, nunca junto. */
    @keyframes mf-word{
      0%,72%{opacity:0;transform:translate(-50%,18px)}
      92%,100%{opacity:1;transform:translate(-50%,0)}
    }
    .mf-open__word{animation-name:mf-word}

    /* E o conjunto cede lugar ao site. */
    @keyframes mf-handoff{
      0%,88%{transform:none;opacity:1}
      100%{transform:translateY(-6%) scale(.9);opacity:0}
    }
    .mf-open__wrap{animation-name:mf-handoff}

    .mf-open__hint{
      animation:mf-hint linear both;
      animation-timeline:--mf-open;
      animation-range:contain 0% contain 22%;
    }
    @keyframes mf-hint{0%{opacity:1}100%{opacity:0}}
  }
}

/* Sem suporte a linha do tempo de scroll, ou com movimento reduzido:
   a marca aparece montada, parada, numa tela só. A abertura é gesto —
   o site nunca depende dela para ser lido. */
@supports not ((animation-timeline: view()) and (animation-range: 0% 100%)) {
  .mf-open{height:100vh;height:100svh}
  .mf-pl{opacity:.13}
  .mf-pl.dl,.mf-pl.dr{opacity:.16}
  .mf-pl.a{opacity:.07}.mf-pl.b{opacity:.06}.mf-pl.c{opacity:.05}
  .mf-open__dot{opacity:1;transform:translateZ(90px) scale(1)}
  .mf-open__word{opacity:1}
  .mf-open__bp{opacity:.4}
}
@media (prefers-reduced-motion: reduce){
  .mf-open{height:100vh;height:100svh}
  .mf-pl{opacity:.13;animation:none}
  .mf-pl.dl,.mf-pl.dr{opacity:.16}
  .mf-pl.a{opacity:.07}.mf-pl.b{opacity:.06}.mf-pl.c{opacity:.05}
  .mf-open__dot{opacity:1;transform:translateZ(90px) scale(1);animation:none}
  .mf-open__word{opacity:1;animation:none}
  .mf-open__bp{opacity:.4;animation:none}
}
      `}</style>
    </>
  );
}
