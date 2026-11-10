import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { ExperienceSection, EXPERIENCE_SOURCE } from "./experience";
import { CONTACT_EMAIL, HIRING_AVAILABILITY } from "./hiring-content.js";
import { AboutPortrait } from "./about-portrait";
import { CASE_PREVIEWS } from "./case-illustrations.js";
import { SYSTEM_DOCS } from "./system-docs-data.js";
import "./about.css";

export const aboutSearchPage = {
  path: "/about", title: "About | Insan Nurjaman",
  body: ["Product designer. Systems thinker and builder. Product strategy, research, interaction, design systems and career history."],
  images: [],
};

function OutwardIcon() { return <ArrowUpRight size={18} aria-hidden="true"/>; }

function ProfileDetails() {
  return <section className="about-profile" aria-label="At a glance"><dl className="about-facts"><div><dt>Role</dt><dd>Product Designer</dd></div><div><dt>Focus</dt><dd>Product UX, systems & tools</dd></div></dl><div className="about-email-actions"><a href="https://www.linkedin.com/in/insannurjaman/" target="_blank" rel="noopener noreferrer">Connect on LinkedIn <OutwardIcon/></a></div></section>;
}

export function AboutPage({ data }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "About Insan Nurjaman | Product Designer";
    return () => { document.title = previousTitle; };
  }, []);

  return <main id="main-content" className="about-page">
    <section className="about-hero" aria-labelledby="about-title">
      <AboutPortrait original={{ src: "/media/about/photo-reveal-30c6aeeb-1600.jpg", srcSet: "/media/about/photo-reveal-30c6aeeb-800.jpg 800w, /media/about/photo-reveal-30c6aeeb-1600.jpg 1600w" }}/>
      <div className="about-introduction">
        <h1 id="about-title">Hi, I’m Insan.</h1>
        <p className="about-role">Product designer.<br/>Systems thinker. Builder.</p>
        <div className="about-biography">
          <p>I turn complex product problems into clear, useful experiences.</p>
          <p>My work spans consumer apps, government services, developer tools, and AI experiences.</p>
        </div>
        <div className="about-actions">
          <a className="about-primary" href={`mailto:${CONTACT_EMAIL}`}>Email me <OutwardIcon/></a>
          <a className="about-text-link" href={data.resume} target="_blank" rel="noopener noreferrer">View resume <OutwardIcon/></a>
        </div>
        <p className="about-availability">{HIRING_AVAILABILITY}</p>
        <dl className="about-numbers" aria-label="Design experience in numbers">
          <div><dt>Years of experience</dt><dd>7+</dd></div>
          <div><dt>Industries</dt><dd>10+</dd></div>
          <div><dt>Public case studies</dt><dd><Link to="/work">{Object.keys(CASE_PREVIEWS).length}</Link></dd></div>
          <div><dt>Documentation libraries</dt><dd><Link to="/design-systems">{Object.keys(SYSTEM_DOCS).length}</Link></dd></div>
        </dl>
      </div>
    </section>

    <ProfileDetails/>

    <section className="about-practice" id="practice" aria-labelledby="about-practice-title">
      <h2 id="about-practice-title">How I work</h2>
      <div>
        <h3>From problem to product</h3>
        <p>Research, journeys, interaction, and interface design. I connect product thinking with the details people see and use.</p>
        <Link className="about-text-link" to="/work">Explore selected work <OutwardIcon/></Link>
      </div>
      <div>
        <h3>Beyond the handoff</h3>
        <p>Design systems, prototypes, and tools that help teams build. I also create tools for designers and developers.</p>
        <Link className="about-text-link" to="/design-systems">Explore design systems <OutwardIcon/></Link>
        <Link className="about-text-link" to="/side-projects">Explore side projects <OutwardIcon/></Link>
      </div>
    </section>

    <ExperienceSection resume={data.resume}/>
  </main>;
}

export function AboutFooter({ data }) {
  return <footer className="about-footer">
    <div className="about-contact"><p>Have something in mind?</p><a className="about-text-link" href={`mailto:${CONTACT_EMAIL}`}>Email me <OutwardIcon/></a></div>
    <div className="about-footer-bottom"><span>Insan Nurjaman · © 2026</span>
      <nav aria-label="About page contact links"><a href={data.linkedin || EXPERIENCE_SOURCE} target="_blank" rel="noopener noreferrer">LinkedIn <OutwardIcon/></a><a href={data.resume} target="_blank" rel="noopener noreferrer">Resume <OutwardIcon/></a><Link to="/work">Work <OutwardIcon/></Link></nav>
    </div>
  </footer>;
}
