import { useTheme } from "@/lib/theme";

/**
 * Toggle de tema, visível e óbvio (pedido Eduardo 17/09: "deixe claro
 * que dá pra mudar o tema"). Ícone do destino + rótulo em caixa alta.
 * Variantes: nav (desktop), menu (menu mobile), foot (rodapé).
 */
export default function ThemeToggle({ lang = "pt", variant = "nav" }) {
  const { setTheme, isDark } = useTheme();
  const pt = lang === "pt";
  const label = isDark ? (pt ? "CLARO" : "LIGHT") : (pt ? "ESCURO" : "DARK");
  const title = pt ? `Mudar para tema ${label.toLowerCase()}` : `Switch to ${label.toLowerCase()} theme`;
  // icone = o destino: sol quando está escuro, lua quando está claro
  const icon = isDark ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.2v2.4M12 19.4v2.4M2.2 12h2.4M19.4 12h2.4M5.1 5.1l1.7 1.7M17.2 17.2l1.7 1.7M18.9 5.1l-1.7 1.7M6.8 17.2l-1.7 1.7" />
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M20.6 14.3A8.6 8.6 0 0 1 9.7 3.4a8.6 8.6 0 1 0 10.9 10.9Z" />
    </svg>
  );
  return (
    <>
      <button
        type="button"
        className={`mf-ttskin mf-ttskin--${variant}`}
        data-cursor="link"
        aria-pressed={isDark ? "true" : "false"}
        title={title}
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {icon}
        <span>{label}</span>
      </button>
      <style>{`
.mf-ttskin{
  display:inline-flex;align-items:center;gap:0.45rem;
  font-family:var(--font-mono);text-transform:uppercase;
  background:none;border:0;cursor:pointer;padding:0;
  color:var(--color-text-secondary);
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-ttskin:hover{color:var(--color-accent)}
.mf-ttskin--nav{
  font-size:var(--text-label);letter-spacing:var(--tracking-label);
  min-height:44px;padding:0 0.2rem;
}
.mf-ttskin--menu{
  font-size:var(--text-label);letter-spacing:var(--tracking-label);
  min-height:48px;width:100%;justify-content:flex-start;
  color:var(--color-text-primary);
}
.mf-ttskin--menu svg{width:15px;height:15px}
.mf-ttskin--foot{
  font-size:var(--text-label);letter-spacing:var(--tracking-label);
  min-height:24px;padding:4px 0;color:var(--color-text-ghost);
}
.mf-ttskin--foot:hover{color:var(--copper-light)}
`}</style>
    </>
  );
}
