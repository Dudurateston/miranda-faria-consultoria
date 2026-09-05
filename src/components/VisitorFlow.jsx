import React, { useEffect, useRef, useState } from "react";

/**
 * VisitorFlow — a assinatura visual da vertical de Desenvolvimento.
 *
 * A tese da pagina animada: "Um site nao e vitrine. E o primeiro
 * vendedor." Cada ponto e um visitante; o cursor e o site. Os
 * visitantes vagam, o site os conduz, e quem chega perto converte:
 * vira cobre e sai pela conversa. Presenca que nao gera conversa e
 * so custo — aqui, da pra ver.
 *
 * Canvas 2D puro, zero dependencias, pausa fora da viewport.
 */
export default function VisitorFlow({ label, hint, alt }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [chats, setChats] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const COPPER = "166, 72, 31";
    const INK = "26, 26, 24";

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), raf = 0, alive = true, running = false;
    let parts = [], t = 0, count = 0;
    const ptr = { x: -9999, y: -9999 };
    const cx = () => W * 0.46, cy = () => H * 0.52;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // um visitante entra por uma das bordas, com um rumo qualquer
    const spawn = () => {
      const side = Math.random();
      let x, y;
      if (side < 0.45) { x = -10; y = Math.random() * H; }
      else if (side < 0.7) { x = W * (0.3 + Math.random() * 0.5); y = -10; }
      else { x = W * (0.3 + Math.random() * 0.6); y = H + 10; }
      parts.push({ x, y, vx: 0.3 + Math.random() * 0.5, vy: (Math.random() - 0.5) * 0.5, lead: 0, trail: [], out: false, age: 0, ph: Math.random() * 7 });
      // um em tres ja vem com rumo ao site: o trafego ja existe
      const np = parts[parts.length - 1];
      if (Math.random() < 0.34) {
        const dx = cx() - x, dy = cy() - y, d = Math.hypot(dx, dy) || 1;
        np.vx = (dx / d) * 0.7; np.vy = (dy / d) * 0.7;
      }
    };

    const step = (dt) => {
      t += dt;
      const target = parts.length < (W < 640 ? 42 : 90);
      if (target && Math.random() < 0.35) spawn();
      const ex = W + 14, ey = H * 0.3;
      for (const p of parts) {
        p.age += dt;
        if (!p.out) {
          // vagar: ruido suave + atracao pro centro (o site trabalha o
          // lead — e visitante insistido converte)
          const dx = cx() - p.x, dy = cy() - p.y, d = Math.hypot(dx, dy) || 1;
          const pull = p.lead > 0 ? 0.05 : p.age > 9000 ? 0.05 : 0.016;
          p.vx += (dx / d) * pull + Math.sin(t * 0.0012 + p.ph) * 0.02;
          p.vy += (dy / d) * pull + Math.cos(t * 0.0016 + p.ph * 2) * 0.02;
          // o cursor trabalha o lead: atrai quem esta perto
          const mdx = ptr.x - p.x, mdy = ptr.y - p.y, md = Math.hypot(mdx, mdy);
          if (md < 130 && md > 4) { p.vx += (mdx / md) * 0.06; p.vy += (mdy / md) * 0.06; }
          p.vx *= 0.96; p.vy *= 0.96;
          p.x += p.vx * dt * 0.06; p.y += p.vy * dt * 0.06;
          // conversao: perto do coracao do site, vira cobre
          if (d < 62 || md < 74) { p.lead = 1; p.out = true; count++; setChats(count); }
        } else {
          // cobre: deixa o rastro e sai pela conversa
          const dx = ex - p.x, dy = ey - p.y, d = Math.hypot(dx, dy) || 1;
          p.vx += (dx / d) * 0.05; p.vy += (dy / d) * 0.05;
          p.vx *= 0.975; p.vy *= 0.975;
          p.x += p.vx * dt * 0.09; p.y += p.vy * dt * 0.09;
          p.trail.push([p.x, p.y]);
          if (p.trail.length > 14) p.trail.shift();
          if (p.x > W + 16) p.dead = true;
        }
      }
      parts = parts.filter((p) => !p.dead && p.x > -30 && p.x < W + 40 && p.y > -30 && p.y < H + 40);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // o M no fundo — o vendedor de terno
      ctx.save();
      ctx.font = `${Math.min(W * 0.5, H * 0.9)}px "Instrument Serif", "EB Garamond", Georgia, serif`;
      ctx.fillStyle = `rgba(${INK},0.045)`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("M", cx(), cy());
      ctx.restore();
      // o coracao: anel de cobre respirando
      const pulse = reduced ? 0 : Math.sin(t * 0.002) * 3;
      ctx.strokeStyle = `rgba(${COPPER},0.4)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(cx(), cy(), 46 + pulse, 0, 7); ctx.stroke();
      ctx.strokeStyle = `rgba(${COPPER},0.16)`;
      ctx.beginPath(); ctx.arc(cx(), cy(), 62 + pulse, 0, 7); ctx.stroke();
      // rastro das conversas
      for (const p of parts) {
        if (!p.out || !p.trail.length) continue;
        for (let i = 1; i < p.trail.length; i++) {
          const a = (i / p.trail.length) * 0.5;
          ctx.strokeStyle = `rgba(${COPPER},${a})`; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(p.trail[i - 1][0], p.trail[i - 1][1]); ctx.lineTo(p.trail[i][0], p.trail[i][1]); ctx.stroke();
        }
      }
      // os visitantes
      for (const p of parts) {
        if (p.out) { ctx.fillStyle = `rgba(${COPPER},0.95)`; ctx.beginPath(); ctx.arc(p.x, p.y, 2.3, 0, 7); ctx.fill(); }
        else { ctx.fillStyle = `rgba(${INK},0.3)`; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill(); }
      }
    };

    let last = performance.now();
    const frame = (now) => {
      if (!alive) return;
      const dt = Math.min(50, now - last); last = now;
      if (running) { step(dt); draw(); }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      ptr.x = e.clientX - rect.left; ptr.y = e.clientY - rect.top;
    };
    const onLeave = () => { ptr.x = -9999; ptr.y = -9999; };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver((es) => { es.forEach((en) => { running = en.isIntersecting; if (running && reduced) draw(); }); }, { threshold: 0.05 });
    io.observe(wrap);
    resize();
    if (reduced) { for (let i = 0; i < 40; i++) spawn(); step(400); draw(); }
    else {
      for (let i = 0; i < 44; i++) { spawn(); const np = parts[parts.length - 1]; np.x = Math.random() * W; np.y = Math.random() * H; np.age = 3000 + Math.random() * 5000; }
      running = true; raf = requestAnimationFrame(frame);
    }
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <figure ref={wrapRef} className="mf-sig" aria-label={alt || label} role="img">
      <canvas ref={canvasRef} className="mf-sig__canvas" />
      <figcaption className="mf-sig__cap">
        <span className="mf-sig__label">{label}</span>
        <span className="mf-sig__hint">
          {hint} <span className="mf-sig__count">{chats}</span>
        </span>
      </figcaption>
    </figure>
  );
}
