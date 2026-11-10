import React from "react";
import { ProjectCover } from "./project-cover.jsx";
import { ANTIFLEX_UI } from "./antiflex-project.js";
import { ArrowUpRight } from "lucide-react";
import "./antiflex-spotlight.css";

export function AntiflexSpotlight({ compact = false }) {
  return <section className={`antiflex-spotlight section-pad${compact ? " is-compact" : ""}`} id="antiflex-ui-highlight" aria-labelledby="antiflex-spotlight-title">
    <span id="chamfer-ui-highlight" className="antiflex-legacy-anchor" aria-hidden="true"/>
    <div className="antiflex-spotlight-layout">
      <div className="antiflex-spotlight-copy">
        <h2 id="antiflex-spotlight-title">{ANTIFLEX_UI.title}</h2>
        <p className="antiflex-spotlight-description">{ANTIFLEX_UI.description}</p>
        <div className="antiflex-spotlight-actions">
          <a href={ANTIFLEX_UI.website} target="_blank" rel="noopener noreferrer" aria-label="Explore antiflex/ui (opens in a new tab)">Explore antiflex/ui <ArrowUpRight size={18} aria-hidden="true"/></a>
          <a href={ANTIFLEX_UI.workspace} target="_blank" rel="noopener noreferrer" aria-label="Try the workspace (opens in a new tab)">Try the workspace <ArrowUpRight size={18} aria-hidden="true"/></a>
        </div>
        <p className="antiflex-spotlight-attribution">Original system by Insan Nurjaman</p>
      </div>
      <div className="antiflex-spotlight-media">
        <div className="antiflex-spotlight-image"><ProjectCover path="/work/design-systems#antiflex-ui-highlight" sizes="(max-width: 767px) calc(100vw - 80px), 50vw"/></div>
      </div>
    </div>
  </section>;
}
