import { SYSTEM_DOCS, docsTopics } from "./system-docs-data.js";
export const SITE_ORIGIN = "https://insanlab.vercel.app";
export const SOCIAL_IMAGE = Object.freeze({
  url: `${SITE_ORIGIN}/social/insan-portfolio-16201396.png`,
  width: 1734, height: 907, type: "image/png",
  alt: "Insan Nurjaman portfolio: product design across SaaS, design systems, mobile products, and AI experiences.",
});
const overrides = {
  "/": ["Insan Nurjaman | Product Designer · Enterprise UX & Design Systems", "Product designer with 7+ years across complex workflows, enterprise SaaS, design systems, and design-to-engineering. Explore selected work and contact Insan."],
  "/uiqa": ["UIQA | Open-source UX QA CLI & GitHub Action | Insan Nurjaman", "UIQA is Insan Nurjaman’s open-source CLI and GitHub Action for checking UX states, accessibility risks, and design-system consistency in frontend code."],
  "/pixel-round": ["Pixel Round | Figma Plugin | Insan Nurjaman", "A Figma plugin by Insan Nurjaman for rounding fractional values and cleaning up design files. Explore the workflow and original implementation."],
  "/about": ["About Insan Nurjaman | Experience & Product Design Practice", "Explore Insan’s product design experience across Saphyte, AccelByte, Ruangguru, Tokopedia, and Eftax, plus his design systems and engineering practice."],
  "/work": ["Selected Work | Insan Nurjaman", "Explore six selected product design case studies across enterprise SaaS, design systems, onboarding, and mobile products, with original artifacts and clear personal contributions."],
  "/side-projects": ["Design & Engineering Tools | Insan Nurjaman", "Explore UIQA and Pixel Round, tools built by Insan Nurjaman to connect design decisions, implementation, and repeatable quality checks."],
};
export function pageMetadata(pathname, pages = {}) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  let canonicalPath = path;
  let page = pages[path];
  if (path.startsWith("/design-systems/")) {
    const [, , system, ...parts] = path.split("/");
    const data = SYSTEM_DOCS[system];
    const topic = docsTopics(system).find(item => item.id === (parts.join("/") || "foundations"));
    if (data && topic) {
      page = { title: `${data.name} ${topic.title} | Public Design System Documentation`, body: [data.description] };
      if (!parts.length) canonicalPath = `${path}/foundations`;
    }
  }
  const [title, description] = overrides[path] || [
    page?.title ? `${page.title} | Insan Nurjaman` : "Insan Nurjaman | Product Design Portfolio",
    (page?.body?.[0] || "Explore Insan Nurjaman’s product design work, original artifacts, design systems, and working tools.").replace(/\s+/g, " ").slice(0, 190),
  ];
  return { title, description, canonical: `${SITE_ORIGIN}${canonicalPath}`, image: SOCIAL_IMAGE.url, imageWidth: SOCIAL_IMAGE.width, imageHeight: SOCIAL_IMAGE.height, imageType: SOCIAL_IMAGE.type, imageAlt: SOCIAL_IMAGE.alt, type: path.startsWith("/articles/") ? "article" : "website" };
}
