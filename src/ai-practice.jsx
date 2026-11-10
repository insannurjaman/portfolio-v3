import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { AI_INTRO, AI_PROJECTS, AI_RESPONSIBILITIES, ROUNDING_EXAMPLE, projectForKey } from "./ai-practice-content.js";
import "./ai-practice.css";
import { ProjectCover } from "./project-cover.jsx";

function ProjectLink({ action }) {
  if (action.external) return <a href={action.href} target="_blank" rel="noopener noreferrer" aria-label={`${action.label} (opens in a new tab)`}>{action.label}<ArrowUpRight size={18} aria-hidden="true"/></a>;
  return <Link to={action.href}>{action.label}<ArrowRight size={18} aria-hidden="true"/></Link>;
}

export function ProjectArtifact({ project }) {
  return <figure className={`ai-artifact ai-artifact-${project.artifact}`}>
    {project.artifact === "image" && <img src={project.image} alt={project.imageAlt} width="1280" height="720" decoding="async"/>}
    {project.artifact === "command" && <div className="ai-command-example">
      <div className="ai-command-heading"><span>Install. Scan. Review.</span><span>CLI + GitHub Action</span></div>
      <pre><code><span className="ai-command-comment"># Install</span>{"\nnpm install -D @insannurjaman/uiqa\n\n"}<span className="ai-command-comment"># Review UX risks</span>{"\nnpx uiqa scan --path ./src --format markdown"}</code></pre>
    </div>}
    {project.artifact === "rounding" && <div className="ai-rounding-example">
      {[{ label: "Before", field: "before" }, { label: "After rounding", field: "after" }].map(column => <div key={column.field}>
        <p>{column.label}</p>
        <dl>{ROUNDING_EXAMPLE.map(value => <div key={value.label}><dt>{value.label}</dt><dd>{value[column.field]}</dd></div>)}</dl>
      </div>)}
    </div>}
    <figcaption>{project.caption}</figcaption>
  </figure>;
}

export function AiPracticePage() {
  const [selected, setSelected] = useState(AI_PROJECTS[0].id);
  const [vertical, setVertical] = useState(false);
  const tabs = useRef({});
  const project = AI_PROJECTS.find(item => item.id === selected);

  useEffect(() => {
    const previous = document.title;
    document.title = "AI Practice | Insan Nurjaman";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const updateOrientation = () => setVertical(desktop.matches);
    updateOrientation();
    desktop.addEventListener("change", updateOrientation);
    return () => { document.title = previous; desktop.removeEventListener("change", updateOrientation); };
  }, []);

  const handleProjectKey = (event, id) => {
    const next = projectForKey(id, event.key);
    if (!next) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus({ preventScroll: true });
    tabs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  };

  return <main id="main-content" className="ai-practice-page">
    <header className="ai-practice-intro">
      <div>
        <h1>Design-led. AI-assisted.</h1>
        {AI_INTRO.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <p className="ai-practice-distinction">Built with AI assistance, not presented as AI-powered products.</p>
      </div>
      <a className="portfolio-primary" href="#ai-workbench">Explore the builds <ArrowDown size={18} aria-hidden="true"/></a>
    </header>

    <section className="ai-workbench" id="ai-workbench" aria-label="AI-assisted builds">
      <div className="ai-project-tabs" role="tablist" aria-label="Projects" aria-orientation={vertical ? "vertical" : "horizontal"}>
        {AI_PROJECTS.map(item => <button
          key={item.id} ref={node => { tabs.current[item.id] = node; }}
          type="button" role="tab" id={`ai-tab-${item.id}`} aria-selected={selected === item.id}
          aria-controls="ai-project-panel" tabIndex={selected === item.id ? 0 : -1}
          onClick={() => setSelected(item.id)} onKeyDown={event => handleProjectKey(event, item.id)}
        >{item.title}</button>)}
      </div>
      <div className="ai-project-panel" role="tabpanel" id="ai-project-panel" aria-labelledby={`ai-tab-${selected}`} tabIndex={0}>
        <div className="ai-project-artifact" key={selected}><ProjectCover path={project.coverPath} sizes="(max-width: 1023px) calc(100vw - 80px), 70vw"/></div>
        <div className="ai-project-details">
          <div className="ai-project-summary">
            <div><h2>{project.title}</h2><p>{project.description}</p></div>
            <div className="ai-project-actions">{project.actions.map(action => <ProjectLink key={action.href} action={action}/>)}</div>
          </div>
          <dl className="ai-project-responsibilities">
            <div><dt>My role</dt><dd>{project.role}</dd></div>
            <div><dt>AI contribution</dt><dd>{project.assistance}</dd></div>
          </dl>
          <details className="ai-project-evidence"><summary>Inspect the working example</summary><ProjectArtifact project={project}/></details>
          <div className="ai-project-story">{project.story.map(chapter => <section key={chapter.title}><h3>{chapter.title}</h3><p>{chapter.body}</p></section>)}</div>
        </div>
      </div>
    </section>

    <section className="ai-practice-responsibility" aria-labelledby="ai-responsibility-title">
      <h2 id="ai-responsibility-title">What I bring to an AI-assisted build.</h2>
      <dl>{AI_RESPONSIBILITIES.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.body}</dd></div>)}</dl>
      <div className="ai-practice-next"><Link to="/work">Work <ArrowRight size={18} aria-hidden="true"/></Link><Link to="/side-projects">Tools <ArrowRight size={18} aria-hidden="true"/></Link></div>
    </section>
  </main>;
}
