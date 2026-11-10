// Run during the route's layout effect, before the reveal controllers register.
// A deferred top reset lets the new page inherit the old page's scroll geometry
// and incorrectly consumes its first entrances as already above the viewport.
export function resetRouteScroll(hash, { root = document, view = window, requestFrame = requestAnimationFrame, cancelFrame = cancelAnimationFrame } = {}) {
  let cancelled = false, frame;
  const position = () => {
    const anchor = hash && root.getElementById(hash.slice(1));
    if (anchor) anchor.scrollIntoView({ block: "start", behavior: "instant" });
    else view.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  position();
  // Hash destinations may shift as fonts finish loading. The initial position
  // is already correct for reveal registration; this only refines alignment.
  if (hash) Promise.resolve(root.fonts?.ready).then(() => {
    if (!cancelled) frame = requestFrame(position);
  });
  return () => { cancelled = true; if (frame !== undefined) cancelFrame(frame); };
}
