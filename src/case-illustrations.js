import { KYC_CASE_PATH } from "./kyc-content.js";
import { GOCOCO_PATH } from "./gococo-content.js";
import { RENAISSANCE_COVERS } from "./renaissance-covers.js";
import { PROJECT_THUMBNAIL_OVERRIDES } from "./project-thumbnail-overrides.js";
// Owner-supplied numbered thumbnail illustrations. Evidence screenshots remain unchanged.
const entries = [
  [1, "/loyica-client-portal", "Client Portal: clarity across trading workflows"],
  [2, "/accelbyte-design-system", "Building AccelByte’s design system for complex admin workflows"],
  [3, "/loyica-client-portal-design-system", "A shared design system for branded client portals"],
  [4, "/saphyte-eafghans-design-system", "Saphyte & E-Afghans: one core, distinct identities"],
  [5, "/ags-pricing-calculator", "From game requirements to a cost estimate"],
  [6, "/ags-pricing-experience", "Choosing the right game-cloud offering"],
  [7, "/ags-billing-usage", "Making cloud billing understandable"],
  [8, "/ags-onboarding", "From first login to game setup"],
  [9, "/ags-subscription-lifecycle", "A trustworthy subscription lifecycle"],
  [10, "/halodish-apps", "HaloDish Apps"],
  [11, "/divermenu", "DiverMenu"],
  [12, "/e-afghan-landing-page", "E-Afghan Landing Page Redesign"],
  [13, "/e-afghan-citizen-portal", "E-Afghan Citizen Portal"],
  [14, "/fincy-apps", "Fincy Apps"],
  [15, "/game-store-admin-portal", "Game Store & Admin Portal"],
  [16, "/improve-otp-push-notification", "Improve OTP Push Notification"],
  [17, "/optimizing-the-use-of-allowances", "Optimizing the Use of Allowances"],
  [18, "/relling-apps", "Relling Apps"],
  [19, "/shared-calendar-apps", "Shared Calendar Apps"],
];

export const CASE_ILLUSTRATIONS = Object.fromEntries(entries.map(([number, path, title]) => {
  const base = `/media/case-illustrations/${String(number).padStart(2, "0")}`;
  return [path, { number, title, src: `${base}-1672.webp`, srcSet: `${base}-836.webp 836w, ${base}-1672.webp 1672w`, width: 1672, height: 941, alt: `Thumbnail illustration for ${title}` }];
}));

// Preserve the original illustrations and source screen composition as historical assets.
// Owner-designed covers take priority; other cases retain their Renaissance art.
export const CASE_PREVIEWS = Object.fromEntries([...Object.keys(CASE_ILLUSTRATIONS), GOCOCO_PATH, KYC_CASE_PATH].map(path => [path, PROJECT_THUMBNAIL_OVERRIDES[path] || RENAISSANCE_COVERS[path]]));
