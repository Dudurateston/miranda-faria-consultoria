import React, { useRef } from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import MfRule from "@/components/MfRule";
import { useScrollStagger } from "@/hooks/useScrollStagger";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL, CALENDLY_URL, EMAIL } from "@/lib/site";

/**
 * /contact — a página de conversão.
 *
 * SEM formulário, aqui ou em qualquer outra página (DECISIONS.md). O CTA
 * primário troca com o idioma: WhatsApp no PT, agendamento no EN.
 *
 * Antes era uma frase e dois botões. O problema não era o tamanho: era
 * que ela não reduzia a fricção real de quem hesita antes de escrever.
 * Quem hesita não hesita por falta de botão — hesita porque não sabe o
 * que vai acontecer depois, nem se o caso dele serve.
 *
 * Então a página responde as duas: o que acontece depois de escrever, em
 * três passos, e para quem isto serve e para quem não serve. Dizer o que
 * não serve economiza o tempo dos dois lados e, de quebra, faz o resto
 * soar verdadeiro.
 */
export default function Contact() {
  const { lang } = useLang();
  const t = copy[lang].contact;
  usePageTitle(t.label);

  const stepsRef = useRef(null);
  useScrollStagger(stepsRef, { selector: ".mf-contact__step", stagger: 0.1, y: 26 });

  const primaryHref = lang === "pt" ? WHATSAPP_URL : CALENDLY_URL;

  return (
    <>
      <section className="mf-contact">
        <div className="mf-contact__inner">
          <Reveal><p className="mf-label">{t.label}</p></Reveal>
          <LineReveal as="h1" className="mf-contact__lead">{t.lead}</LineReveal>
          <Reveal delay={140}><p className="mf-contact__body">{t.body}</p></Reveal>

          <Reveal delay={200}>
            <div className="mf-contact__actions">
              <a href={primaryHref} target="_blank" rel="noopener noreferrer"
                 className="mf-contact__primary" data-cursor="link">
                {t.primary}
              </a>
              <a href={`mailto:${EMAIL}`} className="mf-contact__secondary" data-cursor="link">
                {t.secondary}
              </a>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <p className="mf-label mf-contact__response">{t.response}</p>
          </Reveal>
        </div>
      </section>

      <MfRule />

      {/* O que acontece depois — a fricção real de quem hesita */}
      <section className="mf-contact__sec">
        <div className="mf-contact__inner">
          <Reveal><p className="mf-label">{t.expectLabel}</p></Reveal>
          <ol ref={stepsRef} className="mf-contact__steps">
            {t.expect.map((e, i) => (
              <li className="mf-contact__step" key={e.t}>
                <span className="mf-contact__num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="mf-contact__stitle">{e.t}</h2>
                  <p className="mf-contact__sdesc">{e.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <MfRule />

      {/* Serve / não serve — qualifica, e economiza o tempo dos dois */}
      <section className="mf-contact__sec">
        <div className="mf-contact__inner">
          <Reveal><p className="mf-label">{t.fitLabel}</p></Reveal>
          <div className="mf-contact__fit">
            <Reveal>
              <div className="mf-contact__yes">
                <span className="mf-contact__sign" aria-hidden="true" />
                <p>{t.fitYes}</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="mf-contact__no">
                <span className="mf-contact__sign" aria-hidden="true" />
                <p>{t.fitNo}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <style>{`
.mf-contact{
  min-height:calc(100svh - var(--nav-height));
  display:flex;align-items:center;padding:var(--section-gap) var(--gutter);
}
.mf-contact__sec{padding:var(--section-gap) var(--gutter)}
.mf-contact__inner{max-width:var(--max-width-page);margin:0 auto;width:100%}

.mf-contact__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-hero);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 0;
}
.mf-contact__body{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-lg);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:var(--max-width-body);margin:2.25rem 0 0;
}
.mf-contact__actions{display:flex;flex-wrap:wrap;align-items:center;gap:1.5rem 2.5rem;margin:3rem 0 0}

.mf-contact__primary{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:var(--ink);text-decoration:none;
  padding:1.1rem 2.2rem;border:1px solid var(--ink);
  transition:background var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out);
}
.mf-contact__primary:hover{background:var(--copper);border-color:var(--copper)}
.mf-contact__secondary{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
  border-bottom:1px solid var(--color-divider);padding-bottom:3px;
  transition:color var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out);
}
.mf-contact__secondary:hover{color:var(--color-accent);border-color:var(--color-accent)}
.mf-contact__response{margin:2.5rem 0 0}

.mf-contact__steps{
  list-style:none;margin:2.5rem 0 0;padding:0;
  border-top:1px solid var(--color-divider);
}
.mf-contact__step{
  display:grid;grid-template-columns:3.5rem 1fr;gap:0 clamp(1rem,3vw,2.5rem);
  align-items:baseline;padding:1.6rem 0;border-bottom:1px solid var(--color-divider);
}
@media(max-width:767px){.mf-contact__step{grid-template-columns:1fr;gap:.4rem}}
.mf-contact__num{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-ghost);
}
.mf-contact__stitle{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.14;margin:0 0 .5rem;
  color:var(--color-text-primary);
}
.mf-contact__sdesc{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:0;max-width:52ch;
}

.mf-contact__fit{display:grid;grid-template-columns:1fr;gap:2rem;margin-top:2.5rem}
@media(min-width:820px){.mf-contact__fit{grid-template-columns:1fr 1fr;gap:0 clamp(2rem,5vw,4rem)}}
.mf-contact__yes,.mf-contact__no{
  display:grid;grid-template-columns:auto 1fr;gap:0 1rem;align-items:start;
  border-top:1px solid var(--color-divider);padding-top:1.5rem;
}
.mf-contact__yes p,.mf-contact__no p{
  margin:0;font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);max-width:44ch;
}
/* Um traço horizontal para o que serve, vertical somado para o que não:
   sinal gráfico em vez de emoji, coerente com a régua da marca. */
.mf-contact__sign{position:relative;width:14px;height:14px;margin-top:.55rem}
.mf-contact__sign::before{
  content:"";position:absolute;inset:50% 0 auto 0;height:1px;background:var(--color-accent);
}
.mf-contact__no .mf-contact__sign::before{background:var(--color-text-ghost)}
.mf-contact__no .mf-contact__sign::after{
  content:"";position:absolute;inset:50% 0 auto 0;height:1px;
  background:var(--color-text-ghost);transform:rotate(90deg);
}
      `}</style>
    </>
  );
}
