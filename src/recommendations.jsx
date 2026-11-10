import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import content from "./recommendations-content.json";
import "./recommendations.css";

const dateFormat = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function Recommendation({ item, index, count, expanded, onToggle }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  return <li className="recommendation-entry" aria-label={`${index + 1} of ${count}: ${item.name}`}>
    <blockquote className="recommendation-excerpt"><p>“{item.excerpt}{item.excerptIncomplete ? "…" : ""}”</p></blockquote>
    <details className="recommendation-full" open={expanded} onToggle={event => onToggle(item.id, event.currentTarget.open)}>
      <summary><span className="recommendation-read">Read full recommendation</span><span className="recommendation-close">Close full recommendation</span><span className="sr-only"> from {item.name}</span></summary>
      <div className="recommendation-full-content" tabIndex={0} aria-label={`Full recommendation from ${item.name}`}>
        <blockquote>{item.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</blockquote>
        <p className="recommendation-provenance">LinkedIn recommendation · <time dateTime={item.date}>{dateFormat.format(new Date(`${item.date}T12:00:00Z`))}</time></p>
        <p className="recommendation-profile-role">Profile title in supplied source: {item.role}</p>
      </div>
    </details>
    <div className="recommendation-author">
      <span className="recommendation-initials" aria-hidden="true">{item.initials}{item.photo && !photoFailed && <img src={item.photo} alt="" width="100" height="100" loading="lazy" decoding="async" onError={() => setPhotoFailed(true)}/>}</span>
      <div><h3>{item.name}</h3><p>{item.roleLabel}</p><p>{item.relationship}</p></div>
    </div>
  </li>;
}

export function Recommendations({ compact = false, interactive = true }) {
  const items = content.recommendations;
  const titleId = compact ? "home-testimonials-title" : "recommendations-title";
  const railRef = useRef(null);
  const [expanded, setExpanded] = useState(null);
  const [range, setRange] = useState({ first: 1, last: 3, previous: false, next: true });
  useEffect(() => {
    const rail = railRef.current;
    if (!interactive || !rail) return;
    let frame = 0;
    const measure = () => {
      const bounds = rail.getBoundingClientRect();
      const visible = [...rail.children].map((card, index) => ({ index, bounds: card.getBoundingClientRect() })).filter(card => card.bounds.right > bounds.left + 4 && card.bounds.left < bounds.right - 4);
      const next = { first: (visible[0]?.index ?? 0) + 1, last: (visible.at(-1)?.index ?? 0) + 1, previous: rail.scrollLeft > 4, next: rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 4 };
      setRange(current => Object.keys(next).every(key => current[key] === next[key]) ? current : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    rail.addEventListener("scroll", schedule, { passive: true });
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    observer?.observe(rail);
    window.addEventListener("resize", schedule);
    measure();
    return () => { rail.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); observer?.disconnect(); cancelAnimationFrame(frame); };
  }, [interactive, items.length]);
  const move = direction => {
    const rail = railRef.current;
    if (!rail?.firstElementChild) return;
    const step = rail.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || "0");
    rail.scrollBy({ left: direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const onKeyDown = event => {
    if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") move(event.key === "ArrowRight" ? 1 : -1);
    else railRef.current?.scrollTo({ left: event.key === "Home" ? 0 : railRef.current.scrollWidth, behavior: "instant" });
  };
  const onToggle = (id, isOpen) => setExpanded(current => isOpen ? id : current === id ? null : current);
  return <section className={`recommendations ${compact ? "home-testimonials" : "section-pad"}`} id="recommendations" aria-labelledby={titleId}>
    <div className="recommendations-header">
      <div className="recommendations-intro">
        <h2 id={titleId}>{compact ? "Testimonials" : "Words from people I’ve worked with."}</h2>
        {!compact && <p>Recommendations from teammates, managers, and mentors.</p>}
      </div>
      {interactive && <div className="recommendations-controls" aria-label="Recommendation controls">
        <button type="button" aria-label="Previous recommendation" aria-controls="recommendations-list" disabled={!range.previous} onClick={() => move(-1)}><ArrowLeft size={22} aria-hidden="true"/></button>
        <button type="button" aria-label="Next recommendation" aria-controls="recommendations-list" disabled={!range.next} onClick={() => move(1)}><ArrowRight size={22} aria-hidden="true"/></button>
      </div>}
    </div>
    <ul ref={railRef} className="recommendations-list" id="recommendations-list" role="list" tabIndex={0} onKeyDown={interactive ? onKeyDown : undefined} aria-label="Received LinkedIn recommendations. Use left and right arrow keys to scroll.">{items.map((item, index) => <Recommendation key={item.id} item={item} index={index} count={items.length} expanded={expanded === item.id} onToggle={onToggle}/>)}</ul>
    <div className="recommendations-footer">
      <p>{interactive ? <><span role="status" aria-live="polite">{range.first}–{range.last} of {items.length}</span> · Swipe or use the arrows</> : "Scroll to see more recommendations"}</p>
      <a href={content.sourceUrl} target="_blank" rel="noopener noreferrer">Read on LinkedIn <ArrowUpRight size={18} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a>
    </div>
    <p className="recommendations-source-note">Excerpts from received LinkedIn recommendations. Roles are shown as supplied.</p>
  </section>;
}
