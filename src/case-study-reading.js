import React from "react";
import { KYC_CASE_PATH } from "./kyc-content.js";

const el = React.createElement;
const missingBaseline = "Baseline and measurement period not published.";
export const BUSINESS_METRIC_EVIDENCE = {
  [KYC_CASE_PATH]: { period: "May to June 2026", contribution: "Client submission, rejection recovery, and administrator review workflow design", evidence: "Owner-supplied resume and Insan’s confirmation that the reported result concerns implementation of this same design. The May 2025 Medium article documents the design process, not this later metric. No original analytics export or isolated experiment is available." },
  "/halodish-apps": { period: "Not available", contribution: "Landing-page design and implementation", evidence: "Owner-supplied resume and original project narrative. No before/after rates, analytics export, or attribution model is available." },
  "/ags-onboarding": { period: "Not available", contribution: "Guided onboarding, homepage previews, and free-trial experience design", evidence: "Owner-supplied resume and original project narrative. No baseline cohort, measurement window, or isolated experiment is available." },
  "/improve-otp-push-notification": { period: "Monthly savings reported; comparison dates unavailable", contribution: "Research, notification guidance, illustration, animation, and verification-flow prototype", evidence: "Owner-supplied resume and original project narrative. No request logs, unit-cost model, or before/after measurement is available." },
};
export const CASE_IMPACT_RECORDS = Object.freeze({
  [KYC_CASE_PATH]: [
    ["KYC Accept-button interactions", "+347%", "507 interactions in May 2026; 2,265 in June 2026. Rounded relative increase: (2,265 - 507) / 507 × 100.", "Reported by Insan for implementation of the same redesign. Button interactions are not unique users, completed verifications, or proof of design as the sole cause."],
  ],
  "/improve-otp-push-notification": [
    ["OTP success rate", "Improved by about 4%", missingBaseline, "Reported by Insan; original outcome statement retained below."],
    ["Wasted OTP requests", "6,000 fewer per month", "Previous request volume and comparison period not published.", "Reported by Insan; underlying request logs not included."],
    ["Request cost", "Rp2.1 million saved per month", "Previous spend and cost calculation not published.", "Reported by Insan; request-cost model not included."],
  ],
  "/ags-onboarding": [
    ["Registered users", "Average increase of 21.17%", missingBaseline, "Reported by Insan for the onboarding work; underlying analytics not included."],
    ["Registered-to-active studio conversion", "Increased by 25%", missingBaseline, "Reported by Insan; no isolated experiment or sole-causation claim."],
  ],
  "/halodish-apps": [
    ["Landing-page user-acquisition conversion", "Increased by 1,296%", missingBaseline, "Reported by Insan for landing-page design and implementation, not app usability or classifier accuracy."],
  ],
  "/game-store-admin-portal": [
    ["Storefront prototype SUS", "73 from 8 respondents", "Single prototype evaluation; no pre-redesign baseline. The admin portal was excluded.", "Original case-study questionnaire and score artifacts retained below."],
  ],
});

function Facts({ items, label, stacked = false }) {
  return el("dl", { className: `case-brief case-context-facts${stacked ? " case-facts-stacked" : ""}`, "aria-label": label },
    items.map(([term, value]) => el("div", { key: term }, el("dt", null, term), el("dd", null, value))));
}

export function CaseStudyReadingBlock({ block }) {
  if (block.type === "case-summary") return el("div", { className: "case-executive-summary" },
    el(Facts, { label: "The problem, my contribution, and the outcome", items: [
      ["The problem", block.problem], ["My contribution", block.contribution], [block.outcomeLabel || "The outcome", block.outcome],
    ] }));
  if (block.type === "case-facts") return el(Facts, block);
  if (block.type === "case-evidence-note") return el("details", { className: "case-evidence-note" },
    el("summary", null, "Evidence & limitations"), el("p", null, block.scope), el("p", null, block.limitation));
  if (block.type === "subheading") return el("h3", { className: "source-subheading", id: block.id }, block.text);
  if (block.type === "case-impact") {
    const rows = CASE_IMPACT_RECORDS[block.path];
    if (!rows) return null;
    const provenance = BUSINESS_METRIC_EVIDENCE[block.path];
    return el("div", { className: "case-impact-evidence" }, provenance && el("section", { className: "case-metric-provenance" },
      el("h3", null, "What supports these numbers"),
      el(Facts, { stacked: true, label: "Metric evidence and attribution limits", items: [
        ["Verification status", "Owner-reported result; not independently verified"],
        ["Measurement period", provenance.period], ["My contribution", provenance.contribution], ["Evidence available", provenance.evidence],
      ] })), rows.map(([measure, result, baseline, source]) =>
      el("section", { className: "case-impact-record", key: measure, "aria-label": measure },
        el("h3", null, measure),
        el("dl", { className: "case-brief case-facts-stacked" },
          el("div", null, el("dt", null, "Reported result"), el("dd", null, result)),
          el("div", null, el("dt", null, "Baseline & comparison"), el("dd", null, baseline)),
          el("div", null, el("dt", null, "Source & scope"), el("dd", null, source))))));
  }
  return null;
}

export const CASE_READING_BLOCK_TYPES = new Set(["case-summary", "case-facts", "subheading", "case-impact", "case-evidence-note"]);
