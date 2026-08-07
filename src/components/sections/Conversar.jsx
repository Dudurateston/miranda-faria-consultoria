import React from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";

// Layout: centralizado — frase, WhatsApp e formulário.
export default function Conversar() {
  return (
    <>
      <section className="mf-conversar" data-bg="#F5F1EA" id="conversar">
        <div className="mf-conversar__inner">
          <Reveal>
            <p className="mf-label">Conversar</p>
          </Reveal>
          <LineReveal className="mf-conversar__lead">
            Me conta onde está travando.
          </LineReveal>
          <Reveal delay={140}>
            <p className="mf-conversar__sub">Respondo no mesmo dia.</p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mf-conversar__wa">
              <WhatsAppButton>Chamar no WhatsApp</WhatsAppButton>
            </div>
          </Reveal>
          <div className="mf-conversar__divider" />
          <p className="mf-label mf-conversar__formlabel">
            Prefere escrever? Deixe seu contato abaixo.
          </p>
          <Reveal delay={200}>
            <div className="mf-conversar__form">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
      <style>{`
.mf-conversar{padding:var(--section-gap) var(--gutter);background:transparent}
.mf-conversar__inner{width:100%;max-width:680px;margin:0 auto;text-align:center}
.mf-conversar__lead{font-family:var(--font-display);font-weight:400;font-size:var(--text-display-xl);line-height:var(--leading-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 1.5rem;width:100%}
.mf-conversar__sub{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);margin:0 0 2.5rem}
.mf-conversar__wa{display:flex;justify-content:center;margin:0 0 3rem}
.mf-conversar__divider{height:1px;background:var(--color-divider);margin:0 0 2.5rem}
.mf-conversar__formlabel{display:block;margin:0 0 2rem}
.mf-conversar__form{display:flex;justify-content:center;text-align:left}
      `}</style>
    </>
  );
}