import React, { useEffect, useRef, useState } from 'react';
import { requestNavPreview } from '@/lib/navPreview';
import { M_LOGO } from '@/lib/site';

export const servicePoster = src => src?.replace(/\.mp4$/, '_f0.webp');

function loadPoster(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (!img.naturalWidth) { reject(new Error('Empty poster')); return; }
      if (img.decode) img.decode().then(resolve, reject);
      else resolve();
    };
    img.onerror = reject;
    img.src = servicePoster(src);
  });
}

function PreviewVideo({ src, active }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (!active || document.hidden || motion.matches) el.pause();
      else el.play().catch(() => {});
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => { document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync); el.pause(); };
  }, [active]);
  return <video ref={ref} src={src} muted loop playsInline preload="metadata"
    onLoadedData={e => { if (e.currentTarget === ref.current && e.currentTarget.readyState >= 2) setReady(true); }}
    className="mf-nav__subvid" data-ready={active && ready ? 'true' : 'false'} />;
}

export default function NavServicePreview({ src, sources, labels }) {
  const [shown, setShown] = useState(null);
  // Small stills can warm up without downloading all four videos.
  useEffect(() => { sources.forEach(s => { const img = new Image(); img.src = servicePoster(s); }); }, [sources]);
  useEffect(() => {
    if (!src) return undefined;
    return requestNavPreview(src, loadPoster, setShown);
  }, [src]);
  const index = shown ? sources.indexOf(shown) : -1;
  return <>
    <span className="mf-nav__substage" data-preview-src={shown || ''} data-pending={src && src !== shown ? 'true' : 'false'}>
      {!shown && <span className="mf-nav__preview-mark" aria-hidden="true"><img src={M_LOGO} alt="" /></span>}
      {shown && <img className="mf-nav__subposter" src={servicePoster(shown)} alt="" aria-hidden="true" />}
      {shown && <PreviewVideo key={shown} src={shown} active={src === shown} />}
    </span>
    <span className="mf-nav__subcap">{index >= 0 ? `${String(index + 1).padStart(2, '0')} · ${labels[index]}` : '\u00a0'}</span>
  </>;
}
