import React, { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/siteAnalytics";
import { copy } from "@/content/copy";
import { useLang } from "@/lib/i18n";

/**
 * Aviso LGPD — discreto, no canto, na linguagem do site: o visitante
 * decide em um toque e a decisao fica registrada. Sem drama.
 */
export default function ConsentBanner() {
  const [decision, setDecision] = useState("pending"); // pending|undecided
  const { lang } = useLang();
  const t = copy[lang].consent;

  useEffect(() => {
    const c = getConsent();
    if (c === null) setDecision("undecided");
    else setDecision(c);
  }, []);

  const decide = (v) => {
    setConsent(v);
    window.dispatchEvent(new CustomEvent("mf-consent-changed"));
    setDecision(v);
  };

  if (decision !== "undecided") return null;

  return (
    <aside
      className="mf-consent"
      role="dialog"
      aria-live="polite"
      aria-label={t.title}
    >
      <p className="mf-consent__label">{lang === "en" ? "GDPR" : "LGPD"}</p>
      <p className="mf-consent__text">{t.text}</p>
      <div className="mf-consent__actions">
        <button
          type="button"
          className="mf-consent__yes"
          onClick={() => decide("granted")}
          data-cursor="link"
        >
          {t.accept}
        </button>
        <button
          type="button"
          className="mf-consent__no"
          onClick={() => decide("denied")}
          data-cursor="link"
        >
          {t.decline}
        </button>
        <a href="/privacidade" className="mf-consent__link" data-cursor="link">
          {t.policy}
        </a>
      </div>

      <style>{`
.mf-consent{
  position:fixed;left:var(--gutter);bottom:1.4rem;z-index:40;
  max-width:min(88vw,420px);
  background:#141414;color:var(--bone);
  border:1px solid rgba(245,242,237,0.16);
  padding:1.2rem 1.4rem 1.3rem;
}
.mf-consent__label{
  margin:0 0 0.5rem;
  font-family:var(--font-mono);font-size:10px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--copper-light,#E08A5F);
}
.mf-consent__text{
  margin:0 0 1rem;
  font-family:var(--font-body);font-weight:300;
  font-size:13px;line-height:1.6;color:rgba(245,242,237,0.86);
}
.mf-consent__actions{display:flex;align-items:center;gap:0.9rem;flex-wrap:wrap}
.mf-consent__yes,.mf-consent__no{
  font-family:var(--font-mono);font-size:11px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  cursor:pointer;padding:0.55rem 1rem;
}
.mf-consent__yes{background:var(--mf-terracotta);border:1px solid var(--mf-terracotta);color:var(--on-accent)}
.mf-consent__no{background:none;border:1px solid rgba(245,242,237,0.4);color:rgba(245,242,237,0.86)}
.mf-consent__link{
  font-family:var(--font-mono);font-size:11px;letter-spacing:var(--tracking-label);
  text-transform:uppercase;color:rgba(245,242,237,0.6);text-decoration:underline;
  text-underline-offset:3px;
}
@media(max-width:859px){
  /* 21/10: no mobile o banner virou bottom-sheet compacto (411px -> 230px em
     390x844, medido) com o corpo rolavel dentro do proprio sheet. Texto
     INTEGRAL, sem clamp; botoes e link da politica ficam fora da area rolavel,
     ou seja sempre alcancaveis. Consentimento, URLs e gated-tracking intactos.
     SOBREPOSICAO (medido, honesto): na primeira visita o sheet ainda cobre
     parte dos CTAs da hero em janelas curtas - 390: CTA termina em 646 e o
     sheet comeca em 614 (~32px); 360: ~43px; 320: cobertura maior (a hero
     ocupa 76-88% da altura). Ate o visitante escolher uma opcao o CTA fica
     atras do sheet; qualquer escolha libera a tela. Em 768+ o sheet nao cobre
     CTA nenhum. O banner de DESKTOP segue inalterado e ja sobrepunha o CTA da
     hero em 1440 no ar (pre-existente, fora deste escopo). */
  .mf-consent{left:var(--gutter);right:var(--gutter);bottom:0;max-width:none;z-index:60;
    padding:0.65rem 0.85rem calc(0.7rem + env(safe-area-inset-bottom));
    border-left:none;border-right:none;border-bottom:none}
  .mf-consent__label{margin-bottom:0.15rem;font-size:9px}
  .mf-consent__text{font-size:12px;line-height:1.42;margin-bottom:0.55rem;
    max-height:30vh;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
  .mf-consent__actions{gap:0.45rem}
  .mf-consent__yes,.mf-consent__no{padding:0.45rem 0.8rem}
}
      @media(max-width:860px){.mf-consent__yes, .mf-consent__no, .mf-consent__link{min-height:44px;display:inline-flex;align-items:center}}
`}</style>
    </aside>
  );
}
