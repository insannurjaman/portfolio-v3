import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { FEATURED_WORK, HIRING_AVAILABILITY, CONTACT_EMAIL } from "../src/hiring-content.js";
import { pageMetadata } from "../src/seo.js";
import { funnelEvent, sanitizeFunnelEvent } from "../src/funnel-events.js";
import { BUSINESS_METRIC_EVIDENCE } from "../src/case-study-reading.js";

test("Home adds Selected Impact after Hero while preserving the curated work and recommendations", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { EditorialHome } = await server.ssrLoadModule("/src/editorial-home.jsx");
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(EditorialHome, { data: { resume: "https://drive.google.com/resume" } })));
    const sections = [...html.matchAll(/<section\b[^>]*>/g)].map(match => match[0]);
    assert.match(sections[0], /editorial-hero/);
    assert.match(html, /id="home-title"/);
    assert.match(html, /<p class="hero-description">/);
    assert.match(html, /class="hero-actions"/);
    assert.match(html, /class="editorial-hero-art"/);
    assert.doesNotMatch(html, /data-scroll-generation|data-hero-text-reveal|data-thumbnail-generation/);
    assert.match(sections[1], /id="selected-impact"/);
    assert.match(sections[2], /id="selected-work"/);
    assert.match(sections[3], /antiflex-spotlight/);
    assert.equal(sections.length, 6);
    assert.doesNotMatch(html, /editorial-impact|editorial-category-grid|engineering-evidence|editorial-ai|editorial-film/);
    assert.equal((html.match(/class="featured-work-card"/g) || []).length, 3);
    assert.match(html, /7\+ years/);
    assert.match(html, /class="hero-role"/);
    assert.ok(html.indexOf('Senior Product Designer') < html.indexOf('id="home-title"'));
    assert.match(html, /SaaS &amp; Developer Tools/);
    assert.match(html, /Designing products<br\/>that scale and create<br\/>real impact/);
    assert.match(html, /usable, scalable, and measurable product experiences/);
    assert.match(html, /SaaS, CRM, e-commerce, trading platforms, design systems, and developer tools/);
    assert.match(html, /aria-label="Specialties"/);
    assert.match(html, /<li>Enterprise SaaS<\/li><li>Design Systems<\/li><li>UX Engineering<\/li>/);
    assert.match(html, /View Selected Work/);
    assert.match(html, /href="\/#selected-work"/);
    assert.match(html, /mailto:hello.insanz@gmail.com/);
    assert.ok(html.includes(HIRING_AVAILABILITY));
    assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 3);
    assert.equal((html.match(/>Preview product<\/button>/g) || []).length, 3);
    assert.equal((html.match(/<dt>What I Delivered<\/dt>/g) || []).length, 3);
    assert.doesNotMatch(html, /<dt>Outcome<\/dt>|Explore Component documentation/);
    assert.match(html, /Explore antiflex\/ui/);
    assert.doesNotMatch(html, /featured-reveal-control|featured-ui-layer|Reveal UI|Hover to reveal the original UI/);
    assert.equal((html.match(/class="featured-work-image"/g) || []).length, 3);
    assert.ok(!html.includes("+1,296%")); // HaloDish acquisition is not one of these four results.
    assert.doesNotMatch(html, /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<button/);
    assert.doesNotMatch(html, /expertise-collage|type-composition-line/);
    assert.equal((html.match(/class="recommendation-entry"/g) || []).length, 8);
  } finally { await server.close(); }
});

test("featured projects preserve source evidence and personal scope without fabricated uplift", () => {
  assert.deepEqual(FEATURED_WORK.map(item => item.path), ["/ags-pricing-calculator", "/loyica-client-portal", "/accelbyte-design-system"]);
  for (const item of FEATURED_WORK) {
    assert.ok(item.company && item.problem && item.contribution && item.deliverables);
    assert.ok(readFileSync(new URL(`../public${item.image}`, import.meta.url)).length);
    for (const screen of item.previews) {
      const bytes = readFileSync(new URL(`../public${screen.src}`, import.meta.url));
      assert.equal(bytes.subarray(1,4).toString(), "PNG");
      assert.equal(bytes.readUInt32BE(16), screen.width);
      assert.equal(bytes.readUInt32BE(20), screen.height);
      assert.ok(screen.label && screen.alt);
    }
  }
  assert.equal(FEATURED_WORK[1].company, "Saphyte");
  for (const item of Object.values(BUSINESS_METRIC_EVIDENCE)) assert.ok(item.period && item.contribution && item.evidence);
});

test("About exposes owner-confirmed hiring availability and direct email contact", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { AboutPage } = await server.ssrLoadModule("/src/about.jsx");
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(AboutPage, { data: { resume: "https://drive.google.com/resume" } })));
    assert.ok(html.includes(HIRING_AVAILABILITY));
    assert.ok(html.includes(`class="about-primary" href="mailto:${CONTACT_EMAIL}"`));
    assert.doesNotMatch(html, /LOYICA/);
  } finally { await server.close(); }
});

test("UIQA and document routes have accurate independent canonical and social metadata", () => {
  const meta = pageMetadata("/uiqa", { "/uiqa": { title: "Game Store & Admin Portal" } });
  assert.match(meta.title, /UIQA/);
  assert.doesNotMatch(meta.title, /Game Store/);
  assert.match(meta.description, /CLI and GitHub Action/);
  assert.equal(meta.canonical, "https://insanbuilds.vercel.app/uiqa");
  assert.match(meta.image, /^https:\/\/insanbuilds\.vercel\.app\//);
  assert.match(pageMetadata("/design-systems/accelbyte/components/button").title, /AccelByte Button/);
  assert.equal(pageMetadata("/design-systems/accelbyte").canonical, "https://insanbuilds.vercel.app/design-systems/accelbyte/foundations");
});

test("funnel payloads allow only fixed stages and destinations and never retain contact data", () => {
  assert.equal(funnelEvent("private", "/"), null);
  const payload = funnelEvent("resume_click", "/?email=private", "https://drive.google.com/private");
  assert.deepEqual(payload.properties, { stage: "resume_click", source: "other", destination: "other" });
  assert.equal(sanitizeFunnelEvent({ type: "pageview", url: "https://insanlab.vercel.app/" }), null);
  const safe = sanitizeFunnelEvent({ type: "event", url: "https://user:secret@insanlab.vercel.app/?email=private#note" });
  assert.equal(safe.url, "https://insanlab.vercel.app/");
  assert.equal(sanitizeFunnelEvent({ type: "event", url: "javascript:private" }), null);
  assert.equal(funnelEvent("contact_click", 4), null);
});

test("the shared footer provides direct email alongside an explicit LinkedIn destination", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { EditorialFooter } = await server.ssrLoadModule("/src/editorial-shell.jsx");
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(EditorialFooter)));
    assert.match(html, /class="footer-contact-actions"/);
    assert.ok(html.includes(`href="mailto:${CONTACT_EMAIL}"`));
    assert.match(html, /class="footer-linkedin" href="https:\/\/www.linkedin.com\/in\/insannurjaman\/"/);
    assert.match(html, />Email Me</);
  } finally { await server.close(); }
});
