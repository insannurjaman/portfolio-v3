import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { isCuratedCase } from "./work-catalog.js";
import { DESIGN_SYSTEM_CASES } from "./design-systems-content.js";
import { SYSTEM_STORY_DOCS } from "./system-docs-data.js";
import { ProjectCover } from "./project-cover";
import { AntiflexSpotlight } from "./antiflex-spotlight.jsx";
import "./design-systems.css";

export function DesignSystemsPage() {
  return <main id="main-content" className="design-systems-page">
    <section className="ds-introduction section-pad">
      <h1>Design systems.</h1>
      <p>Reusable foundations, product patterns, and the practices that connect them. Systems I’ve created and redesigned to support complex product work.</p>
    </section>
    <AntiflexSpotlight/>
    <section className="ds-card-grid section-pad" aria-label="Client design systems">
    {DESIGN_SYSTEM_CASES.filter(item => isCuratedCase(item.path)).map((item, index) => <article key={item.path} className="ds-feature ds-project-card article-card" aria-labelledby={`ds-feature-${index}`}>
      <Link to={item.path} className="ds-feature-media" aria-label={`Explore the ${item.title} case study`}>
        <ProjectCover path={item.path} sizes="(max-width: 620px) calc(100vw - 56px), (max-width: 1024px) 45vw, 30vw"/>
      </Link>
      <small>{item.foundation} · {item.role}</small>
      <h2 id={`ds-feature-${index}`}><Link to={item.path}>{item.title}</Link></h2>
      <p>{item.summary}</p>
      <div className="ds-card-actions">
        <Link className="read-link" to={item.path}>View case study <ArrowRight aria-hidden="true"/></Link>
        <Link className="ds-documentation-link" to={SYSTEM_STORY_DOCS[item.path]}>View documentation <ArrowUpRight size={18} aria-hidden="true"/></Link>
      </div>
    </article>)}
    </section>
    <section className="ds-directory section-pad" aria-labelledby="ds-directory-title">
      <h2 id="ds-directory-title">Inside the systems</h2>
      <nav aria-label="Explore the design-system chapters">
        {DESIGN_SYSTEM_CASES.filter(item => isCuratedCase(item.path)).flatMap(item => item.chapters.map(([title, description, anchor]) => <Link key={`${item.path}-${anchor}`} to={`${item.path}#${anchor}`}><span><strong>{title}</strong><span>{item.title} | {description}</span></span><ArrowUpRight size={20} aria-hidden="true"/></Link>))}
      </nav>
    </section>
  </main>;
}

export function SystemEvidencePreview({ block }) {
  const [selected, setSelected] = useState(block.variants[0].key);
  const [failed, setFailed] = useState(false);
  const variant = block.variants.find(item => item.key === selected) || block.variants[0];
  return <figure className="system-evidence-preview">
    <fieldset><legend>{block.legend}</legend><div className="system-preview-options">{block.variants.map(item => <label key={item.key}><input type="radio" name={`system-${block.variants[0].src}`} value={item.key} checked={selected === item.key} onChange={() => { setSelected(item.key); setFailed(false); }}/><span>{item.label}</span></label>)}</div></fieldset>
    <div className={`system-preview-media ${block.nativeSize ? "system-preview-native" : ""}`} style={block.nativeSize ? undefined : { aspectRatio: `${variant.width} / ${variant.height}` }}>
      {failed ? <p role="status">This preview couldn’t load. Choose another view, or <Link to="/design-systems">return to Design Systems <ArrowUpRight size={16}/></Link>.</p> : <a href={variant.src} style={block.nativeSize ? {maxWidth:variant.width} : undefined} target="_blank" rel="noreferrer" aria-label={`Open ${variant.label} source design at full size`}><img key={variant.src} src={variant.src} width={variant.width} height={variant.height} alt={variant.alt} loading="lazy" decoding="async" onError={() => setFailed(true)}/></a>}
    </div>
    <figcaption>{block.caption}</figcaption>
  </figure>;
}

export function SystemTokenTable() {
  // impeccable-disable design-system-color -- Actual AccelByte source-variable swatches; these are evidence, not portfolio theme colors.
  return <div className="system-token-table"><table><caption>Selected values from the Figma foundation</caption><thead><tr><th scope="col">Token</th><th scope="col">Light / Default</th><th scope="col">Dark / Compact</th></tr></thead><tbody>
    <tr><th scope="row"><code>AccelBlue/6</code></th><td><i style={{ background: "#0b6cff" }} aria-hidden="true"/>#0b6cff</td><td><i style={{ background: "#1f79ff" }} aria-hidden="true"/>#1f79ff</td></tr>
    <tr><th scope="row"><code>fontFamily</code></th><td>Roboto</td><td>SF Pro Text</td></tr>
    <tr><th scope="row"><code>fontSize</code></th><td>14px</td><td>12px</td></tr>
    <tr><th scope="row"><code>controlHeight</code></th><td>32px</td><td>28px</td></tr>
  </tbody></table></div>;
}
