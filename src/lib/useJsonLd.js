import { useEffect } from "react";

/**
 * Injeta um bloco JSON-LD no <head> enquanto a pagina estiver montada.
 * `data` deve ser estavel (constante de modulo) para nao recriar a tag
 * a cada render. Usado pelas paginas de produto para o FAQPage.
 */
export function useJsonLd(id, data) {
  useEffect(() => {
    if (!data) return undefined;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = `ld-${id}`;
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
    return () => el.remove();
  }, [id, data]);
}
