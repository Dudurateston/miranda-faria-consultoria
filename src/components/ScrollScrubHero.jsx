import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

/**
 * ScrollScrubHero — hero do site Miranda Faria.
 *
 * Sequência de imagens pintada em <canvas>, com o quadro exibido
 * determinado pela posição do scroll. Técnica usada pela Apple.
 * Não usa <video>: vídeo não permite scrub confiável no iOS Safari.
 *
 * Aceita as imagens de duas formas:
 *  a) frames = ["url1", "url2", ...]  (lista explícita — recomendado)
 *  b) baseUrl + frameCount + ext      (padrão numerado)
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
  scrollHeight = "400vh",
  showWordmark = true,
}) {
  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrame = useRef(-1);
  const rafPending = useRef(false);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [progress, setProgress] = useState(0);

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
    currentFrame.current = -1;

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

  const draw = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BONE;
    ctx.fillRect(0, 0, cw, ch);

    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }, []);

  const update = useCallback(() => {
    rafPending.current = false;
    const el = trackRef.current;
    if (!el || total === 0) return;

    const rect = el.getBoundingClientRect();
    const span = el.offsetHeight - window.innerHeight;
    const p = span > 0 ? clamp(-rect.top / span) : 0;
    setProgress(p);

    const index = Math.min(total - 1, Math.floor(p * (total - 1)));
    if (index !== currentFrame.current) {
      currentFrame.current = index;
      draw(index);
    }
  }, [draw, total]);

  useEffect(() => {
    if (!ready) return;

    if (reduced) {
      draw(total - 1);
      setProgress(1);
      return;
    }

    const onScroll = () => {
      if (!rafPending.current) {
        rafPending.current = true;
        window.requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      currentFrame.current = -1;
      update();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ready, reduced, update, draw, total]);

  const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;
  const wordP = clamp((progress - 0.78) / 0.18);
  const hintP = 1 - clamp((progress - 0.02) / 0.22);

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: BONE,
        }}
      >
        {failed ? (
          <div style={{ textAlign: "center", padding: "0 24px" }}>
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
              width: "100%",
              height: "72%",
              display: "block",
              opacity: ready ? 1 : 0,
              transition: "opacity 600ms ease",
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
              textAlign: "center",
              marginTop: 8,
              opacity: wordP,
              transform: `translateY(${24 * (1 - wordP)}px)`,
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
