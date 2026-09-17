import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Camada de tema — claro e a identidade editorial (tinta sobre osso);
 * escuro e a mesma arquitetura com o passeio de valor invertido
 * (osso sobre tinta). O cobre clareia para manter 5,7:1 no fundo
 * escuro (medido, WCAG AA para texto de apoio).
 *
 * Regras fixadas com o Eduardo (17/09):
 * - a escolha acontece UMA vez, no portao de entrada, e persiste em
 *   localStorage (mf-theme);
 * - claro e o padrao: o tema escuro nunca e imposto por deteccao;
 * - trocas posteriores ficam no toggle discreto do rodape.
 */

export const THEMES = ["light", "dark"];
const STORAGE_KEY = "mf-theme";

/** Ja escolheu tema alguma vez? (Sem storage = considerar escolhido, nunca travar a entrada.) */
export function hasThemeChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return true;
  }
}

function readStoredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function detectTheme() {
  return readStoredTheme() || "light";
}

/** Pre-paint: roda no index.html antes do bundle para nao piscar tema. */
export function applyThemeEarly() {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    if (t === "dark") document.documentElement.dataset.skin = "dark";
  } catch {
    /* modo privado: claro padrao */
  }
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() =>
    typeof document === "undefined"
      ? "light"
      : (document.documentElement.dataset.skin || detectTheme())
  );

  useEffect(() => {
    document.documentElement.dataset.skin = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* sem persistencia: a sessao atual continua valendo */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    if (THEMES.includes(next)) setThemeState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, isDark: theme === "dark" }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme precisa estar dentro de <ThemeProvider>");
  return ctx;
}
