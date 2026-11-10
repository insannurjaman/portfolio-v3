import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { RollLabel } from "./editorial-shell.jsx";
import { SelectedImpact } from "./selected-impact.jsx";
import { CompactImpactConcept } from "./compact-impact-concept.jsx";
import { AntiflexSpotlight } from "./antiflex-spotlight.jsx";
import { Recommendations } from "./recommendations.jsx";
import { CONTACT_EMAIL, HIRING_AVAILABILITY, FEATURED_WORK } from "./hiring-content.js";
import { FeaturedWorkThumbnail } from "./featured-work-thumbnail.jsx";
import { ProductPreview } from "./product-preview.jsx";
import { BACKGROUND_MEDIA } from "./background-media.js";
import "./hero-clear.css";

function Hero({ resume, selectedWorkHref = "/#selected-work" }) {
  const [offscreen, setOffscreen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [artFailed, setArtFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const hero = useRef(null);
  const video = useRef(null);
  const still = offscreen || hidden || reduced;
  useEffect(() => {
    if (!posterReady || reduced || navigator.connection?.saveData) return;
    const timer = setTimeout(() => setVideoEnabled(true), 1600);
    return () => clearTimeout(timer);
  }, [posterReady, reduced]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting || entry.intersectionRatio < .02), { threshold: [0, .02], rootMargin: "-104px 0px 0px 0px" });
    observer.observe(hero.current);
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    // Re-select sources when deferred loading or reduced motion changes.
    video.current?.load();
  }, [videoEnabled, reduced]);
  useEffect(() => {
    const media = video.current;
    if (!media || !videoEnabled) return;
    if (still || blocked || videoFailed) { media.pause(); return; }
    let active = true;
    media.muted = true;
    media.play().catch(() => { if (active) setBlocked(true); });
    return () => { active = false; media.pause(); };
  }, [still, blocked, videoFailed, videoEnabled]);
  return <section className="editorial-hero" ref={hero} data-hero-composition="clear" data-still={still || blocked} aria-labelledby="home-title">
    <div className="editorial-hero-art" data-scroll-generation-skip data-art-failed={artFailed} data-video-ready={videoReady && !reduced} data-video-failed={videoFailed} aria-hidden="true">
      <img src={BACKGROUND_MEDIA.hero.poster} alt="" width="1920" height="1080" fetchPriority="high" decoding="async" onLoad={() => setPosterReady(true)} onError={() => setArtFailed(true)}/>
      <video ref={video} poster={BACKGROUND_MEDIA.hero.poster} autoPlay={videoEnabled && !still && !blocked} muted loop playsInline preload="none" onPlaying={() => { setVideoReady(true); setBlocked(false); }} onError={() => { setVideoFailed(true); setVideoReady(false); }}>
        {!reduced && videoEnabled && <><source src={BACKGROUND_MEDIA.hero.webm} type='video/webm; codecs="vp9"'/><source src={BACKGROUND_MEDIA.hero.mp4} type="video/mp4"/></>}
      </video>
    </div>
    <svg className="hero-halftone" viewBox="0 0 600 360" aria-hidden="true">{Array.from({ length: 12 }, (_, row) => <g key={row} className="hero-pixel-row" style={{ "--pixel-delay": `${row * -.6}s` }}>{Array.from({ length: 27 }, (_, col) => <rect key={col} x={col * 22} y={row * 22 + Math.sin(col * .22) * 30 + 35} width={2 + ((row + col) % 3)} height={2 + ((row + col) % 3)} opacity={Math.max(.08, .65 - col / 44 - row / 45)}/>)}</g>)}</svg>
    <div className="editorial-hero-copy">
      <p className="hero-role" data-scroll-generation-skip><span>Senior Product Designer</span><span className="hero-role-divider" aria-hidden="true">·</span><span className="hero-role-focus">SaaS &amp; Developer Tools</span></p>
      <h1 id="home-title" data-hero-text-reveal="headline">Designing products<br/>that scale and create<br/>real impact</h1>
      <p data-hero-text-reveal="description">I’m Insan. With 7+ years of experience, I turn complex problems into usable, scalable, and measurable product experiences across SaaS, CRM, e-commerce, trading platforms, design systems, and developer tools.</p>
      <ul className="hero-specialties" aria-label="Specialties" data-scroll-generation-skip><li>Enterprise SaaS</li><li>Design Systems</li><li>UX Engineering</li></ul>
      <div className="hero-actions" data-scroll-generation-skip><Link className="editorial-button" to={selectedWorkHref}><RollLabel>View Selected Work</RollLabel></Link><a className="editorial-button is-outline" href={resume} target="_blank" rel="noopener noreferrer"><RollLabel>Resume</RollLabel><ArrowUpRight size={16}/></a><a className="hero-email" href={`mailto:${CONTACT_EMAIL}`}>Email Me <ArrowUpRight size={16}/></a></div>
      <p className="hiring-availability">{HIRING_AVAILABILITY}</p>
    </div>
  </section>;
}

function Companies() {
  const brands = [["saphyte-wordmark", "Saphyte", "company-logo-color company-logo-saphyte"], ["accelbyte-light", "AccelByte", "company-logo-color"], ["eftax", "eftax"], ["ruangguru", "Ruangguru"], ["tokopedia", "Tokopedia"]];
  return <section className="editorial-companies"><div className="editorial-section-heading"><h2>Built through<br/>real collaboration.</h2><p>Companies and teams I’ve worked with across product design, research, and systems.</p></div><ul aria-label="Companies I have worked with">{brands.map(([asset, label, className]) => <li key={asset}><img className={className} src={`/brand/worked-with/${asset}.svg`} alt={label} loading="lazy"/></li>)}</ul></section>;
}

function SelectedWork() {
  const [preview, setPreview] = useState(null);
  return <section className="hiring-selected section-pad" id="selected-work" aria-labelledby="selected-work-title">
    <span id="work" className="home-work-anchor" aria-hidden="true"/>
    <div className="editorial-section-heading"><div><h2 id="selected-work-title">Selected Work</h2><p>Three projects across enterprise workflows, pricing, and design systems.</p></div><Link className="editorial-text-link" to="/work">View all 6 case studies <ArrowUpRight size={18}/></Link></div>
    <div className="featured-work-grid">{FEATURED_WORK.map(project => <article className="featured-work-card" key={project.path} aria-label={`${project.company} ${project.name}`}>
      <header className="featured-work-heading"><p className="featured-company">{project.company} · {project.practice}</p><h3><Link to={project.path} data-funnel="selected_case">{project.name}</Link></h3></header>
      <FeaturedWorkThumbnail project={project}/>
      <div className="featured-work-copy">
        <dl><div><dt>Problem</dt><dd>{project.problem}</dd></div><div><dt>My contribution</dt><dd>{project.contribution}</dd></div><div><dt>What I Delivered</dt><dd>{project.deliverables}</dd></div></dl>
        <div className="featured-work-actions"><button type="button" className="featured-preview-button" aria-haspopup="dialog" aria-label={`Preview ${project.company} ${project.name} product UI`} onClick={() => setPreview(project)}>Preview product</button><Link className="featured-work-link" to={project.path} data-funnel="selected_case">Read case study <ArrowUpRight size={18}/></Link></div>
      </div>
    </article>)}</div>
    {preview && <ProductPreview project={preview} onClose={() => setPreview(null)}/>}
  </section>;
}

export function EditorialHome({ data }) {
  const { search } = useLocation();
  const workFirstConcept = import.meta.env.DEV && new URLSearchParams(search).get("layout") === "work-first";
  return <main className="editorial-home" id="main-content">
    <Hero resume={data.resume} selectedWorkHref={workFirstConcept ? "/?layout=work-first#selected-work" : undefined}/>
    {workFirstConcept ? <><SelectedWork/><CompactImpactConcept/></> : <><SelectedImpact/><SelectedWork/></>}
    <AntiflexSpotlight compact/>
    <Companies/>
    <Recommendations/>
  </main>;
}
