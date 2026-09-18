import React, { useRef, useState } from "react";
import Link from "@/components/TransitionLink";

import { useLang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { copy } from "@/content/copy";
import { LINKEDIN_URL, M_LOGO, LOGO_ANIM_GIF, SELLERS_APP_URL } from "@/lib/site";

/**
 * Rodape grafite, fechando o site no mesmo campo da home. O M e um
 * botao: tres cliques rapidos abrem a animacao da marca (easter egg).
 */
export default function Footer() {
  const { lang, path } = useLang();
  const t = copy[lang];
  const { theme, setTheme, isDark } = useTheme();

  const [egg, setEgg] = useState(false);
  const clicks = useRef(0);
  const timer = useRef(null);

  const onMarkClick = () => {
    clicks.current += 1;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 900);
    if (clicks.current >= 3) {
      clicks.current = 0;
      setEgg(true);
    }
  };

  return (
    <>
      <footer className="mf-foot" data-theme="dark">
        <div className="mf-foot__inner">
          <div className="mf-foot__row mf-foot__row--top">
          <div className="mf-foot__brand">
            <button
              type="button"
              className="mf-foot__mark"
              onClick={onMarkClick}
              data-cursor="link"
              aria-label="Miranda Faria"
            >
              <img src={M_LOGO} alt="" aria-hidden="true" />
            </button>
            <p className="mf-foot__tag">{t.footer.tagline}</p>
          </div>
          <nav className="mf-foot__links" aria-label={t.nav.home}>
            <Link to={path("work")} data-cursor="link" className="mf-foot__link">
              {t.nav.work}
            </Link>
            <Link to={path("servicos")} data-cursor="link" className="mf-foot__link">
              {t.nav.services}
            </Link>
            <Link to={path("about")} data-cursor="link" className="mf-foot__link">
              {t.nav.about}
            </Link>
            <Link to={path("contact")} data-cursor="link" className="mf-foot__link">
              {t.nav.contact}
            </Link>
          </nav>
          </div>
          <div className="mf-foot__row mf-foot__row--sub">
          <div className="mf-foot__meta">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="mf-foot__link"
            >
              {t.footer.linkedin}
            </a>
            <a
              href={SELLERS_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="mf-foot__link mf-foot__link--sellers"
            >
              {t.footer.sellers} ↗
            </a>
            <Link to={path("privacidade")} data-cursor="link" className="mf-foot__link">
              {t.footer.privacy}
            </Link>
            <a
              href={`https://wa.me/5537999512146?text=${encodeURIComponent((lang === "en" ? "I spotted an issue on the site: " : "Encontrei um problema no site: ") + (typeof window !== "undefined" ? window.location.pathname : "/"))}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="mf-foot__link mf-foot__link--report"
            >
              {t.footer.report}
            </a>
            <ThemeToggle lang={lang} variant="foot" />
            <span className="mf-foot__copy">© 2023 Miranda Faria</span>
          </div>
          </div>
        </div>

        {/* Farol de cobre — o unico do site inteiro (DECISIONS.md). */}
        <span className="mf-foot__beacon" aria-hidden="true" />
        <div className="mf-foot__word" aria-hidden="true">
          MIRANDA FARIA<span className="mf-foot__worddot">.</span>
        </div>
      </footer>

      {egg && (
        <div
          className="mf-egg"
          onClick={() => setEgg(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Miranda Faria"
        >
          <img src={LOGO_ANIM_GIF} alt="Miranda Faria" />
        </div>
      )}

      <style>{`
.mf-foot{
  position:relative;
  padding:clamp(3.5rem,7vh,5rem) var(--gutter) clamp(2.5rem,5vh,3.5rem);
  background:#141414;
  border-top:1px solid var(--mf-rule);
}
.mf-foot__inner{
  max-width:var(--max-width-page);margin:0 auto;
  display:flex;flex-direction:column;gap:clamp(1.6rem,3.5vh,2.4rem);
}
.mf-foot__row{display:flex;align-items:center;justify-content:space-between;gap:1.4rem 2.5rem;flex-wrap:wrap}
.mf-foot__row--sub{border-top:1px solid var(--mf-rule);padding-top:1.4rem}
.mf-foot__brand{display:flex;align-items:center;gap:1rem}
.mf-foot__mark{background:none;border:0;padding:0;cursor:pointer;display:flex;min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:flex-start}
.mf-foot__mark img{height:34px;width:auto;display:block;filter:invert(1) brightness(1.05) contrast(0.9)}
.mf-foot__tag{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);margin:0;
}
@media(max-width:859px){
  .mf-foot__tag{font-size:11px;letter-spacing:0.14em;line-height:1.6;color:var(--color-text-secondary)}
}
.mf-foot__word{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(3.2rem,12.5vw,10.5rem);line-height:0.78;
  letter-spacing:0.035em;text-transform:uppercase;
  color:rgba(245,241,234,0.08);white-space:nowrap;
  max-width:var(--max-width-page);margin:2.6rem auto 0;
  user-select:none;pointer-events:none;overflow:hidden;
}
.mf-foot__worddot{color:var(--copper-light,#E08A5F);opacity:0.55}
.mf-foot__links{display:flex;flex-wrap:wrap;gap:1rem 1.8rem}

.mf-foot__link{
  display:inline-flex;align-items:center;min-height:24px;padding:4px 0;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-foot__link:hover{color:var(--color-accent)}
.mf-foot__meta{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.8rem}

.mf-foot__link--sellers{color:var(--copper-light)}

.mf-foot__copy{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);
}

.mf-foot__beacon{
  position:absolute;right:var(--gutter);bottom:1.4rem;
  width:6px;height:6px;border-radius:50%;
  background:var(--copper);
  animation:mf-beacon 3.4s var(--ease-in-out) infinite;
}
@keyframes mf-beacon{
  0%,100%{opacity:0.25;transform:scale(1)}
  50%{opacity:1;transform:scale(1.35)}
}
@media(prefers-reduced-motion:reduce){
  .mf-foot__beacon{animation:none;opacity:0.7}
}

.mf-egg{
  position:fixed;inset:0;z-index:200;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  background:rgba(20,20,20,0.92);
}
.mf-egg img{width:clamp(220px,40vw,420px);display:block;filter:invert(1) brightness(1.05) contrast(0.9)}
      @media(max-width:860px){.mf-foot__link{min-height:44px;display:inline-flex;align-items:center}}
`}</style>
    </>
  );
}