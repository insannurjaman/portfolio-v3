import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SELECTED_IMPACT, IMPACT_ATTRIBUTION } from "./selected-impact-content.js";
import "./selected-impact.css";

export function SelectedImpact() {
  // Reveal the heading and each result separately through the shared controller.
  // Native markup stays readable without JavaScript and with reduced motion.
  return <section className="selected-impact section-pad" id="selected-impact" aria-labelledby="selected-impact-title">
    <header className="selected-impact-heading">
      <p className="selected-impact-eyebrow">SELECTED IMPACT / 2021—2026</p>
      <h2 id="selected-impact-title">Design decisions.<br/>Measurable outcomes.</h2>
      <p>A snapshot of product outcomes across enterprise SaaS, onboarding, billing, and verification workflows.</p>
    </header>
    <ul className="selected-impact-grid" aria-label="Selected business impact">
      {SELECTED_IMPACT.map(item => <li key={item.id}>
        <article className="selected-impact-card" aria-labelledby={`impact-${item.id}`}>
          <p className="selected-impact-company"><span>{item.company}</span><span>{item.context}</span></p>
          <p className="selected-impact-value">{item.metric}</p>
          <h3 id={`impact-${item.id}`}>{item.title}</h3>
          <p className="selected-impact-description">{item.description}</p>
          {item.secondary && <p className="selected-impact-secondary">{item.secondary}</p>}
          {item.qualification && <p className="selected-impact-qualification">{item.qualification}</p>}
          {item.caseStudy && <Link className="selected-impact-link" to={item.caseStudy.path} aria-label={item.caseStudy.label}>Explore case study <ArrowUpRight size={16} aria-hidden="true"/></Link>}
        </article>
      </li>)}
    </ul>
    <p className="selected-impact-attribution">{IMPACT_ATTRIBUTION}</p>
  </section>;
}
