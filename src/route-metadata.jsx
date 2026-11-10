import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMetadata } from "./seo.js";

export function RouteMetadata({ pages }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = pageMetadata(pathname, pages);
    document.title = meta.title;
    const set = (attribute, name, content) => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, name); document.head.append(element); }
      element.content = content;
    };
    set("name", "description", meta.description);
    for (const [name, value] of Object.entries({ title: meta.title, description: meta.description, image: meta.image, "image:width": meta.imageWidth, "image:height": meta.imageHeight, "image:type": meta.imageType, "image:alt": meta.imageAlt, url: meta.canonical, type: meta.type })) set("property", `og:${name}`, value);
    set("name", "twitter:card", "summary_large_image");
    set("name", "twitter:title", meta.title);
    set("name", "twitter:description", meta.description);
    set("name", "twitter:image", meta.image);
    set("name", "twitter:image:alt", meta.imageAlt);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = meta.canonical;
    // Legacy page effects may set a title during Strict Mode's extra mount.
    // The route metadata remains authoritative after that mount completes.
    const frame = requestAnimationFrame(() => { document.title = meta.title; });
    return () => cancelAnimationFrame(frame);
  }, [pathname, pages]);
  return null;
}
