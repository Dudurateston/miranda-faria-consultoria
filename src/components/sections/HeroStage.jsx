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
  "rota-forte", "1000-pecas", "motormoura", "uaiso-travel",
  "advogados-lco", "sevalho-controladoria", "vaf-global", "roda-agro",
  "queijos-serra", "miranda-faria", "motormoura-marca", "paulo-henrique",
];
// posições determinísticas dos satélites (espalhadas na concha)
const SAT_POS = [
  [-0.55, 1.18, 0.4], [0.62, 1.24, -0.35], [0.05, 1.46, 0.1], [-0.2, -1.46, 0.25],
  [0.5, -1.32, -0.35], [-1.82, 0.08, -0.3], [1.86, 0.02, 0.35], [-1.02, 1.18, -0.55],
  [1.08, -1.12, -0.5], [-1.58, 1.02, 0.5], [1.62, 1.08, -0.45], [0.0, -1.62, -0.45],
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

    // poeira de fundo: profundidade antes mesmo dos nós
    const dustN = isMobile ? 140 : 260;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      const r = 2.4 + Math.random() * 1.9;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      dustPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      dustPos[i * 3 + 2] = r * Math.cos(ph);
    }
    const dustG = new THREE.BufferGeometry();
    dustG.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustG, new THREE.PointsMaterial({
      color: 0xf5f1ea, size: 0.02, transparent: true, opacity: 0.30, sizeAttenuation: true,
    }));
    dust.scale.setScalar(0.001);
    scene.add(dust);

    // halo suave (glow aditivo) para os nós-mãe de cobre
    const haloTex = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 64;
      const g2 = c.getContext("2d");
      const grad = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(181,80,46,0.5)");
      grad.addColorStop(1, "rgba(181,80,46,0)");
      g2.fillStyle = grad; g2.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

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
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat.clone());
      m.position.set(...pos);
      m.userData = { ...data, dim: 1, baseOp: mat.opacity };
      m.scale.setScalar(0.001);
      group.add(m);
      nodes.push(m);
      return m;
    };
    HUB_POS.forEach((p, i) => {
      const hubMat = i % 2 ? copMat : boneMat;
      hubMeshes.push(addNode(p, 0.115, hubMat, {
        name: practiceLabels[i],
        to: path(PRACTICE_SLUGS[i]),
        hub: true,
        ph: i * 1.7,
        home: new THREE.Vector3(...p),
      }));
      if (i % 2) {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({
          map: haloTex, transparent: true, opacity: 0.5,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        sp.scale.setScalar(0.6);
        hubMeshes[i].add(sp);
      }
    });
    SAT_POS.slice(0, isMobile ? 7 : 12).forEach((p, i) => {
      const slug = SAT_SLUGS[i];
      const c = caseByName[slug];
      addNode(p, isMobile ? 0.05 : 0.035, satMat, {
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
    const edgeLines = pairs.map(() => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(24 * 3), 3));
      const line = new THREE.Line(g, new THREE.LineBasicMaterial({
        color: 0xf5f1ea, transparent: true, opacity: 0.14,
      }));
      line.scale.setScalar(0.001);
      group.add(line);
      return line;
    });
    const tmpMid = new THREE.Vector3();
    const updateEdge = (idx) => {
      const pr = pairs[idx];
      const a = pr[0].position, b = pr[1].position;
      tmpMid.copy(a).add(b).multiplyScalar(0.5);
      const dist = tmpMid.length() || 1;
      tmpMid.multiplyScalar(1 + 0.16 / dist); // arco sutilmente pra fora
      const attr = edgeLines[idx].geometry.attributes.position;
      for (let k = 0; k < 24; k++) {
        const t = k / 23, om = 1 - t;
        attr.setXYZ(k,
          om * om * a.x + 2 * om * t * tmpMid.x + t * t * b.x,
          om * om * a.y + 2 * om * t * tmpMid.y + t * t * b.y,
          om * om * a.z + 2 * om * t * tmpMid.z + t * t * b.z);
      }
      attr.needsUpdate = true;
    };
    pairs.forEach((_, i) => updateEdge(i));

    // ── octaedros discretos: geometria ambiente, wireframe, fora do raycast
    const SHARDS = [
      [0.95, 0.95, 0.65], [-1.15, -0.55, 0.8], [0.35, -1.62, 0.6],
      [1.45, -0.95, -0.65], [-1.68, 0.65, -0.55],
    ];
    const shards = SHARDS.map(([x, y, z], i) => {
      const m = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.055 + (i % 2) * 0.02),
        new THREE.MeshBasicMaterial({ color: i % 2 ? 0xb5502e : 0xf5f1ea, wireframe: true, transparent: true, opacity: 0.2 })
      );
      m.position.set(x, y, z);
      m.scale.setScalar(0.001);
      group.add(m);
      return m;
    });

    // ── pulsos de cobre correndo pelos fios
    const pulseN = isMobile ? 6 : 11;
    const pulses = [];
    for (let i = 0; i < pulseN; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), new THREE.MeshBasicMaterial({
        color: 0xd66a3f, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      m.scale.setScalar(0.001);
      group.add(m);
      pulses.push({ mesh: m, pair: pairs[Math.floor(Math.random() * pairs.length)], t: Math.random() });
    }

    // ── interação: giro com inércia, hover e clique por raycast
    let scrollT = 0;
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      scrollT = Math.min(Math.max(-r.top / r.height, 0), 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const tmpV = new THREE.Vector3();
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
        if (hovered) {
          const hs = hovered.userData.hub ? 1.5 : 2.1;
          gsap.to(hovered.scale, { x: hs, y: hs, z: hs, duration: 0.4, ease: "power2.out", overwrite: true });
        }
        renderer.domElement.style.cursor = hovered && !drag.on ? "pointer" : "grab";
        // modo foco: do que este ponto é feito?
        pairs.forEach((pr, i) => {
          const conn = hovered && (pr[0] === hovered || pr[1] === hovered);
          edgeLines[i].material.color.setHex(conn ? 0xb5502e : 0xf5f1ea);
          gsap.to(edgeLines[i].material, { opacity: hovered ? (conn ? 0.55 : 0.05) : 0.14, duration: 0.35, overwrite: true });
        });
        nodes.forEach((n) => {
          const keep = !hovered || n === hovered ||
            pairs.some((pr) => (pr[0] === hovered || pr[1] === hovered) && (pr[0] === n || pr[1] === n));
          gsap.to(n.userData, { dim: keep ? 1 : 0.14, duration: 0.35, overwrite: true });
        });
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
        if (hit) {
          const to = hit.object.userData.to;
          running = false;
          renderer.domElement.style.cursor = "default";
          gsap.to(camera.userData, { baseZ: 2.0, duration: 0.55, ease: "power3.in" });
          gsap.to(".mf-hero__content", { opacity: 0, duration: 0.3 });
          setTimeout(() => window.location.assign(to), 520);
        }
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
        // giro automático pausa enquanto você examina ou arrasta
        if (!hovered && !drag.on) group.rotation.y += 0.0016;
        group.rotation.y += vel.y;
        group.rotation.x += vel.x;
        group.rotation.x = Math.max(-0.5, Math.min(0.65, group.rotation.x));
        vel.x *= 0.94; vel.y *= 0.94;
        // respiração dos nós e fios
        nodes.forEach((n) => {
          n.position.x = n.userData.home.x + Math.sin(tm / 2600 + n.userData.ph) * 0.06;
          n.position.y = n.userData.home.y + Math.cos(tm / 3100 + n.userData.ph) * 0.06;
        });
        pairs.forEach((_, i) => updateEdge(i));
        // fade por profundidade: perto nítido, longe esmaece
        nodes.forEach((n) => {
          n.getWorldPosition(tmpV);
          const depthA = Math.max(0.3, Math.min(1, 1.25 + tmpV.z * 0.32));
          n.material.opacity = n.userData.baseOp * depthA * n.userData.dim;
        });
        // pulsos correndo
        shards.forEach((sh) => { sh.rotation.x += 0.0035; sh.rotation.y += 0.0045; });
      pulses.forEach((pl) => {
          pl.t += 0.006;
          if (pl.t > 1) { pl.t = 0; pl.pair = pairs[Math.floor(Math.random() * pairs.length)]; }
          const a = pl.pair[0].position, b = pl.pair[1].position;
          pl.mesh.position.set(a.x + (b.x - a.x) * pl.t, a.y + (b.y - a.y) * pl.t, a.z + (b.z - a.z) * pl.t);
        });
      }
      camera.position.set(0, -scrollT * 0.8, camera.userData.baseZ + scrollT * 1.3);
      dust.rotation.y = group.rotation.y * -0.4;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (running || mq.matches) return; running = true; raf = requestAnimationFrame(tick); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // ── entrada: câmera viaja, nós nascem, fios se desenham (GSAP)
    camera.userData.baseZ = mq.matches ? 3.3 : 6.2;
    if (mq.matches) {
      camera.position.z = 3.3;
      nodes.forEach((n) => n.scale.setScalar(1));
      shards.forEach((sh) => sh.scale.setScalar(1));
      edgeLines.forEach((l) => l.scale.setScalar(1));
      dust.scale.setScalar(1);
      pulses.forEach((p) => p.mesh.scale.setScalar(1));
      nodes.forEach((n) => {
        n.position.x = n.userData.home.x; n.position.y = n.userData.home.y;
      });
      pairs.forEach((_, i) => updateEdge(i));
      nodes.forEach((n) => { n.material.opacity = n.userData.baseOp * n.userData.dim; });
      renderer.render(scene, camera);
    } else {
      gsap.to(camera.userData, { baseZ: 3.3, duration: 2.4, ease: "expo.out", delay: 0.75 });
      gsap.to(dust.scale, { x: 1, y: 1, z: 1, duration: 2.2, ease: "expo.out", delay: 0.5 });
      nodes.forEach((n, i) => {
        gsap.to(n.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "expo.out", delay: 0.85 + (i % 5) * 0.12 });
      });
      edgeLines.forEach((l) => {
        gsap.to(l.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: "expo.out", delay: 1.3 });
        gsap.to(l.material, { opacity: 0.14, duration: 1.8, delay: 1.3 });
      });
      pulses.forEach((p, i) => {
        gsap.to(p.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "power2.out", delay: 2.0 + i * 0.14 });
      });
      shards.forEach((sh, i) => {
        gsap.to(sh.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "expo.out", delay: 1.15 + i * 0.12 });
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
      window.removeEventListener("scroll", onScroll);
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
/**
 * Portão de entrada — a abertura que independe do usuário.
 * Tela cheia: o M nasce girando, o nome sobe letra a letra, o filete
 * de cobre desenha e as quatro soluções se anunciam antes de a cortina
 * subir. Uma vez por sessão; reduced-motion pula direto.
 */
export function IntroGate() {
  const ref = useRef(null);
  const { lang } = useLang();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || sessionStorage.getItem("mf-intro") === "1") {
      el.remove();
      return;
    }
    sessionStorage.setItem("mf-intro", "1");
    const wm = el.querySelector(".mf-intro__word");
    wm.innerHTML = wm.textContent
      .split("")
      .map((ch) => `<span class="mf-intro__ltr">${ch === " " ? "&nbsp;" : ch}</span>`)
      .join("");
    const tl = gsap.timeline({ onComplete: () => el.remove() });
    tl.fromTo(el.querySelector(".mf-intro__m"),
        { opacity: 0, scale: 0.55, rotate: -16 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "expo.out" }, 0)
      .fromTo(el.querySelectorAll(".mf-intro__ltr"),
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.75, ease: "expo.out", stagger: 0.045 }, 0.18)
      .fromTo(el.querySelector(".mf-intro__line"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.55, ease: "expo.inOut" }, 0.6)
      .fromTo(el.querySelector(".mf-intro__role"),
        { opacity: 0, letterSpacing: "0.9em" },
        { opacity: 0.8, letterSpacing: "0.5em", duration: 0.7, ease: "expo.out" }, 0.8)
      .to({}, { duration: 0.3 })
      .to(el.querySelector(".mf-intro__m"), { y: -70, opacity: 0, duration: 0.55, ease: "power3.in" }, ">")
      .to(el, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "<0.12");
    document.documentElement.style.overflow = "hidden";
    const free = setTimeout(() => { document.documentElement.style.overflow = ""; }, 2300);
    return () => clearTimeout(free);
  }, []);

  const roles = PRACTICE_SLUGS.map((sg) => practices[lang]?.[sg]?.label).filter(Boolean).join(" · ");

  return (
    <div ref={ref} className="mf-intro" aria-hidden="true">
      <img className="mf-intro__m" src={M_LOGO} alt="" />
      <span className="mf-intro__word">MIRANDA FARIA</span>
      <span className="mf-intro__line" />
      <span className="mf-intro__role">{roles}</span>
      <style>{`
.mf-intro{
  position:fixed;inset:0;z-index:200;
  background:var(--mf-graphite, #141414);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:1.5rem;
}
.mf-intro::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 45% at 50% 48%, rgba(181,80,46,0.10), transparent 70%);
  pointer-events:none;
}
.mf-intro__m{
  width:clamp(44px,7vw,72px);
  filter:drop-shadow(0 0 18px rgba(181,80,46,0.35));
}
.mf-intro__word{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(1.5rem,4vw,2.5rem);letter-spacing:0.3em;
  text-transform:uppercase;color:var(--bone,#F5F1EA);white-space:nowrap;
}
.mf-intro__ltr{display:inline-block}
.mf-intro__line{
  width:clamp(140px,26vw,380px);height:1px;
  background:var(--copper,#B5502E);transform-origin:left center;
}
.mf-intro__role{
  font-family:var(--font-mono);font-size:clamp(9px,1.3vw,11px);
  letter-spacing:0.5em;text-transform:uppercase;
  color:rgba(245,241,234,0.75);white-space:nowrap;
}
@media(max-width:600px){
  .mf-intro{gap:1.05rem}
  .mf-intro__m{width:42px}
  .mf-intro__word{font-size:1.05rem;letter-spacing:0.18em}
  .mf-intro__line{width:110px}
  .mf-intro__role{font-size:8px;letter-spacing:0.3em}
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
    const introOn = !!document.querySelector(".mf-intro");
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: introOn ? 1.15 : 0.25 }
    );
    gsap.set(".mf-hero__mark", { opacity: 0, scale: 0.82 });
    gsap.set(".mf-hero__ltr", { opacity: 0, y: 46 });
    gsap.set(".mf-hero__role", { opacity: 0 });
    gsap.set(".mf-hero__cta", { opacity: 0, y: 18 });
    const tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add({ targets: ".mf-hero__mark", opacity: [0, 0.92], scale: [0.82, 1], duration: 800 }, introOn ? 1650 : 650)
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
  width:clamp(34px,4.6vw,52px);height:auto;
  margin:0 auto 1.8rem;display:block;
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
