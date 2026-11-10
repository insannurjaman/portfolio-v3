import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import "./experience.css";

export const EXPERIENCE_SOURCE = "https://www.linkedin.com/in/insannurjaman/";

// Experience follows the owner-supplied Insan_Nurjaman_Resume.pdf
// (2026/Novermber 6), including its contribution and metric qualifiers.
export const EXPERIENCE = [
  {
    id: "loyica", company: "Saphyte", role: "UI/UX Designer", type: "Full-time", location: "Remote",
    start: "2025-05", end: "2026-10", period: "May 2025 – Oct 2026",
    summary: "KYC verification, withdrawals, payments, commissions, and E-Afghans application workflows.",
    highlights: [
      "Supported a SaaS platform that recorded 3.7K unique visitors, 52K sessions, and 242K pageviews in 2026 by designing complex workflows for KYC verification, withdrawals, payments, and commission management.",
      "Shipped redesigned KYC verification workflows, coinciding with a 347% increase in Accept-button interactions, from 507 in May to 2,265 in June 2026.",
      "Reduced passport application steps by 33.3%, from 9 to 6 steps, by simplifying the E-Afghans application workflow.",
    ],
    projects: [["Client Portal", "/loyica-client-portal"], ["Client Portal design system", "/loyica-client-portal-design-system"], ["Saphyte & E-Afghans system", "/saphyte-eafghans-design-system"], ["E-Afghan landing page", "/e-afghan-landing-page"], ["Citizen portal", "/e-afghan-citizen-portal"]],
  },
  {
    id: "accelbyte", company: "AccelByte", role: "Product Designer", type: "Full-time", location: "Remote",
    start: "2023-01", end: "2025-05", period: "Jan 2023 – May 2025",
    summary: "Guided onboarding, studio activation, and self-service billing.",
    highlights: [
      "Contributed to a 21.17% average increase in user registrations and a 25% increase in registered-to-active studio conversion by designing guided onboarding, preview, and free-trial experiences.",
      "Contributed to a 19% increase in paid studio conversion by designing self-service billing experiences and developing reusable design system components.",
    ],
    projects: [["Studio onboarding", "/ags-onboarding"], ["Billing & usage", "/ags-billing-usage"], ["Pricing calculator", "/ags-pricing-calculator"]],
  },
  {
    id: "ruangguru", company: "Ruangguru", role: "UI Designer", type: "Full-time", location: "Remote",
    start: "2022-01", end: "2022-11", period: "Jan 2022 – Nov 2022",
    summary: "UI consistency, reusable design-system components, usability testing, and engineering collaboration.",
    highlights: ["Strengthened UI consistency by refining reusable design system components, validating high-fidelity interfaces through usability testing, and collaborating with engineers on implementation."], projects: [],
  },
  {
    id: "tokopedia", company: "Tokopedia", role: "Product Designer", type: "Full-time", location: "Remote",
    start: "2021-03", end: "2021-12", period: "Mar 2021 – Dec 2021",
    summary: "OTP verification success, fewer unnecessary SMS requests, and lower monthly costs.",
    highlights: [
      "Improved OTP verification success rates by approximately 4%, reduced unnecessary SMS OTP requests by 6,000 per month, and saved approximately Rp2.1 million in monthly costs.",
    ],
    projects: [["OTP push notification", "/improve-otp-push-notification"]],
  },
  {
    id: "eftax-2019", company: "Eftax Co., Ltd.", role: "Founding Product Designer", type: "Freelance", location: "Remote",
    start: "2019-09", end: "2021-03", period: "Sep 2019 – Mar 2021",
    summary: "HaloDish landing-page design and implementation for user acquisition conversion.",
    highlights: [
      "Contributed to a 1,296% increase in user acquisition conversion by designing and implementing the HaloDish landing page.",
    ],
    projects: [["HaloDish", "/halodish-apps"], ["DiverMenu", "/divermenu"]],
  },
];

export const experienceSearchPage = {
  path: "/about#experience", title: "Work experience | Insan Nurjaman",
  body: [EXPERIENCE.map(item => `${item.company} ${item.role} ${item.period} ${item.type}. ${item.summary} ${item.highlights.join(" ")}`).join(". ")], images: [],
};

const COMPANY_LOGOS = {
  loyica: { src: "/brand/experience/saphyte-116e5cde.jpg", fullBleed: true, initials: "S" },
  accelbyte: { src: "/brand/experience/accelbyte.svg", initials: "AB" },
  ruangguru: { src: "/brand/experience/ruangguru.png", wordmark: true, initials: "RG" },
  tokopedia: { src: "/brand/worked-with/tokopedia.svg", initials: "T" },
  "eftax-2019": { src: "/brand/worked-with/eftax.svg", initials: "e" },
};

function ExperienceLogo({ id }) {
  const [failed, setFailed] = useState(false);
  const logo = COMPANY_LOGOS[id];
  return <span className={`experience-logo${logo.inverse ? " experience-logo-inverse" : ""}${logo.fullBleed ? " experience-logo-full" : ""}${logo.wordmark ? " experience-logo-wordmark" : ""}`} aria-hidden="true">
    {logo.src && !failed ? <img src={logo.src} alt="" width="56" height="56" loading="lazy" onError={() => setFailed(true)}/> : <span>{logo.initials}</span>}
  </span>;
}

export function ExperienceSection({ resume }) {
  return <section id="experience" className="experience-section section-pad" aria-labelledby="experience-title">
    <div className="experience-intro">
      <div>
      <h2 id="experience-title">Experience</h2>
      <p>Designing products across teams, industries, and stages of growth.</p>
      </div>
      <div className="experience-actions">
        <a href={resume} className="pill-link" target="_blank" rel="noreferrer">View resume <ArrowUpRight size={17}/></a>
        <a href={EXPERIENCE_SOURCE} className="experience-source" target="_blank" rel="noreferrer">LinkedIn profile <ArrowUpRight size={16}/></a>
      </div>
    </div>
    <div className="experience-history"><ol className="experience-list" aria-label="Employment history, most recent first">
      {EXPERIENCE.map(item => <li className="experience-entry" key={item.id}>
        <details className="experience-disclosure">
          <summary aria-label={`${item.role} at ${item.company}, ${item.period}`} aria-describedby={`experience-description-${item.id}`}>
            <ExperienceLogo id={item.id}/>
            <h3 className="experience-entry-heading">
              <span className="experience-role">{item.role}</span>
              <span className="experience-company">{item.company}</span>
              <span className="experience-date"><time dateTime={item.start}>{item.period.split(" – ")[0]}</time><span> – </span><time dateTime={item.end}>{item.period.split(" – ")[1]}</time></span>
            </h3>
            <ChevronDown className="experience-chevron" size={22} aria-hidden="true"/>
            <span className="experience-description" id={`experience-description-${item.id}`}>{item.summary}</span>
          </summary>
          <div className="experience-details">
            <p className="experience-context">{item.type}<span aria-hidden="true"> · </span>{item.location}</p>
            {item.highlights.length > 0 && <ul className="experience-highlights">{item.highlights.map(text => <li key={text}>{text}</li>)}</ul>}
            {item.projects.length > 0 && <div className="experience-projects" aria-label={`Related ${item.company} case studies`}>{item.projects.map(([label,path]) => <Link to={path} key={path}>{label}<ArrowUpRight size={15} aria-hidden="true"/></Link>)}</div>}
          </div>
        </details>
      </li>)}
    </ol>
    <p className="experience-verification">Experience details and results are reported in my resume.</p></div>
  </section>;
}
