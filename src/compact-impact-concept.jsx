import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { SELECTED_IMPACT, IMPACT_ATTRIBUTION } from "./selected-impact-content.js";
import "./compact-impact-concept.css";

export function CompactImpactConcept() {
  return <section className="compact-impact-concept section-pad" id="selected-impact" aria-labelledby="selected-impact-title">
    <header className="compact-impact-heading">
      <h2 id="selected-impact-title">Selected Impact</h2>
      <p>Reported product results across verification, onboarding, billing, and operating costs.</p>
    </header>
    <ul className="compact-impact-grid" aria-label="Selected business impact">
      {SELECTED_IMPACT.map(item => <li key={item.id}>
        <article aria-labelledby={`impact-${item.id}`}>
          <p className="compact-impact-value">{item.metric}</p>
          <h3 id={`impact-${item.id}`}>{item.title}</h3>
          <p className="compact-impact-company">{item.company}<span>{item.context}</span></p>
          {item.secondary && <p className="compact-impact-note">{item.secondary}</p>}
          {item.qualification && <p className="compact-impact-note">{item.qualification}</p>}
          <details className="compact-impact-details">
            <summary aria-label={`View context for ${item.company} ${item.title}`}>View context <ChevronDown size={16} aria-hidden="true"/></summary>
            <div>
              <p>{item.description}</p>
              {item.caseStudy && <Link to={item.caseStudy.path} aria-label={item.caseStudy.label}>Explore case study <ArrowUpRight size={16} aria-hidden="true"/></Link>}
            </div>
          </details>
        </article>
      </li>)}
    </ul>
    <p className="compact-impact-attribution">{IMPACT_ATTRIBUTION}</p>
  </section>;
}
