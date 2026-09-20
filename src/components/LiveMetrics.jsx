import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Painel de medidas reais — o substituto do contador de FPS.
 * Não mede frames (frágil: throttling, headless, GPU variável).
 * Mede o que dá pra provar: bytes, requisições, nós do DOM e tempo
 * de carregamento — direto das APIs de performance do navegador.
 * Não existe "não funciona": é aritmética sobre dados garantidos.
 * Reduced-motion: sem cursor piscando, números estáticos.
 */

const REF_KB = 2000; // página típica da web, pra dar contexto ao peso

const fmtKB = (b) => (b > 0 ? (b / 1024).toFixed(1) : "0.0");

export default function LiveMetrics() {
  const [m, setM] = useState(null);
  const [sec, setSec] = useState(0);
  const [pulse, setPulse] = useState(0);
  const t0 = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    t0.current = performance.now();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const i = setInterval(() => setSec((performance.now() - t0.current) / 1000), 200);
    return () => clearInterval(i);
  }, []);

  const measure = useCallback(() => {
    try {
      const res = performance.getEntriesByType("resource");
      const nav = performance.getEntriesByType("navigation")[0];
      let bytes = nav ? nav.transferSize || 0 : 0;
      res.forEach((r) => {
        bytes += r.transferSize || 0;
      });
      setM({
        kb: bytes / 1024,
        reqs: res.length + (nav ? 1 : 0),
        nodes: document.getElementsByTagName("*").length,
        load: nav ? Math.round(nav.responseEnd - nav.startTime) : null,
      });
      setPulse((p) => p + 1);
    } catch {
      setM(null);
    }
  }, []);

  useEffect(() => {
    measure();
    const onLoad = () => measure();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [measure]);

  const bar = m ? Math.max(2, Math.min(100, (m.kb / REF_KB) * 100)) : 0;

  return (
    <div className="mf-lm">
      <div className="mf-lm__rows" role="table" aria-label="Medidas reais desta página">
        <div className="mf-lm__row" role="row" key={`kb-${pulse}`}>
          <span className="mf-lm__k" role="columnheader">peso real desta página</span>
          <span className="mf-lm__v" role="cell">
            {m ? `${fmtKB(m.kb * 1024)} KB` : "—"}
          </span>
        </div>
        <div className="mf-lm__row" role="row">
          <span className="mf-lm__k" role="columnheader">requisições</span>
          <span className="mf-lm__v" role="cell">{m ? m.reqs : "—"}</span>
        </div>
        <div className="mf-lm__row" role="row">
          <span className="mf-lm__k" role="columnheader">nós no DOM</span>
          <span className="mf-lm__v" role="cell">{m ? m.nodes.toLocaleString("pt-BR") : "—"}</span>
        </div>
        <div className="mf-lm__row" role="row">
          <span className="mf-lm__k" role="columnheader">carregada em</span>
          <span className="mf-lm__v" role="cell">{m && m.load != null ? `${m.load} ms` : "—"}</span>
        </div>
        <div className="mf-lm__row" role="row">
          <span className="mf-lm__k" role="columnheader">seu navegador já a sustenta há</span>
          <span className="mf-lm__v mf-lm__v--live" role="cell">
            {sec.toFixed(1)}s
            {!reduced && <span className="mf-lm__cur" aria-hidden="true" />}
          </span>
        </div>
      </div>

      <div className="mf-lm__bars" aria-hidden="true">
        <div className="mf-lm__bar">
          <span className="mf-lm__barfill" style={{ width: `${bar}%` }} />
        </div>
        <p className="mf-lm__ref">
          ── página típica da web ≈ {REF_KB} KB · esta página, medida agora
        </p>
      </div>

      <button
        type="button"
        className="mf-lm__btn"
        onClick={measure}
        data-cursor="link"
      >
        ↻ medir de novo
      </button>

      <style>{`
.mf-lm{
  position:relative;display:flex;flex-direction:column;justify-content:space-between;
  gap:1.4rem;padding:1.4rem 1.3rem;min-height:300px;
  background:var(--color-bg);border:1px solid var(--mf-rule);
  font-family:var(--font-mono);
}
.mf-lm__rows{display:flex;flex-direction:column}
.mf-lm__row{
  display:flex;justify-content:space-between;align-items:baseline;gap:1rem;
  padding:0.55rem 0;border-bottom:1px solid var(--mf-rule);
}
.mf-lm__k{
  font-size:var(--text-label);letter-spacing:var(--tracking-label);
  color:var(--color-text-secondary);
}
.mf-lm__v{
  font-size:var(--text-body-md);font-variant-numeric:tabular-nums;
  color:var(--mf-ink,var(--color-text));
}
.mf-lm__v--live{color:var(--mf-terracotta)}
.mf-lm__cur{
  display:inline-block;width:0.55em;height:1em;margin-left:2px;vertical-align:-0.15em;
  background:var(--mf-terracotta);animation:mf-lm-blink 1.1s steps(1) infinite;
}
@keyframes mf-lm-blink{50%{opacity:0}}
.mf-lm__bars{margin-top:0.2rem}
.mf-lm__bar{
  height:5px;background:var(--mf-rule);overflow:hidden;
}
.mf-lm__barfill{
  display:block;height:100%;background:var(--mf-terracotta);
  transition:width 0.6s cubic-bezier(0.22,1,0.36,1);
}
.mf-lm__ref{
  margin:0.5rem 0 0;font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-secondary);
}
.mf-lm__btn{
  align-self:flex-start;margin-top:auto;padding:0.55rem 0.9rem;
  background:none;border:1px solid var(--mf-rule);cursor:pointer;
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);color:var(--color-text-secondary);
  transition:border-color 0.25s,color 0.25s;
}
.mf-lm__btn:hover,.mf-lm__btn:focus-visible{border-color:var(--mf-terracotta);color:var(--mf-terracotta)}
@media (prefers-reduced-motion: reduce){
  .mf-lm__cur{animation:none;opacity:0}
  .mf-lm__barfill{transition:none}
}
      `}</style>
    </div>
  );
}
