import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Revelação linha a linha da frase principal.
// O texto é quebrado em linhas visuais; cada linha sobe de
// translateY(110%) para 0 dentro de um contêiner com overflow hidden,
// com stagger 0.08, ease expo.out, duração 0.8s, disparado a 75% da viewport.
export default function LineReveal({
  as: Tag = "h2",
  className = "",
  children,
  stagger = 0.08,
  duration = 0.8,
  delay = 0,
  start = "top 75%",
}) {
  const ref = useRef(null);
  const text = typeof children === "string" ? children : String(children ?? "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    let tween;
    let cancelled = false;
    let tries = 0;
    let auditTimer = null;
    let resizeTimer = null;

    const killTween = () => {
      if (tween) {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        tween = null;
      }
    };

    const build = () => {
      const words = text.split(/\s+/).filter(Boolean);
      // 1. medir linhas
      el.textContent = "";
      const meas = [];
      words.forEach((w, i) => {
        const span = document.createElement("span");
        span.className = "lr__word";
        span.textContent = w;
        el.appendChild(span);
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
        meas.push(span);
      });
      const lines = [];
      let cur = null;
      let lastTop = null;
      meas.forEach((span) => {
        const top = span.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 1) {
          cur = { words: [span] };
          lines.push(cur);
          lastTop = top;
        } else {
          cur.words.push(span);
        }
      });
      // 2. reconstruir com .lr__line > .lr__inner
      el.textContent = "";
      const inners = [];
      lines.forEach((line) => {
        const lineEl = document.createElement("span");
        lineEl.className = "lr__line";
        const inner = document.createElement("span");
        inner.className = "lr__inner";
        line.words.forEach((w, i) => {
          inner.appendChild(w);
          if (i < line.words.length - 1) inner.appendChild(document.createTextNode(" "));
        });
        lineEl.appendChild(inner);
        el.appendChild(lineEl);
        inners.push(inner);
      });
      // 3. animar. Ao terminar, o clip deixa de ser necessario — se a
      // quebra mudar depois (fonte/resize), o texto nunca fica cortado.
      gsap.set(el, { opacity: 1 });
      gsap.set(inners, { yPercent: 110 });
      tween = gsap.to(inners, {
        yPercent: 0,
        duration,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
        onComplete: () => {
          el.querySelectorAll(".lr__line").forEach((l) => {
            l.style.overflow = "visible";
          });
        },
      });
      tries += 1;
      // 4. auditoria: se alguma linha embrulhou dentro do clip, a
      // medicao ficou velha (fonte carregou tarde, layout assentou
      // depois). Re-medir. Maximo 3 tentativas contra loop.
      auditTimer = setTimeout(() => {
        if (cancelled) return;
        // Metrica imune ao translateY da animacao (scrollHeight conta o
        // transform e daria falso positivo): se o inner (uma "linha"
        // medida) tem altura maior que a caixa da linha, o agrupamento
        // mediu errado e o texto embrulha dentro do clip.
        const bad = Array.from(el.querySelectorAll(".lr__line")).some((l) => {
          const inner = l.querySelector(".lr__inner");
          if (!inner) return false;
          return inner.getBoundingClientRect().height > l.getBoundingClientRect().height + 3;
        });
        if (bad && tries < 3) {
          killTween();
          build();
        }
      }, 350);
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cancelled) return;
        killTween();
        tries = 0;
        build();
      }, 180);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (!cancelled) build(); });
    } else {
      build();
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      clearTimeout(auditTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      killTween();
    };
  }, [text, stagger, duration, delay, start]);

  return (
    <Tag ref={ref} className={`${className} lr`} style={{ opacity: 0 }}>
      {text}
    </Tag>
  );
}
