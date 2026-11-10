import React, { useEffect } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectCover } from "./project-cover.jsx";
import { AntiflexSpotlight } from "./antiflex-spotlight.jsx";
import { WORK_COLLECTIONS, WORK_INDUSTRIES, projectsForCollection, industryOptions, selectedIndustry, filteredWork, CURATED_CASE_PATHS } from "./work-catalog.js";
import "./work-collections.css";
import { ANTIFLEX_UI } from "./antiflex-project.js";

function useWorkTitle(title) {
  useEffect(() => { const previous = document.title; document.title = `${title} | Insan Nurjaman`; return () => { document.title = previous; }; }, [title]);
}

export function WorkHub({ data, CaseCard }) {
  useWorkTitle("Selected Work");
  return <main id="main-content" className="inner-page work-hub">
    <header className="page-hero" data-scroll-generation-contents><h1 data-text-reveal="headline">Selected work.</h1><div className="page-hero-bottom" data-scroll-generation-contents><p data-text-reveal="description">Six case studies across enterprise SaaS, design systems, onboarding, and mobile products.</p></div></header>
    <section className="case-grid curated-case-grid section-pad" aria-labelledby="work-projects-title">
      <h2 id="work-projects-title" className="sr-only">Selected case studies</h2>
      {CURATED_CASE_PATHS.map((path, index) => <CaseCard key={path} item={data.pages[path]} index={index} headingFirst/>)}
    </section>
    <section className="curated-work-support section-pad" id="antiflex-ui-highlight" aria-labelledby="work-tools-title">
      <span id="chamfer-ui-highlight" aria-hidden="true"/>
      <h2 id="work-tools-title">Design, implemented.</h2><p>For working components and practical review tools, explore <a href={ANTIFLEX_UI.website} target="_blank" rel="noopener noreferrer">antiflex/ui <ArrowUpRight size={16} aria-hidden="true"/></a> and <Link to="/uiqa">UIQA <ArrowRight size={16} aria-hidden="true"/></Link>.</p>
    </section>
  </main>;
}

function AuxiliaryWorkCard({ project }) {
  return <Link className="work-aux-card case-card article-card" to={project.path}>
    <div className="work-aux-media"><ProjectCover path={project.path}/></div>
    <small>{project.kind === "archive" ? "Interface exploration archive" : "UX engineering · Design tool"}</small>
    <h3>{project.title}</h3><p>{project.description}</p>
    <span className="read-link">{project.kind === "archive" ? "View explorations" : "Explore the tool"}<ArrowRight aria-hidden="true"/></span>
  </Link>;
}

export function WorkLandingPage({ collectionId, data, CaseCard }) {
  const collection = WORK_COLLECTIONS.find(item => item.id === collectionId);
  const [params, setParams] = useSearchParams();
  const industry = selectedIndustry(collectionId, params.get("industry"));
  const options = industryOptions(collectionId);
  const projects = filteredWork(collectionId, industry);
  const total = projectsForCollection(collectionId).length;
  useWorkTitle(collection.title);
  function choose(value) {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete("industry"); else next.set("industry", value);
    setParams(next, { replace: true, preventScrollReset: true, state: { preserveWorkScroll: true } });
  }
  return <main id="main-content" className="inner-page work-collection-page">
    <header className="page-hero">
      <Link className="work-collection-back" to="/work"><ArrowLeft size={16} aria-hidden="true"/> Selected work</Link>
      <h1>{collection.title}</h1><div className="page-hero-bottom"><p>{collection.description}</p></div>
    </header>
    {collectionId !== "ai" && <nav className="work-collection-switcher" aria-label="Work collections">{WORK_COLLECTIONS.filter(item => item.id !== "ai").map(item => <NavLink key={item.id} to={item.path} end>{item.title}<ArrowUpRight size={16} aria-hidden="true"/></NavLink>)}</nav>}
    <section className="work-industry-filter section-pad" aria-labelledby="work-industry-filter-title">
      <div className="work-filter-heading"><h2 id="work-industry-filter-title">Explore work by industry</h2><p role="status" aria-live="polite" aria-atomic="true">{projects.length} {projects.length === 1 ? "work item" : "work items"}{industry !== "all" ? ` in ${WORK_INDUSTRIES[industry]}` : ""}</p></div>
      <div className="work-filter-options" role="group" aria-labelledby="work-industry-filter-title">
        <button type="button" aria-pressed={industry === "all"} aria-controls="work-collection-results" onClick={() => choose("all")}>All industries <span>{total}</span></button>
        {options.map(option => <button type="button" key={option.value} aria-pressed={industry === option.value} aria-controls="work-collection-results" onClick={() => choose(option.value)}>{option.label}<span>{option.count}</span></button>)}
      </div>
    </section>
    <div id="work-collection-results" className="work-collection-results">
      {projects.some(project => project.kind === "spotlight") && <AntiflexSpotlight/>}
      {projects.length ? <section className="case-grid case-grid-all section-pad" aria-label={`${collection.title} projects`}>
        {projects.filter(project => project.kind !== "spotlight").map((project, index) => project.kind === "case" ? <CaseCard key={project.path} item={data.pages[project.path]} index={index}/> : <AuxiliaryWorkCard key={project.path} project={project}/>)}
      </section> : <div className="work-filter-empty section-pad"><h2>No projects in this selection.</h2><button type="button" onClick={() => choose("all")}>Show all industries</button></div>}
    </div>
  </main>;
}
