import React, { useState } from "react";

export function FeaturedWorkThumbnail({ project }) {
  const [failedSource, setFailedSource] = useState(null);
  return <div className="featured-work-image">
    {failedSource === project.image ? <p className="featured-thumbnail-fallback" role="status">The cover couldn’t load. Use Preview product below to inspect the original screens.</p> : <img src={project.image} alt={project.alt} width={project.width} height={project.height} style={project.imageFit ? { objectFit: project.imageFit } : undefined} loading="lazy" decoding="async" draggable="false" onError={() => setFailedSource(project.image)}/>}
  </div>;
}
