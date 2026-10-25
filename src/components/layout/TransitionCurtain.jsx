import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { M_LOGO_BONE } from "@/lib/site";

/**
 * Cortina de rota — rodízio determinístico de 2 variantes (Eduardo,
 * 21/10, "elegante e breve"):
 *
 *  A) COBRE: círculo de cobre abre do centro, M osso assenta por cima,
 *     rota troca por baixo, círculo fecha e revela a página nova.
 *  B) FILETE: dois painéis claros (papel) fecham sobre a tela com um
 *     filete de cobre no centro; rota troca; os painéis abrem partindo
 *     pelo filete (o último a sair).
 *
 * Alternância DETERMINÍSTICA: contador em nível de módulo — cobre,
 * filete, cobre, filete… (nunca aleatório, sobrevive a remounts).
 * Gesto completo ~750–900ms. Reduced-motion: navegação seca, sem cortina.
 * ViewTransitions API: fora do TransitionLink também — esta cortina é
 * o único sistema de transição do site (sem sobreposição).
 *
 * Arquitetura anti-overlay-preso:
 *  - o efeito do clique tem deps [] (attache único): o teardown dele só
 *    roda no UNMOUNT real — nunca na troca de rota — então a revelação
 *    (efeito separado, keyed em loc.pathname) nunca é cancelada
 *    emplacado (a rota /privacidade sai do casco de idioma e desmonta
 *    a cortina no meio do gesto: o cleanup do unmount devolve o
 *    overflow do html — o site antigo ficava rolável-para-sempre);
 *  - clique novo durante o cover REDIRECIONA o destino pendente;
 *  - popstate durante o cover cancela o navigate pendente (sem
 *    navegação dupla) e a revelação corre para a rota do histórico;
 *  - timer de segurança (2s) esconde a cortina se a rota lazy demorar;
 *  - reduced-motion nunca abre a cortina.
 */
const VARIANTS = ["copper", "split"];
let navN = 0; /* alternância determinística */

export default function TransitionCurtain() {
  const loc = useLocation();
  const navigate = useNavigate();
  const curtain = useRef(null);
  const busy = useRef(false);
  const tlRef = useRef(null);
  const pendingHref = useRef(null); /* href aceito mas ainda não navegado */
  const clickPath = useRef(null); /* pathname no instante do clique */
  const fallback = useRef(null);
  const revealSeq = useRef(0); /* cancela a espera de conteúdo se a rota mudar de novo */
  const locRef = useRef(loc.pathname);
  const navigateRef = useRef(navigate);

  /* refs sempre frescas para o listener único */
  useEffect(() => {
    locRef.current = loc.pathname;
    navigateRef.current = navigate;
  }, [loc.pathname, navigate]);

  /* hard-reset total — chamado só no UNMOUNT da cortina */
  const hardCleanup = (el) => {
    if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
    if (fallback.current) { clearTimeout(fallback.current); fallback.current = null; }
    el.style.display = "none";
    document.documentElement.style.overflow = "";
    busy.current = false;
    pendingHref.current = null;
  };

  /* listener de captura — attache ÚNICO (deps []): teardown == unmount */
  useEffect(() => {
    const el = curtain.current;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const isInternal = (a) =>
      a && !a.target && !a.hasAttribute("download") &&
      a.getAttribute("href") && a.getAttribute("href").startsWith("/") &&
      !a.getAttribute("href").startsWith("//");

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a");
      if (!isInternal(a)) return;
      const href = a.getAttribute("href");
      /* mesma PATHNAME com ?query ou #hash (ex.: /pt/work#caso) não troca
         pathname, então o effect de rota NUNCA rodaria — a cortina abriria
         e viveria até o fallback de 2s. Esses cliques atravessam NATIVOS:
         sem cortina, com o onClick do Link intacto (e o hash nativo no
         lugar, intocado). */
      if (href.split(/[?#]/)[0] === locRef.current) return;
      if (mq.matches) return; /* reduced-motion: o router age sozinho */
      /* preventDefault NÃO basta: o <Link> do react-router não checa
         defaultPrevented e navega na hora, matando o cover no berço.
         stopImmediatePropagation na FASE DE CAPTURA impede o handler do
         Link (e qualquer outro) de rodar — a cortina assume o gesto e
         navigate() só acontece com a tela coberta. */
      e.preventDefault();
      e.stopImmediatePropagation();

      /* clique rápido durante o cover: redireciona o destino pendente
         em vez de engolir o clique. Na fase de revelação o usuário já
         está clicando na página nova — o router cuida. */
      if (busy.current && pendingHref.current) {
        pendingHref.current = href;
        return;
      }
      if (busy.current) return;

      busy.current = true;
      pendingHref.current = href;
      clickPath.current = window.location.pathname;
      el.dataset.v = VARIANTS[navN++ % VARIANTS.length];
      el.style.display = "block";
      document.documentElement.style.overflow = "hidden";

      const goIfStillValid = () => {
        /* popstate durante o cover trocou a rota por baixo: cancela o
           navigate pendente (a revelação vai correr para o histórico) */
        if (window.location.pathname !== clickPath.current) { pendingHref.current = null; return; }
        const to = pendingHref.current;
        pendingHref.current = null;
        navigateRef.current(to);
        /* segurança: rota lazy lenta não pode cobrir a tela p/ sempre */
        fallback.current = setTimeout(() => { if (busy.current) hardCleanup(el); }, 2000);
      };

      const cover = gsap.timeline({ onComplete: goIfStillValid });
      tlRef.current = cover;
      if (el.dataset.v === "copper") {
        const circle = el.querySelector(".mf-curtain__circle");
        const m = el.querySelector(".mf-curtain__m");
        cover.set(circle, { scale: 0 }).set(m, { opacity: 0, scale: 0.9 })
          .to(circle, { scale: 1, duration: 0.4, ease: "power3.inOut" }, 0)
          .to(m, { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" }, 0.2);
      } else {
        const pL = el.querySelector(".mf-curtain__panelL");
        const pR = el.querySelector(".mf-curtain__panelR");
        const seam = el.querySelector(".mf-curtain__seam");
        cover.set(pL, { xPercent: -101 }).set(pR, { xPercent: 101 }).set(seam, { scaleY: 0, opacity: 1 })
          .to(pL, { xPercent: 0, duration: 0.4, ease: "power3.inOut" }, 0)
          .to(pR, { xPercent: 0, duration: 0.4, ease: "power3.inOut" }, 0)
          .to(seam, { scaleY: 1, duration: 0.16, ease: "power2.out" }, 0.26);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      hardCleanup(el); /* só roda no unmount real */
    };
  }, []);

  /* rota trocou: a cortina ABRE e revela a página nova por baixo.
     Back/forward entra aqui também (sem cover prévio, sem cortina
     aberta = early return). */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = curtain.current;
    /* reduced-motion (inclusive se ligar NO MEIO do gesto, cobrindo a
     * tela): hard-reset completo — mata timeline, limpa fallback, devolve
     * o overflow do html. Nunca esconder só o display e deixar o html
     * travado com overflow hidden. */
    if (mq.matches) { hardCleanup(el); return; }
    if (getComputedStyle(el).display === "none") return;
    busy.current = true;
    if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }

    /* SINCRONIA COM A ENTRADA DA PÁGINA (Eduardo, 25/10: "ela está um
       pouco fora do tempo"): a saída da marca só começa quando o
       conteúdo da rota nova está COMMITADO — sem suspense na tela e
       sem marca demorando a sair sobre a página já visível. Espera
       curta e CANCELÁVEL: se a rota mudar de novo (popstate/redirect)
       ou a cortina for desmontada, a espera aborta sem revelar; teto
       de 400ms para nunca segurar a tela coberta à espera de nada —
       o fallback de 2s continua vivo como segurança última. */
    const seq = ++revealSeq.current;
    const waitReady = new Promise((resolve) => {
      const t0 = performance.now();
      const tick = () => {
        if (revealSeq.current !== seq || !busy.current) return resolve(false);
        const susp = document.querySelector(".mf-route-load");
        if (!susp || performance.now() - t0 > 400) return resolve(true);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    waitReady.then((go) => {
      if (!go) return;
      if (fallback.current) { clearTimeout(fallback.current); fallback.current = null; }
      const t = gsap.timeline({
        onComplete: () => {
          el.style.display = "none";
          document.documentElement.style.overflow = "";
          busy.current = false;
        },
      });
      tlRef.current = t;
      if (el.dataset.v === "copper") {
        const circle = el.querySelector(".mf-curtain__circle");
        const m = el.querySelector(".mf-curtain__m");
        /* o M sai JUNTO com a cobertura, num único gesto de entrega
           (Eduardo, 25/10): a marca não segura sozinha nem fica
           sobrando sobre o conteúdo que já entrou por baixo. */
        t.to(m, { opacity: 0, scale: 0.94, duration: 0.24, ease: "power2.in" }, 0)
          .to(circle, { scale: 0, duration: 0.3, ease: "power3.inOut" }, 0);
      } else {
        const pL = el.querySelector(".mf-curtain__panelL");
        const pR = el.querySelector(".mf-curtain__panelR");
        const seam = el.querySelector(".mf-curtain__seam");
        /* os painéis partem horizontalmente; o filete de cobre fecha a
           abertura — todos concluem juntos, sem sobra do filete */
        t.to(pL, { xPercent: -101, duration: 0.3, ease: "power3.inOut" }, 0)
          .to(pR, { xPercent: 101, duration: 0.3, ease: "power3.inOut" }, 0)
          .to(seam, { scaleY: 0, duration: 0.18, ease: "power2.in" }, 0.12);
      }
    });
  }, [loc.pathname]);

  return (
    <div ref={curtain} className="mf-curtain" data-theme="dark" data-v="copper" style={{ display: "none" }} aria-hidden="true">
      {/* A — círculo de cobre + M osso */}
      <div className="mf-curtain__circle" />
      <img className="mf-curtain__m" src={M_LOGO_BONE} alt="" aria-hidden="true" />
      {/* B — painéis de papel + filete de cobre */}
      <div className="mf-curtain__panelL" />
      <div className="mf-curtain__panelR" />
      <div className="mf-curtain__seam" />
      <style>{`
.mf-curtain{
  position:fixed;inset:0;z-index:150;
  background:transparent;
  display:flex;align-items:center;justify-content:center;
  pointer-events:all;
}
/* A — o círculo que abre/fecha: cobre centrado, 200vmax cobre qualquer
   viewport quando scale = 1. */
.mf-curtain__circle{
  position:absolute;left:50%;top:50%;
  width:200vmax;height:200vmax;
  translate:-50% -50%;
  border-radius:50%;
  background:var(--copper, #B5502E);
  transform:scale(0);
  will-change:transform;
}
.mf-curtain__m{
  /* M OSSO oficial (25KB, alpha confirmado) sobre o cobre — sem
     drop-shadow: sombra sobre o chapado virava mancha. */
  width:clamp(110px,18vw,280px);opacity:1;position:absolute;z-index:1;
  left:50%;top:50%;translate:-50% -52%;
  will-change:transform,opacity;
}
/* cada variante renderiza SÓ as próprias camadas — o círculo nunca
   nasce escondido atrás dos painéis nem vice-versa */
.mf-curtain[data-v="copper"] .mf-curtain__panelL,
.mf-curtain[data-v="copper"] .mf-curtain__panelR,
.mf-curtain[data-v="copper"] .mf-curtain__seam{display:none}
.mf-curtain[data-v="split"] .mf-curtain__circle,
.mf-curtain[data-v="split"] .mf-curtain__m{display:none}
/* B — dois painéis de osso (a paleta do site: tinta sobre osso) que
   fecham/abrem partindo pelo filete. */
.mf-curtain__panelL,.mf-curtain__panelR{
  position:absolute;top:0;bottom:0;width:calc(50% + 2px);
  background:var(--bone, #F5F1EA);
  will-change:transform;
}
.mf-curtain__panelL{left:0}
.mf-curtain__panelR{right:0}
.mf-curtain__seam{
  position:absolute;left:50%;top:0;bottom:0;width:3px;
  translate:-50% 0;background:var(--copper, #B5502E);
  will-change:transform,opacity;
}
`}</style>
    </div>
  );
}
