import { revealExposure } from "./reveal-viewport.js";

const ATOMIC = ".category-tile,.case-card,.industry-tile,.article-card,figure,.case-cover,.editorial-project-art,.editorial-project-caption,.editorial-film-player,.type-composition-line,.collage-statements,.recommendations-list,.capability-index>div";
const SKIP = "nav:not([data-scroll-generation-contents]),aside,details,dialog,button,input,textarea,select,script,style,svg,[data-scroll-generation-skip],.sr-only,.hero-motion-control,.hero-halftone,.collage-pictures,.case-contents,.case-toc,.content-status";

// Choose non-overlapping, meaningful blocks. Large sections split at their existing
// layout boundaries; source images remain whole and body prose remains readable.
export function collectGenerationTargets(root = document) {
  const targets = [];
  function visit(el) {
    if (el.matches("[data-thumbnail-generation]")) return;
    if (el.matches(SKIP) || el.hidden) return;
    const css = getComputedStyle(el), box = el.getBoundingClientRect();
    if (css.display === "none" || css.visibility === "hidden" || box.width < 65 || box.height < 24) return;
    if (el.matches("[data-scroll-generation-contents]")) {
      [...el.children].forEach(visit);
      return;
    }
    if (el.matches(".editorial-hero")) {
      const copy = el.querySelector(".editorial-hero-copy");
      if (copy) copy.querySelectorAll("[data-hero-text-reveal]").forEach(visit);
      return;
    }
    if (el.matches(".footer-banner")) {
      const copy = el.querySelector(".footer-invitation");
      if (copy) targets.push(copy);
      return;
    }
    if (el.matches(".expertise-collage")) {
      const copy = el.querySelector(".collage-statements");
      if (copy) targets.push(copy);
      return;
    }
    if (css.position === "fixed" || css.position === "sticky") return;
    if (el.tagName === "P" && el.closest(".case-story,.prose,.docs-main")) return;
    // Thumbnail canvases own their entrance; never hide them in a second reveal.
    if (el.querySelector("[data-thumbnail-generation]")) {
      if (!el.matches(".category-tile")) [...el.children].forEach(visit);
      return;
    }
    const atomic = el.matches(ATOMIC);
    // Always animate the four category cards separately, even on tall viewports.
    if (!atomic && el.querySelector(".category-tile")) { [...el.children].forEach(visit); return; }
    const bounded = box.height <= Math.min(innerHeight * .85, 720);
    if (atomic || bounded || !el.children.length) { targets.push(el); return; }
    [...el.children].forEach(visit);
  }
  root.querySelectorAll("main:not(.content-status),.editorial-footer").forEach(container => [...container.children].forEach(visit));
  return targets;
}

// Use layout geometry, unaffected by the runtime's opacity/reveal mask.
export function generationViewportState(box, viewport, category = false) {
  return revealExposure(box, viewport, category ? 'category' : 'content');
}
