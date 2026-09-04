import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
      </header>

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
  font-family:var(--font-mono);font-size:9px;
  letter-spacing:0.24em;text-transform:uppercase;
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

/* Em telas estreitas: marca + contato em cima, rotulos rolaveis
   embaixo. Nada some — esconder a navegacao custa visita. */
@media(max-width:859px){
  .mf-nav{
    height:auto;flex-wrap:wrap;align-items:center;
    gap:0.8rem;padding:0.7rem var(--gutter) 0;
  }
  .mf-nav__brand{flex:1 1 auto;min-width:0}
  .mf-nav__logo{height:32px;width:auto}
  .mf-nav__cta{order:2}
  .mf-nav__links{
    order:3;margin-left:0;flex:1 0 100%;
    gap:1.3rem;overflow-x:auto;scrollbar-width:none;
    padding:0.45rem 0 0.7rem;
  }
  .mf-nav__links::-webkit-scrollbar{display:none}
  .mf-nav__link,.mf-nav__lang{flex:0 0 auto}
  .mf-nav__lang{margin-left:auto;padding-left:1.3rem}
}
      `}</style>
    </>
  );
}