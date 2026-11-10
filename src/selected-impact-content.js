import { KYC_CASE_PATH } from "./kyc-content.js";

// Owner-reported resume figures supplied in the Selected Impact brief.
// A null case study deliberately avoids linking a figure to unsupported evidence.
export const SELECTED_IMPACT = Object.freeze([
  {
    id: "saphyte-kyc", metric: "+347%", title: "KYC interactions",
    company: "Saphyte", context: "KYC Verification",
    description: "Accept-button interactions increased from 507 in May to 2,265 in June 2026, coinciding with the KYC redesign rollout.",
    qualification: "Button interactions, not a verified increase in successful KYC completion.",
    comparison: { before: 507, after: 2265, beforePeriod: "May 2026", afterPeriod: "June 2026" },
    caseStudy: { path: KYC_CASE_PATH, label: "Explore Saphyte KYC verification case study" },
  },
  {
    id: "accelbyte-activation", metric: "+25%", title: "Studio activation",
    company: "AccelByte", context: "Onboarding & Activation",
    description: "Increase in registered-to-active studio conversion associated with redesigned onboarding, preview, and free-trial experiences.",
    caseStudy: { path: "/ags-onboarding", label: "Explore AccelByte onboarding case study" },
  },
  {
    id: "accelbyte-paid", metric: "+19%", title: "Paid conversion",
    company: "AccelByte", context: "Billing & Monetization",
    description: "Increase in conversion to paying studios associated with self-service billing experiences.",
    caseStudy: null,
  },
  {
    id: "tokopedia-otp", metric: "6,000", title: "Fewer SMS requests / month",
    company: "Tokopedia", context: "OTP Verification",
    description: "Reduced unnecessary OTP requests by approximately 6,000 per month.",
    secondary: "Estimated monthly savings: Rp2.1 million.",
    caseStudy: { path: "/improve-otp-push-notification", label: "Explore Tokopedia OTP verification case study" },
  },
]);

export const IMPACT_ATTRIBUTION = "Figures reported in my resume; not independently verified. They do not establish design as the sole cause. Baselines and comparison periods are unavailable for the AccelByte and Tokopedia results.";
