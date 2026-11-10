import React from "react";
import { ArrowUpRight } from "lucide-react";
import "./source-evidence-gallery.css";

export function SourceEvidenceGallery({ block }) {
  return <details className="source-evidence-gallery">
    <summary id={block.id}>{block.title}<span>{block.images.length} original artifacts</span></summary>
    <p>Open any image to inspect it at its published resolution.</p>
    {block.images.map(image => <figure className="story-visual" key={image.src}>
      <a className="image-reveal-frame" data-thumbnail-generation="light" href={image.src} target="_blank" rel="noreferrer" aria-label={`Open ${image.alt} full size`}><img data-thumbnail-source src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async"/></a>
      <figcaption>{image.caption} <a href={image.src} target="_blank" rel="noreferrer">Full size <ArrowUpRight size={14} aria-hidden="true"/></a></figcaption>
    </figure>)}
  </details>;
}
