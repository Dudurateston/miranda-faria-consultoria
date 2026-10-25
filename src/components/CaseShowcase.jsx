import React, { useCallback, useEffect, useRef, useState } from 'react';
import CaseMediaViewer from '@/components/CaseMediaViewer';

function CaseShot({ item, lang, priority, onOpen }) {
  const [failed, setFailed] = useState(false);
  const en = lang === 'en';
  return (
    <figure className="mf-cs__figure" data-media-id={item.id} style={{ '--shot-width': `${item.displayWidth || item.width}px` }}>
      {failed ? (
        <p className="mf-cs__error" role="status">
          {en ? 'The image could not load.' : 'Não foi possível carregar a imagem.'}{' '}
          <a href={item.src} target="_blank" rel="noopener noreferrer">{en ? 'Open original (new tab)' : 'Abrir original (nova aba)'}</a>
        </p>
      ) : (
        <button className="mf-cs__image-button" type="button" aria-haspopup="dialog"
          aria-label={`${en ? 'Enlarge image' : 'Ampliar imagem'}: ${item.caption}`}
          onClick={event => onOpen(item.id, event.currentTarget)}>
          <img src={item.src} width={item.width} height={item.height}
            alt={item.alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
            onError={() => setFailed(true)} />
          <span className="mf-cs__enlarge">{en ? 'Enlarge image' : 'Ampliar imagem'} <span aria-hidden="true">↗</span></span>
        </button>
      )}
      <figcaption>{item.caption}</figcaption>
    </figure>
  );
}

function CaseVideo({ item, lang, blocked }) {
  const videoRef = useRef(null);
  const visibleRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const en = lang === 'en';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting && entry.intersectionRatio >= .15;
      if (!visibleRef.current) video.pause();
    }, { threshold: [0, .15] });
    const onVisibility = () => { if (document.hidden) video.pause(); };
    observer.observe(video);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      video.pause();
    };
  }, [item.src, failed]);

  useEffect(() => { if (blocked) videoRef.current?.pause(); }, [blocked]);

  return (
    <figure className="mf-cs__figure mf-cs__video" data-media-id={item.id} style={{ '--shot-width': `${item.width}px` }}>
      {failed ? (
        <div>
          <img src={item.poster} width={item.width} height={item.height} alt={item.alt} loading="lazy" />
          <p className="mf-cs__error" role="status">{en ? 'The video could not load. The still image is shown above.' : 'Não foi possível carregar o vídeo. O quadro de apresentação aparece acima.'}</p>
        </div>
      ) : (
        <video ref={videoRef} src={item.src} poster={item.poster} width={item.width} height={item.height}
          style={{ aspectRatio: `${item.width} / ${item.height}` }}
          controls muted playsInline preload="none" aria-label={item.alt}
          onError={() => setFailed(true)}
          onPlay={() => { if (blocked || document.hidden || !visibleRef.current) videoRef.current?.pause(); }}>
          {en ? 'Your browser cannot play this video.' : 'Seu navegador não reproduz este vídeo.'}
        </video>
      )}
      <figcaption><span>{item.caption}</span><span>{en ? 'Play, pause and fullscreen in the player.' : 'Reproduzir, pausar e tela cheia no player.'}</span></figcaption>
    </figure>
  );
}

function StorySection({ section, item, labels, editorial }) {
  return (
    <section className="mf-cs__story">
      <h2 className={editorial ? 'mf-cs__story-title' : 'mf-label'}>{labels[section]}</h2>
      <p>{item[section]}</p>
    </section>
  );
}

export default function CaseShowcase({ presentation, item, labels, lang }) {
  const [activeId, setActiveId] = useState(null);
  const openerRef = useRef(null);
  const storyLabels = presentation.headings || labels;
  const closeViewer = useCallback(() => setActiveId(null), []);
  const mediaById = new Map(presentation.media.map(media => [media.id, media]));
  const openViewer = (id, opener) => { openerRef.current = opener; setActiveId(id); };
  const renderMedia = (id, priority = false) => {
    const media = mediaById.get(id);
    if (!media) return null;
    return media.type === 'video'
      ? <CaseVideo key={id} item={media} lang={lang} blocked={activeId !== null} />
      : <CaseShot key={id} item={media} lang={lang} priority={priority} onOpen={openViewer} />;
  };

  return (
    <div className={`mf-cs mf-cs--${presentation.leadMode}${presentation.editorial ? ' mf-cs--editorial' : ''}`}>
      <div className="mf-cs__lead" data-depth="0.08">
        {renderMedia(presentation.leadMedia, true)}
        <StorySection section="problem" item={item} labels={storyLabels} editorial={presentation.editorial} />
      </div>
      <p className="mf-cs__language">{lang === 'en' ? 'Project media is in Portuguese.' : 'Interfaces e peças em português.'}</p>
      {presentation.chapters.map(chapter => (
        <div className={`mf-cs__chapter mf-cs__chapter--${chapter.layout}`} key={chapter.id} data-depth="0.28">
          {chapter.title && <h2 className="mf-cs__chapter-title">{chapter.title}</h2>}
          {chapter.sections.length > 0 && <div className="mf-cs__stories">
            {chapter.sections.map(section => <StorySection key={section} section={section} item={item} labels={storyLabels} editorial={presentation.editorial} />)}
          </div>}
          {chapter.media.length > 0 && <div className="mf-cs__media-group">{chapter.media.map(id => renderMedia(id))}</div>}
        </div>
      ))}
      {presentation.social && <aside className="mf-cs__social">
        <p>{presentation.social.credit}</p>
        <a href={presentation.social.href} target="_blank" rel="noopener noreferrer">
          {presentation.social.label} <span>({lang === 'en' ? 'new tab' : 'nova aba'})</span>
        </a>
      </aside>}
      {activeId && <CaseMediaViewer items={presentation.media} activeId={activeId} lang={lang}
        opener={openerRef.current} onChange={setActiveId} onClose={closeViewer} />}
      <style>{showcaseCss}</style>
    </div>
  );
}

const showcaseCss = `
.mf-cs{max-width:var(--max-width-page);margin:0 auto;min-width:0}
.mf-cs__figure{margin:0;min-width:0;width:100%;max-width:var(--shot-width,100%)}
.mf-cs__image-button{display:block;width:100%;padding:0;border:0;background:transparent;color:inherit;text-align:left;cursor:zoom-in;font:inherit}
.mf-cs__image-button img,.mf-cs__video img,.mf-cs__video video{display:block;width:100%;height:auto;max-width:100%;border:0;object-fit:contain}
.mf-cs__image-button:focus-visible{outline:2px solid var(--color-accent);outline-offset:6px}
.mf-cs__enlarge{display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:44px;font:400 .8125rem/1.5 var(--font-body);text-decoration:underline;text-underline-offset:.25em}
.mf-cs figcaption{font:400 .875rem/1.65 var(--font-body);color:var(--color-text-secondary);max-width:75ch;margin-top:.25rem}
.mf-cs__video figcaption{display:flex;justify-content:space-between;gap:.5rem 2rem;max-width:none;flex-wrap:wrap;margin-top:1rem}
.mf-cs__story{min-width:0}
.mf-cs__story h2{margin:0 0 1.15rem;font-weight:400}
.mf-cs__story-title,.mf-cs__chapter-title{font:400 clamp(1.8rem,3.5vw,3.25rem)/1.12 var(--font-display);letter-spacing:var(--tracking-display);color:var(--color-text-primary)}
.mf-cs__chapter-title{margin:0 0 clamp(1.5rem,4vw,3rem)}
.mf-cs--editorial .mf-cs__lead>.mf-cs__story{margin-top:clamp(3rem,7vw,6rem)}
.mf-cs__chapter--mobile .mf-cs__figure,.mf-cs__chapter--mobile-left .mf-cs__figure{max-width:min(100%,390px)}
.mf-cs__story p{margin:0;max-width:56ch;font:300 var(--text-body-lg)/var(--leading-body) var(--font-body);color:var(--color-text-primary);overflow-wrap:anywhere}
.mf-cs__lead>.mf-cs__story{margin:clamp(2rem,6vw,5rem) 0 0 auto;max-width:56ch}
.mf-cs__language{font:400 .8125rem/1.6 var(--font-body);color:var(--color-text-secondary);margin:1.5rem 0 0}
.mf-cs__chapter{margin-top:clamp(3.5rem,8vw,7rem);padding-top:clamp(2rem,4vw,3.5rem);border-top:1px solid var(--color-divider);min-width:0}
.mf-cs__stories{display:grid;gap:2.5rem;margin-bottom:clamp(1.5rem,4vw,3rem);min-width:0}
.mf-cs__media-group{min-width:0;display:grid;justify-items:center;gap:clamp(2rem,5vw,4rem)}
.mf-cs__chapter--text .mf-cs__stories{margin:0 0 0 auto;max-width:56ch}
.mf-cs__error{padding:2rem;border:1px solid var(--color-divider);font:400 .9375rem/1.65 var(--font-body)}
.mf-cs__error a{color:inherit;text-underline-offset:.25em;min-height:44px;display:inline-flex;align-items:center}
.mf-cs__social{margin-top:clamp(2rem,5vw,4rem);padding:1.5rem 0;border-top:1px solid var(--color-divider);font:400 .9375rem/1.7 var(--font-body)}
.mf-cs__social p{margin:0;color:var(--color-text-secondary)}
.mf-cs__social a{display:inline-flex;align-items:center;flex-wrap:wrap;gap:.35rem;min-height:44px;padding:.5rem 0;color:var(--color-text-primary);text-underline-offset:.25em}
.mf-cs__social a:focus-visible{outline:2px solid var(--color-accent);outline-offset:4px}
.mf-cs__social a span{font-size:.8125rem}
@media(min-width:900px){
  .mf-cs__chapter--mobile,.mf-cs__chapter--mobile-left{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:clamp(3rem,8vw,8rem)}
  .mf-cs__chapter--mobile .mf-cs__stories,.mf-cs__chapter--mobile-left .mf-cs__stories{margin:0;gap:clamp(2.5rem,5vw,5rem)}
  .mf-cs__chapter--mobile-left .mf-cs__media-group{grid-column:1;grid-row:1}
  .mf-cs__chapter--mobile-left .mf-cs__stories{grid-column:2;grid-row:1}
  .mf-cs--identity .mf-cs__lead{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);align-items:center;gap:clamp(2.5rem,6vw,6rem)}
  .mf-cs--identity .mf-cs__lead>.mf-cs__figure{grid-column:2;grid-row:1}
  .mf-cs--identity .mf-cs__lead>.mf-cs__story{grid-column:1;grid-row:1;margin:0}
  .mf-cs__chapter--split{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.65fr);gap:clamp(2rem,4vw,4rem);align-items:center}
  .mf-cs__chapter--split .mf-cs__stories{margin:0}
  .mf-cs__chapter--wide .mf-cs__stories:has(>.mf-cs__story:nth-child(2)){grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(2rem,6vw,6rem)}
  .mf-cs__chapter--pair .mf-cs__media-group{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}
  .mf-cs__chapter--pair .mf-cs__figure:nth-child(even){margin-top:3rem}
  .mf-cs__chapter--portraits .mf-cs__media-group{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:start;max-width:900px;margin:0 auto}
  .mf-cs__chapter--portraits .mf-cs__figure:nth-child(2){margin-top:clamp(3rem,8vw,7rem)}
}
@media(max-width:899px){
  .mf-cs--identity .mf-cs__lead>.mf-cs__figure{max-width:min(100%,560px);margin:0 auto}
  .mf-cs__chapter--portraits .mf-cs__media-group{gap:2.75rem}
}
`;
