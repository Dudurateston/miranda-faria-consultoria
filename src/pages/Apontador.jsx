import React from "react";
import { Navigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import ProductPage from "@/components/ProductPage";
import { useLang } from "@/lib/i18n";
import { usePageTitle } from "@/lib/usePageTitle";
import { useJsonLd } from "@/lib/useJsonLd";
import { APONTADOR as c, APONTADOR_FAQ_LD } from "@/content/produtos";
import { WHATSAPP_APONTADOR_URL, WHATSAPP_APONTADOR_DISPLAY, APONTADOR_DEMO_URL } from "@/lib/site";

/**
 * Apontador — pagina de produto em PT, para industrias (15/10/2026).
 * So existe em /pt/apontador; /en/apontador redireciona.
 * CTA unico: diagnostico gratis do AFD pelo WhatsApp de vendas.
 */
export default function Apontador() {
  const { lang } = useLang();
  usePageTitle(c.pageTitle, "apontador");
  useJsonLd("apontador-faq", lang === "pt" ? APONTADOR_FAQ_LD : null);

  if (lang !== "pt") return <Navigate to="/pt/apontador" replace />;

  const extra = (
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
