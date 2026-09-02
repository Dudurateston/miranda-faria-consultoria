import React, { useState } from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { base44 } from "@/api/base44Client";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL, EMAIL } from "@/lib/site";

/**
 * Contato — CTA direto no WhatsApp no topo e, abaixo, o formulario
 * que alimenta a entidade ContactRequest (follow-up). Coleta nome,
 * e-mail, empresa, tipo de projeto, mensagem e a preferencia por
 * agendamento via WhatsApp.
 */
export default function Contact() {
  const { lang } = useLang();
  const t = copy[lang].contact;
  const f = t.form;
  usePageTitle(t.label);

  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const nome = String(fd.get("nome") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const mensagem = String(fd.get("mensagem") || "").trim();
    if (!nome || !email.includes("@") || !mensagem) {
      setError(f.error);
      return;
    }
    setBusy(true);
    try {
      await base44.entities.ContactRequest.create({
        nome,
        email,
        empresa: String(fd.get("empresa") || "").trim(),
        tipo_projeto: String(fd.get("tipo") || ""),
        mensagem,
        prefere_whatsapp: fd.get("whatsapp") === "on",
        origem: lang,
      });
      setSent(true);
    } catch (err) {
      setError(f.errorServer);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="mf-contact" data-depth="0.90">
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
                href={WHATSAPP_URL}
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

          <Reveal delay={320}>
            <div className="mf-form">
              <p className="mf-label">{f.title}</p>
              <p className="mf-form__body">{f.body}</p>

              {sent ? (
                <p className="mf-form__sent">{f.sent}</p>
              ) : (
                <form onSubmit={onSubmit} className="mf-form__grid" noValidate>
                  <label className="mf-form__field">
                    <span className="mf-label">{f.name} *</span>
                    <input name="nome" type="text" autoComplete="name" />
                  </label>
                  <label className="mf-form__field">
                    <span className="mf-label">{f.email} *</span>
                    <input name="email" type="email" autoComplete="email" />
                  </label>
                  <label className="mf-form__field">
                    <span className="mf-label">{f.company}</span>
                    <input name="empresa" type="text" autoComplete="organization" />
                  </label>
                  <label className="mf-form__field">
                    <span className="mf-label">{f.type}</span>
                    <select name="tipo" defaultValue="systems">
                      <option value="systems">{f.types.systems}</option>
                      <option value="design">{f.types.design}</option>
                      <option value="business">{f.types.business}</option>
                    </select>
                  </label>
                  <label className="mf-form__field mf-form__field--full">
                    <span className="mf-label">{f.message} *</span>
                    <textarea name="mensagem" rows={5} />
                  </label>
                  <label className="mf-form__check mf-form__field--full">
                    <input type="checkbox" name="whatsapp" />
                    <span>{f.whatsapp}</span>
                  </label>
                  <div className="mf-form__foot mf-form__field--full">
                    <button
                      type="submit"
                      className="mf-form__submit"
                      disabled={busy}
                      data-cursor="link"
                    >
                      {busy ? f.sending : f.submit}
                    </button>
                    {error && (
                      <p className="mf-form__error" role="alert">{error}</p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
.mf-contact{
  min-height:calc(100vh - var(--nav-height));
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

.mf-form{margin-top:4.5rem;padding-top:3rem;border-top:1px solid var(--color-divider)}
.mf-form__body{
  font-family:var(--font-body);font-weight:300;
  font-size:var(--text-body-md);line-height:var(--leading-body);
  color:var(--color-text-secondary);margin:1rem 0 0;
}
.mf-form__grid{
  display:grid;grid-template-columns:1fr;gap:2rem 3rem;margin-top:2.5rem;
}
@media(min-width:768px){.mf-form__grid{grid-template-columns:1fr 1fr}}
.mf-form__field{display:flex;flex-direction:column;gap:0.55rem}
.mf-form__field--full{grid-column:1 / -1}
.mf-form__field input,.mf-form__field select,.mf-form__field textarea{
  font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);
  line-height:var(--leading-body);color:var(--color-text-primary);
  background:transparent;border:0;border-bottom:1px solid var(--color-divider);
  border-radius:0;padding:0.55rem 0;outline:none;resize:vertical;
  transition:border-color var(--duration-fast) var(--ease-in-out);
}
.mf-form__field input:focus,.mf-form__field select:focus,.mf-form__field textarea:focus{
  border-bottom-color:var(--color-accent);
}
.mf-form__check{
  display:flex;flex-direction:row;align-items:center;gap:0.8rem;
  font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);
  color:var(--color-text-secondary);cursor:pointer;
}
.mf-form__check input{accent-color:var(--copper);width:15px;height:15px}
.mf-form__foot{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap}
.mf-form__submit{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:var(--ink);border:1px solid var(--ink);
  padding:0.95rem 2.2rem;cursor:pointer;
  transition:background var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out),
             opacity var(--duration-fast) var(--ease-in-out);
}
.mf-form__submit:hover:not(:disabled){background:var(--copper);border-color:var(--copper)}
.mf-form__submit:disabled{opacity:0.55;cursor:wait}
.mf-form__error{
  font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);
  color:var(--color-accent);margin:0;
}
.mf-form__sent{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-display-md);line-height:1.2;
  color:var(--color-text-primary);margin:2.5rem 0 0;
}
      `}</style>
    </>
  );
}