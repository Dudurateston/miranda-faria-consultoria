import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { cases, practices, PRACTICE_SLUGS } from "@/content/copy";

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
/* PROFUNDIDADE (Eduardo, 17/09: ocupar o espaco 3D): Z dos nos e
   multiplicado — a rede vira uma concha de verdade, nao um disco. */
const deepen = (p, f) => [p[0], p[1], p[2] * f];
/* CORES POR SKIN: a hero flipa com o tema (osso no claro, grafite no
   escuro) — a rede inteira acompanha. Paleta centralizada. */
const NET_SKIN = {
  light: { node: 0x1a1a18, sat: 0x1a1a18, copper: 0xb5502e, shard: 0x1a1a18, pulse: 0xd66a3f, edge: 0x1a1a18, edgeHover: 0xb5502e, dust: 0x1a1a18 },
  dark:  { node: 0xefeae0, sat: 0xefeae0, copper: 0xe08a5f, shard: 0xefeae0, pulse: 0xe08a5f, edge: 0xefeae0, edgeHover: 0xe08a5f, dust: 0xefeae0 },
};
const skinNow = () => (document.documentElement.getAttribute("data-skin") === "dark" ? NET_SKIN.dark : NET_SKIN.light);

function Network3D({ lang, path }) {
  const mount = useRef(null);
  const [label, setLabel] = useState(null); // { name, x, y }
  const [hint, setHint] = useState(false); // "arraste para explorar" (1a vez na sessao visual)

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
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, section.clientWidth / section.clientHeight, 0.1, 50);
    /* MOBILE: viewport estreito alarga o angulo aparente de tudo — a
       rede encolhe drasticamente e a camera recua (pedido Eduardo 17/09). */
    const mob = isMobile ? 0.52 : 1;
    const camBaseZ = isMobile ? 9.2 : 5.1; // desktop maior de novo (Eduardo 17/09)
    camera.position.set(0, 0, camBaseZ);

    const group = new THREE.Group();
    const skin = skinNow();
    /* materiais vivos: repintados quando a skin muda (toggle no rodape) */
    const live = [];
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
    const dustMat = new THREE.PointsMaterial({
      color: skin.dust, size: 0.02 * mob, transparent: true, opacity: 0.30, sizeAttenuation: true,
    });
    dustMat.userData.slot = "dust"; live.push(dustMat);
    const dust = new THREE.Points(dustG, dustMat);
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

    const boneMat = new THREE.MeshBasicMaterial({ color: skin.node, transparent: true, opacity: 0.92 });
    const satMat = new THREE.MeshBasicMaterial({ color: skin.sat, transparent: true, opacity: 0.55 });
    const copMat = new THREE.MeshBasicMaterial({ color: skin.copper, transparent: true, opacity: 0.95 });
    boneMat.userData.slot = "node"; live.push(boneMat);
    satMat.userData.slot = "sat"; live.push(satMat);
    copMat.userData.slot = "copper"; live.push(copMat);

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
      const mm = mat.clone();
      mm.userData.slot = mat.userData.slot; live.push(mm);
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mm);
      m.position.set(...pos);
      m.userData = {
        ...data, dim: 1, baseOp: mat.opacity,
        /* vida: cada no respira com frequencias/fases proprias —
           nada de relogio unico; o conjunto parece organismo (17/09). */
        live: {
          f1: 1 / (2200 + Math.random() * 1600), f2: 1 / (900 + Math.random() * 700),
          p1: Math.random() * 6.283, p2: Math.random() * 6.283,
          r1: Math.random() * 6.283, r2: Math.random() * 6.283,
          a1: 0.05 + Math.random() * 0.045, a2: 0.02 + Math.random() * 0.03,
        },
      };
      m.scale.setScalar(0.001);
      group.add(m);
      nodes.push(m);
      return m;
    };
    HUB_POS.forEach((p, i) => {
      const hubMat = i % 2 ? copMat : boneMat;
      const dp = deepen(p, 1.5);
      hubMeshes.push(addNode(dp, 0.115 * mob, hubMat, {
        name: practiceLabels[i],
        to: path(PRACTICE_SLUGS[i]),
        hub: true,
        ph: i * 1.7,
        home: new THREE.Vector3(...dp),
      }));
      if (i % 2) {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({
          map: haloTex, transparent: true, opacity: 0.5,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        sp.scale.setScalar(0.6 * mob);
        hubMeshes[i].add(sp);
      }
    });
    SAT_POS.slice(0, isMobile ? 7 : 12).forEach((p, i) => {
      const slug = SAT_SLUGS[i];
      const c = caseByName[slug];
      const dsp = deepen(p, 1.9);
      addNode(dsp, isMobile ? 0.035 * mob : 0.035, satMat, {
        name: c ? c.name : slug,
        to: path(`work/${slug}`),
        hub: false,
        ph: i * 2.3,
        home: new THREE.Vector3(...dsp),
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
      const em = new THREE.LineBasicMaterial({
        color: skin.edge, transparent: true, opacity: 0.14,
      });
      em.userData.slot = "edge"; live.push(em);
      const line = new THREE.Line(g, em);
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
      const shm = new THREE.MeshBasicMaterial({ color: i % 2 ? skin.copper : skin.shard, wireframe: true, transparent: true, opacity: 0.2 });
      shm.userData.slot = i % 2 ? "copper" : "shard"; live.push(shm);
      const m = new THREE.Mesh(new THREE.OctahedronGeometry((0.055 + (i % 2) * 0.02) * mob), shm);
      m.position.set(x, y, z);
      m.scale.setScalar(0.001);
      group.add(m);
      return m;
    });

    // ── pulsos de cobre correndo pelos fios
    const pulseN = isMobile ? 6 : 11;
    const pulses = [];
    for (let i = 0; i < pulseN; i++) {
      const pm = new THREE.MeshBasicMaterial({
        color: skin.pulse, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      pm.userData.slot = "pulse"; live.push(pm);
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.024 * mob, 8, 6), pm);
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
    /* parallax: a camera acompanha o cursor com suavizacao — profundidade
       perceptivel sem arrastar + "da pra mexer" comunicado no 1o segundo. */
    const par = { x: 0, y: 0, tx: 0, ty: 0 };
    const drag = { on: false, moved: 0, lx: 0, ly: 0 };
    let hovered = null;
    let hintOn = true; // hint some PERMANENTMENTE apos o 1o drag do visitante
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
      const pb = renderer.domElement.getBoundingClientRect();
      par.tx = ((e.clientX - pb.left) / pb.width - 0.5) * 2;
      par.ty = ((e.clientY - pb.top) / pb.height - 0.5) * 2;
      if (drag.on) {
        const dx = e.clientX - drag.lx;
        const dy = e.clientY - drag.ly;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        vel.y += dx * 0.00042;
        vel.x += dy * 0.00042;
        drag.lx = e.clientX; drag.ly = e.clientY;
        if (drag.moved > 6) {
          renderer.domElement.style.cursor = "grabbing";
          if (hintOn) { hintOn = false; setHint(false); }
        }
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
          edgeLines[i].material.color.setHex(conn ? skinNow().edgeHover : skinNow().edge);
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
      par.tx = 0; par.ty = 0;
      setLabel(null);
      if (hovered) { gsap.to(hovered.scale, { x: 1, y: 1, z: 1, duration: 0.4, overwrite: true }); hovered = null; }
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointercancel", () => { drag.on = false; });
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const tick = (tm) => {
      if (!running) return;
      if (!mq.matches) {
        // giro automático pausa enquanto você examina ou arrasta
        if (!hovered && !drag.on) group.rotation.y += 0.0016;
        group.rotation.y += vel.y;
        group.rotation.x += vel.x;
        if (group.rotation.x > 0.75) { group.rotation.x = 0.75; vel.x = 0; }
        else if (group.rotation.x < -0.75) { group.rotation.x = -0.75; vel.x = 0; }
        vel.x *= 0.94; vel.y *= 0.94;
        dust.rotation.y += 0.00012;
        dust.rotation.x = Math.sin(tm / 9000) * 0.06;
        // respiração dos nós e fios
        nodes.forEach((n) => {
          const lv = n.userData.live;
          n.position.x = n.userData.home.x
            + Math.sin(tm * lv.f1 + lv.p1) * lv.a1
            + Math.sin(tm * lv.f2 + lv.p2) * lv.a2 * 0.7;
          n.position.y = n.userData.home.y
            + Math.cos(tm * lv.f1 * 1.13 + lv.r1) * lv.a1
            + Math.sin(tm * lv.f2 * 0.87 + lv.r2) * lv.a2 * 0.7;
          n.position.z = n.userData.home.z
            + Math.sin(tm * lv.f2 + lv.p2) * lv.a2 * 1.4;
        });
        pairs.forEach((_, i) => updateEdge(i));
        // fade por profundidade: perto nítido, longe esmaece
        nodes.forEach((n) => {
          n.getWorldPosition(tmpV);
          const depthA = Math.max(0.24, Math.min(1, 1.12 + tmpV.z * 0.42));
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
      if (!isMobile) {
        par.x += (par.tx - par.x) * 0.045;
        par.y += (par.ty - par.y) * 0.045;
      }
      camera.position.set(
        par.x * 0.55, -scrollT * 0.8 - par.y * 0.4,
        camera.userData.baseZ + scrollT * 1.3
      );
      camera.rotation.set(par.y * 0.05, -par.x * 0.06, 0);
      dust.rotation.y = group.rotation.y * -0.4;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || mq.matches) return;
      running = true; raf = requestAnimationFrame(tick);
      if (!isMobile) {
        setTimeout(() => { if (hintOn) setHint(true); }, 3000);
        setTimeout(() => { hintOn = false; setHint(false); }, 14000);
      }
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // ── entrada: câmera viaja, nós nascem, fios se desenham (GSAP)
    camera.userData.baseZ = camBaseZ;
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
      gsap.to(camera.userData, { baseZ: camBaseZ, duration: 2.4, ease: "expo.out", delay: 0.75 });
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

    /* toggle de tema ao vivo (rodape) repinta a rede sem reload */
    const repaint = () => {
      const sk = skinNow();
      live.forEach((mm) => mm.color.setHex(sk[mm.userData.slot]));
    };
    const skinObs = new MutationObserver(repaint);
    skinObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });

    return () => {
      skinObs.disconnect();
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
      {hint && (
        <span className="mf-hero__hint" aria-hidden="true">
          {lang === "en" ? "drag to explore" : "arraste para explorar"}
        </span>
      )}
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

export default Network3D;
