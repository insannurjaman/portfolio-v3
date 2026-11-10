import { ANTIFLEX_UI } from "./antiflex-project.js";
import { CLIENT_PORTAL_THUMBNAIL, PRICING_CALCULATOR_THUMBNAIL, ACCELBYTE_DESIGN_SYSTEM_THUMBNAIL } from "./project-thumbnail-overrides.js";

export const CONTACT_EMAIL = "hello.insanz@gmail.com";
export const HIRING_AVAILABILITY = "Open to full-time, contract, and freelance opportunities.";

export const FEATURED_WORK = [
  {
    path: "/ags-pricing-calculator", name: "Pricing Calculator", company: "AccelByte", practice: "Enterprise SaaS · Developer tools",
    image: PRICING_CALCULATOR_THUMBNAIL.src, width: PRICING_CALCULATOR_THUMBNAIL.width, height: PRICING_CALCULATOR_THUMBNAIL.height, imageFit: PRICING_CALCULATOR_THUMBNAIL.fit,
    previews: [
      { label: "Desktop calculator", src: "/media/ags-pricing/calculator.png", width: 1440, height: 3282, alt: "Original desktop calculator showing service configuration and the cost estimate" },
      { label: "Mobile estimate", src: "/media/ags-pricing/mobile-sheet.png", width: 435, height: 838, alt: "Original mobile estimate sheet with itemized services and export actions" },
    ],
    alt: PRICING_CALCULATOR_THUMBNAIL.alt,
    problem: "Game teams need to understand how service choices and workloads affect cloud costs.",
    contribution: "I designed the configuration flow, cost breakdown, mobile estimate access, and download handoff.",
    deliverables: "Desktop and mobile calculator designs with visible assumptions, a cost breakdown, and estimate export.",
  },
  {
    path: "/loyica-client-portal", name: "Client Portal", company: "Saphyte", practice: "Enterprise SaaS · Financial workflows",
    image: CLIENT_PORTAL_THUMBNAIL.src, width: CLIENT_PORTAL_THUMBNAIL.width, height: CLIENT_PORTAL_THUMBNAIL.height, imageFit: CLIENT_PORTAL_THUMBNAIL.fit,
    previews: [
      { label: "Account overview", src: "/media/client-portal/accounts.png", width: 1280, height: 1028, alt: "Original Saphyte Client Portal account overview and account status cards" },
      { label: "Payout eligibility", src: "/media/client-portal/payout-eligibility.png", width: 1280, height: 1618, alt: "Original Saphyte payout eligibility checklist and account summary" },
    ],
    alt: CLIENT_PORTAL_THUMBNAIL.alt,
    problem: "Account context, verification, and payout rules need to stay understandable across a complex portal.",
    contribution: "I redesigned the account-to-payout workflows and the supporting multi-brand design system.",
    deliverables: "Connected portal designs, a reusable multi-brand library, and an interactive Figma demo.",
  },
  {
    path: "/accelbyte-design-system", name: "Admin Design System", company: "AccelByte", practice: "Design systems · Design-to-engineering",
    image: ACCELBYTE_DESIGN_SYSTEM_THUMBNAIL.src, width: ACCELBYTE_DESIGN_SYSTEM_THUMBNAIL.width, height: ACCELBYTE_DESIGN_SYSTEM_THUMBNAIL.height, imageFit: ACCELBYTE_DESIGN_SYSTEM_THUMBNAIL.fit,
    previews: [
      { label: "Responsive page headers", src: "/media/accelbyte-design-system/header-dark.png", width: 1056, height: 698, alt: "Original AccelByte dark page-header patterns at three responsive widths" },
      { label: "Populated data table", src: "/media/accelbyte-design-system/table-default.png", width: 896, height: 538, alt: "Original reusable AccelByte table pattern with populated data" },
      { label: "Empty data state", src: "/media/accelbyte-design-system/table-empty.png", width: 896, height: 538, alt: "Original AccelByte table empty state using the same component structure" },
    ],
    alt: ACCELBYTE_DESIGN_SYSTEM_THUMBNAIL.alt,
    problem: "Admin workflows need consistent patterns across themes, density modes, and product contexts.",
    contribution: "I created tokenized foundations, product-specific components, and documentation on top of Ant Design.",
    deliverables: "Tokenized foundations, theme and density variants, reusable admin patterns, and public component documentation.",
  },
];

export const ENGINEERING_EVIDENCE = [
  { name: ANTIFLEX_UI.title, href: ANTIFLEX_UI.website, description: "Shared tokens, documented components, and a connected workspace.", external: true },
  { name: "UIQA", href: "/uiqa", description: "My open-source CLI and GitHub Action for UX and accessibility checks." },
  { name: "Component documentation", cta: "Explore Component Docs", href: "/design-systems/accelbyte/foundations", description: "Inspect the foundations, component states, and handoff model." },
];

// Owner-reported figures from the supplied resume and original project narrative.
// Missing analytics are made explicit; contribution is not sole-cause attribution.
export const REPORTED_PROJECT_RESULTS = [
  { id: "halodish", measure: "Acquisition conversion", value: "+1,296%", context: "Reported increase for the HaloDish landing page", contribution: "Landing-page design and implementation", period: "Measurement window not supplied", path: "/halodish-apps", project: "HaloDish", source: "Insan’s resume and original project narrative" },
  { id: "activation", measure: "Studio activation", value: "+25%", context: "Reported increase in registered-to-active studio conversion", contribution: "Guided onboarding, homepage previews, and free-trial experience design", period: "Measurement window not supplied", path: "/ags-onboarding", project: "AccelByte", source: "Insan’s resume and original project narrative" },
  { id: "otp", measure: "Operating costs", value: "Rp2.1m", context: "Reported monthly savings in OTP request costs", contribution: "Research, notification guidance, illustration, motion, and flow prototyping", period: "Monthly savings reported; comparison dates unavailable", path: "/improve-otp-push-notification", project: "Tokopedia", source: "Insan’s resume and original project narrative" },
];
