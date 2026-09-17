import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "@/lib/i18n";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { copy, getPractice, cases } from "@/content/copy";
import { WHATSAPP_URL_BARE, M_LOGO, NAV_MEDIA } from "@/lib/site";
import AutoVideo from "@/components/AutoVideo";

const SUB_MEDIA = [
  NAV_MEDIA.solutions.gestao,
  NAV_MEDIA.solutions.desenvolvimento,
  NAV_MEDIA.solutions.design,
  NAV_MEDIA.solutions.automacao,
];

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
  const [drop, setDrop] = useState(false);
  const [subIdx, setSubIdx] = useState(0);
  const [tDrop, setTDrop] = useState(false);
  const [tIdx, setTIdx] = useState(0);
  const [xDrop, setXDrop] = useState(null);
  const tw = copy[lang].work;
  // TODOS os cases ativos — o dropdown de Trabalhos mostra o portfólio
  // completo, na mesma ordem da página /work (14 cases, PT e EN).
  const projects = cases[lang];
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

  // Submenus de resumo: Sobre, Tecnologia e Diagnóstico também
  // entregam contexto + mídia no hover — nenhum item da nav é seco.
  // Os dois últimos ancoram o painel à direita para não vazar em
  // telas médias. Os dois últimos ancoram o painel à direita para
  // não vazar da viewport em telas médias.
  const extras = [
    {
      key: "about",
      to: path("about"),
      label: t.about,
      media: NAV_MEDIA.about,
      cap: lang === "pt" ? "Sobre · Miranda Faria" : "About · Miranda Faria",
      rows: lang === "pt"
        ? [
            { name: "Quem faz", lead: "Eduardo Miranda — Piumhi/MG, escritório em Belo Horizonte. Uma só mão do diagnóstico à entrega." },
            { name: "Trajetória", lead: "Engenharia, design e gestão aplicadas a negócios que existem de verdade." },
          ]
        : [
            { name: "Who runs it", lead: "Eduardo Miranda — Minas Gerais, office in Belo Horizonte. One hand from diagnosis to delivery." },
            { name: "Trajectory", lead: "Engineering, design and management applied to businesses that actually exist." },
          ],
    },
    {
      key: "how",
      to: path("how-i-work"),
      label: t.technology,
      media: NAV_MEDIA.how,
      cap: lang === "pt" ? "Como funciona" : "How a project runs",
      rows: lang === "pt"
        ? [
            { name: "O método", lead: "Diagnóstico primeiro, demo na primeira semana, entrega nas mãos do dono." },
            { name: "MotionCurves", lead: "Easing artesanal, zero bibliotecas — motion como identidade, não enfeite." },
          ]
        : [
            { name: "The method", lead: "Diagnosis first, a demo in the first week, delivery in the owner's hands." },
            { name: "MotionCurves", lead: "Hand-tuned easing, zero libraries — motion as identity, not decoration." },
          ],
    },
    {
      key: "diag",
      to: path("insights"),
      label: t.insights,
      media: NAV_MEDIA.diag,
      cap: lang === "pt" ? "Diagnóstico · 40 segundos" : "Diagnosis · forty seconds",
      rows: lang === "pt"
        ? [
            { name: "Diagnóstico em 40s", lead: "Três perguntas e uma estimativa do que o problema drena por mês — antes de falar de preço." },
            { name: "Para quem", lead: "Dono de operação que já sente o gargalo mas ainda não colocou em números." },
          ]
        : [
            { name: "Forty-second diagnosis", lead: "Three questions and an estimate of what the problem drains per month — before any talk of price." },
            { name: "For whom", lead: "Owners who already feel the bottleneck but haven't put it in numbers yet." },
          ],
    },
  ];

  const renderExtra = (e, anchorRight) => (
    <div key={e.key} className="mf-nav__drop" onMouseLeave={() => setXDrop(null)}>
      <NavLink
        to={e.to}
        data-cursor="link"
        onMouseEnter={() => setXDrop(e.key)}
        onClick={() => setXDrop(null)}
        className={({ isActive }) => `mf-nav__link${isActive ? " is-active" : ""}`}
      >
        {e.label}
      </NavLink>
      <div
        className={`mf-nav__sub${anchorRight ? " mf-nav__sub--right" : ""}`}
        data-open={xDrop === e.key ? "true" : "false"}
        data-lenis-prevent
      >
        <div className="mf-nav__subitems">
          {e.rows.map((r, i) => (
            <NavLink
              key={i}
              to={e.to}
              data-cursor="link"
              onClick={() => setXDrop(null)}
              className={({ isActive }) => `mf-nav__subitem${isActive ? " is-active" : ""}`}
              style={{ transitionDelay: `${xDrop === e.key ? 60 + i * 55 : 0}ms` }}
            >
              <span className="mf-nav__subnum">{String(i + 1).padStart(2, "0")}</span>
              <span className="mf-nav__subbody">
                <span className="mf-nav__subname">{r.name}</span>
                <span className="mf-nav__sublead">{r.lead}</span>
              </span>
            </NavLink>
          ))}
        </div>
        <div className="mf-nav__submedia" aria-hidden="true">
          <AutoVideo src={xDrop === e.key ? e.media : undefined} />
          <span className="mf-nav__subcap">{e.cap}</span>
        </div>
      </div>
    </div>
  );

  const links = [
    { to: path("how-i-work"), label: t.technology },
    { to: path("insights"), label: t.insights },
  ];
  const solutions = ["gestao", "desenvolvimento", "design", "automacao"]
    .map((sg) => getPractice(lang, sg))
    .filter(Boolean);

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
          {renderExtra(extras[0], false)}
          <div className="mf-nav__drop" onMouseLeave={() => setDrop(false)}>
            <NavLink
              to={path("servicos")}
              data-cursor="link"
              onMouseEnter={() => setDrop(true)}
              onClick={() => setDrop(false)}
              className={({ isActive }) => `mf-nav__link${isActive ? " is-active" : ""}`}
            >
              {t.services}
            </NavLink>
            <div className="mf-nav__sub" data-open={drop ? "true" : "false"} data-lenis-prevent>
              <div className="mf-nav__subitems">
                {solutions.map((p, i) => (
                  <NavLink
                    key={p.slug || i}
                    to={path(p.slug)}
                    data-cursor="link"
                    onMouseEnter={() => { setDrop(true); setSubIdx(i); }}
                    onClick={() => setDrop(false)}
                    className={({ isActive }) => `mf-nav__subitem${isActive ? " is-active" : ""}`}
                    style={{ transitionDelay: `${drop ? 60 + i * 55 : 0}ms` }}
                  >
                    <span className="mf-nav__subnum">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mf-nav__subbody">
                      <span className="mf-nav__subname">{p.label}</span>
                      <span className="mf-nav__sublead">{p.lead}</span>
                    </span>
                  </NavLink>
                ))}
              </div>
              <div className="mf-nav__submedia" aria-hidden="true">
                <AutoVideo src={drop ? (SUB_MEDIA[subIdx] ?? SUB_MEDIA[0]) : undefined} />
                <span className="mf-nav__subcap">
                  {String(subIdx + 1).padStart(2, "0")} · {solutions[subIdx]?.label ?? ""}
                </span>
              </div>
            </div>
          </div>
          <div className="mf-nav__drop" onMouseLeave={() => setTDrop(false)}>
            <NavLink
              to={path("work")}
              data-cursor="link"
              onMouseEnter={() => setTDrop(true)}
              onClick={() => setTDrop(false)}
              className={({ isActive }) => `mf-nav__link${isActive ? " is-active" : ""}`}
            >
              {tw.label}
            </NavLink>
            <div className="mf-nav__sub mf-nav__sub--tall" data-open={tDrop ? "true" : "false"} data-lenis-prevent>
              <div className="mf-nav__subitems">
                {projects.map((c, i) => (
                  <NavLink
                    key={c.slug}
                    to={path(`work/${c.slug}`)}
                    data-cursor="link"
                    onMouseEnter={() => { setTDrop(true); setTIdx(i); }}
                    onClick={() => setTDrop(false)}
                    className="mf-nav__subitem"
                    style={{ transitionDelay: `${tDrop ? 60 + i * 55 : 0}ms` }}
                  >
                    <span className="mf-nav__subnum">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mf-nav__subbody">
                      <span className="mf-nav__subname">{c.name}</span>
                      <span className="mf-nav__sublead">{c.sector} · {c.year}</span>
                    </span>
                  </NavLink>
                ))}
              </div>
              <div className="mf-nav__submedia" aria-hidden="true">
                {(projects[tIdx] ?? projects[0])?.media?.video ? (
                  <video
                    src={tDrop ? `/work/${(projects[tIdx] ?? projects[0])?.media?.dir ?? (projects[tIdx] ?? projects[0])?.slug}/video.mp4` : undefined}
                    autoPlay muted loop playsInline preload="metadata"
                  />
                ) : (
                  <img
                    src={`/work/${(projects[tIdx] ?? projects[0])?.media?.dir ?? (projects[tIdx] ?? projects[0])?.slug}/01.webp`}
                    alt=""
                    loading="lazy"
                  />
                )}
                <span className="mf-nav__subcap">
                  {String(tIdx + 1).padStart(2, "0")} · {(projects[tIdx] ?? projects[0])?.name}
                </span>
              </div>
            </div>
          </div>
          {extras.slice(1).map((e) => renderExtra(e, true))}
          <button
            type="button"
            className="mf-nav__lang"
            data-cursor="link"
            onClick={() => setLang(otherLang)}
            lang={otherLang === "pt" ? "pt-BR" : "en"}
          >
            {t.toggle}
          </button>
          <ThemeToggle lang={lang} variant="nav" />
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

      {/* Overlay de tela cheia: rotulos grandes em serif, entrada
          em cascata, M na marca d'agua e o WhatsApp embaixo. */}
      <div className="mf-mnav" id="mf-mnav" data-open={menuOpen ? "true" : "false"} aria-hidden={!menuOpen} data-lenis-prevent>
        <nav className="mf-mnav__list" aria-label={t.home}>
          <NavLink
            to={path("about")}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `mf-mnav__link${isActive ? " is-active" : ""}`}
            style={{ transitionDelay: `${menuOpen ? 120 : 0}ms` }}
            data-cursor="link"
          >
            {t.about}
          </NavLink>
          <NavLink
            to={path("servicos")}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `mf-mnav__link${isActive ? " is-active" : ""}`}
            style={{ transitionDelay: `${menuOpen ? 190 : 0}ms` }}
            data-cursor="link"
          >
            {t.services}
          </NavLink>
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              style={{ transitionDelay: `${menuOpen ? 260 + i * 70 : 0}ms` }}
              className={({ isActive }) => `mf-mnav__link${isActive ? " is-active" : ""}`}
              data-cursor="link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to={path("work")}
            onClick={() => setMenuOpen(false)}
            className="mf-mnav__link"
            style={{ transitionDelay: `${menuOpen ? 190 + links.length * 70 : 0}ms` }}
            data-cursor="link"
          >
            {tw.label}
          </NavLink>

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
          <ThemeToggle lang={lang} variant="menu" />
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
[data-theme="on-deep"] .mf-nav{background:rgba(250,247,241,0.92)}
html[data-skin="dark"] .mf-nav,
html[data-skin="dark"] [data-theme="on-deep"] .mf-nav{background:rgba(22,20,15,0.92)}
[data-theme="on-deep"] .mf-nav__logo{filter:none}
/* M e branco-prata (logo oficial). Sobre osso, ganha um tom de prata
   discreto pra nao sumir; na skin escura fica branco puro. */
html:not([data-skin="dark"]) .mf-nav__logo{filter:brightness(0.88) saturate(0.85)}
html:not([data-skin="dark"]) .mf-mnav__wm{filter:brightness(0.88) saturate(0.85)}
.mf-nav[data-show="false"]{opacity:0;transform:translateY(-100%);pointer-events:none}
.mf-nav[data-show="true"]{opacity:1;transform:translateY(0);pointer-events:auto}

.mf-nav__brand{display:flex;align-items:center;gap:0.8rem;text-decoration:none;white-space:nowrap;flex:0 0 auto}
 .mf-nav__logo{width:auto;height:40px;object-fit:contain;display:block;transition:transform 0.45s var(--ease-out-expo)}
.mf-nav__brand:hover .mf-nav__logo{transform:scale(1.09) rotate(-6deg)}
.mf-nav__lockup{display:flex;flex-direction:column;line-height:1.3}
.mf-nav__name{
  font-family:var(--font-display);font-weight:600;
  /* adaptativo: encolhe com a tela (Eduardo 17/09: "ta muito grande") */
  font-size:clamp(9.5px,1.15vw + 6px,12px);
  letter-spacing:var(--tracking-wordmark);text-transform:uppercase;
  color:var(--color-text-primary);white-space:nowrap;
}
.mf-nav__role{
  font-family:var(--font-mono);font-size:clamp(8.5px,1vw + 5.5px,11px);
  letter-spacing:0.2em;text-transform:uppercase;
  color:var(--color-text-secondary);white-space:nowrap;
}

.mf-nav__links{display:flex;align-items:center;gap:clamp(1rem,2.2vw,2rem);margin-left:auto}
.mf-nav__link{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
  padding-bottom:4px;border-bottom:0;position:relative;
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-nav__link::after{
  content:"";position:absolute;left:0;right:0;bottom:0;height:1px;
  background:var(--color-accent);
  transform:scaleX(0);transform-origin:left center;
  transition:transform var(--duration-base) var(--ease-out-expo);
}
.mf-nav__link:hover{color:var(--color-text-primary)}
.mf-nav__link:hover::after{transform:scaleX(1)}
.mf-nav__link.is-active{color:var(--color-text-primary)}
.mf-nav__link.is-active::after{transform:scaleX(1)}

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
  display:flex;flex-direction:column;justify-content:flex-start;
  /* conteudo maior que a tela rola (antes: justify-center cortava as
     pontas sem scroll — pedido Eduardo 17/09) */
  overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;
  padding:calc(var(--nav-height) + 2rem) var(--gutter) 3rem;
  background:var(--bone,#F5F1EA);color:var(--ink,#1A1A18);
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

/* Mobile: a barra e so marca + menu — o WhatsApp vive dentro do
   overlay (e na barra flutuante). Uma identidade, uma acao. */
@media(max-width:859px){
  .mf-nav{gap:0.6rem}
  .mf-nav__links{display:none}
  .mf-nav__burger{display:flex;position:fixed;top:0.62rem;right:var(--gutter);z-index:120;margin:0;
  background:rgba(250,247,241,0.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-radius:2px;border:1px solid var(--mf-rule)}
  .mf-nav__brand{flex:0 1 auto;min-width:0}
  .mf-nav__logo{height:26px;width:auto}

  .mf-nav__cta{display:none}
}
/* telas estreitas: so o nome, sem o role (adaptacao de tamanho, 17/09) */
@media(max-width:430px){.mf-nav__role{display:none}}
@media(min-width:860px){
  .mf-mnav{display:none}
  .mf-nav__burger{display:none}
}
/* ── submenu Soluções (desktop, hover) — painel claro com mídia viva ── */
.mf-nav__drop{position:relative}
.mf-nav__sub{
  position:absolute;top:calc(100% + 10px);left:50%;
  transform:translateX(-50%) translateY(8px);
  display:grid;grid-template-columns:1fr 236px;
  width:600px;max-width:88vw;
  background:rgba(250,247,241,0.98);
  border:1px solid var(--mf-rule);
  border-top:2px solid var(--copper,#B5502E);
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1), visibility 0.3s;
  box-shadow:0 24px 60px rgba(26,26,24,0.14);
  overflow:hidden;
}
.mf-nav__sub::after{
  content:"M";position:absolute;right:-6px;bottom:-42px;
  font-family:var(--font-display);font-size:7.5rem;line-height:1;
  color:rgba(26,26,24,0.045);pointer-events:none;
}
.mf-nav__sub[data-open="true"]{opacity:1;visibility:visible;pointer-events:all;transform:translateX(-50%) translateY(0)}
.mf-nav__subitems{display:flex;flex-direction:column;padding:0.55rem}
.mf-nav__subitem{
  display:grid;grid-template-columns:2rem 1fr;gap:0.9rem;align-items:baseline;
  padding:0.85rem 0.9rem;text-decoration:none;
  border-bottom:1px solid var(--mf-rule);
  opacity:0;transform:translateY(6px);
  transition:opacity 0.35s ease, transform 0.35s ease, background 0.25s ease;
}
.mf-nav__subitem:last-child{border-bottom:none}
.mf-nav__subitem:hover{background:rgba(181,80,46,0.08)}
.mf-nav__subitem:hover .mf-nav__subnum{color:var(--copper-text,#A6481F)}
.mf-nav__subnum{
  font-family:var(--font-mono);font-size:10px;
  color:rgba(26,26,24,0.66);letter-spacing:var(--tracking-label);
  transition:color 0.25s ease;
}
.mf-nav__subname{
  display:block;font-family:var(--font-display);font-weight:400;
  font-size:1.05rem;letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);line-height:1.2;
}
.mf-nav__sublead{
  display:block;font-size:0.72rem;line-height:1.45;
  color:var(--color-text-secondary);margin-top:0.2rem;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
.mf-nav__sub[data-open="true"] .mf-nav__subitem{opacity:1;transform:translateY(0)}
.mf-nav__submedia{
  position:relative;padding:0.55rem;border-left:1px solid var(--mf-rule);
  display:flex;align-items:center;
}
.mf-nav__submedia video{
  width:100%;aspect-ratio:16/9;object-fit:cover;border:1px solid var(--mf-rule);
  display:block;background:#141414;
}
.mf-nav__subcap{
  position:absolute;left:0.9rem;bottom:0.9rem;
  font-family:var(--font-mono);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;
  color:#F5F1EA;background:rgba(26,26,24,0.72);padding:0.3rem 0.5rem;
}
      @media(max-width:860px){
.mf-nav__link{min-height:44px;display:inline-flex;align-items:center}
}

/* Dropdown de Trabalhos: portfólio completo (14 cases) — coluna
   compacta e rolavel, midia com fallback de imagem p/ cases sem video */
.mf-nav__sub--tall .mf-nav__subitems{max-height:min(62vh,560px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(26,26,24,0.35) transparent}
.mf-nav__sub--tall .mf-nav__subitems::-webkit-scrollbar{width:6px}
.mf-nav__sub--tall .mf-nav__subitems::-webkit-scrollbar-track{background:transparent}
.mf-nav__sub--tall .mf-nav__subitems::-webkit-scrollbar-thumb{background:rgba(26,26,24,0.35);border-radius:3px}
.mf-nav__sub--tall .mf-nav__subitems::-webkit-scrollbar-thumb:hover{background:rgba(26,26,24,0.55)}
.mf-nav__sub--tall .mf-nav__subitem{padding:0.6rem 0.9rem}
.mf-nav__submedia img{width:100%;height:100%;object-fit:cover;display:block}

/* Ponte de hover: nao existe zona morta entre o rotulo e o painel —
   o mouse pode descer direto pro submenu sem ele fechar */
.mf-nav__drop::after{content:"";position:absolute;top:100%;left:12%;right:12%;height:12px}
/* Painéis dos itens finais: ancorados a direita do rotulo */
.mf-nav__sub--right{left:auto;right:0;transform:translateY(8px)}
.mf-nav__sub--right[data-open="true"]{transform:translateY(0)}
`}</style>
    </>
  );
}