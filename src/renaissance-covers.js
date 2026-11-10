// Editorial metaphors for project discovery. Source UI evidence stays in each case study.
const entries = [
  ["/loyica-client-portal", "client-portal", "Client Portal", "A Renaissance banking arch framing glass account, verification and payout panels"],
  ["/accelbyte-design-system", "admin-design-system", "AccelByte Admin Design System", "Reusable marble interface components and blue design tokens in a classical atelier"],
  ["/loyica-client-portal-design-system", "portal-system", "Client Portal Design System", "A brass master template and three coordinated branded portal layouts on a Renaissance desk"],
  ["/saphyte-eafghans-design-system", "saphyte-system", "Saphyte & E-Afghans Design System", "Two classical product doorways connected by a shared modular marble core"],
  ["/ags-pricing-calculator", "pricing-calculator", "AccelByte Pricing Calculator", "A sculpted marble hand supporting a brass calculator and cloud-service estimate panel"],
  ["/ags-pricing-experience", "pricing-experience", "AccelByte Pricing Experience", "A bronze balance comparing glass cloud-service plans in a Renaissance observatory"],
  ["/ags-billing-usage", "billing", "AccelByte Billing & Usage", "A brass lens resolving cloud-service usage into an orderly glass billing ledger"],
  ["/ags-onboarding", "onboarding", "AccelByte Onboarding", "A guided sequence of marble steps from an account key to game-cloud setup"],
  ["/ags-subscription-lifecycle", "subscription", "AccelByte Subscription Lifecycle", "A Renaissance astronomical clock connecting subscription states around a cloud-service core"],
  ["/halodish-apps", "halodish", "HaloDish", "A classical traveller discovering food and places through a mobile map in a Japanese garden"],
  ["/divermenu", "divermenu", "DiverMenu", "A Renaissance dining still life connecting conversation, food preferences and saved dishes"],
  ["/e-afghan-landing-page", "public-services", "E-Afghan Public Website", "A welcoming civic loggia with clear service directories and a route to an account portal"],
  ["/e-afghan-citizen-portal", "citizen-portal", "E-Afghan Citizen Portal", "A marble civic desk with staged application panels, documents and review seals"],
  ["/fincy-apps", "fincy", "Fincy", "An open Renaissance learning folio connecting financial content, consultation and discussion"],
  ["/game-store-admin-portal", "game-store", "Game Store & Admin Portal", "A classical game emporium connecting a digital storefront with an organized admin catalogue"],
  ["/improve-otp-push-notification", "otp", "OTP Push Notification", "A brass messenger mechanism delivering a secure verification seal to a glass phone"],
  ["/optimizing-the-use-of-allowances", "allowances", "Employee Allowances", "A Renaissance steward arranging employee benefit allocations into clear glass compartments"],
  ["/relling-apps", "relling", "Relling", "A Renaissance rental marketplace presenting borrowing, listings and return journeys"],
  ["/shared-calendar-apps", "calendar", "Shared Calendar", "An ivory calendar and interlocking appointment ribbons coordinating a Renaissance workshop"],
  ["/gococo-ai", "gococo", "GoCoco AI", "A Renaissance portrait transforming into selectable artwork and a wearable product preview"],
  ["/saphyte-kyc-verification", "saphyte-kyc", "Saphyte KYC Verification", "A marble hand arranging glass identity documents beside a review lens and approval and revision seals in a Renaissance atelier"],
  ["/work/design-systems#antiflex-ui-highlight", "chamfer", "antiflex/ui", "Modular marble components, shared tokens and a glass workspace in a classical stonemason atelier"],
  ["/uiqa", "uiqa", "UIQA", "A Renaissance inspection lens examining interface geometry beside an ordered review checklist"],
  ["/pixel-round", "pixel-round", "Pixel Round", "A precision brass tool aligning fractional marble tiles to a clean whole-pixel grid"],
  ["/ai", "ai-explorations", "AI Interface Explorations", "A Renaissance cabinet of creative glass interface studies and a luminous sculptural idea orb"],
];

export const RENAISSANCE_COVERS = Object.fromEntries(entries.map(([path, asset, title, alt]) => {
  const base = `/media/renaissance-covers/${asset}`;
  return [path, { title, src: `${base}-1448.webp`, srcSet: `${base}-724.webp 724w, ${base}-1448.webp 1448w`, width: 1448, height: 1086, alt: `Renaissance illustration: ${alt}`, kind: "renaissance" }];
}));
