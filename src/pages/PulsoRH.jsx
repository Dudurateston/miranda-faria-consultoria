import React from "react";
import { Navigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import ProductPage from "@/components/ProductPage";
import { useLang } from "@/lib/i18n";
import { usePageTitle } from "@/lib/usePageTitle";
import { useJsonLd } from "@/lib/useJsonLd";
import { PULSO_RH as c, PULSO_RH_FAQ_LD } from "@/content/produtos";
import { WHATSAPP_APONTADOR_URL, WHATSAPP_APONTADOR_DISPLAY, APONTADOR_DEMO_URL } from "@/lib/site";

/**
 * Pulso RH (antes Apontador) — pagina de produto em PT, para industrias.
 * So existe em /pt/pulso-rh; /pt/apontador e /en/* redirecionam.
 * CTA unico: diagnostico gratis do ponto pelo WhatsApp de vendas.
 */
const screensCss = `
.mf-prod__screens{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1rem,2.4vw,2rem);margin:2.5rem 0 0}
.mf-prod__screen{margin:0;border:1px solid var(--mf-rule);background:var(--bg-light)}
.mf-prod__screen img{display:block;width:100%;height:auto}
.mf-prod__screen figcaption{padding:.85rem 1rem;font:400 .8125rem/1.5 var(--font-body);color:var(--color-text-secondary)}
.mf-prod__screens--wide .mf-prod__screen:first-child{grid-column:1/-1}
@media(max-width:760px){.mf-prod__screens{grid-template-columns:1fr}.mf-prod__screens--wide .mf-prod__screen:first-child{grid-column:auto}}
`;

export default function PulsoRH() {
  const { lang } = useLang();
  usePageTitle(c.pageTitle, "pulso-rh");
  useJsonLd("pulso-rh-faq", lang === "pt" ? PULSO_RH_FAQ_LD : null);

  if (lang !== "pt") return <Navigate to="/pt/pulso-rh" replace />;

  const screens = c.screens || [];

  const extra = (
    <>
      {screens.length > 0 && (
        <Reveal>
          <h2 className="mf-prod__h2">{c.screensTitle}</h2>
          {c.screensNote ? <p className="mf-prod__p">{c.screensNote}</p> : null}
          <div className={`mf-prod__screens${screens.length === 3 ? " mf-prod__screens--wide" : ""}`}>
            {screens.map((s) => (
              <figure key={s.src} className="mf-prod__screen">
                <img src={s.src} alt={s.alt} width={s.width || 1440} height={s.height || 900} loading="lazy" decoding="async" />
                {s.caption ? <figcaption>{s.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
          <style>{screensCss}</style>
        </Reveal>
      )}
      <Reveal>
        <h2 className="mf-prod__h2">{c.diagTitle}</h2>
        <p className="mf-prod__p">{c.diagLead}</p>
        <ol className="mf-prod__list mf-prod__ol">
          {c.diagSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="mf-prod__p">{c.diagAlt}</p>
        <p className="mf-prod__p mf-prod__small">{c.diagNote}</p>
      </Reveal>
    </>
  );

  return (
    <ProductPage
      c={c}
      primaryHref={WHATSAPP_APONTADOR_URL}
      secondaryHref={APONTADOR_DEMO_URL}
      contactLine={`${c.whatsappNote} · ${WHATSAPP_APONTADOR_DISPLAY}`}
      extra={extra}
    />
  );
}
