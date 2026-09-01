import React, { useEffect } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/Footer";
import MobileWhatsAppBar from "@/components/MobileWhatsAppBar";
import { useStageFirstScreen } from "@/hooks/useStageFirstScreen";
import { LANGS, useLang, swapLangInPath } from "@/lib/i18n";
import { copy } from "@/content/copy";

/**
 * Mantem no <head> a description e os alternates de idioma. Feito a mao
 * em vez de puxar react-helmet: sao poucas tags e uma dependencia a
 * menos para carregar.
 *
 * O <title> NAO e definido aqui — cada pagina o define via
 * usePageTitle. Efeito de filho roda antes de efeito de pai, entao um
 * title escrito aqui sobrescreveria o da pagina.
 */
function useDocumentHead(lang, pathname) {
  useEffect(() => {
    const meta = copy[lang].meta;

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", meta.description);

    // hreflang: cada idioma aponta para o equivalente exato da rota atual.
    const existing = document.querySelectorAll('link[data-mf-alt="1"]');
    existing.forEach((el) => el.remove());

    const origin = window.location.origin;

    // Canonical: sem ele, a mesma pagina alcancada por URLs diferentes
    // (com query de campanha, por exemplo) e indexada como duplicata.
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.appendChild(canon);
    }
    canon.setAttribute("href", origin + pathname);

    const alternates = [
      ...LANGS.map((l) => ({ hreflang: l, href: origin + swapLangInPath(pathname, l) })),
      { hreflang: "x-default", href: origin + swapLangInPath(pathname, "en") },
    ];
    alternates.forEach(({ hreflang, href }) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", hreflang);
      link.setAttribute("href", href);
      link.setAttribute("data-mf-alt", "1");
      document.head.appendChild(link);
    });
  }, [lang, pathname]);
}

export default function SiteLayout() {
  const { lang } = useLang();
  const location = useLocation();
  const isHome = Boolean(useMatch("/:lang"));

  // O que ja esta na primeira tela nao entra com animacao.
  useStageFirstScreen(location.pathname);

  useDocumentHead(lang, location.pathname);

  return (
    <div className="mf-shell">
      {/* Progresso de leitura — dirigido pelo scroll do documento em
          CSS puro, sem laco de animacao proprio. */}
      <div className="mf-progress" aria-hidden="true" />

      {/* A nav so espera a hero passar na home; nas internas aparece de cara. */}
      <SiteNav />
      <main id="conteudo" className={isHome ? undefined : "mf-shell__main"}>
        <Outlet />
      </main>
      <Footer />
      {lang === "pt" && <MobileWhatsAppBar />}
      {lang === "pt" && <div className="h-20 md:hidden" />}

      <style>{`
.mf-progress{
  position:fixed;top:0;left:0;right:0;height:2px;z-index:70;
  background:var(--copper);transform:scaleX(0);transform-origin:left center;
}

/* Paginas internas comecam abaixo da nav fixa; a home nao, porque a
   hero ocupa a viewport inteira e a nav so aparece depois dela. */
.mf-shell__main{padding-top:var(--nav-height)}
@media(max-width:859px){
  .mf-shell__main{padding-top:calc(var(--nav-height) + 2.2rem)}
}
      `}</style>
    </div>
  );
}
