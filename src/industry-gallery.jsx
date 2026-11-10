import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { AGSCaseLinks } from "./ags-case-links";

const developerLabels = [
  ["Pricing calculator", "Configure services and estimate infrastructure costs."],
  ["Game services", "Explore the game services workspace and its tools."],
  ["Billing", "Review subscriptions, payments and billing history."],
  ["Usage", "Explore service usage and resource balances."],
];

function describe(image, index, path) {
  if (path === "/developer-tools") return developerLabels[index] || [`Exploration ${index + 1}`, "Original interface design."];
  return [image.alt?.trim() || `Exploration ${String(index + 1).padStart(2, "0")}`, "Original interface design."];
}

export function GalleryImage({ image, alt, thumbnail = false, full = false }) {
  const [state, setState] = useState("loading");
  const [portrait, setPortrait] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return <div className={`gallery-image ${thumbnail ? "gallery-thumbnail" : ""} ${full ? "gallery-image-full" : ""} ${portrait ? "gallery-image-portrait" : ""} image-${state}`} aria-busy={state === "loading"}>
    <img key={attempt} src={image.src} alt={thumbnail ? "" : alt} loading={thumbnail ? "lazy" : "eager"} decoding="async"
      onLoad={event => {
        const { naturalWidth, naturalHeight } = event.currentTarget;
        setPortrait(naturalWidth < 900 && naturalWidth / naturalHeight < .65);
        setState("ready");
      }} onError={() => setState("error")}/>
    {state === "loading" && !thumbnail && <span className="gallery-loading" role="status">Loading design…</span>}
    {state === "error" && <div className="gallery-image-error">
      {thumbnail ? <span>Preview unavailable</span> : <><p>This design could not load.</p>
        <button type="button" onClick={() => { setState("loading"); setAttempt(value => value + 1); }}>Try again</button>
        <a href={image.src} target="_blank" rel="noreferrer">Open original <ArrowUpRight size={16}/></a></>}
    </div>}
  </div>;
}

export function IndustryGallery({ page, path, industries }) {
  const images = page.images || [];
  const [active, setActive] = useState(0);
  const [inspecting, setInspecting] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef(null);
  const preview = useRef(null);
  const index = useRef(null);
  const inspectButton = useRef(null);
  const image = images[active];
  const [title, description] = image ? describe(image, active, path) : ["No designs available", ""];
  const industryIndex = industries.findIndex(([, route]) => route === path);
  const previous = industries[(industryIndex - 1 + industries.length) % industries.length];
  const next = industries[(industryIndex + 1) % industries.length];
  const choose = position => setActive(Math.max(0, Math.min(images.length - 1, position)));

  useEffect(() => {
    setZoomed(false);
    if (preview.current) preview.current.scrollTop = 0;
    const selected = index.current?.querySelector('[aria-current="true"]');
    if (selected && index.current) {
      const rail = index.current;
      // Scroll only the catalogue, never the document or the active preview.
      if (rail.scrollWidth > rail.clientWidth) rail.scrollLeft = selected.offsetLeft - 8;
      else if (selected.offsetTop < rail.scrollTop || selected.offsetTop + selected.offsetHeight > rail.scrollTop + rail.clientHeight) rail.scrollTop = selected.offsetTop;
    }
  }, [active]);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !inspecting) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    element.querySelector('[aria-label="Close full design"]')?.focus();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [inspecting]);

  const handleKeys = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest(".gallery-inspector-content")) return;
    if (event.key === "ArrowRight" && active < images.length - 1) { event.preventDefault(); choose(active + 1); }
    if (event.key === "ArrowLeft" && active > 0) { event.preventDefault(); choose(active - 1); }
  };

  return <main id="main-content" className="industry-gallery-page">
    <header className="gallery-heading">
      <Link className="gallery-back" to="/industries"><ArrowLeft size={18}/> All industries</Link>
      <h1>{page.title}</h1>
      <div className="gallery-heading-bottom"><p>{path === "/developer-tools" ? "Interfaces for pricing, billing and game services." : `Interface explorations for ${page.title}.`}</p>
        <span>{images.length} {images.length === 1 ? "exploration" : "explorations"}</span></div>
    </header>
    {path === "/developer-tools" && <AGSCaseLinks/>}
    {images.length ? <>
      <section className={`gallery-workspace ${images.length === 1 ? "gallery-single" : ""}`} aria-label={`${page.title} design gallery`} onKeyDown={handleKeys}>
        <div className="gallery-focal">
          <div className="gallery-preview" ref={preview} tabIndex={0} role="region" aria-label={`Preview of ${title}; scroll to explore the design`}>
            <GalleryImage key={image.src} image={image} alt={`${page.title}: ${title}`}/>
          </div>
          <div className="gallery-preview-tools">
            <p aria-live="polite"><span>{String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span><strong>{title}</strong></p>
            <div className="gallery-actions">
              {images.length > 1 && <div className="gallery-stepper">
                <button type="button" aria-label="Previous design" disabled={active === 0} onClick={() => choose(active - 1)}><ChevronLeft size={20}/></button>
                <button type="button" aria-label="Next design" disabled={active === images.length - 1} onClick={() => choose(active + 1)}><ChevronRight size={20}/></button>
              </div>}
              <button type="button" className="gallery-inspect" ref={inspectButton} onClick={() => { setZoomed(false); setInspecting(true); }}>Inspect full design <Maximize2 size={17}/></button>
            </div>
          </div>
        </div>
        {images.length > 1 && <nav className="gallery-index" ref={index} aria-label="Choose a design">
          {images.map((item, position) => {
            const [label, detail] = describe(item, position, path);
            return <button className="gallery-index-item" type="button" key={`${item.src}-${position}`} aria-current={active === position ? "true" : undefined}
              aria-label={`Show ${label}`} onClick={() => choose(position)}>
              <GalleryImage image={item} alt="" thumbnail/>
              <span className="gallery-index-copy"><strong>{label}</strong><span>{detail}</span></span>
              <span className="gallery-index-number">{String(position + 1).padStart(2, "0")}</span>
            </button>;
          })}
        </nav>}
      </section>
      <dialog ref={dialog} className="gallery-inspector" aria-labelledby="gallery-inspector-title" onKeyDown={handleKeys}
        onCancel={() => setInspecting(false)} onClose={() => { setInspecting(false); inspectButton.current?.focus({ preventScroll: true }); }}>
        <div className="gallery-inspector-header">
          <div><h2 id="gallery-inspector-title">{title}</h2><span>{page.title} · {active + 1} / {images.length}</span></div>
          <div className="gallery-inspector-actions">
            {images.length > 1 && <><button type="button" aria-label="Previous full design" disabled={active === 0} onClick={() => choose(active - 1)}><ChevronLeft size={20}/></button>
              <button type="button" aria-label="Next full design" disabled={active === images.length - 1} onClick={() => choose(active + 1)}><ChevronRight size={20}/></button></>}
            <a href={image.href || image.src} target="_blank" rel="noreferrer" aria-label="Open original design in a new tab">Open original <ArrowUpRight size={17}/></a>
            <button type="button" aria-label={zoomed ? "Fit design to width" : "Zoom in on design"} aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>{zoomed ? <ZoomOut size={20}/> : <ZoomIn size={20}/>}</button>
            <button type="button" autoFocus aria-label="Close full design" onClick={() => setInspecting(false)}><X size={22}/></button>
          </div>
        </div>
        {inspecting && <div key={image.src} className={"gallery-inspector-content" + (zoomed ? " gallery-zoomed" : "")} tabIndex={0} role="region" aria-label="Complete design, scroll to inspect">
          <GalleryImage image={image} alt={`Complete ${page.title} design: ${title}`} full/>
        </div>}
      </dialog>
    </> : <section className="gallery-empty"><p>No designs are available in this collection yet.</p><Link to="/industries">Explore another industry <ArrowRight size={18}/></Link></section>}
    <nav className="gallery-adjacent" aria-label="Other industries">
      <Link to={previous[1]}><ArrowLeft size={20}/><span><small>Previous industry</small><strong>{previous[0]}</strong></span></Link>
      <Link to={next[1]}><span><small>Next industry</small><strong>{next[0]}</strong></span><ArrowRight size={20}/></Link>
    </nav>
  </main>;
}

export function IndustryFooter({ data }) {
  return <footer className="industry-footer"><div><p>Have a product worth caring about?</p><a href={data.linkedin} target="_blank" rel="noreferrer">Start a conversation <ArrowUpRight size={19}/></a></div>
    <div className="industry-footer-meta"><span>Insan Nurjaman · © 2026</span><nav aria-label="Contact links"><a href={data.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={data.resume} target="_blank" rel="noreferrer">Resume</a><a href="mailto:hello@insandesign.com">Email</a></nav></div>
  </footer>;
}
