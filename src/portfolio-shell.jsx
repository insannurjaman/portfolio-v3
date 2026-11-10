import React, { useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, Moon, Search, Sun } from "lucide-react";
import { CONTACT_EMAIL } from "./hiring-content.js";
import { RESUME_URL } from "./editorial-shell.jsx";
import "./portfolio-shell.css";

export const PORTFOLIO_PORTRAIT = "/media/about/photo-reveal-30c6aeeb-800.jpg";
export const PORTFOLIO_LINKEDIN = "https://www.linkedin.com/in/insannurjaman/";

const navigation = [
  ["Home", "/"],
  ["Portfolio", "/work"],
  ["Story", "/about"],
  ["Projects", "/side-projects"],
  ["Connect", "/#contact"],
];
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

export function PortfolioHeader({ interactive = true }) {
  const disclosure = useRef(null);
  const { pathname, hash } = useLocation();
  const closeMenu = () => { if (disclosure.current) disclosure.current.open = false; };
  const links = navigation.map(([label, path]) => path.includes("#")
    ? <Link key={path} to={path} onClick={closeMenu} aria-current={pathname === "/" && hash === "#contact" ? "location" : undefined}>{label}</Link>
    : <NavLink key={path} to={path} end={path === "/"} onClick={closeMenu}>{label}</NavLink>);

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="portfolio-header">
      <nav className="portfolio-nav" aria-label="Primary navigation">
        <Link className="portfolio-nav-portrait" to="/" aria-label="Insan Nurjaman home" onClick={closeMenu}>
          <img src={PORTFOLIO_PORTRAIT} alt="" width="20" height="20"/>
        </Link>
        <div className="portfolio-nav-links">{links}</div>
        <details className="portfolio-nav-disclosure" ref={disclosure} onKeyDown={event => {
          if (event.key !== "Escape" || !event.currentTarget.open) return;
          closeMenu();
          event.currentTarget.querySelector("summary").focus();
        }}>
          <summary><Menu size={17} aria-hidden="true"/> Menu</summary>
          <div className="portfolio-nav-panel">{links}</div>
        </details>
        {interactive && <ThemeSwitch/>}
      </nav>
    </header>
  </>;
}

export function PortfolioFooter({ resume = RESUME_URL, linkedin = PORTFOLIO_LINKEDIN, onSearch }) {
  return <footer className="portfolio-footer" id="contact" aria-labelledby="portfolio-contact-title">
    <h2 id="portfolio-contact-title">Connect</h2>
    <div className="portfolio-footer-actions">
      <a href={`mailto:${CONTACT_EMAIL}`}>Email Me <ArrowUpRight size={14} aria-hidden="true"/></a>
      <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true"/></a>
      <a href={resume} target="_blank" rel="noopener noreferrer">Resume <ArrowUpRight size={14} aria-hidden="true"/></a>
    </div>
    <nav aria-label="More from the portfolio">
      {moreLinks.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}
      {onSearch && <button type="button" onClick={onSearch}><Search size={15} aria-hidden="true"/> Search portfolio</button>}
    </nav>
  </footer>;
}
