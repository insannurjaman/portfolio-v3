import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { Check, MessageSquarePlus, X } from "lucide-react";
import { COMMENT_LIMIT, COMMENT_EXCLUSIONS, collectCommentSections, commentPayload, placeComment, sendComment, validateComment } from "./portfolio-comments-model.js";
import "./portfolio-comments.css";

export function PortfolioComments({ enabled = true }) {
  const { pathname } = useLocation();
  const [mode, setMode] = useState("idle");
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [position, setPosition] = useState({ x: 12, y: 80, pinX: 0, pinY: 0, pinVisible: false });
  const launcher = useRef(null), panel = useRef(null), textarea = useRef(null), emailInput = useRef(null), locationDetails = useRef(null);
  const request = useRef(null), busy = useRef(false), mounted = useRef(false), focusOnOpen = useRef(false);
  const messageRef = useRef(message); messageRef.current = message;
  const active = enabled && !blocked && mode !== "idle";
  const open = active && mode === "composing";
  const pageLabel = pathname === "/" ? "Home" : pathname.split("/").filter(Boolean).map(word => word.replace(/-/g, " ")).join(" / ");

  function close(restoreFocus = true) {
    setMode("idle");
    setNotice("");
    if (restoreFocus) launcher.current?.focus({ preventScroll: true });
  }
  function choose(section, point = { u: .5, v: .2 }) {
    if (status === "sent") { setStatus("idle"); setEmail(""); setWebsite(""); }
    setSelected({ ...section, point });
    setError(null); setNotice("");
    focusOnOpen.current = true;
    setMode("composing");
  }
  function start(event) {
    if (active) { close(); return; }
    const next = collectCommentSections(document.querySelector("main"));
    if (!next.length) return;
    setSections(next); setNotice("");
    if (status === "sent") { setStatus("idle"); setEmail(""); setWebsite(""); }
    if (selected?.element.isConnected && message.trim()) {
      focusOnOpen.current = true; setMode("composing");
    } else if (event.detail === 0) choose(next[0]);
    else setMode("selecting");
  }

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; request.current?.abort(); };
  }, []);
  useEffect(() => {
    request.current?.abort(); request.current = null; busy.current = false;
    setMode("idle"); setSelected(null); setSections([]); setMessage(""); setEmail(""); setWebsite(""); setStatus("idle"); setError(null); setNotice("");
  }, [pathname]);
  useEffect(() => {
    const update = () => setBlocked(document.body.classList.contains("menu-open") || document.body.classList.contains("search-open") || !!document.querySelector(".system-docs.docs-menu-open"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    const docs = document.querySelector(".system-docs");
    if (docs) observer.observe(docs, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => { if (!enabled || blocked) close(false); }, [enabled, blocked]);
  useEffect(() => {
    if (!active) return;
    document.documentElement.dataset.commentMode = "active";
    window.dispatchEvent(new Event("gravity-release"));
    window.dispatchEvent(new CustomEvent("portfolio-comment-mode", { detail: { active: true } }));
    return () => {
      delete document.documentElement.dataset.commentMode;
      window.dispatchEvent(new CustomEvent("portfolio-comment-mode", { detail: { active: false } }));
    };
  }, [active]);
  useEffect(() => {
    if (!active) return;
    const eligible = target => target instanceof Element && !!target.closest("main") && !target.closest(COMMENT_EXCLUSIONS);
    const stopPress = event => {
      if (event.button !== 0 || !eligible(event.target)) return;
      event.preventDefault(); event.stopImmediatePropagation();
    };
    const pick = event => {
      if (event.button !== 0 || !eligible(event.target)) return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (busy.current) return;
      if (messageRef.current.trim() && selected) { setNotice("Your draft is still here. Send or clear it before choosing another section."); return; }
      const section = [...sections].reverse().find(item => item.element.contains(event.target));
      if (!section) return;
      const rect = section.element.getBoundingClientRect();
      choose(section, { u: Math.max(0, Math.min(1, (event.clientX - rect.left) / (rect.width || 1))), v: Math.max(0, Math.min(1, (event.clientY - rect.top) / (rect.height || 1))) });
    };
    const key = event => {
      if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); close(); }
    };
    window.addEventListener("pointerdown", stopPress, true);
    window.addEventListener("click", pick, true);
    window.addEventListener("keydown", key, true);
    return () => {
      window.removeEventListener("pointerdown", stopPress, true);
      window.removeEventListener("click", pick, true);
      window.removeEventListener("keydown", key, true);
    };
  }, [active, sections, selected]);

  useLayoutEffect(() => {
    if (!open || !selected || !panel.current) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!panel.current || !selected.element.isConnected) return;
      const rect = selected.element.getBoundingClientRect(), box = panel.current.getBoundingClientRect();
      const viewport = window.visualViewport;
      const bounds = { left: viewport?.offsetLeft || 0, top: viewport?.offsetTop || 0, width: viewport?.width || innerWidth, height: viewport?.height || innerHeight };
      const point = { x: rect.left + rect.width * selected.point.u, y: rect.top + rect.height * selected.point.v };
      const next = placeComment(point, box, bounds);
      const value = { ...next, maxHeight: Math.max(1,bounds.height - 24), pinX: point.x, pinY: point.y, pinVisible: point.x >= bounds.left && point.x <= bounds.left + bounds.width && point.y >= bounds.top && point.y <= bounds.top + bounds.height };
      setPosition(previous => Object.keys(value).every(key => previous[key] === value[key]) ? previous : value);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    if (focusOnOpen.current) { focusOnOpen.current = false; (status === "sent" ? panel.current : textarea.current)?.focus({ preventScroll: true }); }
    const observer = new ResizeObserver(schedule); observer.observe(panel.current); observer.observe(selected.element);
    window.addEventListener("scroll", schedule, true); window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule); window.visualViewport?.addEventListener("scroll", schedule);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule, true); window.removeEventListener("resize", schedule); window.visualViewport?.removeEventListener("resize", schedule); window.visualViewport?.removeEventListener("scroll", schedule); };
  }, [open, selected, status]);

  async function submit(event) {
    event.preventDefault();
    if (busy.current || status === "sent" || !selected) return;
    const problem = validateComment(message, email);
    if (problem) { setError(problem); (problem.field === "email" ? emailInput.current : textarea.current)?.focus(); return; }
    busy.current = true; setStatus("sending"); setError(null); setNotice("");
    const controller = new AbortController(); request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      await sendComment(commentPayload({ message, email, website, page: pathname, section: selected.label }), { signal: controller.signal });
      if (mounted.current && request.current === controller) { setStatus("sent"); setMessage(""); panel.current?.focus({ preventScroll: true }); }
    } catch (failure) {
      if (mounted.current && request.current === controller) {
        setStatus("error");
        setError({ message: failure.name === "AbortError" ? "Could not confirm sending in time. Your draft is still here. Please check your connection before trying again." : failure.message || "Could not confirm sending. Your draft is still here. Please try again." });
      }
    } finally { clearTimeout(timeout); if (request.current === controller) { request.current = null; busy.current = false; } }
  }

  if (!enabled || blocked || typeof document === "undefined") return null;
  return createPortal(<div className="portfolio-comments" data-comment-ui>
    <button ref={launcher} type="button" className="comment-launch" onClick={start} aria-pressed={active} aria-label={active ? "Exit comment mode" : "Leave a comment"} aria-controls={open ? "portfolio-comment-composer" : undefined}>
      {active ? <X size={18} aria-hidden="true"/> : <MessageSquarePlus size={18} aria-hidden="true"/>}<span>Comment</span>
    </button>
    {active && mode === "selecting" && <div className="comment-selection-hint" role="status"><p>Click a section to leave a private note.</p><button type="button" onClick={() => choose(sections[0])}>Or choose a section</button><span>Esc to exit</span></div>}
    {open && selected && <>
      {position.pinVisible && <button className="comment-location-pin" type="button" style={{ left: position.pinX, top: position.pinY }} aria-label={`Comment on ${selected.label}`} onClick={() => textarea.current?.focus({ preventScroll: true })}><span/></button>}
      <section ref={panel} id="portfolio-comment-composer" role="dialog" aria-modal="false" aria-label="Leave a comment" tabIndex={-1} className="comment-composer" style={{ left: position.x, top: position.y, maxHeight: position.maxHeight }}>
        <div className="comment-composer-top">
          <details ref={locationDetails} className="comment-location">
            <summary aria-label={`Change comment location, ${selected.label}`} title={`${pageLabel} / ${selected.label}`}><span>{pageLabel} / {selected.label}</span></summary>
            <label className="comment-sr-only" htmlFor="comment-section">Section to comment on</label>
            <select id="comment-section" value={selected.id} disabled={status === "sending" || status === "sent"} onChange={event => {
              if (message.trim()) { setNotice("Your draft is still here. Send or clear it before choosing another section."); return; }
              const section = sections.find(item => item.id === event.target.value);
              if (section) choose(section);
              if (locationDetails.current) locationDetails.current.open = false;
            }}>{sections.map(section => <option value={section.id} key={section.id}>{section.label}</option>)}</select>
          </details>
          <button className="comment-close" type="button" onClick={() => close()} aria-label="Close comment"><X size={16} aria-hidden="true"/></button>
        </div>
        {status === "sent" ? <div className="comment-sent" role="status"><Check size={20} aria-hidden="true"/><h2>Comment sent.</h2><p>Thanks for taking a closer look.</p><button type="button" className="comment-send" onClick={() => close()}>Close</button></div> : <form action="https://formspree.io/f/xjygqrwb" method="post" onSubmit={submit} noValidate aria-busy={status === "sending"}>
          <label className="comment-sr-only" htmlFor="comment-message">Your comment</label>
          <textarea ref={textarea} id="comment-message" name="message" placeholder="Leave a note about this part…" value={message} onChange={event => { setMessage(event.target.value); if (error) setError(null); }} maxLength={COMMENT_LIMIT} required disabled={status === "sending"} aria-invalid={error?.field === "message" || undefined} aria-describedby={error ? "comment-error" : "comment-privacy"}/>
          <label className="comment-sr-only" htmlFor="comment-reply-email">Your email (optional)</label>
          <input ref={emailInput} id="comment-reply-email" type="email" name="email" autoComplete="email" placeholder="Email, if you would like a reply" value={email} onChange={event => { setEmail(event.target.value); if (error?.field === "email") setError(null); }} maxLength={254} disabled={status === "sending"} aria-invalid={error?.field === "email" || undefined} aria-describedby={error?.field === "email" ? "comment-error" : "comment-privacy"}/>
          <input className="comment-honeypot" type="text" name="_gotcha" value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"/>
          {message.length > COMMENT_LIMIT - 200 && <p className="comment-count">{message.length}/{COMMENT_LIMIT}</p>}
          {error && <div id="comment-error" className="comment-error" role="alert"><p>{error.message}</p>{!error.field && <a href="https://www.linkedin.com/in/insannurjaman/" target="_blank" rel="noopener noreferrer">Contact on LinkedIn</a>}</div>}
          {notice && <p className="comment-notice" role="status">{notice}</p>}
          <div className="comment-composer-foot"><p id="comment-privacy">Private to Insan<span>via Formspree</span></p><button className="comment-cancel" type="button" onClick={() => close()}>Cancel</button><button className="comment-send" type="submit" disabled={!message.trim() || status === "sending"}>{status === "sending" ? "Sending…" : "Send"}</button></div>
        </form>}
      </section>
    </>}
  </div>, document.body);
}
