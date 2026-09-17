import { memo } from "react";
import { getPractice, PRACTICE_SLUGS } from "@/content/copy";

const MfTicker = memo(function MfTicker({ lang = "pt" }) {
  const items = PRACTICE_SLUGS
    .map((sg) => getPractice(lang, sg)?.label ?? "")
    .filter(Boolean)
    .map((x) => x.toUpperCase());
  const seq = [];
  for (let i = 0; i < items.length; i++) {
    seq.push(items[i], "M");
  }
  const track = seq.map((x, i) =>
    x === "M" ? (
      <span key={i} className="mf-ticker__m" aria-hidden="true">M</span>
    ) : (
      <span key={i} className="mf-ticker__it">{x}</span>
    )
  );
  return (
    <div className="mf-ticker" aria-hidden="true">
      <div className="mf-ticker__track">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <div className="mf-ticker__seq" key={n}>{track}</div>
        ))}
      </div>
      <style>{`
        .mf-ticker{
          overflow:hidden;border-top:1px solid var(--mf-rule);border-bottom:1px solid var(--mf-rule);
          padding:0.85rem 0;white-space:nowrap;user-select:none;
        }
        .mf-ticker__track{display:flex;width:max-content;animation:mf-ticker 26s linear infinite}
        .mf-ticker__seq{display:flex;align-items:center;gap:2.6rem;padding-right:2.6rem}
        .mf-ticker__it{
          font-family:var(--font-mono);font-size:var(--text-label);
          letter-spacing:var(--tracking-label);color:var(--ink,#1A1A18);
        }
        .mf-ticker__m{
          font-family:var(--font-display);font-size:1.05rem;line-height:1;
          color:var(--mf-copper,#B5502E);
        }
        @keyframes mf-ticker{to{transform:translateX(-16.6667%)}}
        .mf-ticker:hover .mf-ticker__track{animation-play-state:paused}
        @media (prefers-reduced-motion: reduce){.mf-ticker__track{animation:none}
          .mf-ticker__seq ~ .mf-ticker__seq{display:none}}
      `}</style>
    </div>
  );
});
export default MfTicker;
