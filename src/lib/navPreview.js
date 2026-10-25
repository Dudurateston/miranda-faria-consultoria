// Each selection owns its load. Cancellation also covers close and unmount.
export function requestNavPreview(src, load, onReady, onError = () => {}) {
  let cancelled = false;
  let pending;
  try { pending = load(src); } catch (error) { pending = Promise.reject(error); }
  Promise.resolve(pending).then(() => {
    if (!cancelled) onReady(src);
  }).catch(() => { if (!cancelled) onError(src); });
  return () => { cancelled = true; };
}
