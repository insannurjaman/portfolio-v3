import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "./hiring-content.js";
import { KYC_CASE_PATH, KYC_SCREENS } from "./kyc-content.js";
import { PROJECT_THUMBNAIL_OVERRIDES, ANTIFLEX_UI_THUMBNAIL } from "./project-thumbnail-overrides.js";
import { ANTIFLEX_UI } from "./antiflex-project.js";
import { PORTFOLIO_LINKEDIN, PORTFOLIO_PORTRAIT } from "./portfolio-shell.jsx";
import { GitHubContributions } from "./github-contributions.jsx";
import { HomeExperience } from "./experience.jsx";
import { Recommendations } from "./recommendations.jsx";
import "./portfolio-home.css";

const art = "/brand/portfolio-home";
const work = [
  { path: "/halodish-apps", title: "Designing HaloDish for Halal Food Discovery in Japan",
    description: <>I designed the iOS and Android experience for finding halal restaurants and prayer spaces and checking packaged ingredients. I also designed and built the landing page, which saw a reported <strong>1,296%</strong> increase in visitor-to-user conversion.</> },
  { path: "/improve-otp-push-notification", title: "6,000 Fewer SMS OTP Requests per Month at Tokopedia",
    description: <>I redesigned the sign-in instructions and used animation to show users where to find the verification request in the Tokopedia app. The project reported about <strong>6,000</strong> fewer unnecessary SMS requests per month and estimated monthly savings of <strong>Rp2.1 million</strong>.</> },
  { path: "/ags-onboarding", title: "From First Login to Game Setup at AccelByte",
    description: <>I designed guided onboarding, a homepage that points studios toward game setup, and clearer free-trial guidance. The project reported a <strong>25%</strong> increase in registered-to-active studio conversion.</> },
  { path: KYC_CASE_PATH, title: "Redesigning Identity Verification for Saphyte Clients and Reviewers",
    image: KYC_SCREENS["admin-queue"],
    description: <>I redesigned how clients submit documents, understand rejections, and replace files, while giving reviewers the context to make a decision. Reported KYC Accept-button clicks rose from <strong>507 to 2,265</strong> between May and June 2026.</> },
];
const projects = [
  { path: "/pixel-round", title: "Pixel Round", description: "A Figma plugin I built to round decimal values across layers, frames, text, and components for cleaner handoff." },
  { path: "/uiqa", title: "UIQA", description: "An open-source CLI and GitHub Action I built to flag recurring UX issues in frontend code before merge." },
];
const brands = [
  ["accelbyte", "AccelByte", 129, 28],
  ["ruangguru", "Ruangguru", 80, 35],
  ["tokopedia", "Tokopedia", 147, 29],
  ["eftax", "Eftax", 55, 35],
];
function CompanyLogoList({ duplicate = false }) {
  return <ul role="list" aria-hidden={duplicate || undefined}>
    <li className="home-saphyte-logo"><span className="sr-only">Saphyte</span>
      {Array.from({ length: 7 }, (_, index) => <img key={index} src={`${art}/saphyte-${index + 1}.svg`} alt=""/>)}
    </li>
    {brands.map(([asset, label, width, height]) => <li key={asset}>
      <img src={`${art}/${asset}.svg`} alt={label} width={width} height={height}/>
    </li>)}
  </ul>;
}

function CompanyLogos() {
  return <section className="home-companies" id="company-list" aria-labelledby="home-companies-title">
    <h2 id="home-companies-title">Trusted design partner for companies worldwide</h2>
    <div className="home-company-rail">
      <div className="home-company-track">
        <CompanyLogoList/>
        <CompanyLogoList duplicate/>
      </div>
    </div>
  </section>;
}

function HomeCover({ image }) {
  return <img className="home-card-image" src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async"/>;
}

function HomeCard({ project, selected = false }) {
  return <article className={`home-card${project.image ? " home-card-source" : ""}`}>
    <Link to={project.path} state={selected ? { fromSelectedWork: true } : undefined} aria-label={project.title} data-funnel={selected ? "selected_case" : undefined}>
      <HomeCover image={project.image || PROJECT_THUMBNAIL_OVERRIDES[project.path]}/>
      <h3>{project.title}</h3>
    </Link>
    <p>{project.description}</p>
  </article>;
}

export function PortfolioHome({ data, interactive = true }) {
  return <main className="portfolio-home" id="main-content" tabIndex={-1}>
    <section className="home-profile" aria-labelledby="home-title">
      <img className="home-portrait" src={PORTFOLIO_PORTRAIT} alt="" width="48" height="48" fetchPriority="high"/>
      <div><h1 id="home-title">Insan Nurjaman</h1><p className="home-role">Product Designer &amp; Builder</p></div>
      <p>I’m Insan. With 7+ years of experience, I turn complex problems into usable, scalable, and measurable product experiences across SaaS, CRM, e-commerce, trading platforms, design systems, and developer tools.</p>
      <div className="home-profile-actions">
        <a href={`mailto:${CONTACT_EMAIL}`} className="home-email">Email Me <img src={`${art}/outward.svg`} alt=""/></a>
        <a href={data?.linkedin || PORTFOLIO_LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn <img src={`${art}/outward.svg`} alt=""/></a>
      </div>
    </section>
    <GitHubContributions interactive={interactive}/>
    <CompanyLogos/>
    <section className="home-project-section" id="selected-work" aria-labelledby="selected-work-title">
      <span id="work" aria-hidden="true"/>
      <header><h2 id="selected-work-title">Selected Work</h2><p>A snapshot of product outcomes across mobile discovery, onboarding, and verification workflows.</p></header>
      <div className="home-card-grid">{work.map(project => <HomeCard key={project.path} project={project} selected/>)}</div>
      <p className="home-impact-note" id="selected-impact">Results are reported in my resume and project notes. The linked case studies document the evidence and its limits.</p>
    </section>
    <section className="home-project-section home-shipped" id="shipped-projects" aria-labelledby="shipped-projects-title">
      <header>
        <h2 id="shipped-projects-title">Shipped Products</h2>
        <p>Beyond design, I build and launch my own products. Here are a few you can use today.</p>
      </header>
      <div className="home-card-grid">{projects.map(project => <HomeCard key={project.path} project={project}/>)}</div>
      <a className="home-spotlight" id="antiflex-ui-highlight" aria-label="Explore antiflex/ui" href={ANTIFLEX_UI.website} target="_blank" rel="noopener noreferrer">
        <span id="chamfer-ui-highlight" aria-hidden="true"/>
        <HomeCover image={ANTIFLEX_UI_THUMBNAIL}/>
      </a>
    </section>
    <HomeExperience interactive={interactive}/>
    <Recommendations compact interactive={interactive}/>
  </main>;
}
