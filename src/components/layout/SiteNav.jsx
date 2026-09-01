import React from "react";
import { NavLink } from "react-router-dom";
import PracticeMenu from "@/components/layout/PracticeMenu";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/**
 * Navegacao persistente. Fica igual entre as paginas — nav, paleta,
 * tipografia e grid sao a constante; cada pagina varia so na sua
 * assinatura visual (CLAUDE.md).
 *
 * Ela aparece de imediato em TODA pagina, home inclusive. Antes ficava
 * escondida na home ate 72% da altura da tela, para a abertura ocupar
 * tudo — o que, somado a uma abertura que so revelava o nome depois de
 * quase cinco telas, deixava a primeira tela do site sem nome, sem menu
 * e sem uma frase. A abertura agora divide a tela com a informacao, e a
 * nav nao tem mais motivo para sumir.
 */
export default function SiteNav() {
  const { lang, otherLang, setLang, path } = useLang();
  const t = copy[lang].nav;

  // As tres verticais saem daqui e vivem no PracticeMenu: sete itens de
  // mesmo peso nao formam hierarquia, formam uma lista para varrer.
  const links = [
    { to: path("work"), label: t.work },
    { to: path("about"), label: t.about },
    { to: path("contact"), label: t.contact },
  ];

  return (
    <>
      <header className="mf-nav">
        <NavLink to={path()} className="mf-nav__mark" data-cursor="link">
          Miranda Faria
        </NavLink>

        <nav className="mf-nav__links" aria-label={t.home}>
          <PracticeMenu />
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
  /* Acompanha a rampa de fundo: uma faixa cor-de-osso fixa viraria um
     corte claro assim que a pagina desce para o cobre. */
  background:rgba(245,241,234,0.88);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid var(--color-divider);
  transition:opacity var(--duration-base) var(--ease-in-out),
             transform var(--duration-base) var(--ease-in-out),
             background-color var(--duration-slow) var(--ease-in-out);
}
[data-theme="on-deep"] .mf-nav{background:rgba(30,27,23,0.86)}

.mf-nav__mark{
  font-family:var(--font-display);font-weight:400;font-size:13px;
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  color:var(--color-text-primary);text-decoration:none;white-space:nowrap;
}
.mf-nav__links{display:flex;align-items:center;gap:clamp(1rem,2.4vw,2.2rem)}
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
  /* O acento vive no traco, nunca no texto pequeno — ver tokens.css. */
  border-bottom:1px solid var(--color-accent);
}
.mf-nav__lang:hover{opacity:0.68}

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
