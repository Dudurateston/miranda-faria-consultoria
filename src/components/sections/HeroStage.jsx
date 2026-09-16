import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import anime from "animejs";
import * as THREE from "three";
import { useLang } from "@/lib/i18n";
import { copy, cases, practices, PRACTICE_SLUGS } from "@/content/copy";
import { WHATSAPP_URL, CALENDLY_URL, M_LOGO } from "@/lib/site";

/**
 * Hero — A REDE VIVA 3D.
 *
 * A rede da marca em três dimensões: quatro nós-mãe (as quatro soluções)
 * e satélites (os cases). Gira sozinha, gira com o dedo, e cada nó é
 * porto: clicar leva direto ao material (solução ou case). Fios se
 * desenham na entrada, pulsos de cobre correm como sinal.
 *
 * Regras do sistema (DECISIONS.md): GSAP conduz entrada; anime.js o
 * texto; pausa fora da viewport e em aba oculta; prefers-reduced-motion
 * congela a rede (ainda navegável); DPR ≤ 1.75; sem WebGL cai na versão 2D.
 */

// hubs: as 4 soluções em torno do centro (livre pro título)
const HUB_POS = [
  [-1.35, 0.72, 0.25], [1.35, 0.66, -0.2], [-1.15, -0.78, -0.3], [1.18, -0.84, 0.35],
];
// satélites: cases reais que ganham nó clicável
const SAT_SLUGS = [
  "rota-forte", "1000-pecas", "motormoura", "queijos-serra",
  "advogados-lco", "sevalho-controladoria", "vaf-global", "uaiso-travel",
];
// posições determinísticas dos satélites (espalhadas na concha)
const SAT_POS = [
  [-0.55, 1.15, 0.4], [0.62, 1.22, -0.35], [0.05, 1.32, 0.15], [-0.2, -1.28, 0.3],
  [0.5, -1.2, -0.4], [-1.62, 0.05, -0.45], [1.68, 0.0, 0.5], [-0.95, 1.05, -0.6],
];
const HUB_EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3], [1, 2]];

function Network3D({ lang, path }) {
  const mount = useRef(null);
  const [label, setLabel] = useState(null); // { name, x, y }

  useEffect(() => {
    const el = mount.current;
    const section = el.closest(".mf-hero");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobile = section.clientWidth < 860;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: "low-power" });
    } catch (e) {
      el.dataset.fallback = "1";
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(section.clientWidth, section.clientHeight);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, section.clientWidth / section.clientHeight, 0.1, 50);
    camera.position.set(0, 0, mq.matches ? 3.3 : 6.2);

    const group = new THREE.Group();
    group.rotation.set(0.12, -0.25, 0);
    scene.add(group);

    const boneMat = new THREE.MeshBasicMaterial({ color: 0xf5f1ea, transparent: true, opacity: 0.92 });
    const satMat = new THREE.MeshBasicMaterial({ color: 0xf5f1ea, transparent: true, opacity: 0.55 });
    const copMat = new THREE.MeshBasicMaterial({ color: 0xb5502e, transparent: true, opacity: 0.95 });

    const practiceLabels = {};
    PRACTICE_SLUGS.forEach((s, i) => {
      practiceLabels[i] = practices[lang]?.[s]?.label || s;
    });
    const caseByName = {};
    cases[lang].forEach((c) => { caseByName[c.slug] = c; });

    // ── nós: hubs (soluções) + satélites (cases), todos navegáveis
    const nodes = [];
    const hubMeshes = [];
    const addNode = (pos, r, mat, data) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat);
      m.position.set(...pos);
      m.userData = data;
      m.scale.setScalar(0.001);
      group.add(m);
      nodes.push(m);
      return m;
    };
    HUB_POS.forEach((p, i) => {
      hubMeshes.push(addNode(p, 0.085, i % 2 ? copMat : boneMat, {
        name: practiceLabels[i],
        to: path(PRACTICE_SLUGS[i]),
        hub: true,
        ph: i * 1.7,
        home: new THREE.Vector3(...p),
      }));
    });
    SAT_POS.slice(0, isMobile ? 5 : 8).forEach((p, i) => {
      const slug = SAT_SLUGS[i];
      const c = caseByName[slug];
      addNode(p, 0.042, satMat, {
        name: c ? c.name : slug,
        to: path(`work/${slug}`),
        hub: false,
        ph: i * 2.3,
        home: new THREE.Vector3(...p),
      });
    });

    // ── fios: satélite → hub mais próximo + hubs entre si
    const pairs = [];
    nodes.slice(4).forEach((sat) => {
      let best = 0, bd = Infinity;
      hubMeshes.forEach((hb, j) => {
        const d = sat.userData.home.distanceTo(hb.userData.home);
        if (d < bd) { bd = d; best = j; }
      });
      pairs.push([hubMeshes[best], sat]);
    });
    HUB_EDGES.forEach(([a, b]) => pairs.push([hubMeshes[a], hubMeshes[b]]));
    const edgeGeo = new THREE.BufferGeometry();
    const edgePos = new Float32Array(pairs.length * 6);
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
    const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({
      color: 0xf5f1ea, transparent: true, opacity: 0.14,
    }));
    edges.scale.set(0.001, 0.001, 0.001);
    group.add(edges);

    // ── pulsos de cobre correndo pelos fios
    const pulseN = isMobile ? 6 : 11;
    const pulses = [];
    for (let i = 0; i < pulseN; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), copMat);
      m.scale.setScalar(0.001);
      group.add(m);
      pulses.push({ mesh: m, pair: pairs[Math.floor(Math.random() * pairs.length)], t: Math.random() });
    }

    // ── interação: giro com inércia, hover e clique por raycast
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const vel = { x: 0, y: 0 };
    const drag = { on: false, moved: 0, lx: 0, ly: 0 };
    let hovered = null;
    let raf = 0;
    let running = false;
    let visible = true;
    let started = 0;

    const setNdc = (e) => {
      const b = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - b.left) / b.width) * 2 - 1;
      ndc.y = -((e.clientY - b.top) / b.height) * 2 + 1;
    };

    const onDown = (e) => {
      drag.on = true; drag.moved = 0; drag.lx = e.clientX; drag.ly = e.clientY;
    };
    const onMove = (e) => {
      if (drag.on) {
        const dx = e.clientX - drag.lx;
        const dy = e.clientY - drag.ly;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        vel.y += dx * 0.00042;
        vel.x += dy * 0.00028;
        drag.lx = e.clientX; drag.ly = e.clientY;
        if (drag.moved > 6) renderer.domElement.style.cursor = "grabbing";
      }
      setNdc(e);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(nodes, false)[0];
      const target = hit ? hit.object : null;
      if (target !== hovered) {
        if (hovered) gsap.to(hovered.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: "power2.out", overwrite: true });
        hovered = target;
        if (hovered) gsap.to(hovered.scale, { x: 1.7, y: 1.7, z: 1.7, duration: 0.4, ease: "power2.out", overwrite: true });
        renderer.domElement.style.cursor = hovered && !drag.on ? "pointer" : "grab";
      }
      if (hovered) {
        const b = section.getBoundingClientRect();
        setLabel({ name: hovered.userData.name, x: e.clientX - b.left + 14, y: e.clientY - b.top - 10 });
      } else setLabel(null);
    };
    const onUp = (e) => {
      renderer.domElement.style.cursor = "grab";
      if (drag.on && drag.moved < 6) {
        setNdc(e);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(nodes, false)[0];
        if (hit) window.location.assign(hit.object.userData.to);
      }
      drag.on = false;
    };
    const onLeave = () => {
      drag.on = false;
      setLabel(null);
      if (hovered) { gsap.to(hovered.scale, { x: 1, y: 1, z: 1, duration: 0.4, overwrite: true }); hovered = null; }
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const tick = (tm) => {
      if (!running) return;
      if (!mq.matches) {
        // giro automático suave + inércia do arrasto
        group.rotation.y += 0.0016 + vel.y;
        group.rotation.x += vel.x;
        group.rotation.x = Math.max(-0.5, Math.min(0.65, group.rotation.x));
        vel.x *= 0.94; vel.y *= 0.94;
        // respiração dos nós e fios
        nodes.forEach((n) => {
          n.position.x = n.userData.home.x + Math.sin(tm / 2600 + n.userData.ph) * 0.045;
          n.position.y = n.userData.home.y + Math.cos(tm / 3100 + n.userData.ph) * 0.045;
        });
        pairs.forEach((pr, i) => {
          edgePos[i * 6] = pr[0].position.x; edgePos[i * 6 + 1] = pr[0].position.y; edgePos[i * 6 + 2] = pr[0].position.z;
          edgePos[i * 6 + 3] = pr[1].position.x; edgePos[i * 6 + 4] = pr[1].position.y; edgePos[i * 6 + 5] = pr[1].position.z;
        });
        edgeGeo.attributes.position.needsUpdate = true;
        // pulsos correndo
        pulses.forEach((pl) => {
          pl.t += 0.006;
          if (pl.t > 1) { pl.t = 0; pl.pair = pairs[Math.floor(Math.random() * pairs.length)]; }
          const a = pl.pair[0].position, b = pl.pair[1].position;
          pl.mesh.position.set(a.x + (b.x - a.x) * pl.t, a.y + (b.y - a.y) * pl.t, a.z + (b.z - a.z) * pl.t);
        });
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (running || mq.matches) return; running = true; raf = requestAnimationFrame(tick); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // ── entrada: câmera viaja, nós nascem, fios se desenham (GSAP)
    if (mq.matches) {
      camera.position.z = 3.3;
      nodes.forEach((n) => n.scale.setScalar(1));
      edges.scale.setScalar(1);
      pulses.forEach((p) => p.mesh.scale.setScalar(1));
      nodes.forEach((n) => {
        n.position.x = n.userData.home.x; n.position.y = n.userData.home.y;
      });
      pairs.forEach((pr, i) => {
        edgePos[i * 6] = pr[0].position.x; edgePos[i * 6 + 1] = pr[0].position.y; edgePos[i * 6 + 2] = pr[0].position.z;
        edgePos[i * 6 + 3] = pr[1].position.x; edgePos[i * 6 + 4] = pr[1].position.y; edgePos[i * 6 + 5] = pr[1].position.z;
      });
      edgeGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    } else {
      gsap.to(camera.position, { z: 3.3, duration: 2.4, ease: "expo.out", delay: 0.75 });
      nodes.forEach((n, i) => {
        gsap.to(n.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "expo.out", delay: 0.85 + (i % 5) * 0.12 });
      });
      gsap.to(edges.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: "expo.out", delay: 1.3 });
      gsap.to(edges.material, { opacity: 0.14, duration: 1.8, delay: 1.3 });
      pulses.forEach((p, i) => {
        gsap.to(p.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "power2.out", delay: 2.0 + i * 0.14 });
      });
      start();
    }

    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; if (visible && document.visibilityState === "visible") start(); else stop(); },
      { threshold: 0.02 }
    );
    io.observe(section);
    const onVis = () => (document.visibilityState === "visible" && visible ? start() : stop());
    document.addEventListener("visibilitychange", onVis);

    const onResize = () => {
      const w = section.clientWidth, h = section.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [lang, path]);

  return (
    <div ref={mount} className="mf-hero__net3d">
      {label && (
        <span
          className="mf-hero__tip"
          style={{ left: label.x, top: label.y }}
          aria-hidden="true"
        >
          {label.name}
        </span>
      )}
    </div>
  );
}

/**
 * Portão de entrada — a animação que independe do usuário (referência
 * spenceltd): cortina grafite, M nasce, wordmark letra a letra, linha de
 * cobre desenha e a cortina sobe entregando a hero 3D em pleno movimento.
 * Uma vez por sessão (sessionStorage); reduced-motion pula direto.
 */
export function IntroGate() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || sessionStorage.getItem("mf-intro") === "1") {
      el.remove();
      return;
    }
    sessionStorage.setItem("mf-intro", "1");
    const wordmark = el.querySelector(".mf-intro__word").textContent;
    el.querySelector(".mf-intro__word").innerHTML = wordmark
      .split("")
      .map((ch) => `<span class="mf-intro__ltr">${ch === " " ? "&nbsp;" : ch}</span>`)
      .join("");
    const tl = gsap.timeline({ onComplete: () => el.remove() });
    tl.fromTo(el.querySelector(".mf-intro__m"), { opacity: 0, scale: 0.75 },
        { opacity: 0.92, scale: 1, duration: 0.5, ease: "expo.out" }, 0)
      .fromTo(el.querySelectorAll(".mf-intro__ltr"), { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.035 }, 0.12)
      .fromTo(el.querySelector(".mf-intro__line"), { scaleX: 0 },
        { scaleX: 1, duration: 0.55, ease: "expo.inOut" }, 0.4)
      .to(el, { yPercent: -100, duration: 0.75, ease: "expo.inOut", delay: 0.2 }, ">");
    document.documentElement.style.overflow = "hidden";
    const free = setTimeout(() => { document.documentElement.style.overflow = ""; }, 1300);
    return () => clearTimeout(free);
  }, []);

  return (
    <div ref={ref} className="mf-intro" aria-hidden="true">
      <img className="mf-intro__m" src={M_LOGO} alt="" />
      <span className="mf-intro__word">MIRANDA FARIA</span>
      <span className="mf-intro__line" />
      <style>{`
.mf-intro{
  position:fixed;inset:0;z-index:200;
  background:var(--mf-graphite);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:1.4rem;
}
.mf-intro__m{width:clamp(34px,5vw,54px);opacity:0.92}
.mf-intro__word{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(1.1rem,2.6vw,1.7rem);letter-spacing:0.34em;
  text-transform:uppercase;color:var(--bone);white-space:nowrap;
}
.mf-intro__ltr{display:inline-block}
.mf-intro__line{
  width:clamp(120px,18vw,220px);height:1px;
  background:var(--copper, #B5502E);transform-origin:left center;
}
`}</style>
    </div>
  );
}

export default function HeroStage() {
  const { lang, path } = useLang();
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
    gsap.set(".mf-hero__mark", { opacity: 0, scale: 0.82 });
    gsap.set(".mf-hero__ltr", { opacity: 0, y: 46 });
    gsap.set(".mf-hero__role", { opacity: 0 });
    gsap.set(".mf-hero__cta", { opacity: 0, y: 18 });
    const tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add({ targets: ".mf-hero__mark", opacity: [0, 0.92], scale: [0.82, 1], duration: 800 }, 650)
      .add(
        { targets: ".mf-hero__title .mf-hero__ltr", translateY: [46, 0], opacity: [0, 1], duration: 900, delay: anime.stagger(34) },
        "-=320"
      )
      .add({ targets: ".mf-hero__role", opacity: [0, 0.75], letterSpacing: ["0.62em", "0.4em"], duration: 800 }, "-=520")
      .add({ targets: ".mf-hero__cta", opacity: [0, 1], translateY: [18, 0], duration: 700 }, "-=460");
    return () => { tl.pause(); };
  }, []);

  return (
    <section className="mf-hero" data-theme="dark" aria-label={t.wordmark}>
      <Network3D lang={lang} path={path} />
      <div className="mf-hero__scrim" aria-hidden="true" />

      <div ref={content} className="mf-hero__content" style={{ opacity: 0 }}>
        <img className="mf-hero__mark" src={M_LOGO} alt="" aria-hidden="true" />
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
        <span className="mf-hero__hint">{t.netHint}</span>
      </div>

      <style>{`
.mf-hero{
  position:relative;min-height:100svh;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;background:var(--mf-graphite);
}
.mf-hero__net3d{position:absolute;inset:0}
.mf-hero__tip{
  position:absolute;z-index:3;pointer-events:none;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:rgba(12,12,12,0.72);
  border:1px solid rgba(245,241,234,0.16);
  padding:0.35rem 0.7rem;white-space:nowrap;
}
.mf-hero__scrim{
  position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(20,20,20,0.38) 0%,rgba(20,20,20,0.20) 45%,rgba(20,20,20,0.58) 100%);
}
.mf-hero__content{
  position:relative;z-index:2;
  display:flex;flex-direction:column;align-items:center;text-align:center;
  padding:0 var(--gutter);
}
.mf-hero__mark{
  width:clamp(26px,3.6vw,40px);height:auto;
  margin:0 auto 1.6rem;display:block;
  mix-blend-mode:normal;filter:drop-shadow(0 0 12px rgba(245,241,234,0.18));
  will-change:transform,opacity;
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
.mf-hero__hint{
  position:absolute;bottom:calc(var(--gutter) * 0.7 + 1rem);
  left:50%;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:10px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:rgba(245,241,234,0.34);white-space:nowrap;
  pointer-events:none;
}
@media (max-width:860px){.mf-hero__hint{display:none}}
`}</style>
    </section>
  );
}
