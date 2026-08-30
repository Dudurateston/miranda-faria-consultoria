import React from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL, CALENDLY_URL, EMAIL } from "@/lib/site";

/**
 * SEM formulario, aqui ou em qualquer outra pagina (DECISIONS.md).
 * O CTA primario troca com o idioma: WhatsApp no PT (canal local),
 * agendamento no EN (o publico internacional nao usa WhatsApp como
 * primeiro contato profissional).
 */
export default function Contact() {
  const { lang } = useLang();
  const t = copy[lang].contact;
  usePageTitle(t.label);

  const primaryHref = lang === "pt" ? WHATSAPP_URL : CALENDLY_URL;

  return (
    <>
      <section className="mf-contact">
        <div className="mf-contact__inner">
          <Reveal>
            <p className="mf-label">{t.label}</p>
          </Reveal>
          <LineReveal as="h1" className="mf-contact__lead">
            {t.lead}
          </LineReveal>
          <Reveal delay={140}>
            <p className="mf-contact__body">{t.body}</p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mf-contact__actions">
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mf-contact__primary"
                data-cursor="link"
              >
                {t.primary}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="mf-contact__secondary"
                data-cursor="link"
              >
                {t.secondary}
              </a>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <p className="mf-label mf-contact__response">{t.response}</p>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-contact{
  min-height:calc(100vh - var(--nav-height));
  display:flex;align-items:center;
  padding:var(--section-gap) var(--gutter);
}
.mf-contact__inner{max-width:var(--max-width-page);margin:0 auto;width:100%}
.mf-contact__lead{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-hero);line-height:var(--leading-display);
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  margin:1.25rem 0 0;
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
             color var(--duration-fast) var(--ease-in-out);
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
      `}</style>
    </>
  );
}
