import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./client-portal.css";

export function PortalCaseLinks({ items }) {
  return <section className="ags-case-links ags-case-links-compact" aria-label="Related Saphyte case study"><h2>Explore the connected work</h2><nav aria-label="Explore Saphyte product and system work">{items.map(item => <Link to={item.path} key={item.path}><span><strong>{item.title}</strong><span>{item.summary}</span></span><ArrowUpRight size={20} aria-hidden="true"/></Link>)}</nav></section>;
}

export function PortalTokenMap() {
  return <div className="system-token-table portal-token-map"><table><caption>Source alias for <code>background/bg-brand-soft</code></caption><thead><tr><th scope="col">Semantic mode</th><th scope="col">Primitive reference</th></tr></thead><tbody>
    <tr><th scope="row">InstantFunding · Dark</th><td><code>Colors/Brand/InstantFunding/950</code></td></tr>
    <tr><th scope="row">InstantFunding · Light</th><td><code>Colors/Brand/InstantFunding/50</code></td></tr>
    <tr><th scope="row">VoltFunded · Dark</th><td><code>Colors/Brand/VoltFunded/960</code></td></tr>
    <tr><th scope="row">VoltFunded · Light</th><td><code>Colors/Cyan/50</code></td></tr>
  </tbody></table><p>The source Button uses this semantic role for its fill. The alias chooses the theme value.</p></div>;
}
