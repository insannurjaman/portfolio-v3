export const INTRO_TIMING = Object.freeze({ minimum: 950, deadline: 1150, exit: 350 });

// Asset readiness can shorten the hold, but can never leave the page covered.
export function beginEditorialIntro({ ready, reduced, onReveal, onComplete }) {
  if (reduced) {
    Promise.resolve(ready).catch(() => {});
    onReveal();
    onComplete();
    return () => {};
  }
  let disposed = false, revealing = false, minimumReached = false, assetsReady = false;
  const timers = new Set();
  const later = (callback, delay) => {
    const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
    timers.add(timer);
  };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };
  const reveal = () => {
    if (disposed || revealing) return;
    revealing = true;
    clearTimers();
    onReveal();
    later(() => { if (!disposed) onComplete(); }, INTRO_TIMING.exit);
  };
  later(() => { minimumReached = true; if (assetsReady) reveal(); }, INTRO_TIMING.minimum);
  later(reveal, INTRO_TIMING.deadline);
  Promise.resolve(ready).catch(() => {}).then(() => {
    assetsReady = true;
    if (minimumReached) reveal();
  });
  return () => { disposed = true; clearTimers(); };
}
