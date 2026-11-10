import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { revealViewport, revealExposure } from './reveal-viewport.js';
import { animateThumbnail } from './thumbnail-dissolve.js';
import './thumbnail-generation.css';

export function ThumbnailGeneration({ ready = true }) {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (!ready || !('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const records = new Map(), completedSources = new Set();
    let disposed = false, tick = 0;
    const phase = (el, value) => { el.dataset.thumbnailPhase = value; };
    const complete = record => {
      if (record.done) return;
      record.done = true;
      completedSources.add(record.source);
      clearTimeout(record.timer); clearTimeout(record.entryTimer);
      record.run?.cancel();
      record.run = null;
      phase(record.el, 'done');
      schedule();
    };
    function schedule() {
      if (!disposed && !tick) tick = requestAnimationFrame(scan);
    }
    function scan() {
      tick = 0;
      if (disposed) return;
      let active = [...records.values()].filter(record => record.run).length;
      const intro = document.querySelector('.editorial-intro');
      const viewport = revealViewport();
      const disarm = record => { clearTimeout(record.entryTimer); record.entryTimer = 0; record.enteredAt = null; };
      for (const record of records.values()) {
        const { el, image } = record;
        if (!el.isConnected) { complete(record); continue; }
        if (record.done) continue;
        if (el.closest('details:not([open]),[hidden]')) {
          disarm(record);
          if (record.run) { complete(record); active--; }
          continue;
        }
        const box = el.getBoundingClientRect();
        const view = revealExposure(box, viewport, 'image');
        const visible = view.visible;
        if (!box.width || !box.height) { disarm(record); if (record.run) { complete(record); active--; } continue; }
        if (document.hidden || viewport.blocked) { disarm(record); if (record.run) { complete(record); active--; } continue; }
        if (reduced.matches || view.above || el.contains(document.activeElement)) { complete(record); continue; }
        if (record.run) {
          if (!visible) { complete(record); active--; }
          continue;
        }
        if (intro || !view.ready) { disarm(record); continue; }
        if (record.enteredAt == null) {
          record.enteredAt = performance.now();
          record.entryTimer = setTimeout(schedule, 130);
          continue;
        }
        if (performance.now() - record.enteredAt < 120) continue;
        if (image.complete && !image.naturalWidth) { complete(record); continue; }
        if (!image.complete) {
          phase(el, 'waiting');
          // A late image uses the native loading/fallback path, never a locked overlay.
          record.timer ||= setTimeout(() => complete(record), 2500);
          continue;
        }
        if (active >= (innerWidth < 810 ? 2 : 3)) continue;
        clearTimeout(record.timer);
        phase(el, 'forming');
        const run = animateThumbnail(el, image, { duration: innerWidth < 810 ? 1000 : 1250, onFinish: () => complete(record) });
        if (!record.done) { record.run = run; active++; }
      }
    }
    const observer = new IntersectionObserver(schedule, { rootMargin: '0px', threshold: [0, .25, .5] });
    function discover() {
      if (disposed) return;
      for (const [el, record] of records) {
        if (!el.isConnected || el.querySelector('[data-thumbnail-source],img') !== record.image || record.image.getAttribute('src') !== record.source) {
          complete(record); observer.unobserve(el); records.delete(el);
        }
      }
      document.querySelectorAll('main [data-thumbnail-generation]').forEach(el => {
        if (records.has(el)) return;
        const image = el.querySelector('[data-thumbnail-source],img');
        if (!image) return;
        const record = { el, image, source: image.getAttribute('src'), done: false, run: null, timer: 0 };
        records.set(el, record);
        record.done = reduced.matches || completedSources.has(record.source);
        phase(el, record.done ? 'done' : 'idle');
        observer.observe(el);
      });
      schedule();
    }
    const mutations = new MutationObserver(changes => {
      const relevant = node => node.nodeType === 1 && (node.matches('[data-thumbnail-generation],.editorial-intro,img') || node.querySelector('[data-thumbnail-generation],.editorial-intro'));
      if (changes.some(change => change.type === 'attributes' || [...change.addedNodes, ...change.removedNodes].some(relevant))) discover();
    });
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'open'] });
    const intent = event => {
      for (const record of records.values()) {
        if (!record.done && (record.el.contains(event.target) || record.el.closest('a')?.contains(event.target))) complete(record);
      }
    };
    const media = event => {
      for (const record of records.values()) if (record.image === event.target && event.type === 'error') complete(record);
      schedule();
    };
    const resize = () => { for (const record of records.values()) if (record.run) complete(record); schedule(); };
    document.addEventListener('load', media, true);
    document.addEventListener('error', media, true);
    document.addEventListener('focusin', intent, true);
    document.addEventListener('pointerdown', intent, true);
    document.addEventListener('visibilitychange', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    reduced.addEventListener('change', schedule);
    discover();
    return () => {
      disposed = true;
      observer.disconnect(); mutations.disconnect(); cancelAnimationFrame(tick);
      for (const record of records.values()) { complete(record); delete record.el.dataset.thumbnailPhase; }
      document.removeEventListener('load', media, true);
      document.removeEventListener('error', media, true);
      document.removeEventListener('focusin', intent, true);
      document.removeEventListener('pointerdown', intent, true);
      document.removeEventListener('visibilitychange', schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      reduced.removeEventListener('change', schedule);
    };
  }, [pathname, ready]);
  return null;
}
