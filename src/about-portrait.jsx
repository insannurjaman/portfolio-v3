import React from "react";

export function AboutPortrait({ original }) {
  return <figure className="about-portrait">
    <img className="portrait-original" src={original.src} srcSet={original.srcSet}
      sizes="(max-width: 900px) 90vw, (min-width: 1600px) 680px, 45vw"
      width="1600" height="1589" alt="Portrait of Insan Nurjaman."
      fetchPriority="high" decoding="async" draggable="false"/>
  </figure>;
}
