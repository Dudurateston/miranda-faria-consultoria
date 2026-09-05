import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { WHATSAPP_URL_BARE, M_LOGO } from "@/lib/site";

/**
 * Navegacao persistente, no formato do print de referencia:
 * marca (M translucida + lockup de duas linhas) a esquerda, rotulos
 * no centro-direita e o botao CONTATO com filete terracota na
 * extremidade direita — levando ao WhatsApp.
 *
 * Na home ela se revela depois da hero. Nas internas, aparece de
 * imediato. Em telas estreitas vira duas faixas: marca + contato em
 * cima, rotulos rolaveis embaixo.
 */
export default function SiteNav({ revealAfterHero = false }) {
  const { lang, otherLang, setLang, path } = useLang();
  const t = copy[lang].nav;
  const home = copy[lang].home;
  const [show, setShow] = useState(!revealAfterHero);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // o menu de tela cheia fecha sozinho ao navegar, no ESC e trava o
  // scroll do corpo enquanto esta aberto
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!revealAfterHero) {
      setShow(true);
      return;
    }
    const threshold = () => window.innerHeight * 0.72;
    const onScroll = () => setShow(window.scrollY > threshold());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [revealAfterHero]);

  const links = [
    { to: path("about"), label: t.about },
    { to: path("servicos"), label: t.services },
    { to: path("how-i-work"), label: t.technology },
    { to: path("insights"), label: t.insights },
  ];

  return (
    <>
      <header className="mf-nav" data-show={show ? "true" : "false"}>
        <NavLink to={path()} className="mf-nav__brand" data-cursor="link">
          <img src={M_LOGO} alt="Miranda Faria" className="mf-nav__logo" />
          <span className="mf-nav__lockup">
            <span className="mf-nav__name">{home.wordmark}</span>
            <span className="mf-nav__role">{home.role}</span>
          </span>
        </NavLink>

        <nav className="mf-nav__links" aria-label={t.home}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-cursor="link"
              className={({ isActive }) =>
                `mf-nav__link${isActive ? " is-active" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="mf-nav__lang"
            data-cursor="link"
            onClick={() => setLang(otherLang)}
            lang={otherLang === "pt" ? "pt-BR" : "en"}
          >
            {t.toggle}
          </button>
        </nav>

        <a
          href={WHATSAPP_URL_BARE}
          target="_blank"
          rel="noopener noreferrer"
          className="mf-nav__cta"
          data-cursor="link"
        >
          {t.contact}
        </a>

        {/* Mobile: o menu de tela cheia — duas linhas que viram X. */}
        <button
          type="button"
          className="mf-nav__burger"
          aria-expanded={menuOpen}
          aria-controls="mf-mnav"
          aria-label={menuOpen ? t.close : t.menu}
          onClick={() => setMenuOpen((o) => !o)}
          data-cursor="link"
        >
          <span />
          <span />
        </button>
      </header>

      {/* Overlay de tela cheia: rotulos grandes em serif, entrada
          em cascata, M na marca d'agua e o WhatsApp embaixo. */}
      <div className="mf-mnav" id="mf-mnav" data-open={menuOpen ? "true" : "false"} aria-hidden={!menuOpen}>
        <nav className="mf-mnav__list" aria-label={t.home}>
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              style={{ transitionDelay: `${menuOpen ? 120 + i * 70 : 0}ms` }}
              className={({ isActive }) => `mf-mnav__link${isActive ? " is-active" : ""}`}
              data-cursor="link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mf-mnav__foot">
          <button
            type="button"
            className="mf-mnav__lang"
            onClick={() => setLang(otherLang)}
            lang={otherLang === "pt" ? "pt-BR" : "en"}
          >
            {t.toggle}
          </button>
          <a
            href={WHATSAPP_URL_BARE}
            target="_blank"
            rel="noopener noreferrer"
            className="mf-mnav__cta"
          >
            {t.contact}
          </a>
        </div>
        <img className="mf-mnav__wm" src={M_LOGO} alt="" aria-hidden="true" />
      </div>

      <style>{`
.mf-nav{
  position:fixed;top:0;left:0;right:0;z-index:60;
  height:var(--nav-height);
  display:flex;align-items:center;gap:clamp(1.2rem,3vw,3rem);
  padding:0 var(--gutter);
  background:rgba(245,242,237,0.9);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid var(--color-divider);
  transition:opacity var(--duration-base) var(--ease-in-out),
             transform var(--duration-base) var(--ease-in-out),
             background-color var(--duration-slow) var(--ease-in-out);
}
[data-theme="on-deep"] .mf-nav{background:rgba(30,27,23,0.86)}
[data-theme="on-deep"] .mf-nav__logo{filter:invert(1) brightness(1.05) contrast(0.9)}
.mf-nav[data-show="false"]{opacity:0;transform:translateY(-100%);pointer-events:none}
.mf-nav[data-show="true"]{opacity:1;transform:translateY(0);pointer-events:auto}

.mf-nav__brand{display:flex;align-items:center;gap:0.8rem;text-decoration:none;white-space:nowrap;flex:0 0 auto}
.mf-nav__logo{width:auto;height:40px;object-fit:contain;display:block}
.mf-nav__lockup{display:flex;flex-direction:column;line-height:1.3}
.mf-nav__name{
  font-family:var(--font-display);font-weight:600;font-size:12px;
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  color:var(--color-text-primary);
}
.mf-nav__role{
  font-family:var(--font-mono);font-size:11px;
  letter-spacing:0.2em;text-transform:uppercase;
  color:var(--color-text-secondary);
}

.mf-nav__links{display:flex;align-items:center;gap:clamp(1rem,2.2vw,2rem);margin-left:auto}
.mf-nav__link{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
  padding-bottom:2px;border-bottom:1px solid transparent;
  transition:color var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out);
}
.mf-nav__link:hover{color:var(--color-text-primary)}
.mf-nav__link.is-active{color:var(--color-text-primary);border-bottom-color:var(--color-accent)}

.mf-nav__lang{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-primary);background:none;border:0;padding:0 0 2px;cursor:pointer;
  white-space:nowrap;
  border-bottom:1px solid var(--color-accent);
}
.mf-nav__lang:hover{opacity:0.68}

.mf-nav__cta{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--mf-terracotta);background:transparent;
  border:1px solid var(--mf-terracotta);
  padding:0.55rem 1.2rem;text-decoration:none;white-space:nowrap;flex:0 0 auto;
  transition:background var(--duration-fast) var(--ease-in-out),
             color var(--duration-fast) var(--ease-in-out);
}
.mf-nav__cta:hover{background:var(--mf-terracotta);color:var(--bone)}

/* ===== Mobile: header de uma linha + menu de tela cheia =====
   A fileira rolavel de rotulos virou overlay — a pagina respira e a
   navegacao ganha o palco quando pedida. */
.mf-nav__burger{
  display:none;width:44px;height:44px;margin:0 -0.6rem 0 0.4rem;
  flex-direction:column;justify-content:center;align-items:center;gap:7px;
  background:none;border:0;cursor:pointer;
  -webkit-tap-highlight-color:rgba(184,115,51,0.18);
}
.mf-nav__burger span{
  display:block;width:24px;height:1.5px;background:var(--color-text-primary);
  transition:transform var(--duration-base) var(--ease-out-expo),
             opacity var(--duration-fast) var(--ease-in-out);
}
.mf-nav__burger[aria-expanded="true"] span:first-child{transform:translateY(4.25px) rotate(45deg)}
.mf-nav__burger[aria-expanded="true"] span:last-child{transform:translateY(-4.25px) rotate(-45deg)}

.mf-mnav{
  position:fixed;inset:0;z-index:55;
  display:flex;flex-direction:column;justify-content:center;
  padding:calc(var(--nav-height) + 2rem) var(--gutter) 2.5rem;
  background:#141414;color:var(--bone);
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity 0.4s var(--ease-in-out),visibility 0.4s;
}
.mf-mnav[data-open="true"]{opacity:1;visibility:visible;pointer-events:auto}
.mf-mnav__list{display:flex;flex-direction:column;gap:0.2rem;position:relative;z-index:1}
.mf-mnav__link{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(2.1rem,10vw,3.2rem);line-height:1.22;
  letter-spacing:var(--tracking-display);
  color:var(--bone);text-decoration:none;
  display:inline-block;width:max-content;max-width:100%;
  padding:0.45rem 0;
  transform:translateY(24px);opacity:0;
  transition:transform 0.55s var(--ease-out-expo),opacity 0.45s var(--ease-in-out),color var(--duration-fast) var(--ease-in-out);
  -webkit-tap-highlight-color:rgba(184,115,51,0.18);
}
.mf-mnav[data-open="true"] .mf-mnav__link{transform:translateY(0);opacity:1}
.mf-mnav__link.is-active,
.mf-mnav__link:hover{color:var(--mf-terracotta)}
.mf-mnav__link.is-active{border-bottom:1px solid var(--mf-terracotta)}
.mf-mnav__foot{
  display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap;
  margin-top:2.8rem;position:relative;z-index:1;
}
.mf-mnav__lang{
  background:none;border:1px solid rgba(245,242,237,0.35);color:var(--bone);
  font-family:var(--font-mono);font-size:12px;letter-spacing:var(--tracking-label);
  text-transform:uppercase;padding:0.8rem 1.2rem;cursor:pointer;
  transition:border-color var(--duration-fast) var(--ease-in-out);
}
.mf-mnav__lang:hover{border-color:var(--bone)}
.mf-mnav__cta{
  font-family:var(--font-mono);font-size:12px;letter-spacing:var(--tracking-label);
  text-transform:uppercase;text-decoration:none;
  color:var(--bone);background:var(--mf-terracotta);
  padding:0.8rem 1.4rem;
}
.mf-mnav__wm{
  position:absolute;left:50%;bottom:-6%;transform:translateX(-50%);
  width:min(72vw,420px);height:auto;opacity:0.07;
  filter:invert(1) brightness(1.1);
  pointer-events:none;user-select:none;
}

@media(max-width:859px){
  .mf-nav{gap:0.6rem}
  .mf-nav__links{display:none}
  .mf-nav__burger{display:flex}
  .mf-nav__brand{flex:1 1 auto;min-width:0}
  .mf-nav__logo{height:26px;width:auto}
  .mf-nav__cta{padding:0.55rem 1rem}
}
@media(min-width:860px){
  .mf-mnav{display:none}
  .mf-nav__burger{display:none}
}
      `}</style>
    </>
  );
}