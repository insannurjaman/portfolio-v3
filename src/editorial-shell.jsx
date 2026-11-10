import React, { useEffect, useRef, useState } from "react";
import { animateFeedback, EDITORIAL_EASE } from "./motion-feedback.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { beginEditorialIntro } from "./editorial-intro.js";
import { CONTACT_EMAIL } from "./hiring-content.js";
import { BACKGROUND_MEDIA } from "./background-media.js";

export const RESUME_URL = "https://drive.google.com/file/d/1HkjKyZpRm60VEEsZf932QFnPh0jIdxAH/view?usp=sharing";
const LINKEDIN = "https://www.linkedin.com/in/insannurjaman/";
const secondary = [["Design systems", "/design-systems"], ["Tools & side projects", "/side-projects"], ["Experiments", "/work/ai"], ["AI practice", "/ai-practice"], ["Industry explorations", "/industries"]];

export function Wordmark({ ribbon = true }) {
  return <span className="editorial-brand">
    {ribbon && <span className="brand-ribbon" aria-hidden="true"><span>I</span></span>}
    <span className="wordmark"><b>insan</b><span>NURJAMAN</span></span>
  </span>;
}

export function RollLabel({ children }) {
  return <span className="roll-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}

export function EditorialHeader({ resume = RESUME_URL, onSearch }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef(null), trigger = useRef(null), closeTimer = useRef(null), menuMotion = useRef(null);
  const { pathname } = useLocation();
  function closeMenu() {
    if (closing) return;
    setClosing(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    menuMotion.current?.stop();
    if (!reduced) menuMotion.current = animateFeedback(dialog.current, { opacity: 0, transform: "translateY(-8px)" }, { duration: 0.18, ease: [0.4, 0, 1, 1] });
    closeTimer.current = setTimeout(() => { setOpen(false); setClosing(false); trigger.current?.focus(); }, reduced ? 0 : 180);
  }
  useEffect(() => {
    clearTimeout(closeTimer.current);
    setClosing(false); setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const panel = dialog.current;
    panel?.showModal();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!preference.matches) menuMotion.current = animateFeedback(panel, { opacity: [0, 1], transform: ["translateY(-12px)", "translateY(0px)"] }, { duration: 0.32, ease: EDITORIAL_EASE });
    const settle = () => {
      if (preference.matches) { menuMotion.current?.cancel(); panel.style.opacity = ""; panel.style.transform = ""; }
    };
    preference.addEventListener("change", settle);
    dialog.current?.querySelector('[aria-label="Close menu"]')?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      menuMotion.current?.cancel();
      panel.style.opacity = ""; panel.style.transform = "";
      preference.removeEventListener("change", settle);
      panel.close(); document.body.style.overflow = overflow;
    };
  }, [open]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className={`editorial-header${scrolled ? " is-scrolled" : ""}`}>
      <Link className="brand-home" to="/" aria-label="Insan Nurjaman home"><Wordmark/></Link>
      <nav className="editorial-nav" aria-label="Main navigation">
        <NavLink to="/work"><RollLabel>Work</RollLabel></NavLink>
        <NavLink to="/about"><RollLabel>About</RollLabel></NavLink>
      </nav>
      <div className="editorial-header-actions">
        <button className="icon-btn editorial-search" type="button" aria-label="Search portfolio" title="Search (⌘K / Ctrl+K)" onClick={onSearch}><Search size={20}/></button>
        <a className="editorial-button header-resume is-outline" href={resume} target="_blank" rel="noopener noreferrer"><RollLabel>Resume</RollLabel><ArrowUpRight size={16}/></a>
        <a className="editorial-button header-contact" href="#contact"><RollLabel>Get in touch</RollLabel></a>
        <button ref={trigger} className="editorial-menu-trigger" type="button" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={26}/></button>
      </div>
    </header>
    <dialog ref={dialog} className={`editorial-menu${closing ? " is-closing" : ""}`} aria-label="Portfolio navigation" onCancel={event => { event.preventDefault(); closeMenu(); }}>
      <div className="editorial-menu-top"><Link to="/" aria-label="Insan Nurjaman home"><Wordmark/></Link><button className="plain-icon" type="button" autoFocus onClick={closeMenu} aria-label="Close menu"><X size={28}/></button></div>
      <nav aria-label="Mobile navigation" className="editorial-menu-links">
        {[["Work", "/work"], ["About", "/about"]].map(([label, path]) => <NavLink key={path} to={path}>{label}<ArrowUpRight size={21}/></NavLink>)}
        <a href={resume} target="_blank" rel="noopener noreferrer">Resume<ArrowUpRight size={21}/></a>
      </nav>
      <nav className="editorial-menu-secondary" aria-label="More to explore">{[["Journal", "/articles"], ...secondary].map(([label, path]) => <Link key={path} to={path}>{label}<ArrowUpRight size={16}/></Link>)}</nav>
      <div className="editorial-menu-bottom"><span>Product design by Insan.</span><button type="button" onClick={() => { setOpen(false); onSearch(); }}><Search size={18}/> Search portfolio</button></div>
    </dialog>
  </>;
}

export function EditorialIntro({ onReveal }) {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const picture = new Image();
    picture.src = BACKGROUND_MEDIA.hero.poster;
    return beginEditorialIntro({
      ready: Promise.all([document.fonts.ready, picture.decode()]), reduced,
      onReveal: () => { setLeaving(true); onReveal(); },
      onComplete: () => setShow(false),
    });
  }, [onReveal]);
  return show ? <div className={`editorial-intro${leaving ? " is-leaving" : ""}`} aria-hidden="true">
    <div className="intro-wordmark"><b>insan</b><span>NURJAMAN</span></div>
    <div className="intro-frame">
      <div className="intro-images">
        <picture><img src={BACKGROUND_MEDIA.hero.poster} alt="" width="1920" height="1080" onError={event => { event.currentTarget.style.display = "none"; }}/></picture>
        <picture className="intro-preview"><source media="(max-width: 599px)" srcSet="/media/editorial/mobile-card.jpg"/><img src="/media/editorial/mobile.jpg" alt="" width="1024" height="1536" onError={event => { event.currentTarget.parentElement.style.display = "none"; }}/></picture>
      </div>
      {["tl", "tr", "bl", "br"].map(corner => <svg className={`intro-corner intro-corner-${corner}`} key={corner} viewBox="0 0 30 30"><path d="M0 30H30V0C27 15 15 27 0 30Z"/></svg>)}
    </div>
  </div> : null;
}

function FooterVideo() {
  const container = useRef(null), video = useRef(null);
  const [ready, setReady] = useState(false), [failed, setFailed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    if (enabled || reduced || navigator.connection?.saveData) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEnabled(true); observer.disconnect(); }
    }, { rootMargin: "200px 0px" });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [enabled, reduced]);
  useEffect(() => { video.current?.load(); }, [enabled, reduced]);
  useEffect(() => {
    const media = video.current, preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false, active = true;
    const sync = () => {
      if (!enabled || !visible || document.hidden || reduced || failed) { media.pause(); return; }
      media.muted = true;
      media.play().catch(() => { if (active) setReady(false); });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const update = () => setReduced(preference.matches);
    observer.observe(container.current);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", update);
    return () => { active = false; observer.disconnect(); document.removeEventListener("visibilitychange", sync); preference.removeEventListener("change", update); media.pause(); };
  }, [enabled, reduced, failed]);
  return <div className="footer-media" ref={container} data-video-ready={ready && !reduced && !failed} aria-hidden="true" data-scroll-generation-skip>
    <img src={BACKGROUND_MEDIA.footer.poster} alt="" loading="lazy" width="1920" height="1080"/>
    <video ref={video} poster={BACKGROUND_MEDIA.footer.poster} muted loop playsInline preload={enabled ? "metadata" : "none"} onPlaying={() => setReady(true)} onError={() => { setFailed(true); setReady(false); }}>
      {enabled && !reduced && <><source src={BACKGROUND_MEDIA.footer.webm} type='video/webm; codecs="vp9"'/><source src={BACKGROUND_MEDIA.footer.mp4} type="video/mp4"/></>}
    </video>
  </div>;
}

export function EditorialFooter({ resume = RESUME_URL }) {
  return <footer className="editorial-footer" id="contact">
    <div className="footer-banner"><FooterVideo/><div className="footer-invitation"><h2>Good work starts<br/>with a conversation.</h2><div className="footer-contact-actions"><a className="editorial-button" href={`mailto:${CONTACT_EMAIL}`}><RollLabel>Email Me</RollLabel><ArrowUpRight size={18}/></a><a className="footer-linkedin" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={18}/></a></div></div></div>
    <div className="footer-details">
    <div className="footer-main">
      <div className="footer-signature"><Link to="/" aria-label="Insan Nurjaman home"><Wordmark ribbon={false}/></Link><p>Product designer.<br/>Complex systems. Clear experiences.</p></div>
      <nav aria-label="Footer navigation">{[["Work", "/work"], ["About", "/about"], ["Journal", "/articles"]].map(([label, path]) => <Link to={path} key={path}>{label}</Link>)}</nav>
      <nav aria-label="More to explore">{secondary.filter(([, path]) => path !== "/side-projects").map(([label, path]) => <Link to={path} key={path}>{label}</Link>)}</nav>
      <div className="footer-links"><a href={`mailto:${CONTACT_EMAIL}`}>Email Me <ArrowUpRight size={16}/></a><a href={resume} target="_blank" rel="noopener noreferrer">View resume <ArrowUpRight size={16}/></a><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={16}/></a><a href="#main-content">Back to top <ArrowUpRight size={16}/></a></div>
    </div>
    <div className="footer-colophon"><span>© {new Date().getFullYear()} Insan Nurjaman</span><span>Made with care. Designed for people.</span></div>
    </div>
  </footer>;
}
