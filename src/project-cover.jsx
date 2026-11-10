import React, { useState } from "react";
import { CASE_PREVIEWS } from "./case-illustrations.js";
import { RENAISSANCE_COVERS } from "./renaissance-covers.js";
import { PROJECT_THUMBNAIL_OVERRIDES } from "./project-thumbnail-overrides.js";
import { AGS_CASES } from "./ags-projects.js";
import "./project-cover.css";

export const PROJECT_COVER_LABELS = {
  "/loyica-client-portal": "Saphyte · Financial UX",
  ...Object.fromEntries(AGS_CASES.map(item => [item.path, `Developer tools · ${item.practice}`])),
  "/halodish-apps": "Food & travel",
  "/divermenu": "AI food discovery",
  "/gococo-ai": "AI creation · Creative commerce",
  "/e-afghan-landing-page": "Public services",
  "/e-afghan-citizen-portal": "Citizen workspace",
};

export function ProjectCover({ path, loading = "lazy", fetchPriority = "auto", sizes = "(max-width: 620px) calc(100vw - 56px), (max-width: 1200px) 45vw, 560px" }) {
  const [failedSource, setFailedSource] = useState(null);
  const image = PROJECT_THUMBNAIL_OVERRIDES[path] || CASE_PREVIEWS[path] || RENAISSANCE_COVERS[path];
  if (!image) return null;
  return <div className={`project-illustration${image.kind === "renaissance" ? " renaissance-cover" : ""}${image.kind === "owner-designed" ? " owner-designed-cover" : ""}${image.panels ? " source-screen-cover" : ""}`}>
    {failedSource === image.src ? <span className="project-illustration-fallback">{image.title}<small>Open the case study to explore the work.</small></span> : image.panels ? image.panels.map(panel => <img key={panel.src} src={panel.src} alt={panel.alt} width={panel.width} height={panel.height} loading={loading} decoding="async" onError={() => setFailedSource(image.src)}/>) : <img src={image.src} srcSet={image.srcSet} sizes={sizes} alt={image.alt} width={image.width} height={image.height} loading={loading} fetchPriority={fetchPriority} decoding="async" onError={() => setFailedSource(image.src)}/>}
  </div>;
}
