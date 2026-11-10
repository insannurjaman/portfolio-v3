import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import "./vendor/transitions-generation/ui-generation.css";
import "./vendor/transitions-generation/text-image-generation.css";
import "./scroll-generation.css";

import { revealViewport } from "./reveal-viewport.js";
import { collectGenerationTargets, generationViewportState } from "./scroll-generation-targets.js";

export function ScrollGeneration({ ready = true }) {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (!ready || !("IntersectionObserver" in window)) return;
    let disposed = false, failed = false, engine, engineTimer = 0, discoveryFrame = 0, scrollFrame = 0, previousY = scrollY, down = true;
    const records = new Map(), active = new Map(), pending = new Set();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const phone = () => innerWidth < 810;
    const position = (el, viewport = revealViewport()) => generationViewportState(el.getBoundingClientRect(), viewport, el.matches(".category-tile"));
    function stop(el) {
      pending.delete(el);
      clearTimeout(records.get(el)?.entryTimer);
      active.get(el)?.cancel();
      active.delete(el);
      if (records.has(el)) records.get(el).state = "done";
      if (el.isConnected) el.dataset.scrollGeneration = "done";
    }
    function drain() {
      if (!engine || disposed || reduced.matches || document.hidden) return;
      const limit = phone() ? 2 : 3;
      const viewport = revealViewport();
      for (const el of pending) {
        if (active.size >= limit) break;
        pending.delete(el);
        const record = records.get(el);
        if (!record || !el.isConnected || !position(el, viewport).ready) continue;
        if (el.contains(document.activeElement)) { stop(el); continue; }
        record.state = "drawing";
        el.dataset.scrollGeneration = "drawing";
        try {
          const reading = !!el.closest(".case-page,.article-page,.docs-main");
          const interactive = el.matches("a,button") || !!el.querySelector("a,button,input,textarea,select");
          const textReveal = el.getAttribute("data-text-reveal") || el.getAttribute("data-hero-text-reveal");
          const run = engine.generate(el, { mode: "skeleton", variant: textReveal === "headline" ? "text" : textReveal ? "small-text" : "ui", ...(textReveal ? { fadeStagger: null, fadeDelay: 50 } : {}), duration: reading ? 1400 : phone() ? 1600 : 1800, maxParts: phone() ? 24 : 36, maxDots: phone() ? 850 : 1500, keys: 0, interactive });
          active.set(el, run);
          run.finished.then(() => {
            if (active.get(el) === run) {
              active.delete(el);
              if (records.get(el) === record) record.state = "done";
              if (el.isConnected) el.dataset.scrollGeneration = "done";
            }
            if (!disposed) drain();
          });
        } catch (error) { console.warn("Generation reveal skipped", error); stop(el); }
      }
    }
    function queue(el, record) {
      if (record.entryTimer || pending.has(el)) return;
      record.entryTimer = setTimeout(() => {
        record.entryTimer = 0;
        if (disposed || record.state !== "idle" || !down || !position(el).ready) return;
        pending.add(el); drain();
      }, 120);
    }
    function disarm(el, record) {
      clearTimeout(record.entryTimer); record.entryTimer = 0; pending.delete(el);
    }
    function scan() {
      const viewport = revealViewport();
      if (viewport.blocked) {
        cancelAll();
        records.forEach((record, el) => disarm(el, record));
        return;
      }
      // Reconcile on every scroll: IO need not fire again when a tall card moves
      // from a sliver at the edge to a useful amount of visible artwork.
      for (const [el, record] of records) {
        const view = position(el, viewport);
        if (!view.visible) {
          disarm(el, record);
          if (view.above || active.has(el) || pending.has(el)) stop(el);
        } else if (record.state === "idle") {
          // A completed or interrupted entrance stays done for this page visit.
          // Returning above it never rearms the effect.
          if (view.ready) {
            if (down) queue(el, record);
            else stop(el); // Fast jumps must not leave unseen content blank on return.
          } else disarm(el, record);
        }
      }
      drain();
    }
    const observer = new IntersectionObserver(scan, { rootMargin: "0px", threshold: 0 });
    function discover() {
      discoveryFrame = 0;
      if (disposed || failed || reduced.matches) return;
      for (const [el] of records) if (!el.isConnected) { stop(el); observer.unobserve(el); records.delete(el); }
      for (const el of collectGenerationTargets()) {
        if (records.has(el) || [...records.keys()].some(existing => existing.contains(el) || el.contains(existing))) continue;
        records.set(el, { state: "idle" });
        el.dataset.scrollGeneration = "idle";
        observer.observe(el);
      }
      scan();
    }
    function scheduleDiscovery() {
      if (!discoveryFrame) discoveryFrame = requestAnimationFrame(discover);
    }
    function scroll() {
      down = window.scrollY >= previousY;
      previousY = window.scrollY;
      if (!scrollFrame) scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        scan();
      });
    }
    function interrupt(event) {
      for (const [el, record] of records) {
        if (record.state === "done") continue;
        const box = el.getBoundingClientRect();
        const pointInside = event.type === "pointerdown" && event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
        if (pointInside || event.target instanceof Node && el.contains(event.target)) stop(el);
      }
    }
    function cancelAll() {
      [...new Set([...active.keys(), ...pending])].forEach(stop);
    }
    function revealAll() {
      records.forEach((_, el) => stop(el));
    }
    function preference() {
      if (reduced.matches) revealAll();
      else loadEngine();
    }
    function visibility() { if (document.hidden) cancelAll(); else drain(); }
    const mutations = new MutationObserver(scheduleDiscovery);
    document.querySelectorAll("main,.editorial-footer").forEach(el => mutations.observe(el, { childList: true, subtree: true }));
    mutations.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["open"] });
    // Registration conceals hero text under the intro; its removal, rather than
    // the earlier asset-ready callback, starts the visible entrance.
    const intro = document.querySelector(".editorial-intro");
    if (intro?.parentElement) mutations.observe(intro.parentElement, { childList: true });
    document.addEventListener("focusin", interrupt, true);
    document.addEventListener("pointerdown", interrupt, true);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", cancelAll, { passive: true });
    reduced.addEventListener("change", preference);
    function loadEngine() {
      if (failed || engine) return;
      engineTimer = setTimeout(() => { failed = true; revealAll(); }, 3000);
      Promise.all([document.fonts.ready, import("./vendor/transitions-generation/ui-generation.js")]).then(([, module]) => {
        clearTimeout(engineTimer);
        if (disposed || failed) return;
        engine = module;
        discover();
        scan();
      }).catch(() => { clearTimeout(engineTimer); failed = true; revealAll(); });
    }
    if (!reduced.matches) {
      // Register and conceal before paint, independently of the lazy engine.
      discover();
      loadEngine();
    }
    return () => {
      disposed = true;
      observer.disconnect(); mutations.disconnect();
      cancelAnimationFrame(discoveryFrame);
      cancelAnimationFrame(scrollFrame);
      clearTimeout(engineTimer);
      cancelAll();
      records.forEach((record, el) => { clearTimeout(record.entryTimer); delete el.dataset.scrollGeneration; });
      document.removeEventListener("focusin", interrupt, true);
      document.removeEventListener("pointerdown", interrupt, true);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", cancelAll);
      reduced.removeEventListener("change", preference);
    };
  }, [pathname, ready]);
  return null;
}
