import React, { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "@/lib/i18n";
import { copy, practices, PRACTICE_SLUGS } from "@/content/copy";

/**
 * As tres verticais, recolhidas num submenu.
 *
 * POR QUE: a barra tinha sete itens de mesmo peso, e sete opcoes iguais
 * nao formam hierarquia — formam uma lista. Recolhendo Systems, Design e
 * Business atras de um pai, a barra passa a ter quatro decisoes e o
 * visitante le grupos em vez de varrer rotulos.
 *
 * POR QUE ABRE NO CLIQUE, e nao no hover: metade das visitas chega por
 * toque, onde hover nao existe — um menu so-hover simplesmente nao abre
 * no celular. Clique funciona igual em mouse, dedo e teclado, e nao
 * dispara sozinho quando o cursor apenas atravessa a barra.
 *
 * Cada linha leva a frase de abertura da propria vertical em vez do
 * rotulo sozinho: quem nao sabe a diferenca entre "Systems" e "Business"
 * decide pela frase, nao pelo substantivo.
 */
export default function PracticeMenu({ onNavigate }) {
  const { lang, path } = useLang();
  const t = copy[lang].nav;
  const { pathname } = useLocation();
  const panelId = useId();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  const items = PRACTICE_SLUGS.map((slug) => ({
    slug,
    to: path(slug),
    label: t[slug],
    lead: practices[lang][slug].lead,
  }));

  const active = items.some((i) => pathname === i.to);

  // Trocar de rota fecha o painel. Sem isto ele fica aberto por cima da
  // pagina nova depois do clique.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      btnRef.current?.focus(); // devolve o foco a quem abriu
    };
    const onPointer = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    // `focusin` cobre o teclado: sair do painel com Tab fecha tambem.
    const onFocusIn = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  return (
    <div className="mf-pm" ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className={`mf-pm__trigger${active ? " is-active" : ""}`}
        data-cursor="link"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {t.practice}
        <span className={`mf-pm__caret${open ? " is-open" : ""}`} aria-hidden="true" />
      </button>

      <div className="mf-pm__panel" id={panelId} hidden={!open}>
        <p className="mf-pm__hint">{t.practiceHint}</p>
        <ul className="mf-pm__list">
          {items.map((i) => (
            <li key={i.slug}>
              <NavLink
                to={i.to}
                className="mf-pm__item"
                data-cursor="link"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                <span className="mf-pm__name">{i.label}</span>
                <span className="mf-pm__lead">{i.lead}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
.mf-pm{position:relative}

.mf-pm__trigger{
  display:inline-flex;align-items:center;gap:0.5rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);
  background:none;border:0;padding:0 0 2px;cursor:pointer;white-space:nowrap;
  border-bottom:1px solid transparent;
  transition:color var(--duration-fast) var(--ease-in-out),
             border-color var(--duration-fast) var(--ease-in-out);
}
.mf-pm__trigger:hover,.mf-pm__trigger[aria-expanded="true"]{color:var(--color-text-primary)}
.mf-pm__trigger.is-active{color:var(--color-text-primary);border-bottom-color:var(--color-accent)}

/* Um tracinho, nao uma seta de widget: a barra e tipografica e um
   chevron desenhado destoaria. Gira 90deg quando abre. */
.mf-pm__caret{
  width:7px;height:1px;background:currentColor;
  transition:transform var(--duration-fast) var(--ease-in-out);
}
.mf-pm__caret.is-open{transform:rotate(90deg)}

.mf-pm__panel{
  position:absolute;top:calc(100% + 1.15rem);left:-1.5rem;
  min-width:23rem;padding:1.5rem;
  /* Opaco de proposito: o fundo da pagina e uma rampa que escurece, e um
     painel translucido herdaria a profundidade por baixo — o contraste
     do texto passaria a depender de onde o visitante parou de rolar. */
  background:var(--bone);
  border:1px solid var(--color-divider);
  border-top:1px solid var(--copper);
  z-index:70;
}
[data-theme="on-deep"] .mf-pm__panel{background:#1E1B17}

.mf-pm__hint{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);margin:0 0 1.25rem;
}

.mf-pm__list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}

.mf-pm__item{
  display:flex;flex-direction:column;gap:0.3rem;
  padding:0.95rem 0;text-decoration:none;
  border-top:1px solid var(--color-divider);
}
.mf-pm__list li:first-child .mf-pm__item{border-top:0;padding-top:0}

.mf-pm__name{
  font-family:var(--font-display);font-weight:400;
  font-size:1.35rem;line-height:1.1;
  letter-spacing:var(--tracking-display);color:var(--color-text-primary);
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-pm__item:hover .mf-pm__name,
.mf-pm__item:focus-visible .mf-pm__name{color:var(--color-accent)}

.mf-pm__lead{
  font-family:var(--font-body);font-weight:300;
  font-size:0.9rem;line-height:1.45;
  color:var(--color-text-secondary);
}

/* Na barra estreita a faixa de rotulos rola na horizontal
   (overflow-x:auto), e um painel ancorado dentro dela seria cortado.
   Tornando .mf-pm estatico, o bloco de contencao do painel passa a ser
   a propria .mf-nav — que esta ACIMA do rolador na arvore, entao o
   corte nao o alcanca. Dai ele abre em largura cheia sob a barra. */
@media(max-width:859px){
  .mf-pm{position:static}
  .mf-pm__panel{
    left:0;right:0;top:100%;min-width:0;
    border-left:0;border-right:0;
    padding:1.25rem var(--gutter) 1.5rem;
  }
}
      `}</style>
    </div>
  );
}
