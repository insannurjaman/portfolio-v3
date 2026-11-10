import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, CodeXml } from "lucide-react";
import "./uiqa.css";

const REPO = "https://github.com/insannurjaman/uiqa";
const NPM = "https://www.npmjs.com/package/@insannurjaman/uiqa";
const INSTALL = "npm install -D @insannurjaman/uiqa";
const SCAN = "npx uiqa scan --path ./src --format markdown";
const RULES = `${REPO}/blob/main/docs/rules.md`;
const IMPACT = `${REPO}/blob/main/docs/project-impact.md`;

export const uiqaSearchPage = {
  path: "/uiqa", title: "UIQA - Open-source UI/UX QA tool",
  body: ["An open-source CLI and GitHub Action for UX states, accessibility and design-system checks in frontend code review.", "Built by Insan Nurjaman. Published on npm, MIT licensed, deterministic static analysis."],
  images: [],
};

const examples = [
  { tab: "Product states", id: "UX001", title: "A list with nowhere to go", code: "{items.map(item => (\n  <ProjectCard key={item.id} item={item} />\n))}", risk: "The collection has a populated view, but no visible path for zero items.", suggestion: "Add an empty state that explains what happened and offers a useful next action." },
  { tab: "Accessibility", id: "A11Y002", title: "An action without a name", code: "<button onClick={deleteProject}>\n  <TrashIcon />\n</button>", risk: "The icon conveys an action visually, but does not give the control an accessible name.", suggestion: "Use clear visible text or an accessible label that describes the action." },
  { tab: "Design systems", id: "DS001", title: "A color outside the system", code: "<div style={{ color: \"#ff6548\" }}>\n  Project overview\n</div>", risk: "A literal color in implementation code can bypass the shared design tokens.", suggestion: "Reference a theme value or semantic token so the interface can evolve consistently." },
];

function CopyCommand({ command, label }) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), 2600);
    return () => clearTimeout(timer);
  }, [status]);
  async function copy() {
    try { await navigator.clipboard.writeText(command); setStatus("Copied"); }
    catch { setStatus("Copy unavailable. Select the command to copy it."); }
  }
  return <div className="uiqa-command">
    <code>{command}</code>
    <button type="button" onClick={copy} aria-label={`Copy ${label}`} title={`Copy ${label}`}>{status === "Copied" ? <Check size={18}/> : <Copy size={18}/>}</button>
    <span className="uiqa-copy-status" role="status">{status}</span>
  </div>;
}

function RuleSpotlight() {
  const [selected, setSelected] = useState(0);
  const item = examples[selected];
  function move(event) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? examples.length - 1 : (selected + (event.key === "ArrowRight" ? 1 : -1) + examples.length) % examples.length;
    setSelected(next);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
  }
  return <section className="uiqa-spotlight" aria-label="Explore UIQA rule examples">
    <div className="uiqa-rule-tabs" role="tablist" aria-label="Rule categories">{examples.map((example, i) => <button key={example.id} type="button" role="tab" id={`uiqa-tab-${i}`} aria-selected={selected === i} aria-controls="uiqa-rule-panel" tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={move}>{example.tab}</button>)}</div>
    <div id="uiqa-rule-panel" role="tabpanel" aria-labelledby={`uiqa-tab-${selected}`} tabIndex={0}>
      <div className="uiqa-rule-heading"><span>{item.id}</span><h2>{item.title}</h2></div>
      <pre><code>{item.code}</code></pre>
      <dl className="uiqa-rule-explanation"><div><dt>Review risk</dt><dd>{item.risk}</dd></div><div><dt>Suggested next step</dt><dd>{item.suggestion}</dd></div></dl>
      <p className="uiqa-example-note">Illustrative code example, not a scan of this portfolio. <a href={RULES} target="_blank" rel="noreferrer">Read the rule reference <ArrowUpRight size={13}/></a></p>
    </div>
  </section>;
}

export function UiqaPage() {
  return <main id="main-content" className="uiqa-page">
    <section className="uiqa-intro section-pad">
      <div className="uiqa-intro-copy"><Link className="uiqa-back" to="/side-projects"><ArrowLeft size={16}/> All tools</Link><h1>UIQA</h1><p className="uiqa-lead">UX checks before the merge.</p><p>An open-source CLI and GitHub Action for repeatable product-experience risks in frontend code.</p><div className="uiqa-feature-meta"><span>Built by Insan Nurjaman</span><span>MIT licensed</span></div><div className="uiqa-actions"><a className="pill-link" href={NPM} target="_blank" rel="noreferrer">Get it on npm <ArrowUpRight size={16}/></a><a className="text-link" href={REPO} target="_blank" rel="noreferrer"><CodeXml size={17}/> View source <ArrowUpRight size={16}/></a></div><CopyCommand command={INSTALL} label="install command"/></div>
      <RuleSpotlight/>
    </section>

    <section className="uiqa-context section-pad"><h2>Code can pass.<br/>The experience can still fail.</h2><div><p>I built UIQA to bring repeatable UX review questions into the pull-request workflow. Empty collections, unavailable data, unclear errors, and weak recovery paths can survive a successful build.</p><p>The tool is a complement to engineering checks and human design review. It looks for inspectable implementation patterns, not whether a design is tasteful or whether every user journey works.</p><a className="text-link" href={IMPACT} target="_blank" rel="noreferrer">Why I built it <ArrowUpRight size={16}/></a></div></section>

    <section className="uiqa-capabilities section-pad"><h2>Three layers of review.</h2><dl><div><dt>Product experience</dt><dd>Empty, loading, error and no-result states; form feedback; destructive-action recovery; checkout cues; mobile layout risks.</dd></div><div><dt>Accessible interaction</dt><dd>Text alternatives for images and accessible names for interactive controls.</dd></div><div><dt>Design-system consistency</dt><dd>Hardcoded color and spacing patterns that can bypass shared tokens.</dd></div></dl><a className="text-link" href={RULES} target="_blank" rel="noreferrer">Explore the documented rules <ArrowUpRight size={16}/></a></section>

    <section className="uiqa-quickstart section-pad"><div><h2>Small command.<br/>Useful feedback.</h2><p>Install as a development dependency, then scan the source directory. Reports include severity, category, file locations and suggestions.</p><p>The command below generates Markdown. JSON output is available for automation, and a severity threshold can make findings fail CI.</p><a className="text-link" href={`${REPO}#cli-usage`} target="_blank" rel="noreferrer">Full CLI documentation <ArrowUpRight size={16}/></a></div><div className="uiqa-command-stack"><h3>Install</h3><CopyCommand command={INSTALL} label="install command"/><h3>Scan</h3><CopyCommand command={SCAN} label="scan command"/><h3>Use in pull requests</h3><pre><code>{"- uses: insannurjaman/uiqa@v0.1.1\n  with:\n    path: ./src\n    format: markdown\n    fail-on: high"}</code></pre><a href={`${REPO}#github-action`} target="_blank" rel="noreferrer">GitHub Action setup <ArrowUpRight size={14}/></a></div></section>

    <section className="uiqa-boundaries section-pad"><h2>Deterministic.<br/>Not a substitute for judgment.</h2><p>UIQA is early v0.1 software. It performs static checks without AI or browser rendering. It does not compare screenshots or Figma designs, and it does not replace accessibility, usability, or product testing. Heuristics can miss issues or flag legitimate patterns.</p><p>SARIF, pull-request summary comments, broader framework detection and optional AI adapters are roadmap items, not capabilities claimed here.</p><div className="uiqa-actions"><a className="pill-link" href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">Contribute to UIQA <ArrowUpRight size={16}/></a><a className="text-link" href={NPM} target="_blank" rel="noreferrer">Published npm package <ArrowUpRight size={16}/></a></div><p className="uiqa-source-note">Documentation and npm metadata checked October 8, 2026. Version 0.1.1 is the published version verified for the example workflow.</p></section>
  </main>;
}
