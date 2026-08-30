import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/**
 * Define o <title> da pagina corrente.
 *
 * O titulo mora nas paginas, e nao no SiteLayout, por causa da ordem de
 * efeitos do React: o efeito do filho roda antes do efeito do pai, entao
 * um title escrito pela pagina seria sobrescrito pelo layout logo em
 * seguida. Cada pagina de conteudo chama este hook.
 *
 * `pageTitle` vazio (a Home) usa o titulo institucional inteiro.
 */
export function usePageTitle(pageTitle) {
  const { lang } = useLang();

  useEffect(() => {
    const base = copy[lang].meta.title;
    document.title = pageTitle ? `${pageTitle} — ${copy[lang].home.wordmark}` : base;
  }, [lang, pageTitle]);
}
