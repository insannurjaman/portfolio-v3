import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Mail, MessageSquare, Moon, Search, Sun } from "lucide-react";
import { CONTACT_EMAIL, HIRING_AVAILABILITY } from "./hiring-content.js";
import { RESUME_URL } from "./editorial-shell.jsx";
import "./portfolio-shell.css";

export const PORTFOLIO_PORTRAIT = "/media/about/photo-reveal-30c6aeeb-800.jpg";
export const PORTFOLIO_LINKEDIN = "https://www.linkedin.com/in/insannurjaman/";

const moreLinks = [
  ["Design systems", "/design-systems"], ["AI practice", "/ai-practice"],
  ["Industry explorations", "/industries"], ["Journal", "/articles"],
];

export function ThemeSwitch() {
  const [dark, setDark] = useState(() => typeof document === "undefined" || document.documentElement.dataset.theme !== "light");
  function toggle() {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#fafafa" : "#171717");
    try { localStorage.setItem("insan-portfolio-theme", theme); } catch { /* The current tab still changes theme. */ }
    setDark(!dark);
  }
  const Icon = dark ? Moon : Sun;
  return <button className="portfolio-theme-switch" type="button" role="switch" aria-label="Dark mode" aria-checked={dark} onClick={toggle}>
    <Icon size={20} aria-hidden="true"/>
  </button>;
}

export function PortfolioHeader({ interactive = true, resume = RESUME_URL }) {
  const { pathname, hash } = useLocation();

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="portfolio-header">
      <nav className="portfolio-nav" aria-label="Primary navigation">
        <Link className="portfolio-nav-portrait" to="/" aria-label="Insan Nurjaman home">
          <img src={PORTFOLIO_PORTRAIT} alt="" width="20" height="20"/>
        </Link>
        <NavLink to="/" end>Home</NavLink>
        <Link to="/#contact" aria-current={pathname === "/" && hash === "#contact" ? "location" : undefined}>Connect</Link>
        <a href={resume} target="_blank" rel="noopener noreferrer">
          Resume <ArrowUpRight size={14} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span>
        </a>
        {interactive && <ThemeSwitch/>}
      </nav>
    </header>
  </>;
}

function HomeContact({ linkedin, interactive }) {
  function openDraft(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = fields.get("name").trim();
    const email = fields.get("email").trim();
    const message = fields.get("message").trim().replace(/\r?\n/g, "\r\n");
    const subject = encodeURIComponent("Portfolio inquiry");
    const body = encodeURIComponent(`${message}\r\n\r\n${name}\r\n${email}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return <section className="home-contact" aria-labelledby="portfolio-contact-title">
    <h2 id="portfolio-contact-title">Let’s Work Together</h2>
    <div className="home-contact-grid">
      <div className="home-contact-card">
        <h3>Get in Touch</h3>
        <p>Have a role or project in mind? I’d love to hear about it.</p>
        <div className="home-contact-channels">
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <Mail size={16} aria-hidden="true"/>
            <span><strong>Email me</strong><small>{CONTACT_EMAIL}</small></span>
            <ArrowUpRight size={14} aria-hidden="true"/>
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            <MessageSquare size={16} aria-hidden="true"/>
            <span><strong>Connect on LinkedIn</strong><small>Message me on LinkedIn</small></span>
            <ArrowUpRight size={14} aria-hidden="true"/>
          </a>
        </div>
        <p className="home-contact-availability">{HIRING_AVAILABILITY}</p>
      </div>
      {interactive && <div className="home-contact-card">
        <h3>Send a Message</h3>
        <p>This opens a draft in your email app.</p>
        <form className="home-contact-form" onSubmit={openDraft}>
          <label>Name<input name="name" autoComplete="name" maxLength={100} required/></label>
          <label>Email<input type="email" name="email" autoComplete="email" maxLength={254} required/></label>
          <label>Message<textarea name="message" rows={3} maxLength={1200} required/></label>
          <button type="submit">Open email draft <ArrowUpRight size={14} aria-hidden="true"/></button>
        </form>
      </div>}
    </div>
  </section>;
}

export function PortfolioFooter({ resume = RESUME_URL, linkedin = PORTFOLIO_LINKEDIN, onSearch, interactive = true }) {
  const home = useLocation().pathname === "/";
  return <footer className="portfolio-footer" id="contact" aria-labelledby="portfolio-contact-title">
    {home ? <HomeContact linkedin={linkedin} interactive={interactive}/> : <>
      <h2 id="portfolio-contact-title">Connect</h2>
      <div className="portfolio-footer-actions">
        <a href={`mailto:${CONTACT_EMAIL}`}>Email Me <ArrowUpRight size={14} aria-hidden="true"/></a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true"/></a>
        <a href={resume} target="_blank" rel="noopener noreferrer">Resume <ArrowUpRight size={14} aria-hidden="true"/></a>
      </div>
    </>}
    <nav aria-label="More from the portfolio">
      {home && <a href={resume} target="_blank" rel="noopener noreferrer">Resume <ArrowUpRight size={14} aria-hidden="true"/></a>}
      {moreLinks.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}
      {onSearch && <button type="button" onClick={onSearch}><Search size={15} aria-hidden="true"/> Search portfolio</button>}
    </nav>
  </footer>;
}
