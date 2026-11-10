import React, { useEffect, useRef, useState } from "react";
import { animateFeedback, EDITORIAL_EASE } from "./motion-feedback.js";
import { ChevronDown } from "lucide-react";
import { caseReadingPosition } from "./case-reading-position.js";
import "./case-chapter-navigation.css";

export function CaseChapterNavigation({ chapters }) {
  const root = useRef(null);
  const list = useRef(null);
  const toggle = useRef(null);
  const marker = useRef(null), track = useRef(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const chapterKey = chapters.map(chapter => chapter.id).join("|");

  useEffect(() => {
    const node = root.current;
    const article = node.closest(".case-story")?.querySelector("article");
    const headings = chapterKey.split("|").map(id => document.getElementById(id));
    if (!article || headings.some(heading => !heading)) return;
    let frame = null;
    let offsets = [];
    let bottom = 0;
    let needsMeasure = true;
    let disposed = false;
    function update() {
      frame = null;
      const scrollY = window.scrollY;
      if (needsMeasure) {
        offsets = headings.map(heading => heading.getBoundingClientRect().top + scrollY);
        bottom = article.getBoundingClientRect().bottom + scrollY;
        needsMeasure = false;
      }
      const headerBottom = document.querySelector(".editorial-header")?.getBoundingClientRect().bottom || 82;
      const readingLine = headerBottom + (window.innerWidth <= 900 ? 96 : 64);
      const position = caseReadingPosition({ offsets, scrollY, readingLine, bottom, viewportHeight: window.innerHeight });
      node.style.setProperty("--reading-progress", position.progress);
      node.style.setProperty("--chapter-progress", headings.length > 1 ? position.active / (headings.length - 1) : 1);
      node.style.setProperty("--chapter-offset", `${position.active * 44}px`);
      setActive(previous => previous === position.active ? previous : position.active);
    }
    function schedule() {
      if (!disposed && frame === null) frame = requestAnimationFrame(update);
    }
    function measure() { needsMeasure = true; schedule(); }
    const observer = new ResizeObserver(measure);
    observer.observe(article);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    update();
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [chapterKey]);


  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = [[marker.current, `translateY(${active * 44}px)`], [track.current, `scaleY(${chapters.length > 1 ? active / (chapters.length - 1) : 1})`]];
    let controls = [];
    function settle() {
      controls.forEach(control => control?.cancel());
      targets.forEach(([element, transform]) => { element.style.transform = transform; });
    }
    if (preference.matches) settle();
    else controls = targets.map(([element, transform]) => animateFeedback(element, { transform }, { duration: 0.26, ease: EDITORIAL_EASE }));
    const change = () => { if (preference.matches) settle(); };
    preference.addEventListener("change", change);
    return () => { controls.forEach(control => control?.stop()); preference.removeEventListener("change", change); };
  }, [active, chapterKey, chapters.length]);

  useEffect(() => {
    const panel = list.current;
    const link = panel?.querySelector('[aria-current="location"]');
    if (!panel || !link) return;
    // Keep the active chapter visible inside a short viewport, without moving the page.
    if (link.offsetTop < panel.scrollTop) panel.scrollTop = link.offsetTop;
    else if (link.offsetTop + link.offsetHeight > panel.scrollTop + panel.clientHeight) {
      panel.scrollTop = link.offsetTop + link.offsetHeight - panel.clientHeight;
    }
  }, [active, open]);

  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      else if (event.type === "pointerdown" && !root.current?.contains(event.target)) setOpen(false);
    }
    function resize() { if (window.innerWidth > 900) setOpen(false); }
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", dismiss);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  const position = `${String(active + 1).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
  return <aside ref={root} className={`case-chapter-nav${open ? " is-open" : ""}`}>
    <div className="case-chapter-heading"><span>On this page</span><span className="case-chapter-count" aria-label={`Chapter ${active + 1} of ${chapters.length}`}>{position}</span></div>
    <button ref={toggle} className="case-chapter-toggle" type="button" aria-expanded={open} aria-controls="case-chapter-links" onClick={() => setOpen(value => !value)}>
      <span><span className="case-chapter-mobile-label">On this page</span><span className="case-chapter-mobile-title">{chapters[active]?.title}</span></span>
      <span className="case-chapter-toggle-end"><span className="case-chapter-count">{position}</span><ChevronDown size={18} aria-hidden="true"/></span>
    </button>
    <nav id="case-chapter-links" className="case-chapter-links" ref={list} aria-label="Case study chapters">
      <div className="case-chapter-track" aria-hidden="true"><span ref={track} style={{ transform: "scaleY(0)" }}/></div>
      <div className="case-chapter-marker" ref={marker} style={{ transform: "translateY(0px)" }} aria-hidden="true"/>
      {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === index ? "location" : undefined} data-read={index < active ? "true" : undefined} onClick={() => {
        if (open) { setOpen(false); toggle.current?.focus({ preventScroll: true }); }
      }}><span className="case-chapter-dot" aria-hidden="true"/><span>{chapter.title}</span></a>)}
    </nav>
    <div className="case-chapter-mobile-progress" aria-hidden="true"><span/></div>
  </aside>;
}
