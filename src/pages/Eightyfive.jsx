import React from "react";
import { Navigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import ProductPage from "@/components/ProductPage";
import { useLang } from "@/lib/i18n";
import { usePageTitle } from "@/lib/usePageTitle";
import { useJsonLd } from "@/lib/useJsonLd";
import { EIGHTYFIVE as c, EIGHTYFIVE_FAQ_LD } from "@/content/produtos";
import { EMAIL, EIGHTYFIVE_DEMO_URL } from "@/lib/site";

/**
 * Eightyfive — pagina de produto em EN, para escolas ILEP/TrustEd na
 * Irlanda (15/10/2026). So existe em /en/eightyfive; /pt redireciona.
 * CTA: e-mail (quem recebeu nosso e-mail pode so responder "demo").
 */
export default function Eightyfive() {
  const { lang } = useLang();
  usePageTitle(c.pageTitle, "eightyfive");
  useJsonLd("eightyfive-faq", lang === "en" ? EIGHTYFIVE_FAQ_LD : null);

  if (lang !== "en") return <Navigate to="/en/eightyfive" replace />;

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent("Eightyfive demo")}`;

  const extra = (
    <Reveal>
      <h2 className="mf-prod__h2">{c.sourcesTitle}</h2>
      <ul className="mf-prod__list">
        {c.sources.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className="mf-prod__p mf-prod__small">{c.sourcesNote}</p>
    </Reveal>
  );

  return (
    <ProductPage
      c={c}
      primaryHref={mailto}
      secondaryHref={EIGHTYFIVE_DEMO_URL}
      contactLine={`${c.replyNote} · ${EMAIL}`}
      extra={extra}
    />
  );
}
