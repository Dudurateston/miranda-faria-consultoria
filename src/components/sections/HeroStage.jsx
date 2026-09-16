import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import anime from "animejs";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { WHATSAPP_URL, CALENDLY_URL } from "@/lib/site";

/**
 * Hero — A REDE VIVA.
 *
 * Nada de logo, nada de filme, nada de telemetria: uma rede generativa
 * que É o trabalho. Quatro nós-mãe (gestão, desenvolvimento, design,
 * automação) cercados por satélites (os projetos); as linhas se desenham,
 * e pulsos de cobre correm pelos fios como sinal vivo — dado fluindo
 * entre sistema, planilha e mensagem. O ponteiro afrouxa a rede.
 *
 * Regras do sistema (DECISIONS.md): GSAP conduz a montagem; anime.js
 * revela o texto; pausa fora da viewport e em aba oculta;
 * prefers-reduced-motion vira rede estática; DPR ≤ 2.
 */

// layout em espaço unitário (0..1) — o centro fica livre pro título
const HUBS = [
  { x: 0.16, y: 0.28, s: 3.0 }, // gestão
  { x: 0.84, y: 0.30, s: 3.0 }, // desenvolvimento
  { x: 0.26, y: 0.76, s: 3.0 }, // design
  { x: 0.78, y: 0.78, s: 3.0 }, // automação
];
const HUB_EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 3], [0, 3], [1, 2],
];

function LiveNetwork() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas.closest(".mf-hero");
    const ctx = canvas.getContext("2d", { alpha: true });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nodes = [];
    let edges = [];
    let pulses = [];
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };
    // uniforme de montagem: GSap conduz 0→1 com expo.out
    const prog = { p: 0 };

    const rnd = (seed) => {
      // ruído determinístico pra rede idêntica entre reloads
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    const build = (w, h) => {
      nodes = [];
      edges = [];
      pulses = [];
      const satN = w < 860 ? 12 : 24;
      const cx = 0.5, cy = 0.5;

      HUBS.forEach((hb, i) => {
        nodes.push({
          hx: hb.x * w, hy: hb.y * h,
          x: hb.x * w, y: hb.y * h,
          r: hb.s * (w < 860 ? 0.8 : 1),
          hub: true,
          ph: rnd(i + 1) * Math.PI * 2,
          dn: rnd(i + 40),
        });
      });
      // satélites: espalhados, fora da faixa central do título
      let seed = 100;
      for (let i = 0; i < satN; i++) {
        let sx, sy;
        do {
          seed += 1;
          sx = rnd(seed) * 0.94 + 0.03;
          sy = rnd(seed * 1.7) * 0.88 + 0.06;
        } while (Math.abs(sx - cx) < 0.14 && Math.abs(sy - cy) < 0.18);
        nodes.push({
          hx: sx * w, hy: sy * h,
          x: sx * w, y: sy * h,
          r: 0.9 + rnd(seed * 3.3) * 1.1,
          hub: false,
          ph: rnd(seed * 5.1) * Math.PI * 2,
          dn: rnd(seed * 7.7),
        });
      }
      // cada satélite liga ao nó-mãe mais próximo
      for (let i = HUBS.length; i < nodes.length; i++) {
        let best = 0;
        let bd = Infinity;
        for (let j = 0; j < HUBS.length; j++) {
          const d = (nodes[i].hx - nodes[j].hx) ** 2 + (nodes[i].hy - nodes[j].hy) ** 2;
          if (d < bd) { bd = d; best = j; }
        }
        edges.push({ a: best, b: i });
      }
      HUB_EDGES.forEach(([a, b]) => edges.push({ a, b }));
      // pulsos de cobre: sinal correndo pelos fios
      const pulseN = w < 860 ? 7 : 13;
      for (let i = 0; i < pulseN; i++) {
        edges.forEach((_, k) => {
          if (rnd(i * 31 + k * 7) < 0.42) {
            pulses.push({ e: k, t: rnd(i * 13 + k), v: 0.0018 + rnd(i + k * 11) * 0.0022 });
          }
        });
      }
      if (mq.matches) {
        prog.p = 1;
        drawStatic();
      } else {
        gsap.to(prog, { p: 1, duration: 2.6, ease: "expo.out", delay: 0.25 });
        start();
      }
    };

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = section.clientWidth;
      const h = section.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, section.clientWidth, section.clientHeight);
      edges.forEach((ed) => {
        const a = nodes[ed.a], b = nodes[ed.b];
        ctx.strokeStyle = "rgba(245,241,234,0.10)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
      nodes.forEach((n) => {
        ctx.fillStyle = n.hub
          ? "rgba(245,241,234,0.85)"
          : `rgba(245,241,234,${0.3 + n.r * 0.12})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const tick = (tm) => {
      if (!running) return;
      const w = section.clientWidth;
      const h = section.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        const dx = Math.sin(tm / 1600 + n.ph) * 5;
        const dy = Math.cos(tm / 1900 + n.ph) * 5;
        let tx = n.hx + dx;
        let ty = n.hy + dy;
        const pdx = tx - pointer.x;
        const pdy = ty - pointer.y;
        const d2 = pdx * pdx + pdy * pdy;
        if (d2 < 19600) {
          const d = Math.sqrt(d2) || 1;
          const f = (140 - d) / 140;
          tx += (pdx / d) * f * 34;
          ty += (pdy / d) * f * 34;
        }
        if (prog.p < 1) {
          const lp = Math.min(Math.max((prog.p * 1.35 - n.dn * 0.35) / 1, 0), 1);
          n.x = n.hx + (tx - n.hx) * lp;
          n.y = n.hy + (ty - n.hy) * lp;
        } else {
          n.x += (tx - n.x) * 0.085;
          n.y += (ty - n.y) * 0.085;
        }
      }

      // fios: desenham-se conforme a montagem
      ctx.lineWidth = 1;
      edges.forEach((ed, k) => {
        const a = nodes[ed.a], b = nodes[ed.b];
        const lp = Math.min(Math.max((prog.p * 1.35 - (k % 7) / 20) / 1, 0), 1);
        if (lp <= 0) return;
        ctx.strokeStyle = "rgba(245,241,234,0.10)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + (b.x - a.x) * lp, a.y + (b.y - a.y) * lp);
        ctx.stroke();
      });

      // pulsos de cobre: o sinal correndo
      const glow = Math.min(Math.max(prog.p * 1.6 - 0.6, 0), 1);
      pulses.forEach((pl) => {
        pl.t += pl.v;
        if (pl.t > 1) pl.t = 0;
        const a = nodes[edges[pl.e].a], b = nodes[edges[pl.e].b];
        const px = a.x + (b.x - a.x) * pl.t;
        const py = a.y + (b.y - a.y) * pl.t;
        ctx.fillStyle = `rgba(181,80,46,${0.9 * glow})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(181,80,46,${0.28 * glow})`;
        ctx.beginPath();
        ctx.arc(
          px - (b.x - a.x) * 0.02,
          py - (b.y - a.y) * 0.02,
          1.1, 0, Math.PI * 2
        );
        ctx.fill();
      });

      // nós por cima dos fios
      nodes.forEach((n) => {
        const lp = prog.p >= 1 ? 1 : Math.min(Math.max((prog.p * 1.35 - n.dn * 0.35) / 1, 0), 1);
        if (lp <= 0) return;
        if (n.hub) {
          ctx.strokeStyle = `rgba(245,241,234,${0.35 * lp})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = n.hub
          ? `rgba(245,241,234,${0.9 * lp})`
          : `rgba(245,241,234,${(0.3 + n.r * 0.12) * lp})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * lp, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || mq.matches) return;
      running = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const { w, h } = setup();
    build(w, h);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && document.visibilityState === "visible") start();
        else stop();
      },
      { threshold: 0.02 }
    );
    io.observe(section);

    const onVis = () => (document.visibilityState === "visible" && visible ? start() : stop());
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e) => {
      const b = canvas.getBoundingClientRect();
      pointer.x = e.clientX - b.left;
      pointer.y = e.clientY - b.top;
    };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    section.addEventListener("mousemove", onMove, { passive: true });
    section.addEventListener("mouseleave", onLeave, { passive: true });

    const onResize = () => {
      const s = setup();
      prog.p = 1; // ao redimensionar, rede já montada
      build(s.w, s.h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="mf-hero__net" aria-hidden="true" />;
}

export default function HeroStage() {
  const { lang } = useLang();
  const t = copy[lang].home;
  const content = useRef(null);

  useEffect(() => {
    const el = content.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: 0.25 }
    );
    // estados iniciais + timeline anime.js: letras, papel e CTA
    gsap.set(".mf-hero__ltr", { opacity: 0, y: 46 });
    gsap.set(".mf-hero__role", { opacity: 0 });
    gsap.set(".mf-hero__cta", { opacity: 0, y: 18 });
    const tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add(
      { targets: ".mf-hero__title .mf-hero__ltr", translateY: [46, 0], opacity: [0, 1], duration: 900, delay: anime.stagger(34) },
      250
    )
      .add({ targets: ".mf-hero__role", opacity: [0, 0.75], letterSpacing: ["0.62em", "0.4em"], duration: 800 }, "-=520")
      .add({ targets: ".mf-hero__cta", opacity: [0, 1], translateY: [18, 0], duration: 700 }, "-=460");
    return () => { tl.pause(); };
  }, []);

  return (
    <section className="mf-hero" data-theme="dark" aria-label={t.wordmark}>
      <LiveNetwork />
      <div className="mf-hero__scrim" aria-hidden="true" />

      <div ref={content} className="mf-hero__content" style={{ opacity: 0 }}>
        <h1 className="mf-hero__title" aria-label={t.wordmark}>
          {t.wordmark.split("").map((ch, i) => (
            <span key={i} className="mf-hero__ltr" aria-hidden="true">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>
        <p className="mf-hero__role">{t.role}</p>
        <a
          href={lang === "en" ? CALENDLY_URL : WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mf-hero__cta"
          data-cursor="link"
        >
          {t.heroCta}
        </a>
      </div>

      <style>{`
.mf-hero{
  position:relative;min-height:100svh;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;background:var(--mf-graphite);
}
.mf-hero__net{position:absolute;inset:0;width:100%;height:100%;display:block}
.mf-hero__scrim{
  position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(20,20,20,0.38) 0%,rgba(20,20,20,0.24) 45%,rgba(20,20,20,0.62) 100%);
}
.mf-hero__content{
  position:relative;z-index:2;
  display:flex;flex-direction:column;align-items:center;text-align:center;
  padding:0 var(--gutter);
}
.mf-hero__title{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(2.8rem,9vw,6.5rem);line-height:1.04;
  letter-spacing:0.06em;text-transform:uppercase;
  color:var(--bone);margin:0;
}
.mf-hero__ltr{display:inline-block;will-change:transform,opacity}
.mf-hero__role{
  font-family:var(--font-mono);
  font-size:clamp(0.7rem,1.4vw,0.85rem);
  letter-spacing:0.4em;text-transform:uppercase;
  color:rgba(245,241,234,0.75);margin:1.4rem 0 0;
}
.mf-hero__cta{
  margin-top:3.2rem;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);border:1px solid var(--mf-terracotta);
  padding:1rem 2.4rem;text-decoration:none;
  transition:background var(--duration-fast) var(--ease-in-out),
             box-shadow var(--duration-base) var(--ease-in-out),
             transform var(--duration-base) var(--ease-out-expo);
}
.mf-hero__cta:hover{
  background:rgba(179,122,96,0.18);
  box-shadow:0 0 32px rgba(179,122,96,0.35);
  transform:translateY(-2px);
}
`}</style>
    </section>
  );
}
