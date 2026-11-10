import { KYC_CASE_PATH } from "./kyc-content.js";

// Main hiring selection. All original case-study routes and evidence remain available.
export const CURATED_CASE_PATHS = Object.freeze([
  "/loyica-client-portal", "/ags-pricing-calculator", "/accelbyte-design-system",
  "/ags-onboarding", "/halodish-apps", "/improve-otp-push-notification",
]);
export const CURATED_CASE_LABELS = Object.freeze({
  "/loyica-client-portal": "Client Portal",
  "/ags-pricing-calculator": "Pricing Calculator",
  "/accelbyte-design-system": "Admin Design System",
  "/ags-onboarding": "Developer Onboarding",
  "/halodish-apps": "HaloDish",
  "/improve-otp-push-notification": "OTP Notification Flow",
});
const curatedCases = new Set(CURATED_CASE_PATHS);
export const isCuratedCase = path => curatedCases.has(path);

export const WORK_COLLECTIONS = [
  { id: "saas", path: "/work/saas", title: "SaaS & Enterprise", description: "Portals, pricing, billing, and onboarding that make complex services easier to navigate.", cover: "/loyica-client-portal" },
  { id: "design-systems", path: "/work/design-systems", title: "Design Systems & UX Engineering", description: "Shared foundations, reusable product patterns, and practical tools that connect design with implementation.", cover: "/accelbyte-design-system" },
  { id: "mobile", path: "/work/mobile", title: "Mobile Product Design", description: "Discovery, daily tasks, and critical journeys designed around the way people use their phones.", cover: "/halodish-apps" },
  { id: "ai", path: "/work/ai", title: "Experiments", description: "Personal design concepts exploring AI creation and food discovery. These are interface explorations, not shipped AI products or deployed agents.", cover: "/gococo-ai" },
];

export const WORK_INDUSTRIES = {
  "gaming-cloud": "Gaming & Cloud",
  "finance": "Finance & Trading",
  "government": "Government & Public Services",
  "food": "Food & Lifestyle",
  "commerce": "Commerce & Marketplaces",
  "hr": "HR & Employee Benefits",
  "productivity": "Productivity",
  "business": "Business & CRM",
  "developer-tools": "Design & Developer Tools",
  "ai": "AI",
};

// Navigation taxonomy only. Existing case-study evidence and destination URLs stay intact.
export const WORK_PROJECTS = [
  { path: "/loyica-client-portal", collections: ["saas"], industries: ["finance"], kind: "case" },
  { path: "/accelbyte-design-system", collections: ["design-systems"], industries: ["gaming-cloud", "developer-tools"], kind: "case" },
  { path: "/loyica-client-portal-design-system", collections: ["design-systems"], industries: ["finance"], kind: "case" },
  { path: "/saphyte-eafghans-design-system", collections: ["design-systems"], industries: ["government", "business"], kind: "case" },
  ...["/ags-pricing-calculator", "/ags-pricing-experience", "/ags-billing-usage", "/ags-onboarding", "/ags-subscription-lifecycle"].map(path => ({ path, collections: ["saas"], industries: ["gaming-cloud"], kind: "case" })),
  { path: "/halodish-apps", collections: ["mobile"], industries: ["food"], kind: "case" },
  { path: "/gococo-ai", collections: ["ai"], industries: ["ai", "commerce"], kind: "case" },
  { path: "/divermenu", collections: ["ai"], industries: ["food", "ai"], kind: "case" },
  { path: "/e-afghan-landing-page", collections: ["saas"], industries: ["government"], kind: "case" },
  { path: "/e-afghan-citizen-portal", collections: ["saas"], industries: ["government"], kind: "case" },
  { path: "/fincy-apps", collections: ["mobile"], industries: ["finance"], kind: "case" },
  { path: "/game-store-admin-portal", collections: ["saas"], industries: ["gaming-cloud", "commerce"], kind: "case" },
  { path: "/improve-otp-push-notification", collections: ["mobile"], industries: ["commerce"], kind: "case" },
  { path: "/optimizing-the-use-of-allowances", collections: ["mobile"], industries: ["hr", "finance"], kind: "case" },
  { path: "/relling-apps", collections: ["mobile"], industries: ["commerce"], kind: "case" },
  { path: "/shared-calendar-apps", collections: ["mobile"], industries: ["productivity"], kind: "case" },
  { path: KYC_CASE_PATH, collections: ["saas"], industries: ["business", "finance"], kind: "case" },
  { path: "/work/design-systems#antiflex-ui-highlight", collections: ["design-systems"], industries: ["developer-tools"], kind: "spotlight", title: "antiflex/ui" },
  { path: "/uiqa", collections: ["design-systems"], industries: ["developer-tools"], kind: "tool", title: "UIQA", description: "A CLI and GitHub Action for repeatable UX risks in frontend code. Deterministic static checks that support human review." },
  { path: "/pixel-round", collections: ["design-systems"], industries: ["developer-tools"], kind: "tool", title: "Pixel Round", description: "A focused Figma plugin that rounds decimal values across layers, frames, text, and components." },
  { path: "/ai", collections: ["ai"], industries: ["ai"], kind: "archive", title: "AI interface explorations", description: "Explore the existing public AI design archive. These are interface explorations, not a shipped agent case study." },
];

export function projectsForCollection(id) {
  return WORK_PROJECTS.filter(project => project.collections.includes(id) && (
    id === "ai" || isCuratedCase(project.path) || project.kind === "spotlight" || project.path === "/uiqa"
  ));
}
export function industryOptions(id) {
  const projects = projectsForCollection(id);
  return Object.entries(WORK_INDUSTRIES).map(([value, label]) => ({ value, label, count: projects.filter(project => project.industries.includes(value)).length })).filter(option => option.count > 0);
}
export function selectedIndustry(id, requested) {
  return industryOptions(id).some(option => option.value === requested) ? requested : "all";
}
export function filteredWork(id, requested = "all") {
  const industry = selectedIndustry(id, requested);
  return projectsForCollection(id).filter(project => industry === "all" || project.industries.includes(industry));
}
export const workCollectionSearchPages = Object.fromEntries([
  { path: "/work", title: "Selected Work", body: ["Six selected case studies across enterprise SaaS, design systems, onboarding, and mobile products."], images: [] },
  ...WORK_COLLECTIONS.map(collection => ({ path: collection.path, title: collection.title, body: [collection.description, ...industryOptions(collection.id).map(option => option.label)], images: [] })),
].map(page => [page.path, page]));

// Empty search starts with the hiring selection; deliberate searches can still find
// an older project by its title, without filling broad queries with archived prose.
export function portfolioSearchResults(pages, query = "") {
  const q = query.trim().toLowerCase();
  if (!q) return [...CURATED_CASE_PATHS, "/#experience", "/side-projects"].map(path => pages[path]).filter(Boolean);
  const archived = new Set(WORK_PROJECTS.filter(item => item.kind === "case" && !isCuratedCase(item.path)).map(item => item.path));
  return Object.values(pages).filter(page => {
    if (page.path === "/404") return false;
    const title = page.title.toLowerCase();
    if (archived.has(page.path)) return title.includes(q);
    return (title + " " + (page.body || []).slice(0, 4).join(" ").toLowerCase()).includes(q);
  }).sort((a, b) => Number(b.title.toLowerCase().includes(q)) - Number(a.title.toLowerCase().includes(q)) || Number(isCuratedCase(b.path)) - Number(isCuratedCase(a.path))).slice(0, 8);
}
