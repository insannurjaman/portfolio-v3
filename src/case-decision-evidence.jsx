import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import recommendations from "./recommendations-content.json";
import "./case-decision-evidence.css";

function EvidenceScreen({ image }) {
  const [failed, setFailed] = useState(false);
  return <a href={image.src} target="_blank" rel="noreferrer" aria-label={`Open ${image.caption} full size`}>
    {failed ? <span className="decision-screen-fallback">Preview unavailable. Open the original design.</span> : <div className="evidence-image-frame"><img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" onError={() => setFailed(true)}/></div>}
    <span className="decision-screen-label">{image.caption}<ArrowUpRight size={15} aria-hidden="true"/></span>
  </a>;
}

export function CaseDecisionEvidence({ block }) {
  const recommendation = recommendations.recommendations.find(item => item.id === block.recommendationId);
  return <div className="case-decision-evidence">
    <figure className="decision-evidence-figure"><div className="decision-evidence-screens">{block.images.map(image => <EvidenceScreen key={image.src} image={image}/>)}</div><figcaption>{block.caption}</figcaption></figure>
    <div className="decision-evidence-copy"><h3>{block.title}</h3><p>{block.description}</p><p className="decision-evidence-tradeoff"><strong>The trade-off</strong><br/>{block.tradeoff}</p>
      {recommendation && <figure className="decision-recommendation"><blockquote>“{recommendation.excerpt}”</blockquote><figcaption><strong>{recommendation.name}</strong><span>{recommendation.roleLabel}</span><span>{recommendation.relationship}</span><a href={recommendations.sourceUrl} target="_blank" rel="noopener noreferrer">LinkedIn recommendation<ArrowUpRight size={15} aria-hidden="true"/></a></figcaption></figure>}
    </div>
  </div>;
}
