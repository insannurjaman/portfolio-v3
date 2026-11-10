import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { caseReadingPosition } from "./case-reading-position.js";
import "./case-chapter-navigation.css";

export function CaseChapterNavigation({ chapters }) {
  const root = useRef(null);
  const list = useRef(null);
  const toggle = useRef(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const chapterKey = chapters.map(chapter => chapter.id).join("|");

  useEffect(() => {
    const node = root.current;
    const article = node.closest(".case-page")?.querySelector(".case-story > article");
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
      const headerBottom = document.querySelector(".portfolio-header")?.getBoundingClientRect().bottom || 64;
      const readingLine = headerBottom + 64 + (toggle.current?.offsetHeight || 0);
      const position = caseReadingPosition({ offsets, scrollY, readingLine, bottom, viewportHeight: window.innerHeight });
      node.style.setProperty("--reading-progress", position.progress);
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
    function resize() { if (!toggle.current?.offsetHeight) setOpen(false); }
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
      {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} title={chapter.title} aria-current={active === index ? "location" : undefined} onClick={() => {
        if (open) { setOpen(false); toggle.current?.focus({ preventScroll: true }); }
      }}><span className="case-chapter-tick" aria-hidden="true"/><span className="case-chapter-label">{chapter.title}</span></a>)}
    </nav>
    <div className="case-chapter-mobile-progress" aria-hidden="true"><span/></div>
  </aside>;
}
