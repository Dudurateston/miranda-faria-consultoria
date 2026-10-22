import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { adjacentImageId } from '@/lib/caseMediaViewer';

export default function CaseMediaViewer({ items, activeId, onChange, onClose, opener, lang }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const viewportRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [failed, setFailed] = useState(false);
  const titleId = useId();
  const captionId = useId();
  const images = items.filter(item => item.type === 'image');
  const index = images.findIndex(item => item.id === activeId);
  const item = images[index];
  const en = lang === 'en';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [opener]);

  useEffect(() => {
    setZoomed(false);
    setFailed(false);
    viewportRef.current?.scrollTo(0, 0);
  }, [activeId]);

  useEffect(() => {
    if (zoomed) viewportRef.current?.focus({ preventScroll: true });
  }, [zoomed]);

  if (!item) return null;

  const step = direction => onChange(adjacentImageId(items, activeId, direction));
  return createPortal(
    <dialog
      ref={dialogRef}
      className="mf-viewer"
      data-lenis-prevent
      aria-labelledby={titleId}
      aria-describedby={captionId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey || zoomed) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          step(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div className="mf-viewer__shell">
        <header className="mf-viewer__toolbar">
          <h2 id={titleId}>{en ? 'Project images' : 'Imagens do projeto'}</h2>
          <button ref={closeRef} type="button" onClick={onClose}>{en ? 'Close' : 'Fechar'} <span aria-hidden="true">×</span></button>
        </header>
        <div className={`mf-viewer__viewport${zoomed ? ' is-original' : ''}`} ref={viewportRef}
          tabIndex={zoomed ? 0 : -1} role="region" aria-label={en ? 'Image area' : 'Área da imagem'}>
          {failed ? (
            <p role="alert">{en ? 'The image could not load. Try opening the original file.' : 'Não foi possível carregar a imagem. Tente abrir o arquivo original.'}</p>
          ) : (
            <img
              key={item.id} src={item.src} alt={item.alt}
              width={item.width} height={item.height}
              style={zoomed ? { width: item.width, height: 'auto' } : undefined}
              onError={() => setFailed(true)} decoding="async"
            />
          )}
        </div>
        <footer className="mf-viewer__footer">
          <div className="mf-viewer__caption" id={captionId} aria-live="polite" aria-atomic="true">
            <p>{item.caption}</p><span>{index + 1} / {images.length}</span>
          </div>
          <div className="mf-viewer__actions">
            <div className="mf-viewer__pagination">
              <button type="button" disabled={images.length < 2} onClick={() => step(-1)}>{en ? 'Previous' : 'Anterior'}</button>
              <button type="button" disabled={images.length < 2} onClick={() => step(1)}>{en ? 'Next' : 'Próxima'}</button>
            </div>
            <button type="button" disabled={failed} aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>
              {zoomed ? (en ? 'Fit to screen' : 'Ajustar à tela') : (en ? 'Original size' : 'Tamanho original')}
            </button>
            <a href={item.src} target="_blank" rel="noopener noreferrer">{en ? 'Open original (new tab)' : 'Abrir original (nova aba)'}</a>
          </div>
        </footer>
      </div>
      <style>{viewerCss}</style>
    </dialog>, document.body,
  );
}

const viewerCss = `
.mf-viewer{position:fixed;inset:0;width:100%;height:100%;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:var(--bone,#F5F1EA);color:var(--ink,#1A1A18);overscroll-behavior:contain;font-family:var(--font-body);z-index:2147483000}
.mf-viewer::backdrop{background:rgba(26,26,24,.8)}
.mf-viewer__shell{display:flex;flex-direction:column;height:100%;min-width:0}
.mf-viewer__toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:calc(.5rem + env(safe-area-inset-top)) clamp(1rem,3vw,2.5rem) .5rem;border-bottom:1px solid var(--hairline)}
.mf-viewer__toolbar h2{font:400 clamp(1.2rem,2vw,1.7rem)/1.2 var(--font-display);margin:0}
.mf-viewer button,.mf-viewer a{font:400 .875rem/1.4 var(--font-body);color:inherit;min-height:44px;min-width:44px;padding:.6rem .8rem;background:transparent;border:1px solid var(--hairline);border-radius:var(--radius,2px);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:.6rem}
.mf-viewer button:disabled{opacity:.45;cursor:default}
.mf-viewer button:focus-visible,.mf-viewer a:focus-visible{outline:2px solid var(--copper);outline-offset:3px}
.mf-viewer button:hover:not(:disabled),.mf-viewer a:hover{border-color:currentColor}
.mf-viewer__viewport{flex:1;min-height:0;min-width:0;overflow:auto;padding:clamp(.5rem,2vw,1.5rem);display:flex;align-items:center;justify-content:center;overscroll-behavior:contain}
.mf-viewer__viewport img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;flex-shrink:0}
.mf-viewer__viewport.is-original{display:block}
.mf-viewer__viewport:focus-visible{outline:2px solid var(--copper);outline-offset:-3px}
.mf-viewer__viewport.is-original img{max-width:none;max-height:none;margin:0 auto}
.mf-viewer__footer{padding:.65rem clamp(1rem,3vw,2.5rem) calc(.75rem + env(safe-area-inset-bottom));border-top:1px solid var(--hairline);flex-shrink:0}
.mf-viewer__caption{display:flex;justify-content:space-between;gap:1rem;align-items:baseline;font-size:.875rem;line-height:1.5}
.mf-viewer__caption p{margin:0;max-width:75ch}
.mf-viewer__caption span{white-space:nowrap;font-variant-numeric:tabular-nums}
.mf-viewer__actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.65rem;align-items:center}
.mf-viewer__pagination{display:flex;gap:.4rem;margin-right:auto}
@media(max-width:560px){.mf-viewer__actions{display:grid;grid-template-columns:1fr 1fr}.mf-viewer__pagination{margin:0}.mf-viewer__pagination button{flex:1;padding:.6rem}.mf-viewer__actions>a{grid-column:1/-1;justify-content:flex-start;border:0;padding:.2rem 0;min-height:44px}.mf-viewer__caption{font-size:.8rem}.mf-viewer__toolbar{gap:.5rem}}
`;
