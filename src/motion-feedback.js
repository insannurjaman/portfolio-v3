import { animate } from "motion/mini";

export const EDITORIAL_EASE = [0.16, 1, 0.3, 1];

// Hidden mobile chapter lists have no native animation target. Also guard
// commitStyles(): a route/resize can remove a target before Motion stops it.
export function animateFeedback(element, keyframes, options, start = animate) {
  function applyFinal() {
    for (const [key, value] of Object.entries(keyframes)) element.style[key] = Array.isArray(value) ? value.at(-1) : value;
  }
  if (element.getClientRects?.().length === 0) { applyFinal(); return null; }
  try {
    const control = start(element, keyframes, options);
    const cancel = () => { try { control.cancel(); } catch { /* Removed targets need no paint cleanup. */ } };
    return {
      cancel,
      stop() { try { control.stop(); } catch { cancel(); } },
    };
  } catch { applyFinal(); return null; }
}
