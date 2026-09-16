import { useEffect, useRef } from "react";

export default function MfProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="mf-progress" aria-hidden="true" ref={barRef}>
      <style>{`
        .mf-progress{
          position:fixed;top:0;left:0;right:0;height:2px;z-index:130;
          background:var(--mf-copper,#B5502E);
          transform:scaleX(0);transform-origin:left center;
          pointer-events:none;
        }
      `}</style>
    </div>
  );
}
