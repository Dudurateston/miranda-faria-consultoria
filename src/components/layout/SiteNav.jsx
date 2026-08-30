import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/**
 * Navegacao persistente. Fica igual entre as paginas — nav, paleta,
 * tipografia e grid sao a constante; cada pagina varia so na sua
 * assinatura visual (CLAUDE.md).
 *
 * Na home ela se revela depois da hero, para a abertura ocupar a tela
 * inteira. Nas paginas internas aparece de imediato, porque ali o
 * visitante ja esta navegando e precisa da orientacao.
 */
export default function SiteNav({ revealAfterHero = false }) {
  const { lang, otherLang, setLang, path } = useLang();
  const t = copy[lang].nav;
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
    { to: path("work"), label: t.work },
    { to: path("how-i-work"), label: t.howIWork },
    { to: path("about"), label: t.about },
    { to: path("contact"), label: t.contact },
  ];

  return (
    <>
      <header className="mf-nav" data-show={show ? "true" : "false"}>
        <NavLink to={path()} className="mf-nav__mark" data-cursor="link">
          Miranda Faria
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
      </header>

      <style>{`
.mf-nav{
  position:fixed;top:0;left:0;right:0;z-index:60;
  height:var(--nav-height);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 var(--gutter);
  background:rgba(245,241,234,0.88);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid var(--hairline);
  transition:opacity var(--duration-base) var(--ease-in-out),
             transform var(--duration-base) var(--ease-in-out);
}
.mf-nav[data-show="false"]{opacity:0;transform:translateY(-100%);pointer-events:none}
.mf-nav[data-show="true"]{opacity:1;transform:translateY(0);pointer-events:auto}

.mf-nav__mark{
  font-family:var(--font-display);font-weight:400;font-size:13px;
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  color:var(--ink);text-decoration:none;white-space:nowrap;
}
.mf-nav__links{display:flex;align-items:center;gap:clamp(1rem,2.4vw,2.2rem)}
.mf-nav__link{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--ink-dim);text-decoration:none;
  padding-bottom:2px;border-bottom:1px solid transparent;
  transition:color var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out);
}
.mf-nav__link:hover{color:var(--ink)}
.mf-nav__link.is-active{color:var(--ink);border-bottom-color:var(--copper)}

.mf-nav__lang{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--copper);background:none;border:0;padding:0;cursor:pointer;
  white-space:nowrap;
}
.mf-nav__lang:hover{text-decoration:underline;text-underline-offset:4px}

/* Em telas estreitas a nav vira duas linhas: marca e idioma em cima,
   os rotulos numa faixa propria embaixo. Nada some — num portfolio,
   esconder a navegacao no celular custa visita. */
@media(max-width:859px){
  .mf-nav{
    height:auto;flex-direction:column;align-items:stretch;gap:0;
    padding:0.7rem var(--gutter) 0;
  }
  .mf-nav__mark{align-self:flex-start}
  .mf-nav__links{
    gap:1.4rem;margin-top:0.6rem;
    overflow-x:auto;scrollbar-width:none;
    padding-bottom:0.7rem;
  }
  .mf-nav__links::-webkit-scrollbar{display:none}
  .mf-nav__link,.mf-nav__lang{flex:0 0 auto}
  /* o toggle de idioma vai para o fim da faixa, depois dos rotulos */
  .mf-nav__lang{margin-left:auto;padding-left:1.4rem}
}
      `}</style>
    </>
  );
}
