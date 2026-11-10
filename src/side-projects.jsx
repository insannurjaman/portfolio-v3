import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectCover } from "./project-cover.jsx";
import "./side-projects.css";

export const SIDE_PROJECT_PATHS = ["/pixel-round", "/uiqa"];
export const sideProjectsSearchPage = {
  path: "/side-projects", title: "Tools",
  body: ["I’m a designer who builds useful tools to make everyday work easier. Pixel Round is a Figma plugin for rounding layer values. UIQA is an open-source CLI and GitHub Action for reviewing UX risks in frontend code."],
  images: [],
};

function OutwardIcon() { return <ArrowUpRight size={18} aria-hidden="true"/>; }

export function SideProjectsPage({ data }) {
  useEffect(() => {
    const previous = document.title;
    document.title = "Tools | Insan Nurjaman";
    return () => { document.title = previous; };
  }, []);
  return <main id="main-content" className="side-projects-page">
    <header className="side-projects-intro">
      <h1>Tools.</h1>
      <p>I’m a designer who likes building tools as much as designing interfaces. When a small, repetitive task gets in the way, I want to find a simpler way through it.</p>
      <p>For me, a useful tool doesn’t need to do everything. It should solve a clear problem, be easy to pick up, and make someone’s day a little easier. Pixel Round and UIQA are two ways I put that idea into practice.</p>
    </header>
    <section className="side-projects-list" aria-label="Tools by Insan Nurjaman">
      <article className="side-project article-card" aria-labelledby="pixel-round-project-title">
        <Link className="side-project-preview side-project-cover" to="/pixel-round" aria-label="Explore Pixel Round"><ProjectCover path="/pixel-round" sizes="(max-width: 900px) calc(100vw - 56px), 45vw"/></Link>
        <small>Figma plugin</small>
        <h2 id="pixel-round-project-title"><Link to="/pixel-round">Pixel Round</Link></h2>
        <p>Less cleanup. Cleaner handoff. A plugin that rounds decimal values across layers, frames, text, and components.</p>
        <div className="side-project-actions">
          <Link className="read-link" to="/pixel-round">View case study <ArrowRight aria-hidden="true"/></Link>
          <a className="tool-source-link" href={data.plugin} target="_blank" rel="noopener noreferrer" aria-label="Open Pixel Round in Figma (opens in a new tab)">Open in Figma <OutwardIcon/></a>
        </div>
      </article>
      <article className="side-project article-card" aria-labelledby="uiqa-project-title">
        <Link className="side-project-preview side-project-cover" to="/uiqa" aria-label="Explore UIQA"><ProjectCover path="/uiqa" sizes="(max-width: 900px) calc(100vw - 56px), 45vw"/></Link>
        <small>Open source · MIT</small>
        <h2 id="uiqa-project-title"><Link to="/uiqa">UIQA</Link></h2>
        <p>UX checks before the merge. A CLI and GitHub Action for repeatable UX risks in frontend code, a complement to human review.</p>
        <div className="side-project-actions">
          <Link className="read-link" to="/uiqa">Explore the tool <ArrowRight aria-hidden="true"/></Link>
          <a className="tool-source-link" href="https://github.com/insannurjaman/uiqa" target="_blank" rel="noopener noreferrer" aria-label="View UIQA source on GitHub (opens in a new tab)">View source <OutwardIcon/></a>
        </div>
      </article>
    </section>
  </main>;
}
