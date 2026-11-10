import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const text = "h1,h2,h3,h4,h5,h6,p,li,dt,dd,figcaption";
const excluded = "nav,aside,dialog,button,summary,[role='tablist'],[role='status'],[aria-live],[aria-hidden='true'],.sr-only,.content-status";
const nestedContent = `${text},img,picture,svg,video,canvas,iframe,button,input,select,textarea`;

function visitText(node, visit) {
  if (!(node instanceof Element)) return;
  if (node.matches(text)) visit(node);
  node.querySelectorAll(text).forEach(visit);
}

export function TextEntrance() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const root = document.getElementById("root");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const completed = new WeakSet();
    const running = new Map();
    const focusedContent = () => document.activeElement?.closest("a,button") || document.activeElement;
    const cancel = element => {
      running.get(element)?.cancel();
      running.delete(element);
    };

    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting, intersectionRatio } of entries) {
        if (!isIntersecting || intersectionRatio === 0 || completed.has(target) || !target.isConnected) continue;
        observer.unobserve(target);
        completed.add(target);

        const focus = focusedContent();
        if (reduced.matches || target.contains(focus) || (focus !== document.body && focus?.contains(target))) continue;

        const animation = target.animate([
          { opacity: 0, translate: "0 12px" },
          { opacity: getComputedStyle(target).opacity, translate: "0 0" },
        ], { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
        running.set(target, animation);
        animation.addEventListener("finish", () => running.delete(target), { once: true });
      }
    });

    const observe = element => {
      if (!completed.has(element) && element.closest("main,footer") && !element.closest(excluded) &&
          !element.querySelector(nestedContent) && element.textContent.trim()) observer.observe(element);
    };
    const changes = new MutationObserver(records => {
      for (const { removedNodes } of records) {
        for (const node of removedNodes) visitText(node, element => {
          observer.unobserve(element);
          cancel(element);
        });
      }
      for (const { addedNodes } of records) {
        for (const node of addedNodes) visitText(node, observe);
      }
    });

    function showFocusedText(event) {
      const focus = event.target.closest("a,button") || event.target;
      for (const element of running.keys()) {
        if (element.contains(focus) || focus.contains(element)) cancel(element);
      }
    }
    function updateMotionPreference() {
      if (reduced.matches) running.forEach((_, element) => cancel(element));
    }

    visitText(root, observe);
    changes.observe(root, { childList: true, subtree: true });
    root.addEventListener("focusin", showFocusedText);
    reduced.addEventListener("change", updateMotionPreference);

    return () => {
      observer.disconnect();
      changes.disconnect();
      running.forEach((_, element) => cancel(element));
      root.removeEventListener("focusin", showFocusedText);
      reduced.removeEventListener("change", updateMotionPreference);
    };
  }, [pathname]);

  return null;
}
