import React, { useState } from "react";
import Reveal from "@/components/Reveal";
import LineReveal from "@/components/LineReveal";
import { base44 } from "@/api/base44Client";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { WHATSAPP_URL, EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL_SELLER, SELLERS_APP_URL } from "@/lib/site";

/**
 * Contato — CTA direto no WhatsApp no topo e, abaixo, o formulario
 * que alimenta a entidade ContactRequest (follow-up). Coleta nome,
 * e-mail, empresa, tipo de projeto, mensagem e a preferencia por
 * agendamento via WhatsApp.
 */
export default function Contact() {
  const { lang } = useLang();
  const t = copy[lang].contact;
  const s = copy[lang].sellers;
  const f = t.form;
  usePageTitle(t.label, "contact");

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
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.13-1.55a9.9 9.9 0 0 0 4.9 1.28c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.79 14.07c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.16-4.94-4.36-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 1.98.88 2.13.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.16-.3.36-.43.48-.14.13-.28.27-.12.55.16.28.72 1.19 1.55 1.93 1.06.94 1.96 1.24 2.24 1.38.28.14.44.12.61-.05.16-.17.7-.81.89-1.09.19-.28.38-.23.63-.14.26.1 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.7-.17 1.38z"/>
                </svg>
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
            <p className="mf-label mf-contact__response">{t.response} · {WHATSAPP_DISPLAY}</p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mf-contact__sellers">
              <p className="mf-label">{s.label}</p>
              <p className="mf-contact__sellersd">{s.lead}</p>
              <div className="mf-contact__sellerslinks">
                <a href={WHATSAPP_URL_SELLER} target="_blank" rel="noopener noreferrer" data-cursor="link">
                  {s.wa} →
                </a>
                <a href={SELLERS_APP_URL} target="_blank" rel="noopener noreferrer" data-cursor="link">
                  {s.app} ↗
                </a>
              </div>
            </div>
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
                    <select name="tipo" defaultValue="gestao">
                      <option value="gestao">{f.types.gestao}</option>
                      <option value="design">{f.types.design}</option>
                      <option value="desenvolvimento">{f.types.desenvolvimento}</option>
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
/* Âncora visual da marca — estudo generativo, nao escritorio fisico. */
.mf-contact__art{margin:3.2rem 0 0;display:flex;flex-direction:column;gap:0.6rem;max-width:720px}
.mf-contact__artvideo{width:100%;display:block;border-radius:2px}
.mf-contact__art figcaption{color:var(--color-text-ghost)}

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
  display:inline-flex;align-items:center;gap:0.7rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:var(--mf-terracotta);text-decoration:none;
  padding:1.1rem 2.2rem;border:1px solid var(--mf-terracotta);
  transition:background var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out),
             transform var(--duration-fast) var(--ease-out-expo);
}
.mf-contact__primary:hover{background:var(--ink);border-color:var(--ink);transform:translateY(-2px)}
@media(prefers-reduced-motion:reduce){.mf-contact__primary:hover{transform:none}}

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
.mf-contact__sellers{
  margin-top:2.5rem;padding:1.25rem 1.4rem;
  border:1px solid var(--color-divider);
}
.mf-contact__sellersd{
  font-family:var(--font-display);font-weight:400;
  font-size:var(--text-body-lg);color:var(--color-text-primary);
  margin:0.6rem 0 0;
}
.mf-contact__sellerslinks{display:flex;flex-wrap:wrap;gap:0.6rem 2rem;margin-top:0.9rem}
.mf-contact__sellerslinks a{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta-deep);text-decoration:none;
}
.mf-contact__sellerslinks a:nth-child(2){color:var(--color-text-secondary)}
.mf-contact__sellerslinks a:hover{opacity:0.7}

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