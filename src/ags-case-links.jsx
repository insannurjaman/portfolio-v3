import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AGS_CASES } from "./ags-content";
import "./ags-case-studies.css";

export function AGSCaseLinks({ title = "Behind the interface: AccelByte case studies", items = AGS_CASES, compact = false }) {
  return <section className={`ags-case-links ${compact ? "ags-case-links-compact" : "section-pad"}`} aria-label="Related AccelByte case studies">
    <h2>{title}</h2>
    {!compact && <p>Five connected stories covering everything from choosing and estimating a cloud stack to onboarding, billing, and service recovery.</p>}
    <nav aria-label="Explore AccelByte design stories">
      {items.map(item => <Link to={item.path} key={item.path}>
        <span><strong>{item.title}</strong><span>{item.summary}</span></span>
        <ArrowUpRight size={20} aria-hidden="true"/>
      </Link>)}
    </nav>
  </section>;
}
