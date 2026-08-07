import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

/**
 * ScrollScrubHero — hero do site Miranda Faria.
 *
 * Sequência de imagens pintada em <canvas>, com o quadro determinado
 * pela posição do scroll. Não usa <video>: vídeo não faz scrub
 * confiável no iOS Safari.
 *
 * Fluidez:
 *  - o progresso é suavizado por interpolação contínua (lerp), então
 *    a animação desliza em vez de pular de quadro em quadro;
 *  - quadros adjacentes são misturados por opacidade (crossfade), o
 *    que dobra a sensação de quadros disponíveis.
 *
 * Integração visual:
 *  - fit "cover" por padrão: preenche a tela inteira, sem moldura;
 *  - máscara nas bordas dissolve o quadro no fundo da página, então
 *    não se percebe onde a animação começa e termina.
 */

const BONE = "#F5F1EA";
const INK = "#1A1A18";
const STONE = "#8A8578";

const pad3 = (n) => String(n).padStart(3, "0");
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

export default function ScrollScrubHero({
  frames,
  baseUrl,
  frameCount = 65,
  ext = "jpg",
  scrollHeight = "500vh",
  showWordmark = true,
  fit = "cover",
  smoothing = 0.12,
}) {
  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const targetP = useRef(0);
  const smoothP = useRef(0);
  const lastDrawn = useRef(-1);
  const loopId = useRef(null);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [wordP, setWordP] = useState(0);
  const [hintP, setHintP] = useState(1);

  const urls = useMemo(() => {
    if (Array.isArray(frames) && frames.length > 0) return frames;
    if (!baseUrl) return [];
    return Array.from(
      { length: frameCount },
      (_, i) => `${baseUrl}${pad3(i + 1)}.${ext}`
    );
  }, [frames, baseUrl, frameCount, ext]);

  const total = urls.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (total === 0) {
      setFailed(true);
      return;
    }
    setFailed(false);
    setReady(false);
    setLoaded(0);
    lastDrawn.current = -1;

    let cancelled = false;
    let done = 0;
    let errors = 0;
    const imgs = new Array(total);

    urls.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        done += 1;
        setLoaded(done);
        if (done + errors === total) setReady(true);
      };
      img.onerror = () => {
        if (cancelled) return;
        errors += 1;
        if (errors > total * 0.2) setFailed(true);
        if (done + errors === total) setReady(done > 0);
      };
      imgs[i] = img;
    });
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, [urls, total]);

  /** Desenha uma imagem preenchendo o canvas conforme o modo de encaixe. */
  const paint = useCallback(
    (ctx, img, cw, ch, alpha) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const sx =
        fit === "cover"
          ? Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
          : Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * sx;
      const h = img.naturalHeight * sx;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      ctx.globalAlpha = 1;
    },
    [fit]
  );

  const render = useCallback(
    (p) => {
      const canvas = canvasRef.current;
      if (!canvas || total === 0) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!cw || !ch) return;

      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BONE;
      ctx.fillRect(0, 0, cw, ch);

      const exact = p * (total - 1);
      const i0 = Math.min(total - 1, Math.floor(exact));
      const i1 = Math.min(total - 1, i0 + 1);
      const mix = exact - i0;

      paint(ctx, imagesRef.current[i0], cw, ch, 1);
      if (i1 !== i0 && mix > 0.01) {
        paint(ctx, imagesRef.current[i1], cw, ch, mix);
      }
    },
    [paint, total]
  );

  const readScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const span = el.offsetHeight - window.innerHeight;
    return span > 0 ? clamp(-rect.top / span) : 0;
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (reduced) {
      smoothP.current = 1;
      render(1);
      setWordP(1);
      setHintP(0);
      return;
    }

    const onScroll = () => {
      targetP.current = readScroll();
    };
    const onResize = () => {
      lastDrawn.current = -1;
      targetP.current = readScroll();
      render(smoothP.current);
    };

    targetP.current = readScroll();
    smoothP.current = targetP.current;

    const tick = () => {
      const diff = targetP.current - smoothP.current;
      smoothP.current += diff * smoothing;
      if (Math.abs(diff) < 0.00015) smoothP.current = targetP.current;

      const key = Math.round(smoothP.current * (total - 1) * 100);
      if (key !== lastDrawn.current) {
        lastDrawn.current = key;
        render(smoothP.current);
        setWordP(clamp((smoothP.current - 0.76) / 0.18));
        setHintP(1 - clamp((smoothP.current - 0.02) / 0.2));
      }
      loopId.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    loopId.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (loopId.current) window.cancelAnimationFrame(loopId.current);
    };
  }, [ready, reduced, render, readScroll, total, smoothing]);

  const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;

  const edgeMask =
    "linear-gradient(to bottom, transparent 0%, #000 9%, #000 84%, transparent 100%)";

  return (
    <div
      ref={trackRef}
      aria-label="Miranda Faria — Consultoria e Tecnologia"
      style={{
        height: reduced ? "100vh" : scrollHeight,
        position: "relative",
        background: BONE,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: BONE,
        }}
      >
        {failed ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Didot, Georgia, serif",
                fontSize: "clamp(24px, 4.8vw, 52px)",
                letterSpacing: "0.2em",
                textIndent: "0.2em",
                color: INK,
                margin: 0,
              }}
            >
              MIRANDA FARIA
            </p>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.42em",
                textIndent: "0.42em",
                color: STONE,
                marginTop: 16,
              }}
            >
              CONSULTORIA &amp; TECNOLOGIA
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
              opacity: ready ? 1 : 0,
              transition: "opacity 900ms ease",
              WebkitMaskImage: edgeMask,
              maskImage: edgeMask,
            }}
          />
        )}

        {!ready && !failed && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 14,
              background: BONE,
            }}
          >
            <div
              style={{
                width: 120,
                height: 1,
                background: "rgba(138,133,120,0.3)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${pct}%`,
                  background: INK,
                  transition: "width 200ms linear",
                }}
              />
            </div>
            <span style={{ fontSize: 10, letterSpacing: "0.3em", color: STONE }}>
              {pct}%
            </span>
          </div>
        )}

        {showWordmark && ready && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "13%",
              textAlign: "center",
              opacity: wordP,
              transform: `translateY(${22 * (1 - wordP)}px)`,
              pointerEvents: "none",
            }}
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', Didot, Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(24px, 4.8vw, 52px)",
                letterSpacing: "0.2em",
                textIndent: "0.2em",
                lineHeight: 1,
                color: INK,
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              MIRANDA FARIA
            </h1>
            <p
              style={{
                fontSize: "clamp(8px, 1.2vw, 11px)",
                letterSpacing: "0.42em",
                textIndent: "0.42em",
                color: STONE,
                margin: "14px 0 0",
                whiteSpace: "nowrap",
              }}
            >
              CONSULTORIA &amp; TECNOLOGIA
            </p>
          </div>
        )}

        {ready && !reduced && (
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 10,
              letterSpacing: "0.34em",
              textIndent: "0.34em",
              color: STONE,
              opacity: hintP,
              pointerEvents: "none",
            }}
          >
            ROLE
          </div>
        )}
      </div>
    </div>
  );
}
