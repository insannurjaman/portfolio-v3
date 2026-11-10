import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import "./product-preview.css";

export function ProductPreview({ project, onClose }) {
  const dialog = useRef(null);
  const screenRegion = useRef(null);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const screen = project.previews[index];

  useEffect(() => {
    const trigger = document.activeElement;
    const modal = dialog.current;
    modal.showModal();
    document.body.classList.add("product-preview-open");
    return () => {
      modal.close();
      document.body.classList.remove("product-preview-open");
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  function choose(next) {
    setIndex(next);
    setLoaded(false);
    setFailed(false);
    screenRegion.current?.scrollTo({ top: 0, left: 0 });
  }

  function keepFocus(event) {
    if (event.key !== "Tab") return;
    const controls = [...dialog.current.querySelectorAll("button:not(:disabled), a[href], [tabindex='0']")].filter(node => node.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  return createPortal(<dialog ref={dialog} className="product-preview" aria-labelledby="product-preview-title" aria-describedby="product-preview-description" onKeyDown={keepFocus} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="product-preview-panel">
      <header className="product-preview-header">
        <div><h2 id="product-preview-title">{project.company} · {project.name}</h2><p id="product-preview-description">Original UI designs with illustrative data. Scroll inside the preview to inspect the full screen.</p></div>
        <button className="product-preview-close" type="button" aria-label="Close product preview" onClick={onClose} autoFocus><X size={22} aria-hidden="true"/></button>
      </header>
      <div className="product-preview-controls">
        <p aria-live="polite" aria-atomic="true">{index + 1} / {project.previews.length} · {screen.label}</p>
        <div><button type="button" aria-label="Previous screen" disabled={index === 0} onClick={() => choose(index - 1)}><ArrowLeft size={20} aria-hidden="true"/></button><button type="button" aria-label="Next screen" disabled={index === project.previews.length - 1} onClick={() => choose(index + 1)}><ArrowRight size={20} aria-hidden="true"/></button></div>
      </div>
      <div className="product-preview-screen" ref={screenRegion} tabIndex={0} role="region" aria-label={`${screen.label} design preview`} aria-busy={!loaded && !failed}>
        {!loaded && !failed && <p className="product-preview-status" role="status">Loading original design…</p>}
        {failed ? <p className="product-preview-status" role="status">This preview couldn’t load. Open the full-size image or continue to the case study below.</p> : <img key={screen.src} src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} style={{ maxWidth: screen.width }} decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)}/>}
      </div>
      <footer className="product-preview-footer"><a href={screen.src} target="_blank" rel="noopener noreferrer">Open full-size image <ArrowUpRight size={16} aria-hidden="true"/></a><Link to={project.path} data-funnel="selected_case" onClick={onClose}>Read case study <ArrowRight size={16} aria-hidden="true"/></Link></footer>
    </div>
  </dialog>, document.body);
}
