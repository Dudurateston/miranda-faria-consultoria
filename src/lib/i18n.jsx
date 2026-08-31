import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Camada de idioma — EN padrao, PT alternativo.
 *
 * Regras fixadas em DECISIONS.md:
 * - `navigator.language` decide o padrao na primeira visita;
 * - a escolha manual persiste em localStorage e vence a deteccao;
 * - SEM trava por IP (quebra VPN/viagem e prejudica SEO);
 * - rotas reais `/en` e `/pt`, nunca hash, para indexacao com hreflang.
 *
 * A rota e a fonte da verdade: o provider recebe o idioma ja resolvido
 * pelo router e so cuida de persistir e de trocar de rota na troca.
 */

export const LANGS = ["en", "pt"];
export const DEFAULT_LANG = "en";
const STORAGE_KEY = "mf-lang";

const LanguageContext = createContext(null);

export function isLang(value) {
  return LANGS.includes(value);
}

/** Le a preferencia salva. Storage pode lancar (modo privado, cookies bloqueados). */
export function readStoredLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isLang(saved) ? saved : null;
  } catch {
    return null;
  }
}

function writeStoredLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* sem persistencia: a rota continua sendo a fonte da verdade */
  }
}

/**
 * Idioma da primeira visita: preferencia salva > navigator > EN.
 * Aceita qualquer variante regional de portugues (pt, pt-BR, pt-PT).
 */
export function detectLang() {
  const stored = readStoredLang();
  if (stored) return stored;

  if (typeof navigator !== "undefined") {
    const candidates = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    for (const tag of candidates) {
      if (typeof tag === "string" && tag.toLowerCase().startsWith("pt")) return "pt";
      if (typeof tag === "string" && tag.toLowerCase().startsWith("en")) return "en";
    }
  }
  return DEFAULT_LANG;
}

/** Caminho equivalente no outro idioma: /en/work -> /pt/work */
export function swapLangInPath(pathname, nextLang) {
  const segments = pathname.split("/").filter(Boolean);
  if (isLang(segments[0])) {
    segments[0] = nextLang;
  } else {
    segments.unshift(nextLang);
  }
  return `/${segments.join("/")}`;
}

export function LanguageProvider({ lang, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    writeStoredLang(lang);
  }, [lang]);

  // <html lang> correto para leitores de tela e para o motor de busca.
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = useCallback(
    (nextLang) => {
      if (!isLang(nextLang) || nextLang === lang) return;
      writeStoredLang(nextLang);
      navigate(swapLangInPath(location.pathname, nextLang) + location.hash, {
        replace: false,
      });
    },
    [lang, location.hash, location.pathname, navigate]
  );

  /** Prefixa um caminho interno com o idioma corrente. `path("work")` -> `/en/work` */
  const path = useCallback(
    (subpath = "") => {
      const clean = String(subpath).replace(/^\/+/, "");
      return clean ? `/${lang}/${clean}` : `/${lang}`;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, path, otherLang: lang === "en" ? "pt" : "en" }),
    [lang, setLang, path]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang precisa estar dentro de <LanguageProvider>");
  return ctx;
}
